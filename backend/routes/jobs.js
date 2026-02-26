import express from "express";
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getOpenJobs,
  getJob,
  changeStatus,
  getJobApplicationCount,
} from "../controllers/jobController.js";
import protect from "../middleware/protect.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.post("/", protect, authorize(["admin", "superadmin"]), createJob);
router.put("/:id", protect, authorize(["admin", "superadmin"]), updateJob);
router.delete("/:id", protect, authorize(["admin", "superadmin"]), deleteJob);
router.get("/", protect, authorize(["admin", "superadmin"]), getAllJobs);
router.get("/open", getOpenJobs);
router.get("/:id", getJob);
router.get("/:id/application/count", getJobApplicationCount);
router.patch(
  "/:id/status",
  protect,
  authorize(["admin", "superadmin"]),
  changeStatus,
);

export default router;
