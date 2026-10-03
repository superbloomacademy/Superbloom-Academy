import Link from "next/link";
import {
  ArrowUpRight, BadgeCheck, BookOpen, Braces, BrainCircuit, CalendarDays, ChartColumn, ClipboardList, Clock,
  Container, FileCheck, FlaskConical, GraduationCap, Hash, Layers, MapPin, PenTool, ShieldCheck, Stethoscope,
  Table, Terminal, Users, Workflow,
} from "lucide-react";
import { modeLabel } from "@/lib/api";
import { programHref, programsIn } from "@/lib/programs";

export const programIcons = {
  "mern-full-stack-development": Layers,
  "python-full-stack": Terminal,
  "java-dsa": Braces,
  "data-analytics": ChartColumn,
  "ai-ml-generative-ai": BrainCircuit,
  "ui-ux-design": PenTool,
  devops: Container,
  servicenow: Workflow,
  pharmacovigilance: ShieldCheck,
  "clinical-research": ClipboardList,
  "medical-coding": Hash,
  "quality-control": FlaskConical,
  "quality-assurance": BadgeCheck,
  "regulatory-affairs": FileCheck,
  "hospital-clinical-pharmacy": Stethoscope,
  "clinical-sas": Table,
};

// Three tints rotate through a grid so neighbouring cards differ.
const tints = [
  { tile: "bg-mist text-cobalt", ghost: "text-cobalt", bar: "bg-cobalt" },
  { tile: "bg-bloom-soft text-bloom-deep", ghost: "text-bloom-deep", bar: "bg-bloom" },
  { tile: "bg-leaf-soft text-leaf", ghost: "text-leaf", bar: "bg-leaf" },
];

function Arrow({ dark }) {
  return (
    <span
      aria-hidden
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform] duration-200 ease-out-strong group-hover:bg-bloom group-hover:text-ink group-hover:rotate-45 ${
        dark ? "bg-white/15 text-white" : "bg-mist text-ink"
      }`}
    >
      <ArrowUpRight size={18} />
    </span>
  );
}

function ProgramCard({ program, tint, featured }) {
  const Icon = programIcons[program.slug] || GraduationCap;
  const shown = featured ? program.roles : program.roles.slice(0, 2);
  const extra = program.roles.length - shown.length;

  if (featured) {
    return (
      <Link
        href={programHref(program)}
        className="group lift relative flex flex-col overflow-hidden rounded-3xl bg-ink p-7 text-white sm:p-9 lg:col-span-2"
      >
        <div aria-hidden className="dots absolute inset-0 opacity-60" />
        <Icon aria-hidden size={260} strokeWidth={1} className="absolute -bottom-12 -right-10 text-white/[0.07] transition-transform duration-300 ease-out-strong group-hover:-translate-y-2 group-hover:-rotate-6" />
        <div className="relative flex flex-1 flex-col">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bloom text-ink">
              <Icon size={28} aria-hidden />
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-bloom">Featured programme</span>
          </div>
          <h3 className="mt-6 text-3xl font-bold sm:text-4xl">{program.name}</h3>
          <p className="mt-3 max-w-xl text-lg text-white/80">{program.short}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {shown.map((r) => (
              <li key={r} className="rounded-lg bg-white/10 px-3 py-1.5 text-[0.92rem] font-semibold">
                {r}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center justify-between gap-4 pt-8">
            <span className="text-white/75">
              {program.learn.length} topics{program.projects ? `, ${program.projects.length} projects` : ""}
            </span>
            <span className="flex shrink-0 items-center gap-3 whitespace-nowrap font-semibold">
              View programme <Arrow dark />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={programHref(program)} className="group lift relative flex flex-col overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-line sm:p-7">
      <span aria-hidden className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 ease-out-strong group-hover:scale-x-100 ${tint.bar}`} />
      <Icon aria-hidden size={150} strokeWidth={1} className={`absolute -bottom-8 -right-8 opacity-[0.07] transition-transform duration-300 ease-out-strong group-hover:-translate-y-1.5 group-hover:-rotate-6 ${tint.ghost}`} />

      <div className="relative flex flex-1 flex-col">
        <span className={`flex h-13 w-13 items-center justify-center rounded-2xl ${tint.tile}`}>
          <Icon size={26} aria-hidden />
        </span>
        <h3 className="mt-5 text-2xl font-bold">{program.name}</h3>
        <p className="mt-2 text-slate">{program.short}</p>

        <p className="mt-5 text-sm font-semibold text-slate">Leads to</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {shown.map((r) => (
            <li key={r} className="rounded-lg bg-paper px-2.5 py-1 text-[0.88rem] font-semibold ring-1 ring-line">
              {r}
            </li>
          ))}
          {extra > 0 && <li className="px-1 py-1 text-[0.88rem] font-semibold text-slate">+{extra} more</li>}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <span className="font-semibold">View programme</span>
          <Arrow />
        </div>
      </div>
    </Link>
  );
}

