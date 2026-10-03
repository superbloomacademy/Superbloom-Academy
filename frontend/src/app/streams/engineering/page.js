import Link from "next/link";
import { CheckList, CtaBand, PageHero, Section } from "@/components/sections";
import { engineeringEligibility } from "@/lib/site";

const description =
  "Industry-oriented skill development for engineering students, degree students and freshers in Hyderabad, delivered with colleges through an academic and industry collaboration model.";

export const metadata = {
  title: "Engineering and Technology Training in Hyderabad for Students and Freshers",
  description,
  alternates: { canonical: "/streams/engineering" },
  openGraph: { description, url: "/streams/engineering" },
};

const approach = [
  { title: "Skill-based learning", desc: "The focus is on practical skills you can use directly at work." },
  { title: "Industry-relevant curriculum", desc: "Content follows current industry requirements and technology trends." },
  { title: "Practical orientation", desc: "You work on real-world projects and problem-solving scenarios." },
  { title: "Career readiness", desc: "We prepare you for the move from college to a professional role." },
];

const outcomes = [
  { title: "Skill enhancement", desc: "Stronger technical and professional skills that employers value." },
  { title: "Industry exposure", desc: "Experience of real projects and how industry teams work." },
  { title: "Improved employability", desc: "A more competitive profile when you apply for your first job." },
];

const roles = [
  "Software development",
  "Technical support",
  "Quality assurance and testing",
  "Project coordination",
  "Technical documentation",
  "System administration",
  "Database management",
  "Network administration",
];

export default function EngineeringStream() {
  return (
    <>
      <PageHero
        title="Engineering and technology training in Hyderabad"
        lead="Industry-oriented skill development that complements your degree and closes the gap between academic learning and practical, job-relevant skills."
        crumbs={[
          { name: "Training streams", href: "/streams" },
          { name: "Engineering", href: "/streams/engineering" },
        ]}
      >
        <Link href="/admission?stream=engineering" className="btn btn-bloom">
          Apply for the engineering stream
        </Link>
        <Link href="/contact" className="btn btn-line">
          Partner as a college
        </Link>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Who it is for</h2>
            <p className="mt-4 text-lg text-slate">
              The stream is designed for students and people at the very start of their careers who want hands-on
              experience and industry exposure alongside their institutional education.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-paper p-7">
            <CheckList items={engineeringEligibility} />
          </div>
        </div>
      </Section>

      <Section title="How the training is delivered" tone="mist">
        <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {approach.map((a) => (
            <div key={a.title} className="border-t-2 border-ink pt-4">
              <dt className="font-display text-xl font-bold">{a.title}</dt>
              <dd className="mt-1.5 text-slate">{a.desc}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Delivered with colleges">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="prose-sba max-w-[65ch] text-lg text-slate">
            <p>
              The engineering stream runs through an academic and industry collaboration framework: programmes are
              delivered in association with educational institutions.
            </p>
            <p>
              This keeps the training academically sound and relevant to industry, with student skill development and
              career readiness as the goal.
            </p>
          </div>
          <div className="self-start rounded-xl bg-ink p-7 text-white">
            <h3 className="text-2xl font-bold">For institutions</h3>
            <p className="mt-2 text-white/85">
              Bring industry-oriented training to your students. Tell us about your college and we will set up a
              conversation.
            </p>
            <Link href="/contact" className="btn btn-bloom mt-5">
              Discuss a collaboration
            </Link>
          </div>
        </div>
      </Section>

      <Section title="What you gain" tone="white">
        <div className="grid gap-12 lg:grid-cols-2">
          <dl className="space-y-6">
            {outcomes.map((o) => (
              <div key={o.title}>
                <dt className="font-display text-xl font-bold">{o.title}</dt>
                <dd className="mt-1 text-slate">{o.desc}</dd>
              </div>
            ))}
          </dl>
          <div>
            <h3 className="text-2xl font-bold">Entry-level areas the stream prepares you for</h3>
            <div className="mt-5">
              <CheckList items={roles} />
            </div>
            <p className="mt-6 text-slate">
              You receive a Certificate of Completion in Engineering and Technology Training.
            </p>
          </div>
        </div>
      </Section>

      <CtaBand title="Apply for the engineering stream" />
    </>
  );
}
