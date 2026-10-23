
// import { Link } from "react-router-dom";
// import { ArrowLeft, FileText, MessageCircle, ShieldCheck } from "lucide-react";

// export default function Dashboard() {
//   return (
//     <main className="min-h-screen bg-slate-950 text-white">
//       <header className="border-b border-slate-800 px-6 py-5">
//         <div className="mx-auto flex max-w-6xl items-center justify-between">
//           <Link to="/" className="text-2xl font-bold">
//             Zuno<span className="text-cyan-400">.</span>
//           </Link>
//           <Link to="/" className="text-sm text-slate-400 hover:text-white">
//             <ArrowLeft className="mr-2 inline" size={16} />
//             Home
//           </Link>
//         </div>
//       </header>

//       <section className="mx-auto max-w-6xl px-6 py-12">
//         <p className="text-sm font-semibold tracking-widest text-cyan-400">
//           YOUR WORKSPACE
//         </p>
//         <h1 className="mt-3 text-4xl font-bold">Welcome to Zuno</h1>
//         <p className="mt-3 max-w-2xl leading-7 text-slate-400">
//           Choose a tool to organize health information and prepare for
//           conversations with healthcare professionals.
//         </p>

//         <div className="mt-10 grid gap-5 md:grid-cols-2">
//           <Link
//             to="/assistant"
//             className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:border-cyan-400/50"
//           >
//             <MessageCircle className="text-cyan-300" size={30} />
//             <h2 className="mt-5 text-xl font-semibold">Health Assistant</h2>
//             <p className="mt-3 leading-7 text-slate-400">
//               Ask general questions and organize information for your doctor.
//             </p>
//             <span className="mt-5 inline-block text-cyan-300">
//               Open assistant →
//             </span>
//           </Link>

//           <Link
//             to="/documents"
//             className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:border-cyan-400/50"
//           >
//             <FileText className="text-cyan-300" size={30} />
//             <h2 className="mt-5 text-xl font-semibold">Medical Documents</h2>
//             <p className="mt-3 leading-7 text-slate-400">
//               Open the document workspace for the next feature we'll implement.
//             </p>
//             <span className="mt-5 inline-block text-cyan-300">
//               Open documents →
//             </span>
//           </Link>
//         </div>

//         <div className="mt-8 flex items-start gap-3 rounded-2xl border border-slate-800 p-5 text-sm leading-6 text-slate-400">
//           <ShieldCheck className="mt-1 shrink-0 text-cyan-300" size={22} />
//           Keep your medical information private. AI output can be inaccurate
//           and should be verified with a qualified healthcare professional.
//         </div>
//       </section>
//     </main>
//   );
// }


import { Link } from "react-router-dom";
import {
  ArrowRight,
  Activity,
  FileText,
  MessageCircle,
  ShieldCheck,
  HeartPulse,
  Clock3,
  Sparkles,
  Stethoscope,
  LockKeyhole,
} from "lucide-react";

const tools = [
  {
    title: "Health Assistant",
    description:
      "Ask general health questions and prepare useful questions for your doctor.",
    path: "/assistant",
    label: "Open assistant",
    icon: MessageCircle,
    accent: "text-cyan-300",
    iconBg: "bg-cyan-400/10",
    hover: "hover:border-cyan-400/50",
  },
  {
    title: "Medical Documents",
    description:
      "Upload a medical report and get an AI-generated explanation of its contents.",
    path: "/documents",
    label: "Analyze a report",
    icon: FileText,
    accent: "text-violet-300",
    iconBg: "bg-violet-400/10",
    hover: "hover:border-violet-400/50",
  },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#020617]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <HeartPulse className="text-cyan-300" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Zuno<span className="text-cyan-400">.</span>
            </span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl border border-slate-800 px-4 py-2.5 text-sm text-slate-300 transition hover:border-cyan-400/40 hover:text-white"
          >
            <ArrowRight className="rotate-180" size={16} />
            Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-900/50 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/5 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-800/70 bg-cyan-950/50 px-3 py-1.5 text-xs font-medium text-cyan-300">
              <Sparkles size={14} />
              YOUR HEALTH WORKSPACE
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Welcome to Zuno<span className="text-cyan-400">.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Understand health information, explore medical terminology,
              and prepare for more informed conversations with healthcare
              professionals.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/assistant"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                <MessageCircle size={18} />
                Ask Zuno
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/documents"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/40 px-5 py-3 font-semibold text-white transition hover:border-cyan-400/50 hover:bg-slate-800"
              >
                <FileText size={18} />
                Analyze a report
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold sm:text-2xl">
              Your workspace
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Choose a tool to get started.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {tools.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.title}
                  to={tool.path}
                  className={`group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition duration-200 hover:-translate-y-1 hover:bg-slate-900 ${tool.hover}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.iconBg}`}
                    >
                      <Icon className={tool.accent} size={25} />
                    </div>

                    <ArrowRight
                      className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-300"
                      size={20}
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold">
                    {tool.title}
                  </h3>

                  <p className="mt-3 min-h-14 text-sm leading-7 text-slate-400">
                    {tool.description}
                  </p>

                  <span
                    className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${tool.accent}`}
                  >
                    {tool.label}
                    <ArrowRight size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold sm:text-2xl">
              Workspace overview
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Available tools and workspace capabilities.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-cyan-400/10 p-2.5">
                  <Activity className="text-cyan-300" size={21} />
                </div>
                <p className="font-semibold">Health information</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Ask general questions and explore health topics with AI.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-400/10 p-2.5">
                  <FileText className="text-violet-300" size={21} />
                </div>
                <p className="font-semibold">Document explanations</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Review AI-generated explanations of supported medical files.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-400/10 p-2.5">
                  <LockKeyhole className="text-emerald-300" size={21} />
                </div>
                <p className="font-semibold">Privacy reminder</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Avoid sharing unnecessary personal or identifying medical
                information.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-slate-800 p-3">
              <Clock3 className="text-slate-300" size={24} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold">Recent activity</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your recent conversations and document analyses will appear
                here when chat history is connected to a database.
              </p>

              <div className="mt-5 flex items-center gap-3 rounded-xl border border-dashed border-slate-700 p-4">
                <FileText className="shrink-0 text-slate-500" size={20} />
                <p className="text-sm text-slate-500">
                  No saved activity is available yet.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-0.5 shrink-0 text-amber-300"
              size={23}
            />
            <div>
              <h2 className="font-semibold text-amber-200">
                Your health and privacy matter
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Zuno provides general health information, not a diagnosis.
                AI responses and document explanations can be incomplete
                or inaccurate. Verify important findings with a qualified
                healthcare professional. For a medical emergency, seek
                emergency care immediately.
              </p>
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-xs leading-6 text-slate-500">
          Zuno is an AI-powered health information assistant.
          <br />
          It does not replace professional medical care.
        </footer>
      </section>
    </main>
  );
}
