
// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:5000";

// export interface ChatResponse {
//   success: boolean;
//   reply: string;
// }

// export interface DocumentAnalysisResponse {
//   success: boolean;
//   fileName: string;
//   analysis: string;
//   disclaimer: string;
// }

// export async function sendMessage(
//   message: string
// ): Promise<ChatResponse> {
//   let response: Response;

//   try {
//     response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ message }),
//       signal: AbortSignal.timeout(25000),
//     });
//   } catch (error) {
//     if (error instanceof Error && error.name === "TimeoutError") {
//       throw new Error("Zuno AI took too long to respond. Please try again.");
//     }

//     throw new Error(
//       "Cannot connect to Zuno backend. Check whether the server is running."
//     );
//   }

//   const data = await response.json().catch(() => ({}));

//   if (!response.ok) {
//     throw new Error(
//       data.message || `Chat request failed (${response.status}).`
//     );
//   }

//   if (typeof data.reply !== "string") {
//     throw new Error("Zuno received an unexpected AI response.");
//   }

//   return data as ChatResponse;
// }

// export async function analyzeDocument(
//   file: File
// ): Promise<DocumentAnalysisResponse> {
//   const formData = new FormData();
//   formData.append("document", file);

//   let response: Response;

//   try {
//     response = await fetch(`${API_BASE_URL}/api/documents/analyze`, {
//       method: "POST",
//       body: formData,
//       signal: AbortSignal.timeout(90000),
//     });
//   } catch {
//     throw new Error(
//       "Cannot connect to Zuno backend. Check whether the server is running."
//     );
//   }

//   const data = await response.json().catch(() => ({}));

//   if (!response.ok) {
//     throw new Error(
//       data.message || `Document analysis failed (${response.status}).`
//     );
//   }

//   return data as DocumentAnalysisResponse;
// }


// export interface Conversation {
//   id: string;
//   title: string;
//   created_at: string;
//   updated_at: string;
//   message_count?: number;
// }

// export interface SavedChatMessage {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
//   created_at: string;
// }

// export interface ConversationResponse {
//   success: boolean;
//   conversation: Conversation;
// }

// export interface ConversationsResponse {
//   success: boolean;
//   conversations: Conversation[];
// }

// export interface ConversationMessagesResponse {
//   success: boolean;
//   conversation: Conversation;
//   messages: SavedChatMessage[];
// }

// // Creates a stable browser-session identifier for the demo.
// // This is not authentication; don't treat it as a secure user identity.
// export function getZunoSessionId(): string {
//   const storageKey = "zuno_session_id";
//   const existing = localStorage.getItem(storageKey);

//   if (existing) return existing;

//   const sessionId = crypto.randomUUID();
//   localStorage.setItem(storageKey, sessionId);

//   return sessionId;
// }

// async function chatRequest<T>(
//   path: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   let response: Response;

//   try {
//     response = await fetch(`${API_BASE_URL}/api/chat${path}`, {
//       ...options,
//       headers: {
//         "Content-Type": "application/json",
//         "x-zuno-session-id": getZunoSessionId(),
//         ...options.headers,
//       },
//       signal: options.signal ?? AbortSignal.timeout(30000),
//     });
//   } catch (error) {
//     if (error instanceof Error && error.name === "TimeoutError") {
//       throw new Error("The request took too long. Please try again.");
//     }

//     throw new Error(
//       "Cannot connect to Zuno backend. Check whether the server is running."
//     );
//   }

//   const data = await response.json().catch(() => ({}));

//   if (!response.ok) {
//     throw new Error(
//       data.message || `Chat history request failed (${response.status}).`
//     );
//   }

//   return data as T;
// }

// export function createConversation(
//   title = "New conversation"
// ): Promise<ConversationResponse> {
//   return chatRequest<ConversationResponse>("/conversations", {
//     method: "POST",
//     body: JSON.stringify({ title }),
//   });
// }

// export function getConversations(): Promise<ConversationsResponse> {
//   return chatRequest<ConversationsResponse>("/conversations");
// }

// export function getConversationMessages(
//   conversationId: string
// ): Promise<ConversationMessagesResponse> {
//   return chatRequest<ConversationMessagesResponse>(
//     `/conversations/${encodeURIComponent(conversationId)}/messages`
//   );
// }

