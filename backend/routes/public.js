import express from "express";
import { apply, admission, contact } from "../controllers/publicController.js";
import {
  listPublicWorkshops,
  getPublicWorkshop,
  registerForWorkshop,
  getPublicPayment,
  createCollegeEnquiry,
} from "../controllers/workshopController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/apply", upload.single("resume"), apply);
router.post("/admission", admission);
router.post("/contact", contact);

router.get("/workshops", listPublicWorkshops);
router.get("/workshops/:slug", getPublicWorkshop);
router.post("/workshops/:slug/register", registerForWorkshop);
router.get("/payment", getPublicPayment);
router.post("/college-enquiry", createCollegeEnquiry);

export default router;
