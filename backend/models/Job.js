import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    department: { type: String },
    location: { type: String },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true },
);

export default mongoose.model("Job", JobSchema);
