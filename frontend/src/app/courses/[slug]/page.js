import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { CheckList, CtaBand, DurationOptions, Faq, PageHero, Section } from "@/components/sections";
import { courses, getCourse } from "@/lib/courses";
import { courseLd } from "@/lib/jsonld";
import { assessment, methodology, pharmacyEligibility } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return {
    title: course.title,
    description: course.metaDescription,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: { title: course.title, description: course.metaDescription, url: `/courses/${course.slug}` },
  };
}

export default async function CoursePage({ params }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  const others = courses.filter((c) => c.slug !== course.slug);

  return (
    <>
      <PageHero
        title={course.title}
        lead={course.short}
        crumbs={[
          { name: "Pharmacy courses", href: "/streams/pharmacy" },
          { name: course.name, href: `/courses/${course.slug}` },
        ]}
      >
        <Link href={`/admission?course=${course.slug}`} className="btn btn-bloom">
          Apply for this course
        </Link>
        <Link href="/contact" className="btn btn-line">
          Ask about fees and batches
        </Link>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">What {course.name.toLowerCase()} work involves</h2>
            <div className="prose-sba mt-5 max-w-[65ch] text-lg text-slate">
              {course.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <h2 className="mt-12 text-3xl font-bold sm:text-4xl">What you will learn</h2>
            <ul className="mt-6 border-t-2 border-ink">
              {course.learn.map((item) => (
                <li key={item} className="border-b border-line py-3.5 text-lg">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-6 self-start lg:sticky lg:top-24">
            <div className="rounded-xl bg-ink p-7 text-white">
              <h2 className="text-2xl font-bold">Roles this course prepares you for</h2>
              <ul className="mt-4 space-y-2.5">
                {course.roles.map((r) => (
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
                <CheckList items={pharmacyEligibility} columns={1} />
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section
        tone="mist"
        title={`Choose a ${course.name.toLowerCase()} batch length`}
        lead="All three formats are taught in the classroom at our Suraram centre in Hyderabad."
      >
        <DurationOptions />
      </Section>

      <Section title="How you are taught and assessed">
        <div className="grid gap-12 lg:grid-cols-2">
          <dl className="space-y-5">
            {methodology.map((m) => (
              <div key={m.title}>
                <dt className="font-display text-lg font-bold">{m.title}</dt>
                <dd className="text-slate">{m.desc}</dd>
              </div>
            ))}
          </dl>
          <div className="self-start rounded-xl border border-line bg-white p-7">
            <h3 className="text-2xl font-bold">Certificate of Completion</h3>
            <p className="mt-2 text-slate">
              Awarded in Clinical and Industry-Oriented Pharmacy Training once you complete the programme and pass:
            </p>
            <div className="mt-5">
              <CheckList items={assessment} columns={1} />
            </div>
          </div>
        </div>
      </Section>

      <Faq items={course.faqs} title={`${course.name} course questions`} />

      <Section title="Other pharmacy courses" tone="mist">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/courses/${c.slug}`}
                className="block h-full rounded-xl border border-line bg-white p-5 hover:border-cobalt"
              >
                <span className="font-display text-xl font-bold">{c.name}</span>
                <span className="mt-1 block text-[0.95rem] text-slate">{c.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title={`Start ${course.name.toLowerCase()} training`} course={course.slug} />
      <JsonLd data={courseLd(course)} />
    </>
  );
}
