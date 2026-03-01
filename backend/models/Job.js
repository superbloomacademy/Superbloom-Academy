import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    department: { type: String },
    location: { type: String },
    locationType: {
      type: String,
      enum: ["in-person", "remote", "hybrid"],
      default: "in-person",
    },
    jobType: { 
      type: String, 
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      default: "full-time"
    },
    salary: { type: String },
    benefits: [{ type: String }],
    hiringTimeline: { type: String, default: "4weeks" },
    hiringCount: { type: Number, default: 1 },
    status: { 
      type: String, 
      enum: ["open", "closed", "draft", "paused"], 
      default: "open" 
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Job", JobSchema);
