import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    dob: { type: Date },
    university: { type: String },
    branch: { type: String },
    course: { type: String },
    percentage: { type: String },
    whyJoinUs: { type: String },
    resumeUrl: { type: String },
    resumePublicId: { type: String },
    status: {
      type: String,
      enum: ["reviewing", "shortlisted", "interviewing", "rejected"],
      default: "reviewing",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Candidate", CandidateSchema);