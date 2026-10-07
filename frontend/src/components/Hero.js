import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import AnnouncementLink from "./AnnouncementLink";
import RoleFinder from "./RoleFinder";
import { announcementKinds } from "@/lib/announcements";
import { programs } from "@/lib/programs";
import { site } from "@/lib/site";

const facts = [
  { value: String(programs.length), label: "job-oriented programmes" },
  { value: "2", label: "streams: engineering and pharmacy" },
  { value: "6 wks – 6 mo", label: "programme lengths" },
  { value: "Certificate", label: "of completion after assessment" },
];

function Stub({ item, small }) {
  const Icon = (announcementKinds[item.kind] || announcementKinds.news).icon;
  const size = small ? "h-12 w-12 rounded-xl" : "h-[4.5rem] w-[4.5rem] rounded-2xl";
  return item.date ? (
    <span className={`flex shrink-0 flex-col items-center justify-center bg-ink text-white ${size}`}>
      <span className={`font-semibold text-bloom ${small ? "text-[0.65rem] leading-none" : "text-xs"}`}>{item.date.month}</span>
      <span className={`font-display font-bold leading-none ${small ? "text-lg" : "text-3xl"}`}>{item.date.day}</span>
    </span>
  ) : (
    <span className={`flex shrink-0 items-center justify-center bg-bloom text-ink ${size}`}>
      <Icon size={small ? 22 : 32} aria-hidden />
    </span>
  );
}

// The card beside the headline: the first item in full, the rest as short rows.
export function HappeningNow({ items }) {
  const [first, ...rest] = items;
  const kind = announcementKinds[first.kind] || announcementKinds.news;

  return (
    <aside
      aria-label="Happening now"
      className="min-w-0 rounded-3xl bg-white p-2 text-ink shadow-[0_30px_70px_-24px_rgb(0_0_0/0.65)]"
    >
      <p className="flex items-center gap-2.5 px-4 pb-2 pt-3 text-sm font-bold">
        <span aria-hidden className="relative flex h-2.5 w-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-leaf opacity-70" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-leaf" />
        </span>
        Happening now
      </p>

      <div className="rounded-[1.25rem] bg-mist p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <Stub item={first} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-cobalt">{kind.label}</p>
            <h2 className="mt-0.5 break-words text-2xl font-bold">{first.title}</h2>
          </div>
        </div>
        {first.text && <p className="mt-4 line-clamp-3 text-slate">{first.text}</p>}
        {first.facts?.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
            {first.facts.map((f) => (
              <li key={f} className="rounded-md bg-white px-2.5 py-1 ring-1 ring-line">
                {f}
              </li>
            ))}
          </ul>
        )}
        <AnnouncementLink id={first.announcementId} href={first.href} className="btn btn-bloom mt-5 w-full">
          {first.cta} <ArrowRight size={18} aria-hidden />
        </AnnouncementLink>
      </div>

      {rest.length > 0 && (
        <ul>
          {rest.map((item) => (
            <li key={item.key} className="border-b border-line last:border-0">
              <AnnouncementLink
                id={item.announcementId}
                href={item.href}
                className="group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 hover:bg-mist"
              >
                <Stub item={item} small />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-lg font-semibold leading-snug">{item.title}</span>
                  <span className="block truncate text-sm text-slate">
                    {item.facts?.join(" · ") || (announcementKinds[item.kind] || announcementKinds.news).label}
                  </span>
                </span>
                <ArrowUpRight size={18} aria-hidden className="shrink-0 text-cobalt transition-transform duration-200 group-hover:rotate-45" />
              </AnnouncementLink>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

const lead =
  "Practical training, projects and workshops for students across Telangana and Andhra Pradesh, and campus training for their colleges.";

// Home page hero: navy. Beside the headline is what is happening now; when no
// announcement is live and no workshop is open, the programme finder takes its place.
export function Hero({ items }) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="dots absolute inset-0 opacity-60" />
      <div aria-hidden className="absolute -left-48 -top-56 h-[38rem] w-[38rem] rounded-full bg-cobalt/50 blur-3xl" />
      <div aria-hidden className="absolute -bottom-72 right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-bloom/20 blur-3xl" />

      <div className="wrap relative grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold ring-1 ring-white/15">
            <MapPin size={16} aria-hidden className="text-bloom" /> Telangana · Andhra Pradesh
          </p>
          <h1 className="mt-6 text-[2.6rem] font-bold sm:text-6xl">
            Industry‑ready skills for <span className="text-bloom">engineering</span> and{" "}
            <span className="text-bloom">pharmacy</span> students
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85 sm:text-xl">{lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/programs" className="btn btn-bloom">
              Explore programs
            </Link>
            <Link href="/for-colleges" className="btn btn-line-light">
              Training for your college
            </Link>
          </div>
        </div>

        {items.length > 0 ? (
          <HappeningNow items={items} />
        ) : (
          <div className="min-w-0 rounded-2xl ring-1 ring-white/20">
            <RoleFinder />
          </div>
        )}
      </div>

      <div className="relative border-t border-white/15 bg-white/[0.04]">
        <dl className="wrap grid grid-cols-2 gap-x-6 gap-y-6 py-7 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-sm text-white/70">{f.label}</dt>
              <dd className="font-display text-2xl font-bold sm:text-3xl">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
