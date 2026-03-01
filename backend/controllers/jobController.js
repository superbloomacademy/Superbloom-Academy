import Job from "../models/Job.js";

export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (err) {
    next(err);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.aggregate([
      {
        $lookup: {
          from: "candidates",
          localField: "_id",
          foreignField: "job",
          as: "applications",
        },
      },
      {
        $addFields: {
          applications: { $size: "$applications" },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          department: 1,
          location: 1,
          locationType: 1,
          jobType: 1,
          salary: 1,
          hiringTimeline: 1,
          hiringCount: 1,
          benefits: 1,
          status: 1,
          applications: 1,
          views: 1,
          createdAt: 1,
        },
      },
    ]);

    res.json({ jobs });
  } catch (err) {
    next(err);
  }
};

export const getOpenJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: "open" });
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
};

export const getJob = async (req, res, next) => {
  try {
    // increment view count for public access
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    next(err);
  }
};

export const getJobApplicationCount = async (req, res, next) => {
  try {
    const jobs = Jobs.find();
    console.log(jobs);

    
  } catch (error) {
    
  }
}

export const changeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    next(err);
  }
};
