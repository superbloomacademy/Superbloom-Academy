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
import { authLimiter, publicLimiter } from "./middleware/rateLimiter.js";
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
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/public", publicLimiter, publicRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/admin", adminRoutes);

// Global error handler
app.use(errorHandler);

export default app;
