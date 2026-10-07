import mongoose from "mongoose";
import { attributionField } from "../utils/attribution.js";

const WorkshopRegistrationSchema = new mongoose.Schema(
  {
    // short reference the student keeps, used to check their status later
    code: { type: String, unique: true, sparse: true, uppercase: true },
    workshop: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    college: { type: String },
    year: { type: String },
    amount: { type: Number, default: 0 },
    // UPI transaction reference (UTR) the student enters after paying
    utr: { type: String, trim: true },
    // pending: paid but not yet checked against the bank statement by an admin
    status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
    // id of the website announcement that brought the student here, if any
    source: { type: String },
    attribution: attributionField,
    // every email attempt for this registration, oldest first
    emails: [
      {
        _id: false,
        kind: { type: String, enum: ["received", "confirmed", "rejected"] },
        status: { type: String, enum: ["sent", "failed", "skipped"] },
        error: { type: String },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("WorkshopRegistration", WorkshopRegistrationSchema);
