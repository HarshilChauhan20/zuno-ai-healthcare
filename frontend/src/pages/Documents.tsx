
// import { useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import {
//   ArrowLeft,
//   UploadCloud,
//   FileText,
//   X,
//   LoaderCircle,
//   Sparkles,
//   ShieldCheck,
//   AlertCircle,
//   FileCheck2,
// } from "lucide-react";
// import { analyzeDocument } from "../services/api";

// const MAX_FILE_SIZE = 10 * 1024 * 1024;

// const ALLOWED_TYPES = [
//   "application/pdf",
//   "image/png",
//   "image/jpeg",
//   "image/webp",
// ];

// const markdownComponents = {
//   h1: ({ children }: any) => (
//     <h1 className="mb-4 mt-8 text-2xl font-bold text-cyan-300 first:mt-0">
//       {children}
//     </h1>
//   ),
//   h2: ({ children }: any) => (
//     <h2 className="mb-3 mt-7 border-b border-slate-700 pb-2 text-xl font-bold text-cyan-300">
//       {children}
//     </h2>
//   ),
//   h3: ({ children }: any) => (
//     <h3 className="mb-2 mt-5 text-lg font-semibold text-cyan-200">
//       {children}
//     </h3>
//   ),
//   p: ({ children }: any) => (
//     <p className="mb-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-300 sm:text-base">
//       {children}
//     </p>
//   ),
//   ul: ({ children }: any) => (
//     <ul className="mb-5 list-disc space-y-2 pl-6 text-sm leading-7 text-slate-300 sm:text-base">
//       {children}
//     </ul>
//   ),
//   ol: ({ children }: any) => (
//     <ol className="mb-5 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-300 sm:text-base">
//       {children}
//     </ol>
//   ),
//   li: ({ children }: any) => <li className="pl-1">{children}</li>,
//   strong: ({ children }: any) => (
//     <strong className="font-semibold text-white">{children}</strong>
//   ),
//   blockquote: ({ children }: any) => (
//     <blockquote className="my-5 border-l-4 border-cyan-500 bg-slate-950/60 px-4 py-3 text-slate-300">
//       {children}
//     </blockquote>
//   ),
//   hr: () => <hr className="my-7 border-slate-700" />,
//   table: ({ children }: any) => (
//     <div className="my-5 overflow-x-auto rounded-xl border border-slate-700">
//       <table className="w-full min-w-[480px] border-collapse text-left text-sm">
//         {children}
//       </table>
//     </div>
//   ),
//   thead: ({ children }: any) => (
//     <thead className="bg-slate-800 text-cyan-200">{children}</thead>
//   ),
//   th: ({ children }: any) => (
//     <th className="border-b border-slate-700 px-4 py-3 font-semibold">
//       {children}
//     </th>
//   ),
//   td: ({ children }: any) => (
//     <td className="border-b border-slate-800 px-4 py-3 text-slate-300">
//       {children}
//     </td>
//   ),
//   a: ({ children, href }: any) => {
//     const safeHref =
//       typeof href === "string" &&
//       (/^https?:\/\//i.test(href) || href.startsWith("mailto:"))
//         ? href
//         : undefined;

//     return safeHref ? (
//       <a
//         href={safeHref}
//         target="_blank"
//         rel="noreferrer"
//         className="break-all text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
//       >
//         {children}
//       </a>
//     ) : (
//       <span>{children}</span>
//     );
//   },
//   code: ({ children }: any) => (
//     <code className="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
//       {children}
//     </code>
//   ),
// };

// export default function Documents() {
//   const inputRef = useRef<HTMLInputElement>(null);

//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [result, setResult] = useState<{
//     fileName: string;
//     analysis: string;
//     disclaimer: string;
//   } | null>(null);

//   function selectFile(selected?: File) {
//     if (!selected) return;

//     setError("");
//     setResult(null);

//     if (!ALLOWED_TYPES.includes(selected.type)) {
//       setFile(null);
//       setError("Choose a PDF, PNG, JPEG, or WebP file.");
//       return;
//     }

//     if (selected.size === 0) {
//       setFile(null);
//       setError("This file is empty. Please choose another file.");
//       return;
//     }

//     if (selected.size > MAX_FILE_SIZE) {
//       setFile(null);
//       setError("Your file must be 10 MB or smaller.");
//       return;
//     }

//     setFile(selected);
//   }

//   async function handleAnalyze() {
//     if (!file || loading) return;

//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       const response = await analyzeDocument(file);

//       if (!response.analysis?.trim()) {
//         throw new Error(
//           "Zuno could not generate an explanation. Please try another file."
//         );
//       }

