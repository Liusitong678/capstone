const express = require("express");
const { scoreResume } = require("../controller/ai.controller");
const { generateCoverLetter } = require("../controller/ai.coverLetter");

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

router.post("/coverLetter", generateCoverLetter);

router.post("/score", scoreResume);

module.exports = router;
