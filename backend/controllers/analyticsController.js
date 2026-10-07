import { DailyTraffic, PageView, Presence } from "../models/Traffic.js";
import Admission from "../models/Admission.js";
import Contact from "../models/Contact.js";
import CollegeEnquiry from "../models/CollegeEnquiry.js";
import WorkshopRegistration from "../models/WorkshopRegistration.js";
import { istDay, lastDays, startOfIstDay } from "../utils/day.js";

const BOT = /bot|crawl|spider|slurp|preview|lighthouse|headless|monitor|pingdom|facebookexternalhit|whatsapp/i;

const validVisitor = (v) => typeof v === "string" && /^[A-Za-z0-9-]{8,64}$/.test(v);

// "/programs/pharmacy?x=1" -> "/programs/pharmacy"
const cleanPath = (p) => {
  if (typeof p !== "string" || !p.startsWith("/")) return null;
  const path = p.split(/[?#]/)[0].slice(0, 200);
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
};

const named = [
  [/google\./, "Google"],
  [/instagram\./, "Instagram"],
  [/facebook\.|fb\.com|fb\.me/, "Facebook"],
  [/whatsapp\.|wa\.me/, "WhatsApp"],
  [/youtube\.|youtu\.be/, "YouTube"],
  [/linkedin\.|lnkd\.in/, "LinkedIn"],
  [/twitter\.|^x\.com|^t\.co$/, "X (Twitter)"],
  [/bing\.|yahoo\.|duckduckgo\./, "Other search engines"],
  [/t\.me|telegram\./, "Telegram"],
];

// Where the visit came from: a ?utm_source= tag wins, then the site that linked here.
const classifySource = (utm, referrer) => {
  const tag = typeof utm === "string" ? utm.trim().toLowerCase().slice(0, 40) : "";
  let host = "";
  try {
    host = referrer ? new URL(referrer).hostname.replace(/^www\./, "") : "";
  } catch {
    host = "";
  }
  const key = tag || host;
  if (!key) return "Direct";
  const match = named.find(([re]) => re.test(tag ? `${tag}.` : host));
  if (match) return match[1];
  return tag ? tag.replace(/[^a-z0-9 _.-]/g, "") || "Direct" : host;
};

const deviceOf = (ua = "") =>
  /ipad|tablet/i.test(ua) ? "tablet" : /mobi|android|iphone/i.test(ua) ? "mobile" : "desktop";

/* ---------- public ---------- */

export const trackView = async (req, res, next) => {
  try {
    const ua = req.headers["user-agent"] || "";
    const { visitor } = req.body;
    const path = cleanPath(req.body.path);
    if (!validVisitor(visitor) || !path || BOT.test(ua)) return res.status(204).end();

    const day = istDay();
    const seenToday = await PageView.exists({ day, visitor });
    await Promise.all([
      PageView.create({
        visitor, path, day,
        source: classifySource(req.body.utm, req.body.referrer),
        device: deviceOf(ua),
      }),
      DailyTraffic.updateOne({ day }, { $inc: { views: 1, visitors: seenToday ? 0 : 1 } }, { upsert: true }),
      Presence.updateOne({ visitor }, { $set: { path, lastSeen: new Date() } }, { upsert: true }),
    ]);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// Sent once a minute while a page stays open, so long reads still count as "on the site now".
export const trackPing = async (req, res, next) => {
  try {
    const { visitor } = req.body;
    const path = cleanPath(req.body.path);
    if (validVisitor(visitor) && path)
      await Presence.updateOne({ visitor }, { $set: { path, lastSeen: new Date() } }, { upsert: true });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

/* ---------- admin ---------- */

// Distinct visitors per value of `field` ("source" or "device") in the period.
const visitorsBy = (field, match) =>
  PageView.aggregate([
    { $match: match },
    { $group: { _id: { key: `$${field}`, visitor: "$visitor" } } },
    { $group: { _id: "$_id.key", visitors: { $sum: 1 } } },
    { $sort: { visitors: -1 } },
    { $limit: 8 },
  ]);

export const getLive = async (req, res, next) => {
  try {
    const since = new Date(Date.now() - 5 * 60 * 1000);
    const pages = await Presence.aggregate([
      { $match: { lastSeen: { $gte: since } } },
      { $group: { _id: "$path", visitors: { $sum: 1 } } },
      { $sort: { visitors: -1 } },
    ]);
    res.json({
      count: pages.reduce((n, p) => n + p.visitors, 0),
      pages: pages.slice(0, 8).map((p) => ({ path: p._id, visitors: p.visitors })),
    });
  } catch (err) {
    next(err);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const n = [7, 30, 90].includes(Number(req.query.days)) ? Number(req.query.days) : 30;
    const days = lastDays(n);
    const previous = lastDays(n, new Date(Date.now() - n * 86400000));
    const match = { day: { $gte: days[0], $lte: days[n - 1] } };
    const since = startOfIstDay(days[0]);
    const created = { createdAt: { $gte: since } };

    const [rows, before, unique, pages, sources, devices, admissions, registrations, colleges, messages] =
      await Promise.all([
        DailyTraffic.find(match).lean(),
        DailyTraffic.find({ day: { $gte: previous[0], $lte: previous[n - 1] } }).lean(),
        PageView.aggregate([{ $match: match }, { $group: { _id: "$visitor" } }, { $count: "n" }]),
        PageView.aggregate([
          { $match: match },
          { $group: { _id: "$path", views: { $sum: 1 }, people: { $addToSet: "$visitor" } } },
          { $project: { views: 1, visitors: { $size: "$people" } } },
          { $sort: { views: -1 } },
          { $limit: 10 },
        ]),
        visitorsBy("source", match),
        visitorsBy("device", match),
        Admission.countDocuments(created),
        WorkshopRegistration.countDocuments(created),
        CollegeEnquiry.countDocuments(created),
        Contact.countDocuments(created),
      ]);

    const byDay = Object.fromEntries(rows.map((r) => [r.day, r]));
    const series = days.map((day) => ({ day, views: byDay[day]?.views || 0, visitors: byDay[day]?.visitors || 0 }));
    const today = series[n - 1];

    res.json({
      days: n,
      views: series.reduce((s, d) => s + d.views, 0),
      visitors: unique[0]?.n || 0,
      // null when there is nothing to compare against
      previousViews: before.length ? before.reduce((s, d) => s + d.views, 0) : null,
      today: { views: today.views, visitors: today.visitors },
      series,
      pages: pages.map((p) => ({ path: p._id, views: p.views, visitors: p.visitors })),
      sources: sources.map((s) => ({ name: s._id, visitors: s.visitors })),
      devices: devices.map((d) => ({ name: d._id, visitors: d.visitors })),
      enquiries: { admissions, registrations, colleges, messages },
    });
  } catch (err) {
    next(err);
  }
};
