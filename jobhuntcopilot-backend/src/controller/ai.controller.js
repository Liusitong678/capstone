const extractResumeText = require("../utils/extractText");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.scoreResume = async (req, res) => {
  try {
    const { resumeUrl, jobDescription } = req.body;

    if (!resumeUrl || !jobDescription) {
      return res.status(400).json({ message: "Missing resumeUrl or jobDescription" });
    }

    const resumeText = await extractResumeText(resumeUrl);
    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({ message: "Resume text extraction failed" });
    }

    // FIXED: use available model
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash"
    });

    const prompt = `
      Compare this resume with this job description.
      Return strict JSON only:
      {
        "score": number,
        "matched": ["skill1","skill2"],
        "missing": ["skillA","skillB"],
        "feedback": "short feedback"
      }

      JOB DESCRIPTION:
      ${jobDescription}

      RESUME TEXT:
      ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    const clean = raw.replace(/```json|```/g, "");
    const aiData = JSON.parse(clean);

    res.json(aiData);

  } catch (err) {
    console.error("❌ Gemini AI Scoring Error:", err);
    res.status(500).json({
      message: "Gemini scoring failed",
      error: err.message
    });
  }
};
