"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { nav, site, telHref, formatPhone } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Superbloom Academy home">
          <Image src="/emblem.png" alt="" width={47} height={40} priority />
          <span className="font-display text-xl font-bold leading-none tracking-tight">
            Superbloom
            <span className="block text-[0.7rem] font-semibold tracking-[0.18em] text-cobalt">Academy</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-[0.95rem] font-semibold hover:bg-mist ${
                isActive(l.href) ? "text-cobalt underline decoration-bloom decoration-[3px] underline-offset-8" : ""
              }`}
            >
              {l.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/admission" className="btn btn-bloom hidden sm:inline-flex">
            Apply for admission
          </Link>
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-md hover:bg-mist lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-paper lg:hidden">
          <div className="wrap flex flex-col py-3">
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`rounded-md px-2 py-3 text-lg font-semibold ${isActive(l.href) ? "text-cobalt" : ""}`}
              >
                {l.name}
              </Link>
            ))}
            <Link href="/admission" className="btn btn-bloom mt-3">
              Apply for admission
            </Link>
            <a href={telHref(site.phones[0])} className="btn btn-line mt-2">
              <Phone size={18} aria-hidden /> Call {formatPhone(site.phones[0])}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
