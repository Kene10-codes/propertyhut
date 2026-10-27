import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";

const footerSections = [
  {
    title: "Explore",
    links: [
      { to: "/buy", label: "Buy a home" },
      { to: "/rent", label: "Rent a home" },
      { to: "/post-property", label: "List property" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About us" },
      { to: "/agents", label: "Agents" },
      { to: "/contact", label: "Contact" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-black text-white shadow-lg shadow-emerald-500/30">
                P
              </span>
              <span className="text-2xl font-black tracking-tight text-white">
                Property<span className="text-emerald-400">Hut</span>
              </span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Helping buyers, renters, and sellers discover exceptional homes
              with clarity, confidence, and local expertise.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                {section.title}
              </h3>

              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className="text-sm text-slate-300 transition hover:text-white"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Contact
            </h3>

            <ul className="mt-4 space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-emerald-400" />
                <span>Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>+234 000 000 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span>hello@propertyhut.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 PropertyHut. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <NavLink to="/privacy" className="transition hover:text-white">
              Privacy
            </NavLink>
            <NavLink to="/terms" className="transition hover:text-white">
              Terms
            </NavLink>
            <NavLink to="/support" className="transition hover:text-white">
              Support
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
