import express from "express";
import protect from "../middleware/protect.js";
import authorize from "../middleware/authorize.js";
import {
  getAdmissions,
  deleteAdmission,
  getContacts,
  deleteContact,
  getStats,
} from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/admissions",
  protect,
  authorize(["admin", "superadmin"]),
  getAdmissions,
);
router.delete(
  "/admissions/:id",
  protect,
  authorize(["admin", "superadmin"]),
  deleteAdmission,
);

router.get(
  "/contacts",
  protect,
  authorize(["admin", "superadmin"]),
  getContacts,
);
router.delete(
  "/contacts/:id",
  protect,
  authorize(["admin", "superadmin"]),
  deleteContact,
);

router.get("/stats",protect, authorize(["admin", "superadmin"]), getStats);

export default router;
