import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, default: "Career guidance" },
    // one or two sentences; shown on cards and used as the Google description
    description: { type: String, required: true },
    // plain text: "## " starts a heading, "- " a bullet, a blank line a new paragraph
    body: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("Article", ArticleSchema);
