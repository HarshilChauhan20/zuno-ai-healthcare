
import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  HeartPulse,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="text-2xl font-bold">
          Zuno<span className="text-cyan-400">.</span>
        </Link>

        <Link
          to="/dashboard"
          className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
        >
          Open dashboard
        </Link>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            <Sparkles size={16} />
            AI-powered healthcare information
          </div>

          <h1 className="mt-7 text-5xl font-bold leading-tight sm:text-7xl">
            Your health.
            <br />
            <span className="text-cyan-400">Better understood.</span>
          </h1>

          <p className="mt-6 max-w-xl leading-8 text-slate-400">
            Organize health information, understand medical reports
            in simpler language, and prepare useful questions for
            your healthcare professional.
          </p>

          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-4 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Get started <ArrowRight size={18} />
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7 sm:p-10">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-cyan-400/10 p-4 text-cyan-300">
              <HeartPulse size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Welcome to Zuno</h2>
              <p className="mt-1 text-sm text-slate-400">
                Your health information workspace
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              to="/assistant"
              className="flex items-center gap-4 rounded-2xl border border-slate-800 p-5 hover:border-cyan-400/50"
            >
              <Sparkles className="text-cyan-300" />
              <div>
                <p className="font-medium">AI Health Assistant</p>
                <p className="mt-1 text-sm text-slate-400">
                  Ask general healthcare information questions
                </p>
              </div>
            </Link>

            <Link
              to="/documents"
              className="flex items-center gap-4 rounded-2xl border border-slate-800 p-5 hover:border-cyan-400/50"
            >
              <FileText className="text-cyan-300" />
              <div>
                <p className="font-medium">Medical Documents</p>
                <p className="mt-1 text-sm text-slate-400">
                  Explore the document workspace
                </p>
              </div>
            </Link>

            <div className="flex items-start gap-3 rounded-2xl bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-200">
              <ShieldCheck className="mt-1 shrink-0" size={20} />
              Zuno provides informational support, not medical diagnosis
              or treatment.
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-6 py-7 text-center text-sm text-slate-500">
        Zuno — making healthcare information easier to understand.
      </footer>
    </main>
  );
}
