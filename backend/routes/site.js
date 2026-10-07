import express from "express";
import { listActiveAnnouncements, trackAnnouncement } from "../controllers/announcementController.js";
import { trackPing, trackView } from "../controllers/analyticsController.js";

// Calls the website makes by itself on every visit (the popup and visit counting),
// kept apart from /api/public so they do not use up the limit on form submissions.
const router = express.Router();

router.get("/announcements", listActiveAnnouncements);
router.post("/announcements/:id/event", trackAnnouncement);
router.post("/view", trackView);
router.post("/ping", trackPing);

export default router;
