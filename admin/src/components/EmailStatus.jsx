import React, { useEffect, useState } from "react";
import { Mail, RefreshCw, Send } from "lucide-react";
import api from "../utils/api";

const when = (d) =>
  new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const kindLabel = { received: "Registration received", confirmed: "Seat confirmed", rejected: "Payment not verified" };

// Shows whether workshop emails can be sent, why not when they cannot,
// and what happened to the emails of the last 30 days.
export default function EmailStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [to, setTo] = useState("");
  const [sending, setSending] = useState(false);
  const [test, setTest] = useState(null); // { ok, text }

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.get("/admin/email/status");
      setStatus(res.data);
    } catch (err) {
      setLoadError(err.response?.data?.message || "Could not check the email status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sendTest = async (e) => {
    e.preventDefault();
    setSending(true);
    setTest(null);
    try {
      const res = await api.post("/admin/email/test", { to });
      setTest(
        res.data.status === "sent"
          ? { ok: true, text: `Test email sent to ${res.data.to}. Check the inbox and the spam folder.` }
          : { ok: false, text: res.data.error || "The test email was not sent." },
      );
      load();
    } catch (err) {
      setTest({ ok: false, text: err.response?.data?.message || "The test email was not sent." });
    } finally {
      setSending(false);
    }
  };

  const state = !status ? null : status.working ? "working" : status.configured ? "problem" : "off";
  const badge = { working: ["badge-success", "Working"], problem: ["badge-danger", "Not working"], off: ["badge-warning", "Not set up"] }[state] || [];

  return (
    <section className="card mb-8" aria-label="Workshop emails">
      <div className="card-header flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Mail size={20} aria-hidden className="text-slate-500" />
          <h2 className="text-lg font-bold text-slate-900">Workshop emails</h2>
          {state && <span className={badge[0]}>{badge[1]}</span>}
        </div>
        <button onClick={load} disabled={loading} className="btn-secondary btn-sm">
          <RefreshCw size={16} aria-hidden className={loading ? "animate-spin" : ""} /> Check again
        </button>
      </div>

      <div className="card-body space-y-5">
        {loading && !status ? (
          <div className="skeleton h-16" />
        ) : loadError ? (
          <div className="alert-error">{loadError}</div>
        ) : (
          <>
            {state === "working" && (
              <p className="text-sm text-slate-700">
                Students are emailed from <strong>{status.from}</strong> when they register and again when you verify or reject
                their payment.
              </p>
            )}
            {state === "off" && (
              <div className="alert-warning">
                <p className="font-semibold">No emails are being sent.</p>
                <p className="mt-1">
                  The server is missing: <strong>{status.missing.join(", ")}</strong>. Add them in Vercel (backend project,
                  Settings, Environment Variables), then redeploy the backend and press Check again.
                </p>
              </div>
            )}
            {state === "problem" && (
              <div className="alert-error">
                <p className="font-semibold">Emails are failing.</p>
                <p className="mt-1">{status.error}</p>
                <p className="mt-1 text-sm">
                  Server: {status.host}, port {status.port}, login {status.user}. Fix the value in Vercel, redeploy the
                  backend and press Check again.
                </p>
              </div>
            )}

            <dl className="grid grid-cols-3 gap-3 text-center sm:max-w-md">
              {[["Sent", status.last30.sent, "text-emerald-700"], ["Failed", status.last30.failed, "text-red-700"], ["Not sent", status.last30.skipped, "text-amber-700"]].map(
                ([name, n, colour]) => (
                  <div key={name} className="rounded-lg bg-slate-50 px-3 py-2.5 ring-1 ring-inset ring-slate-200">
                    <dd className={`text-2xl font-bold ${n ? colour : "text-slate-400"}`}>{n}</dd>
                    <dt className="text-xs font-medium text-slate-600">{name}, last 30 days</dt>
                  </div>
                ),
              )}
            </dl>

            <form onSubmit={sendTest} className="flex flex-wrap items-end gap-3">
              <label className="w-full text-sm font-medium text-slate-700 sm:w-80">
                Send a test email to
                <input
                  type="email"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder={status.user || "you@example.com"}
                  className="input-field mt-1"
                />
              </label>
              <button type="submit" disabled={sending || state === "off"} className="btn-primary">
                <Send size={16} aria-hidden /> {sending ? "Sending..." : "Send test"}
              </button>
            </form>
            {test && <div role="status" className={test.ok ? "alert-success" : "alert-error"}>{test.text}</div>}

            {status.problems.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-bold text-slate-900">Emails that did not go out</h3>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr><th>When</th><th>Student</th><th>Email</th><th>Reason</th></tr>
                    </thead>
                    <tbody>
                      {status.problems.map((p, i) => (
                        <tr key={i}>
                          <td className="whitespace-nowrap text-sm text-slate-600">{when(p.at)}</td>
                          <td className="text-sm">
                            <div className="font-medium text-slate-900">{p.name}</div>
                            <div className="text-xs text-slate-500">{p.email}</div>
                          </td>
                          <td className="whitespace-nowrap text-sm text-slate-700">{kindLabel[p.kind]}</td>
                          <td className="text-sm text-slate-700">{p.error || "Not sent"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Open the workshop's registrations to send any of these again.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
