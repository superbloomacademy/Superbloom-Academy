import React, { useEffect, useState } from "react";
import api from "../utils/api";

const empty = { title: "", slug: "", category: "Career guidance", description: "", body: "", status: "draft" };

const categories = [
  "Engineering careers", "Pharmacy careers", "Full stack development", "AI and ML", "Data analytics",
  "Medical coding", "Pharmacovigilance", "Career guidance", "Student resources", "Workshops", "College training",
];

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/articles");
      setArticles(res.data.articles || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const open = (a) => {
    setEditingId(a?._id || null);
    setForm(a ? { ...empty, ...a } : empty);
    setError("");
    window.scrollTo(0, 0);
  };

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) await api.put(`/admin/articles/${editingId}`, form);
      else await api.post("/admin/articles", form);
      setForm(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the article.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (a) => {
    if (!confirm(`Delete "${a.title}"?`)) return;
    await api.delete(`/admin/articles/${a._id}`);
    load();
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Articles</h1>
          <p className="text-slate-600">Write the guides shown on the website's Resources page.</p>
        </div>
        <button onClick={() => open(null)} className="btn-primary">+ New article</button>
      </div>

      {form && (
        <form onSubmit={save} className="card mb-8">
          <div className="card-header">
            <h2 className="text-lg font-bold text-slate-900">{editingId ? "Edit article" : "New article"}</h2>
          </div>
          <div className="card-body grid md:grid-cols-2 gap-4">
            <label className="md:col-span-2 text-sm font-medium text-slate-700">Title *
              <input name="title" value={form.title} onChange={set} required placeholder="For example: Medical coding career after B.Pharmacy" className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">URL name (slug)
              <input name="slug" value={form.slug} onChange={set} placeholder="Leave empty to use the title" className="input-field mt-1" />
            </label>
            <label className="text-sm font-medium text-slate-700">Category
              <select name="category" value={form.category} onChange={set} className="input-field mt-1">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="md:col-span-2 text-sm font-medium text-slate-700">Short description * <span className="font-normal text-slate-500">({form.description.length}/160 characters, shown on the card and in Google)</span>
              <textarea name="description" value={form.description} onChange={set} required rows={2} className="input-field mt-1 !min-h-0" />
            </label>
            <label className="md:col-span-2 text-sm font-medium text-slate-700">Article text *
              <textarea name="body" value={form.body} onChange={set} required rows={18} className="input-field mt-1 font-mono text-sm" placeholder={"Opening paragraph.\n\n## A heading\n\nA paragraph under the heading.\n\n- First bullet point\n- Second bullet point"} />
            </label>
            <div className="md:col-span-2 alert-info text-sm">
              Formatting: leave a blank line between paragraphs. Start a line with <code>## </code> for a heading and with <code>- </code> for a bullet point.
            </div>
            <label className="text-sm font-medium text-slate-700">Status
              <select name="status" value={form.status} onChange={set} className="input-field mt-1">
                <option value="draft">Draft (hidden from the website)</option>
                <option value="published">Published</option>
              </select>
            </label>
            {error && <div className="md:col-span-2 alert-error">{error}</div>}
          </div>
          <div className="card-footer flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save article"}</button>
            <button type="button" onClick={() => setForm(null)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse"></div>)}
            </div>
          ) : articles.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No articles yet. Write the first one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr><th>Article</th><th>Category</th><th>Published</th><th>Status</th><th className="text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a._id}>
                      <td>
                        <div className="font-medium text-slate-900">{a.title}</div>
                        <div className="text-xs text-slate-500">/resources/{a.slug}</div>
                      </td>
                      <td className="text-sm text-slate-600">{a.category}</td>
                      <td className="text-sm text-slate-600">{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "-"}</td>
                      <td><span className={a.status === "published" ? "badge-success" : "badge-warning"}>{a.status}</span></td>
                      <td className="text-right whitespace-nowrap">
                        <button onClick={() => open(a)} className="btn-secondary btn-sm mr-2">Edit</button>
                        <button onClick={() => remove(a)} className="btn-danger btn-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
