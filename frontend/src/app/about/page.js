import Link from "next/link";
import { CtaBand, PageHero, Section } from "@/components/sections";

const description =
  "Superbloom Academy is a training institute in Suraram, Hyderabad that bridges the gap between academic education and industry requirements for pharmacy and engineering students.";

export const metadata = {
  title: "About Superbloom Academy, a Training Institute in Suraram, Hyderabad",
  description,
  alternates: { canonical: "/about" },
  openGraph: { description, url: "/about" },
};

const focus = [
  { title: "Employability", desc: "Giving students the skills and knowledge that make them useful to an employer from the first week." },
  { title: "Professional competency", desc: "Building the communication, teamwork and problem-solving that sit around technical skill." },
  { title: "Industry standards", desc: "Keeping every programme in line with current industry standards and good practice." },
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
        <div className="prose-sba max-w-[65ch] text-lg text-slate">
          <p>
            Superbloom Academy is a training institute in Suraram, Hyderabad, dedicated to employability and
            professional competency. We see the same gap every year: students graduate knowing their subject and still
            find the first job unfamiliar. Our programmes are built to close that gap.
          </p>
          <p>
            Each programme is structured around current industry standards and what the job market is asking for. We
            run two specialised streams, one for{" "}
            <Link href="/programs/pharmacy" className="link">
              pharmacy students
            </Link>{" "}
            and one for{" "}
            <Link href="/programs/engineering" className="link">
              engineering students
            </Link>
            , so the training matches the career paths of each discipline.
          </p>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Our training philosophy</h2>
            <div className="prose-sba mt-4 text-lg text-slate">
              <p>
                Learning sticks when theory meets practice. Our training is hands-on and skill-based, and it prepares
                students for the problems they will meet at work.
              </p>
              <p>
                Every programme includes case studies, practical demonstrations and industry-oriented projects that
                mirror real workplace situations.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Our commitment</h2>
            <div className="prose-sba mt-4 text-lg text-slate">
              <p>
                We hold our training to a high standard and update the curriculum as industry practice and requirements
                change.
              </p>
              <p>
                We develop technical skill and the professional habits employers value alongside it.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="What we focus on">
        <dl className="grid gap-8 md:grid-cols-3">
          {focus.map((f) => (
            <div key={f.title} className="border-t-2 border-ink pt-4">
              <dt className="font-display text-xl font-bold">{f.title}</dt>
              <dd className="mt-1.5 text-slate">{f.desc}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <CtaBand />
    </>
  );
}
