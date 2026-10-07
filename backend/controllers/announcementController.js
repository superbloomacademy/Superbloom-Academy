import Announcement from "../models/Announcement.js";
import AnnouncementStat from "../models/AnnouncementStat.js";
import WorkshopRegistration from "../models/WorkshopRegistration.js";
import Admission from "../models/Admission.js";
import Workshop from "../models/Workshop.js";
import { publicView } from "./workshopController.js";
import cloudinary from "../config/cloudinary.js";
import { endOfIstDay, istDay, lastDays, startOfIstDay } from "../utils/day.js";

const fields = ["title", "kind", "message", "ctaLabel", "ctaHref", "showOn", "frequency", "status"];
const isId = (s) => /^[a-f0-9]{24}$/i.test(String(s || ""));

// Dates arrive from the form as "YYYY-MM-DD"; the end date is included.
const clean = (body) => {
  const data = Object.fromEntries(fields.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));
  if (body.startsAt !== undefined) data.startsAt = body.startsAt ? startOfIstDay(body.startsAt) : null;
  if (body.endsAt !== undefined) data.endsAt = body.endsAt ? endOfIstDay(body.endsAt) : null;
  if (data.ctaLabel === "") delete data.ctaLabel;
  return data;
};

const badLink = (href) =>
  href !== undefined && !/^(\/(?!\/)|https:\/\/)/.test(href)
    ? "The link must be a page on this site (starting with /) or a full https:// address."
    : null;

const uploadImage = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "announcements", resource_type: "image" }, (error, result) =>
        result ? resolve(result) : reject(error),
      )
      .end(buffer);
  });

const dropImage = (publicId) => (publicId ? cloudinary.uploader.destroy(publicId).catch(() => {}) : null);

/* ---------- public ---------- */

// A "workshop" announcement that links to a workshop stops showing by itself once that
// workshop is over, full, closed or deleted, even if its own end date has not been reached.
// Other types (placements, offers, news...) are never hidden this way, whatever they link to.
const stillOpen = async (a) => {
  const slug = a.kind === "workshop" && a.ctaHref.match(/^\/workshops\/([a-z0-9-]+)\/?$/)?.[1];
  if (!slug || slug === "status") return true;
  const w = await Workshop.findOne({ slug });
  if (!w) return false;
  const today = new Date(new Date().toDateString());
  return w.date >= today && (await publicView(w)).registrationOpen;
};

export const listActiveAnnouncements = async (req, res, next) => {
  try {
    const now = new Date();
    const announcements = await Announcement.find({
      status: "live",
      $and: [
        { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
        { $or: [{ endsAt: null }, { endsAt: { $gte: now } }] },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title kind message imageUrl ctaLabel ctaHref showOn frequency endsAt");
    const open = await Promise.all(announcements.map(stillOpen));
    res.json({ announcements: announcements.filter((a, i) => open[i]) });
  } catch (err) {
    next(err);
  }
};

const counters = { view: "views", click: "clicks", dismiss: "dismissals" };

export const trackAnnouncement = async (req, res, next) => {
  try {
    const counter = counters[req.body.type];
    if (!counter || !isId(req.params.id)) return res.status(400).json({ message: "Invalid event" });
    if (!(await Announcement.exists({ _id: req.params.id }))) return res.status(404).json({ message: "Not found" });
    await AnnouncementStat.updateOne(
      { announcement: req.params.id, day: istDay() },
      { $inc: { [counter]: 1 } },
      { upsert: true },
    );
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

/* ---------- admin ---------- */

// Each announcement with its totals, the last 14 days by day, and the
// registrations and admission enquiries that came from it.
export const listAnnouncements = async (req, res, next) => {
  try {
    const days = lastDays(14);
    const [announcements, totals, daily, registrations, admissions] = await Promise.all([
      Announcement.find().sort({ createdAt: -1 }).lean(),
      AnnouncementStat.aggregate([
        { $group: { _id: "$announcement", views: { $sum: "$views" }, clicks: { $sum: "$clicks" }, dismissals: { $sum: "$dismissals" } } },
      ]),
      AnnouncementStat.find({ day: { $gte: days[0] } }).lean(),
      WorkshopRegistration.aggregate([{ $match: { source: { $ne: null } } }, { $group: { _id: "$source", n: { $sum: 1 } } }]),
      Admission.aggregate([{ $match: { source: { $ne: null } } }, { $group: { _id: "$source", n: { $sum: 1 } } }]),
    ]);
    const open = await Promise.all(announcements.map(stillOpen));
    const by = (rows) => Object.fromEntries(rows.map((r) => [String(r._id), r]));
    const t = by(totals), reg = by(registrations), adm = by(admissions);
    res.json({
      announcements: announcements.map((a, i) => {
        const id = String(a._id);
        const rows = daily.filter((d) => String(d.announcement) === id);
        return {
          ...a,
          // true when the workshop it promotes is no longer open, so the website is not showing it
          workshopClosed: !open[i],
          views: t[id]?.views || 0,
          clicks: t[id]?.clicks || 0,
          dismissals: t[id]?.dismissals || 0,
          registrations: reg[id]?.n || 0,
          admissions: adm[id]?.n || 0,
          daily: days.map((day) => {
            const r = rows.find((d) => d.day === day);
            return { day, views: r?.views || 0, clicks: r?.clicks || 0 };
          }),
        };
      }),
    });
  } catch (err) {
    next(err);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const data = clean(req.body);
    const linkError = badLink(data.ctaHref);
    if (linkError) return res.status(400).json({ message: linkError });
    if (req.file) {
      const img = await uploadImage(req.file.buffer);
      data.imageUrl = img.secure_url;
      data.imagePublicId = img.public_id;
    }
    const announcement = await Announcement.create(data);
    res.status(201).json({ announcement });
  } catch (err) {
    if (err.name === "ValidationError") err.status = 400;
    next(err);
  }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const existing = await Announcement.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Announcement not found" });
    const data = clean(req.body);
    const linkError = badLink(data.ctaHref);
    if (linkError) return res.status(400).json({ message: linkError });
    if (req.file) {
      const img = await uploadImage(req.file.buffer);
      data.imageUrl = img.secure_url;
      data.imagePublicId = img.public_id;
    } else if (req.body.removeImage === "true") {
      data.imageUrl = "";
      data.imagePublicId = "";
    }
    const replaced = data.imagePublicId !== undefined ? existing.imagePublicId : null;
    existing.set(data);
    await existing.save();
    await dropImage(replaced);
    res.json({ announcement: existing });
  } catch (err) {
    if (err.name === "ValidationError") err.status = 400;
    next(err);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });
    await AnnouncementStat.deleteMany({ announcement: announcement._id });
    await dropImage(announcement.imagePublicId);
    res.json({ message: "Announcement deleted" });
  } catch (err) {
    next(err);
  }
};
