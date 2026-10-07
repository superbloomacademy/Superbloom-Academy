import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Briefcase, CalendarDays, ChartColumn, CreditCard, FileText, GraduationCap, LayoutDashboard, LogOut, Mail, Megaphone,
  Menu, School, UserPlus, Users, X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Grouped by the job the admin is doing, not by when the page was built.
const groups = [
  { items: [{ label: "Dashboard", icon: LayoutDashboard, path: "/" }] },
  {
    title: "Enquiries",
    items: [
      { label: "Admissions", icon: GraduationCap, path: "/admissions" },
      { label: "College enquiries", icon: School, path: "/colleges" },
      { label: "Messages", icon: Mail, path: "/contacts" },
    ],
  },
  {
    title: "Workshops",
    items: [
      { label: "Workshops", icon: CalendarDays, path: "/workshops" },
      { label: "Payment details", icon: CreditCard, path: "/payment" },
    ],
  },
  {
    title: "Website",
    items: [
      { label: "Announcements", icon: Megaphone, path: "/announcements" },
      { label: "Articles", icon: FileText, path: "/articles" },
      { label: "Analytics", icon: ChartColumn, path: "/analytics" },
    ],
  },
  {
    title: "Hiring",
    items: [
      { label: "Jobs", icon: Briefcase, path: "/jobs" },
      { label: "Candidates", icon: Users, path: "/candidates" },
    ],
  },
];

function NavLinks({ onNavigate }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const all = user?.role === "superadmin"
    ? [...groups, { title: "Team", items: [{ label: "Add an admin", icon: UserPlus, path: "/register" }] }]
    : groups;

  return (
    <nav aria-label="Admin" className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
      {all.map((g, i) => (
        <div key={g.title || i}>
          {g.title && <p className="px-3 pb-1.5 text-xs font-semibold text-white/50">{g.title}</p>}
          <ul className="space-y-0.5">
            {g.items.map(({ label, icon: Icon, path }) => {
              const active = pathname === path;
              return (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-[2.75rem] items-center gap-3 rounded-lg px-3 text-[0.95rem] font-medium transition-colors duration-150 ${
                      active ? "bg-bloom text-ink" : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={19} aria-hidden />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bloom font-display text-xl font-bold text-ink">S</span>
      <span>
        <span className="block font-display text-lg font-bold leading-tight text-white">Superbloom</span>
        <span className="block text-xs text-white/60">Admin panel</span>
      </span>
    </Link>
  );
}

function Account({ onNavigate }) {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div className="border-t border-white/10 p-3">
      <div className="rounded-lg bg-white/5 px-3 py-2.5">
        <p className="truncate text-sm font-semibold text-white">{user.name || user.email}</p>
        <p className="truncate text-xs text-white/60">{user.email}</p>
      </div>
      <button
        onClick={() => {
          onNavigate?.();
          logout();
        }}
        className="mt-2 flex min-h-[2.75rem] w-full items-center gap-3 rounded-lg px-3 text-[0.95rem] font-medium text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white"
      >
        <LogOut size={19} aria-hidden /> Log out
      </button>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  // lock page scroll and allow Escape while the drawer is open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink lg:flex">
        <div className="border-b border-white/10 p-5">
          <Brand />
        </div>
        <NavLinks />
        <Account />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-ink px-4 lg:hidden">
        <Brand />
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-white/10"
        >
          <Menu aria-hidden />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button aria-label="Close menu" className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} />
          <div className="animate-slide-in absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-ink">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <Brand />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-white/10"
              >
                <X aria-hidden />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <Account onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
