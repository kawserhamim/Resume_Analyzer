import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { interviewReportSchema, interviewReportGeminiSchema } from "./schema.js";

dotenv.config();

// ─────────────────────────────────────────────
// GEMINI CLIENT
// ─────────────────────────────────────────────

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// ─────────────────────────────────────────────
// STRICT PROMPT BUILDER (FILE-BASED ONLY)
// ─────────────────────────────────────────────

function buildStrictPrompt(cv, jobDescription) {
  return `
You are a STRICT AI RESUME ANALYSIS ENGINE.

Your only responsibility is to analyze a Resume against a Job Description.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INPUTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[RESUME]

${cv}

[JOB_DESCRIPTION]

${jobDescription}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GLOBAL RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. The Resume and Job Description are the ONLY sources of truth.

2. Never invent:
- skills
- experience
- education
- certifications
- projects
- companies
- achievements
- job titles
- responsibilities
- candidate identity

3. If information does not exist inside the Resume, use:

"NOT_FOUND"

4. Return ONLY valid JSON.

5. Never return markdown.

6. Never explain your reasoning.

7. Never include extra fields.

8. Every required field MUST exist.

9. Every array must exist (empty if necessary).

10. Strings must never be null.

11. Numbers must never be strings.

12. Do not wrap JSON inside markdown.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIELD RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━
name
━━━━━━━━━━

Extract the candidate name ONLY if explicitly written.

Otherwise:

"NOT_FOUND"

━━━━━━━━━━
title
━━━━━━━━━━

Extract the primary job title from the Job Description.

Otherwise:

"NOT_FOUND"

━━━━━━━━━━
resume
━━━━━━━━━━

Return the FULL resume exactly as provided.

Do not modify it.

━━━━━━━━━━
matchScore
━━━━━━━━━━

Return a number from 0-100.

Calculate using ONLY:

• Skill Match (40%)

• Experience Match (25%)

• Education Match (15%)

• Resume Completeness (10%)

• Overall JD Alignment (10%)

Never guess.

━━━━━━━━━━
candidate_introduction
━━━━━━━━━━

Write a professional summary.

Rules:

• Maximum 120 words

• Use ONLY Resume information

• Never invent facts

If insufficient information:

"NOT_FOUND"

━━━━━━━━━━
technicalQuestions
━━━━━━━━━━

Generate interview questions ONLY from:

• Resume skills

• Resume projects

• Resume technologies

• Job Description technologies

Never introduce technologies not present in either input.

Generate:

Minimum:
5

Maximum:
15

Each object:

{
"question":"",

"intention":"",

"answer":""
}

Rules for answer:

If Resume contains enough information:

Generate the answer using Resume + Job Description.

If Resume does NOT contain enough information:

Generate a professional sample interview answer using general software engineering knowledge.

Never fabricate candidate experiences.

Example:

Question:
"What is Redis used for in your project?"

Answer:
"Redis is commonly used for caching, session storage, and improving application performance by reducing database queries."

━━━━━━━━━━
behavioralQuestions
━━━━━━━━━━

A behavioral interview question asks the candidate to describe a SPECIFIC PAST SITUATION
to demonstrate how they handled work relevant to the target role.

Definition to apply:
"Past behavior is the best predictor of future performance."

You MUST generate this field. It MUST be a NON-EMPTY array of objects.

Generate EXACTLY 7 questions (never less, never more).

Each question MUST evaluate one of these competencies:

• teamwork

• communication

• ownership

• leadership

• adaptability

• conflict resolution

• learning ability

• time management

• problem solving

Build questions from ONLY these sources:

• Resume projects (name, description, technologies, outcomes)

• Resume work experience (roles, responsibilities, achievements)

• Resume extracurricular / hackathon / open-source items

• Job Description responsibilities and required soft skills

Rules:

1. If the Resume lists any project, at least 3 of the 7 questions must be anchored
   to a concrete project from the Resume (mention the project name in the question).

2. If the Resume lacks experience, generate general behavioral questions that are
   still clearly relevant to the Job Description.

3. NEVER invent a candidate experience that is not in the Resume.

4. Every question MUST be phrased in STAR style:
   Situation / Task / Action / Result.

5. Every item MUST be an object with EXACTLY these three string fields:

   {
     "question": "...",
     "intention": "...",
     "answer": "..."
   }

Rules for the "answer" field:

• The answer is a SAMPLE interview response to demonstrate what a strong answer looks like.

• If the Resume contains relevant evidence, base the sample answer on that evidence.

• If the Resume does NOT contain enough evidence, write a generic but realistic sample
  answer using the STAR method. Do NOT say "NOT_FOUND".

• The answer MUST be at least 2 sentences and MUST never be empty.

Example item (structure only — adapt to the actual resume):

{
  "question": "Tell me about a challenge you faced while building your Real-Time Chat Application and how you resolved it.",
  "intention": "Evaluate problem solving, ownership, and debugging skills.",
  "answer": "In a sample response, the candidate would describe the specific synchronization bug between connected users, the debugging steps taken, how socket events were restructured, and the measurable improvement in message delivery reliability."
}

━━━━━━━━━━
skillGaps
━━━━━━━━━━

Compare Resume against Job Description.

Return ONLY skills required in the Job Description but missing from the Resume.

Example:

[
"Docker",
"Kubernetes",
"AWS"
]

If no missing skills:

[]

━━━━━━━━━━
preparationPlan
━━━━━━━━━━

Create a personalized 7-day preparation roadmap.

Focus ONLY on:

• Skill gaps

• Weak Resume areas

• Missing technologies

Generate exactly:

7 objects

Each object:

{
"day":1,
"focus":"",
"tasks":[]
}

Rules:

Tasks must be actionable.

Examples:

Day 1

Focus:
Docker

Tasks:

Learn Docker basics

Run first container

Understand Dockerfile

Practice container networking

Day 2

Focus:
System Design

Tasks:

Study scalability basics

Read load balancing

Practice API architecture

Do NOT include topics unrelated to the Job Description.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIRED OUTPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You MUST return ONLY this exact JSON object.
Do not include any additional text, explanations, or markdown.
Do not exclude any required fields.
The "behavioralQuestions" array MUST contain EXACTLY 7 objects.

{
  "name": "",
  "title": "",
  "resume": "",
  "matchScore": 0,
  "candidate_introduction": "",
  "technicalQuestions": [
    { "question": "", "intention": "", "answer": "" }
  ],
  "behavioralQuestions": [
    { "question": "", "intention": "", "answer": "" },
    { "question": "", "intention": "", "answer": "" },
    { "question": "", "intention": "", "answer": "" },
    { "question": "", "intention": "", "answer": "" },
    { "question": "", "intention": "", "answer": "" },
    { "question": "", "intention": "", "answer": "" },
    { "question": "", "intention": "", "answer": "" }
  ],
  "skillGaps": [ "" ],
  "preparationPlan": [
    { "day": 1, "focus": "", "tasks": [ "" ] }
  ]
}


`;
}

// ─────────────────────────────────────────────
// MAIN FUNCTION
// ─────────────────────────────────────────────

export async function generateInterviewReport(cv, jobDescription) {
  const prompt = buildStrictPrompt(cv, jobDescription);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportGeminiSchema,
    },
  });

  // ─────────────────────────────────────────────
  // SAFE JSON PARSING
  // ─────────────────────────────────────────────

  let parsed;

  try {
    const text = response.text;
    parsed = typeof text === "string" ? JSON.parse(text) : text;
  } catch (err) {
    throw new Error("Gemini returned invalid JSON");
  }

  // ─────────────────────────────────────────────
  // ZOD VALIDATION
  // ─────────────────────────────────────────────

  const result = interviewReportSchema.safeParse(parsed);

  if (!result.success) {
    console.error("Schema validation error:", result.error.format());
    throw new Error("Response does not match schema");
  }

  return result.data;
}

// ─────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────

export default generateInterviewReport;