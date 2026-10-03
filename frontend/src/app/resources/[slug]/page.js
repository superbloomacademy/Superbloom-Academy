import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { CtaBand, PageHero } from "@/components/sections";
import { articles, getArticle } from "@/lib/articles";
import { articleLd } from "@/lib/jsonld";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: `/resources/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.description, url: `/resources/${a.slug}`, publishedTime: a.date },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  return (
    <>
      <PageHero
        title={a.title}
        lead={a.description}
        crumbs={[
          { name: "Resources", href: "/resources" },
          { name: a.category, href: `/resources/${a.slug}` },
        ]}
      />

      <article className="bg-white py-14 sm:py-16">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
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

          <aside className="self-start rounded-xl bg-mist p-6 lg:sticky lg:top-24">
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
        </div>
      </article>

      <CtaBand title="Talk to us about your next step" />
      <JsonLd data={articleLd(a)} />
    </>
  );
}
