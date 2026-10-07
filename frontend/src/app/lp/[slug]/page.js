import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, BookOpen, Briefcase, CheckCircle2, GraduationCap, MapPin } from "lucide-react";
import { programIcons } from "@/components/cards";
import { CallWhatsApp, MobileActionBar } from "@/components/ContactButtons";
import LeadForm from "@/components/LeadForm";
import { CheckList, DurationOptions, Faq, Section } from "@/components/sections";
import { categories, programs, programsIn } from "@/lib/programs";
import { faqs, fullAddress, site, trainingSteps } from "@/lib/site";
import { og } from "@/lib/seo";

// Landing pages for paid ads: /lp/<programme-slug>, /lp/pharmacy and /lp/engineering.
// One goal (an enquiry), no site navigation, and kept out of search results so
// they never compete with the programme pages.

const streams = ["pharmacy", "engineering"];
const audience = { pharmacy: "pharmacy students", engineering: "engineering students" };

export const dynamicParams = false;

export function generateStaticParams() {
  return [...streams, ...programs.map((p) => p.slug)].map((slug) => ({ slug }));
}

function resolve(slug) {
  if (streams.includes(slug)) return { stream: slug, program: null };
  const program = programs.find((p) => p.slug === slug);
  return program ? { stream: program.category, program } : null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = resolve(slug);
  if (!page) return {};
  const title = page.program ? page.program.title : categories[page.stream].title;
  const description = page.program ? page.program.metaDescription : categories[page.stream].metaDescription;
  return {
    title: { absolute: `${title} | Superbloom Academy` },
    description,
    robots: { index: false, follow: true },
    openGraph: og({ title, description, url: `/lp/${slug}` }),
  };
}

