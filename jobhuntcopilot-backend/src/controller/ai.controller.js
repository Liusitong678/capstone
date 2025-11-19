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

// Function to determine if an error is fatal (non-retryable)
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

exports.scoreResume = async (req, res) => {
  try {
    const { resumeUrl, job } = req.body;

    if (!resumeUrl || !job) {
      return res.status(400).json({ message: "Missing resumeUrl or job data" });
    }

    // Extract text from resume
    const resumeText = await extractResumeText(resumeUrl);
    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({ message: "Resume text extraction failed or text too short" });
    }

    // Configure Safety Settings to be permissive
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    // Initialize Generative Model
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      safetySettings: safetySettings,
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
      
      Full Description:
      ${job.description}
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

    // Retry loop with exponential backoff
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

    if (!aiData) {
      throw lastError || new Error("Failed to generate score");
    }

    res.json(aiData);

  } catch (err) {
    console.error("❌ Gemini AI Scoring Error:", err.message);
    const status = (err.status === 400 || err.message.includes("API key")) ? 400 : 500;
    res.status(status).json({ message: "Gemini scoring failed", error: err.message });
  }
};