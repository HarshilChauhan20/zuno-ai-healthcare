
// import type { Request, Response } from "express";
// import { randomUUID } from "node:crypto";
// import { analyzeMedicalDocument } from "../services/document.service";
// import {
//   saveMedicalDocument,
//   listMedicalDocuments,
//   getMedicalDocument,
//   readMedicalDocumentFile,
//   deleteMedicalDocument,
// } from "../services/medicalDocumentPersistence.service";

// const UUID_PATTERN =
//   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// function getDemoOwnerId(req: Request): string | null {
//   const value = req.header("x-zuno-session-id");
//   return value && UUID_PATTERN.test(value) ? value : null;
// }

// function requireDemoOwner(req: Request, res: Response): string | null {
//   const ownerId = getDemoOwnerId(req);

//   if (!ownerId) {
//     res.status(401).json({
//       success: false,
//       message: "A valid Zuno demo session is required.",
//     });
//     return null;
//   }

//   return ownerId;
// }

// function validDocumentId(id: string): boolean {
//   return UUID_PATTERN.test(id);
// }

// export async function analyzeDocument(req: Request, res: Response) {
//   const ownerId = requireDemoOwner(req, res);
//   if (!ownerId) return;

//   try {
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         message: "Please select a PDF or image to analyze.",
//       });
//     }

//     const allowedTypes = [
//       "application/pdf",
//       "image/png",
//       "image/jpeg",
//       "image/webp",
//     ];

//     if (!allowedTypes.includes(file.mimetype)) {
//       return res.status(415).json({
//         success: false,
//         message: "Only PDF, PNG, JPEG, and WebP files are supported.",
//       });
//     }

//     // Analyze first. Persist only if analysis succeeds.
//     const analysis = await analyzeMedicalDocument(
//       file.buffer,
//       file.mimetype
//     );

//     const savedDocument = await saveMedicalDocument({
//       ownerId,
//       originalName: file.originalname,
//       mimeType: file.mimetype,
//       buffer: file.buffer,
//       analysis,
//     });

//     return res.status(201).json({
//       success: true,
//       fileName: savedDocument.original_name,
//       document: savedDocument,
//       analysis: savedDocument.analysis,
//       disclaimer:
//         "AI-generated educational explanation only. It is not a diagnosis or a substitute for professional medical advice.",
//     });
//   } catch (error) {
//     console.error(
//       "Document analysis/persistence error:",
//       error instanceof Error ? error.message : "Unknown error"
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Unable to analyze and save this document right now. Please try again.",
//     });
//   }
// }

// export async function getSavedDocuments(req: Request, res: Response) {
//   const ownerId = requireDemoOwner(req, res);
//   if (!ownerId) return;

//   try {
//     const documents = await listMedicalDocuments(ownerId);
//     return res.json({ success: true, documents });
//   } catch (error) {
//     console.error("List documents error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Unable to load saved documents.",
//     });
//   }
// }

// export async function getSavedDocument(req: Request, res: Response) {
//   const ownerId = requireDemoOwner(req, res);
//   if (!ownerId) return;

//   if (!validDocumentId(req.params.id)) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid document ID.",
//     });
//   }

//   try {
//     const document = await getMedicalDocument(ownerId, req.params.id);

//     if (!document) {
//       return res.status(404).json({
//         success: false,
//         message: "Document not found.",
//       });
//     }

//     return res.json({ success: true, document });
//   } catch (error) {
//     console.error("Get document error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Unable to load this document.",
//     });
//   }
// }

// export async function downloadSavedDocument(req: Request, res: Response) {
//   const ownerId = requireDemoOwner(req, res);
//   if (!ownerId) return;

//   if (!validDocumentId(req.params.id)) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid document ID.",
//     });
//   }

//   try {
//     const result = await readMedicalDocumentFile(ownerId, req.params.id);

//     if (!result) {
//       return res.status(404).json({
//         success: false,
//         message: "Document not found.",
//       });
//     }

//     const { document, buffer } = result;
//     const safeName = document.original_name.replace(/["\r\n]/g, "_");

//     res.setHeader("Content-Type", document.mime_type);
//     res.setHeader("Content-Length", buffer.length);
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${safeName}"`
//     );
//     res.setHeader("Cache-Control", "no-store");
//     res.setHeader("X-Content-Type-Options", "nosniff");

//     return res.send(buffer);
//   } catch (error) {
//     console.error("Download document error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Unable to retrieve this file. It may be missing from storage.",
//     });
//   }
// }

// export async function removeSavedDocument(req: Request, res: Response) {
//   const ownerId = requireDemoOwner(req, res);
//   if (!ownerId) return;

//   if (!validDocumentId(req.params.id)) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid document ID.",
//     });
//   }

//   try {
//     const deleted = await deleteMedicalDocument(ownerId, req.params.id);

//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Document not found.",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "Saved document deleted.",
//     });
//   } catch (error) {
//     console.error("Delete document error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Unable to delete this document right now.",
//     });
//   }
// }



