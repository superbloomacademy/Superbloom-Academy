import Link from "next/link";
import {
  ArrowUpRight, Award, Building2, ChartNoAxesCombined, ChevronRight, ClipboardCheck, FlaskConical, Layers,
  ListChecks, MessagesSquare, Monitor, Presentation, UserCheck, Users,
} from "lucide-react";
import CollegeForm from "@/components/CollegeForm";
import JsonLd from "@/components/JsonLd";
import { Faq, Section } from "@/components/sections";
import { breadcrumbLd } from "@/lib/jsonld";
import { programHref, programs, programsIn } from "@/lib/programs";
import { og } from "@/lib/seo";

const description =
  "Campus training programs for engineering and pharmacy colleges across Telangana and Andhra Pradesh, delivered on your campus. Request a proposal.";

export const metadata = {
  title: "Campus Training Programs for Colleges",
  description,
  alternates: { canonical: "/for-colleges" },
  openGraph: og({ description, url: "/for-colleges" }),
};

// A real sequence, so it is numbered.
const steps = [
  { icon: MessagesSquare, title: "Understand your requirements", desc: "We talk to the principal, TPO or HOD about the students, the departments and what you want them to be able to do." },
  { icon: ListChecks, title: "Select programmes", desc: "Together we choose the programmes that fit each department and year." },
  { icon: Users, title: "Plan student cohorts", desc: "Batches, timetable and mode are fixed around the academic calendar." },
  { icon: UserCheck, title: "Deploy trainers", desc: "We assign trainers for each programme." },
  { icon: Presentation, title: "Deliver training on campus", desc: "Classes, practice and assignments run on your campus, online or both." },
  { icon: ClipboardCheck, title: "Assess students", desc: "Quizzes, assignments and evaluations track each student's progress." },
  { icon: Award, title: "Projects and certification", desc: "Students complete project work and receive a Certificate of Completion." },
  { icon: ChartNoAxesCombined, title: "Review outcomes", desc: "We go through attendance, assessment results and feedback with you." },
];

const glance = [
  { value: String(programs.length), label: "programmes with a published curriculum" },
  { value: "8", label: "steps, from first conversation to outcome review" },
  { value: "3", label: "delivery modes: on campus, online, hybrid" },
];

const collegeFaqs = [
  {
    q: "Which colleges do you work with?",
    a: "Engineering colleges, pharmacy colleges and degree colleges. Training is planned per department and year.",
  },
  {
    q: "Can training run on our campus?",
    a: "Yes. Campus training is delivered at your college. Online and hybrid delivery are also possible.",
  },
  {
    q: "Which years of students can you train?",
    a: "First year to final year. The programme and depth are chosen to suit each year.",
  },
  {
    q: "How is the cost decided?",
    a: "It depends on the programmes, the number of students and the duration. We send a written proposal after understanding your requirements.",
  },
  {
    q: "How do we start?",
    a: "Fill in the proposal request form on this page. Our team will call you and arrange a meeting or a demo session.",
  },
];

const crumbs = [{ name: "For colleges", href: "/for-colleges" }];

