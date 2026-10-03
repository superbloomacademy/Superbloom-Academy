import Link from "next/link";
import { CtaBand, PageHero, Section } from "@/components/sections";
import { articles } from "@/lib/articles";

const description =
  "Career guides for engineering and pharmacy students: career options after B.Pharmacy, medical coding vs pharmacovigilance, and the skills CSE students need before placements.";

export const metadata = {
  title: "Career Guides and Resources for Engineering and Pharmacy Students",
  description,
  alternates: { canonical: "/resources" },
  openGraph: { description, url: "/resources" },
};

export default function Resources() {
  return (
    <>
      <PageHero
        title="Career guides for students"
        lead="Straight answers to the questions students ask us most about careers, skills and choosing a programme."
        crumbs={[{ name: "Resources", href: "/resources" }]}
      />

      <Section tone="white">
        <ul className="border-t-2 border-ink">
          {articles.map((a) => (
            <li key={a.slug} className="border-b border-line">
              <Link href={`/resources/${a.slug}`} className="group block py-7 hover:bg-mist sm:px-3">
                <p className="text-sm font-semibold text-cobalt">{a.category}</p>
                <h2 className="mt-1 max-w-3xl text-2xl font-bold group-hover:text-cobalt sm:text-3xl">{a.title}</h2>
                <p className="mt-2 max-w-3xl text-slate">{a.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand />
    </>
  );
}
