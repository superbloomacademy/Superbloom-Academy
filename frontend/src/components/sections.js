import Link from "next/link";
import { ChevronRight, Phone, Plus } from "lucide-react";
import JsonLd from "./JsonLd";
import { courses } from "@/lib/courses";
import { breadcrumbLd, faqLd } from "@/lib/jsonld";
import { durations, site, telHref, formatPhone } from "@/lib/site";

export function PageHero({ title, lead, crumbs = [], children }) {
  return (
    <section className="border-b border-line bg-mist">
      <div className="wrap py-12 sm:py-16">
        {crumbs.length > 0 && (
          <>
            <nav aria-label="Breadcrumb" className="mb-5 text-sm font-medium text-slate">
              <ol className="flex flex-wrap items-center gap-1">
                <li>
                  <Link href="/" className="hover:text-cobalt hover:underline">
                    Home
                  </Link>
                </li>
                {crumbs.map((c, i) => (
                  <li key={c.href} className="flex items-center gap-1">
                    <ChevronRight size={14} aria-hidden />
                    {i === crumbs.length - 1 ? (
                      <span aria-current="page" className="text-ink">
                        {c.name}
                      </span>
                    ) : (
                      <Link href={c.href} className="hover:text-cobalt hover:underline">
                        {c.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <JsonLd data={breadcrumbLd(crumbs)} />
          </>
        )}
        <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg text-slate sm:text-xl">{lead}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function Section({ title, lead, children, tone = "paper", id }) {
  const bg = { paper: "bg-paper", white: "bg-white", mist: "bg-mist" }[tone];
  return (
    <section id={id} className={`${bg} py-16 sm:py-20`}>
      <div className="wrap">
        {title && <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">{title}</h2>}
        {lead && <p className="mt-4 max-w-2xl text-lg text-slate">{lead}</p>}
        <div className={title ? "mt-10" : ""}>{children}</div>
      </div>
    </section>
  );
}

// The seven pharmacy domains as a ruled index: course on the left, the roles it leads to on the right.
export function CourseIndex() {
  return (
    <ul className="border-t-2 border-ink">
      {courses.map((c) => (
        <li key={c.slug} className="border-b border-line">
          <Link
            href={`/courses/${c.slug}`}
            className="group grid gap-x-8 gap-y-2 py-6 hover:bg-mist sm:px-3 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] md:items-center"
          >
            <div>
              <h3 className="text-2xl font-bold group-hover:text-cobalt">{c.name}</h3>
              <p className="mt-1.5 text-slate">{c.short}</p>
            </div>
            <p className="text-[0.95rem]">
              <span className="font-semibold">Leads to: </span>
              {c.roles.join(", ")}
            </p>
            <ChevronRight aria-hidden className="hidden text-cobalt transition-transform group-hover:translate-x-1 md:block" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Bar length is proportional to the programme length (6, 13 and 26 weeks).
export function DurationOptions() {
  const weeks = [6, 13, 26];
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {durations.map((d, i) => (
        <div key={d.type} className="rounded-xl border border-line bg-white p-6">
          <p className="font-semibold text-slate">{d.type}</p>
          <p className="mt-1 font-display text-4xl font-bold">{d.duration}</p>
          <div className="mt-4 h-2 rounded-full bg-mist" aria-hidden>
            <div className="h-2 rounded-full bg-bloom" style={{ width: `${(weeks[i] / 26) * 100}%` }} />
          </div>
          <p className="mt-4 font-semibold">{d.hours}</p>
          <p className="mt-2 text-slate">{d.fit}</p>
        </div>
      ))}
    </div>
  );
}

export function Faq({ items, title = "Questions students ask" }) {
  return (
    <Section title={title} tone="white">
      <div className="max-w-3xl border-t-2 border-ink">
        {items.map(({ q, a }) => (
          <details key={q} className="group border-b border-line">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {q}
              <Plus aria-hidden className="shrink-0 text-cobalt transition-transform group-open:rotate-45" />
            </summary>
            <p className="pb-5 pr-10 text-slate">{a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqLd(items)} />
    </Section>
  );
}

export function CtaBand({
  title = "Ask about the next batch",
  text = "Send us your details and we will call you to talk through the course, batch timings and fees. Or call us now.",
  course,
}) {
  return (
    <section className="bg-cobalt-deep text-white">
      <div className="wrap flex flex-col gap-8 py-14 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
          <p className="mt-3 max-w-xl text-lg text-white/85">{text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={course ? `/admission?course=${course}` : "/admission"} className="btn btn-bloom">
            Apply for admission
          </Link>
          <a href={telHref(site.phones[0])} className="btn btn-line-light">
            <Phone size={18} aria-hidden /> {formatPhone(site.phones[0])}
          </a>
        </div>
      </div>
    </section>
  );
}

export function CheckList({ items, columns = 2 }) {
  return (
    <ul className={`grid gap-x-8 gap-y-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className="mt-[0.6rem] h-2 w-2 shrink-0 rounded-full bg-bloom" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
