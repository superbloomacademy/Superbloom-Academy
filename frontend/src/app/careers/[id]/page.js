import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { JobApplyForm } from "@/components/forms";
import { CheckList, PageHero, Section } from "@/components/sections";
import { getJob, jobFacts } from "@/lib/api";
import { jobLd } from "@/lib/jsonld";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return { title: "Role not found", robots: { index: false } };
  const description = `${job.title} at Superbloom Academy${job.location ? `, ${job.location}` : ""}. ${(job.description || "").slice(0, 120)}`.trim();
  return {
    title: `${job.title} job${job.location ? ` in ${job.location}` : ""}`,
    description,
    alternates: { canonical: `/careers/${id}` },
    robots: { index: job.status === "open" },
  };
}

export default async function JobPage({ params }) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();
  const open = job.status === "open";

  return (
    <>
      <PageHero
        title={job.title}
        lead={jobFacts(job).join(", ")}
        crumbs={[
          { name: "Careers", href: "/careers" },
          { name: job.title, href: `/careers/${id}` },
        ]}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <h2 className="text-3xl font-bold">About the role</h2>
            <p className="mt-4 max-w-[65ch] whitespace-pre-line text-lg text-slate">
              {job.description || "Contact us for the full role description."}
            </p>
            {job.benefits?.length > 0 && (
              <>
                <h2 className="mt-10 text-2xl font-bold">Benefits</h2>
                <div className="mt-4">
                  <CheckList items={job.benefits} columns={1} />
                </div>
              </>
            )}
          </div>

          <div className="self-start rounded-2xl border border-line bg-mist p-6 sm:p-9">
            {open ? (
              <>
                <h2 className="text-3xl font-bold">Apply for this role</h2>
                <div className="mt-6">
                  <JobApplyForm jobId={job._id} />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold">This role is no longer open</h2>
                <p className="mt-2 text-slate">Applications have closed. See our careers page for current openings.</p>
              </>
            )}
          </div>
        </div>
      </Section>

      {open && <JsonLd data={jobLd(job)} />}
    </>
  );
}
