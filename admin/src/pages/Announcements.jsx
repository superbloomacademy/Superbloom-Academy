import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { DailyBars, num } from "../components/Charts";

const empty = {
  title: "", kind: "news", message: "", ctaLabel: "", ctaHref: "", startsAt: "", endsAt: "", showOn: "home", frequency: "always", status: "draft",
};

const kinds = {
  workshop: "Workshop", hackathon: "Hackathon", batch: "New batch or admissions", event: "Seminar or webinar",
  offer: "Fee offer", placement: "Placement drive or result", news: "Other news",
};

const frequencies = { always: "Every time", visit: "Once per visit", daily: "Once a day" };

// Dates are stored as moments in time; the form works in Indian calendar days.
const day = (d) => (d ? new Date(new Date(d).getTime() + 5.5 * 3600000).toISOString().slice(0, 10) : "");
const showDay = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

// What the website is doing with it right now.
const state = (a) => {
  const now = Date.now();
  if (a.status !== "live") return { label: a.status, badge: a.status === "paused" ? "badge-danger" : "badge-warning" };
  if (a.startsAt && new Date(a.startsAt) > now) return { label: "scheduled", badge: "badge-info" };
  if (a.endsAt && new Date(a.endsAt) < now) return { label: "ended", badge: "badge-danger" };
  if (a.workshopClosed) return { label: "hidden: workshop closed", badge: "badge-danger" };
  return { label: "live", badge: "badge-success" };
};

const when = (a) =>
  a.startsAt || a.endsAt
    ? `${a.startsAt ? showDay(a.startsAt) : "Now"} to ${a.endsAt ? showDay(a.endsAt) : "no end date"}`
    : "No dates set";

