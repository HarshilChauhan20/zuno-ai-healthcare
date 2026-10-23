// import { useEffect, useRef, useState } from "react";
// import type { FormEvent } from "react";
// import type { LucideIcon } from "lucide-react";
// import { Link } from "react-router-dom";
// import {
//   ArrowLeft,
//   Bot,
//   Send,
//   User,
//   Mic,
//   MicOff,
//   Volume2,
//   VolumeX,
//   LoaderCircle,
//   Trash2,
//   AlertCircle,
//   HeartPulse,
//   BookOpen,
//   ListChecks,
//   Stethoscope,
//   ShieldAlert,
// } from "lucide-react";
// import { sendMessage } from "../services/api";

// type ChatMessage = {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
// };

// type SpeechRecognitionResultEvent = Event & {
//   resultIndex: number;
//   results: {
//     [index: number]: {
//       [index: number]: { transcript: string };
//       isFinal: boolean;
//     };
//     length: number;
//   };
// };

// type SpeechRecognitionInstance = {
//   lang: string;
//   continuous: boolean;
//   interimResults: boolean;
//   onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
//   onerror: ((event: Event & { error?: string }) => void) | null;
//   onend: (() => void) | null;
//   start: () => void;
//   stop: () => void;
//   abort: () => void;
// };

// type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

// type SpeechWindow = Window & {
//   SpeechRecognition?: SpeechRecognitionConstructor;
//   webkitSpeechRecognition?: SpeechRecognitionConstructor;
// };

// type ResponseSection = {
//   title: string;
//   content: string;
//   icon: LucideIcon;
//   color: string;
//   borderColor: string;
// };

// const SECTION_CONFIG: Omit<ResponseSection, "content">[] = [
//   {
//     title: "Simple Explanation",
//     icon: BookOpen,
//     color: "text-cyan-300",
//     borderColor: "border-cyan-500/20",
//   },
//   {
//     title: "Recommended Next Steps",
//     icon: ListChecks,
//     color: "text-emerald-300",
//     borderColor: "border-emerald-500/20",
//   },
//   {
//     title: "Questions for Your Doctor",
//     icon: Stethoscope,
//     color: "text-violet-300",
//     borderColor: "border-violet-500/20",
//   },
//   {
//     title: "Safety Note",
//     icon: ShieldAlert,
//     color: "text-amber-300",
//     borderColor: "border-amber-500/20",
//   },
// ];

// function parseAssistantResponse(content: string): ResponseSection[] {
//   const headingPattern =
//     /^\s*#{1,3}\s*(Simple Explanation|Recommended Next Steps|Questions for Your Doctor|Safety Note)\s*:?\s*$/gim;

//   const matches = [...content.matchAll(headingPattern)];

//   if (matches.length === 0) {
//     return [];
//   }

//   return matches
//     .map((match, index) => {
//       const start = (match.index ?? 0) + match[0].length;
//       const end =
//         index + 1 < matches.length
//           ? (matches[index + 1].index ?? content.length)
//           : content.length;

//       const config = SECTION_CONFIG.find(
//         (section) => section.title === match[1].trim()
//       );

//       if (!config) return null;

//       return {
//         ...config,
//         content: content.slice(start, end).trim(),
//       };
//     })
//     .filter(
//       (section): section is ResponseSection =>
//         section !== null && section.content.length > 0
//     );
// }

// function ResponseContent({ content }: { content: string }) {
//   const sections = parseAssistantResponse(content);

//   if (sections.length === 0) {
//     return (
//       <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-200 sm:text-base">
//         {content}
//       </p>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       {sections.map((section) => {
//         const SectionIcon = section.icon;

//         return (
//           <section
//             key={section.title}
//             className={`overflow-hidden rounded-xl border ${section.borderColor} bg-slate-950/60`}
//           >
//             <div className="flex items-center gap-2 border-b border-slate-700/60 px-4 py-3">
//               <SectionIcon size={19} className={section.color} />
//               <h3 className={`text-sm font-semibold ${section.color}`}>
//                 {section.title}
//               </h3>
//             </div>

//             <div className="whitespace-pre-wrap break-words px-4 py-3 text-sm leading-7 text-slate-200">
//               {section.content}
//             </div>
//           </section>
//         );
//       })}
//     </div>
//   );
// }

