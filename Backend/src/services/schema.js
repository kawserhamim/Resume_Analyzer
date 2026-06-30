import { z } from "zod";

/* ─────────────────────────────────────────────
   ZOD SCHEMA (VALIDATION)
───────────────────────────────────────────── */
export const interviewReportSchema = z.object({
    name: z.string(),

    title: z.string(),

    resume: z.string(), // ✅ added

    matchScore: z.number().min(0).max(100),

    candidate_introduction: z.string(),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string().min(10),
            intention: z.string().min(5),
            answer: z.string().min(20),
        })
    ),

    skillGaps: z.array(z.string()),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string()),
        })
    ),
});

/* ─────────────────────────────────────────────
   GEMINI SCHEMA
───────────────────────────────────────────── */
export const interviewReportGeminiSchema = {
    type: "object",

    properties: {
        name: {
            type: "string",
        },

        title: {
            type: "string",
        },

        resume: {
            type: "string",
        },

        matchScore: {
            type: "number",
            minimum: 0,
            maximum: 100,
        },

        candidate_introduction: {
            type: "string",
        },

        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" },
                },
                required: ["question", "intention", "answer"],
                additionalProperties: false,
            },
        },

        behavioralQuestions: {
            type: "array",
            minItems: 5,
            maxItems: 10,
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" },
                },
                required: ["question", "intention", "answer"],
                additionalProperties: false,
            },
        },

        skillGaps: {
            type: "array",
            items: {
                type: "string",
            },
        },

        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: { type: "number" },
                    focus: { type: "string" },
                    tasks: {
                        type: "array",
                        items: { type: "string" },
                    },
                },
                required: ["day", "focus", "tasks"],
                additionalProperties: false,
            },
        },
    },

    required: [
        "name",
        "title",
        "resume",
        "matchScore",
        "candidate_introduction",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan",
    ],

    additionalProperties: false,
};