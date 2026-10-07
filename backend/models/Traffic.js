import mongoose from "mongoose";

// One row per page a visitor opens. `visitor` is a random ID kept in the visitor's
// browser; no name, phone number or IP address is stored. Rows are deleted after 90 days.
const PageViewSchema = new mongoose.Schema({
  visitor: { type: String, required: true },
  path: { type: String, required: true },
  source: { type: String, default: "Direct" },
  device: { type: String, enum: ["mobile", "tablet", "desktop"], default: "desktop" },
  day: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

PageViewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
PageViewSchema.index({ day: 1, visitor: 1 });

export const PageView = mongoose.model("PageView", PageViewSchema);

// Daily totals, kept for good after the page-view rows expire.
const DailyTrafficSchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true },
  views: { type: Number, default: 0 },
  visitors: { type: Number, default: 0 },
});

export const DailyTraffic = mongoose.model("DailyTraffic", DailyTrafficSchema);

// Who is on the site right now: one row per visitor, removed after ten quiet minutes.
const PresenceSchema = new mongoose.Schema({
  visitor: { type: String, required: true, unique: true },
  path: { type: String },
  lastSeen: { type: Date, default: Date.now },
});

PresenceSchema.index({ lastSeen: 1 }, { expireAfterSeconds: 600 });

export const Presence = mongoose.model("Presence", PresenceSchema);
