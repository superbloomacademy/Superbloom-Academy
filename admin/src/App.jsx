import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

// Each page is its own chunk, so opening the admin only downloads the page you are on.
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Candidates = lazy(() => import("./pages/Candidates"));
const Admissions = lazy(() => import("./pages/Admissions"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Workshops = lazy(() => import("./pages/Workshops"));
const PaymentSettings = lazy(() => import("./pages/PaymentSettings"));
const Colleges = lazy(() => import("./pages/Colleges"));
const Articles = lazy(() => import("./pages/Articles"));

function PageLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <div className="skeleton h-9 w-56" />
      <div className="skeleton h-5 w-80 max-w-full" />
      <div className="skeleton h-64 w-full" />
    </div>
  );
}

const page = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

export default function App() {
  const { pathname } = useLocation();
  const bare = pathname === "/login";

  return (
    <AuthProvider>
      {bare ? (
        <Suspense fallback={null}>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </Suspense>
      ) : (
        <div className="min-h-screen">
          <Navbar />
          <main className="lg:pl-64">
            <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
              <Suspense fallback={<PageLoading />}>
                <Routes>
                  <Route path="/register" element={<RoleRoute roles={["superadmin"]}><Register /></RoleRoute>} />
                  <Route path="/" element={page(<Dashboard />)} />
                  <Route path="/jobs" element={page(<Jobs />)} />
                  <Route path="/candidates" element={page(<Candidates />)} />
                  <Route path="/admissions" element={page(<Admissions />)} />
                  <Route path="/contacts" element={page(<Contacts />)} />
                  <Route path="/workshops" element={page(<Workshops />)} />
                  <Route path="/payment" element={page(<PaymentSettings />)} />
                  <Route path="/colleges" element={page(<Colleges />)} />
                  <Route path="/articles" element={page(<Articles />)} />
                </Routes>
              </Suspense>
            </div>
          </main>
        </div>
      )}
    </AuthProvider>
  );
}