//       setResult({
//         fileName: response.fileName || file.name,
//         analysis: response.analysis,
//         disclaimer:
//           response.disclaimer ||
//           "This explanation is for educational purposes only. It is not a diagnosis or a substitute for advice from a qualified healthcare professional.",
//       });
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   function resetDocument() {
//     setFile(null);
//     setError("");
//     setResult(null);

//     if (inputRef.current) {
//       inputRef.current.value = "";
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#020617] text-white">
//       <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#020617]/95 backdrop-blur">
//         <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-5 sm:px-6">
//           <Link
//             to="/dashboard"
//             className="rounded-lg p-1 text-slate-400 transition hover:text-cyan-400"
//             aria-label="Back to dashboard"
//           >
//             <ArrowLeft size={26} />
//           </Link>

//           <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10">
//             <HeartPulseIcon />
//           </div>

//           <div>
//             <h1 className="text-xl font-bold sm:text-2xl">
//               Zuno. Documents
//             </h1>
//             <p className="text-xs text-slate-400">
//               Medical document assistant
//             </p>
//           </div>
//         </div>
//       </header>

//       <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
//         <div className="mb-8">
//           <div className="mb-3 flex items-center gap-3">
//             <FileText className="text-cyan-400" size={31} />
//             <h2 className="text-3xl font-bold sm:text-4xl">
//               Medical documents
//             </h2>
//           </div>

//           <p className="max-w-2xl leading-7 text-slate-400">
//             Upload a medical report and let Zuno explain its terminology
//             and visible findings in simple language.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={() => inputRef.current?.click()}
//           disabled={loading}
//           className="flex min-h-64 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-8 transition hover:border-cyan-400 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10">
//             <UploadCloud size={38} className="text-cyan-400" />
//           </div>

//           <span className="text-xl font-semibold">
//             Choose a medical document
//           </span>

//           <span className="mt-3 text-center text-sm text-slate-400">
//             PDF, PNG, JPEG or WebP · Maximum 10 MB
//           </span>

//           <input
//             ref={inputRef}
//             type="file"
//             accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
//             className="hidden"
//             onChange={(event) => {
//               selectFile(event.target.files?.[0]);
//               event.target.value = "";
//             }}
//           />
//         </button>

//         {file && (
//           <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
//             <div className="flex min-w-0 items-center gap-4">
//               <div className="rounded-xl bg-cyan-400/10 p-3">
//                 <FileText className="text-cyan-400" size={25} />
//               </div>

//               <div className="min-w-0">
//                 <p className="break-all font-semibold">{file.name}</p>
//                 <p className="mt-1 text-sm text-slate-400">
//                   {(file.size / 1024).toFixed(1)} KB · Selected locally
//                 </p>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={resetDocument}
//               disabled={loading}
//               className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
//               aria-label="Remove selected document"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         )}

//         {error && (
//           <div
//             role="alert"
//             className="mt-5 flex items-start gap-3 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-200"
//           >
//             <AlertCircle className="mt-0.5 shrink-0" size={21} />
//             <p>{error}</p>
//           </div>
//         )}

//         <button
//           type="button"
//           onClick={handleAnalyze}
//           disabled={!file || loading}
//           className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
//         >
//           {loading ? (
//             <>
//               <LoaderCircle className="animate-spin" size={22} />
//               Analyzing your report...
//             </>
//           ) : (
//             <>
//               <Sparkles size={22} />
//               Analyze Report with Zuno AI
//             </>
//           )}
//         </button>

//         {loading && (
//           <div
//             role="status"
//             aria-live="polite"
//             className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-center"
//           >
//             <p className="text-sm text-slate-300">
//               Zuno is reading your document and preparing an explanation.
//             </p>
//             <p className="mt-1 text-xs text-slate-500">
//               This may take a little while. Please keep this page open.
//             </p>
//           </div>
//         )}

//         {result && (
//           <section className="mt-10 overflow-hidden rounded-2xl border border-cyan-900/70 bg-slate-900">
//             <div className="border-b border-slate-800 bg-slate-900/80 p-5 sm:p-7">
//               <div className="flex items-start gap-4">
//                 <div className="rounded-xl bg-cyan-400/10 p-3">
//                   <FileCheck2 className="text-cyan-400" size={27} />
//                 </div>

//                 <div className="min-w-0">
//                   <div className="flex flex-wrap items-center gap-2">
//                     <h3 className="text-xl font-bold sm:text-2xl">
//                       Your report explanation
//                     </h3>
//                     <span className="rounded-full border border-cyan-800 bg-cyan-950/50 px-2.5 py-1 text-xs text-cyan-300">
//                       AI generated
//                     </span>
//                   </div>

//                   <p className="mt-2 break-all text-sm text-slate-400">
//                     {result.fileName}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-5 sm:p-8">
//               <div className="mb-6 flex items-start gap-3 rounded-xl border border-cyan-900/60 bg-cyan-950/20 p-4">
//                 <ShieldCheck
//                   className="mt-0.5 shrink-0 text-cyan-300"
//                   size={21}
//                 />
//                 <p className="text-sm leading-6 text-slate-300">
//                   This is an educational explanation of the information
//                   the AI could read. It may miss details or interpret
//                   results incorrectly.
//                 </p>
//               </div>

//               <article className="min-w-0">
//                 <ReactMarkdown
//                   remarkPlugins={[remarkGfm]}
//                   components={markdownComponents}
//                 >
//                   {result.analysis}
//                 </ReactMarkdown>
//               </article>

//               <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-900/50 bg-amber-950/20 p-4">
//                 <AlertCircle
//                   className="mt-0.5 shrink-0 text-amber-300"
//                   size={22}
//                 />
//                 <div>
//                   <h4 className="font-semibold text-amber-200">
//                     Medical disclaimer
//                   </h4>
//                   <p className="mt-1 text-sm leading-6 text-slate-300">
//                     {result.disclaimer}
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={resetDocument}
//                 className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold transition hover:border-cyan-400 hover:bg-slate-800 sm:w-auto"
//               >
//                 <UploadCloud size={19} />
//                 Analyze another document
//               </button>
//             </div>
//           </section>
//         )}

//         <p className="mt-8 text-xs leading-6 text-slate-500">
//           Upload only documents you are authorized to share. Avoid real
//           patient identifiers when testing. This interface does not
//           intentionally save uploaded files to disk; confirm your backend
//           and AI provider data-handling settings before uploading sensitive
//           medical records. AI explanations do not replace a qualified
//           clinician's interpretation.
//         </p>
//       </main>
//     </div>
//   );
// }

// function HeartPulseIcon() {
//   return <ShieldCheck size={25} className="text-cyan-400" />;
// }



// import { useRef, useState } from "react";
// import type { ChangeEvent } from "react";
// import { Link } from "react-router-dom";
// import ReactMarkdown from "react-markdown";
// import type { Components } from "react-markdown";
// import remarkGfm from "remark-gfm";
// import {
//   ArrowLeft,
//   UploadCloud,
//   FileText,
//   X,
//   LoaderCircle,
//   Sparkles,
//   ShieldCheck,
//   AlertCircle,
//   FileCheck2,
//   HeartPulse,
//   Stethoscope,
//   RotateCcw,
// } from "lucide-react";
// import { analyzeDocument } from "../services/api";

// const MAX_FILE_SIZE = 10 * 1024 * 1024;

// const ALLOWED_TYPES = [
//   "application/pdf",
//   "image/png",
//   "image/jpeg",
//   "image/webp",
// ];

// const markdownComponents: Components = {
//   h1: ({ children }) => (
//     <h1 className="mb-4 mt-8 text-2xl font-bold text-cyan-300 first:mt-0">
//       {children}
//     </h1>
//   ),

//   h2: ({ children }) => (
//     <h2 className="mb-4 mt-8 flex items-center gap-2 border-b border-slate-700 pb-3 text-xl font-bold text-cyan-300 first:mt-0">
//       <span className="h-5 w-1 rounded-full bg-cyan-400" />
//       {children}
//     </h2>
//   ),

//   h3: ({ children }) => (
//     <h3 className="mb-3 mt-6 text-lg font-semibold text-cyan-200">
//       {children}
//     </h3>
//   ),

//   p: ({ children }) => (
//     <p className="mb-4 break-words text-sm leading-7 text-slate-300 sm:text-base">
//       {children}
//     </p>
//   ),

//   ul: ({ children }) => (
//     <ul className="mb-5 list-disc space-y-2 pl-6 text-sm leading-7 text-slate-300 sm:text-base">
//       {children}
//     </ul>
//   ),

//   ol: ({ children }) => (
//     <ol className="mb-5 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-300 sm:text-base">
//       {children}
//     </ol>
//   ),

//   li: ({ children }) => <li className="pl-1">{children}</li>,

//   strong: ({ children }) => (
//     <strong className="font-semibold text-white">{children}</strong>
//   ),

//   blockquote: ({ children }) => (
//     <blockquote className="my-5 rounded-r-xl border-l-4 border-cyan-500 bg-slate-950/60 px-4 py-3 text-slate-300">
//       {children}
//     </blockquote>
//   ),

//   hr: () => <hr className="my-7 border-slate-700" />,

//   table: ({ children }) => (
//     <div className="my-5 overflow-x-auto rounded-xl border border-slate-700">
//       <table className="w-full min-w-[560px] border-collapse text-left text-sm">
//         {children}
//       </table>
//     </div>
//   ),

//   thead: ({ children }) => (
//     <thead className="bg-slate-800 text-cyan-200">{children}</thead>
//   ),

//   tbody: ({ children }) => (
//     <tbody className="divide-y divide-slate-800">{children}</tbody>
//   ),

//   tr: ({ children }) => (
//     <tr className="transition hover:bg-slate-800/50">{children}</tr>
//   ),

//   th: ({ children }) => (
//     <th className="border-b border-slate-700 px-4 py-3 font-semibold">
//       {children}
//     </th>
//   ),

//   td: ({ children }) => (
//     <td className="px-4 py-3 align-top leading-6 text-slate-300">
//       {children}
//     </td>
//   ),

//   a: ({ children, href }) => {
//     const safeHref =
//       typeof href === "string" &&
//       (/^https?:\/\//i.test(href) || href.startsWith("mailto:"))
//         ? href
//         : undefined;

//     if (!safeHref) {
//       return <span>{children}</span>;
//     }

//     return (
//       <a
//         href={safeHref}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="break-all text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
//       >
//         {children}
//       </a>
//     );
//   },

//   code: ({ children }) => (
//     <code className="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-200">
//       {children}
//     </code>
//   ),
// };

// type AnalysisResult = {
//   fileName: string;
//   analysis: string;
//   disclaimer: string;
// };

// export default function Documents() {
//   const inputRef = useRef<HTMLInputElement>(null);

//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [result, setResult] = useState<AnalysisResult | null>(null);

//   function selectFile(selected?: File) {
//     if (!selected) return;

//     setError("");
//     setResult(null);

//     if (!ALLOWED_TYPES.includes(selected.type)) {
//       setFile(null);
//       setError("Choose a PDF, PNG, JPEG, or WebP file.");
//       return;
//     }

//     if (selected.size === 0) {
//       setFile(null);
//       setError("This file is empty. Please choose another file.");
//       return;
//     }

//     if (selected.size > MAX_FILE_SIZE) {
//       setFile(null);
//       setError("Your file must be 10 MB or smaller.");
//       return;
//     }

//     setFile(selected);
//   }

//   async function handleAnalyze() {
//     if (!file || loading) return;

//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       const response = await analyzeDocument(file);

//       if (!response.analysis?.trim()) {
//         throw new Error(
//           "Zuno could not generate an explanation. Please try another file."
//         );
//       }

//       setResult({
//         fileName: response.fileName || file.name,
//         analysis: response.analysis,
//         disclaimer:
//           response.disclaimer ||
//           "This explanation is for educational purposes only. It is not a diagnosis or a substitute for advice from a qualified healthcare professional.",
//       });
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   function resetDocument() {
//     if (loading) return;

//     setFile(null);
//     setError("");
//     setResult(null);

//     if (inputRef.current) {
//       inputRef.current.value = "";
//     }
//   }

//   function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
//     selectFile(event.target.files?.[0]);
//     event.target.value = "";
//   }

//   return (
//     <div className="min-h-screen bg-[#020617] text-white">
//       <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#020617]/95 backdrop-blur-xl">
//         <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-5 sm:px-6">
//           <Link
//             to="/dashboard"
//             className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-cyan-400"
//             aria-label="Back to dashboard"
//           >
//             <ArrowLeft size={23} />
//           </Link>

//           <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
//             <HeartPulse size={25} className="text-cyan-400" />
//           </div>

//           <div>
//             <h1 className="text-xl font-bold sm:text-2xl">
//               Zuno<span className="text-cyan-400">.</span> Documents
//             </h1>
//             <p className="text-xs text-slate-400">
//               Medical document assistant
//             </p>
//           </div>
//         </div>
//       </header>

//       <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
//         <section className="mb-8">
//           <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-900 bg-cyan-950/40 px-3 py-1.5 text-xs font-medium text-cyan-300">
//             <Sparkles size={14} />
//             AI-powered report explanation
//           </div>

//           <div className="mb-3 flex items-center gap-3">
//             <FileText className="text-cyan-400" size={31} />
//             <h2 className="text-3xl font-bold sm:text-4xl">
//               Medical documents
//             </h2>
//           </div>

//           <p className="max-w-2xl leading-7 text-slate-400">
//             Upload a medical report to understand its visible findings,
//             test values, reference ranges, and medical terminology in
//             simple language.
//           </p>
//         </section>

//         <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
//           <button
//             type="button"
//             onClick={() => inputRef.current?.click()}
//             disabled={loading}
//             className="flex min-h-60 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-center transition hover:border-cyan-400 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
//               <UploadCloud size={36} className="text-cyan-400" />
//             </div>

//             <span className="text-lg font-semibold sm:text-xl">
//               Choose a medical document
//             </span>

//             <span className="mt-2 text-sm text-slate-400">
//               Select a report from your device
//             </span>

//             <span className="mt-4 rounded-full bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
//               PDF, PNG, JPEG or WebP · Maximum 10 MB
//             </span>

//             <input
//               ref={inputRef}
//               type="file"
//               accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
//               className="hidden"
//               onChange={handleInputChange}
//             />
//           </button>

//           {file && (
//             <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
//               <div className="flex min-w-0 items-center gap-3">
//                 <div className="rounded-xl bg-cyan-400/10 p-3">
//                   <FileText size={24} className="text-cyan-400" />
//                 </div>

//                 <div className="min-w-0">
//                   <p className="break-all font-semibold">{file.name}</p>
//                   <p className="mt-1 text-sm text-slate-400">
//                     {(file.size / 1024).toFixed(1)} KB · Selected locally
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={resetDocument}
//                 disabled={loading}
//                 aria-label="Remove selected document"
//                 className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           )}

//           {error && (
//             <div
//               role="alert"
//               className="mt-5 flex items-start gap-3 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-200"
//             >
//               <AlertCircle className="mt-0.5 shrink-0" size={21} />
//               <p>{error}</p>
//             </div>
//           )}

//           <button
//             type="button"
//             onClick={handleAnalyze}
//             disabled={!file || loading}
//             className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
//           >
//             {loading ? (
//               <>
//                 <LoaderCircle className="animate-spin" size={21} />
//                 Analyzing your report...
//               </>
//             ) : (
//               <>
//                 <Sparkles size={21} />
//                 Analyze Report with Zuno AI
//               </>
//             )}
//           </button>

//           {loading && (
//             <div
//               role="status"
//               aria-live="polite"
//               className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-center"
//             >
//               <p className="text-sm text-slate-300">
//                 Zuno is reading your document and preparing an explanation.
//               </p>
//               <p className="mt-1 text-xs text-slate-500">
//                 This may take a little while. Please keep this page open.
//               </p>
//             </div>
//           )}
//         </section>

//         {result && (
//           <section className="mt-8 overflow-hidden rounded-2xl border border-cyan-900/70 bg-slate-900">
//             <div className="border-b border-slate-800 bg-slate-950/40 p-5 sm:p-7">
//               <div className="flex items-start gap-4">
//                 <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3">
//                   <FileCheck2 className="text-cyan-400" size={26} />
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <div className="flex flex-wrap items-center gap-2">
//                     <h3 className="text-xl font-bold sm:text-2xl">
//                       Your report explanation
//                     </h3>
//                     <span className="rounded-full border border-cyan-800 bg-cyan-950/50 px-2.5 py-1 text-xs text-cyan-300">
//                       AI generated
//                     </span>
//                   </div>

//                   <p className="mt-2 break-all text-sm text-slate-400">
//                     {result.fileName}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-5 sm:p-8">
//               <div className="mb-7 flex items-start gap-3 rounded-xl border border-cyan-900/60 bg-cyan-950/20 p-4">
//                 <ShieldCheck
//                   className="mt-0.5 shrink-0 text-cyan-300"
//                   size={21}
//                 />
//                 <p className="text-sm leading-6 text-slate-300">
//                   This is an educational explanation of information the AI
//                   could read. It may miss details or interpret results
//                   incorrectly. A qualified healthcare professional should
//                   interpret your results in context.
//                 </p>
//               </div>

//               <article className="min-w-0">
//                 <ReactMarkdown
//                   remarkPlugins={[remarkGfm]}
//                   components={markdownComponents}
//                 >
//                   {result.analysis}
//                 </ReactMarkdown>
//               </article>

//               <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-900/50 bg-amber-950/20 p-4">
//                 <AlertCircle
//                   className="mt-0.5 shrink-0 text-amber-300"
//                   size={22}
//                 />
//                 <div>
//                   <h4 className="font-semibold text-amber-200">
//                     Medical disclaimer
//                   </h4>
//                   <p className="mt-1 text-sm leading-6 text-slate-300">
//                     {result.disclaimer}
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={resetDocument}
//                 className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold transition hover:border-cyan-400 hover:bg-slate-800 sm:w-auto"
//               >
//                 <RotateCcw size={18} />
//                 Analyze another document
//               </button>
//             </div>
//           </section>
//         )}

//         <section className="mt-8 grid gap-4 sm:grid-cols-2">
//           <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
//             <Stethoscope className="mt-0.5 shrink-0 text-cyan-400" size={21} />
//             <div>
//               <h4 className="font-semibold text-slate-200">
//                 Understand your report
//               </h4>
//               <p className="mt-1 text-sm leading-6 text-slate-400">
//                 Learn about readable values and medical terms in everyday
//                 language.
//               </p>
//             </div>
//           </div>

//           <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
//             <ShieldCheck className="mt-0.5 shrink-0 text-cyan-400" size={21} />
//             <div>
//               <h4 className="font-semibold text-slate-200">
//                 Use information carefully
//               </h4>
//               <p className="mt-1 text-sm leading-6 text-slate-400">
//                 AI explanations are not diagnoses and should not replace
//                 professional medical advice.
//               </p>
//             </div>
//           </div>
//         </section>

//         <p className="mt-8 text-xs leading-6 text-slate-500">
//           Upload only documents you are authorized to share. Avoid real
//           patient identifiers when testing. Confirm your backend and AI
//           provider data-handling settings before uploading sensitive medical
//           records. This interface does not intentionally save uploaded files
//           to disk, but that alone does not guarantee that no data is retained
//           elsewhere.
//         </p>
//       </main>
//     </div>
//   );
// }



import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  X,
  LoaderCircle,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  HeartPulse,
  Stethoscope,
  RotateCcw,
  History,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  CalendarDays,
} from "lucide-react";
import {
  analyzeDocument,
  getSavedMedicalDocuments,
  getSavedMedicalDocument,
  downloadSavedMedicalDocument,
  deleteSavedMedicalDocument,
} from "../services/api";
import type {
  SavedMedicalDocument,
  DocumentAnalysisResponse,
} from "../services/api";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Date unavailable";

  return parsed.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} bytes`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export default function Documents() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SavedMedicalDocument | null>(null);

  const [documents, setDocuments] = useState<SavedMedicalDocument[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError("");

    try {
      const saved = await getSavedMedicalDocuments();
      setDocuments(saved);

      // Refresh the displayed report from the server if it still exists.
      if (selectedId) {
        const stillExists = saved.some((item) => item.id === selectedId);

        if (!stillExists) {
          setSelectedId(null);
          setResult(null);
        }
      }
    } catch (err) {
      setHistoryError(
        err instanceof Error
          ? err.message
          : "Unable to load medical history."
      );
    } finally {
      setHistoryLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  function selectFile(selected?: File) {
    if (!selected) return;

    setError("");
    setNotice("");
    setResult(null);
    setSelectedId(null);

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setFile(null);
      setError("Choose a PDF, PNG, JPEG, or WebP file.");
      return;
    }

    if (selected.size === 0) {
      setFile(null);
      setError("This file is empty. Please choose another file.");
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("Your file must be 10 MB or smaller.");
      return;
    }

    setFile(selected);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0]);
    event.target.value = "";
  }

  async function handleAnalyze() {
    if (!file || loading) return;

    setLoading(true);
    setError("");
    setNotice("");
    setResult(null);
    setSelectedId(null);

    try {
      const response: DocumentAnalysisResponse = await analyzeDocument(file);

      if (!response.analysis?.trim() || !response.document?.id) {
        throw new Error(
          "The analysis response did not include a saved document. Check your backend persistence implementation."
        );
      }

      setResult(response.document);
      setSelectedId(response.document.id);
      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setNotice("Report analyzed and saved to your medical history.");
      await loadHistory();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function openSavedDocument(id: string) {
    setActionId(id);
    setError("");
    setNotice("");

    try {
      const document = await getSavedMedicalDocument(id);
      setResult(document);
      setSelectedId(document.id);
      setFile(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to open this report."
      );
    } finally {
      setActionId(null);
    }
  }

  async function downloadDocument(document: SavedMedicalDocument) {
    setActionId(document.id);
    setError("");
    setNotice("");

    try {
      const blob = await downloadSavedMedicalDocument(document.id);
      const url = URL.createObjectURL(blob);
      const anchor = window.document.createElement("a");

      anchor.href = url;
      anchor.download = document.original_name;
      window.document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      setNotice("Download started.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to download this file."
      );
    } finally {
      setActionId(null);
    }
  }

  async function deleteDocument(document: SavedMedicalDocument) {
    const confirmed = window.confirm(
      `Delete "${document.original_name}" and its saved AI analysis? This cannot be undone.`
    );

    if (!confirmed) return;

    setActionId(document.id);
    setError("");
    setNotice("");

    try {
      await deleteSavedMedicalDocument(document.id);

      setDocuments((current) =>
        current.filter((item) => item.id !== document.id)
      );

      if (selectedId === document.id) {
        setSelectedId(null);
        setResult(null);
      }

      setNotice("Document and saved analysis deleted.");
      await loadHistory();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete this report."
      );
    } finally {
      setActionId(null);
    }
  }

  function resetDocument() {
    if (loading) return;

    setFile(null);
    setError("");
    setNotice("");
    setResult(null);
    setSelectedId(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#020617]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-5 sm:px-6">
          <Link
            to="/dashboard"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-cyan-400"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={23} />
          </Link>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            <HeartPulse size={25} className="text-cyan-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold sm:text-2xl">
              Zuno<span className="text-cyan-400">.</span> Documents
            </h1>
            <p className="text-xs text-slate-400">
              Medical document assistant
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <section className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-900 bg-cyan-950/40 px-3 py-1.5 text-xs font-medium text-cyan-300">
            <Sparkles size={14} />
            AI-powered report explanation
          </div>

          <div className="mb-3 flex items-center gap-3">
            <FileText className="text-cyan-400" size={31} />
            <h2 className="text-3xl font-bold sm:text-4xl">
              Medical documents
            </h2>
          </div>

          <p className="max-w-2xl leading-7 text-slate-400">
            Upload a medical report to understand readable findings, test
            values and medical terminology in simple language. Your saved
            reports appear in Medical History below.
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-200"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={21} />
            <p>{error}</p>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-cyan-900 bg-cyan-950/30 p-4 text-sm text-cyan-200"
          >
            {notice}
          </div>
        )}

        {/* Upload and analysis */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-center transition hover:border-cyan-400 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <UploadCloud size={36} className="text-cyan-400" />
            </div>

            <span className="text-lg font-semibold sm:text-xl">
              Choose a medical document
            </span>
            <span className="mt-2 text-sm text-slate-400">
              Select a report from your device
            </span>
            <span className="mt-4 rounded-full bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
              PDF, PNG, JPEG or WebP · Maximum 10 MB
            </span>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleInputChange}
            />
          </button>

          {file && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <FileText size={24} className="shrink-0 text-cyan-400" />
                <div className="min-w-0">
                  <p className="break-all font-semibold">{file.name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {formatFileSize(file.size)} · Ready to upload
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFile(null)}
                disabled={loading}
                aria-label="Remove selected document"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" size={21} />
                Analyzing and saving report...
              </>
            ) : (
              <>
                <Sparkles size={21} />
                Analyze and Save Report
              </>
            )}
          </button>

          {loading && (
            <p role="status" className="mt-4 text-center text-sm text-slate-400">
              Zuno is analyzing your report. Please keep this page open.
            </p>
          )}
        </section>

        {/* Saved medical history */}
        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3">
                <History className="text-cyan-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Medical History</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {documents.length} saved{" "}
                  {documents.length === 1 ? "report" : "reports"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void loadHistory()}
              disabled={historyLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={historyLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {historyError && (
            <div className="mb-4 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-200">
              {historyError}
              <p className="mt-2 text-xs text-red-300">
                Check that your backend is running and the demo session header
                is configured correctly.
              </p>
            </div>
          )}

          {historyLoading && documents.length === 0 ? (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-slate-400">
              <LoaderCircle size={22} className="animate-spin" />
              Loading saved medical history...
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 px-5 py-12 text-center">
              <FileText className="mx-auto mb-4 text-slate-500" size={38} />
              <h3 className="text-lg font-semibold">No saved reports yet</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                Analyze a report above. After it is successfully saved, it will
                appear here so you can revisit its explanation later.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {documents.map((document) => {
                const busy = actionId === document.id;
                const selected = selectedId === document.id;

                return (
                  <article
                    key={document.id}
                    className={`rounded-2xl border bg-slate-900/60 p-4 transition sm:p-5 ${
                      selected
                        ? "border-cyan-500/70"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="rounded-xl bg-cyan-400/10 p-3">
                          <FileCheck2
                            size={24}
                            className="text-cyan-400"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-all font-semibold text-white">
                            {document.original_name}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays size={14} />
                              {formatDate(document.created_at)}
                            </span>
                            <span>{formatFileSize(Number(document.file_size))}</span>
                            <span className="uppercase">
                              {document.mime_type.replace("image/", "")}
                            </span>
                          </div>

                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
                            {document.analysis.slice(0, 180)}
                            {document.analysis.length > 180 ? "…" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <button
                          type="button"
                          onClick={() => void openSavedDocument(document.id)}
                          disabled={busy}
                          className="inline-flex items-center gap-2 rounded-lg border border-cyan-800 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-950/40 disabled:opacity-50"
                        >
                          {busy ? (
                            <LoaderCircle size={16} className="animate-spin" />
                          ) : (
                            <Eye size={16} />
                          )}
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => void downloadDocument(document)}
                          disabled={busy}
                          aria-label={`Download ${document.original_name}`}
                          className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-cyan-500 hover:text-cyan-300 disabled:opacity-50"
                        >
                          <Download size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => void deleteDocument(document)}
                          disabled={busy}
                          aria-label={`Delete ${document.original_name}`}
                          className="rounded-lg border border-red-900/70 p-2 text-red-300 hover:bg-red-950/50 disabled:opacity-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Current or previously saved AI explanation */}
        {result && (
          <section className="mt-10 overflow-hidden rounded-2xl border border-cyan-900/70 bg-slate-900">
            <div className="border-b border-slate-800 bg-slate-950/40 p-5 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3">
                  <FileCheck2 className="text-cyan-400" size={26} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold sm:text-2xl">
                      Saved report explanation
                    </h3>
                    <span className="rounded-full border border-cyan-800 bg-cyan-950/50 px-2.5 py-1 text-xs text-cyan-300">
                      AI generated
                    </span>
                  </div>

                  <p className="mt-2 break-all text-sm text-slate-400">
                    {result.original_name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Saved {formatDate(result.created_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <div className="mb-7 flex items-start gap-3 rounded-xl border border-cyan-900/60 bg-cyan-950/20 p-4">
                <ShieldCheck
                  className="mt-0.5 shrink-0 text-cyan-300"
                  size={21}
                />
                <p className="text-sm leading-6 text-slate-300">
                  This is an educational explanation of information the AI
                  could read. It may miss details or interpret results
                  incorrectly. A qualified healthcare professional should
                  interpret your results in context.
                </p>
              </div>

              <article className="min-w-0 space-y-4 break-words text-sm leading-7 text-slate-300 sm:text-base [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-cyan-300 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:border-b [&_h2]:border-slate-700 [&_h2]:pb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-cyan-300 [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-cyan-200 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_strong]:font-semibold [&_strong]:text-white [&_table]:w-full [&_td]:border [&_td]:border-slate-700 [&_td]:p-3 [&_th]:border [&_th]:border-slate-700 [&_th]:p-3 [&_th]:text-cyan-200">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.analysis}
                </ReactMarkdown>
              </article>

              <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-900/50 bg-amber-950/20 p-4">
                <AlertCircle
                  className="mt-0.5 shrink-0 text-amber-300"
                  size={22}
                />
                <div>
                  <h4 className="font-semibold text-amber-200">
                    Medical disclaimer
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    AI-generated educational information only. This is not a
                    diagnosis or a substitute for advice from a qualified
                    healthcare professional.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setSelectedId(null);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold transition hover:border-cyan-400 hover:bg-slate-800"
                >
                  <X size={18} />
                  Close explanation
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setSelectedId(null);
                    setFile(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  <RotateCcw size={18} />
                  Analyze another report
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <Stethoscope
              className="mt-0.5 shrink-0 text-cyan-400"
              size={21}
            />
            <div>
              <h4 className="font-semibold text-slate-200">
                Understand your report
              </h4>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Revisit saved explanations and learn about readable values and
                medical terms.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <ShieldCheck
              className="mt-0.5 shrink-0 text-cyan-400"
              size={21}
            />
            <div>
              <h4 className="font-semibold text-slate-200">
                Use information carefully
              </h4>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                AI explanations are not diagnoses and should not replace
                professional medical advice.
              </p>
            </div>
          </div>
        </section>

        <p className="mt-8 text-xs leading-6 text-slate-500">
          Hackathon demo: history is associated with a browser-generated
          session ID, not a verified account. This is not secure authentication.
          Do not upload real sensitive medical records until proper
          authentication, access controls, and data protection are implemented.
        </p>
      </main>
    </div>
  );
}
