import Link from "next/link";
import { ArticleGrid } from "@/components/cards";
import { CtaBand, PageHero, Section } from "@/components/sections";
import { getAllArticles, guideStream } from "@/lib/content";
import { og } from "@/lib/seo";

const description =
  "Free career guides for BTech and pharmacy students: placement preparation, AI and data analytics roadmaps, full stack, resumes and careers after B.Pharm.";

export const metadata = {
  title: "Career Guides for Engineering and Pharmacy Students",
  description,
  alternates: { canonical: "/resources" },
  openGraph: og({ description, url: "/resources" }),
};

export const revalidate = 60;

const streams = [
  { key: "engineering", title: "For engineering students", program: "/programs/engineering", label: "engineering programs" },
  { key: "pharmacy", title: "For pharmacy students", program: "/programs/pharmacy", label: "pharmacy programs" },
];

export default async function Resources() {
  const articles = await getAllArticles();

  return (
    <>
      <PageHero
        title="Career guides for students"
        lead="Straight answers to the questions students ask us most about careers, skills and choosing a programme."
        crumbs={[{ name: "Resources", href: "/resources" }]}
      />

      {streams.map((s, i) => {
        const list = articles.filter((a) => guideStream(a) === s.key);
        if (!list.length) return null;
        return (
          <Section key={s.key} id={s.key} title={s.title} tone={i % 2 ? "mist" : "paper"}>
            <ArticleGrid articles={list} />
            <p className="mt-8 text-lg">
              <Link href={s.program} className="link">
                See our {s.label}
              </Link>
            </p>
          </Section>
        );
      })}

      <CtaBand />
    </>
  );
}
