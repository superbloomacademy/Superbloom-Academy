import Admission from "../models/Admission.js";
import Contact from "../models/Contact.js";
import Candidate from "../models/Candidate.js";
import Job from "../models/Job.js";

export const getAdmissions = async (req, res, next) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json({ admissions });
  } catch (err) {
    next(err);
  }
};

export const deleteAdmission = async (req, res, next) => {
  try {
    const admission = await Admission.findByIdAndDelete(req.params.id);
    if (!admission)
      return res.status(404).json({ message: "Admission not found" });
    res.json({ message: "Admission deleted" });
  } catch (err) {
    next(err);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ contacts });
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted" });
  } catch (err) {
    next(err);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalCandidates = await Candidate.countDocuments();
    const totalAdmissions = await Admission.countDocuments();
    const totalContacts = await Contact.countDocuments();
    res.json({ totalJobs, totalCandidates, totalAdmissions, totalContacts });
  } catch (err) {
    next(err);
  }
};
