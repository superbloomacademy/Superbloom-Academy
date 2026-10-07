import mongoose from "mongoose";

// A promotion shown in the popup on the website: a workshop, hackathon, new batch or other news.
const AnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    kind: { type: String, enum: ["workshop", "hackathon", "batch", "event", "offer", "placement", "news"], default: "news" },
    message: { type: String, trim: true },
    imageUrl: { type: String },
    imagePublicId: { type: String },
    ctaLabel: { type: String, trim: true, default: "Know more" },
    // a page on the site ("/workshops/python") or a full https:// address
    ctaHref: { type: String, required: true, trim: true },
    // shown from startsAt up to and including endsAt; empty means no limit
    startsAt: { type: Date },
    endsAt: { type: Date },
    showOn: { type: String, enum: ["home", "all"], default: "home" },
    // how often one visitor sees the popup: every time a page loads, once per visit, or once a day
    frequency: { type: String, enum: ["always", "visit", "daily"], default: "always" },
    // draft: never shown. live: shown inside its dates. paused: switched off by hand.
    status: { type: String, enum: ["draft", "live", "paused"], default: "draft" },
  },
  { timestamps: true },
);

export default mongoose.model("Announcement", AnnouncementSchema);
