import express from "express";
import { verifyWebhook, receiveWebhook } from "../controllers/campaignController.js";

// Called by Meta, not by a browser: once to confirm the address, then for every
// delivery report and every message a student sends to the business number.
const router = express.Router();

router.get("/webhook", verifyWebhook);
router.post("/webhook", receiveWebhook);

export default router;
