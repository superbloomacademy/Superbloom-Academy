import Link from "next/link";
import Image from "next/image";
import { programHref, programsIn } from "@/lib/programs";
import { site, fullAddress, telHref, formatPhone } from "@/lib/site";

const more = [
  { name: "All programs", href: "/programs" },
  { name: "For colleges", href: "/for-colleges" },
  { name: "Workshops", href: "/workshops" },
  { name: "Resources", href: "/resources" },
  { name: "About us", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
  { name: "Apply for admission", href: "/admission" },
];

function ProgramLinks({ category, title }) {
  return (
    <nav aria-label={title}>
      <h2 className="font-display text-lg font-bold">
        <Link href={`/programs/${category}`} className="hover:text-bloom">
          {title}
        </Link>
      </h2>
      <ul className="mt-4 space-y-2.5">
        {programsIn(category).map((p) => (
          <li key={p.slug}>
            <Link href={programHref(p)} className="text-white/80 hover:text-bloom">
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_0.9fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-white p-1.5">
              <Image src="/emblem.png" alt="" width={42} height={36} />
            </span>
            <span className="font-display text-xl font-bold">Superbloom Academy</span>
          </div>
          <p className="mt-4 max-w-xs text-white/75">
            Industry-oriented training for engineering and pharmacy students across Telangana and Andhra Pradesh,
            and campus training for colleges.
          </p>
          <address className="mt-6 space-y-3 not-italic text-white/80">
            <p className="max-w-xs">{fullAddress}</p>
            <p>
              {site.phones.map((p) => (
                <a key={p} href={telHref(p)} className="block hover:text-bloom">
                  {formatPhone(p)}
                </a>
              ))}
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="break-all hover:text-bloom">
                {site.email}
              </a>
            </p>
          </address>
        </div>

        <ProgramLinks category="engineering" title="Engineering programs" />
        <ProgramLinks category="pharmacy" title="Pharmacy programs" />

        <nav aria-label="Academy">
          <h2 className="font-display text-lg font-bold">Academy</h2>
          <ul className="mt-4 space-y-2.5">
            {more.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/80 hover:text-bloom">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/15">
        <div className="wrap flex flex-col gap-3 py-5 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Superbloom Academy. All rights reserved.</p>
          <nav aria-label="Policies" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-bloom">Privacy policy</Link>
            <Link href="/terms" className="hover:text-bloom">Terms</Link>
            <Link href="/refund-policy" className="hover:text-bloom">Refund policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
