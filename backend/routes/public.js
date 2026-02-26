import express from "express";
import { apply, admission, contact } from "../controllers/publicController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/apply", upload.single("resume"), apply);
router.post("/admission", admission);
router.post("/contact", contact);

export default router;
