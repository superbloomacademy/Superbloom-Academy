import { BadgePercent, Briefcase, CalendarDays, GraduationCap, Megaphone, Presentation, Trophy } from "lucide-react";

// The kinds of announcement an admin can create, with the label and icon shown for each.
export const announcementKinds = {
  workshop: { label: "Workshop", icon: CalendarDays },
  hackathon: { label: "Hackathon", icon: Trophy },
  batch: { label: "New batch", icon: GraduationCap },
  event: { label: "Seminar", icon: Presentation },
  offer: { label: "Offer", icon: BadgePercent },
  placement: { label: "Placements", icon: Briefcase },
  news: { label: "News", icon: Megaphone },
};

const dateParts = (d) => {
  const f = (opts) => new Date(d).toLocaleDateString("en-IN", { ...opts, timeZone: "Asia/Kolkata" });
  return { day: f({ day: "numeric" }), month: f({ month: "short" }) };
};

// What the home page hero shows as "happening now": live announcements first, then
// workshops that are open for registration. Returns one shape for both.
export function happeningNow(announcements, workshops, limit = 3) {
  const fromAnnouncements = announcements.map((a) => ({
    key: a._id,
    announcementId: a._id,
    kind: a.kind,
    title: a.title,
    text: a.message,
    href: a.ctaHref,
    cta: a.ctaLabel || "Know more",
  }));
  const linked = new Set(fromAnnouncements.map((a) => a.href));
  const fromWorkshops = workshops
    .filter((w) => !linked.has(`/workshops/${w.slug}`))
    .map((w) => ({
      key: w._id,
      kind: "workshop",
      title: w.title,
      text: w.summary,
      href: `/workshops/${w.slug}`,
      cta: "Register",
      date: dateParts(w.date),
      facts: [
        w.time,
        w.seatsLeft != null && `${w.seatsLeft} seats left`,
        w.currentPrice > 0 ? `₹${w.currentPrice}` : "Free",
      ].filter(Boolean),
    }));
  return [...fromAnnouncements, ...fromWorkshops].slice(0, limit);
}
