import { courses } from "@/lib/courses";
import { getOpenJobs } from "@/lib/api";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap() {
  const pages = [
    { path: "/", priority: 1 },
    { path: "/streams/pharmacy", priority: 0.9 },
    ...courses.map((c) => ({ path: `/courses/${c.slug}`, priority: 0.9 })),
    { path: "/streams", priority: 0.8 },
    { path: "/streams/engineering", priority: 0.8 },
    { path: "/admission", priority: 0.8 },
    { path: "/why-superbloom", priority: 0.6 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/careers", priority: 0.5 },
  ];
  const jobs = (await getOpenJobs()).map((j) => ({
    path: `/careers/${j._id}`,
    priority: 0.4,
    lastModified: j.updatedAt,
  }));

  return [...pages, ...jobs].map(({ path, priority, lastModified }) => ({
    url: `${site.url}${path}`,
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    priority,
  }));
}