// export function sendMessageToConversation(
//   conversationId: string,
//   message: string
// ): Promise<{
//   success: boolean;
//   userMessage: SavedChatMessage;
//   assistantMessage: SavedChatMessage;
// }> {
//   return chatRequest(`/conversations/${encodeURIComponent(conversationId)}/messages`, {
//     method: "POST",
//     body: JSON.stringify({ message }),
//   });
// }

// export function deleteConversation(
//   conversationId: string
// ): Promise<{ success: boolean; message: string }> {
//   return chatRequest(
//     `/conversations/${encodeURIComponent(conversationId)}`,
//     { method: "DELETE" }
//   );
// }


// const DOCUMENT_API = "http://localhost:5000/api/documents";

// export async function analyzeDocument(file: File) {
//   const formData = new FormData();
//   formData.append("document", file);

//   const response = await fetch(`${DOCUMENT_API}/analyze`, {
//     method: "POST",
//     headers: {
//       "x-zuno-session-id": getZunoSessionId(),
//     },
//     body: formData,
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Unable to analyze document.");
//   }

//   return data;
// }

// export async function getSavedMedicalDocuments() {
//   const response = await fetch(DOCUMENT_API, {
//     headers: {
//       "x-zuno-session-id": getZunoSessionId(),
//     },
//     cache: "no-store",
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Unable to load saved documents.");
//   }

//   return data.documents;
// }

// export async function getSavedMedicalDocument(id: string) {
//   const response = await fetch(
//     `${DOCUMENT_API}/${encodeURIComponent(id)}`,
//     {
//       headers: {
//         "x-zuno-session-id": getZunoSessionId(),
//       },
//       cache: "no-store",
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Unable to load document.");
//   }

//   return data.document;
// }

// export async function downloadSavedMedicalDocument(id: string) {
//   const response = await fetch(
//     `${DOCUMENT_API}/${encodeURIComponent(id)}/file`,
//     {
//       headers: {
//         "x-zuno-session-id": getZunoSessionId(),
//       },
//       cache: "no-store",
//     }
//   );

//   if (!response.ok) {
//     const data = await response.json().catch(() => ({}));
//     throw new Error(data.message || "Unable to download document.");
//   }

//   return response.blob();
// }

// export async function deleteSavedMedicalDocument(id: string) {
//   const response = await fetch(
//     `${DOCUMENT_API}/${encodeURIComponent(id)}`,
//     {
//       method: "DELETE",
//       headers: {
//         "x-zuno-session-id": getZunoSessionId(),
//       },
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Unable to delete document.");
//   }

//   return data;
// }



// const API_BASE_URL = (
//   import.meta.env.VITE_API_URL || ""
// ).replace(/\/+$/, "");
const API_BASE_URL = import.meta.env.VITE_API_URL || "";
// -------------------- CHAT --------------------

export interface ChatResponse {
  success: boolean;
  reply: string;
}

// -------------------- DOCUMENTS --------------------

export interface SavedMedicalDocument {
  id: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  analysis: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentAnalysisResponse {
  success: boolean;
  fileName: string;
  document: SavedMedicalDocument;
  analysis: string;
  disclaimer: string;
}

interface SavedDocumentsResponse {
  success: boolean;
  documents: SavedMedicalDocument[];
}

interface SavedDocumentResponse {
  success: boolean;
  document: SavedMedicalDocument;
}

interface ApiMessageResponse {
  success: boolean;
  message: string;
}

// -------------------- SESSION --------------------

// Demo-only session identifier. This is NOT authentication.
export function getZunoSessionId(): string {
  const storageKey = "zuno_session_id";

  let existing: string | null = null;

  try {
    existing = localStorage.getItem(storageKey);
  } catch {
    // Storage can be unavailable in some browser contexts.
  }

  if (existing) return existing;

  const sessionId = crypto.randomUUID();

  try {
    localStorage.setItem(storageKey, sessionId);
  } catch {
    // The app can still use this ID for the current request,
    // but persistence across reloads may not work.
  }

  return sessionId;
}

// -------------------- SHARED REQUEST HELPERS --------------------

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed (${response.status}).`
    );
  }

  return data as T;
}

function getSessionHeaders(): Record<string, string> {
  return {
    "x-zuno-session-id": getZunoSessionId(),
  };
}

async function documentRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/documents${path}`, {
      ...options,
      headers: {
        ...getSessionHeaders(),
        ...(options.headers as Record<string, string> | undefined),
      },
      signal: options.signal ?? AbortSignal.timeout(90000),
      cache: options.cache ?? "no-store",
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error("The document request timed out. Please try again.");
    }

