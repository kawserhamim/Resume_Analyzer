import mongoose from "mongoose";

/* ---------------- Technical Questions ---------------- */
const technicalQuestionsSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

/* ---------------- Behavioral Questions ---------------- */
const behavioralQuestionsSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

/* ---------------- Preparation Plan ---------------- */
const preparationPlanSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    focus: { type: String, required: true },
    tasks: { type: [String], required: true },
  },
  { _id: false }
);

/* ---------------- Main Schema (MATCHED WITH ZOD) ---------------- */
const interviewReportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    resume: {
      type: String,
      required: true,
    },

    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    candidate_introduction: {
      type: String,
      required: true,
    },

    technicalQuestions: {
      type: [technicalQuestionsSchema],
      default: [],
    },

    behavioralQuestions: {
      type: [behavioralQuestionsSchema],
      default: [],
    },

    skillGaps: {
      type: [String],
      default: [],
    },

    preparationPlan: {
      type: [preparationPlanSchema],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ---------------- Model ---------------- */
const InterviewReport = mongoose.model(
  "InterviewReport",
  interviewReportSchema
);

export default InterviewReport;