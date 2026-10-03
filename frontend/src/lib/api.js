// Server-side reads from the Express backend. Results are cached for five minutes,
// so job pages are served as static HTML and refresh shortly after the admin edits a job.
const API_BASE = process.env.API_BASE || "https://superbloom-academy-opal.vercel.app";

async function get(path) {
  try {
    const res = await fetch(`${API_BASE}/api${path}`, { next: { revalidate: 300 } });
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