export function ProgramGrid({ category, limit }) {
  const list = programsIn(category).slice(0, limit);
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((p, i) => (
        <li key={p.slug} className={`flex ${i === 0 ? "sm:col-span-2" : ""}`}>
          <div className="flex w-full [&>a]:w-full">
            <ProgramCard program={p} featured={i === 0} tint={tints[i % tints.length]} />
          </div>
        </li>
      ))}
    </ul>
  );
}

const parts = (d) => {
  const date = new Date(d);
  const f = (opts) => date.toLocaleDateString("en-IN", { ...opts, timeZone: "Asia/Kolkata" });
  return { day: f({ day: "numeric" }), month: f({ month: "short" }), weekday: f({ weekday: "long" }), year: f({ year: "numeric" }) };
};

// A ticket: date stub on the left, details on the right, price and seats along the bottom.
export function WorkshopCard({ workshop: w }) {
  const d = parts(w.date);
  const early = w.currentPrice < w.price;
  const taken = w.seats != null ? w.seats - w.seatsLeft : null;

  return (
    <Link href={`/workshops/${w.slug}`} className="group lift relative flex overflow-hidden rounded-3xl bg-white ring-1 ring-line">
      <div className="relative flex w-28 shrink-0 flex-col items-center justify-center bg-ink px-3 py-6 text-center text-white sm:w-32">
        <div aria-hidden className="dots absolute inset-0 opacity-50" />
        <span className="relative text-sm font-semibold text-bloom">{d.month} {d.year}</span>
        <span className="relative font-display text-6xl font-bold leading-none">{d.day}</span>
        <span className="relative mt-1 text-sm text-white/75">{d.weekday}</span>
        {/* ticket notches */}
        <span aria-hidden className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full bg-paper ring-1 ring-line" />
        <span aria-hidden className="absolute -bottom-2.5 -right-2.5 h-5 w-5 rounded-full bg-paper ring-1 ring-line" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col border-l-2 border-dashed border-line p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-[0.85rem] font-semibold">
          <span className="rounded-md bg-mist px-2 py-0.5 text-cobalt">{modeLabel[w.mode]}</span>
          {!w.registrationOpen && <span className="rounded-md bg-ink/10 px-2 py-0.5">Registration closed</span>}
          {w.registrationOpen && early && <span className="rounded-md bg-bloom-soft px-2 py-0.5 text-bloom-deep">Early-bird price</span>}
        </div>
        <h3 className="mt-3 text-2xl font-bold group-hover:text-cobalt">{w.title}</h3>
        {w.summary && <p className="mt-1.5 text-slate">{w.summary}</p>}

        <ul className="mt-4 space-y-1.5 text-[0.95rem] text-slate">
          {w.time && (
            <li className="flex items-center gap-2">
              <Clock size={16} aria-hidden className="shrink-0 text-cobalt" /> {w.time}
            </li>
          )}
          {w.venue && (
            <li className="flex items-center gap-2">
              <MapPin size={16} aria-hidden className="shrink-0 text-cobalt" /> {w.venue}
            </li>
          )}
          {w.seatsLeft != null && w.registrationOpen && (
            <li className="flex items-center gap-2">
              <Users size={16} aria-hidden className="shrink-0 text-cobalt" /> {w.seatsLeft} of {w.seats} seats left
            </li>
          )}
        </ul>
        {taken != null && w.registrationOpen && (
          <div aria-hidden className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist">
            <div className="h-full rounded-full bg-bloom" style={{ width: `${Math.min((taken / w.seats) * 100, 100)}%` }} />
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <p className="font-display text-3xl font-bold leading-none">
            {w.currentPrice > 0 ? `₹${w.currentPrice}` : "Free"}
            {early && <span className="ml-2 font-sans text-base font-medium text-slate line-through">₹{w.price}</span>}
          </p>
          <span className="flex shrink-0 items-center gap-3 whitespace-nowrap font-semibold">
            {w.registrationOpen ? "Register" : "View details"} <Arrow />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function WorkshopGrid({ items }) {
  return (
    <ul className="grid gap-5 lg:grid-cols-2">
      {items.map((w) => (
        <li key={w._id} className="flex [&>a]:w-full">
          <WorkshopCard workshop={w} />
        </li>
      ))}
    </ul>
  );
}

const covers = [
  { bg: "bg-cobalt-deep", icon: "text-white/15", chip: "bg-white/15 text-white" },
  { bg: "bg-bloom", icon: "text-ink/15", chip: "bg-ink/10 text-ink" },
  { bg: "bg-leaf", icon: "text-white/20", chip: "bg-white/20 text-white" },
];

const coverIcon = (category = "") =>
  /pharm|medical|clinical/i.test(category) ? FlaskConical : /engineer|stack|ai|data/i.test(category) ? Braces : /college/i.test(category) ? GraduationCap : BookOpen;

export function ArticleCard({ article: a, index = 0, featured }) {
  const c = covers[index % covers.length];
  const Icon = coverIcon(a.category);
  const date = a.date && new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

  return (
    <Link
      href={`/resources/${a.slug}`}
      className={`group lift flex w-full overflow-hidden rounded-3xl bg-white ring-1 ring-line ${featured ? "flex-col lg:flex-row" : "flex-col"}`}
    >
      <div className={`relative overflow-hidden ${c.bg} ${featured ? "min-h-48 lg:w-[44%]" : "h-40"}`}>
        <div aria-hidden className="dots absolute inset-0 opacity-40" />
        <Icon aria-hidden strokeWidth={1} size={featured ? 260 : 170} className={`absolute -bottom-10 -right-6 transition-transform duration-300 ease-out-strong group-hover:-translate-y-2 group-hover:-rotate-6 ${c.icon}`} />
        <span className={`absolute left-5 top-5 rounded-lg px-3 py-1 text-sm font-semibold ${c.chip}`}>{a.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className={`font-bold group-hover:text-cobalt ${featured ? "text-3xl" : "text-2xl"}`}>{a.title}</h3>
        <p className="mt-3 text-slate">{a.description}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9rem] text-slate">
            {date && (
              <span className="flex items-center gap-1.5">
                <CalendarDays size={15} aria-hidden /> {date}
              </span>
            )}
            {a.minutes && (
              <span className="flex items-center gap-1.5">
                <Clock size={15} aria-hidden /> {a.minutes} min read
              </span>
            )}
          </span>
          <span className="flex shrink-0 items-center gap-3 whitespace-nowrap font-semibold">
            Read guide <Arrow />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ArticleGrid({ articles, feature = true }) {
  // the row under the featured card uses two columns unless the cards divide evenly into three
  const rest = feature ? articles.length - 1 : articles.length;
  const cols = rest % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <ul className={`grid gap-5 md:grid-cols-2 ${cols}`}>
      {articles.map((a, i) => {
        const featured = feature && i === 0;
        return (
          <li key={a.slug} className={`flex ${featured ? `md:col-span-2 ${rest % 3 === 0 ? "lg:col-span-3" : ""}` : ""}`}>
            <ArticleCard article={a} index={i} featured={featured} />
          </li>
        );
      })}
    </ul>
  );
}
