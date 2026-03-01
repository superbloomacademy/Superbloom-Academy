import Candidate from "../models/Candidate.js";
import Admission from "../models/Admission.js";
import Contact from "../models/Contact.js";
import cloudinary from "../config/cloudinary.js";

export const apply = async (req, res, next) => {
  try {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!req.file)
      return res.status(400).json({ message: "Resume file is required" });
    if (!allowed.includes(req.file.mimetype))
      return res.status(400).json({ message: "Invalid file type" });
    // file size is limited by multer
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "raw" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          },
        );
        stream.end(buffer);
      });
    };
    const uploaded = await streamUpload(req.file.buffer);
    const candidate = await Candidate.create({
      job: req.body.job,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      dob: req.body.dob,
      university: req.body.university,
      branch: req.body.branch,
      course: req.body.course,
      percentage: req.body.percentage,
      whyJoinUs: req.body.whyJoinUs,
      resumeUrl: uploaded.secure_url,
      resumePublicId: uploaded.public_id,
    });
    res.status(201).json({ message: "Application submitted", candidate });
  } catch (err) {
    next(err);
  }
};

export const admission = async (req, res, next) => {
  try {
    // rely on schema to enforce required properties
    const admission = await Admission.create(req.body);
    console.log(admission);
    res.status(201).json({ message: "Admission request submitted", admission });
  } catch (err) {
    next(err);
  }
};
export const contact = async (req, res, next) => {
  try {
    // rely on schema to enforce required properties
    const contact = await Contact.create(req.body);
    res.status(201).json({ message: "Contact submitted", contact });
  } catch (err) {
    next(err);
  }
};
