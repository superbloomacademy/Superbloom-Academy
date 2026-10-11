import mongoose from "mongoose";

// Someone who asked not to be messaged again. Campaigns skip them.
const OptOutSchema = new mongoose.Schema(
  {
    channel: { type: String, enum: ["email", "whatsapp"], required: true },
    // lower-case email address, or the last 10 digits of the mobile number
    value: { type: String, required: true, trim: true, lowercase: true },
  },
  { timestamps: true },
);

OptOutSchema.index({ channel: 1, value: 1 }, { unique: true });

export default mongoose.model("OptOut", OptOutSchema);
