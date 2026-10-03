"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { programHref, programsIn } from "@/lib/programs";

const streams = [
  { key: "engineering", label: "Engineering" },
  { key: "pharmacy", label: "Pharmacy" },
];

// Hero panel: pick a stream and a programme, see what it covers and the roles it leads to.
export default function RoleFinder() {
  const [stream, setStream] = useState("engineering");
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  const list = programsIn(stream);
  const program = list[active];

  const onKeyDown = (e) => {
    const move = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!move) return;
    e.preventDefault();
    const next = (active + move + list.length) % list.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl bg-ink text-white shadow-[0_24px_60px_-20px_rgb(10_26_74/0.55)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 px-5 py-4 sm:px-6">
        <p id="finder-label" className="font-display text-lg font-semibold">
          What do you want to work as?
        </p>
        <div role="group" aria-label="Stream" className="flex rounded-lg bg-white/10 p-1">
          {streams.map((s) => (
            <button
              key={s.key}
              type="button"
              aria-pressed={stream === s.key}
              onClick={() => {
                setStream(s.key);
                setActive(0);
              }}
              className={`min-h-9 rounded-md px-3 text-sm font-semibold ${
                stream === s.key ? "bg-white text-ink" : "text-white/80 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[14rem_1fr]">
        <div
          role="tablist"
          aria-labelledby="finder-label"
          onKeyDown={onKeyDown}
          className="flex min-w-0 gap-1 overflow-x-auto border-b border-white/15 p-2 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r"
        >
          {list.map((p, i) => (
            <button
              key={p.slug}
              ref={(el) => (tabs.current[i] = el)}
              role="tab"
              id={`tab-${p.slug}`}
              aria-selected={i === active}
              aria-controls="finder-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`min-h-10 shrink-0 rounded-lg px-3 py-1.5 text-left text-[0.92rem] font-semibold transition-colors ${
                i === active ? "bg-bloom text-ink" : "text-white/80 hover:bg-white/10"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div id="finder-panel" role="tabpanel" aria-labelledby={`tab-${program.slug}`} className="p-5 sm:p-6">
          <p className="text-white/85">{program.short}</p>

          <p className="mt-5 text-sm font-semibold text-bloom">Roles you can apply for</p>
          <ul className="mt-2 space-y-1.5">
            {program.roles.map((r) => (
              <li key={r} className="flex gap-2.5 font-display text-lg font-semibold leading-snug">
                <span aria-hidden className="mt-[0.55rem] h-2 w-2 shrink-0 rounded-full bg-bloom" />
                {r}
              </li>
            ))}
          </ul>

          <Link href={programHref(program)} className="btn btn-line-light mt-6">
            See the {program.name} programme
          </Link>
        </div>
      </div>
    </div>
  );
}
