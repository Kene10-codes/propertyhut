import { useState } from "react";
import { X, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/buy", label: "Buy" },
  { to: "/rent", label: "Rent" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-slate-900 text-white shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ");

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            className="group flex items-center gap-3 rounded-full px-2 py-1.5 transition-transform duration-200 hover:scale-[1.01]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-base font-black text-white shadow-lg shadow-emerald-500/30">
              P
            </span>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Property<span className="text-emerald-600">Hut</span>
            </span>
          </NavLink>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass}>
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {isOpen ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="block sm:hidden cursor-pointer"
          >
            <X />
          </button>
        ) : (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="block sm:hidden cursor-pointer"
          >
            <Menu />
          </button>
        )}

        {isOpen && (
          <div
            className={
              "sm:hidden absolute left-0 top-18 w-full pt-4 z-50 gap-4 px-6 shadow-md bg-emerald-100 h-[60vw] max-h-screen flex flex-col items-center md:hidden"
            }
          >
            <NavLink
              to="/post-property"
              className="sm:hidden my-2 text-center w-full rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors duration-200 hover:border-emerald-300 hover:bg-emerald-100 sm:inline-flex"
            >
              Post Property
            </NavLink>

            <NavLink
              to="/signup"
              className="rounded-full mb-2 w-full text-center border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              Sign up
            </NavLink>

            <NavLink
              to="/login"
              className="rounded-full w-full text-center bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:bg-slate-800"
            >
              Log in
            </NavLink>
          </div>
        )}

        <div className={"flex items-center gap-3 hidden sm:block"}>
          <NavLink
            to="/post-property"
            className="md-hidden rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors duration-200 hover:border-emerald-300 hover:bg-emerald-100 sm:inline-flex"
          >
            Post Property
          </NavLink>

          <NavLink
            to="/signup"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            Sign up
          </NavLink>

          <NavLink
            to="/login"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:bg-slate-800"
          >
            Log in
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