// const WELCOME_MESSAGE =
//   "Hi! I'm Zuno, your AI health information assistant. You can type your question or use the microphone to speak. How can I help you today?";

// export default function HealthAssistant() {
//   const [messages, setMessages] = useState<ChatMessage[]>([
//     {
//       id: "welcome",
//       role: "assistant",
//       content: WELCOME_MESSAGE,
//     },
//   ]);

//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [listening, setListening] = useState(false);
//   const [speakingId, setSpeakingId] = useState<string | null>(null);
//   const [error, setError] = useState("");
//   const [voiceError, setVoiceError] = useState("");

//   const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLTextAreaElement>(null);
//   const listeningRef = useRef(false);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   useEffect(() => {
//     return () => {
//       listeningRef.current = false;
//       recognitionRef.current?.abort();

//       if ("speechSynthesis" in window) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, []);

//   function stopListening() {
//     listeningRef.current = false;

//     try {
//       recognitionRef.current?.stop();
//     } catch {
//       // Recognition may already have stopped.
//     }

//     setListening(false);
//   }

//   function toggleListening() {
//     setVoiceError("");
//     setError("");

//     if (listeningRef.current) {
//       stopListening();
//       return;
//     }

//     const speechWindow = window as SpeechWindow;
//     const Recognition =
//       speechWindow.SpeechRecognition ||
//       speechWindow.webkitSpeechRecognition;

//     if (!Recognition) {
//       setVoiceError(
//         "Speech recognition is not supported in this browser. Try the latest Google Chrome."
//       );
//       return;
//     }

//     try {
//       window.speechSynthesis?.cancel();
//       setSpeakingId(null);

//       const recognition = new Recognition();

//       recognition.lang = "en-US";
//       recognition.continuous = false;
//       recognition.interimResults = true;

//       let receivedSpeech = false;

//       recognition.onresult = (event) => {
//         let transcript = "";

//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           transcript += event.results[i][0].transcript;
//         }

//         transcript = transcript.trim();

//         if (transcript) {
//           receivedSpeech = true;
//           setInput(transcript);
//           setVoiceError("");
//         }
//       };

//       recognition.onerror = (event) => {
//         listeningRef.current = false;
//         setListening(false);

//         const errorCode = event.error || "";

//         const errorMessages: Record<string, string> = {
//           "not-allowed":
//             "Microphone access is blocked. Allow microphone access in Chrome site settings.",
//           "service-not-allowed":
//             "Browser speech recognition is blocked. Check Chrome settings or try again later.",
//           "no-speech":
//             "No speech was detected. Check your microphone and speak clearly after clicking the mic.",
//           "audio-capture":
//             "No microphone is available. Check Windows sound input settings.",
//           network:
//             "Speech recognition network error. Check your internet connection and try again.",
//           aborted: "Voice input was stopped. Click the mic to try again.",
//         };

//         if (errorCode !== "aborted" || !receivedSpeech) {
//           setVoiceError(
//             errorMessages[errorCode] ||
//               `Voice recognition failed (${errorCode}). Please try again.`
//           );
//         }
//       };

//       recognition.onend = () => {
//         listeningRef.current = false;
//         setListening(false);

//         if (!receivedSpeech) {
//           setVoiceError((previous) =>
//             previous ||
//             "No words were recognized. Check your microphone and try again."
//           );
//         }
//       };

//       recognitionRef.current = recognition;
//       listeningRef.current = true;
//       setListening(true);

//       recognition.start();
//     } catch {
//       listeningRef.current = false;
//       setListening(false);
//       setVoiceError(
//         "Could not start voice recognition. Refresh the page and try again."
//       );
//     }
//   }

//   function speakMessage(message: ChatMessage) {
//     if (!("speechSynthesis" in window)) {
//       setError("Text-to-speech is not supported in this browser.");
//       return;
//     }

//     if (speakingId === message.id) {
//       window.speechSynthesis.cancel();
//       setSpeakingId(null);
//       return;
//     }

//     stopListening();
//     window.speechSynthesis.cancel();

//     const utterance = new SpeechSynthesisUtterance(message.content);
//     utterance.lang = "en-IN";
//     utterance.rate = 1;
//     utterance.pitch = 1;

//     utterance.onstart = () => {
//       setSpeakingId(message.id);
//     };

//     utterance.onend = () => {
//       setSpeakingId(null);
//     };

