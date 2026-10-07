import mongoose from "mongoose";

// One row per announcement per day (Indian time), so the numbers can be charted by day.
const AnnouncementStatSchema = new mongoose.Schema({
  announcement: { type: mongoose.Schema.Types.ObjectId, ref: "Announcement", required: true },
  day: { type: String, required: true },
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  dismissals: { type: Number, default: 0 },
});

AnnouncementStatSchema.index({ announcement: 1, day: 1 }, { unique: true });

export default mongoose.model("AnnouncementStat", AnnouncementStatSchema);
