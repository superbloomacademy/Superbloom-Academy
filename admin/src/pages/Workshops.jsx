import React, { useEffect, useState } from "react";
import api from "../utils/api";
import RegistrationsPanel from "../components/RegistrationsPanel";
import EmailStatus from "../components/EmailStatus";

const empty = {
  title: "", slug: "", summary: "", description: "", category: "general", date: "", time: "",
  mode: "offline", venue: "", trainer: "", price: 0, earlyBirdPrice: "", earlyBirdUntil: "",
  seats: "", registrationDeadline: "", audience: "", learn: "", agenda: "", certificate: false,
  status: "draft",
};

const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
const lines = (s) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const showDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "-";

const statusBadge = { draft: "badge-warning", published: "badge-success", closed: "badge-danger" };

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null); // null = closed
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/workshops");
      setWorkshops(res.data.workshops || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(empty);
    setError("");
  };

  const openEdit = (w) => {
    setEditingId(w._id);
    setForm({
      ...empty,
      ...w,
      date: day(w.date),
      earlyBirdUntil: day(w.earlyBirdUntil),
      registrationDeadline: day(w.registrationDeadline),
      earlyBirdPrice: w.earlyBirdPrice ?? "",
      seats: w.seats ?? "",
      learn: (w.learn || []).join("\n"),
      agenda: (w.agenda || []).join("\n"),
    });
    setError("");
  };

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = { ...form, learn: lines(form.learn), agenda: lines(form.agenda) };
    try {
      if (editingId) await api.put(`/admin/workshops/${editingId}`, payload);
      else await api.post("/admin/workshops", payload);
      setForm(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the workshop.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (w) => {
    if (!confirm(`Delete "${w.title}"?`)) return;
    try {
      await api.delete(`/admin/workshops/${w._id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete the workshop.");
    }
  };

  const openRegistrations = (w) => setSelected(w);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Workshops</h1>
          <p className="text-slate-600">Create workshops and check payments for registrations.</p>
        </div>
        <button onClick={openNew} className="btn-primary">+ New workshop</button>
      </div>

      {form && (
        <form onSubmit={save} className="card mb-8">
          <div className="card-header">
            <h2 className="text-lg font-bold text-slate-900">{editingId ? "Edit workshop" : "New workshop"}</h2>
          </div>
          <div className="card-body grid md:grid-cols-2 gap-4">
            <label className="md:col-span-2 text-sm font-medium text-slate-700">Title *
              <input name="title" value={form.title} onChange={set} required className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">URL name (slug)
              <input name="slug" value={form.slug} onChange={set} placeholder="Leave empty to use the title" className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">Category
              <select name="category" value={form.category} onChange={set} className="input-field mt-1">
                <option value="general">General</option>
                <option value="engineering">Engineering</option>
                <option value="pharmacy">Pharmacy</option>
              </select>
            </label>
            <label className="md:col-span-2 text-sm font-medium text-slate-700">One-line summary
              <input name="summary" value={form.summary} onChange={set} className="input-field mt-1" />
            </label>
            <label className="md:col-span-2 text-sm font-medium text-slate-700">Description
              <textarea name="description" value={form.description} onChange={set} className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">Date *
              <input type="date" name="date" value={form.date} onChange={set} required className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">Time
              <input name="time" value={form.time} onChange={set} placeholder="10:00 AM to 1:00 PM" className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">Mode
              <select name="mode" value={form.mode} onChange={set} className="input-field mt-1">
                <option value="offline">Offline (in person)</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">Venue or meeting link note
              <input name="venue" value={form.venue} onChange={set} className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">Trainer
              <input name="trainer" value={form.trainer} onChange={set} className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">Who can attend
              <input name="audience" value={form.audience} onChange={set} className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">Price in ₹ (0 = free)
              <input type="number" min="0" name="price" value={form.price} onChange={set} className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">Seats (empty = unlimited)
              <input type="number" min="0" name="seats" value={form.seats} onChange={set} className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">Early-bird price in ₹
              <input type="number" min="0" name="earlyBirdPrice" value={form.earlyBirdPrice} onChange={set} className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">Early-bird price until
              <input type="date" name="earlyBirdUntil" value={form.earlyBirdUntil} onChange={set} className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">Registration closes on
              <input type="date" name="registrationDeadline" value={form.registrationDeadline} onChange={set} className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">Status
              <select name="status" value={form.status} onChange={set} className="input-field mt-1">
                <option value="draft">Draft (hidden from the website)</option>
                <option value="published">Published</option>
                <option value="closed">Closed (shown, registration off)</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">What attendees will learn (one per line)
              <textarea name="learn" value={form.learn} onChange={set} className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">Agenda (one item per line)
              <textarea name="agenda" value={form.agenda} onChange={set} className="input-field mt-1" />
            </label>
            <label className="md:col-span-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" name="certificate" checked={form.certificate} onChange={set} />
              Attendees receive a certificate
            </label>
            {error && <div className="md:col-span-2 alert-error">{error}</div>}
          </div>
          <div className="card-footer flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save workshop"}</button>
            <button type="button" onClick={() => setForm(null)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="card mb-8">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse"></div>)}
            </div>
          ) : workshops.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No workshops yet. Create the first one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr><th>Workshop</th><th>Date</th><th>Price</th><th>Registrations</th><th>Status</th><th className="text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {workshops.map((w) => (
                    <tr key={w._id}>
                      <td>
                        <div className="font-medium text-slate-900">{w.title}</div>
                        <div className="text-xs text-slate-500">/workshops/{w.slug}</div>
                      </td>
                      <td className="text-sm text-slate-600">{showDate(w.date)}</td>
                      <td className="text-sm text-slate-600">{w.price ? `₹${w.price}` : "Free"}</td>
                      <td className="text-sm">
                        <button onClick={() => openRegistrations(w)} className="text-primary-700 font-medium hover:underline">
                          {w.registrations}{w.seats != null ? ` / ${w.seats}` : ""} registered
                        </button>
                        {w.pending > 0 && <span className="badge-warning ml-2">{w.pending} to verify</span>}
                      </td>
                      <td><span className={statusBadge[w.status]}>{w.status}</span></td>
                      <td className="text-right whitespace-nowrap">
                        <button onClick={() => openEdit(w)} className="btn-secondary btn-sm mr-2">Edit</button>
                        <button onClick={() => remove(w)} className="btn-danger btn-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selected && <RegistrationsPanel workshop={selected} onClose={() => setSelected(null)} onChanged={load} />}

      <div className={selected ? "mt-8" : ""}>
        <EmailStatus />
      </div>
    </div>
  );
}
