
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-4 text-slate-400">This Zuno page doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
      >
        Back to home
      </Link>
    </main>
  );
}
