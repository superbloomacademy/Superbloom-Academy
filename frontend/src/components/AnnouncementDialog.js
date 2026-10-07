"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { announcementKinds } from "@/lib/announcements";
import { markSeen, nextAnnouncement, post, setSource } from "@/lib/track";

// Wait before opening, so the page is readable first.
const DELAY = 2500;

// Popup for the announcements created in the admin panel. It opens a moment after the
// page loads, as often as the announcement is set to, and reports views, clicks and closes.
export default function AnnouncementDialog() {
  const pathname = usePathname();
  const ref = useRef(null);
  const clicked = useRef(false);
  const [list, setList] = useState([]);
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch("/api/site/announcements")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setList(data?.announcements || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (item) return;
    const next = nextAnnouncement(list.filter((a) => a.showOn === "all" || pathname === "/"));
    if (!next) return;
    const timer = setTimeout(() => setItem(next), DELAY);
    return () => clearTimeout(timer);
  }, [list, pathname, item]);

  useEffect(() => {
    if (!item || !ref.current || ref.current.open) return;
    ref.current.showModal();
    markSeen(item._id);
    post(`/announcements/${item._id}/event`, { type: "view" });
  }, [item]);

  if (!item) return null;

  const kind = announcementKinds[item.kind] || announcementKinds.news;
  const external = item.ctaHref.startsWith("https://");
  const close = () => ref.current?.close();

  // Escape, the close button and a click outside all end up here.
  const onClose = () => {
    if (!clicked.current) post(`/announcements/${item._id}/event`, { type: "dismiss" });
  };

  const onCta = () => {
    clicked.current = true;
    setSource(item._id);
    post(`/announcements/${item._id}/event`, { type: "click" });
    window.gtag?.("event", "announcement_click", { announcement: item.title });
    close();
  };

  const cta = (
    <>
      {item.ctaLabel || "Know more"} <ArrowRight size={18} aria-hidden />
    </>
  );

  return (
    <dialog
      ref={ref}
      aria-labelledby="announcement-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && close()}
      className="announcement m-auto max-h-[92vh] w-[min(92vw,27rem)] overflow-y-auto rounded-3xl bg-white p-0 text-ink shadow-[0_30px_80px_-20px_rgb(10_26_74/0.6)] backdrop:bg-ink/65"
    >
      <div className="relative">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt="" className="max-h-[50vh] w-full bg-mist object-contain" />
        ) : (
          <div className="relative flex h-32 items-end overflow-hidden bg-ink px-6 pb-5">
            <div aria-hidden className="dots absolute inset-0 opacity-60" />
            <div aria-hidden className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-cobalt/60 blur-3xl" />
            <kind.icon aria-hidden size={130} strokeWidth={1} className="absolute -bottom-6 right-4 text-white/10" />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-bloom text-ink">
              <kind.icon size={24} aria-hidden />
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-md hover:bg-mist"
        >
          <X size={20} aria-hidden />
        </button>
      </div>

      <div className="p-6 sm:p-7">
        <p className="inline-block rounded-md bg-bloom-soft px-2.5 py-1 text-sm font-semibold text-bloom-deep">{kind.label}</p>
        <h2 id="announcement-title" className="mt-3 text-2xl font-bold sm:text-3xl">
          {item.title}
        </h2>
        {item.message && <p className="mt-3 whitespace-pre-line text-slate">{item.message}</p>}

        <div className="mt-6 flex flex-col gap-2">
          {external ? (
            <a href={item.ctaHref} target="_blank" rel="noopener noreferrer" onClick={onCta} className="btn btn-bloom">
              {cta}
            </a>
          ) : (
            <Link href={item.ctaHref} onClick={onCta} className="btn btn-bloom">
              {cta}
            </Link>
          )}
          <button type="button" onClick={close} className="min-h-11 rounded-lg font-semibold text-slate hover:text-ink">
            Not now
          </button>
        </div>
      </div>
    </dialog>
  );
}
