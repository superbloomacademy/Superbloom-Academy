"use client";

import Link from "next/link";
import { setSource } from "@/lib/track";

// A link to whatever an announcement promotes. Following it is remembered, so a
// registration or enquiry that follows is counted against the announcement.
export default function AnnouncementLink({ id, href, children, ...props }) {
  const remember = () => id && setSource(id);
  return href.startsWith("https://") ? (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={remember} {...props}>
      {children}
    </a>
  ) : (
    <Link href={href} onClick={remember} {...props}>
      {children}
    </Link>
  );
}
