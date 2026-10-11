import mongoose from "mongoose";

// A student the academy can write to, imported by an admin (for example the people of a
// workshop that was not run through the website). Campaigns pick students by list.
const StudentContactSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, index: true, sparse: true },
    // digits only, with the country code (9198xxxxxxxx)
    phone: { type: String, trim: true, index: true, sparse: true },
    college: { type: String, trim: true },
    // the lists this student is on, e.g. "UI/UX workshop, August 2026"
    lists: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

StudentContactSchema.index({ lists: 1 });

export default mongoose.model("StudentContact", StudentContactSchema);
