
import { Router } from "express";
import multer from "multer";
import {
  analyzeDocument,
  getSavedDocuments,
  getSavedDocument,
  downloadSavedDocument,
  removeSavedDocument,
} from "../controllers/document.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Unsupported file type."));
    }
  },
});

// Keep upload errors as JSON responses.
router.post("/analyze", (req, res, next) => {
  upload.single("document")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof multer.MulterError &&
          error.code === "LIMIT_FILE_SIZE"
            ? "File size must be 10 MB or less."
            : error.message || "Unable to upload this file.",
      });
    }

    next();
  });
}, analyzeDocument);

router.get("/", getSavedDocuments);
router.get("/:id/file", downloadSavedDocument);
router.get("/:id", getSavedDocument);
router.delete("/:id", removeSavedDocument);

export default router;
