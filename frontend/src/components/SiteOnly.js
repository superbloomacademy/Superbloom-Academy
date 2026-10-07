"use client";

import { usePathname } from "next/navigation";

// Ad landing pages (/lp/...) keep the visitor on one goal, so the site header,
// footer and announcement popup are left out there.
export default function SiteOnly({ children }) {
  const pathname = usePathname();
  return pathname?.startsWith("/lp") ? null : children;
}
