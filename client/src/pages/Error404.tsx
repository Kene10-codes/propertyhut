import { ArrowLeft, House } from "lucide-react";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <main className="flex min-h-[65vh] items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <House aria-hidden="true" className="h-8 w-8" />
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
          Error 404
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
          Looks like you took a wrong turn.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
          The page you are looking for may have moved, or it may no longer be
          available. Let’s get you back to finding your place.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </main>
  );
};

export default Error404;
