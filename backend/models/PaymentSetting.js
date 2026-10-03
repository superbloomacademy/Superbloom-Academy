import mongoose from "mongoose";

// Single document (key: "payment") holding the UPI details shown on workshop pages.
const PaymentSettingSchema = new mongoose.Schema(
  {
    key: { type: String, default: "payment", unique: true },
    upiId: { type: String, trim: true },
    payeeName: { type: String, trim: true },
    // QR code image stored as a data URL so it can be shown and downloaded without a third-party host
    qrImage: { type: String },
    instructions: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("PaymentSetting", PaymentSettingSchema);