//     utterance.onerror = () => {
//       setSpeakingId(null);
//     };

//     setError("");
//     window.speechSynthesis.speak(utterance);
//   }

//   async function handleSend(event?: FormEvent<HTMLFormElement>) {
//     event?.preventDefault();

//     const message = input.trim();

//     if (!message || loading) return;

//     stopListening();
//     window.speechSynthesis?.cancel();
//     setSpeakingId(null);
//     setInput("");
//     setError("");
//     setVoiceError("");

//     const userMessage: ChatMessage = {
//       id: crypto.randomUUID(),
//       role: "user",
//       content: message,
//     };

//     setMessages((previous) => [...previous, userMessage]);
//     setLoading(true);

//     try {
//       const response = await sendMessage(message);

//       const assistantMessage: ChatMessage = {
//         id: crypto.randomUUID(),
//         role: "assistant",
//         content: response.reply,
//       };

//       setMessages((previous) => [...previous, assistantMessage]);
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//       inputRef.current?.focus();
//     }
//   }

//   function clearChat() {
//     if (loading) return;

//     stopListening();
//     window.speechSynthesis?.cancel();
//     setSpeakingId(null);
//     setError("");
//     setVoiceError("");
//     setInput("");

//     setMessages([
//       {
//         id: "welcome",
//         role: "assistant",
//         content: WELCOME_MESSAGE,
//       },
//     ]);
//   }

//   return (
//     <div className="min-h-screen bg-[#020617] text-white">
//       <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#020617]/95 backdrop-blur">
//         <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
//           <div className="flex items-center gap-3">
//             <Link
//               to="/dashboard"
//               aria-label="Back to dashboard"
//               className="text-slate-400 transition hover:text-cyan-400"
//             >
//               <ArrowLeft size={25} />
//             </Link>

//             <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10">
//               <HeartPulse className="text-cyan-400" size={26} />
//             </div>

//             <div>
//               <h1 className="text-lg font-bold sm:text-xl">
//                 Zuno Health Assistant
//               </h1>
//               <p className="text-xs text-slate-400">
//                 AI-powered health information
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={clearChat}
//             disabled={loading}
//             title="Clear conversation"
//             aria-label="Clear conversation"
//             className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-40"
//           >
//             <Trash2 size={20} />
//           </button>
//         </div>
//       </header>

//       <main className="mx-auto flex min-h-[calc(100vh-76px)] max-w-5xl flex-col px-4 sm:px-6">
//         <div className="flex-1 space-y-6 py-8">
//           <div className="mx-auto max-w-2xl rounded-2xl border border-cyan-900/60 bg-slate-900/70 p-4">
//             <div className="flex items-start gap-3">
//               <HeartPulse
//                 className="mt-0.5 shrink-0 text-cyan-400"
//                 size={22}
//               />

//               <div>
//                 <p className="font-semibold">How can Zuno help?</p>
//                 <p className="mt-1 text-sm leading-6 text-slate-400">
//                   Ask general health questions, understand medical terms, or
//                   prepare questions for your doctor. Zuno does not diagnose
//                   conditions or prescribe medicines.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex items-start gap-3 ${
//                 message.role === "user" ? "flex-row-reverse" : "flex-row"
//               }`}
//             >
//               <div
//                 className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
//                   message.role === "user"
//                     ? "bg-indigo-500/20 text-indigo-300"
//                     : "bg-cyan-400/10 text-cyan-400"
//                 }`}
//               >
//                 {message.role === "user" ? (
//                   <User size={21} />
//                 ) : (
//                   <Bot size={22} />
//                 )}
//               </div>

//               <div
//                 className={`min-w-0 max-w-[88%] rounded-2xl p-4 sm:max-w-[82%] ${
//                   message.role === "user"
//                     ? "bg-indigo-600/90 text-white"
//                     : "border border-slate-800 bg-slate-900 text-slate-100"
//                 }`}
//               >
//                 {message.role === "assistant" ? (
//                   <ResponseContent content={message.content} />
//                 ) : (
//                   <p className="whitespace-pre-wrap break-words text-sm leading-7 sm:text-base">
//                     {message.content}
//                   </p>
//                 )}

