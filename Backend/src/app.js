import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth_routes.js";
import fileRoutes from "./routes/file_routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Security Headers ───────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: "https://resume-analyzer-frontend-smoky.vercel.app",
    credentials: true,
  })
);

// ─── Body Parsing (with size limits to prevent payload DoS) ─────────────────
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

// ─── NoSQL Injection Sanitization ────────────────────────────────────────────
app.use(mongoSanitize());

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/files", fileRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Handle Multer upload errors gracefully
  if (err.name === "MulterError") {
    let message = "File upload error";
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File too large. Maximum size is 5MB per file.";
    } else if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
      message = err.message || "Invalid file or too many files uploaded.";
    }
    return res.status(400).json({ success: false, message, msg: message });
  }

  // Log full details server-side only
  console.error(`[${new Date().toISOString()}] Unhandled error:`, err.stack || err);

  // Never expose internal error messages or stack traces to clients in production
  const isDev = process.env.NODE_ENV === "development";
  res.status(err.status || 500).json({
    success: false,
    message: isDev ? err.message : "Internal Server Error",
    msg: isDev ? err.message : "Internal Server Error",
  });
});

export default app;