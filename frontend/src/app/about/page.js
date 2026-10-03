import Link from "next/link";
import { ArrowUpRight, BadgeCheck, CalendarDays, FlaskConical, Layers, School, Target, UsersRound, Wrench } from "lucide-react";
import { CtaBand, FeatureGrid, PageHero, Section } from "@/components/sections";
import { programsIn } from "@/lib/programs";
import { og } from "@/lib/seo";

const description =
  "Superbloom Academy is a training institute in Suraram, Hyderabad that connects academic education to industry needs for students and colleges.";

export const metadata = {
  title: { absolute: "About Superbloom Academy | Training Institute, Hyderabad" },
  description,
  alternates: { canonical: "/about" },
  openGraph: og({ description, url: "/about" }),
};

const focus = [
  { icon: UsersRound, title: "Employability", desc: "Giving students the skills and knowledge that make them useful to an employer from the first week." },
  { icon: Wrench, title: "Professional competency", desc: "Building the communication, teamwork and problem-solving that sit around technical skill." },
  { icon: BadgeCheck, title: "Industry standards", desc: "Keeping every programme in line with current industry standards and good practice." },
];

const work = [
  {
    icon: Layers,
    title: "Engineering programs",
    desc: `${programsIn("engineering").length} technical programmes for engineering and degree students, built around projects.`,
    href: "/programs/engineering",
  },
  {
    icon: FlaskConical,
    title: "Pharmacy programs",
    desc: `${programsIn("pharmacy").length} clinical and industry-oriented programmes for pharmacy students.`,
    href: "/programs/pharmacy",
  },
  {
    icon: School,
    title: "Campus training",
    desc: "The same programmes delivered on campus for a whole college batch.",
    href: "/for-colleges",
  },
  {
    icon: CalendarDays,
    title: "Workshops",
    desc: "Short, hands-on sessions on a single skill or tool.",
    href: "/workshops",
  },
];

export default function About() {
  return (
    <>
      <PageHero
        title="About Superbloom Academy"
        lead="We exist to close the gap between what a degree teaches and what an employer expects on day one."
        crumbs={[{ name: "About", href: "/about" }]}
      />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Why Superbloom exists</h2>
            <div className="prose-sba mt-5 max-w-[65ch] text-lg text-slate">
              <p>
                Superbloom Academy is a training institute in Suraram, Hyderabad, dedicated to employability and
                professional competency. We see the same gap every year: students graduate knowing their subject and
                still find the first job unfamiliar. Our programmes are built to close that gap.
              </p>
              <p>
                Each programme is structured around current industry standards and what the job market is asking for.
                We work with students who join on their own and with colleges that want training delivered on campus.
              </p>
            </div>
          </div>
          <blockquote className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white sm:p-10">
            <div aria-hidden className="dots absolute inset-0 opacity-50" />
            <Target aria-hidden size={36} className="relative text-bloom" />
            <p className="relative mt-5 font-display text-2xl font-bold leading-snug sm:text-3xl">
              Learning sticks when theory meets practice.
            </p>
            <p className="relative mt-4 text-white/80">
              Every programme includes case studies, practical demonstrations and industry-oriented projects that
              mirror real workplace situations.
            </p>
          </blockquote>
        </div>
      </Section>

      <Section tone="mist" title="What we do">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {work.map((w) => (
            <li key={w.href} className="flex">
              <Link href={w.href} className="group lift flex w-full flex-col rounded-3xl bg-white p-6 ring-1 ring-line">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-cobalt">
                  <w.icon size={24} aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-bold group-hover:text-cobalt">{w.title}</h3>
                <p className="mt-2 text-slate">{w.desc}</p>
                <span aria-hidden className="mt-auto flex h-10 w-10 items-center justify-center self-end rounded-full bg-mist pt-0 transition-[background-color,transform] duration-200 ease-out-strong group-hover:rotate-45 group-hover:bg-bloom">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="What we focus on" tone="paper">
        <FeatureGrid items={focus} />
      </Section>

      <Section tone="white">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl bg-paper p-7 ring-1 ring-line sm:p-9">
            <h2 className="text-2xl font-bold sm:text-3xl">Our training philosophy</h2>
            <p className="mt-4 text-lg text-slate">
              Our training is hands-on and skill-based, and it prepares students for the problems they will meet at
              work. Theory is taught for the sake of the task it supports.
            </p>
          </div>
          <div className="rounded-3xl bg-paper p-7 ring-1 ring-line sm:p-9">
            <h2 className="text-2xl font-bold sm:text-3xl">Our commitment</h2>
            <p className="mt-4 text-lg text-slate">
              We hold our training to a high standard and update the curriculum as industry practice and requirements
              change. We develop technical skill and the professional habits employers value alongside it.
            </p>
          </div>
        </div>
        <p className="mt-8 text-lg">
          Want the short version of what sets us apart?{" "}
          <Link href="/why-superbloom" className="link">
            Why choose Superbloom
          </Link>
          .
        </p>
      </Section>

      <CtaBand />
    </>
  );
}
