import mongoose from "mongoose";

const AdmissionSchema = new mongoose.Schema(
  {
    // basic contact
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    // program choice
    stream: { type: String, enum: ["engineering", "pharmacy"], required: true },
    course: { type: String },

    // additional details collected from form
    firstName: { type: String },
    lastName: { type: String },
    dob: { type: String },
    address: { type: String },
    institution: { type: String },
    yearOfStudy: { type: String },
    duration: { type: String },
    hearAboutUs: { type: String },

    message: { type: String },

    // review status for admin
    status: { type: String, enum: ["new", "under review", "accepted", "rejected"], default: "new" },
  },
  { timestamps: true },
);

const Admission = mongoose.model("Admission", AdmissionSchema);

export default Admission;