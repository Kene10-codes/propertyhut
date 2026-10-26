import { useState } from "react";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full max-w-2xl">
      <form className="relative w-full">
        <input
          type="search"
          aria-label="Search properties"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-14 w-full rounded-full border border-slate-200 bg-white/95 py-3 pl-6 pr-32 text-base text-slate-900 shadow-xl shadow-slate-900/10 outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 active:scale-95"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
