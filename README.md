# 🚀 ResumeAI — Intelligent Resume Analyzer & Interview Preparation Engine

[![Google Gemini](https://img.shields.io/badge/AI_Engine-Google_Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-68a063?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Security](https://img.shields.io/badge/Security-0_Vulnerabilities-brightgreen?style=for-the-badge&logo=securityscorecard&logoColor=white)](https://github.com/kawserhamim/Resume_Analyzer)

An enterprise-grade AI engine that analyzes resumes against target job descriptions, computes weighted match scores, detects skill gaps, generates STAR-format interview questions, and creates a tailored 7-day preparation roadmap.

---

## ⚡ Project Excellence (In 5 Points)

- 🧠 **Deterministic AI Scoring**: Evaluates candidate fit via a strict 5-tier weighted formula (Skills 40%, Experience 25%, Education 15%, Completeness 10%, Alignment 10%).
- 🛡️ **Zero Hallucinations**: Strict Gemini JSON Schema + Zod schema validation ensures 100% truthful, non-fabricated responses.
- 🎯 **STAR Interview Synthesis**: Generates project-anchored behavioral and technical interview questions complete with recruiter intentions and model answers.
- 📅 **7-Day Action Plan**: Automatically diagnoses missing tech stack requirements and outputs a personalized 7-day study sprint.
- 🔒 **Enterprise-Grade Security**: 0 NPM vulnerabilities, Helmet headers, NoSQL sanitization, rate limiting, Bcrypt (12 rounds), 1-day JWTs, and 5MB dual-filtered uploads.

---

## 🤖 AI Technologies

| AI Technology | Role & Implementation |
|---|---|
| **Google Gemini 2.5 Flash** | Core LLM reasoning engine for deep semantic resume & JD parsing |
| **Gemini Structured Output** | Native `responseSchema` forcing structured, predictable JSON output |
| **Zod Schema Engine** | Strict type-safety & post-generation runtime payload validation |
| **Prompt Engineering** | Zero-shot chain-of-truth strict prompt preventing factual hallucination |
| **STAR Behavioral Framework** | Situation-Task-Action-Result synthesis linked to candidate achievements |

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    User([User / Browser])
    
    subgraph Frontend ["Frontend (React + Vite + Tailwind)"]
        UI[Upload & Analysis Dashboard]
        Axios[Axios with Bearer Interceptor]
    end

    subgraph Security ["Security Layer"]
        Sec[Helmet • Rate Limiter • Mongo Sanitize • 5MB Limits]
    end

    subgraph Backend ["Backend (Express.js)"]
        API[Auth & Upload Controllers]
        Parser[Pure JS Parser (PDF/DOCX)]
        AI[Gemini 2.5 Flash + Zod Validation]
    end

    subgraph Database ["MongoDB Atlas"]
        DB[(Users & Interview Reports)]
    end

    User --> UI --> Axios --> Sec --> API
    API --> Parser --> AI --> DB
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios
- **Backend**: Node.js (v20+), Express 5, Mongoose 9, Helmet, Express-Rate-Limit, Express-Mongo-Sanitize
- **File Processing**: `pdf-extraction`, `mammoth` (100% Pure JS, zero native binaries)
- **AI & Parsing**: `@google/genai` (Gemini 2.5 Flash), `zod`
- **Database**: MongoDB Atlas

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd Backend
npm install
cp .env.example .env    # Configure MONGO_URI, SECRET_KEY, and GOOGLE_API_KEY
npm run dev
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** to access the application.

---

## 📜 License

This project is open-source under the [ISC License](LICENSE).
