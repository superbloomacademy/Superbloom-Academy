import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: "📊", path: "/" },
  { label: "Jobs", icon: "💼", path: "/jobs" },
  { label: "Candidates", icon: "👥", path: "/candidates" },
  { label: "Admissions", icon: "🎓", path: "/admissions" },
  { label: "Contacts", icon: "📧", path: "/contacts" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex-col fixed h-screen border-r border-slate-700 shadow-lg">
        <div className="p-6 border-b border-slate-700">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center font-bold text-lg">S</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Superbloom</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        {user && (
          <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path) ? "bg-primary-600 text-white shadow-lg" : "text-slate-300 hover:bg-slate-700/50 hover:text-white"}`}>
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        )}

        <div className="p-4 border-t border-slate-700">
          {user ? (
            <div className="space-y-3">
              <div className="px-4 py-3 bg-slate-700/30 rounded-lg border border-slate-600">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs text-slate-400">{user.role}</p>
              </div>
              <button onClick={logout} className="w-full btn-danger btn-sm flex items-center justify-center gap-2"><span></span> Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary w-full text-center">Login</Link>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">S</div>
            <span>Superbloom</span>
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-slate-800 transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
              <span className={`block w-6 h-0.5 bg-slate-800 transition-opacity ${isOpen ? "opacity-0" : ""}`}></span>
              <span className={`block w-6 h-0.5 bg-slate-800 transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
            </div>
          </button>
        </div>

        {isOpen && (
          <nav className="border-t border-slate-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              {user && navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path) ? "bg-primary-100 text-primary-700" : "text-slate-600 hover:bg-slate-100"}`}>
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              ))}
              {user && (<button onClick={() => { logout(); setIsOpen(false); }} className="w-full btn-danger btn-sm mt-4">Logout</button>)}
            </div>
          </nav>
        )}
      </div>

      <div className="md:hidden h-16"></div>
    </>
  );
}
