import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckList, CtaBand, DurationOptions, Faq, PageHero, ProgramIndex, Section } from "@/components/sections";
import { categories, programsIn } from "@/lib/programs";
import { faqs } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const cat = categories[category];
  if (!cat) return {};
  return {
    title: cat.title,
    description: cat.metaDescription,
    alternates: { canonical: `/programs/${category}` },
    openGraph: { title: cat.title, description: cat.metaDescription, url: `/programs/${category}` },
  };
}

const headings = {
  engineering: {
    index: "Courses for engineering students",
    indexLead: "Technical skills CSE, IT and other engineering students are asked for in placements. Each programme page lists what you will learn and build.",
  },
  pharmacy: {
    index: "Job-oriented courses after B.Pharm, M.Pharm and Pharm.D",
    indexLead: "Choose the part of the pharma and healthcare industry you want to work in. Each programme page lists what you will practise.",
  },
};

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const cat = categories[category];
  if (!cat) notFound();
  const other = category === "engineering" ? categories.pharmacy : categories.engineering;

  return (
    <>
      <PageHero
        title={cat.title}
        lead={cat.lead}
        crumbs={[
          { name: "Programs", href: "/programs" },
          { name: cat.name, href: `/programs/${category}` },
        ]}
      >
        <Link href={`/admission?stream=${category}`} className="btn btn-bloom">
          Apply for a {cat.name.toLowerCase()} program
        </Link>
        <Link href="/for-colleges" className="btn btn-line">
          Training for your college
        </Link>
      </PageHero>

      <Section title={headings[category].index} lead={headings[category].indexLead} tone="white">
        <ProgramIndex category={category} />
      </Section>

      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Who can join</h2>
            <p className="mt-4 text-lg text-slate">
              You can join on your own as a student or graduate. Colleges can also bring these programmes to campus
              for a whole batch.
            </p>
            <p className="mt-4 text-slate">You receive a {cat.certificate}.</p>
          </div>
          <div className="rounded-xl border border-line bg-white p-7">
            <CheckList items={cat.eligibility} columns={1} />
          </div>
        </div>
      </Section>

      {category === "pharmacy" && (
        <Section title="Training duration" lead="Three formats, so you can fit training around your college timetable.">
          <DurationOptions />
        </Section>
      )}

      <Faq
        items={faqs.filter((f) => category === "pharmacy" || !f.q.includes("pharmacy programmes"))}
        title={`${cat.name} training questions`}
      />

      <Section tone="mist">
        <p className="text-lg">
          Looking for {other.name.toLowerCase()} instead?{" "}
          <Link href={`/programs/${other.slug}`} className="link">
            See {programsIn(other.slug).length} {other.name.toLowerCase()} programs
          </Link>
          .
        </p>
      </Section>

      <CtaBand title={`Apply for a ${cat.name.toLowerCase()} program`} primary={{ label: "Apply for admission", href: `/admission?stream=${category}` }} />
    </>
  );
}
