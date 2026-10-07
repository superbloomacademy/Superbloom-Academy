import { getOpenJobs, getWorkshops } from "@/lib/api";
import { getAllArticles } from "@/lib/content";
import { programHref, programs } from "@/lib/programs";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap() {
  const articles = await getAllArticles();
  const pages = [
    { path: "/", priority: 1 },
    { path: "/programs", priority: 0.9 },
    { path: "/programs/engineering", priority: 0.9 },
    { path: "/programs/pharmacy", priority: 0.9 },
    ...programs.map((p) => ({ path: programHref(p), priority: 0.9 })),
    { path: "/for-colleges", priority: 0.9 },
    { path: "/workshops", priority: 0.8 },
    { path: "/admission", priority: 0.8 },
    { path: "/resources", priority: 0.7 },
    ...articles.map((a) => ({ path: `/resources/${a.slug}`, priority: 0.7, lastModified: a.date })),
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/careers", priority: 0.5 },
    { path: "/privacy-policy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
    { path: "/refund-policy", priority: 0.2 },
  ];
  const [jobs, workshops] = await Promise.all([getOpenJobs(), getWorkshops()]);
  const dynamic = [
    ...workshops.map((w) => ({ path: `/workshops/${w.slug}`, priority: 0.7, lastModified: w.updatedAt })),
    ...jobs.map((j) => ({ path: `/careers/${j._id}`, priority: 0.4, lastModified: j.updatedAt })),
  ];

  return [...pages, ...dynamic].map(({ path, priority, lastModified }) => ({
    url: `${site.url}${path}`,
    // only send a real date; a lastmod that is always "now" teaches Google to ignore it
    ...(lastModified && { lastModified: new Date(lastModified) }),
    priority,
  }));
}
