import React, { useState } from "react";

const num = (n) => Number(n || 0).toLocaleString("en-IN");

const shortDay = (day) => new Date(`${day}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const longDay = (day) =>
  new Date(`${day}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

// Round the top of the scale up to 1, 2 or 5 times a power of ten.
const niceMax = (n) => {
  if (n <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(n));
  return [1, 2, 5, 10].map((m) => m * pow).find((m) => m >= n);
};

// One bar per day for a single measure. `rows` is [{ day: "2026-10-05", [field]: number }].
export function DailyBars({ rows, field, label }) {
  const [hover, setHover] = useState(null);
  const max = niceMax(Math.max(...rows.map((r) => r[field] || 0), 0));
  const shown = hover ?? rows.length - 1;
  const ticks = [0, Math.floor((rows.length - 1) / 2), rows.length - 1];

  return (
    <figure>
      <figcaption className="mb-3 flex min-h-[1.5rem] items-baseline justify-between gap-3 text-sm">
        <span className="font-semibold text-slate-900">
          {num(rows[shown]?.[field])} {label}
        </span>
        <span className="text-slate-500">{rows[shown] ? longDay(rows[shown].day) : ""}</span>
      </figcaption>

      <div className="flex gap-3">
        <div aria-hidden className="flex h-44 flex-col justify-between text-right text-xs tabular-nums text-slate-500">
          <span>{num(max)}</span>
          <span>{num(max / 2)}</span>
          <span>0</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="relative h-44" onMouseLeave={() => setHover(null)}>
            <div aria-hidden className="absolute inset-0 flex flex-col justify-between">
              <span className="border-t border-slate-200" />
              <span className="border-t border-slate-200" />
              <span className="border-t border-slate-300" />
            </div>
            <div className="absolute inset-0 flex items-end gap-[2px]">
              {rows.map((r, i) => (
                <button
                  key={r.day}
                  type="button"
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={`${longDay(r.day)}: ${num(r[field])} ${label}`}
                  className="group flex h-full min-w-0 flex-1 cursor-default items-end focus:outline-none"
                >
                  <span
                    className={`block w-full rounded-t ${i === shown && hover !== null ? "bg-primary-800" : "bg-primary-500"} group-focus-visible:bg-primary-800`}
                    style={{ height: `${((r[field] || 0) / max) * 100}%`, minHeight: r[field] ? 2 : 0 }}
                  />
                </button>
              ))}
            </div>
          </div>
          <div aria-hidden className="mt-1.5 flex justify-between text-xs text-slate-500">
            {ticks.map((t) => (
              <span key={t}>{rows[t] ? shortDay(rows[t].day) : ""}</span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

// Ranked horizontal bars: [{ name, value, note }]. One colour, because length carries the meaning.
export function BarList({ rows, empty, unit }) {
  if (!rows.length) return <p className="py-6 text-center text-slate-500">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.name}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate font-medium text-slate-900" title={r.name}>{r.name}</span>
            <span className="shrink-0 tabular-nums text-slate-600">
              {num(r.value)} {unit}
              {r.note ? <span className="text-slate-400"> · {r.note}</span> : null}
            </span>
          </div>
          <div aria-hidden className="mt-1.5 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-primary-500" style={{ width: `${Math.max((r.value / max) * 100, 1.5)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export { num };
