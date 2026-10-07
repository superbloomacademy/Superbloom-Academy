import React, { useEffect, useMemo, useState } from "react";
import { Download, MessageCircle, Search, X } from "lucide-react";
import api from "../utils/api";

const regBadge = { pending: "badge-warning", verified: "badge-success", rejected: "badge-danger" };
const label = { pending: "Payment to verify", verified: "Confirmed", rejected: "Rejected" };

const when = (d) =>
  new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

// Quote every cell and add a BOM so Excel opens names and the rupee sign correctly.
// A leading apostrophe stops Excel running a cell that starts with = + - or @ as a formula.
const cell = (v) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};

function downloadCsv(workshop, rows) {
  const header = ["Reference", "Name", "Mobile", "Email", "College", "Year", "Amount (INR)", "UPI reference (UTR)", "Status", "Registered on"];
  const lines = rows.map((r) =>
    [r.code, r.name, r.phone, r.email, r.college, r.year, r.amount, r.utr, label[r.status], when(r.createdAt)].map(cell).join(","),
  );
  const csv = "﻿" + [header.map(cell).join(","), ...lines].join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${workshop.slug}-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Opens WhatsApp with a ready message; the admin presses send.
function whatsappLink(r, workshop) {
  const phone = String(r.phone || "").replace(/\D/g, "").slice(-10);
  const date = new Date(workshop.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const text =
    r.status === "verified"
      ? `Hi ${r.name}, your payment is verified and your seat for "${workshop.title}" on ${date} is confirmed.${r.code ? ` Reference: ${r.code}.` : ""} - Superbloom Academy`
      : r.status === "rejected"
        ? `Hi ${r.name}, we could not match your payment for "${workshop.title}". Please reply with a screenshot of the payment or call us. - Superbloom Academy`
        : `Hi ${r.name}, we received your registration for "${workshop.title}" on ${date} and are checking your payment.${r.code ? ` Reference: ${r.code}.` : ""} - Superbloom Academy`;
  return `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`;
}

export default function RegistrationsPanel({ workshop, onClose, onChanged }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/registrations?workshop=${workshop._id}`)
      .then((res) => setRows(res.data.registrations || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [workshop._id]);

  const setStatus = async (r, status) => {
    const res = await api.patch(`/admin/registrations/${r._id}/status`, { status });
    if (status === "verified")
      setNotice(
        res.data.emailed
          ? `Confirmation email sent to ${r.email}.`
          : `${r.name} is confirmed, but no email was sent. Message them on WhatsApp instead.`,
      );
    else setNotice("");
    setRows((list) => list.map((x) => (x._id === r._id ? { ...x, status } : x)));
    onChanged?.();
  };

  const counts = useMemo(
    () => rows.reduce((c, r) => ({ ...c, [r.status]: (c[r.status] || 0) + 1 }), { all: rows.length }),
    [rows],
  );
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === "all" || r.status === filter) &&
        (!q || [r.name, r.phone, r.email, r.utr, r.code, r.college].some((v) => String(v || "").toLowerCase().includes(q))),
    );
  }, [rows, filter, query]);
  const collected = rows.filter((r) => r.status === "verified").reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <section className="card min-w-0 overflow-hidden" aria-label={`Registrations for ${workshop.title}`}>
      <div className="card-header flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Registrations: {workshop.title}</h2>
          <p className="text-sm text-slate-600">
            {rows.length} registered, {counts.verified || 0} confirmed, {counts.pending || 0} to verify, ₹{collected} collected
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => downloadCsv(workshop, rows)} disabled={!rows.length} className="btn-primary btn-sm">
            <Download size={16} aria-hidden /> Download CSV
          </button>
          <button onClick={onClose} aria-label="Close registrations" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
            <X size={18} aria-hidden />
          </button>
        </div>
      </div>

      {notice && (
        <p role="status" className="border-b border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-700 sm:px-6">
          {notice}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-3 sm:px-6">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
          {[["all", "All"], ["pending", "To verify"], ["verified", "Confirmed"], ["rejected", "Rejected"]].map(([key, text]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`min-h-[2.25rem] rounded-lg px-3 text-sm font-semibold transition-colors duration-150 ${
                filter === key ? "bg-ink text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {text} ({counts[key] || 0})
            </button>
          ))}
        </div>
        <label className="relative ml-auto w-full sm:w-64">
          <span className="sr-only">Search registrations</span>
          <Search size={16} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, mobile, UTR or reference" className="input-field !min-h-[2.25rem] py-1.5 pl-9 text-sm" />
        </label>
      </div>

      {loading ? (
        <div className="space-y-3 p-6">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-12" />)}</div>
      ) : shown.length === 0 ? (
        <p className="p-10 text-center text-slate-500">
          {rows.length === 0 ? "No one has registered for this workshop yet." : "No registrations match this filter."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr><th>Student</th><th>Contact</th><th>College</th><th>Paid</th><th>UPI reference (UTR)</th><th>Status</th><th className="text-right">Actions</th></tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div className="whitespace-nowrap font-semibold">{r.name}</div>
                    <div className="font-mono text-xs text-slate-500">{r.code || "no reference"}</div>
                  </td>
                  <td className="text-sm text-slate-700">{r.phone}<div className="text-xs text-slate-500">{r.email}</div></td>
                  <td className="max-w-[13rem] text-sm text-slate-700">{r.college || "-"}<div className="text-xs text-slate-500">{r.year}</div></td>
                  <td className="whitespace-nowrap text-sm">{r.amount ? `₹${r.amount}` : "Free"}</td>
                  <td className="font-mono text-sm">{r.utr || "-"}</td>
                  <td>
                    <span className={regBadge[r.status]}>{label[r.status]}</span>
                    <div className="mt-1 text-xs text-slate-500">{when(r.createdAt)}</div>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                      {r.status !== "verified" && <button onClick={() => setStatus(r, "verified")} className="btn-primary btn-sm">Mark verified</button>}
                      {r.status !== "rejected" && <button onClick={() => setStatus(r, "rejected")} className="btn-secondary btn-sm">Reject</button>}
                      <a
                        href={whatsappLink(r, workshop)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Send the status on WhatsApp"
                        aria-label={`Message ${r.name} on WhatsApp`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      >
                        <MessageCircle size={18} aria-hidden />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
