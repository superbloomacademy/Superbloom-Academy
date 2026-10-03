import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHero, Section } from "@/components/sections";
import { getOpenJobs, jobFacts } from "@/lib/api";

const description =
  "Work at Superbloom Academy in Hyderabad. See open roles for trainers and staff and apply online with your resume.";

export const metadata = {
  title: "Careers at Superbloom Academy: Open Jobs in Hyderabad",
  description,
  alternates: { canonical: "/careers" },
  openGraph: { description, url: "/careers" },
};

const reasons = [
  { title: "Career growth", desc: "Progression is based on what you deliver." },
  { title: "Real ownership", desc: "You work on real programmes with results you can measure." },
  { title: "Room to try things", desc: "Curiosity and experiment are rewarded." },
  { title: "Learning and leadership", desc: "Mentorship, workshops and exposure to leadership." },
];

export default async function Careers() {
  const jobs = await getOpenJobs();

  return (
    <>
      <PageHero
        title="Work at Superbloom Academy"
        lead="Help us turn students into professionals who are ready for their first job."
        crumbs={[{ name: "Careers", href: "/careers" }]}
      />

      <Section title="Open roles" tone="white" id="open-roles">
        {jobs.length === 0 ? (
          <div className="max-w-2xl rounded-xl border border-line bg-mist p-7">
            <h3 className="text-xl font-bold">There are no open roles right now</h3>
            <p className="mt-2 text-slate">
              New roles are posted here first. If you would like us to keep your profile in mind,{" "}
              <Link href="/contact" className="link">
                send us a message
              </Link>
              .
            </p>
          </div>
        ) : (
          <ul className="border-t-2 border-ink">
            {jobs.map((job) => (
              <li key={job._id} className="border-b border-line">
                <Link
                  href={`/careers/${job._id}`}
                  className="group flex items-center justify-between gap-6 py-6 hover:bg-mist sm:px-3"
                >
                  <div>
                    <h3 className="text-2xl font-bold group-hover:text-cobalt">{job.title}</h3>
                    <p className="mt-1.5 text-slate">{jobFacts(job).join(", ")}</p>
                  </div>
                  <ChevronRight aria-hidden className="shrink-0 text-cobalt transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Why join us" tone="mist">
        <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {reasons.map((r) => (
            <div key={r.title} className="border-t-2 border-ink pt-4">
              <dt className="font-display text-xl font-bold">{r.title}</dt>
              <dd className="mt-1.5 text-slate">{r.desc}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
