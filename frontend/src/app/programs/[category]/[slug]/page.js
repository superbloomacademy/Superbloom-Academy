import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { CheckList, CtaBand, DurationOptions, Faq, PageHero, Section } from "@/components/sections";
import { categories, getProgram, programHref, programs, programsIn } from "@/lib/programs";
import { courseLd } from "@/lib/jsonld";
import { assessment, methodology } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return programs.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const program = getProgram(category, slug);
  if (!program) return {};
  return {
    title: program.title,
    description: program.metaDescription,
    alternates: { canonical: programHref(program) },
    openGraph: { title: program.title, description: program.metaDescription, url: programHref(program) },
  };
}

export default async function ProgramPage({ params }) {
  const { category, slug } = await params;
  const program = getProgram(category, slug);
  if (!program) notFound();
  const cat = categories[category];
  const others = programsIn(category).filter((p) => p.slug !== program.slug);
  const name = program.name;

  return (
    <>
      <PageHero
        title={program.title}
        lead={program.short}
        crumbs={[
          { name: "Programs", href: "/programs" },
          { name: cat.name, href: `/programs/${category}` },
          { name, href: programHref(program) },
        ]}
      >
        <Link href={`/admission?course=${program.slug}`} className="btn btn-bloom">
          Apply for this program
        </Link>
        <Link href="/contact" className="btn btn-line">
          Ask about fees and batches
        </Link>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">About the {name} programme</h2>
            <div className="prose-sba mt-5 max-w-[65ch] text-lg text-slate">
              {program.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <h2 className="mt-12 text-3xl font-bold sm:text-4xl">What you will learn</h2>
            <ul className="mt-6 border-t-2 border-ink">
              {program.learn.map((item) => (
                <li key={item} className="border-b border-line py-3.5 text-lg">
                  {item}
                </li>
              ))}
            </ul>

            {program.projects && (
              <>
                <h2 className="mt-12 text-3xl font-bold sm:text-4xl">Projects you will build</h2>
                <ol className="mt-6 grid gap-3 sm:grid-cols-2">
                  {program.projects.map((p, i) => (
                    <li key={p} className="flex gap-4 rounded-xl border border-line bg-paper p-5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-display font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="self-center font-semibold">{p}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>

          <aside className="space-y-6 self-start lg:sticky lg:top-24">
            <div className="rounded-xl bg-ink p-7 text-white">
              <h2 className="text-2xl font-bold">Roles this programme prepares you for</h2>
              <ul className="mt-4 space-y-2.5">
                {program.roles.map((r) => (
                  <li key={r} className="flex gap-3 font-display text-lg font-semibold leading-snug">
                    <span aria-hidden className="mt-[0.55rem] h-2 w-2 shrink-0 rounded-full bg-bloom" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-line bg-paper p-7">
              <h2 className="text-2xl font-bold">Who can join</h2>
              <div className="mt-4">
                <CheckList items={cat.eligibility} columns={1} />
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {category === "pharmacy" ? (
        <Section
          tone="mist"
          title={`Choose a ${name} batch length`}
          lead="All three formats are taught in the classroom at our Suraram centre in Hyderabad."
        >
          <DurationOptions />
        </Section>
      ) : (
        <Section tone="mist" title="Batches, duration and fees">
          <p className="max-w-2xl text-lg text-slate">
            Batch dates, duration and fees are confirmed when you apply, because they depend on the batch you join and
            whether the programme runs at our centre or on your college campus.{" "}
            <Link href={`/admission?course=${program.slug}`} className="link">
              Send an application
            </Link>{" "}
            and we will call you with the details. Colleges can{" "}
            <Link href="/for-colleges" className="link">
              request this programme for a whole batch
            </Link>
            .
          </p>
        </Section>
      )}

      <Section title="How you are taught and assessed">
        <div className="grid gap-12 lg:grid-cols-2">
          <dl className="space-y-5">
            {methodology
              .filter((m) => category === "pharmacy" || !m.title.startsWith("Hospital"))
              .map((m) => (
                <div key={m.title}>
                  <dt className="font-display text-lg font-bold">{m.title}</dt>
                  <dd className="text-slate">{m.desc}</dd>
                </div>
              ))}
          </dl>
          <div className="self-start rounded-xl border border-line bg-white p-7">
            <h3 className="text-2xl font-bold">Certificate of Completion</h3>
            <p className="mt-2 text-slate">
              You receive a {cat.certificate} once you complete the programme and pass:
            </p>
            <div className="mt-5">
              <CheckList items={assessment} columns={1} />
            </div>
          </div>
        </div>
      </Section>

      <Faq items={program.faqs} title={`${name} questions`} />

      <Section title={`Other ${cat.name.toLowerCase()} programs`} tone="mist">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => (
            <li key={p.slug}>
              <Link href={programHref(p)} className="block h-full rounded-xl border border-line bg-white p-5 hover:border-cobalt">
                <span className="font-display text-xl font-bold">{p.name}</span>
                <span className="mt-1 block text-[0.95rem] text-slate">{p.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title={`Start the ${name} programme`} course={program.slug} />
      <JsonLd data={courseLd(program)} />
    </>
  );
}
