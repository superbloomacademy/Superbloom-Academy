import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import WorkshopRegister from "@/components/WorkshopRegister";
import { CheckList, PageHero, Section } from "@/components/sections";
import { formatDate, getPayment, getWorkshop, modeLabel } from "@/lib/api";
import { eventLd } from "@/lib/jsonld";
import { og } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const w = await getWorkshop(slug);
  if (!w) return { title: "Workshop not found", robots: { index: false } };
  const summary = (w.summary || w.description || "").trim();
  // a one-line summary is too short for a search result, so add the date and place
  const description = (
    summary.length >= 70
      ? summary
      : `${summary ? `${summary.replace(/\.$/, "")}. ` : ""}${w.title} by Superbloom Academy on ${formatDate(w.date)}${w.venue ? ` at ${w.venue}` : ""}. Register online.`
  ).slice(0, 160);
  return {
    title: w.title,
    description,
    alternates: { canonical: `/workshops/${slug}` },
    openGraph: og({ title: w.title, description, url: `/workshops/${slug}` }),
  };
}

export default async function WorkshopPage({ params }) {
  const { slug } = await params;
  const [w, payment] = await Promise.all([getWorkshop(slug), getPayment()]);
  if (!w) notFound();

  const early = w.currentPrice < w.price;
  const facts = [
    { label: "Date", value: formatDate(w.date) },
    w.time && { label: "Time", value: w.time },
    { label: "Mode", value: modeLabel[w.mode] },
    w.venue && { label: "Venue", value: w.venue },
    w.trainer && { label: "Trainer", value: w.trainer },
    {
      label: "Fee",
      value:
        w.currentPrice > 0
          ? early
            ? `₹${w.currentPrice} early-bird until ${formatDate(w.earlyBirdUntil)}, then ₹${w.price}`
            : `₹${w.currentPrice}`
          : "Free",
    },
    w.seatsLeft != null && { label: "Seats left", value: String(w.seatsLeft) },
    w.registrationDeadline && { label: "Register by", value: formatDate(w.registrationDeadline) },
    w.certificate && { label: "Certificate", value: "Provided to attendees" },
  ].filter(Boolean);

  return (
    <>
      <PageHero
        title={w.title}
        lead={w.summary}
        crumbs={[
          { name: "Workshops", href: "/workshops" },
          { name: w.title, href: `/workshops/${slug}` },
        ]}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <dl className="border-t-2 border-ink">
              {facts.map((f) => (
                <div key={f.label} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line py-3">
                  <dt className="font-semibold text-slate">{f.label}</dt>
                  <dd className="font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>

            {w.description && (
              <>
                <h2 className="mt-10 text-2xl font-bold">About this workshop</h2>
                <p className="mt-3 max-w-[65ch] whitespace-pre-line text-lg text-slate">{w.description}</p>
              </>
            )}
            {w.audience && (
              <>
                <h2 className="mt-10 text-2xl font-bold">Who can attend</h2>
                <p className="mt-3 text-lg text-slate">{w.audience}</p>
              </>
            )}
            {w.learn?.length > 0 && (
              <>
                <h2 className="mt-10 text-2xl font-bold">What you will learn</h2>
                <div className="mt-4">
                  <CheckList items={w.learn} columns={1} />
                </div>
              </>
            )}
            {w.agenda?.length > 0 && (
              <>
                <h2 className="mt-10 text-2xl font-bold">Agenda</h2>
                <ol className="mt-4 space-y-2">
                  {w.agenda.map((a, i) => (
                    <li key={a} className="flex gap-3">
                      <span className="font-display font-bold text-cobalt">{i + 1}.</span>
                      {a}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>

          <div id="register" className="self-start rounded-2xl border border-line bg-mist p-6 sm:p-9">
            {w.registrationOpen ? (
              <>
                <h2 className="text-3xl font-bold">Register for this workshop</h2>
                <p className="mt-2 text-slate">
                  Already registered?{" "}
                  <a href="/workshops/status" className="link">
                    Check your status
                  </a>
                  .
                </p>
                <div className="mt-6">
                  <WorkshopRegister workshop={{ slug: w.slug, title: w.title, currentPrice: w.currentPrice }} payment={payment} />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold">Registration is closed</h2>
                <p className="mt-2 text-slate">
                  This workshop is full or the registration date has passed. See the workshops page for upcoming
                  sessions.
                </p>
              </>
            )}
          </div>
        </div>
      </Section>

      <JsonLd data={eventLd(w)} />
    </>
  );
}