import type { Request, Response } from "express";
import { analyzeMedicalDocument } from "../services/document.service.js";
// import {
//   saveMedicalDocument,
//   listMedicalDocuments,
//   getMedicalDocument,
//   readMedicalDocumentFile,
//   deleteMedicalDocument,
// } from "../services/medicalDocumentPersistence.service";
import {
  saveMedicalDocument,
  listMedicalDocuments,
  getMedicalDocument,
  readMedicalDocumentFile,
  deleteMedicalDocument,
} from "../services/medicalDocumentPersistence.service.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// DEMO ONLY: This header is not authentication.
function getDemoOwnerId(req: Request): string | null {
  const sessionId = req.header("x-zuno-session-id");

  if (!sessionId || !UUID_PATTERN.test(sessionId)) {
    return null;
  }

  return sessionId;
}

function requireDemoOwner(
  req: Request,
  res: Response
): string | null {
  const ownerId = getDemoOwnerId(req);

  if (!ownerId) {
    res.status(401).json({
      success: false,
      message: "A valid Zuno demo session is required.",
    });
    return null;
  }

  return ownerId;
}

function isValidDocumentId(id: unknown): id is string {
  return typeof id === "string" && UUID_PATTERN.test(id);
}

function getDocumentId(
  req: Request,
  res: Response
): string | null {
  const id: unknown = req.params.id;

  if (!isValidDocumentId(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid document ID.",
    });
    return null;
  }

  return id;
}

// POST /api/documents/analyze
export async function analyzeDocument(
  req: Request,
  res: Response
): Promise<void> {
  const ownerId = requireDemoOwner(req, res);
  if (!ownerId) return;

  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        message: "Please select a PDF or image to analyze.",
      });
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      res.status(415).json({
        success: false,
        message: "Only PDF, PNG, JPEG, and WebP files are supported.",
      });
      return;
    }

    // Analyze first, then save the file and its analysis.
    const analysis = await analyzeMedicalDocument(
      file.buffer,
      file.mimetype
    );

    const savedDocument = await saveMedicalDocument({
      ownerId,
      originalName: file.originalname,
      mimeType: file.mimetype,
      buffer: file.buffer,
      analysis,
    });

    res.status(201).json({
      success: true,
      fileName: savedDocument.original_name,
      document: savedDocument,
      analysis: savedDocument.analysis,
      disclaimer:
        "AI-generated educational explanation only. It is not a diagnosis or a substitute for professional medical advice.",
    });
  } catch (error) {
    console.error(
      "Document analysis/persistence error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to analyze and save this document right now. Please try again.",
    });
  }
}

// GET /api/documents
export async function getSavedDocuments(
  req: Request,
  res: Response
): Promise<void> {
  const ownerId = requireDemoOwner(req, res);
  if (!ownerId) return;

  try {
    const documents = await listMedicalDocuments(ownerId);
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error("List documents error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load saved documents.",
    });
  }
}

// GET /api/documents/:id
export async function getSavedDocument(
  req: Request,
  res: Response
): Promise<void> {
  const ownerId = requireDemoOwner(req, res);
  if (!ownerId) return;

  const documentId = getDocumentId(req, res);
  if (!documentId) return;

  try {
    const document = await getMedicalDocument(ownerId, documentId);

    if (!document) {
      res.status(404).json({
        success: false,
        message: "Document not found.",
      });
      return;
    }

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ success: true, document });
  } catch (error) {
    console.error("Get document error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load this document.",
    });
  }
}

// GET /api/documents/:id/file
export async function downloadSavedDocument(
  req: Request,
  res: Response
): Promise<void> {
  const ownerId = requireDemoOwner(req, res);
  if (!ownerId) return;

  const documentId = getDocumentId(req, res);
  if (!documentId) return;

  try {
    const result = await readMedicalDocumentFile(ownerId, documentId);

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Document not found.",
      });
      return;
    }

    const { document, buffer } = result;
    const safeName = document.original_name
      .replace(/[\r\n"]/g, "_")
      .slice(0, 255);

    res.setHeader("Content-Type", document.mime_type);
    res.setHeader("Content-Length", String(buffer.length));
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}"`
    );
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");

    res.status(200).send(buffer);
  } catch (error) {
    console.error(
      "Download document error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to retrieve this file. It may be missing from storage.",
    });
  }
}

// DELETE /api/documents/:id
export async function removeSavedDocument(
  req: Request,
  res: Response
): Promise<void> {
  const ownerId = requireDemoOwner(req, res);
  if (!ownerId) return;

  const documentId = getDocumentId(req, res);
  if (!documentId) return;

  try {
    const deleted = await deleteMedicalDocument(ownerId, documentId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Document not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Saved document deleted.",
    });
  } catch (error) {
    console.error(
      "Delete document error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    res.status(500).json({
      success: false,
      message: "Unable to delete this document right now.",
    });
  }
}
