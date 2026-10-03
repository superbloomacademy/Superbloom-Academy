import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import RoleFinder from "@/components/RoleFinder";
import { CheckList, CtaBand, Faq, ProgramIndex, Section } from "@/components/sections";
import { formatDate, getWorkshops, modeLabel } from "@/lib/api";
import { articles } from "@/lib/articles";
import { categories, programsIn } from "@/lib/programs";
import { assessment, faqs, fullAddress, methodology, site, telHref, formatPhone } from "@/lib/site";

export const metadata = {
  title: { absolute: "Superbloom Academy | Industry-Oriented Training for Students and Colleges in Hyderabad" },
  description: site.description,
  alternates: { canonical: "/" },
};

export const revalidate = 60;

const offers = [
  {
    title: "Student programs",
    desc: "Job-oriented programmes you join on your own, each with a published curriculum, projects and assessment.",
    href: "/programs",
    cta: "Explore programs",
  },
  {
    title: "Campus training for colleges",
    desc: "The same programmes delivered on your campus to a whole batch, planned around the academic calendar.",
    href: "/for-colleges",
    cta: "See how it works",
  },
  {
    title: "Workshops",
    desc: "Short, hands-on sessions on one skill or tool, for students who want to try a subject first.",
    href: "/workshops",
    cta: "See workshops",
  },
];

export default async function Home() {
  const today = new Date(new Date().toDateString());
  const upcoming = (await getWorkshops()).filter((w) => w.registrationOpen && new Date(w.date) >= today).slice(0, 3);

  return (
    <>
      <section className="border-b border-line bg-mist">
        <div className="wrap grid grid-cols-1 gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14 lg:py-20">
          <div>
            <h1 className="text-[2.5rem] font-bold sm:text-[3.4rem]">
              Industry-oriented training for engineering and pharmacy students
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate sm:text-xl">
              From classroom learning to industry-ready skills. Practical training, projects and workshops in
              Hyderabad, for students who join on their own and for colleges that want training on campus.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/programs" className="btn btn-bloom">
                Explore programs
              </Link>
              <Link href="/for-colleges" className="btn btn-line">
                Training for your college
              </Link>
            </div>
          </div>
          <RoleFinder />
        </div>
      </section>

      <Section tone="white" title="What Superbloom Academy does">
        <div className="grid gap-6 md:grid-cols-3">
          {offers.map((o) => (
            <div key={o.href} className="flex flex-col border-t-2 border-ink pt-5">
              <h3 className="text-2xl font-bold">{o.title}</h3>
              <p className="mt-2 flex-1 text-slate">{o.desc}</p>
              <Link href={o.href} className="link mt-4 self-start">
                {o.cta}
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {["engineering", "pharmacy"].map((key, i) => {
        const cat = categories[key];
        const total = programsIn(key).length;
        return (
          <Section
            key={key}
            tone={i ? "white" : "mist"}
            title={key === "engineering" ? "Courses for engineering students" : "Job-oriented courses for pharmacy students"}
            lead={cat.lead}
          >
            <ProgramIndex category={key} limit={4} />
            <Link href={`/programs/${key}`} className="btn btn-ink mt-8">
              See all {total} {cat.name.toLowerCase()} programs
            </Link>
          </Section>
        );
      })}

      <Section title="How the training runs" tone="mist">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {methodology.map((m) => (
              <div key={m.title} className="border-t-2 border-ink pt-4">
                <dt className="font-display text-xl font-bold">{m.title}</dt>
                <dd className="mt-1.5 text-slate">{m.desc}</dd>
              </div>
            ))}
          </dl>
          <div className="self-start rounded-xl bg-white p-7">
            <h3 className="text-2xl font-bold">How you are assessed</h3>
            <p className="mt-2 text-slate">
              You earn the Certificate of Completion by passing these, so it means something to an interviewer.
            </p>
            <div className="mt-5">
              <CheckList items={assessment} columns={1} />
            </div>
          </div>
        </div>
      </Section>

      <section className="bg-ink text-white">
        <div className="wrap grid gap-8 py-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Campus training programs for colleges</h2>
            <p className="mt-4 max-w-xl text-lg text-white/85">
              Principals, TPOs and HODs: bring skill development programmes for engineering and pharmacy students to
              your campus. We plan the cohorts, deploy trainers, assess students and review the outcomes with you.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/for-colleges#proposal" className="btn btn-bloom">
              Request a college proposal
            </Link>
            <Link href="/for-colleges" className="btn btn-line-light">
              How campus training works
            </Link>
          </div>
        </div>
      </section>

      {upcoming.length > 0 && (
        <Section title="Upcoming workshops" tone="white">
          <ul className="grid gap-5 md:grid-cols-3">
            {upcoming.map((w) => (
              <li key={w._id}>
                <Link href={`/workshops/${w.slug}`} className="block h-full rounded-xl border border-line bg-paper p-6 hover:border-cobalt">
                  <p className="font-semibold text-cobalt">{formatDate(w.date)}</p>
                  <h3 className="mt-2 text-xl font-bold">{w.title}</h3>
                  <p className="mt-2 text-[0.95rem] font-semibold">
                    {modeLabel[w.mode]}, {w.currentPrice > 0 ? `₹${w.currentPrice}` : "Free"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/workshops" className="link mt-6 inline-block">
            See all workshops
          </Link>
        </Section>
      )}

      <Section title="Career guides" lead="Answers to the questions students ask us most." tone={upcoming.length ? "mist" : "white"}>
        <ul className="grid gap-5 md:grid-cols-3">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link href={`/resources/${a.slug}`} className="block h-full rounded-xl border border-line bg-white p-6 hover:border-cobalt">
                <p className="text-sm font-semibold text-cobalt">{a.category}</p>
                <h3 className="mt-2 text-xl font-bold">{a.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        tone={upcoming.length ? "white" : "mist"}
        title="Visit the academy in Suraram, Hyderabad"
        lead="Come in during office hours to see the classroom and talk to us about which programme fits you."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-line bg-white p-6">
            <MapPin className="text-cobalt" aria-hidden />
            <h3 className="mt-3 text-xl font-bold">Address</h3>
            <p className="mt-2 text-slate">{fullAddress}</p>
            <a
              className="link mt-3 inline-block"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Superbloom Academy, ${fullAddress}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <Clock className="text-cobalt" aria-hidden />
            <h3 className="mt-3 text-xl font-bold">Office hours</h3>
            <dl className="mt-2 space-y-1 text-slate">
              {site.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4">
                  <dt>{h.days}</dt>
                  <dd className="text-right font-semibold text-ink">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <Phone className="text-cobalt" aria-hidden />
            <h3 className="mt-3 text-xl font-bold">Call or email</h3>
            <p className="mt-2 space-y-1">
              {site.phones.map((p) => (
                <a key={p} href={telHref(p)} className="link block">
                  {formatPhone(p)}
                </a>
              ))}
              <a href={`mailto:${site.email}`} className="link block break-all">
                {site.email}
              </a>
            </p>
          </div>
        </div>
      </Section>

      <Faq items={faqs} />
      <CtaBand />
    </>
  );
}
