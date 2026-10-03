"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { courses } from "@/lib/courses";

// Hero panel: pick a domain, see what you practise and the roles it leads to.
export default function RoleFinder() {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  const course = courses[active];

  const onKeyDown = (e) => {
    const move = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!move) return;
    e.preventDefault();
    const next = (active + move + courses.length) % courses.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl bg-ink text-white shadow-[0_24px_60px_-20px_rgb(10_26_74/0.55)]">
      <p id="finder-label" className="border-b border-white/15 px-5 py-4 font-display text-lg font-semibold sm:px-6">
        Which part of pharma do you want to work in?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-[13.5rem_1fr]">
        <div
          role="tablist"
          aria-labelledby="finder-label"
          onKeyDown={onKeyDown}
          className="flex min-w-0 gap-1 overflow-x-auto border-b border-white/15 p-2 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r"
        >
          {courses.map((c, i) => (
            <button
              key={c.slug}
              ref={(el) => (tabs.current[i] = el)}
              role="tab"
              id={`tab-${c.slug}`}
              aria-selected={i === active}
              aria-controls="finder-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`min-h-11 shrink-0 rounded-lg px-3 py-2 text-left text-[0.95rem] font-semibold transition-colors ${
                i === active ? "bg-bloom text-ink" : "text-white/80 hover:bg-white/10"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div id="finder-panel" role="tabpanel" aria-labelledby={`tab-${course.slug}`} className="p-5 sm:p-6">
          <p className="text-white/85">{course.short}</p>

          <p className="mt-5 text-sm font-semibold text-bloom">Roles you can apply for</p>
          <ul className="mt-2 space-y-1.5">
            {course.roles.map((r) => (
              <li key={r} className="flex gap-2.5 font-display text-lg font-semibold leading-snug">
                <span aria-hidden className="mt-[0.55rem] h-2 w-2 shrink-0 rounded-full bg-bloom" />
                {r}
              </li>
            ))}
          </ul>

          <Link href={`/courses/${course.slug}`} className="btn btn-line-light mt-6">
            See the {course.name.toLowerCase()} course
          </Link>
        </div>
      </div>
    </div>
  );
}
