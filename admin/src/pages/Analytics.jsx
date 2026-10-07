import React, { useEffect, useState } from "react";
import { Eye, MousePointerClick, Radio, Users } from "lucide-react";
import api from "../utils/api";
import { BarList, DailyBars, num } from "../components/Charts";

const ranges = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

const deviceNames = { mobile: "Mobile", desktop: "Desktop", tablet: "Tablet" };

function Tile({ icon: Icon, value, label, note, live }) {
  return (
    <div className="card flex items-center gap-4 p-4">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${live ? "bg-emerald-100 text-emerald-700" : "bg-primary-50 text-primary-700"}`}>
        <Icon size={22} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-3xl font-bold leading-none tabular-nums">{value}</span>
        <span className="mt-1 block text-sm text-slate-600">{label}</span>
        {note && <span className="block text-xs text-slate-500">{note}</span>}
      </span>
    </div>
  );
}

function Panel({ title, note, children, className = "" }) {
  return (
    <section className={`card min-w-0 ${className}`}>
      <div className="card-header">
        <h2 className="text-lg font-bold">{title}</h2>
        {note && <p className="mt-0.5 text-sm text-slate-500">{note}</p>}
      </div>
      <div className="card-body">{children}</div>
    </section>
  );
}

// "12% more than the 30 days before"
const change = (now, before, days) => {
  if (before == null || before === 0) return null;
  const pct = Math.round(((now - before) / before) * 100);
  if (pct === 0) return `Same as the ${days} days before`;
  return `${Math.abs(pct)}% ${pct > 0 ? "more" : "fewer"} than the ${days} days before`;
};

export default function Analytics() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [live, setLive] = useState(null);
  const [measure, setMeasure] = useState("visitors");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    api.get(`/admin/analytics?days=${days}`)
      .then((res) => setData(res.data))
      .catch((e) => setError(!e.response ? "Cannot reach the server. Check that the backend is running." : e.response?.data?.message || "Could not load the analytics."));
  }, [days]);

  // who is on the site now, refreshed every 30 seconds
  useEffect(() => {
    const load = () => api.get("/admin/analytics/live").then((res) => setLive(res.data)).catch(() => {});
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  const enquiries = data ? Object.values(data.enquiries).reduce((a, b) => a + b, 0) : 0;
  const rate = data?.visitors ? `${((enquiries / data.visitors) * 100).toFixed(1)}% of visitors` : null;
  const stale = data && data.days !== days;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="mt-1 text-slate-600">How many people visit the website, where they come from and what they read.</p>
        </div>
        <div role="group" aria-label="Period" className="flex rounded-lg bg-slate-200 p-1">
          {ranges.map((r) => (
            <button
              key={r.days}
              type="button"
              aria-pressed={days === r.days}
              onClick={() => setDays(r.days)}
              className={`min-h-[2.25rem] rounded-md px-3.5 text-sm font-semibold ${days === r.days ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div role="alert" className="alert-error">{error}</div>
      ) : !data ? (
        <div className="space-y-6" aria-busy="true">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-20" />)}</div>
          <div className="skeleton h-72" />
        </div>
      ) : (
        <div className={`space-y-6 ${stale ? "opacity-60" : ""}`}>
          <section aria-label="Totals" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Tile icon={Radio} live value={live ? num(live.count) : "–"} label="on the website now" note="Active in the last 5 minutes" />
            <Tile icon={Users} value={num(data.visitors)} label={`visitors in ${data.days} days`} note={`${num(data.today.visitors)} today`} />
            <Tile icon={Eye} value={num(data.views)} label={`page views in ${data.days} days`} note={change(data.views, data.previousViews, data.days) || `${num(data.today.views)} today`} />
            <Tile icon={MousePointerClick} value={num(enquiries)} label={`enquiries in ${data.days} days`} note={rate} />
          </section>

          <section className="card">
            <div className="card-header flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">{measure === "visitors" ? "Visitors" : "Page views"} by day</h2>
              <div role="group" aria-label="Measure" className="flex rounded-lg bg-slate-100 p-1">
                {[["visitors", "Visitors"], ["views", "Page views"]].map(([key, label]) => (
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
            <div className="card-body">
              <DailyBars rows={data.series} field={measure} label={measure === "visitors" ? "visitors" : "page views"} />
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer font-semibold text-primary-700">Show as a table</summary>
                <div className="mt-3 max-h-72 overflow-auto rounded-lg border border-slate-200">
                  <table className="table">
                    <thead><tr><th>Day</th><th className="text-right">Visitors</th><th className="text-right">Page views</th></tr></thead>
                    <tbody>
                      {[...data.series].reverse().map((d) => (
                        <tr key={d.day}>
                          <td>{d.day}</td>
                          <td className="text-right tabular-nums">{num(d.visitors)}</td>
                          <td className="text-right tabular-nums">{num(d.views)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Panel title="Most viewed pages" note="Page views, and how many different visitors opened the page.">
              <BarList
                rows={data.pages.map((p) => ({ name: p.path === "/" ? "/ (home page)" : p.path, value: p.views, note: `${num(p.visitors)} visitors` }))}
                unit="views"
                empty="No visits recorded in this period yet."
              />
            </Panel>

            <div className="space-y-6">
              <Panel title="On the website now" note="Refreshes every 30 seconds.">
                <BarList
                  rows={(live?.pages || []).map((p) => ({ name: p.path === "/" ? "/ (home page)" : p.path, value: p.visitors }))}
                  unit="now"
                  empty="Nobody is on the website right now."
                />
              </Panel>
              <Panel title="Where visitors come from" note="Direct means they typed the address or opened a link from an app that does not say where it came from.">
                <BarList rows={data.sources.map((s) => ({ name: s.name, value: s.visitors }))} unit="visitors" empty="No visits recorded in this period yet." />
              </Panel>
            </div>

            <Panel title="Phone or computer">
              <BarList rows={data.devices.map((d) => ({ name: deviceNames[d.name] || d.name, value: d.visitors }))} unit="visitors" empty="No visits recorded in this period yet." />
            </Panel>

            <Panel title="What visitors did" note={`Forms sent in the last ${data.days} days.`}>
              <BarList
                rows={[
                  { name: "Admission enquiries", value: data.enquiries.admissions },
                  { name: "Workshop registrations", value: data.enquiries.registrations },
                  { name: "College enquiries", value: data.enquiries.colleges },
                  { name: "Messages", value: data.enquiries.messages },
                ]}
                empty=""
              />
            </Panel>
          </div>

          <p className="text-sm text-slate-500">
            Counting started when this page was added, so earlier visits are not here. Visitors are counted by a random ID kept in their
            browser; no names, phone numbers or IP addresses are stored. Page-by-page detail is kept for 90 days, daily totals for good.
          </p>
        </div>
      )}
    </div>
  );
}
