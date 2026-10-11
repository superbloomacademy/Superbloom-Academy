import mongoose from "mongoose";

// One message sent to a list of students by email, WhatsApp or both.
const CampaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    kind: { type: String, enum: ["workshop_invite", "course_offer", "feedback"], default: "workshop_invite" },
    channels: {
      email: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false },
    },
    // the workshop the message is about, if any; fills {workshop}, {date}, {link} and so on
    workshop: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop" },
    email: {
      subject: { type: String, trim: true },
      heading: { type: String, trim: true },
      message: { type: String },
      buttonText: { type: String, trim: true },
      buttonUrl: { type: String, trim: true },
    },
    // A template approved in Meta's WhatsApp Manager and the value for each of its variables.
    // Values may hold the same {name}-style placeholders as the email.
    whatsapp: {
      template: { type: String, trim: true },
      language: { type: String, trim: true },
      // copy of the template text, kept so the admin can see what was sent
      preview: { type: String },
      header: {
        type: { type: String, enum: ["none", "text", "image"], default: "none" },
        name: { type: String },
        value: { type: String },
      },
      body: [{ _id: false, name: { type: String }, value: { type: String } }],
      // the changing end of a link button, e.g. the workshop slug
      button: {
        index: { type: Number },
        value: { type: String },
      },
    },
    // draft: nothing sent yet; sending: started, some students still waiting; sent: no one left
    status: { type: String, enum: ["draft", "sending", "sent"], default: "draft" },
    startedAt: { type: Date },
    finishedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true },
);

export default mongoose.model("Campaign", CampaignSchema);
