import mongoose from "mongoose";

// A message a student sent to the academy's WhatsApp business number.
// That number has no phone app, so the admin panel is the only place these can be read.
const WhatsappReplySchema = new mongoose.Schema(
  {
    // digits only, with the country code
    from: { type: String, required: true },
    name: { type: String },
    text: { type: String },
    messageId: { type: String, unique: true, sparse: true },
    at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("WhatsappReply", WhatsappReplySchema);
