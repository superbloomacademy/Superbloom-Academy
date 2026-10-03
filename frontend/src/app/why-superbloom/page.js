import { CtaBand, DurationOptions, PageHero, Section } from "@/components/sections";

const description =
  "Why students choose Superbloom Academy in Hyderabad: an industry-aligned curriculum, trainers with industry experience, hands-on practice, flexible durations and a Certificate of Completion.";

export const metadata = {
  title: "Why Choose Superbloom Academy for Job-Oriented Training in Hyderabad",
  description,
  alternates: { canonical: "/why-superbloom" },
  openGraph: { description, url: "/why-superbloom" },
};

const reasons = [
  {
    title: "Training aligned to industry",
    desc: "The curriculum follows current industry standards and job requirements, so you learn what employers need.",
  },
  {
    title: "Faculty with industry experience",
    desc: "You learn from professionals who bring practical insight and current practice into the classroom.",
  },
  {
    title: "Theory and practice together",
    desc: "Classroom teaching is balanced with hands-on training, case studies and real-world projects.",
  },
  {
    title: "A career-focused approach",
    desc: "Each course is tied to specific job roles, with a clear path into your chosen field.",
  },
  {
    title: "Thorough assessment",
    desc: "Quizzes, practical assignments, presentations and a final examination check that the skills have landed.",
  },
  {
    title: "Certificate of Completion",
    desc: "A certificate that shows the training you completed and the assessments you passed.",
  },
];

const habits = [
  {
    title: "Practical skills",
    desc: "Hands-on experience with the tools, documents and processes used in industry settings.",
  },
  {
    title: "Industry exposure",
    desc: "Projects, case studies and clinical exposure that show how real problems are solved.",
  },
  {
    title: "Professional readiness",
    desc: "Communication, teamwork and problem-solving, practised alongside the technical work.",
  },
];

export default function WhySuperbloom() {
  return (
    <>
      <PageHero
        title="Why choose Superbloom Academy"
        lead="Six reasons students and colleges pick us for industry-oriented training."
        crumbs={[{ name: "Why Superbloom", href: "/why-superbloom" }]}
      />

      <Section tone="white">
        <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="border-t-2 border-ink pt-4">
              <dt className="font-display text-xl font-bold">{r.title}</dt>
              <dd className="mt-1.5 text-slate">{r.desc}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        tone="mist"
        title="Flexible durations"
        lead="Choose the format that fits your timetable and how deep you want to go."
      >
        <DurationOptions />
      </Section>

      <Section title="What students take into their first job">
        <dl className="grid gap-8 md:grid-cols-3">
          {habits.map((h) => (
            <div key={h.title} className="rounded-xl border border-line bg-white p-6">
              <dt className="font-display text-xl font-bold">{h.title}</dt>
              <dd className="mt-1.5 text-slate">{h.desc}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <CtaBand />
    </>
  );
}
