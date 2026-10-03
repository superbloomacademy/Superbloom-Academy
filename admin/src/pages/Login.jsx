import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
    } catch (err) {
      const status = err.response?.status;
      setError(
        status === 401
          ? "The email or password is not right."
          : status === 429
            ? "Too many attempts. Wait a few minutes and try again."
            : !err.response
              ? "Cannot reach the server. Check your connection and try again."
              : err.response?.data?.message || "Could not sign in.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{ backgroundImage: "radial-gradient(rgb(255 255 255 / 0.16) 1px, transparent 1.5px)", backgroundSize: "18px 18px" }}
        />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-bloom font-display text-2xl font-bold text-ink">S</span>
          <span className="font-display text-xl font-bold">Superbloom Academy</span>
        </div>
        <div className="relative">
          <h1 className="font-display text-5xl font-bold leading-tight">Admin panel</h1>
          <p className="mt-4 max-w-md text-lg text-white/80">
            Admissions, college enquiries, workshops and payments, articles and hiring, in one place.
          </p>
        </div>
        <p className="relative text-sm text-white/60">© {new Date().getFullYear()} Superbloom Academy</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink font-display text-2xl font-bold text-bloom">S</span>
            <span className="font-display text-xl font-bold">Superbloom Admin</span>
          </div>
          <h2 className="text-3xl font-bold">Sign in</h2>
          <p className="mt-2 text-slate-600">Use your admin email and password.</p>

          {error && <div role="alert" className="alert-error mt-6 text-sm font-medium">{error}</div>}

          <label className="mt-6 block text-sm font-semibold text-slate-800">
            Email
            <input type="email" className="input-field mt-1.5" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={busy} />
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-800">
            Password
            <input type="password" className="input-field mt-1.5" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={busy} />
          </label>

          <button type="submit" className="btn-primary mt-6 w-full py-3" disabled={busy}>
            {busy ? <><Loader2 size={18} className="animate-spin" aria-hidden /> Signing in</> : "Sign in"}
          </button>
          <p className="mt-6 text-sm text-slate-500">New accounts are created by a superadmin from inside the panel.</p>
        </form>
      </div>
    </div>
  );
}
