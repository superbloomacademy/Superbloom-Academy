import Link from "next/link";
import { WorkshopGrid } from "@/components/cards";
import { CtaBand, PageHero, Section } from "@/components/sections";
import { getWorkshops } from "@/lib/api";
import { og } from "@/lib/seo";

const description =
  "Upcoming workshops at Superbloom Academy, Hyderabad, for engineering and pharmacy students. See dates, fees and what you will learn, and register online.";

export const metadata = {
  title: "Student Workshops in Hyderabad",
  description,
  alternates: { canonical: "/workshops" },
  openGraph: og({ description, url: "/workshops" }),
};

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

      <Section title="Upcoming workshops" tone="paper">
        {upcoming.length ? (
          <WorkshopGrid items={upcoming} />
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
          <WorkshopGrid items={past} />
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
