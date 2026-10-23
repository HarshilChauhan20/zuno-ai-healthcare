// import type { Request, Response } from "express";
// import { getHealthGuidance } from "../services/ai.service";

// export async function chatWithZuno(
//   req: Request,
//   res: Response
// ): Promise<void> {
//   try {
//     const { message } = req.body as { message?: unknown };

//     // Validate input
//     if (typeof message !== "string" || !message.trim()) {
//       res.status(400).json({
//         success: false,
//         message: "Please provide a valid message.",
//       });
//       return;
//     }

//     const trimmedMessage = message.trim();

//     if (trimmedMessage.length > 4000) {
//       res.status(400).json({
//         success: false,
//         message: "Message must be 4000 characters or fewer.",
//       });
//       return;
//     }

//     // Generate AI response
//     const reply = await getHealthGuidance(trimmedMessage);

//     res.status(200).json({
//       success: true,
//       reply,
//     });
//   } catch (error: unknown) {
//     console.error("Zuno AI error:", error);

//     const status =
//       typeof error === "object" &&
//       error !== null &&
//       "status" in error &&
//       typeof error.status === "number"
//         ? error.status
//         : 500;

//     // Handle temporary provider errors
//     if (status === 503) {
//       res.status(503).json({
//         success: false,
//         message:
//           "Gemini AI is temporarily busy. Please try again shortly.",
//       });
//       return;
//     }

//     if (status === 429) {
//       res.status(429).json({
//         success: false,
//         message:
//           "AI service rate limit reached. Please wait before trying again.",
//       });
//       return;
//     }

//     if (status === 401 || status === 403) {
//       res.status(502).json({
//         success: false,
//         message:
//           "Gemini authentication or access failed. Check the backend API key and permissions.",
//       });
//       return;
//     }

//     if (status === 404) {
//       res.status(502).json({
//         success: false,
//         message:
//           "The configured Gemini model is unavailable. Check the model name and API access.",
//       });
//       return;
//     }

//     res.status(500).json({
//       success: false,
//       message: "Unable to generate a response right now.",
//     });
//   }
// }



import type { Request, Response } from "express";
import { getHealthGuidance } from "../services/ai.service.js";

function detectPossibleEmergency(message: string): boolean {
  const text = message.toLowerCase();

  const emergencyPatterns = [
    /\bsevere chest pain\b/,
    /\b(chest pain|chest pressure).{0,50}(difficulty breathing|shortness of breath|sweating|fainting)\b/,
    /\b(difficulty breathing|trouble breathing|shortness of breath|can't breathe|cannot breathe|unable to breathe)\b/,
    /\b(face drooping|sudden weakness|sudden numbness|slurred speech|signs of stroke)\b/,
    /\b(unconscious|not waking up|unresponsive)\b/,
    /\b(uncontrolled bleeding|severe bleeding|bleeding won't stop)\b/,
    /\b(overdose|poisoning|poisoned)\b/,
    /\b(seizure lasting|repeated seizures|first seizure)\b/,
  ];

  return emergencyPatterns.some((pattern) => pattern.test(text));
}

export async function chatWithZuno(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { message } = req.body as { message?: unknown };

    if (typeof message !== "string" || !message.trim()) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid message.",
      });
      return;
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length > 4000) {
      res.status(400).json({
        success: false,
        message: "Message must be 4000 characters or fewer.",
      });
      return;
    }

    // Basic safety check before sending the message to Gemini.
    if (detectPossibleEmergency(trimmedMessage)) {
      res.status(200).json({
        success: true,
        reply:
          "⚠️ URGENT MEDICAL WARNING\n\n" +
          "Your message may describe a medical emergency. " +
          "Please contact your local emergency service or go to the nearest emergency department now. " +
          "Do not wait for an AI response or rely on this chat to assess the danger. " +
          "If possible, ask someone nearby to help you.\n\n" +
          "If you are in India, you can call 112 for emergency assistance.",
      });
      return;
    }

    const reply = await getHealthGuidance(trimmedMessage);

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error: unknown) {
    console.error("Zuno AI error:", error);

    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 500;

    if (status === 503) {
      res.status(503).json({
        success: false,
        message:
          "Gemini AI is temporarily busy. Please try again shortly.",
      });
      return;
    }

    if (status === 429) {
      res.status(429).json({
        success: false,
        message:
          "AI service rate limit reached. Please wait before trying again.",
      });
      return;
    }

    if (status === 401 || status === 403) {
      res.status(502).json({
        success: false,
        message:
          "Gemini authentication or access failed. Check the backend API key and permissions.",
      });
      return;
    }

    if (status === 404) {
      res.status(502).json({
        success: false,
        message:
          "The configured Gemini model is unavailable. Check the model name and API access.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to generate a response right now.",
    });
  }
}
