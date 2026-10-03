import Link from "next/link";
import CollegeForm from "@/components/CollegeForm";
import { Faq, PageHero, Section } from "@/components/sections";
import { programHref, programsIn } from "@/lib/programs";

const description =
  "Campus training programs for engineering and pharmacy colleges in Hyderabad and Telangana. Industry-oriented skill development delivered on your campus. Request a college proposal.";

export const metadata = {
  title: "Campus Training Programs for Engineering and Pharmacy Colleges",
  description,
  alternates: { canonical: "/for-colleges" },
  openGraph: { description, url: "/for-colleges" },
};

// A real sequence, so it is numbered.
const steps = [
  { title: "Understand your requirements", desc: "We talk to the principal, TPO or HOD about the students, the departments and what you want them to be able to do." },
  { title: "Select programmes", desc: "Together we choose the programmes that fit each department and year." },
  { title: "Plan student cohorts", desc: "Batches, timetable and mode are fixed around the academic calendar." },
  { title: "Deploy trainers", desc: "We assign trainers for each programme." },
  { title: "Deliver training on campus", desc: "Classes, practice and assignments run on your campus, online or both." },
  { title: "Assess students", desc: "Quizzes, assignments and evaluations track each student's progress." },
  { title: "Projects and certification", desc: "Students complete project work and receive a Certificate of Completion." },
  { title: "Review outcomes", desc: "We go through attendance, assessment results and feedback with you." },
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

function ProgramList({ category, title, who }) {
  return (
    <div className="rounded-2xl border-2 border-ink bg-paper p-7">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-2 text-slate">{who}</p>
      <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {programsIn(category).map((p) => (
          <li key={p.slug}>
            <Link href={programHref(p)} className="link font-semibold">
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ForColleges() {
  return (
    <>
      <PageHero
        title="Bring industry-oriented training to your campus"
        lead="Structured skill development programmes for engineering and pharmacy colleges, delivered directly to your students by our trainers."
        crumbs={[{ name: "For colleges", href: "/for-colleges" }]}
      >
        <a href="#proposal" className="btn btn-bloom">
          Request a college proposal
        </a>
        <Link href="/programs" className="btn btn-line">
          See all programs
        </Link>
      </PageHero>

      <Section
        tone="white"
        title="Skill development programs for colleges"
        lead="Choose programmes by department. Each one has a published curriculum, so you know exactly what your students will be taught."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <ProgramList
            category="engineering"
            title="Technical training for engineering colleges"
            who="For CSE, IT and other branches, first year to final year."
          />
          <ProgramList
            category="pharmacy"
            title="Industry training for pharmacy colleges"
            who="For B.Pharm, M.Pharm, D.Pharm and Pharm.D students."
          />
        </div>
      </Section>

      <Section tone="mist" title="How a campus training programme runs">
        <ol className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t-2 border-ink pt-4">
              <span className="font-display text-sm font-bold text-cobalt">Step {i + 1}</span>
              <h3 className="mt-1 text-xl font-bold">{s.title}</h3>
              <p className="mt-1.5 text-slate">{s.desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="white" id="proposal">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Request a college proposal</h2>
            <p className="mt-4 text-lg text-slate">
              Tell us about your college and students. We will call you, understand what you need and send a proposal
              with the programmes, schedule and cost.
            </p>
            <p className="mt-4 text-slate">
              Workshops and guest sessions on campus can be requested through the same form.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-mist p-6 sm:p-9">
            <CollegeForm />
          </div>
        </div>
      </Section>

      <Faq items={collegeFaqs} title="Questions from colleges" />
    </>
  );
}
