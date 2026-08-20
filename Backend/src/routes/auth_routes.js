import express from "express";
import rateLimit from "express-rate-limit";
import { register, login } from "../controllers/auth.controllers.js";

const router = express.Router();

// ─── Rate Limiters ───────────────────────────────────────────────────────────

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again after 15 minutes.",
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

// ─── Routes ──────────────────────────────────────────────────────────────────

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);

export default router;