import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CtaBand, PageHero, Section } from "@/components/sections";
import { formatDate, getWorkshops, modeLabel } from "@/lib/api";

const description =
  "Upcoming workshops at Superbloom Academy, Hyderabad, for engineering and pharmacy students. See dates, fees and what you will learn, and register online.";

export const metadata = {
  title: "Workshops for Engineering and Pharmacy Students in Hyderabad",
  description,
  alternates: { canonical: "/workshops" },
  openGraph: { description, url: "/workshops" },
};

const price = (w) => (w.currentPrice > 0 ? `₹${w.currentPrice}` : "Free");

function WorkshopList({ items }) {
  return (
    <ul className="border-t-2 border-ink">
      {items.map((w) => (
        <li key={w._id} className="border-b border-line">
          <Link
            href={`/workshops/${w.slug}`}
            className="group grid gap-x-8 gap-y-2 py-6 hover:bg-mist sm:px-3 md:grid-cols-[13rem_minmax(0,1fr)_auto] md:items-center"
          >
            <p className="font-semibold">
              {formatDate(w.date)}
              {w.time && <span className="block font-normal text-slate">{w.time}</span>}
            </p>
            <div>
              <h3 className="text-2xl font-bold group-hover:text-cobalt">{w.title}</h3>
              {w.summary && <p className="mt-1.5 text-slate">{w.summary}</p>}
              <p className="mt-2 text-[0.95rem] font-semibold">
                {[modeLabel[w.mode], price(w), w.registrationOpen ? (w.seatsLeft != null ? `${w.seatsLeft} seats left` : null) : "Registration closed"]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
            <ChevronRight aria-hidden className="hidden text-cobalt transition-transform group-hover:translate-x-1 md:block" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function Workshops() {
  const all = await getWorkshops();
  const today = new Date(new Date().toDateString());
  const upcoming = all.filter((w) => new Date(w.date) >= today);
  const past = all.filter((w) => new Date(w.date) < today).reverse();

  return (
    <>
      <PageHero
        title="Workshops for students"
        lead="Short, hands-on sessions on one skill or tool. A good way to try a subject before you commit to a full programme."
        crumbs={[{ name: "Workshops", href: "/workshops" }]}
      />

      <Section title="Upcoming workshops" tone="white">
        {upcoming.length ? (
          <WorkshopList items={upcoming} />
        ) : (
          <div className="max-w-2xl rounded-xl border border-line bg-mist p-7">
            <h3 className="text-xl font-bold">No workshops are scheduled right now</h3>
            <p className="mt-2 text-slate">
              New workshops are listed here as soon as dates are fixed.{" "}
              <Link href="/contact" className="link">
                Tell us what you would like a workshop on
              </Link>{" "}
              or look at our{" "}
              <Link href="/programs" className="link">
                full programmes
              </Link>
              .
            </p>
          </div>
        )}
      </Section>

      {past.length > 0 && (
        <Section title="Past workshops" tone="mist">
          <WorkshopList items={past} />
        </Section>
      )}

      <CtaBand
        title="Want a workshop at your college?"
        text="We run workshops on campus for engineering and pharmacy colleges. Tell us the topic and the batch."
        primary={{ label: "Request a college proposal", href: "/for-colleges#proposal" }}
      />
    </>
  );
}
