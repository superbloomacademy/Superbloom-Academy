import { PageHero } from "@/components/sections";

// Shared layout for the privacy, terms and refund pages.
// `sections` is a list of { h, p?: string[], list?: string[] }.
export default function Policy({ title, lead, updated, sections, href }) {
  return (
    <>
      <PageHero title={title} lead={lead} crumbs={[{ name: title, href }]} />
      <article className="bg-white py-14 sm:py-16">
        <div className="wrap max-w-[72ch] text-lg">
          <p className="font-semibold text-slate">Last updated: {updated}</p>
          {sections.map((s) => (
            <section key={s.h} className="mt-10">
              <h2 className="text-2xl font-bold">{s.h}</h2>
              {s.p?.map((p) => (
                <p key={p} className="mt-4 text-slate">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="mt-4 space-y-2">
                  {s.list.map((item) => (
                    <li key={item} className="flex gap-3 text-slate">
                      <span aria-hidden className="mt-[0.7rem] h-2 w-2 shrink-0 rounded-full bg-bloom" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
