import express from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { uploadFiles , getAllReports } from "../controllers/file.controllers.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "jd", maxCount: 1 },
  ]),
  uploadFiles
);

router.get("/all" , authMiddleware, getAllReports)

export default router;