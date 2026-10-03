import Link from "next/link";
import {
  ArrowUpRight, Award, CalendarDays, Clock, FolderKanban, GraduationCap, MapPin, PencilLine, Phone, Presentation,
  School,
} from "lucide-react";
import { ArticleGrid, ProgramGrid, WorkshopGrid } from "@/components/cards";
import RoleFinder from "@/components/RoleFinder";
import { Faq, Section } from "@/components/sections";
import { getWorkshops } from "@/lib/api";
import { getAllArticles } from "@/lib/content";
import { categories, programs, programsIn } from "@/lib/programs";
import { faqs, fullAddress, site, telHref, formatPhone } from "@/lib/site";

export const metadata = {
  title: { absolute: "Superbloom Academy | Industry-Oriented Training for Students and Colleges in Hyderabad" },
  description: site.description,
  alternates: { canonical: "/" },
};

export const revalidate = 60;

// Three kinds of visitor, three starting points.
const paths = [
  {
    icon: GraduationCap,
    who: "I am a student",
    title: "Join a programme",
    desc: `${programs.length} job-oriented programmes for engineering and pharmacy students, each with a published curriculum.`,
    href: "/programs",
    cta: "Explore programs",
  },
  {
    icon: School,
    who: "I represent a college",
    title: "Bring training to campus",
    desc: "Skill development programmes delivered on your campus to a whole batch, planned around the academic calendar.",
    href: "/for-colleges",
    cta: "See campus training",
  },
  {
    icon: CalendarDays,
    who: "I want to try first",
    title: "Attend a workshop",
    desc: "Short, hands-on sessions on one skill or tool, before you commit to a full programme.",
    href: "/workshops",
    cta: "See workshops",
  },
];

// A real sequence, so it is numbered.
const flow = [
  { icon: Presentation, title: "Learn", desc: "Trainer-led classes and demonstrations build the theory each task depends on." },
  { icon: PencilLine, title: "Practise", desc: "Assignments and case studies on the tasks a trainee is given in a first job." },
  { icon: FolderKanban, title: "Build", desc: "A project that mirrors a real deliverable." },
  { icon: Award, title: "Get certified", desc: "Quizzes, a final evaluation and a viva lead to your Certificate of Completion." },
];

const streamHeadings = {
  engineering: "Courses for engineering students",
  pharmacy: "Job-oriented courses for pharmacy students",
};

