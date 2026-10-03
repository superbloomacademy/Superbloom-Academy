import Link from "next/link";
import { ArrowUpRight, Clock, GraduationCap, Mail, MapPin, Phone, School } from "lucide-react";
import { ContactForm } from "@/components/forms";
import { PageHero, Section } from "@/components/sections";
import { fullAddress, site, telHref, formatPhone } from "@/lib/site";

const description =
  "Contact Superbloom Academy in Suraram, Hyderabad. Call, email or send a message about programs, fees, batch timings, workshops or college partnerships.";

export const metadata = {
  title: "Contact Superbloom Academy, Suraram, Hyderabad",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { description, url: "/contact" },
};

const mapQuery = encodeURIComponent(`Superbloom Academy, ${fullAddress}`);
const mapsHref = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

// Send people with a specific goal to the form built for it.
const shortcuts = [
  { icon: GraduationCap, title: "Want to join a programme?", desc: "The admission form gets you a call about batches and fees.", href: "/admission", cta: "Apply for admission" },
  { icon: School, title: "Writing from a college?", desc: "Request a campus training proposal for your students.", href: "/for-colleges#proposal", cta: "Request a proposal" },
];

export default function Contact() {
  return (
    <>
      <PageHero
        title="Contact Superbloom Academy"
        lead="Ask about a programme, fees, batch timings or a workshop. We reply by phone or email."
        crumbs={[{ name: "Contact", href: "/contact" }]}
      />

      <Section tone="paper">
        <ul className="grid gap-5 md:grid-cols-3">
          <li className="rounded-3xl bg-ink p-7 text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bloom text-ink">
              <Phone size={24} aria-hidden />
            </span>
            <h2 className="mt-5 text-2xl font-bold">Call us</h2>
            <p className="mt-3 space-y-1.5">
              {site.phones.map((p) => (
                <a key={p} href={telHref(p)} className="block font-display text-2xl font-bold hover:text-bloom">
                  {formatPhone(p)}
                </a>
              ))}
            </p>
            <p className="mt-5 text-white/75">The quickest way to ask about fees and batch timings. Call during office hours.</p>
          </li>
          <li className="rounded-3xl bg-white p-7 ring-1 ring-line">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-cobalt">
              <Mail size={24} aria-hidden />
            </span>
            <h2 className="mt-5 text-2xl font-bold">Email</h2>
            <a href={`mailto:${site.email}`} className="link mt-3 inline-block break-all text-lg">
              {site.email}
            </a>
            <h3 className="mt-6 flex items-center gap-2 font-bold">
              <Clock size={18} aria-hidden className="text-cobalt" /> Office hours
            </h3>
            <dl className="mt-2 space-y-1 text-slate">
              {site.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4">
                  <dt>{h.days}</dt>
                  <dd className="text-right font-semibold text-ink">{h.time}</dd>
                </div>
              ))}
            </dl>
          </li>
          <li className="rounded-3xl bg-white p-7 ring-1 ring-line">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-soft text-leaf">
              <MapPin size={24} aria-hidden />
            </span>
            <h2 className="mt-5 text-2xl font-bold">Visit</h2>
            <address className="mt-3 text-lg not-italic text-slate">{fullAddress}</address>
            <a className="link mt-3 inline-block" href={mapsHref} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
          </li>
        </ul>
      </Section>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Send us a message</h2>
            <p className="mt-4 text-lg text-slate">
              Use this form for general questions. For these two, the dedicated forms are quicker:
            </p>
            <ul className="mt-6 space-y-4">
              {shortcuts.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="group lift flex items-start gap-4 rounded-2xl bg-paper p-5 ring-1 ring-line">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bloom-soft text-bloom-deep">
                      <s.icon size={22} aria-hidden />
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-lg font-bold">{s.title}</span>
                      <span className="block text-slate">{s.desc}</span>
                      <span className="mt-2 flex items-center gap-1.5 font-semibold text-cobalt">
                        {s.cta} <ArrowUpRight size={16} aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-[0_30px_60px_-30px_rgb(10_26_74/0.35)] ring-1 ring-line sm:p-9">
            <ContactForm />
          </div>
        </div>
      </Section>

      <section aria-label="Map" className="bg-white pb-16 sm:pb-20">
        <div className="wrap">
          <iframe
            title="Map showing Superbloom Academy in Suraram, Hyderabad"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[24rem] w-full rounded-3xl border-0 ring-1 ring-line"
          />
        </div>
      </section>
    </>
  );
}
