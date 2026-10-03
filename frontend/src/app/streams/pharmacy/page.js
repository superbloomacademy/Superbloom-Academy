import Link from "next/link";
import { CheckList, CourseIndex, CtaBand, DurationOptions, Faq, PageHero, Section } from "@/components/sections";
import { assessment, faqs, methodology, pharmacyEligibility } from "@/lib/site";

const title = "Pharmacy Training Courses in Hyderabad after B.Pharm, M.Pharm and Pharm.D";
const description =
  "Clinical and industry-oriented training for pharmacy students in Hyderabad. Seven job-focused courses: pharmacovigilance, clinical research, medical coding, QC, QA, regulatory affairs and hospital pharmacy.";

export const metadata = {
  title: "Pharmacy Training Courses in Hyderabad after B.Pharm and Pharm.D",
  description,
  alternates: { canonical: "/streams/pharmacy" },
  openGraph: { title, description, url: "/streams/pharmacy" },
};

export default function PharmacyStream() {
  return (
    <>
      <PageHero
        title="Pharmacy training courses in Hyderabad"
        lead="An advanced clinical and industry-oriented programme that connects a pharmacy degree to real clinical and industry practice. Seven domains, each built around the entry-level roles companies hire for."
        crumbs={[
          { name: "Training streams", href: "/streams" },
          { name: "Pharmacy", href: "/streams/pharmacy" },
        ]}
      >
        <Link href="/admission" className="btn btn-bloom">
          Apply for the pharmacy stream
        </Link>
        <Link href="/contact" className="btn btn-line">
          Ask about fees and batches
        </Link>
      </PageHero>

      <Section
        title="Courses after B.Pharm, M.Pharm and Pharm.D"
        lead="Choose one domain or talk to us about combining them. Each course page has the full list of what you will practise."
        tone="white"
      >
        <CourseIndex />
      </Section>

      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Who can join</h2>
            <p className="mt-4 text-lg text-slate">
              The stream is open to pharmacy students at every level, whether you are still in college or have
              graduated and are looking for your first role.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-white p-7">
            <CheckList items={pharmacyEligibility} columns={1} />
          </div>
        </div>
      </Section>

      <Section title="Training duration" lead="Three formats, so you can fit training around your college timetable.">
        <DurationOptions />
      </Section>

      <Section title="Training method and assessment" tone="white">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {methodology.map((m) => (
              <div key={m.title} className="border-t-2 border-ink pt-4">
                <dt className="font-display text-xl font-bold">{m.title}</dt>
                <dd className="mt-1.5 text-slate">{m.desc}</dd>
              </div>
            ))}
          </dl>
          <div className="self-start rounded-xl bg-mist p-7">
            <h3 className="text-2xl font-bold">Certificate of Completion</h3>
            <p className="mt-2 text-slate">In Clinical and Industry-Oriented Pharmacy Training, awarded after:</p>
            <div className="mt-5">
              <CheckList items={assessment} columns={1} />
            </div>
          </div>
        </div>
      </Section>

      <Faq items={faqs.filter((f) => !f.q.startsWith("What is"))} title="Pharmacy stream questions" />
      <CtaBand title="Apply for the pharmacy stream" />
    </>
  );
}
