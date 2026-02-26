import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });
    const admin = await Admin.create({ name, email, password, role });
    const accessToken = generateAccessToken({
      id: admin._id,
      role: admin.role,
    });
    const refreshToken = generateRefreshToken({
      id: admin._id,
      role: admin.role,
    });
    admin.refreshToken = refreshToken;
    await admin.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const safe = admin.toObject();
    delete safe.password;
    res.status(201).json({ admin: safe, accessToken });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select(
      "+password +refreshToken",
    );
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });
    
    const isMatch = await admin.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });
    const accessToken = generateAccessToken({
      id: admin._id,
      role: admin.role,
    });
    const refreshToken = generateRefreshToken({
      id: admin._id,
      role: admin.role,
    });
    admin.refreshToken = refreshToken;
    await admin.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const safe = admin.toObject();
    delete safe.password;
    res.json({ admin: safe, accessToken });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const admin = await Admin.findById(payload.id).select("+refreshToken");
    if (!admin || admin.refreshToken !== token)
      return res.status(401).json({ message: "Invalid refresh token" });
    const accessToken = generateAccessToken({
      id: admin._id,
      role: admin.role,
    });
    const newRefresh = generateRefreshToken({
      id: admin._id,
      role: admin.role,
    });
    
    admin.refreshToken = newRefresh;
    await admin.save();
    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        await Admin.findByIdAndUpdate(payload.id, {
          $unset: { refreshToken: 1 },
        });
      } catch (e) {
        // ignore
      }
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};
