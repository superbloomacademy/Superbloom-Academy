import mongoose from "mongoose";

const WorkshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String },
    description: { type: String },
    category: { type: String, enum: ["engineering", "pharmacy", "general"], default: "general" },
    date: { type: Date, required: true },
    time: { type: String },
    mode: { type: String, enum: ["online", "offline", "hybrid"], default: "offline" },
    venue: { type: String },
    trainer: { type: String },
    // prices in rupees; 0 means free
    price: { type: Number, default: 0, min: 0 },
    earlyBirdPrice: { type: Number, min: 0 },
    earlyBirdUntil: { type: Date },
    seats: { type: Number, min: 0 },
    registrationDeadline: { type: Date },
    audience: { type: String },
    learn: [{ type: String }],
    agenda: [{ type: String }],
    certificate: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published", "closed"], default: "draft" },
  },
  { timestamps: true },
);

// Early-bird price applies up to and including earlyBirdUntil.
WorkshopSchema.methods.currentPrice = function (now = new Date()) {
  const early =
    this.earlyBirdPrice != null && this.earlyBirdUntil && now <= this.earlyBirdUntil;
  return early ? this.earlyBirdPrice : this.price || 0;
};

export default mongoose.model("Workshop", WorkshopSchema);
