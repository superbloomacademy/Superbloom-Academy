import Link from "next/link";
import { ArrowUpRight, Briefcase, Lightbulb, MapPin, Target, TrendingUp, UsersRound } from "lucide-react";
import { FeatureGrid, PageHero, Section } from "@/components/sections";
import { getOpenJobs, jobFacts } from "@/lib/api";
import { og } from "@/lib/seo";

const description =
  "Work at Superbloom Academy in Hyderabad. See open roles for trainers and staff and apply online with your resume.";

export const metadata = {
  title: "Careers at Superbloom Academy: Trainer and Staff Jobs in Hyderabad",
  description,
  alternates: { canonical: "/careers" },
  openGraph: og({ description, url: "/careers" }),
};

const reasons = [
  { icon: TrendingUp, title: "Career growth", desc: "Progression is based on what you deliver." },
  { icon: Target, title: "Real ownership", desc: "You work on real programmes with results you can measure." },
  { icon: Lightbulb, title: "Room to try things", desc: "Curiosity and experiment are rewarded." },
  { icon: UsersRound, title: "Learning and leadership", desc: "Mentorship, workshops and exposure to leadership." },
];

export default async function Careers() {
  const jobs = await getOpenJobs();

  return (
    <>
      <PageHero
        dark
        title="Work at Superbloom Academy"
        lead="Help us turn students into professionals who are ready for their first job. We hire trainers with industry experience and people who keep the academy running."
        crumbs={[{ name: "Careers", href: "/careers" }]}
      >
        <a href="#open-roles" className="btn btn-bloom">
          See open roles
        </a>
      </PageHero>

      <Section title="Open roles" tone="paper" id="open-roles">
        {jobs.length === 0 ? (
          <div className="grid gap-6 rounded-3xl bg-white p-7 ring-1 ring-line sm:p-10 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-cobalt">
              <Briefcase size={28} aria-hidden />
            </span>
            <div>
              <h3 className="text-2xl font-bold">There are no open roles right now</h3>
              <p className="mt-2 max-w-xl text-slate">
                New roles are posted here first. If you train in one of our domains and would like us to keep your
                profile in mind, send us a message.
              </p>
            </div>
            <Link href="/contact" className="btn btn-ink">
              Send us your profile
            </Link>
          </div>
        ) : (
          <ul className="grid gap-5 lg:grid-cols-2">
            {jobs.map((job) => {
              const facts = jobFacts(job).filter((f) => f !== job.department);
              return (
                <li key={job._id} className="flex">
                  <Link href={`/careers/${job._id}`} className="group lift flex w-full flex-col rounded-3xl bg-white p-6 ring-1 ring-line sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-cobalt">
                        <Briefcase size={24} aria-hidden />
                      </span>
                      {job.department && (
                        <span className="rounded-lg bg-bloom-soft px-3 py-1 text-sm font-semibold text-bloom-deep">{job.department}</span>
                      )}
                    </div>
                    <h3 className="mt-5 text-2xl font-bold group-hover:text-cobalt">{job.title}</h3>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {facts.map((f, i) => (
                        <li key={f} className="flex items-center gap-1.5 rounded-lg bg-paper px-2.5 py-1 text-[0.9rem] font-semibold ring-1 ring-line">
                          {i === 0 && job.location && <MapPin size={14} aria-hidden className="text-cobalt" />}
                          {f}
                        </li>
                      ))}
                    </ul>
                    {job.description && <p className="mt-4 line-clamp-3 text-slate">{job.description}</p>}
                    <span className="mt-auto flex items-center justify-between pt-6 font-semibold">
                      View role and apply
                      <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-mist transition-[background-color,transform] duration-200 ease-out-strong group-hover:rotate-45 group-hover:bg-bloom">
                        <ArrowUpRight size={18} />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section title="Why join us" tone="mist">
        <FeatureGrid items={reasons} cols={4} />
      </Section>
    </>
  );
}
