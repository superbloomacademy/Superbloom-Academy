// Guides come from two places: the starter set in articles.js and anything
// published from the admin panel (Articles). Admin articles are listed first.
import { articles as builtIn } from "./articles";

const API_BASE = process.env.API_BASE || "https://superbloom-academy-opal.vercel.app";

async function get(path) {
  try {
    const res = await fetch(`${API_BASE}/api${path}`, { next: { revalidate: 60 } });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

// Admin article text -> blocks. "## " starts a heading, "- " a bullet, a blank line a new paragraph.
export function parseBody(text = "") {
  const blocks = [{ p: [] }];
  const current = () => blocks[blocks.length - 1];
  for (const chunk of text.replace(/\r/g, "").split(/\n{2,}/)) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    if (lines[0].startsWith("## ")) {
      blocks.push({ h: lines.shift().slice(3).trim(), p: [] });
      if (!lines.length) continue;
    }
    if (lines.every((l) => /^[-*] /.test(l))) {
      const block = current();
      block.list = [...(block.list || []), ...lines.map((l) => l.slice(2).trim())];
    } else {
      // a paragraph after a list starts a fresh block so the order is kept
      if (current().list) blocks.push({ p: [] });
      current().p.push(lines.join(" "));
    }
  }
  return blocks.filter((b) => b.h || b.p.length || b.list);
}

const words = (blocks) =>
  blocks.flatMap((b) => [b.h || "", ...(b.p || []), ...(b.list || [])]).join(" ").split(/\s+/).length;
const minutes = (blocks) => Math.max(1, Math.round(words(blocks) / 200));

const starter = builtIn.map((a) => ({ ...a, minutes: minutes(a.body) }));

export async function getAllArticles() {
  const data = await get("/public/articles");
  const published = (data?.articles ?? []).map((a) => ({
    slug: a.slug,
    title: a.title,
    category: a.category,
    description: a.description,
    date: a.publishedAt || a.createdAt,
  }));
  const taken = new Set(published.map((a) => a.slug));
  return [...published, ...starter.filter((a) => !taken.has(a.slug))];
}

export async function getArticle(slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const data = await get(`/public/articles/${slug}`);
  if (data?.article) {
    const a = data.article;
    const body = parseBody(a.body);
    return {
      slug: a.slug,
      title: a.title,
      category: a.category,
      description: a.description,
      date: a.publishedAt || a.createdAt,
      body,
      minutes: minutes(body),
      related: [],
    };
  }
  return starter.find((a) => a.slug === slug) ?? null;
}
