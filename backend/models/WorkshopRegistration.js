import mongoose from "mongoose";

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
  },
  { timestamps: true },
);

export default mongoose.model("WorkshopRegistration", WorkshopRegistrationSchema);
