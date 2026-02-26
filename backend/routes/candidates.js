import express from "express";
import {
  getAllCandidates,
  getCandidate,
  updateStatus,
  deleteCandidate,
} from "../controllers/candidateController.js";
import protect from "../middleware/protect.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get("/", protect, authorize(["admin", "superadmin"]), getAllCandidates);
router.get("/:id", protect, authorize(["admin", "superadmin"]), getCandidate);
router.patch(
  "/:id/status",
  protect,
  authorize(["admin", "superadmin"]),
  updateStatus,
);
router.delete(
  "/:id",
  protect,
  authorize(["admin", "superadmin"]),
  deleteCandidate,
);

export default router;
