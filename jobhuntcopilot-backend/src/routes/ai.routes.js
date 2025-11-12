const express = require("express");
const router = express.Router();
const axios = require("axios");
const { OpenAI } = require("openai");
const { Job } = require("../models/job");

// const { scoreMock, coverLetterMock } = require("../controllers/ai.controller");

/*
router.post("/score", (req, res) => {
  // Mock implementation of score endpoint
  const { resume, jobDescription } = req.body;
    if (!resume || !jobDescription) {
    return res.status(400).json({ error: "Resume and job description are required." });
  }
  // Simple mock scoring logic
  const score = Math.floor(Math.random() * 101); // Random score between 0 and 100
  res.json({ score, message: "This is a mock score." });
});
*/

//simple mock
router.post("/score", (req, res) => {
  res.json({ score: 0.82, matched: ["react"], missing: ["aws"] });
});

router.post("/cover-letter", async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;

    if (!jobTitle || !jobDescription) {
      return res.status(400).json({ error: "Missing job title or description" });
    }

    const prompt = `
Write a professional and personalized cover letter for the job below.

Job title: ${jobTitle}
Job description: ${jobDescription}

Keep it concise (around 200-250 words) and in a professional tone.
    `;

    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: process.env.HF_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:groq",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Access generated text correctly
    const text = response.choices[0].message || "Failed to generate text";
    res.json({ text });

  } catch (err) {
    console.error("❌ AI Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

module.exports = router;
