import express from "express";
import multer from "multer";
import protect from "../middleware/protect.js";
import authorize from "../middleware/authorize.js";
import {
  getAdmissions,
  deleteAdmission,
  getContacts,
  deleteContact,
  getStats,
} from "../controllers/adminController.js";
import {
  listWorkshops,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  listRegistrations,
  updateRegistrationStatus,
  resendRegistrationEmail,
  getEmailStatus,
  sendEmailTest,
  getPaymentSetting,
  updatePaymentSetting,
  listCollegeEnquiries,
  updateCollegeEnquiry,
  deleteCollegeEnquiry,
} from "../controllers/workshopController.js";
import { listArticles, createArticle, updateArticle, deleteArticle } from "../controllers/articleController.js";
import {
  listAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { getAnalytics, getLive } from "../controllers/analyticsController.js";

const router = express.Router();

// QR code image for UPI payments: kept small because it is stored in the database
const qrUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 700 * 1024 },
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg", "image/webp"].includes(file.mimetype)) cb(null, true);
    else cb(Object.assign(new Error("The QR code must be a PNG, JPG or WebP image."), { status: 400 }), false);
  },
}).single("qr");

const qr = (req, res, next) =>
  qrUpload(req, res, (err) => {
    if (!err) return next();
    const message = err.code === "LIMIT_FILE_SIZE" ? "The QR code image must be under 700 KB." : err.message;
    res.status(400).json({ message });
  });

// Picture shown in the website popup; stored on Cloudinary
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg", "image/webp"].includes(file.mimetype)) cb(null, true);
    else cb(Object.assign(new Error("The picture must be a PNG, JPG or WebP image."), { status: 400 }), false);
  },
}).single("image");

const image = (req, res, next) =>
  imageUpload(req, res, (err) => {
    if (!err) return next();
    const message = err.code === "LIMIT_FILE_SIZE" ? "The picture must be under 2 MB." : err.message;
    res.status(400).json({ message });
  });

router.use(protect, authorize(["admin", "superadmin"]));

router.get("/admissions", getAdmissions);
router.delete("/admissions/:id", deleteAdmission);

router.get("/contacts", getContacts);
router.delete("/contacts/:id", deleteContact);

router.get("/stats", getStats);

router.get("/workshops", listWorkshops);
router.post("/workshops", createWorkshop);
router.put("/workshops/:id", updateWorkshop);
router.delete("/workshops/:id", deleteWorkshop);

router.get("/registrations", listRegistrations);
router.patch("/registrations/:id/status", updateRegistrationStatus);
router.post("/registrations/:id/resend-email", resendRegistrationEmail);

router.get("/email/status", getEmailStatus);
router.post("/email/test", sendEmailTest);

router.get("/payment", getPaymentSetting);
router.put("/payment", qr, updatePaymentSetting);

router.get("/articles", listArticles);
router.post("/articles", createArticle);
router.put("/articles/:id", updateArticle);
router.delete("/articles/:id", deleteArticle);

router.get("/announcements", listAnnouncements);
router.post("/announcements", image, createAnnouncement);
router.put("/announcements/:id", image, updateAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

router.get("/analytics", getAnalytics);
router.get("/analytics/live", getLive);

router.get("/college-enquiries", listCollegeEnquiries);
router.patch("/college-enquiries/:id/status", updateCollegeEnquiry);
router.delete("/college-enquiries/:id", deleteCollegeEnquiry);

export default router;
