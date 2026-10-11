import mongoose from "mongoose";

// none: the campaign does not use this channel
// pending: waiting to be sent
// skipped: not sent on purpose (no address, opted out)
// delivered / read: reported back by WhatsApp after sending
const channel = (statuses) => ({
  status: { type: String, enum: statuses, default: "none" },
  error: { type: String },
  at: { type: Date },
});

const CampaignRecipientSchema = new mongoose.Schema(
  {
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true, index: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    // digits only, with the country code (9198xxxxxxxx)
    phone: { type: String, trim: true },
    college: { type: String, trim: true },
    mail: channel(["none", "pending", "sent", "failed", "skipped"]),
    whatsapp: {
      ...channel(["none", "pending", "sent", "delivered", "read", "failed", "skipped"]),
      // id WhatsApp gives the message; delivery reports refer to it
      messageId: { type: String, index: true, sparse: true },
    },
    // set while one send request is working on this student, so two requests never send twice
    lockedUntil: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("CampaignRecipient", CampaignRecipientSchema);
