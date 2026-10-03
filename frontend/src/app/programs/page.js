import Link from "next/link";
import { ProgramGrid } from "@/components/cards";
import { CtaBand, PageHero, Section } from "@/components/sections";
import { categories } from "@/lib/programs";
import { og } from "@/lib/seo";

const description =
  "All Superbloom Academy training programs in Hyderabad: job-oriented courses for engineering students and for pharmacy students, each with its own curriculum and career roles.";

export const metadata = {
  title: "Training Programs for Engineering and Pharmacy Students in Hyderabad",
  description,
  alternates: { canonical: "/programs" },
  openGraph: og({ description, url: "/programs" }),
};

export default function Programs() {
  return (
    <>
      <PageHero
        title="Skill development programs for college students"
        lead="Job-oriented training in two streams. Start with the one that matches your degree, then pick the programme that matches the job you want."
        crumbs={[{ name: "Programs", href: "/programs" }]}
      />

      {Object.values(categories).map((cat, i) => (
        <Section key={cat.slug} tone={i % 2 ? "mist" : "paper"} title={`${cat.name} programs`} lead={cat.lead} id={cat.slug}>
          <ProgramGrid category={cat.slug} />
          <Link href={`/programs/${cat.slug}`} className="btn btn-ink mt-8">
            About {cat.name.toLowerCase()} training
          </Link>
        </Section>
      ))}

      <CtaBand />
    </>
  );
}