export default async function LandingPage({ params }) {
  const { slug } = await params;
  const page = resolve(slug);
  if (!page) notFound();
  const { stream, program } = page;
  const cat = categories[stream];
  const Icon = (program && programIcons[program.slug]) || GraduationCap;
  const topic = program ? `the ${program.name} course` : `${cat.name.toLowerCase()} programmes`;

  const heading = program ? (
    <>
      {program.name} course for <span className="text-bloom">{audience[stream]}</span>
    </>
  ) : (
    <>
      Job-oriented courses for <span className="text-bloom">{audience[stream]}</span>
    </>
  );

  const facts = program
    ? [
        { icon: BookOpen, text: `${program.learn.length} topics, taught hands-on` },
        { icon: Briefcase, text: `Prepares you for ${program.roles.slice(0, 2).join(" and ")}${program.roles.length > 2 ? " roles and more" : " roles"}` },
        { icon: Award, text: "Certificate of Completion after assessment" },
        { icon: MapPin, text: "At our Hyderabad centre or on your college campus" },
      ]
    : [
        { icon: BookOpen, text: `${programsIn(stream).length} programmes to choose from` },
        { icon: Briefcase, text: "Each one mapped to entry-level job roles" },
        { icon: Award, text: "Certificate of Completion after assessment" },
        { icon: MapPin, text: "Across Telangana and Andhra Pradesh" },
      ];

  return (
    <div className="pb-20 lg:pb-0">
      {/* Slim header: brand and a phone number, nothing to wander off to */}
      <header className="border-b border-line bg-white">
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/emblem.png" alt="" width={40} height={34} priority />
            <span className="font-display text-lg font-bold">Superbloom Academy</span>
          </Link>
          <div className="hidden lg:block">
            <CallWhatsApp topic={topic} />
          </div>
        </div>
      </header>

      {/* Hero with the form beside it, so it is visible without scrolling on desktop */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="dots absolute inset-0 opacity-60" />
        <div aria-hidden className="absolute -left-48 -top-56 h-[34rem] w-[34rem] rounded-full bg-cobalt/50 blur-3xl" />
        <div className="wrap relative grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-bloom px-3.5 py-1.5 text-sm font-bold text-ink">
              Admissions open for the next batch
            </p>
            <div className="mt-6 flex items-start gap-4">
              <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-bloom ring-1 ring-white/15 sm:flex">
                <Icon size={28} aria-hidden />
              </span>
              <h1 className="text-[2.2rem] font-bold sm:text-5xl">{heading}</h1>
            </div>
            <p className="mt-5 max-w-xl text-lg text-white/85">{program ? program.short : cat.lead}</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {facts.map((f) => (
                <li key={f.text} className="flex items-start gap-3 text-white/90">
                  <f.icon size={20} aria-hidden className="mt-0.5 shrink-0 text-bloom" />
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 hidden lg:block">
              <CallWhatsApp topic={topic} light />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 text-ink shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] sm:p-8">
            <h2 className="text-2xl font-bold">Get a call back about the next batch</h2>
            <p className="mt-2 text-slate">Fees, timings and which programme suits you. It takes 20 seconds.</p>
            <div className="mt-6">
              <LeadForm stream={stream} program={program} />
            </div>
          </div>
        </div>
      </section>

      {program ? (
        <Section tone="white" title={`What you will learn in ${program.name}`}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <CheckList items={program.learn} />
            <div className="rounded-3xl bg-mist p-6 sm:p-8">
              <h3 className="text-xl font-bold">Roles you can apply for</h3>
              <ul className="mt-4 space-y-3">
                {program.roles.map((r) => (
                  <li key={r} className="flex items-center gap-3 font-semibold">
                    <Briefcase size={18} aria-hidden className="text-cobalt" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      ) : (
        <Section tone="white" title={`Programmes for ${audience[stream]}`}>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {programsIn(stream).map((p) => {
              const PIcon = programIcons[p.slug] || GraduationCap;
              return (
                <li key={p.slug} className="flex flex-col rounded-2xl bg-paper p-5 ring-1 ring-line">
                  <PIcon size={24} aria-hidden className="text-cobalt" />
                  <h3 className="mt-3 text-lg font-bold">{p.name}</h3>
                  <p className="mt-1 text-[0.95rem] text-slate">{p.short}</p>
                  <p className="mt-3 text-sm font-semibold">Leads to: {p.roles[0]}</p>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <Section tone="mist" title="Who can join">
        <ul className="flex flex-wrap gap-3">
          {cat.eligibility.map((e) => (
            <li key={e} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold ring-1 ring-line">
              <CheckCircle2 size={18} aria-hidden className="text-leaf" /> {e}
            </li>
          ))}
        </ul>
      </Section>

      {stream === "pharmacy" && (
        <Section tone="white" title="Choose a batch length" lead="Classroom-taught, at our Hyderabad centre or on your college campus.">
          <DurationOptions />
        </Section>
      )}

      <Section tone="paper" title="How the training works">
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trainingSteps.map((s, i) => (
            <li key={s.title} className="rounded-2xl bg-white p-6 ring-1 ring-line">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bloom font-bold">{i + 1}</span>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-slate">{s.desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Faq items={program?.faqs?.length ? program.faqs : faqs.slice(1, 6)} title="Questions students ask" />

      <section className="relative overflow-hidden bg-cobalt-deep text-white">
        <div aria-hidden className="dots absolute inset-0 opacity-50" />
        <div className="wrap relative flex flex-col gap-6 py-14 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Seats fill batch by batch</h2>
            <p className="mt-3 max-w-xl text-lg text-white/85">Send your number and we will call you with the next start date and fees.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#enquire" className="btn btn-bloom">
              Get a call back
            </a>
            <CallWhatsApp topic={topic} light />
          </div>
        </div>
      </section>

      <footer className="bg-ink py-8 text-sm text-white/70">
        <div className="wrap flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold text-white">{site.name}</p>
            <p className="mt-1 max-w-md">{fullAddress}</p>
          </div>
          <nav aria-label="Policies" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-bloom">Privacy policy</Link>
            <Link href="/terms" className="hover:text-bloom">Terms</Link>
            <Link href="/refund-policy" className="hover:text-bloom">Refund policy</Link>
            <Link href="/" className="hover:text-bloom">Main website</Link>
          </nav>
        </div>
      </footer>

      <MobileActionBar topic={topic} />
    </div>
  );
}
