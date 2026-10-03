import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight, Award, BookOpen, Briefcase, FolderKanban, GraduationCap, Hospital, MapPin, MessagesSquare,
  MonitorPlay, PencilLine, Presentation,
} from "lucide-react";
import { programIcons } from "@/components/cards";
import JsonLd from "@/components/JsonLd";
import { CheckList, CtaBand, DurationOptions, Faq, FeatureGrid, PageHero, Section } from "@/components/sections";
import { categories, getProgram, programHref, programs, programsIn } from "@/lib/programs";
import { courseLd } from "@/lib/jsonld";
import { assessment, methodology } from "@/lib/site";
import { og } from "@/lib/seo";

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
    openGraph: og({ title: program.title, description: program.metaDescription, url: programHref(program) }),
  };
}

const methodIcons = [Presentation, MessagesSquare, MonitorPlay, PencilLine, FolderKanban, Hospital];

export default async function ProgramPage({ params }) {
  const { category, slug } = await params;
  const program = getProgram(category, slug);
  if (!program) notFound();
  const cat = categories[category];
  const others = programsIn(category).filter((p) => p.slug !== program.slug);
  const name = program.name;
  const Icon = programIcons[program.slug] || GraduationCap;
  const applyHref = `/admission?course=${program.slug}`;

  const facts = [
    { icon: BookOpen, label: `${program.learn.length} topics in the curriculum` },
    program.projects && { icon: FolderKanban, label: `${program.projects.length} projects you build` },
    { icon: Briefcase, label: `Prepares you for ${program.roles.length} ${program.roles.length === 1 ? "role" : "roles"}` },
    { icon: Award, label: "Certificate of Completion" },
    { icon: MapPin, label: category === "pharmacy" ? "Classroom batches in Suraram, Hyderabad" : "At our centre or on your college campus" },
  ].filter(Boolean);

  const methods = methodology
    .map((m, i) => ({ ...m, icon: methodIcons[i] }))
    .filter((m) => category === "pharmacy" || !m.title.startsWith("Hospital"));

  return (
    <>
      <PageHero
        dark
        title={program.title}
        lead={program.short}
        crumbs={[
          { name: "Programs", href: "/programs" },
          { name: cat.name, href: `/programs/${category}` },
          { name, href: programHref(program) },
        ]}
        aside={
          <div className="relative overflow-hidden rounded-3xl bg-white/[0.07] p-6 ring-1 ring-white/15 backdrop-blur-sm sm:p-8">
            <Icon aria-hidden size={200} strokeWidth={1} className="absolute -bottom-10 -right-8 text-white/[0.07]" />
            <div className="relative">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bloom text-ink">
                <Icon size={28} aria-hidden />
              </span>
              <h2 className="mt-5 text-xl font-bold">Programme at a glance</h2>
              <ul className="mt-4 space-y-3">
                {facts.map((f) => (
                  <li key={f.label} className="flex items-center gap-3 text-white/90">
                    <f.icon size={19} aria-hidden className="shrink-0 text-bloom" />
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
      >
        <Link href={applyHref} className="btn btn-bloom">
          Apply for this program
        </Link>
        <Link href="/contact" className="btn btn-line-light">
          Ask about fees and batches
        </Link>
      </PageHero>

      <Section tone="paper">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">About the {name} programme</h2>
            <div className="prose-sba mt-5 max-w-[65ch] text-lg text-slate">
              {program.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>

          <aside className="relative self-start overflow-hidden rounded-3xl bg-cobalt-deep p-7 text-white">
            <div aria-hidden className="dots absolute inset-0 opacity-50" />
            <div className="relative">
              <h2 className="text-2xl font-bold">Roles this programme prepares you for</h2>
              <ul className="mt-5 space-y-2">
                {program.roles.map((r) => (
                  <li key={r} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 font-display text-lg font-semibold leading-snug">
                    <Briefcase size={18} aria-hidden className="shrink-0 text-bloom" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <Section
        tone="white"
        title="What you will learn"
        lead={`The topics the ${name} curriculum covers.`}
      >
        <ol className="grid gap-3 md:grid-cols-2">
          {program.learn.map((item, i) => (
            <li key={item} className="flex items-center gap-4 rounded-2xl bg-paper p-4 ring-1 ring-line sm:p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink font-display text-lg font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-lg font-semibold leading-snug">{item}</span>
            </li>
          ))}
        </ol>

        {program.projects && (
          <div className="relative mt-12 overflow-hidden rounded-3xl bg-ink p-7 text-white sm:p-10">
            <div aria-hidden className="dots absolute inset-0 opacity-50" />
            <div className="relative">
              <h2 className="text-3xl font-bold sm:text-4xl">Projects you will build</h2>
              <p className="mt-3 max-w-2xl text-lg text-white/80">
                You finish with working applications you can show in an interview.
              </p>
              <ol className="mt-7 grid gap-4 sm:grid-cols-2">
                {program.projects.map((p, i) => (
                  <li key={p} className="flex gap-4 rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/10">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bloom font-display font-bold text-ink">
                      {i + 1}
                    </span>
                    <span className="self-center text-lg font-semibold leading-snug">{p}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
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
        <Section tone="mist">
          <div className="grid gap-8 rounded-3xl bg-white p-7 ring-1 ring-line sm:p-10 lg:grid-cols-[minmax(0,1.4fr)_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold">Batches, duration and fees</h2>
              <p className="mt-3 max-w-2xl text-lg text-slate">
                These are confirmed when you apply, because they depend on the batch you join and whether the programme
                runs at our centre or on your college campus. Send an application and we will call you with the details.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href={applyHref} className="btn btn-bloom">
                Send an application
              </Link>
              <Link href="/for-colleges" className="btn btn-line">
                Request it for a college batch
              </Link>
            </div>
          </div>
        </Section>
      )}

      <Section title="How you are taught" tone="paper">
        <FeatureGrid items={methods} />
      </Section>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bloom-soft text-bloom-deep">
              <Award size={28} aria-hidden />
            </span>
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">How you earn the certificate</h2>
            <p className="mt-4 max-w-xl text-lg text-slate">
              You receive a {cat.certificate} once you complete the programme and pass each assessment.
            </p>
            <h3 className="mt-8 text-xl font-bold">Who can join</h3>
            <div className="mt-3">
              <CheckList items={cat.eligibility} />
            </div>
          </div>
          <ol className="space-y-3">
            {assessment.map((a, i) => (
              <li key={a} className="flex items-center gap-4 rounded-2xl bg-paper p-4 ring-1 ring-line">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cobalt font-display font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-lg font-semibold">{a}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Faq items={program.faqs} title={`${name} questions`} />

      <Section title={`Other ${cat.name.toLowerCase()} programs`} tone="mist">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => {
            const OtherIcon = programIcons[p.slug] || GraduationCap;
            return (
              <li key={p.slug} className="flex">
                <Link href={programHref(p)} className="group lift flex w-full items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-line">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mist text-cobalt">
                    <OtherIcon size={22} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl font-bold group-hover:text-cobalt">{p.name}</span>
                    <span className="mt-1 block text-[0.95rem] text-slate">{p.short}</span>
                  </span>
                  <ArrowUpRight size={18} aria-hidden className="mt-1 shrink-0 text-slate transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-cobalt" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <CtaBand title={`Start the ${name} programme`} course={program.slug} />
      <JsonLd data={courseLd(program)} />
    </>
  );
}
