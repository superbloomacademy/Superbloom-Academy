import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Briefcase, CalendarDays, CreditCard, FileText, GraduationCap, Mail, School, Ticket, Users,
} from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const day = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const badge = {
  new: "badge-info", pending: "badge-warning", verified: "badge-success", rejected: "badge-danger",
  accepted: "badge-success", "under review": "badge-warning", contacted: "badge-warning", converted: "badge-success", lost: "badge-danger",
};

// Things waiting on a person. Highlighted only when there is something to do.
function Action({ to, icon: Icon, count, label, idle }) {
  const active = count > 0;
  return (
    <Link
      to={to}
      className={`group flex items-center gap-4 rounded-2xl p-5 transition-colors duration-150 ${
        active ? "bg-ink text-white hover:bg-primary-800" : "border border-slate-200 bg-white hover:border-primary-300"
      }`}
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${active ? "bg-bloom text-ink" : "bg-slate-100 text-slate-500"}`}>
        <Icon size={24} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-3xl font-bold leading-none">{count}</span>
        <span className={`mt-1 block text-sm ${active ? "text-white/80" : "text-slate-600"}`}>{active ? label : idle}</span>
      </span>
      <ArrowRight size={18} aria-hidden className="shrink-0 opacity-60 transition-transform duration-150 group-hover:translate-x-1" />
    </Link>
  );
}

function Tile({ to, icon: Icon, value, label }) {
  return (
    <Link to={to} className="card flex items-center gap-4 p-4 transition-colors duration-150 hover:border-primary-300">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
        <Icon size={20} aria-hidden />
      </span>
      <span>
        <span className="block font-display text-2xl font-bold leading-none">{value}</span>
        <span className="mt-1 block text-sm text-slate-600">{label}</span>
      </span>
    </Link>
  );
}

function Recent({ title, to, rows, empty, render }) {
  return (
    <section className="card min-w-0 overflow-hidden">
      <div className="card-header flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <Link to={to} className="text-sm font-semibold text-primary-700 hover:underline">View all</Link>
      </div>
      {rows.length === 0 ? (
        <p className="p-6 text-center text-slate-500">{empty}</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {rows.map((r) => (
            <li key={r._id} className="flex min-w-0 items-center justify-between gap-3 px-5 py-3 sm:px-6">{render(r)}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

const Row = ({ title, sub, status, date }) => (
  <>
    <div className="min-w-0">
      <p className="truncate font-semibold">{title}</p>
      <p className="truncate text-sm text-slate-500">{sub}</p>
    </div>
    <div className="flex shrink-0 items-center gap-3">
      {status && <span className={badge[status] || "badge-info"}>{status}</span>}
      <span className="hidden text-sm text-slate-500 sm:block">{day(date)}</span>
    </div>
  </>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [s, setS] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setError("");
    api.get("/admin/stats")
      .then((res) => setS(res.data))
      .catch((e) => setError(!e.response ? "Cannot reach the server. Check that the backend is running." : e.response?.data?.message || "Could not load the dashboard."));
  };

  useEffect(load, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-slate-600">
          {user?.name ? `Hello ${user.name.split(" ")[0]}. ` : ""}Here is what needs you today.
        </p>
      </div>

      {error ? (
        <div role="alert" className="alert-error flex flex-wrap items-center justify-between gap-3">
          <span>{error}</span>
          <button onClick={load} className="btn-secondary btn-sm">Try again</button>
        </div>
      ) : !s ? (
        <div className="space-y-6" aria-busy="true">
          <div className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-24" />)}</div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-20" />)}</div>
          <div className="skeleton h-64" />
        </div>
      ) : (
        <div className="space-y-8">
          <section aria-label="Needs attention" className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Action to="/workshops" icon={CreditCard} count={s.pendingRegistrations} label="workshop payments to verify" idle="No payments waiting" />
            <Action to="/admissions" icon={GraduationCap} count={s.newAdmissions} label="new admission enquiries" idle="No new admissions" />
            <Action to="/colleges" icon={School} count={s.newColleges} label="new college enquiries" idle="No new college enquiries" />
          </section>

          <section aria-label="Totals" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Tile to="/admissions" icon={GraduationCap} value={s.totalAdmissions} label="Admissions" />
            <Tile to="/workshops" icon={Ticket} value={s.totalRegistrations} label="Workshop registrations" />
            <Tile to="/colleges" icon={School} value={s.totalColleges} label="College enquiries" />
            <Tile to="/contacts" icon={Mail} value={s.totalContacts} label="Messages" />
            <Tile to="/workshops" icon={CalendarDays} value={s.publishedWorkshops} label="Workshops published" />
            <Tile to="/articles" icon={FileText} value={s.publishedArticles} label="Articles published" />
            <Tile to="/jobs" icon={Briefcase} value={s.openJobs} label="Open jobs" />
            <Tile to="/candidates" icon={Users} value={s.totalCandidates} label="Job applicants" />
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Recent
              title="Latest admissions" to="/admissions" rows={s.recentAdmissions} empty="No admission enquiries yet."
              render={(a) => <Row title={a.name} sub={`${a.stream}${a.course ? `, ${a.course}` : ""}`} status={a.status} date={a.createdAt} />}
            />
            <Recent
              title="Latest registrations" to="/workshops" rows={s.recentRegistrations} empty="No workshop registrations yet."
              render={(r) => <Row title={r.name} sub={r.workshop?.title || "Workshop"} status={r.status} date={r.createdAt} />}
            />
            <Recent
              title="Latest college enquiries" to="/colleges" rows={s.recentColleges} empty="No college enquiries yet."
              render={(c) => <Row title={c.collegeName} sub={c.contactPerson} status={c.status} date={c.createdAt} />}
            />
          </div>
        </div>
      )}
    </div>
  );
}
