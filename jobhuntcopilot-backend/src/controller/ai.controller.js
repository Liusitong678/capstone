const extractResumeText = require("../utils/extractText");
const {
  GoogleGenerativeAI,
  SchemaType,
  HarmCategory,
  HarmBlockThreshold
} = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const { geminiScore } = require("../services/geminiScoring");
const { computeAdaptiveMatchScore } = require("../services/adaptiveScoringEngine");
const { log } = require("@tensorflow/tfjs");

const { parseJobString } = require("../utils/jobParser");

exports.scoreResume = async (req, res) => {
  try {
    const { resumeUrl, job, model } = req.body;

    if (!resumeUrl || !job) {
      return res.status(400).json({ message: "Missing resumeUrl or job data" });
    }

    // Extract resume text
    const resumeText = await extractResumeText(resumeUrl);
    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        message: "Resume text extraction failed or text too short",
      });
    }

    // Parse job object
    let parsedJob = job;

    if (typeof job === "string") {
      parsedJob = parseJobString(job);
      console.log("📄 Parsed Job:", parsedJob);
    }

    // Fallback if job came incorrectly structured
    if (!parsedJob.description) parsedJob.description = "";
    if (!Array.isArray(parsedJob.skills)) parsedJob.skills = [];

    // Determine model based on user role
    const userRole = req.user?.role || "free";
    const isPremium = userRole === "premium";

    let selectedModel = "adaptive_similarity"; // default for free users

    if (isPremium) {
      // premium can choose
      if (model === "gemini") selectedModel = "gemini";
      else selectedModel = "adaptive_similarity";
    }

    if (!isPremium) {
      selectedModel = "adaptive_similarity"; // enforce for free users
    }

    console.log(`🔍 Using model: ${selectedModel} (role = ${userRole})`);

    // Run selected scoring engine
    let result;

    if (selectedModel === "gemini") {
      result = await geminiScore(resumeText, parsedJob);
    } else {
      result = await computeAdaptiveMatchScore(resumeText, parsedJob);
    }

    // Append the selected model for frontend display
    result.modelUsed = selectedModel;

    // Respond back
    return res.json(result);

  } catch (err) {
    console.error("❌ Scoring Error:", err);
    return res.status(500).json({
      message: "Scoring failed",
      error: err.message,
    });
  }
};

// Chat with Career Coach Context
exports.chatWithCareerCoach = async (req, res) => {
  try {
    const { messages, jobDescription, resumeText } = req.body;

    // Initialize Chat Model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemInstruction = `
      You are an expert Career Coach and Recruiter.
      User Context:
      - They are applying for a job with this description: "${jobDescription?.slice(0, 1000)}..."
      - Using this resume content: "${resumeText?.slice(0, 1000)}..."

      Goal: Answer the user's questions about gaps, improvements, interview prep, or salary negotiation based STRICTLY on the context provided.
      - Be encouraging but honest. 
      - Keep answers concise (under 3 sentences unless asked for details).
    `;

    // Construct History for Gemini
    const chatHistory = [
      {
        role: "user",
        parts: [{ text: systemInstruction }]
      },
      {
        role: "model",
        parts: [{ text: "Understood. I have analyzed the job and resume. How can I help?" }]
      },
      ...messages.slice(0, -1).map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }))
    ];

    const chat = model.startChat({ history: chatHistory });

    // Send the latest message
    const lastUserMessage = messages[messages.length - 1].text;
    const result = await chat.sendMessage(lastUserMessage);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ message: "AI is thinking too hard..." });
  }
};