// Server-side reads from the Express backend. Results are cached for five minutes,
// so job pages are served as static HTML and refresh shortly after the admin edits a job.
const API_BASE = process.env.API_BASE || "https://superbloom-academy-opal.vercel.app";

async function get(path, revalidate = 300) {
  try {
    const res = await fetch(`${API_BASE}/api${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getOpenJobs() {
  const data = await get("/jobs/open");
  return data?.jobs ?? [];
}

export async function getJob(id) {
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;
  const data = await get(`/jobs/${id}`);
  return data?.job ?? null;
}

// Workshops and payment details refresh within a minute of an admin change.
export async function getWorkshops() {
  const data = await get("/public/workshops", 60);
  return data?.workshops ?? [];
}

export async function getWorkshop(slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const data = await get(`/public/workshops/${slug}`, 60);
  return data?.workshop ?? null;
}

// Announcements that are live right now (the same ones the popup shows).
export async function getAnnouncements() {
  const data = await get("/site/announcements", 60);
  return data?.announcements ?? [];
}

export async function getPayment() {
  const data = await get("/public/payment", 60);
  return data?.payment ?? null;
}

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

export const modeLabel = { online: "Online", offline: "In person", hybrid: "Hybrid" };

const labels = {
  "in-person": "On site",
  remote: "Remote",
  hybrid: "Hybrid",
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
};

export const jobFacts = (job) =>
  [job.department, job.location, labels[job.locationType], labels[job.jobType], job.salary].filter(Boolean);
