import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    organization: { type: String },
    subject: { type: String },
    message: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Contact", ContactSchema);