//                 {message.role === "assistant" && (
//                   <div className="mt-3 flex justify-end border-t border-slate-700/70 pt-2">
//                     <button
//                       type="button"
//                       onClick={() => speakMessage(message)}
//                       aria-label={
//                         speakingId === message.id
//                           ? "Stop reading response"
//                           : "Read response aloud"
//                       }
//                       title={
//                         speakingId === message.id
//                           ? "Stop speaking"
//                           : "Listen to response"
//                       }
//                       className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-400/10"
//                     >
//                       {speakingId === message.id ? (
//                         <>
//                           <VolumeX size={17} />
//                           Stop
//                         </>
//                       ) : (
//                         <>
//                           <Volume2 size={17} />
//                           Listen
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {loading && (
//             <div className="flex items-start gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
//                 <Bot size={22} />
//               </div>

//               <div
//                 className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 text-sm text-slate-400"
//                 role="status"
//                 aria-live="polite"
//               >
//                 <LoaderCircle
//                   className="animate-spin text-cyan-400"
//                   size={19}
//                 />
//                 Zuno is thinking...
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {(error || voiceError) && (
//           <div
//             role="alert"
//             className="mb-4 flex items-start gap-3 rounded-xl border border-red-900/80 bg-red-950/30 p-4 text-sm text-red-200"
//           >
//             <AlertCircle className="mt-0.5 shrink-0" size={19} />
//             <p>{voiceError || error}</p>
//           </div>
//         )}

//         {listening && (
//           <div
//             aria-live="polite"
//             className="mb-3 flex items-center gap-2 text-sm text-cyan-300"
//           >
//             <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
//             Listening... Speak now, then press the microphone to stop.
//           </div>
//         )}

//         <form
//           onSubmit={handleSend}
//           className="sticky bottom-0 border-t border-slate-800 bg-[#020617] py-4"
//         >
//           <div className="flex items-end gap-2 rounded-2xl border border-slate-700 bg-slate-900 p-2 focus-within:border-cyan-500 sm:gap-3">
//             <textarea
//               ref={inputRef}
//               value={input}
//               onChange={(event) => setInput(event.target.value)}
//               onKeyDown={(event) => {
//                 if (
//                   event.key === "Enter" &&
//                   !event.shiftKey &&
//                   !event.nativeEvent.isComposing
//                 ) {
//                   event.preventDefault();
//                   void handleSend();
//                 }
//               }}
//               placeholder={
//                 listening
//                   ? "Listening for your voice..."
//                   : "Type your health question or use the mic..."
//               }
//               rows={2}
//               maxLength={4000}
//               disabled={loading}
//               aria-label="Your health question"
//               className="max-h-40 min-h-12 flex-1 resize-y bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 disabled:opacity-60"
//             />

//             <button
//               type="button"
//               onClick={toggleListening}
//               disabled={loading}
//               title={listening ? "Stop voice input" : "Speak your question"}
//               aria-label={listening ? "Stop voice input" : "Start voice input"}
//               className={`mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition disabled:opacity-40 ${
//                 listening
//                   ? "animate-pulse bg-red-500 text-white"
//                   : "bg-slate-800 text-cyan-300 hover:bg-slate-700"
//               }`}
//             >
//               {listening ? <MicOff size={21} /> : <Mic size={21} />}
//             </button>

//             <button
//               type="submit"
//               disabled={!input.trim() || loading}
//               title="Send message"
//               aria-label="Send message"
//               className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
//             >
//               {loading ? (
//                 <LoaderCircle className="animate-spin" size={20} />
//               ) : (
//                 <Send size={20} />
//               )}
//             </button>
//           </div>

//           <p className="mt-3 text-center text-xs leading-5 text-slate-500">
//             Enter to send · Shift + Enter for a new line · Microphone requires
//             browser permission. AI responses may be inaccurate and do not
//             replace professional medical advice.
//           </p>
//         </form>
//       </main>
//     </div>
//   );
// }



import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  Send,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  LoaderCircle,
  Trash2,
  AlertCircle,
  HeartPulse,
  BookOpen,
  ListChecks,
  Stethoscope,
  ShieldAlert,
  Plus,
  Clock3,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import {
  createConversation,
  getConversations,
  getConversationMessages,
  sendMessageToConversation,
  deleteConversation,
  type Conversation,
} from "../services/api";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type SpeechRecognitionResultEvent = Event & {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: { transcript: string };
      isFinal: boolean;
    };
    length: number;
  };
};

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: Event & { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

type ResponseSection = {
  title: string;
  content: string;
  icon: LucideIcon;
  color: string;
  borderColor: string;
};

const SECTION_CONFIG: Omit<ResponseSection, "content">[] = [
  {
    title: "Simple Explanation",
    icon: BookOpen,
    color: "text-cyan-300",
    borderColor: "border-cyan-500/20",
  },
  {
    title: "Recommended Next Steps",
    icon: ListChecks,
    color: "text-emerald-300",
    borderColor: "border-emerald-500/20",
  },
  {
    title: "Questions for Your Doctor",
    icon: Stethoscope,
    color: "text-violet-300",
    borderColor: "border-violet-500/20",
  },
  {
    title: "Safety Note",
    icon: ShieldAlert,
    color: "text-amber-300",
    borderColor: "border-amber-500/20",
  },
];

const WELCOME_MESSAGE =
  "Hi! I'm Zuno, your AI health information assistant. You can type your question or use the microphone to speak. How can I help you today?";

function parseAssistantResponse(content: string): ResponseSection[] {
  const headingPattern =
    /^\s*#{1,3}\s*(Simple Explanation|Recommended Next Steps|Questions for Your Doctor|Safety Note)\s*:?\s*$/gim;

  const matches = [...content.matchAll(headingPattern)];

  if (matches.length === 0) return [];

  return matches
    .map((match, index) => {
      const start = (match.index ?? 0) + match[0].length;
      const end =
        index + 1 < matches.length
          ? (matches[index + 1].index ?? content.length)
          : content.length;

      const config = SECTION_CONFIG.find(
        (section) => section.title === match[1].trim()
      );

      if (!config) return null;

      return {
        ...config,
        content: content.slice(start, end).trim(),
      };
    })
    .filter(
      (section): section is ResponseSection =>
        section !== null && section.content.length > 0
    );
}

function ResponseContent({ content }: { content: string }) {
  const sections = parseAssistantResponse(content);

  if (sections.length === 0) {
    return (
      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-200 sm:text-base">
        {content}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const SectionIcon = section.icon;

        return (
          <section
            key={section.title}
            className={`overflow-hidden rounded-xl border ${section.borderColor} bg-slate-950/60`}
          >
            <div className="flex items-center gap-2 border-b border-slate-700/60 px-4 py-3">
              <SectionIcon size={19} className={section.color} />
              <h3 className={`text-sm font-semibold ${section.color}`}>
                {section.title}
              </h3>
            </div>

            <div className="whitespace-pre-wrap break-words px-4 py-3 text-sm leading-7 text-slate-200">
              {section.content}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export default function HealthAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME_MESSAGE,
    },
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [listening, setListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [historyError, setHistoryError] = useState("");

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listeningRef = useRef(false);
  const activeConversationRef = useRef<string | null>(null);
  const requestLockRef = useRef(false);

  useEffect(() => {
    activeConversationRef.current = conversationId;
  }, [conversationId]);

  const refreshConversations = useCallback(async () => {
    const response = await getConversations();
    setConversations(response.conversations);
    return response.conversations;
  }, []);

  const loadConversation = useCallback(
    async (id: string) => {
      const response = await getConversationMessages(id);

      activeConversationRef.current = id;
      setConversationId(id);

      setMessages(
        response.messages.length > 0
          ? response.messages.map((message) => ({
              id: message.id,
              role: message.role,
              content: message.content,
            }))
          : [
              {
                id: "welcome",
                role: "assistant",
                content: WELCOME_MESSAGE,
              },
            ]
      );
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      setHistoryLoading(true);
      setHistoryError("");

      try {
        const response = await getConversations();
        if (cancelled) return;

        setConversations(response.conversations);

        if (response.conversations.length > 0) {
          await loadConversation(response.conversations[0].id);
          if (cancelled) return;
        } else {
          const created = await createConversation();
          if (cancelled) return;

          activeConversationRef.current = created.conversation.id;
          setConversationId(created.conversation.id);
          setConversations([created.conversation]);
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content: WELCOME_MESSAGE,
            },
          ]);
        }
      } catch (err) {
        if (!cancelled) {
          setHistoryError(
            getErrorMessage(err, "Could not load chat history.")
          );
        }
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [loadConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      listeningRef.current = false;

      try {
        recognitionRef.current?.abort();
      } catch {
        // Recognition may already have stopped.
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function stopListening() {
    listeningRef.current = false;

    try {
      recognitionRef.current?.stop();
    } catch {
      // Recognition may already have stopped.
    }

    setListening(false);
  }

  function toggleListening() {
    setVoiceError("");
    setError("");

    if (listeningRef.current) {
      stopListening();
      return;
    }

    const speechWindow = window as SpeechWindow;
    const Recognition =
      speechWindow.SpeechRecognition ||
      speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceError(
        "Speech recognition is not supported in this browser. Try the latest Google Chrome."
      );
      return;
    }

    try {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);

      const recognition = new Recognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      let receivedSpeech = false;

      recognition.onresult = (event) => {
        let transcript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        transcript = transcript.trim();

        if (transcript) {
          receivedSpeech = true;
          setInput(transcript);
          setVoiceError("");
        }
      };

      recognition.onerror = (event) => {
        listeningRef.current = false;
        setListening(false);

        const errorCode = event.error || "";

        const errorMessages: Record<string, string> = {
          "not-allowed":
            "Microphone access is blocked. Allow microphone access in Chrome site settings.",
          "service-not-allowed":
            "Browser speech recognition is blocked. Check Chrome settings or try again later.",
          "no-speech":
            "No speech was detected. Check your microphone and speak clearly after clicking the mic.",
          "audio-capture":
            "No microphone is available. Check Windows sound input settings.",
          network:
            "Speech recognition network error. Check your internet connection and try again.",
          aborted: "Voice input was stopped. Click the mic to try again.",
        };

        if (errorCode !== "aborted" || !receivedSpeech) {
          setVoiceError(
            errorMessages[errorCode] ||
              `Voice recognition failed (${errorCode}). Please try again.`
          );
        }
      };

      recognition.onend = () => {
        listeningRef.current = false;
        setListening(false);

        if (!receivedSpeech) {
          setVoiceError((previous) =>
            previous ||
            "No words were recognized. Check your microphone and try again."
          );
        }
      };

      recognitionRef.current = recognition;
      listeningRef.current = true;
      setListening(true);
      recognition.start();
    } catch {
      listeningRef.current = false;
      setListening(false);
      setVoiceError(
        "Could not start voice recognition. Refresh the page and try again."
      );
    }
  }

  function speakMessage(message: ChatMessage) {
    if (!("speechSynthesis" in window)) {
      setError("Text-to-speech is not supported in this browser.");
      return;
    }

    if (speakingId === message.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    stopListening();
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeakingId(message.id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setError("");
    window.speechSynthesis.speak(utterance);
  }

  async function startNewChat() {
    if (requestLockRef.current || loading || historyLoading) return;

    stopListening();
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setError("");
    setVoiceError("");
    setHistoryError("");
    setInput("");
    setHistoryLoading(true);

    try {
      const response = await createConversation();
      const created = response.conversation;

      activeConversationRef.current = created.id;
      setConversationId(created.id);
      setConversations((previous) => [
        created,
        ...previous.filter((item) => item.id !== created.id),
      ]);
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: WELCOME_MESSAGE,
        },
      ]);
    } catch (err) {
      setHistoryError(
        getErrorMessage(err, "Could not create a new conversation.")
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  async function openConversation(conversation: Conversation) {
    if (requestLockRef.current || loading || historyLoading) return;

    stopListening();
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setError("");
    setVoiceError("");
    setHistoryError("");
    setHistoryLoading(true);

    try {
      await loadConversation(conversation.id);
    } catch (err) {
      setHistoryError(
        getErrorMessage(err, "Could not load this conversation.")
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  async function removeConversation(id: string) {
    if (requestLockRef.current || loading || historyLoading) return;

    const confirmed = window.confirm(
      "Delete this conversation and all its saved messages?"
    );

    if (!confirmed) return;

    setHistoryError("");
    setHistoryLoading(true);

    try {
      await deleteConversation(id);

      const remaining = conversations.filter((item) => item.id !== id);
      setConversations(remaining);

      if (activeConversationRef.current === id) {
        if (remaining.length > 0) {
          await loadConversation(remaining[0].id);
        } else {
          const response = await createConversation();
          const created = response.conversation;

          activeConversationRef.current = created.id;
          setConversationId(created.id);
          setConversations([created]);
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content: WELCOME_MESSAGE,
            },
          ]);
        }
      }
    } catch (err) {
      setHistoryError(
        getErrorMessage(err, "Could not delete this conversation.")
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleSend(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const message = input.trim();

    if (!message || loading || historyLoading || requestLockRef.current) {
      return;
    }

    stopListening();
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setInput("");
    setError("");
    setVoiceError("");
    setHistoryError("");
    setLoading(true);
    requestLockRef.current = true;

    const temporaryId = crypto.randomUUID();

    const userMessage: ChatMessage = {
      id: temporaryId,
      role: "user",
      content: message,
    };

    setMessages((previous) => [...previous, userMessage]);

    try {
      let activeId = activeConversationRef.current;

      if (!activeId) {
        const created = await createConversation();
        activeId = created.conversation.id;
        activeConversationRef.current = activeId;
        setConversationId(activeId);
      }

      const response = await sendMessageToConversation(activeId, message);

      setMessages((previous) => [
        ...previous.filter((item) => item.id !== temporaryId),
        {
          id: response.userMessage.id,
          role: "user",
          content: response.userMessage.content,
        },
        {
          id: response.assistantMessage.id,
          role: "assistant",
          content: response.assistantMessage.content,
        },
      ]);

      await refreshConversations();
    } catch (err) {
      setMessages((previous) =>
        previous.filter((item) => item.id !== temporaryId)
      );

      setInput(message);
      setError(
        getErrorMessage(
          err,
          "Could not send or save your message. Please try again."
        )
      );
    } finally {
      setLoading(false);
      requestLockRef.current = false;
      inputRef.current?.focus();
    }
  }

  function clearChat() {
    void startNewChat();
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-[#020617]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/dashboard"
              aria-label="Back to dashboard"
              className="shrink-0 text-slate-400 transition hover:text-cyan-400"
            >
              <ArrowLeft size={25} />
            </Link>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
              <HeartPulse className="text-cyan-400" size={25} />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold sm:text-xl">
                Zuno Health Assistant
              </h1>
              <p className="text-xs text-slate-400">
                AI-powered health information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearChat}
            disabled={loading || historyLoading}
            title="Start a new conversation"
            className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-500 hover:text-cyan-300 disabled:opacity-40"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New chat</span>
          </button>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl flex-col px-4 sm:px-6">
        <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setHistoryOpen((previous) => !previous)}
              className="flex items-center gap-2 font-semibold text-slate-200"
              aria-expanded={historyOpen}
            >
              <Clock3 size={19} className="text-cyan-400" />
              Chat history ({conversations.length})
              {historyOpen ? (
                <ChevronUp size={17} />
              ) : (
                <ChevronDown size={17} />
              )}
            </button>

            <button
              type="button"
              onClick={() => void refreshConversations().catch((err) =>
                setHistoryError(getErrorMessage(err, "Could not refresh history."))
              )}
              disabled={historyLoading}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40"
            >
              <RefreshCw
                size={15}
                className={historyLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {historyOpen && (
            <div className="mt-4 space-y-2">
              {historyLoading && (
                <p className="flex items-center gap-2 text-sm text-slate-400">
                  <LoaderCircle size={16} className="animate-spin" />
                  Loading conversations...
                </p>
              )}

              {!historyLoading && conversations.length === 0 && (
                <p className="text-sm text-slate-500">
                  No conversations yet. Start a new chat to begin.
                </p>
              )}

              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-2 rounded-xl border p-3 ${
                    conversation.id === conversationId
                      ? "border-cyan-700 bg-cyan-950/30"
                      : "border-slate-800 bg-slate-950/50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => void openConversation(conversation)}
                    disabled={loading || historyLoading}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left disabled:opacity-50"
                  >
                    <MessageSquare
                      size={18}
                      className="shrink-0 text-cyan-400"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-200">
                        {conversation.title || "New conversation"}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {conversation.message_count ?? 0} messages
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void removeConversation(conversation.id)}
                    disabled={loading || historyLoading}
                    title="Delete conversation"
                    aria-label={`Delete ${conversation.title}`}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-red-950/50 hover:text-red-300 disabled:opacity-40"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {historyError && (
          <div
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-xl border border-red-900 bg-red-950/30 p-3 text-sm text-red-200"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{historyError}</p>
          </div>
        )}

        <div className="flex-1 space-y-6 py-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-cyan-900/60 bg-slate-900/70 p-4">
            <div className="flex items-start gap-3">
              <HeartPulse
                className="mt-0.5 shrink-0 text-cyan-400"
                size={22}
              />
              <div>
                <p className="font-semibold">How can Zuno help?</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Ask general health questions, understand medical terms, or
                  prepare questions for your doctor. Zuno does not diagnose
                  conditions or prescribe medicines.
                </p>
              </div>
            </div>
          </div>

          {historyLoading && messages.length === 1 && (
            <div
              role="status"
              className="flex items-center justify-center gap-2 text-sm text-slate-400"
            >
              <LoaderCircle size={17} className="animate-spin" />
              Preparing your conversation...
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  message.role === "user"
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "bg-cyan-400/10 text-cyan-400"
                }`}
              >
                {message.role === "user" ? (
                  <User size={21} />
                ) : (
                  <Bot size={22} />
                )}
              </div>

              <div
                className={`min-w-0 max-w-[88%] rounded-2xl p-4 sm:max-w-[82%] ${
                  message.role === "user"
                    ? "bg-indigo-600/90 text-white"
                    : "border border-slate-800 bg-slate-900 text-slate-100"
                }`}
              >
                {message.role === "assistant" ? (
                  <ResponseContent content={message.content} />
                ) : (
                  <p className="whitespace-pre-wrap break-words text-sm leading-7 sm:text-base">
                    {message.content}
                  </p>
                )}

                {message.role === "assistant" && (
                  <div className="mt-3 flex justify-end border-t border-slate-700/70 pt-2">
                    <button
                      type="button"
                      onClick={() => speakMessage(message)}
                      aria-label={
                        speakingId === message.id
                          ? "Stop reading response"
                          : "Read response aloud"
                      }
                      title={
                        speakingId === message.id
                          ? "Stop speaking"
                          : "Listen to response"
                      }
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-400/10"
                    >
                      {speakingId === message.id ? (
                        <>
                          <VolumeX size={17} />
                          Stop
                        </>
                      ) : (
                        <>
                          <Volume2 size={17} />
                          Listen
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                <Bot size={22} />
              </div>

              <div
                className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 text-sm text-slate-400"
                role="status"
                aria-live="polite"
              >
                <LoaderCircle
                  className="animate-spin text-cyan-400"
                  size={19}
                />
                Zuno is thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {(error || voiceError) && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-3 rounded-xl border border-red-900/80 bg-red-950/30 p-4 text-sm text-red-200"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={19} />
            <p>{voiceError || error}</p>
          </div>
        )}

        {listening && (
          <div
            aria-live="polite"
            className="mb-3 flex items-center gap-2 text-sm text-cyan-300"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
            Listening... Speak now, then press the microphone to stop.
          </div>
        )}

        <form
          onSubmit={handleSend}
          className="sticky bottom-0 border-t border-slate-800 bg-[#020617] py-4"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-slate-700 bg-slate-900 p-2 focus-within:border-cyan-500 sm:gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
              placeholder={
                listening
                  ? "Listening for your voice..."
                  : "Type your health question or use the mic..."
              }
              rows={2}
              maxLength={4000}
              disabled={loading || historyLoading}
              aria-label="Your health question"
              className="max-h-40 min-h-12 flex-1 resize-y bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 disabled:opacity-60"
            />

            <button
              type="button"
              onClick={toggleListening}
              disabled={loading || historyLoading}
              title={listening ? "Stop voice input" : "Speak your question"}
              aria-label={listening ? "Stop voice input" : "Start voice input"}
              className={`mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition disabled:opacity-40 ${
                listening
                  ? "animate-pulse bg-red-500 text-white"
                  : "bg-slate-800 text-cyan-300 hover:bg-slate-700"
              }`}
            >
              {listening ? <MicOff size={21} /> : <Mic size={21} />}
            </button>

            <button
              type="submit"
              disabled={!input.trim() || loading || historyLoading}
              title="Send message"
              aria-label="Send message"
              className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <LoaderCircle className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>

          <p className="mt-3 text-center text-xs leading-5 text-slate-500">
            Enter to send · Shift + Enter for a new line · Microphone requires
            browser permission. AI responses may be inaccurate and do not
            replace professional medical advice.
          </p>
        </form>
      </main>
    </div>
  );
}
