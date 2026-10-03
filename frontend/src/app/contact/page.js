import { ContactForm } from "@/components/forms";
import { PageHero, Section } from "@/components/sections";
import { fullAddress, site, telHref, formatPhone } from "@/lib/site";

const description =
  "Contact Superbloom Academy in Suraram, Hyderabad. Call, email or send a message about courses, fees, batch timings or institutional collaboration.";

export const metadata = {
  title: "Contact Superbloom Academy, Suraram, Hyderabad",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { description, url: "/contact" },
};

const mapQuery = encodeURIComponent(`Superbloom Academy, ${fullAddress}`);

export default function Contact() {
  return (
    <>
      <PageHero
        title="Contact Superbloom Academy"
        lead="Ask about a course, fees or batch timings. Colleges can use the same form to discuss a collaboration."
        crumbs={[{ name: "Contact", href: "/contact" }]}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">Call us</h2>
              <p className="mt-2 space-y-1 text-lg">
                {site.phones.map((p) => (
                  <a key={p} href={telHref(p)} className="link block">
                    {formatPhone(p)}
                  </a>
                ))}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Email</h2>
              <a href={`mailto:${site.email}`} className="link mt-2 inline-block break-all text-lg">
                {site.email}
              </a>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Visit</h2>
              <address className="mt-2 text-lg not-italic text-slate">{fullAddress}</address>
              <a
                className="link mt-2 inline-block"
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Office hours</h2>
              <dl className="mt-2 max-w-sm space-y-1 text-lg text-slate">
                {site.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4">
                    <dt>{h.days}</dt>
                    <dd className="text-right font-semibold text-ink">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-mist p-6 sm:p-9">
            <h2 className="text-3xl font-bold">Send us a message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>

      <section aria-label="Map" className="bg-mist">
        <iframe
          title="Map showing Superbloom Academy in Suraram, Hyderabad"
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[22rem] w-full border-0"
        />
      </section>
    </>
  );
}
