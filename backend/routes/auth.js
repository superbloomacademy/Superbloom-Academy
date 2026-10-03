import express from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/authController.js";
import Admin from "../models/Admin.js";
import protect from "../middleware/protect.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

// Only a superadmin may create admin accounts. The one exception is the very
// first account, so a fresh database can still be set up.
const registerGuard = async (req, res, next) => {
  try {
    if ((await Admin.countDocuments()) === 0) return next();
    protect(req, res, () => authorize(["superadmin"])(req, res, next));
  } catch (err) {
    next(err);
  }
};

router.post("/register", registerGuard, register);
router.post("/login", login);
router.get("/refresh", refresh);
router.post("/logout", logout);

export default router;