    throw new Error(
      "Cannot connect to Zuno backend. Check whether the server is running."
    );
  }

  return readJson<T>(response);
}

// -------------------- AI CHAT --------------------

export async function sendMessage(
  message: string
): Promise<ChatResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(25000),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error("Zuno AI took too long to respond. Please try again.");
    }

    throw new Error(
      "Cannot connect to Zuno backend. Check whether the server is running."
    );
  }

  const data = await readJson<ChatResponse>(response);

  if (typeof data.reply !== "string") {
    throw new Error("Zuno received an unexpected AI response.");
  }

  return data;
}

// -------------------- DOCUMENT ANALYSIS & PERSISTENCE --------------------

export async function analyzeDocument(
  file: File
): Promise<DocumentAnalysisResponse> {
  const formData = new FormData();
  formData.append("document", file);

  return documentRequest<DocumentAnalysisResponse>("/analyze", {
    method: "POST",
    body: formData,
    signal: AbortSignal.timeout(90000),
  });
}

export async function getSavedMedicalDocuments(): Promise<
  SavedMedicalDocument[]
> {
  const data =
    await documentRequest<SavedDocumentsResponse>("");

  return data.documents;
}

export async function getSavedMedicalDocument(
  id: string
): Promise<SavedMedicalDocument> {
  const data = await documentRequest<SavedDocumentResponse>(
    `/${encodeURIComponent(id)}`
  );

  return data.document;
}

export async function downloadSavedMedicalDocument(
  id: string
): Promise<Blob> {
  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}/api/documents/${encodeURIComponent(id)}/file`,
      {
        headers: getSessionHeaders(),
        signal: AbortSignal.timeout(30000),
        cache: "no-store",
      }
    );
  } catch {
    throw new Error(
      "Cannot connect to Zuno backend. Check whether the server is running."
    );
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.message || `Download failed (${response.status}).`
    );
  }

  return response.blob();
}

export async function deleteSavedMedicalDocument(
  id: string
): Promise<ApiMessageResponse> {
  return documentRequest<ApiMessageResponse>(
    `/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );
}

// -------------------- CHAT HISTORY --------------------

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

export interface SavedChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ConversationResponse {
  success: boolean;
  conversation: Conversation;
}

export interface ConversationsResponse {
  success: boolean;
  conversations: Conversation[];
}

export interface ConversationMessagesResponse {
  success: boolean;
  conversation: Conversation;
  messages: SavedChatMessage[];
}

async function chatRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/chat${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...getSessionHeaders(),
        ...(options.headers as Record<string, string> | undefined),
      },
      signal: options.signal ?? AbortSignal.timeout(30000),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error("The request took too long. Please try again.");
    }

    throw new Error(
      "Cannot connect to Zuno backend. Check whether the server is running."
    );
  }

  return readJson<T>(response);
}

export function createConversation(
  title = "New conversation"
): Promise<ConversationResponse> {
  return chatRequest<ConversationResponse>("/conversations", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function getConversations(): Promise<ConversationsResponse> {
  return chatRequest<ConversationsResponse>("/conversations");
}

export function getConversationMessages(
  conversationId: string
): Promise<ConversationMessagesResponse> {
  return chatRequest<ConversationMessagesResponse>(
    `/${encodeURIComponent(conversationId)}/messages`.replace(
      /^\/([^/]+)\/messages$/,
      "/conversations/$1/messages"
    )
  );
}

export function sendMessageToConversation(
  conversationId: string,
  message: string
): Promise<{
  success: boolean;
  userMessage: SavedChatMessage;
  assistantMessage: SavedChatMessage;
}> {
  return chatRequest(
    `/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ message }),
    }
  );
}

export function deleteConversation(
  conversationId: string
): Promise<{ success: boolean; message: string }> {
  return chatRequest(
    `/conversations/${encodeURIComponent(conversationId)}`,
    { method: "DELETE" }
  );
}
