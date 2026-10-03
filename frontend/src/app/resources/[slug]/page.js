import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";
import { ArticleGrid } from "@/components/cards";
import JsonLd from "@/components/JsonLd";
import { CtaBand, PageHero, Section } from "@/components/sections";
import { articles as builtIn } from "@/lib/articles";
import { getAllArticles, getArticle } from "@/lib/content";
import { articleLd } from "@/lib/jsonld";
import { og } from "@/lib/seo";

export const revalidate = 60;

// Starter guides are built ahead of time; articles published from the admin render on first visit.
export function generateStaticParams() {
  return builtIn.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return { title: "Guide not found", robots: { index: false } };
  return {
    title: { absolute: a.title },
    description: a.description,
    alternates: { canonical: `/resources/${a.slug}` },
    openGraph: og({ type: "article", title: a.title, description: a.description, url: `/resources/${a.slug}`, publishedTime: a.date }),
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();
  const more = (await getAllArticles()).filter((x) => x.slug !== a.slug).slice(0, 3);
  const date = new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

  return (
    <>
      <PageHero
        title={a.title}
        lead={a.description}
        crumbs={[
          { name: "Resources", href: "/resources" },
          { name: a.category, href: `/resources/${a.slug}` },
        ]}
      >
        <p className="flex flex-wrap items-center gap-x-5 gap-y-1 font-medium text-slate">
          <span className="flex items-center gap-2">
            <CalendarDays size={17} aria-hidden /> {date}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={17} aria-hidden /> {a.minutes} min read
          </span>
        </p>
      </PageHero>

      <article className="bg-white py-14 sm:py-16">
        <div className={`wrap grid gap-12 ${a.related.length ? "lg:grid-cols-[minmax(0,1fr)_18rem]" : ""}`}>
          <div className="max-w-[68ch] text-lg">
            {a.body.map((block, i) => (
              <section key={i} className={i ? "mt-10" : ""}>
                {block.h && <h2 className="text-2xl font-bold sm:text-3xl">{block.h}</h2>}
                {block.p?.map((p) => (
                  <p key={p} className="mt-4 text-slate">
                    {p}
                  </p>
                ))}
                {block.list && (
                  <ul className="mt-4 space-y-3">
                    {block.list.map((item) => (
                      <li key={item} className="flex gap-3 text-slate">
                        <span aria-hidden className="mt-[0.7rem] h-2 w-2 shrink-0 rounded-full bg-bloom" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {a.related.length > 0 && (
            <aside className="self-start rounded-2xl bg-mist p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold">Related programs and guides</h2>
              <ul className="mt-4 space-y-3">
                {a.related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="link">
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </article>

      {more.length > 0 && (
        <Section title="More guides" tone="mist">
          <ArticleGrid articles={more} feature={false} />
        </Section>
      )}

      <CtaBand title="Talk to us about your next step" />
      <JsonLd data={articleLd(a)} />
    </>
  );
}
