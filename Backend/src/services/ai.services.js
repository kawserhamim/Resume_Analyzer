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

Generate behavioral interview questions using ONLY:

• Resume projects

• Resume experience

• Resume responsibilities

• Job Description responsibilities

Purpose:

Evaluate:

• teamwork

• communication

• ownership

• leadership

• adaptability

• conflict resolution

• learning ability

• time management

• problem solving

Rules:

1. Generate between 5 and 10 questions.

2. If Resume contains projects, ask project-related behavioral questions.

3. If Resume lacks experience, generate general behavioral questions relevant to the Job Description.

4. Never invent candidate experiences.

5. Every question must contain:

{
"question":"",
"intention":"",
"answer":""
}

Rules for answer:

If Resume provides evidence:

Use Resume information.

Otherwise:

Provide a strong sample interview answer based on interview best practices.

Never say:

NOT_FOUND

Never leave answer empty.

Good Example:

Question:
"Tell me about a challenge you faced while building your Real-Time Chat Application."

Intention:
"Evaluate problem solving and ownership."

Answer:
"One possible challenge was maintaining synchronization between multiple connected users. A structured approach would involve debugging event flow, improving socket communication, and testing edge cases until updates became reliable."

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
you have to generate the output in the exact format as specified above. 
Do not include any additional text, explanations, or markdown.
dont exclude any required fields.


Return ONLY this JSON object.

{
"name":"",

"title":"",

"resume":"",

"matchScore":0,

"candidate_introduction":"",

"technicalQuestions":[
{
"question":"",
"intention":"",
"answer":""
}
],

"behavioralQuestions":[  (must be between 3 and 5 questions)
{
"question":"",
"intention":"",
"answer":""
}
],

"skillGaps":[
""
],

"preparationPlan":[
{
"day":1,
"focus":"",
"tasks":[
""
]
}
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