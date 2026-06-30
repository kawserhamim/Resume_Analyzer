import generateInterviewReport from "../services/ai.services.js";
import { extractText } from "../services/parser.services.js";
import { deleteFile } from "../utils/delete.js";
import InterviewReport from "../models/interviewreport.models.js";

export const uploadFiles = async (req, res) => {
  let resumePath;
  let jdPath;

  try {
    if (!req.files?.resume?.[0] || !req.files?.jd?.[0]) {
      return res.status(400).json({
        success: false,
        message: "Both resume and JD files are required",
      });
    }

    const resumeFile = req.files.resume[0];
    const jdFile = req.files.jd[0];

    resumePath = resumeFile.path;
    jdPath = jdFile.path;

    // 🔐 File type validation
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(resumeFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume file type",
      });
    }

    if (!allowedTypes.includes(jdFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid JD file type",
      });
    }

    // ⚡ Faster processing
    const [resumeText, jobText] = await Promise.all([
      extractText(resumePath),
      extractText(jdPath),
    ]);

    // 🤖 AI report generation
    const report = await generateInterviewReport(resumeText, jobText);

    if (!report || typeof report !== "object") {
      throw new Error("Invalid AI response");
    }

    // 💾 Save to DB
    const savedReport = await InterviewReport.create({
      ...report,
      createdBy: req.user?.userId || null,
    });

    // 🧹 Cleanup files
    await deleteFile(resumePath);
    await deleteFile(jdPath);

    return res.status(201).json({
      success: true,
      message: "Report generated successfully",
      data: savedReport,
    });

  } catch (err) {
    console.error("Upload error:", err);

    if (resumePath) await deleteFile(resumePath).catch(() => {});
    if (jdPath) await deleteFile(jdPath).catch(() => {});

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await InterviewReport.find({ createdBy: req.user?.userId || null });
    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (err) {
    console.error("Fetch reports error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};