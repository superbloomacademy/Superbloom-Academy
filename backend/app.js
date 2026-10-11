import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import candidateRoutes from "./routes/candidates.js";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import siteRoutes from "./routes/site.js";
import whatsappRoutes from "./routes/whatsapp.js";
import { authLimiter, publicLimiter, siteLimiter } from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config()

const app = express();

app.use(helmet());

const allowedOrigins = [
  "https://superbloomacademy.in",
  "https://www.superbloomacademy.in",
  "https://admin.superbloomacademy.in",
  // keep your vercel preview/prod domains too (optional but helpful)
  "https://superbloom-academy-frontend.vercel.app",
  "https://superbloom-academy-admin.vercel.app",
  // local development (set in .env)
  ...[process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean).map((u) => u.trim()),
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      // Unknown origins get no CORS headers, so browsers block them. Requests
      // proxied by the website's own server are same-origin for the visitor
      // and must not be rejected here.
      callback(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  })
);

// a campaign or a student import can carry an uploaded contact list, which is larger than a normal form
app.use(["/api/admin/campaigns", "/api/admin/students"], express.json({ limit: "1mb" }));
// the exact bytes are kept so the signature Meta puts on each webhook call can be checked
app.use("/api/whatsapp", express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/public", publicLimiter, publicRoutes);
app.use("/api/site", siteLimiter, siteRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// Global error handler
app.use(errorHandler);

export default app;
