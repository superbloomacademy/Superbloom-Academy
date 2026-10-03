import mongoose from "mongoose";

const CollegeEnquirySchema = new mongoose.Schema(
  {
    collegeName: { type: String, required: true },
    collegeType: { type: String },
    location: { type: String },
    contactPerson: { type: String, required: true },
    designation: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    students: { type: String },
    departments: { type: String },
    year: { type: String },
    program: { type: String },
    mode: { type: String },
    timeline: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: ["new", "contacted", "meeting scheduled", "proposal sent", "converted", "lost"],
      default: "new",
    },
  },
  { timestamps: true },
);

export default mongoose.model("CollegeEnquiry", CollegeEnquirySchema);
