import Candidate from "../models/Candidate.js";
import cloudinary from "../config/cloudinary.js";

export const getAllCandidates = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.job) filter.job = req.query.job;
    const candidates = await Candidate.find(filter).populate("job");
    res.json({ candidates });
  } catch (err) {
    next(err);
  }
};

export const getCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate("job");
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });
    res.json({ candidate });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });
    res.json({ candidate });
  } catch (err) {
    next(err);
  }
};

export const deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });
    if (candidate.resumePublicId) {
      try {
        await cloudinary.uploader.destroy(candidate.resumePublicId);
      } catch (e) {
        console.warn("Cloudinary delete failed", e.message);
      }
    }
    await candidate.remove();
    res.json({ message: "Candidate deleted" });
  } catch (err) {
    next(err);
  }
};