export default async function Home() {
  const today = new Date(new Date().toDateString());
  const upcoming = (await getWorkshops()).filter((w) => w.registrationOpen && new Date(w.date) >= today).slice(0, 2);
  const articles = (await getAllArticles()).slice(0, 3);

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b border-line bg-mist">
        <div aria-hidden className="dots-ink absolute inset-0" />
        <div aria-hidden className="absolute -left-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-cobalt/15 blur-3xl" />
        <div className="wrap relative grid grid-cols-1 gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14 lg:py-20">
          <div>
            <h1 className="text-[2.5rem] font-bold sm:text-[3.4rem]">
              Industry-oriented training for engineering and pharmacy students
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate sm:text-xl">
              From classroom learning to industry-ready skills. Practical training, projects and workshops in
              Hyderabad, for students who join on their own and for colleges that want training on campus.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/programs" className="btn btn-bloom">
                Explore programs
              </Link>
              <Link href="/for-colleges" className="btn btn-line">
                Training for your college
              </Link>
            </div>
          </div>
          <RoleFinder />
        </div>
      </section>

      {/* 2. Three starting points */}
      <Section tone="paper" title="Where would you like to start?">
        <ul className="grid gap-5 md:grid-cols-3">
          {paths.map((p, i) => {
            const dark = i === 0;
            return (
              <li key={p.href} className="flex">
                <Link
                  href={p.href}
                  className={`group lift relative flex w-full flex-col overflow-hidden rounded-3xl p-7 ${dark ? "bg-ink text-white" : "bg-white ring-1 ring-line"}`}
                >
                  {dark && <div aria-hidden className="dots absolute inset-0 opacity-50" />}
                  <p.icon aria-hidden size={170} strokeWidth={1} className={`absolute -bottom-9 -right-7 ${dark ? "text-white/[0.07]" : "text-cobalt/[0.06]"}`} />
                  <div className="relative flex flex-1 flex-col">
                    <span className={`flex h-13 w-13 items-center justify-center rounded-2xl ${dark ? "bg-bloom text-ink" : i === 1 ? "bg-mist text-cobalt" : "bg-leaf-soft text-leaf"}`}>
                      <p.icon size={26} aria-hidden />
                    </span>
                    <p className={`mt-5 font-semibold ${dark ? "text-bloom" : "text-cobalt"}`}>{p.who}</p>
                    <h3 className="mt-1 text-2xl font-bold sm:text-3xl">{p.title}</h3>
                    <p className={`mt-3 ${dark ? "text-white/80" : "text-slate"}`}>{p.desc}</p>
                    <span className="mt-auto flex items-center justify-between gap-4 pt-7 font-semibold">
                      {p.cta}
                      <span aria-hidden className={`flex h-10 w-10 items-center justify-center rounded-full transition-[background-color,color,transform] duration-200 ease-out-strong group-hover:rotate-45 group-hover:bg-bloom group-hover:text-ink ${dark ? "bg-white/15" : "bg-mist"}`}>
                        <ArrowUpRight size={18} />
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* 3. Programme preview, one row per stream */}
      {["engineering", "pharmacy"].map((key, i) => {
        const cat = categories[key];
        return (
          <Section key={key} tone={i ? "paper" : "mist"} title={streamHeadings[key]} lead={cat.lead}>
            <ProgramGrid category={key} limit={2} />
            <Link href={`/programs/${key}`} className="btn btn-ink mt-8">
              See all {programsIn(key).length} {cat.name.toLowerCase()} programs
            </Link>
          </Section>
        );
      })}

      {/* 4. How it works */}
      <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-24">
        <div aria-hidden className="dots absolute inset-0 opacity-50" />
        <div aria-hidden className="absolute -bottom-52 -right-40 h-[36rem] w-[36rem] rounded-full bg-cobalt/30 blur-3xl" />
        <div className="wrap relative">
          <h2 className="max-w-2xl text-3xl font-bold sm:text-5xl">How the training works</h2>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Every programme follows the same four stages, so you finish able to do the work and able to show it.
          </p>
          <ol className="reveal mt-12 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {flow.map((s, i) => (
              <li key={s.title} className="group relative">
                {i < flow.length - 1 && (
                  <span aria-hidden className="absolute left-12 right-[-1.25rem] top-6 hidden h-px bg-gradient-to-r from-bloom to-white/20 lg:block" />
                )}
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-bloom font-display text-xl font-bold text-ink ring-4 ring-ink">
                  {i + 1}
                </span>
                <div className="mt-5 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10 transition-colors duration-200 group-hover:bg-white/[0.11]">
                  <s.icon size={26} aria-hidden className="text-bloom" />
                  <h3 className="mt-3 text-2xl font-bold">{s.title}</h3>
                  <p className="mt-1.5 text-white/75">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Colleges */}
      <Section tone="paper">
        <div className="relative overflow-hidden rounded-3xl bg-cobalt-deep p-7 text-white sm:p-12">
          <div aria-hidden className="dots absolute inset-0 opacity-50" />
          <School aria-hidden size={300} strokeWidth={1} className="absolute -bottom-16 -right-10 text-white/[0.07]" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_auto] lg:items-center">
            <div>
              <p className="font-semibold text-bloom">For principals, TPOs and HODs</p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Campus training programs for colleges</h2>
              <p className="mt-4 max-w-xl text-lg text-white/85">
                Bring skill development programmes for engineering and pharmacy students to your campus. We plan the
                cohorts, deploy trainers, assess students and review the outcomes with you.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/for-colleges#proposal" className="btn btn-bloom">
                Request a college proposal
              </Link>
              <Link href="/for-colleges" className="btn btn-line-light">
                How campus training works
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 6. Workshops, only when registration is open */}
      {upcoming.length > 0 && (
        <Section title="Upcoming workshops" tone="mist">
          <WorkshopGrid items={upcoming} />
          <Link href="/workshops" className="link mt-6 inline-block">
            See all workshops
          </Link>
        </Section>
      )}

      {/* 7. Guides */}
      <Section title="Career guides" lead="Answers to the questions students ask us most." tone={upcoming.length ? "paper" : "mist"}>
        <ArticleGrid articles={articles} feature={false} />
        <Link href="/resources" className="link mt-6 inline-block">
          See all guides
        </Link>
      </Section>

      {/* 8. Questions */}
      <Faq items={faqs} />

      {/* 9. Closing: visit details and the call to action together */}
      <section className="relative overflow-hidden bg-cobalt-deep text-white">
        <div aria-hidden className="dots absolute inset-0 opacity-50" />
        <div className="wrap relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <h2 className="text-3xl font-bold sm:text-5xl">Talk to us about the next batch</h2>
            <p className="mt-4 max-w-xl text-lg text-white/85">
              Send your details and we will call you about the programme, batch timings and fees. Or visit the academy
              in Suraram during office hours.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/admission" className="btn btn-bloom">
                Apply for admission
              </Link>
              <a href={telHref(site.phones[0])} className="btn btn-line-light">
                <Phone size={18} aria-hidden /> {formatPhone(site.phones[0])}
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-white/[0.07] p-6 ring-1 ring-white/15 sm:p-8">
            <h3 className="flex items-center gap-3 text-xl font-bold">
              <MapPin size={22} aria-hidden className="text-bloom" /> Visit the academy
            </h3>
            <address className="mt-3 not-italic text-white/85">{fullAddress}</address>
            <a
              className="mt-2 inline-block font-semibold text-bloom underline underline-offset-4 hover:text-white"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Superbloom Academy, ${fullAddress}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
            <h3 className="mt-7 flex items-center gap-3 text-xl font-bold">
              <Clock size={22} aria-hidden className="text-bloom" /> Office hours
            </h3>
            <dl className="mt-3 space-y-1.5 text-white/85">
              {site.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4">
                  <dt>{h.days}</dt>
                  <dd className="text-right font-semibold text-white">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
