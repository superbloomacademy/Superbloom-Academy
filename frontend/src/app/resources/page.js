import { ArticleGrid } from "@/components/cards";
import { CtaBand, PageHero, Section } from "@/components/sections";
import { getAllArticles } from "@/lib/content";
import { og } from "@/lib/seo";

const description =
  "Career guides for engineering and pharmacy students: career options after B.Pharmacy, medical coding vs pharmacovigilance, and the skills CSE students need before placements.";

export const metadata = {
  title: "Career Guides and Resources for Engineering and Pharmacy Students",
  description,
  alternates: { canonical: "/resources" },
  openGraph: og({ description, url: "/resources" }),
};

export const revalidate = 60;

export default async function Resources() {
  const articles = await getAllArticles();

  return (
    <>
      <PageHero
        title="Career guides for students"
        lead="Straight answers to the questions students ask us most about careers, skills and choosing a programme."
        crumbs={[{ name: "Resources", href: "/resources" }]}
      />

      <Section tone="paper">
        <ArticleGrid articles={articles} />
      </Section>

      <CtaBand />
    </>
  );
}
