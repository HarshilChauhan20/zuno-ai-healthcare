
import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
// import { pool } from "../config/db";
import { pool } from "../config/db.js";

const storageDirectory = path.resolve(
  process.cwd(),
  process.env.DOCUMENT_STORAGE_DIR || "./private-medical-documents"
);

const extensionByMimeType: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
};

export interface SavedMedicalDocument {
  id: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  analysis: string;
  created_at: string;
  updated_at: string;
}

interface StoredDocument extends SavedMedicalDocument {
  storage_key: string;
}

function getFilePath(storageKey: string, mimeType: string): string {
  const extension = extensionByMimeType[mimeType];

  if (!extension || !/^[0-9a-f-]{36}$/i.test(storageKey)) {
    throw new Error("Invalid document storage reference.");
  }

  return path.join(storageDirectory, `${storageKey}${extension}`);
}

export async function saveMedicalDocument(input: {
  ownerId: string;
  originalName: string;
  mimeType: string;
  buffer: Buffer;
  analysis: string;
}): Promise<SavedMedicalDocument> {
  const extension = extensionByMimeType[input.mimeType];

  if (!extension) {
    throw new Error("Unsupported document type.");
  }

  await mkdir(storageDirectory, { recursive: true });

  const storageKey = randomUUID();
  const filePath = getFilePath(storageKey, input.mimeType);

  // Store a safe display name; never use the supplied name as a disk path.
  const safeName =
    path.basename(input.originalName).replace(/[\u0000-\u001f]/g, "").slice(0, 255) ||
    `medical-document${extension}`;

  await writeFile(filePath, input.buffer, { flag: "wx", mode: 0o600 });

  try {
    const result = await pool.query<SavedMedicalDocument>(
      `INSERT INTO medical_documents
        (owner_id, original_name, mime_type, file_size, storage_key, analysis)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, original_name, mime_type, file_size,
                 analysis, created_at, updated_at`,
      [
        input.ownerId,
        safeName,
        input.mimeType,
        input.buffer.length,
        storageKey,
        input.analysis,
      ]
    );

    return result.rows[0];
  } catch (error) {
    await unlink(filePath).catch(() => undefined);
    throw error;
  }
}

export async function listMedicalDocuments(
  ownerId: string
): Promise<SavedMedicalDocument[]> {
  const result = await pool.query<SavedMedicalDocument>(
    `SELECT id, original_name, mime_type, file_size, analysis,
            created_at, updated_at
     FROM medical_documents
     WHERE owner_id = $1
     ORDER BY created_at DESC`,
    [ownerId]
  );

  return result.rows;
}

export async function getMedicalDocument(
  ownerId: string,
  documentId: string
): Promise<StoredDocument | null> {
  const result = await pool.query<StoredDocument>(
    `SELECT id, original_name, mime_type, file_size, analysis,
            created_at, updated_at, storage_key
     FROM medical_documents
     WHERE owner_id = $1 AND id = $2`,
    [ownerId, documentId]
  );

  return result.rows[0] ?? null;
}

export async function readMedicalDocumentFile(
  ownerId: string,
  documentId: string
): Promise<{ document: SavedMedicalDocument; buffer: Buffer } | null> {
  const record = await getMedicalDocument(ownerId, documentId);

  if (!record) return null;

  const filePath = getFilePath(record.storage_key, record.mime_type);
  const buffer = await readFile(filePath);

  const { storage_key: _storageKey, ...document } = record;
  return { document, buffer };
}

export async function deleteMedicalDocument(
  ownerId: string,
  documentId: string
): Promise<boolean> {
  const record = await getMedicalDocument(ownerId, documentId);

  if (!record) return false;

  // Delete the database row only after the private file was removed.
  const filePath = getFilePath(record.storage_key, record.mime_type);
  await unlink(filePath);

  await pool.query(
    "DELETE FROM medical_documents WHERE owner_id = $1 AND id = $2",
    [ownerId, documentId]
  );

  return true;
}
