import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pause, RotateCcw, Send, X } from "lucide-react";
import api from "../utils/api";

const tone = {
  pending: ["badge-warning", "Waiting"],
  sent: ["badge-success", "Sent"],
  delivered: ["badge-success", "Delivered"],
  read: ["badge-info", "Read"],
  failed: ["badge-danger", "Failed"],
  skipped: ["badge bg-slate-100 text-slate-600", "Not sent"],
};

const when = (d) =>
  d ? new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function Status({ value }) {
  if (!value || value.status === "none") return <span className="text-slate-400">-</span>;
  const [cls, text] = tone[value.status] || tone.skipped;
  return (
    <div>
      <span className={cls}>{text}</span>
      {value.error && <div className="mt-1 max-w-[18rem] text-xs text-slate-600">{value.error}</div>}
      {!value.error && value.at && <div className="mt-1 text-xs text-slate-500">{when(value.at)}</div>}
    </div>
  );
}

// How many went out on one channel, e.g. "42 sent, 3 failed"
const summary = (c = {}) => {
  const done = (c.sent || 0) + (c.delivered || 0) + (c.read || 0);
  return [
    `${done} sent`,
    c.read ? `${c.read} read` : "",
    c.failed ? `${c.failed} failed` : "",
    c.skipped ? `${c.skipped} not sent` : "",
    c.pending ? `${c.pending} waiting` : "",
  ].filter(Boolean).join(", ");
};

