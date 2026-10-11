import React, { useEffect, useMemo, useState } from "react";
import { Download, Search, Trash2, Upload } from "lucide-react";
import api from "../utils/api";
import { parseContacts } from "../utils/contacts";

// Quote every cell and add a BOM so Excel opens names correctly.
// A leading apostrophe stops Excel running a cell that starts with = + - or @ as a formula.
const cell = (v) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};

function downloadCsv(rows, list) {
  const header = ["Name", "Mobile", "Email", "College", "Lists"];
  const lines = rows.map((s) => [s.name, s.phone ? `+${s.phone}` : "", s.email, s.college, (s.lists || []).join("; ")].map(cell).join(","));
  const csv = "﻿" + [header.map(cell).join(","), ...lines].join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `students-${(list || "all").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Students saved by an admin, kept in named lists so a campaign can pick them later.
export default function Students() {
  const [students, setStudents] = useState([]);
  const [lists, setLists] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  // import form
  const [listName, setListName] = useState("");
  const [pasted, setPasted] = useState("");
  const [fileContacts, setFileContacts] = useState([]);
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null); // { ok, text }

  const load = async (list = filter) => {
    setLoading(true);
    try {
      const res = await api.get("/admin/students", { params: list ? { list } : {} });
      setStudents(res.data.students || []);
      setLists(res.data.lists || []);
      setTotal(res.data.total || 0);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load the student list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(filter);
  }, [filter]);

  const incoming = useMemo(() => [...fileContacts, ...parseContacts(pasted)], [fileContacts, pasted]);
  const withPhone = incoming.filter((c) => c.phone).length;
  const withEmail = incoming.filter((c) => c.email).length;

  const readFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    if (/\.xlsx?$/i.test(file.name)) {
      setFileName("");
      setFileContacts([]);
      setResult({ ok: false, text: "This is an Excel file. In Excel choose File, Save as, CSV (comma delimited), then upload that file." });
      return;
    }
    setFileName(file.name);
    setFileContacts(parseContacts(await file.text()));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setResult(null);
    try {
      const res = await api.post("/admin/students/import", { list: listName, contacts: incoming });
      const s = res.data.summary;
      setResult({
        ok: true,
        text: [
          `Saved to "${res.data.list}": ${s.added} new students.`,
          s.updated ? `${s.updated} were already saved and are now on this list too.` : "",
          s.already ? `${s.already} were already on this list.` : "",
          s.skipped ? `${s.skipped} rows left out: no usable mobile number or email.` : "",
        ].filter(Boolean).join(" "),
      });
      setPasted("");
      setFileContacts([]);
      setFileName("");
      load();
    } catch (err) {
      setResult({ ok: false, text: err.response?.data?.message || "The students were not saved." });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s) => {
    if (!confirm(`Remove ${s.name || s.phone || s.email} from the student list?`)) return;
    try {
      await api.delete(`/admin/students/${s._id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not remove the student.");
    }
  };

  const removeList = async () => {
    if (!confirm(`Delete the list "${filter}"? Students who are on no other list are removed.`)) return;
    try {
      await api.delete("/admin/students", { params: { list: filter } });
      setFilter("");
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete the list.");
    }
  };

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? students.filter((s) => [s.name, s.phone, s.email, s.college].some((v) => String(v || "").toLowerCase().includes(q))) : students;
  }, [students, query]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-slate-900">Student list</h1>
        <p className="text-slate-600">
          Students you have collected outside the website. Save them once in a named list, then choose the list in any campaign.
        </p>
      </div>

      <form onSubmit={save} className="card mb-8">
        <div className="card-header">
          <h2 className="text-lg font-bold text-slate-900">Add students</h2>
          <p className="text-sm text-slate-600">
            A student needs a mobile number or an email; having only one of them is fine. Name and college are optional.
          </p>
        </div>
        <div className="card-body grid gap-5 md:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">List name *
              <input
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                required
                list="student-lists"
                placeholder="UI/UX workshop, August 2026"
                className="input-field mt-1"
              />
              <datalist id="student-lists">{lists.map((l) => <option key={l.name} value={l.name} />)}</datalist>
              <span className="mt-1 block text-xs font-normal text-slate-500">Type an existing name to add more students to that list.</span>
            </label>
            <div>
              <label className="btn-secondary btn-sm cursor-pointer">
                <Upload size={16} aria-hidden /> Upload a CSV file
                <input type="file" accept=".csv,.tsv,.txt,.xlsx,.xls,text/csv" onChange={readFile} className="sr-only" />
              </label>
              {fileName && <span className="ml-2 text-sm text-slate-600">{fileName}</span>}
              <p className="mt-2 text-xs text-slate-500">
                From Excel or Google Sheets: File, Save as (or Download), CSV. Give the columns headings such as Name, Mobile,
                Email, College. They can be in any order, and a column can be missing.
              </p>
            </div>
            <label className="block text-sm font-medium text-slate-700">Or paste them, one student per line
              <textarea
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
                placeholder={"Ravi Kumar, 9876543210\nanjali@example.com\nSai Teja, 9123456780, sai@example.com, CBIT"}
                className="input-field mt-1 !min-h-28 font-mono text-sm"
              />
            </label>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700">What was read</p>
            {incoming.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Upload a file or paste students to check them here before saving.</p>
            ) : (
              <>
                <p className="mt-2 text-sm text-slate-700" role="status">
                  {incoming.length} students: {withPhone} with a mobile number, {withEmail} with an email.
                </p>
                <div className="mt-2 max-h-60 overflow-auto rounded-lg border border-slate-200">
                  <table className="table">
                    <thead><tr><th>Name</th><th>Mobile</th><th>Email</th><th>College</th></tr></thead>
                    <tbody>
                      {incoming.slice(0, 8).map((c, i) => (
                        <tr key={i}>
                          <td className="text-sm">{c.name || "-"}</td>
                          <td className="text-sm">{c.phone || "-"}</td>
                          <td className="text-sm">{c.email || "-"}</td>
                          <td className="text-sm">{c.college || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {incoming.length > 8 && <p className="mt-1.5 text-xs text-slate-500">Showing the first 8. If a column is in the wrong place, fix the headings in the file and upload it again.</p>}
              </>
            )}
          </div>

          {result && <div role="status" className={`md:col-span-2 ${result.ok ? "alert-success" : "alert-error"}`}>{result.text}</div>}
        </div>
        <div className="card-footer">
          <button type="submit" disabled={saving || incoming.length === 0} className="btn-primary">
            {saving ? "Saving..." : incoming.length ? `Save ${incoming.length} students` : "Save students"}
          </button>
        </div>
      </form>

      {error && <div role="alert" className="alert-error mb-6">{error}</div>}

      <section className="card mb-8 min-w-0 overflow-hidden" aria-label="Saved students">
        <div className="card-header flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Saved students</h2>
            <p className="text-sm text-slate-600">{total} students in {lists.length} {lists.length === 1 ? "list" : "lists"}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {filter && <button onClick={removeList} className="btn-danger btn-sm"><Trash2 size={16} aria-hidden /> Delete this list</button>}
            <button onClick={() => downloadCsv(shown, filter)} disabled={!shown.length} className="btn-primary btn-sm">
              <Download size={16} aria-hidden /> Download CSV
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-3 sm:px-6">
          <label className="w-full sm:w-72">
            <span className="sr-only">Show list</span>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field !min-h-[2.25rem] py-1.5 text-sm">
              <option value="">All lists ({total})</option>
              {lists.map((l) => <option key={l.name} value={l.name}>{l.name} ({l.count})</option>)}
            </select>
          </label>
          <label className="relative ml-auto w-full sm:w-64">
            <span className="sr-only">Search students</span>
            <Search size={16} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, mobile, email or college" className="input-field !min-h-[2.25rem] py-1.5 pl-9 text-sm" />
          </label>
        </div>

        {loading ? (
          <div className="space-y-3 p-6">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-12" />)}</div>
        ) : shown.length === 0 ? (
          <p className="p-10 text-center text-slate-500">
            {students.length === 0 ? "No students saved yet. Add the first list above." : "No students match this search."}
          </p>
        ) : (
          <div className="max-h-[36rem] overflow-auto">
            <table className="table">
              <thead>
                <tr><th>Name</th><th>Mobile</th><th>Email</th><th>College</th><th>Lists</th><th className="text-right">Actions</th></tr>
              </thead>
              <tbody>
                {shown.map((s) => (
                  <tr key={s._id}>
                    <td className="font-semibold">{s.name || <span className="font-normal text-slate-400">No name</span>}</td>
                    <td className="whitespace-nowrap text-sm text-slate-700">{s.phone ? `+${s.phone}` : "-"}</td>
                    <td className="text-sm text-slate-700">{s.email || "-"}</td>
                    <td className="max-w-[14rem] text-sm text-slate-700">{s.college || "-"}</td>
                    <td><div className="flex flex-wrap gap-1">{(s.lists || []).map((l) => <span key={l} className="badge-info">{l}</span>)}</div></td>
                    <td className="text-right">
                      <button onClick={() => remove(s)} aria-label={`Remove ${s.name || s.phone || s.email}`} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-700 hover:bg-red-50">
                        <Trash2 size={17} aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
