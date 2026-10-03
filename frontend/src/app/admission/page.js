import { AdmissionForm } from "@/components/forms";
import { PageHero, Section } from "@/components/sections";
import { site, telHref, formatPhone } from "@/lib/site";

const description =
  "Apply for admission to Superbloom Academy, Hyderabad. Choose the pharmacy or engineering stream, send your details and we will call you about batches and fees.";

export const metadata = {
  title: "Apply for Admission to Pharmacy and Engineering Training",
  description,
  alternates: { canonical: "/admission" },
  openGraph: { description, url: "/admission" },
};

// A real sequence, so it is numbered.
const steps = [
  { title: "Send this form", desc: "It takes about two minutes. Only your name, phone, email and qualification are required." },
  { title: "We call you", desc: "We talk through the course, the batch timings and the fees, and answer your questions." },
  { title: "Join a batch", desc: "Confirm your seat and start with the next batch for your course." },
];

export default function Admission() {
  return (
    <>
      <PageHero
        title="Apply for admission"
        lead="Tell us who you are and what you want to learn. We will call you to take it from there."
        crumbs={[{ name: "Admission", href: "/admission" }]}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <AdmissionForm />

          <aside className="self-start rounded-2xl bg-mist p-7 lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold">What happens next</h2>
            <ol className="mt-5 space-y-5">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-display font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold">{s.title}</p>
                    <p className="text-slate">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-7 border-t border-line pt-5">
              Prefer to talk first? Call{" "}
              <a href={telHref(site.phones[0])} className="link whitespace-nowrap">
                {formatPhone(site.phones[0])}
              </a>
              .
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
