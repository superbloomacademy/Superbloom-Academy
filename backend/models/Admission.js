import mongoose from "mongoose";
import { attributionField } from "../utils/attribution.js";

const AdmissionSchema = new mongoose.Schema(
  {
    // basic contact
    name: { type: String, required: true },
    // optional: the short form on ad landing pages asks only for name, phone and course
    email: { type: String },
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

    // id of the website announcement that brought the student here, if any
    source: { type: String },
    // the ad or campaign that brought them (utm_*, gclid, fbclid, landing page)
    attribution: attributionField,

    // review status for admin
    status: { type: String, enum: ["new", "under review", "accepted", "rejected"], default: "new" },
  },
  { timestamps: true },
);

const Admission = mongoose.model("Admission", AdmissionSchema);

export default Admission;