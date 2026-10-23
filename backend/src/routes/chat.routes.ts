
import { Router, type Request, type Response } from "express";
import { randomUUID } from "node:crypto";
// import { pool } from "../config/db";
// import { getHealthGuidance } from "../services/ai.service";
import { pool } from "../config/db.js";
import { getHealthGuidance } from "../services/ai.service.js";


const router = Router();

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getSessionId(req: Request): string | null {
  const value = req.header("x-zuno-session-id");
  return value && UUID_REGEX.test(value) ? value : null;
}

function requireSession(req: Request, res: Response): string | null {
  const sessionId = getSessionId(req);

  if (!sessionId) {
    res.status(400).json({
      success: false,
      message: "A valid Zuno session ID is required.",
    });
    return null;
  }

  return sessionId;
}

// Create a new conversation.
router.post("/conversations", async (req, res) => {
  const sessionId = requireSession(req, res);
  if (!sessionId) return;

  try {
    const id = randomUUID();
    const title =
      typeof req.body?.title === "string"
        ? req.body.title.trim().slice(0, 200) || "New conversation"
        : "New conversation";

    const result = await pool.query(
      `INSERT INTO conversations (id, session_id, title)
       VALUES ($1, $2, $3)
       RETURNING id, title, created_at, updated_at`,
      [id, sessionId, title]
    );

    res.status(201).json({
      success: true,
      conversation: result.rows[0],
    });
  } catch (error) {
    console.error("Create conversation failed:", error);
    res.status(500).json({
      success: false,
      message: "Could not create a conversation.",
    });
  }
});

// List conversations belonging to this browser session.
router.get("/conversations", async (req, res) => {
  const sessionId = requireSession(req, res);
  if (!sessionId) return;

  try {
    const result = await pool.query(
      `SELECT c.id, c.title, c.created_at, c.updated_at,
              COUNT(m.id)::int AS message_count
       FROM conversations c
       LEFT JOIN chat_messages m ON m.conversation_id = c.id
       WHERE c.session_id = $1
       GROUP BY c.id
       ORDER BY c.updated_at DESC
       LIMIT 100`,
      [sessionId]
    );

    res.json({ success: true, conversations: result.rows });
  } catch (error) {
    console.error("List conversations failed:", error);
    res.status(500).json({
      success: false,
      message: "Could not load chat history.",
    });
  }
});

// Load messages from one conversation.
router.get("/conversations/:id/messages", async (req, res) => {
  const sessionId = requireSession(req, res);
  if (!sessionId) return;

  const conversationId = String(req.params.id);

  if (!UUID_REGEX.test(conversationId)) {
    res.status(400).json({
      success: false,
      message: "Invalid conversation ID.",
    });
    return;
  }

  try {
    const conversation = await pool.query(
      `SELECT id, title, created_at, updated_at
       FROM conversations
       WHERE id = $1 AND session_id = $2`,
      [conversationId, sessionId]
    );

    if (conversation.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
      return;
    }

    const messages = await pool.query(
      `SELECT id, role, content, created_at
       FROM chat_messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC, id ASC`,
      [conversationId]
    );

    res.json({
      success: true,
      conversation: conversation.rows[0],
      messages: messages.rows,
    });
  } catch (error) {
    console.error("Load messages failed:", error);
    res.status(500).json({
      success: false,
      message: "Could not load conversation messages.",
    });
  }
});

// Send a message, generate a reply, and persist both messages.
router.post("/conversations/:id/messages", async (req, res) => {
  const sessionId = requireSession(req, res);
  if (!sessionId) return;

  const conversationId = String(req.params.id);
  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!UUID_REGEX.test(conversationId)) {
    res.status(400).json({
      success: false,
      message: "Invalid conversation ID.",
    });
    return;
  }

  if (!message || message.length > 4000) {
    res.status(400).json({
      success: false,
      message: "Message must contain 1–4000 characters.",
    });
    return;
  }

  try {
    const conversation = await pool.query(
      `SELECT id, title FROM conversations
       WHERE id = $1 AND session_id = $2`,
      [conversationId, sessionId]
    );

    if (conversation.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
      return;
    }

    // Use the existing Zuno AI service.
    const reply = await getHealthGuidance(message);

    if (!reply?.trim()) {
      throw new Error("Zuno returned an empty response.");
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Re-check ownership and lock the conversation before saving.
      const locked = await client.query(
        `SELECT id FROM conversations
         WHERE id = $1 AND session_id = $2
         FOR UPDATE`,
        [conversationId, sessionId]
      );

      if (locked.rowCount === 0) {
        await client.query("ROLLBACK");
        res.status(404).json({
          success: false,
          message: "Conversation not found.",
        });
        return;
      }

      const userMessage = await client.query(
        `INSERT INTO chat_messages (conversation_id, role, content)
         VALUES ($1, 'user', $2)
         RETURNING id, role, content, created_at`,
        [conversationId, message]
      );

      const assistantMessage = await client.query(
        `INSERT INTO chat_messages (conversation_id, role, content)
         VALUES ($1, 'assistant', $2)
         RETURNING id, role, content, created_at`,
        [conversationId, reply]
      );

      const existingMessages = await client.query(
        `SELECT COUNT(*)::int AS count
         FROM chat_messages
         WHERE conversation_id = $1`,
        [conversationId]
      );

      // Use the first user message as the default title.
      if (existingMessages.rows[0].count === 2) {
        await client.query(
          `UPDATE conversations
           SET title = $1, updated_at = NOW()
           WHERE id = $2`,
          [message.slice(0, 60), conversationId]
        );
      } else {
        await client.query(
          `UPDATE conversations
           SET updated_at = NOW()
           WHERE id = $1`,
          [conversationId]
        );
      }

      await client.query("COMMIT");

      res.json({
        success: true,
        userMessage: userMessage.rows[0],
        assistantMessage: assistantMessage.rows[0],
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Save chat message failed:", error);
    res.status(500).json({
      success: false,
      message: "Could not save the message. Please try again.",
    });
  }
});

// Delete a conversation and its messages.
router.delete("/conversations/:id", async (req, res) => {
  const sessionId = requireSession(req, res);
  if (!sessionId) return;

  const conversationId = String(req.params.id);

  if (!UUID_REGEX.test(conversationId)) {
    res.status(400).json({
      success: false,
      message: "Invalid conversation ID.",
    });
    return;
  }

  try {
    const result = await pool.query(
      `DELETE FROM conversations
       WHERE id = $1 AND session_id = $2
       RETURNING id`,
      [conversationId, sessionId]
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
      return;
    }

    res.json({ success: true, message: "Conversation deleted." });
  } catch (error) {
    console.error("Delete conversation failed:", error);
    res.status(500).json({
      success: false,
      message: "Could not delete the conversation.",
    });
  }
});

export default router;
