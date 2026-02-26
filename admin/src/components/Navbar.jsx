import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="mx-4">
        <div className="flex md:flex-col items-start justify-between h-auto md:h-screen py-4">
          <div className="flex flex-col h-[50%]">
            {/* Logo */}
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-gray-800 mb-8"
            >
              Superbloom
            </Link>

            {/* Desktop Nav */}
            {user && (
              <nav className="hidden md:flex md:flex-col items-left h-1/2 justify-around">
                <Link to="/" className="nav-link">
                  Dashboard
                </Link>
                <Link to="/jobs" className="nav-link">
                  Jobs
                </Link>
                <Link to="/candidates" className="nav-link">
                  Candidates
                </Link>
                <Link to="/admissions" className="nav-link">
                  Admissions
                </Link>
                <Link to="/contacts" className="nav-link">
                  Contacts
                </Link>
              </nav>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-end w-full">
            {!user ? (
              <Link
                to="/login"
                className="hidden md:inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={logout}
                className="hidden md:inline-block bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-full transition w-full"
              >
                Logout
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden focus:outline-none border"
            >
              <div className="space-y-1">
                <span className="block w-6 h-0.5 bg-gray-800"></span>
                <span className="block w-6 h-0.5 bg-gray-800"></span>
                <span className="block w-6 h-0.5 bg-gray-800"></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3 flex flex-col items-center">
            {user && (
              <>
                <Link
                  to="/jobs"
                  className="mobile-link"
                  onClick={() => setIsOpen(false)}
                >
                  Jobs
                </Link>
                <Link
                  to="/candidates"
                  className="mobile-link"
                  onClick={() => setIsOpen(false)}
                >
                  Candidates
                </Link>
                <Link
                  to="/admissions"
                  className="mobile-link"
                  onClick={() => setIsOpen(false)}
                >
                  Admissions
                </Link>
                <Link
                  to="/contacts"
                  className="mobile-link"
                  onClick={() => setIsOpen(false)}
                >
                  Contacts
                </Link>
              </>
            )}

            {!user ? (
              <Link
                to="/login"
                className="text-blue-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-full"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reusable Tailwind Classes */}
      <style>
        {`
          .nav-link {
            font-size: 0.875rem;
            font-weight: 500;
            color: #4B5563;
            transition: color 0.2s ease;
          }
          .nav-link:hover {
            color: #111827;
          }
          .mobile-link {
            font-size: 0.95rem;
            font-weight: 500;
            color: #374151;
          }
        `}
      </style>
    </header>
  );
}
