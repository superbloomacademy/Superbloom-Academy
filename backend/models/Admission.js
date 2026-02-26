import mongoose from "mongoose";

const AdmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    stream: { type: String, enum: ["engineering", "pharmacy"], required: true },
    course: { type: String },
    message: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Admission", AdmissionSchema);
