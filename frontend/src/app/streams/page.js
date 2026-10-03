import Link from "next/link";
import { CourseIndex, CtaBand, PageHero, Section } from "@/components/sections";

const description =
  "Superbloom Academy runs two training streams in Hyderabad: seven job-focused pharmacy courses and an engineering and technology stream for students and freshers.";

export const metadata = {
  title: "Training Streams: Pharmacy and Engineering Courses in Hyderabad",
  description,
  alternates: { canonical: "/streams" },
  openGraph: { description, url: "/streams" },
};

const streams = [
  {
    href: "/streams/pharmacy",
    title: "Pharmacy",
    desc: "Advanced clinical and industry-oriented training across seven domains, from pharmacovigilance to hospital pharmacy.",
    who: "D.Pharm, B.Pharm, M.Pharm, Pharm.D and Pharm.D (PB)",
    cert: "Certificate of Completion in Clinical and Industry-Oriented Pharmacy Training",
    cta: "See the pharmacy stream",
  },
  {
    href: "/streams/engineering",
    title: "Engineering and technology",
    desc: "Industry-oriented skill development programmes designed and delivered in collaboration with academic institutions.",
    who: "Engineering students, degree students, freshers and early-stage job seekers",
    cert: "Certificate of Completion in Engineering and Technology Training",
    cta: "See the engineering stream",
  },
];

export default function Streams() {
  return (
    <>
      <PageHero
        title="Choose your training stream"
        lead="Two streams, built for different degrees and different careers. Start with the one that matches what you studied."
        crumbs={[{ name: "Training streams", href: "/streams" }]}
      />

      <Section tone="white">
        <div className="grid gap-6 lg:grid-cols-2">
          {streams.map((s) => (
            <article key={s.href} className="flex flex-col rounded-2xl border-2 border-ink bg-paper p-7 sm:p-9">
              <h2 className="text-3xl font-bold">{s.title}</h2>
              <p className="mt-3 text-lg text-slate">{s.desc}</p>
              <dl className="mt-6 space-y-4 border-t border-line pt-6">
                <div>
                  <dt className="font-semibold">Who it is for</dt>
                  <dd className="text-slate">{s.who}</dd>
                </div>
                <div>
                  <dt className="font-semibold">What you receive</dt>
                  <dd className="text-slate">{s.cert}</dd>
                </div>
              </dl>
              <Link href={s.href} className="btn btn-ink mt-8 self-start">
                {s.cta}
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-8 text-lg">
          Not sure which fits you?{" "}
          <Link href="/contact" className="link">
            Ask us for guidance
          </Link>
          .
        </p>
      </Section>

      <Section title="Pharmacy courses and the roles they lead to" tone="mist">
        <CourseIndex />
      </Section>

      <CtaBand />
    </>
  );
}
