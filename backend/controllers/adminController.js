import Admission from "../models/Admission.js";
import Contact from "../models/Contact.js";
import Candidate from "../models/Candidate.js";
import Job from "../models/Job.js";
import Workshop from "../models/Workshop.js";
import WorkshopRegistration from "../models/WorkshopRegistration.js";
import CollegeEnquiry from "../models/CollegeEnquiry.js";
import Article from "../models/Article.js";

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

// Everything the dashboard needs in one request; the queries run in parallel.
export const getStats = async (req, res, next) => {
  try {
    const [
      totalJobs, openJobs, totalCandidates, totalAdmissions, newAdmissions, totalContacts,
      publishedWorkshops, totalRegistrations, pendingRegistrations, totalColleges, newColleges,
      publishedArticles, recentAdmissions, recentRegistrations, recentColleges,
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: "open" }),
      Candidate.countDocuments(),
      Admission.countDocuments(),
      Admission.countDocuments({ status: "new" }),
      Contact.countDocuments(),
      Workshop.countDocuments({ status: "published" }),
      WorkshopRegistration.countDocuments(),
      WorkshopRegistration.countDocuments({ status: "pending" }),
      CollegeEnquiry.countDocuments(),
      CollegeEnquiry.countDocuments({ status: "new" }),
      Article.countDocuments({ status: "published" }),
      Admission.find().sort({ createdAt: -1 }).limit(5).select("name stream course phone status createdAt").lean(),
      WorkshopRegistration.find().sort({ createdAt: -1 }).limit(5).select("name phone status amount createdAt workshop").populate("workshop", "title").lean(),
      CollegeEnquiry.find().sort({ createdAt: -1 }).limit(5).select("collegeName contactPerson program status createdAt").lean(),
    ]);
    res.json({
      totalJobs, openJobs, totalCandidates, totalAdmissions, newAdmissions, totalContacts,
      publishedWorkshops, totalRegistrations, pendingRegistrations, totalColleges, newColleges,
      publishedArticles, recentAdmissions, recentRegistrations, recentColleges,
    });
  } catch (err) {
    next(err);
  }
};
