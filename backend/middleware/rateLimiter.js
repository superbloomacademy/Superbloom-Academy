import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 5 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, try again later" },
});

export const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, try again later" },
});

// Popup and visit counting: every page a visitor opens makes one of these calls,
// so the limit is generous and only has to stop a runaway script.
export const siteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  // Counted per visitor, not per IP address: the website's own server forwards these
  // calls, so every visitor would otherwise share one address and one limit.
  keyGenerator: (req) => (typeof req.body?.visitor === "string" && req.body.visitor.slice(0, 64)) || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, try again later" },
});
