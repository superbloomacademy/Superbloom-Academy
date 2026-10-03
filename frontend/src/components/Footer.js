import Link from "next/link";
import Image from "next/image";
import { courses } from "@/lib/courses";
import { site, fullAddress, telHref, formatPhone } from "@/lib/site";

const academy = [
  { name: "About us", href: "/about" },
  { name: "Why Superbloom", href: "/why-superbloom" },
  { name: "All training streams", href: "/streams" },
  { name: "Engineering and technology", href: "/streams/engineering" },
  { name: "Work with us", href: "/careers" },
  { name: "Contact", href: "/contact" },
  { name: "Apply for admission", href: "/admission" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="wrap grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-white p-1.5">
              <Image src="/emblem.png" alt="" width={42} height={36} />
            </span>
            <span className="font-display text-xl font-bold">Superbloom Academy</span>
          </div>
          <p className="mt-4 max-w-xs text-white/75">
            Industry-oriented training in Hyderabad for pharmacy and engineering students.
          </p>
        </div>

        <nav aria-label="Pharmacy courses">
          <h2 className="font-display text-lg font-bold">Pharmacy courses</h2>
          <ul className="mt-4 space-y-2.5">
            {courses.map((c) => (
              <li key={c.slug}>
                <Link href={`/courses/${c.slug}`} className="text-white/80 hover:text-bloom">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Academy">
          <h2 className="font-display text-lg font-bold">Academy</h2>
          <ul className="mt-4 space-y-2.5">
            {academy.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/80 hover:text-bloom">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-lg font-bold">Visit or call</h2>
          <address className="mt-4 space-y-3 not-italic text-white/80">
            <p>{fullAddress}</p>
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
      </div>
      <div className="border-t border-white/15">
        <p className="wrap py-5 text-sm text-white/65">
          © {new Date().getFullYear()} Superbloom Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