function Department({ category, icon: Icon, title, who, dark }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl p-7 sm:p-9 ${dark ? "bg-cobalt-deep text-white" : "bg-white ring-1 ring-line"}`}>
      {dark && <div aria-hidden className="dots absolute inset-0 opacity-50" />}
      <Icon aria-hidden size={220} strokeWidth={1} className={`absolute -bottom-10 -right-8 ${dark ? "text-white/[0.08]" : "text-cobalt/[0.07]"}`} />
      <div className="relative">
        <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${dark ? "bg-bloom text-ink" : "bg-mist text-cobalt"}`}>
          <Icon size={28} aria-hidden />
        </span>
        <h3 className="mt-5 text-2xl font-bold sm:text-3xl">{title}</h3>
        <p className={`mt-2 ${dark ? "text-white/80" : "text-slate"}`}>{who}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {programsIn(category).map((p) => (
            <li key={p.slug}>
              <Link
                href={programHref(p)}
                className={`group inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[0.95rem] font-semibold transition-colors duration-150 ${
                  dark ? "bg-white/10 hover:bg-bloom hover:text-ink" : "bg-paper ring-1 ring-line hover:bg-ink hover:text-white"
                }`}
              >
                {p.name}
                <ArrowUpRight size={15} aria-hidden className="opacity-50 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ForColleges() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="dots absolute inset-0 opacity-60" />
        <div aria-hidden className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-cobalt/40 blur-3xl" />
        <div className="wrap relative grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <nav aria-label="Breadcrumb" className="mb-5 text-sm font-medium text-white/70">
              <ol className="flex items-center gap-1">
                <li>
                  <Link href="/" className="hover:text-white hover:underline">
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight size={14} aria-hidden />
                  <span aria-current="page" className="text-white">
                    For colleges
                  </span>
                </li>
              </ol>
            </nav>
            <h1 className="text-4xl font-bold sm:text-[3.4rem]">Bring industry-oriented training to your campus</h1>
            <p className="mt-5 max-w-xl text-lg text-white/85 sm:text-xl">
              Structured skill development programmes for engineering and pharmacy colleges, delivered directly to your
              students by our trainers.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#proposal" className="btn btn-bloom">
                Request a college proposal
              </a>
              <a href="#process" className="btn btn-line-light">
                See how it works
              </a>
            </div>
          </div>

          <dl className="grid gap-3">
            {glance.map((g, i) => (
              <div
                key={g.label}
                className={`flex items-center gap-5 rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/15 backdrop-blur-sm ${i === 1 ? "lg:ml-10" : i === 2 ? "lg:ml-20" : ""}`}
              >
                <dd className="font-display text-4xl font-bold text-bloom sm:text-5xl">{g.value}</dd>
                <dt className="text-lg text-white/85">{g.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <JsonLd data={breadcrumbLd(crumbs)} />

      <Section
        tone="paper"
        title="Skill development programs for colleges"
        lead="Choose programmes by department. Each one has a published curriculum, so you know exactly what your students will be taught."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <Department
            category="engineering"
            icon={Layers}
            title="Technical training for engineering colleges"
            who="For CSE, IT and other branches, first year to final year."
            dark
          />
          <Department
            category="pharmacy"
            icon={FlaskConical}
            title="Industry training for pharmacy colleges"
            who="For B.Pharm, M.Pharm, D.Pharm and Pharm.D students."
          />
        </div>
      </Section>

      {/* Process */}
      <section id="process" className="relative scroll-mt-20 overflow-hidden bg-ink py-16 text-white sm:py-24">
        <div aria-hidden className="dots absolute inset-0 opacity-50" />
        <div aria-hidden className="absolute -bottom-52 -left-40 h-[36rem] w-[36rem] rounded-full bg-cobalt/30 blur-3xl" />
        <div className="wrap relative">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="max-w-2xl text-3xl font-bold sm:text-5xl">How a campus training programme runs</h2>
              <p className="mt-4 max-w-2xl text-lg text-white/80">
                Eight steps from the first conversation to the outcome review, so you always know what happens next.
              </p>
            </div>
            <div className="flex gap-3 text-sm font-semibold">
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <Building2 size={16} aria-hidden className="text-bloom" /> On campus
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <Monitor size={16} aria-hidden className="text-bloom" /> Online or hybrid
              </span>
            </div>
          </div>

          <ol className="reveal mt-14 grid gap-x-5 gap-y-8 lg:grid-cols-4 lg:gap-y-12">
            {steps.map((s, i) => (
              <li key={s.title} className="group relative grid grid-cols-[3rem_minmax(0,1fr)] gap-4 lg:block">
                {/* connector to the next step: vertical on phones, horizontal on desktop */}
                {i < steps.length - 1 && (
                  <span aria-hidden className="absolute bottom-[-2rem] left-6 top-12 w-px bg-white/25 lg:hidden" />
                )}
                {i % 4 !== 3 && (
                  <span aria-hidden className="absolute left-12 right-[-1.25rem] top-6 hidden h-px bg-gradient-to-r from-bloom to-white/20 lg:block" />
                )}

                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-bloom font-display text-xl font-bold text-ink ring-4 ring-ink transition-transform duration-200 ease-out-strong group-hover:scale-110">
                  {i + 1}
                </span>

                <div className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10 transition-colors duration-200 group-hover:bg-white/[0.11] lg:mt-5">
                  <s.icon size={26} aria-hidden className="text-bloom" />
                  <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
                  <p className="mt-1.5 text-white/75">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Section tone="paper" id="proposal">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-3xl font-bold sm:text-4xl">Request a college proposal</h2>
            <p className="mt-4 text-lg text-slate">
              Tell us about your college and students. We will call you, understand what you need and send a proposal
              with the programmes, schedule and cost.
            </p>
            <ol className="mt-7 space-y-4">
              {["Send this form", "We call you and arrange a meeting", "You receive a written proposal"].map((t, i) => (
                <li key={t} className="flex items-center gap-4 font-semibold">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-display text-white">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
            <p className="mt-7 text-slate">Workshops and guest sessions on campus can be requested through the same form.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-[0_30px_60px_-30px_rgb(10_26_74/0.35)] ring-1 ring-line sm:p-9">
            <CollegeForm />
          </div>
        </div>
      </Section>

      <Faq items={collegeFaqs} title="Questions from colleges" />
    </>
  );
}