// One campaign: who is on the list, a test send, the real send with its progress, and the result per student.
export default function CampaignPanel({ id, summary: added, onClose, onChanged }) {
  const [campaign, setCampaign] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState(null); // { ok, text }
  const [test, setTest] = useState({ email: "", phone: "" });
  const [testing, setTesting] = useState(false);
  const stop = useRef(false);

  const load = async () => {
    try {
      const res = await api.get(`/admin/campaigns/${id}`);
      setCampaign(res.data.campaign);
      setRows(res.data.recipients || []);
    } catch (err) {
      setNotice({ ok: false, text: err.response?.data?.message || "Could not open the campaign." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setNotice(null);
    setFilter("all");
    load();
    return () => {
      stop.current = true;
    };
  }, [id]);

  // closing the tab in the middle of a send stops it, so ask first
  useEffect(() => {
    if (!sending) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [sending]);

  const counts = campaign?.counts || { total: 0, pending: 0, mail: {}, whatsapp: {} };
  const failed = (counts.mail.failed || 0) + (counts.whatsapp.failed || 0);
  const done = counts.total - counts.pending;

  // The server sends for a few seconds per request; keep asking until no one is waiting.
  const run = async () => {
    stop.current = false;
    setSending(true);
    setNotice(null);
    try {
      for (;;) {
        const res = await api.post(`/admin/campaigns/${id}/send`);
        setCampaign((c) => ({ ...c, status: res.data.status, counts: res.data.counts }));
        if (!res.data.remaining) {
          setNotice({ ok: true, text: "Finished. The result for each student is in the list below." });
          break;
        }
        if (stop.current) {
          setNotice({ ok: true, text: `Paused. ${res.data.remaining} students are still waiting; press Continue sending to carry on.` });
          break;
        }
        await sleep(800);
      }
    } catch (err) {
      setNotice({ ok: false, text: err.response?.data?.message || "Sending stopped because the server did not answer. Press Continue sending to carry on; no one gets the message twice." });
    } finally {
      setSending(false);
      load();
      onChanged?.();
    }
  };

  const start = () => {
    const via = [campaign.channels.email && "email", campaign.channels.whatsapp && "WhatsApp"].filter(Boolean).join(" and ");
    if (confirm(`Send this message by ${via} to ${counts.pending} students now?`)) run();
  };

  const retry = async () => {
    try {
      await api.post(`/admin/campaigns/${id}/retry`);
      await load();
      run();
    } catch (err) {
      setNotice({ ok: false, text: err.response?.data?.message || "Could not try again." });
    }
  };

  const sendTest = async (e) => {
    e.preventDefault();
    setTesting(true);
    setNotice(null);
    try {
      const res = await api.post(`/admin/campaigns/${id}/test`, test);
      const parts = [
        res.data.mail && (res.data.mail.status === "sent" ? `Email sent to ${test.email}.` : `Email not sent: ${res.data.mail.error}`),
        res.data.whatsapp && (res.data.whatsapp.status === "sent" ? `WhatsApp sent to ${test.phone}.` : `WhatsApp not sent: ${res.data.whatsapp.error}`),
      ].filter(Boolean);
      const ok = [res.data.mail, res.data.whatsapp].filter(Boolean).every((r) => r.status === "sent");
      setNotice({ ok, text: `Test: ${parts.join(" ")}` });
    } catch (err) {
      setNotice({ ok: false, text: err.response?.data?.message || "The test was not sent." });
    } finally {
      setTesting(false);
    }
  };

  const shown = useMemo(
    () =>
      rows.filter((r) =>
        filter === "all" ? true : [r.mail?.status, r.whatsapp?.status].includes(filter),
      ),
    [rows, filter],
  );

  if (loading)
    return <section className="card mb-8 p-6"><div className="skeleton h-40" /></section>;
  if (!campaign)
    return <section className="card mb-8 p-6">{notice && <div className="alert-error">{notice.text}</div>}</section>;

  return (
    <section className="card mb-8 min-w-0 overflow-hidden" aria-label={`Campaign ${campaign.name}`}>
      <div className="card-header flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{campaign.name}</h2>
          <p className="text-sm text-slate-600">
            {counts.total} students
            {campaign.channels.email && <>. Email: {summary(counts.mail)}</>}
            {campaign.channels.whatsapp && <>. WhatsApp: {summary(counts.whatsapp)}</>}
          </p>
        </div>
        <button onClick={onClose} aria-label="Close campaign" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
          <X size={18} aria-hidden />
        </button>
      </div>

      <div className="card-body space-y-5">
        {added && (
          <p className="text-sm text-slate-700">
            Saved with {added.added} students.
            {added.duplicates > 0 && ` ${added.duplicates} repeats removed.`}
            {added.noContact > 0 && ` ${added.noContact} left out: no usable email or mobile number.`}
            {added.optedOut > 0 && ` ${added.optedOut} left out: they asked not to be contacted.`}
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {campaign.channels.email && (
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
              <p className="text-xs font-semibold text-slate-600">Email</p>
              <p className="mt-1 font-semibold text-slate-900">{campaign.email.subject}</p>
              <p className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap text-sm text-slate-700">{campaign.email.message}</p>
              {campaign.email.buttonText && <p className="mt-2 text-sm text-slate-600">Button: {campaign.email.buttonText} ({campaign.email.buttonUrl})</p>}
            </div>
          )}
          {campaign.channels.whatsapp && (
            <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-inset ring-emerald-200">
              <p className="text-xs font-semibold text-emerald-800">WhatsApp template: {campaign.whatsapp.template}</p>
              <p className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap text-sm text-slate-900">{campaign.whatsapp.preview}</p>
              {campaign.whatsapp.body?.length > 0 && (
                <p className="mt-2 text-sm text-slate-600">
                  {campaign.whatsapp.body.map((v) => `{{${v.name}}} = ${v.value}`).join(", ")}
                </p>
              )}
            </div>
          )}
        </div>

        <form onSubmit={sendTest} className="flex flex-wrap items-end gap-3">
          {campaign.channels.email && (
            <label className="w-full text-sm font-medium text-slate-700 sm:w-64">Test email to
              <input type="email" value={test.email} onChange={(e) => setTest({ ...test, email: e.target.value })} placeholder="you@example.com" className="input-field mt-1" />
            </label>
          )}
          {campaign.channels.whatsapp && (
            <label className="w-full text-sm font-medium text-slate-700 sm:w-56">Test WhatsApp to
              <input value={test.phone} onChange={(e) => setTest({ ...test, phone: e.target.value })} placeholder="Your mobile number" inputMode="tel" className="input-field mt-1" />
            </label>
          )}
          <button type="submit" disabled={testing || sending} className="btn-secondary">{testing ? "Sending..." : "Send a test to me"}</button>
        </form>

        {counts.total > 0 && (
          <div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label="Students handled" aria-valuemin={0} aria-valuemax={counts.total} aria-valuenow={done}>
              <div className="h-full rounded-full bg-primary-600 transition-[width] duration-300" style={{ width: `${(done / counts.total) * 100}%` }} />
            </div>
            <p className="mt-1.5 text-sm text-slate-600">{done} of {counts.total} students handled{sending && ". Keep this page open while it sends."}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {sending ? (
            <button onClick={() => (stop.current = true)} className="btn-secondary"><Pause size={16} aria-hidden /> Pause</button>
          ) : (
            counts.pending > 0 && (
              <button onClick={campaign.status === "draft" ? start : run} className="btn-primary">
                <Send size={16} aria-hidden /> {campaign.status === "draft" ? `Send to ${counts.pending} students` : "Continue sending"}
              </button>
            )
          )}
          {!sending && failed > 0 && (
            <button onClick={retry} className="btn-secondary"><RotateCcw size={16} aria-hidden /> Try the {failed} failed again</button>
          )}
        </div>

        {notice && <div role="status" className={notice.ok ? "alert-success" : "alert-error"}>{notice.text}</div>}
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-slate-200 px-5 py-3 sm:px-6" role="group" aria-label="Filter students">
        {[["all", "All"], ["pending", "Waiting"], ["failed", "Failed"], ["skipped", "Not sent"], ["read", "Read"]].map(([key, text]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={`min-h-[2.25rem] rounded-lg px-3 text-sm font-semibold transition-colors duration-150 ${
              filter === key ? "bg-ink text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="border-t border-slate-200 p-10 text-center text-slate-500">No students match this filter.</p>
      ) : (
        <div className="max-h-[32rem] overflow-auto border-t border-slate-200">
          <table className="table">
            <thead>
              <tr><th>Student</th><th>Contact</th>{campaign.channels.email && <th>Email</th>}{campaign.channels.whatsapp && <th>WhatsApp</th>}</tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div className="font-semibold">{r.name || "No name"}</div>
                    <div className="text-xs text-slate-500">{r.college}</div>
                  </td>
                  <td className="text-sm text-slate-700">{r.phone ? `+${r.phone}` : "-"}<div className="text-xs text-slate-500">{r.email}</div></td>
                  {campaign.channels.email && <td><Status value={r.mail} /></td>}
                  {campaign.channels.whatsapp && <td><Status value={r.whatsapp} /></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