const rate = (a) => (a.views ? `${((a.clicks / a.views) * 100).toFixed(1)}%` : "–");

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null); // null = closed
  const [editing, setEditing] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(null);
  const [measure, setMeasure] = useState("views");

  const load = async () => {
    try {
      const res = await api.get("/admin/announcements");
      setItems(res.data.announcements || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    api.get("/admin/workshops").then((res) => setWorkshops(res.data.workshops || [])).catch(() => {});
  }, []);

  const resetImage = () => {
    setFile(null);
    setPreview("");
    setRemoveImage(false);
  };

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    resetImage();
    setError("");
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({ ...empty, ...a, message: a.message || "", ctaLabel: a.ctaLabel || "", startsAt: day(a.startsAt), endsAt: day(a.endsAt) });
    resetImage();
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Start from a workshop that already exists instead of typing it again.
  const fillFrom = (e) => {
    const w = workshops.find((x) => x._id === e.target.value);
    if (!w) return;
    setForm({
      ...form,
      kind: "workshop",
      title: w.title,
      message: w.summary || "",
      ctaLabel: "Register now",
      ctaHref: `/workshops/${w.slug}`,
      endsAt: day(w.registrationDeadline || w.date),
    });
  };

  const pickFile = (e) => {
    const f = e.target.files[0];
    setFile(f || null);
    setRemoveImage(false);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const data = new FormData();
    Object.keys(empty).forEach((k) => data.append(k, form[k] ?? ""));
    if (file) data.append("image", file);
    if (removeImage) data.append("removeImage", "true");
    try {
      if (editing) await api.put(`/admin/announcements/${editing._id}`, data);
      else await api.post("/admin/announcements", data);
      setForm(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the announcement.");
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (a, status) => {
    try {
      await api.put(`/admin/announcements/${a._id}`, { status });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update the announcement.");
    }
  };

  const remove = async (a) => {
    if (!confirm(`Delete "${a.title}" and its numbers?`)) return;
    try {
      await api.delete(`/admin/announcements/${a._id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete the announcement.");
    }
  };

  const shownImage = removeImage ? "" : preview || editing?.imageUrl || "";

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-slate-900">Announcements</h1>
          <p className="text-slate-600">
            The popup visitors see when they open the website: workshops, hackathons, new batches and other news.
          </p>
        </div>
        <button onClick={openNew} className="btn-primary">+ New announcement</button>
      </div>

      {form && (
        <form onSubmit={save} className="card mb-8">
          <div className="card-header">
            <h2 className="text-lg font-bold text-slate-900">{editing ? "Edit announcement" : "New announcement"}</h2>
          </div>
          <div className="card-body grid gap-8 lg:grid-cols-[1fr_18rem]">
            <div className="grid gap-4 md:grid-cols-2">
              {workshops.length > 0 && (
                <label className="text-sm font-medium text-slate-700 md:col-span-2">Fill in from a workshop (optional)
                  <select onChange={fillFrom} value="" className="input-field mt-1">
                    <option value="">Choose a workshop to copy its details</option>
                    {workshops.filter((w) => w.status === "published").map((w) => (
                      <option key={w._id} value={w._id}>{w.title}</option>
                    ))}
                  </select>
                </label>
              )}
              <label className="text-sm font-medium text-slate-700 md:col-span-2">Headline *
                <input name="title" value={form.title} onChange={set} required maxLength={90} className="input-field mt-1" />
              </label>
              <label className="text-sm font-medium text-slate-700">Type
                <select name="kind" value={form.kind} onChange={set} className="input-field mt-1">
                  {Object.entries(kinds).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">Show on
                <select name="showOn" value={form.showOn} onChange={set} className="input-field mt-1">
                  <option value="home">Home page only</option>
                  <option value="all">Every page</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700 md:col-span-2">Short message
                <textarea name="message" value={form.message} onChange={set} maxLength={320} placeholder="Two or three lines: what it is, when, and who it is for." className="input-field mt-1" />
              </label>
              <label className="text-sm font-medium text-slate-700">Button text
                <input name="ctaLabel" value={form.ctaLabel} onChange={set} maxLength={30} placeholder="Know more" className="input-field mt-1" />
              </label>
              <label className="text-sm font-medium text-slate-700">Button link *
                <input name="ctaHref" value={form.ctaHref} onChange={set} required placeholder="/workshops or https://..." className="input-field mt-1" />
              </label>
              <label className="text-sm font-medium text-slate-700">Start showing on
                <input type="date" name="startsAt" value={form.startsAt} onChange={set} className="input-field mt-1" />
              </label>
              <label className="text-sm font-medium text-slate-700">Stop showing after
                <input type="date" name="endsAt" value={form.endsAt} onChange={set} className="input-field mt-1" />
              </label>
              <label className="text-sm font-medium text-slate-700 md:col-span-2">How often a visitor sees it
                <select name="frequency" value={form.frequency} onChange={set} className="input-field mt-1">
                  <option value="always">Every time the website is opened or refreshed</option>
                  <option value="visit">Once per visit (not again until they close the website and come back)</option>
                  <option value="daily">Once a day</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700 md:col-span-2">Status
                <select name="status" value={form.status} onChange={set} className="input-field mt-1">
                  <option value="draft">Draft (not shown on the website)</option>
                  <option value="live">Live (shown between the dates above)</option>
                  <option value="paused">Paused (switched off for now)</option>
                </select>
              </label>
              {error && <div className="alert-error md:col-span-2">{error}</div>}
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Picture (optional)</p>
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">
                {shownImage ? <img src={shownImage} alt="" className="h-full w-full object-cover" /> : <span className="px-4 text-center text-sm text-slate-400">No picture. The popup shows a coloured banner instead.</span>}
              </div>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={pickFile} className="mt-3 block w-full text-sm text-slate-600" />
              <p className="mt-1 text-xs text-slate-500">Wide picture (16:9), PNG, JPG or WebP, under 2 MB.</p>
              {editing?.imageUrl && !preview && !removeImage && (
                <button type="button" onClick={() => setRemoveImage(true)} className="mt-2 text-sm text-red-600 hover:underline">Remove picture</button>
              )}
            </div>
          </div>
          <div className="card-footer flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save announcement"}</button>
            <button type="button" onClick={() => setForm(null)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="card">
        {loading ? (
          <div className="space-y-4 p-6">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-14" />)}</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No announcements yet. Create one to show a popup on the website.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Announcement</th><th>Status</th><th className="text-right">Seen</th><th className="text-right">Clicked</th>
                  <th className="text-right">Click rate</th><th className="text-right">Closed</th><th className="text-right">Sign-ups</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => {
                  const s = state(a);
                  return (
                    <React.Fragment key={a._id}>
                      <tr>
                        <td className="min-w-[16rem]">
                          <div className="font-medium text-slate-900">{a.title}</div>
                          <div className="text-xs text-slate-500">{kinds[a.kind]} · {a.showOn === "all" ? "Every page" : "Home page"} · {frequencies[a.frequency] || frequencies.always} · {when(a)}</div>
                        </td>
                        <td><span className={s.badge}>{s.label}</span></td>
                        <td className="text-right tabular-nums">{num(a.views)}</td>
                        <td className="text-right tabular-nums">{num(a.clicks)}</td>
                        <td className="text-right tabular-nums">{rate(a)}</td>
                        <td className="text-right tabular-nums">{num(a.dismissals)}</td>
                        <td className="text-right tabular-nums">{num(a.registrations + a.admissions)}</td>
                        <td className="whitespace-nowrap text-right">
                          <button onClick={() => setOpen(open === a._id ? null : a._id)} aria-expanded={open === a._id} className="btn-secondary btn-sm mr-2">
                            {open === a._id ? "Hide numbers" : "Numbers"}
                          </button>
                          {a.status === "live"
                            ? <button onClick={() => setStatus(a, "paused")} className="btn-secondary btn-sm mr-2">Pause</button>
                            : <button onClick={() => setStatus(a, "live")} className="btn-primary btn-sm mr-2">Go live</button>}
                          <button onClick={() => openEdit(a)} className="btn-secondary btn-sm mr-2">Edit</button>
                          <button onClick={() => remove(a)} className="btn-danger btn-sm">Delete</button>
                        </td>
                      </tr>
                      {open === a._id && (
                        <tr>
                          <td colSpan={8} className="bg-slate-50">
                            <div className="grid gap-6 py-2 lg:grid-cols-[minmax(0,1fr)_18rem]">
                              <div>
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                  <p className="font-semibold text-slate-900">Last 14 days</p>
                                  <div role="group" aria-label="Measure" className="flex rounded-lg bg-slate-200 p-1">
                                    {[["views", "Seen"], ["clicks", "Clicked"]].map(([key, label]) => (
                                      <button
                                        key={key}
                                        type="button"
                                        aria-pressed={measure === key}
                                        onClick={() => setMeasure(key)}
                                        className={`min-h-[2rem] rounded-md px-3 text-sm font-semibold ${measure === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                                      >
                                        {label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <DailyBars rows={a.daily} field={measure} label={measure === "views" ? "times seen" : "clicks"} />
                              </div>
                              <dl className="space-y-2 text-sm">
                                {[
                                  ["Times the popup was seen", a.views],
                                  ["Clicks on the button", a.clicks],
                                  ["Closed without clicking", a.dismissals],
                                  ["Workshop registrations that followed", a.registrations],
                                  ["Admission enquiries that followed", a.admissions],
                                ].map(([label, value]) => (
                                  <div key={label} className="flex justify-between gap-4 border-b border-slate-200 pb-2">
                                    <dt className="text-slate-600">{label}</dt>
                                    <dd className="font-semibold tabular-nums text-slate-900">{num(value)}</dd>
                                  </div>
                                ))}
                                <p className="pt-1 text-xs text-slate-500">
                                  A sign-up counts when the visitor clicked this announcement and sent the form within 7 days, on the same device.
                                </p>
                              </dl>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
