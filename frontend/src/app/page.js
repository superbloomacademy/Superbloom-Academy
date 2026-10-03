import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import RoleFinder from "@/components/RoleFinder";
import { CheckList, CourseIndex, CtaBand, DurationOptions, Faq, Section } from "@/components/sections";
import { assessment, engineeringEligibility, faqs, fullAddress, methodology, site, telHref, formatPhone } from "@/lib/site";

export const metadata = {
  title: { absolute: "Pharma and Engineering Training Institute in Hyderabad | Superbloom Academy" },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <section className="border-b border-line bg-mist">
        <div className="wrap grid grid-cols-1 gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14 lg:py-20">
          <div>
            <h1 className="text-[2.6rem] font-bold sm:text-6xl">
              Job-oriented pharma and engineering training in Hyderabad
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate sm:text-xl">
              Your degree taught you the science. We train you on the work itself: processing a safety case, coding a
              medical record, reviewing a batch document. Classroom batches in Suraram, in 6-week, 3-month and 6-month
              formats.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/admission" className="btn btn-bloom">
                Apply for admission
              </Link>
              <Link href="/streams/pharmacy" className="btn btn-line">
                See pharmacy courses
              </Link>
            </div>
            <p className="mt-6 text-slate">
              For D.Pharm, B.Pharm, M.Pharm and Pharm.D students, and for{" "}
              <Link href="/streams/engineering" className="link">
                engineering students and freshers
              </Link>
              .
            </p>
          </div>
          <RoleFinder />
        </div>
      </section>

      <Section
        title="Seven pharmacy courses, each tied to a job"
        lead="Pick the domain you want to work in. Every course page lists what you will practise and the roles it prepares you for."
      >
        <CourseIndex />
      </Section>

      <Section
        tone="mist"
        title="Three durations to fit around college"
        lead="The same domains are offered in three formats. Longer formats add more practice, projects and assessment."
      >
        <DurationOptions />
      </Section>

      <Section title="How the training runs" tone="white">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {methodology.map((m) => (
              <div key={m.title} className="border-t-2 border-ink pt-4">
                <dt className="font-display text-xl font-bold">{m.title}</dt>
                <dd className="mt-1.5 text-slate">{m.desc}</dd>
              </div>
            ))}
          </dl>
          <div className="self-start rounded-xl bg-mist p-7">
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

      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Engineering and technology stream</h2>
            <p className="mt-4 text-lg text-slate">
              Skill development programmes that sit alongside your degree and close the gap between what college covers
              and what a first job asks for. We deliver them with colleges through an academic and industry
              collaboration model.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/streams/engineering" className="btn btn-ink">
                See the engineering stream
              </Link>
              <Link href="/contact" className="btn btn-line">
                Partner as a college
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-line bg-white p-7">
            <h3 className="text-xl font-bold">Who it is for</h3>
            <div className="mt-4">
              <CheckList items={engineeringEligibility} />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Visit the academy in Suraram" lead="Come in during office hours to see the classroom and talk to us about which course fits you.">
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
