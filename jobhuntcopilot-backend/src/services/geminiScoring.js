// services/geminiScoring.js

const extractResumeText = require("../utils/extractText");
const {
  GoogleGenerativeAI,
  SchemaType,
  HarmCategory,
  HarmBlockThreshold
} = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isFatalError = (err) => {
  const status = err.status || (err.response && err.response.status);
  const msg = err.message?.toLowerCase() || "";
  if (status === 400 || status === 401 || status === 403) return true;
  if (msg.includes("api key") || msg.includes("invalid argument")) return true;
  return false;
};

// Define the expected schema for the AI response
const schema = {
  description: "Resume scoring result",
  type: SchemaType.OBJECT,
  properties: {
    score: { type: SchemaType.NUMBER, description: "Overall score 0-100", nullable: false },
    matched: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, nullable: false },
    missing: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, nullable: false },
    feedback: { type: SchemaType.STRING, description: "Concise feedback", nullable: false },
  },
  required: ["score", "matched", "missing", "feedback"],
};

exports.geminiScore = async (resumeText, job) => {
  try {
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      safetySettings,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jobContext = `
      Job Title: ${job.title || "Unknown"}
      Company: ${job.company || "Unknown"}
      Level: ${job.level || "Not specified"}
      Required Skills: ${Array.isArray(job.skills) ? job.skills.join(", ") : "See description"}
      Full Description: ${job.description}
    `;

    // Construct the prompt
    const prompt = `
      You are an expert ATS scanner. 
      Compare the RESUME with the JOB DETAILS below.
      
      JOB DETAILS:
      ${jobContext}

      RESUME TEXT:
      ${resumeText}
      
      Analyze the match carefully. 
      - 'score': 0-100 based on relevance to Title, Skills, and Description.
      - 'matched': Extract exact skills found in both.
      - 'missing': Extract important skills from Job Details missing in Resume.
      - 'feedback': specific advice to improve chances for this specific ${job.title} role.

      Return JSON only.
    `;

    let attempt = 0;
    let aiData = null;
    let lastError = null;

    while (attempt < MAX_RETRIES) {
      try {
        attempt++;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        aiData = JSON.parse(responseText);
        break;
      } catch (err) {
        lastError = err;

        if (isFatalError(err)) {
          throw err;
        }

        console.warn(`⚠️ Attempt ${attempt} failed. Retrying...`);

        if (attempt < MAX_RETRIES) {
          const delayTime = INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
          await sleep(delayTime);
        }
      }
    }

    if (!aiData) throw lastError || new Error("Failed to generate score");
    return aiData;

  } catch (err) {
    console.error("❌ Gemini Scoring Error:", err);
    throw err;
  }
};
