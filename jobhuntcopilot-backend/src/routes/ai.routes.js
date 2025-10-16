const express = require("express");
const router = express.Router();
// const { scoreMock, coverLetterMock } = require("../controllers/ai.controller");

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
// router.post("/score", scoreMock);
// router.post("/cover-letter", coverLetterMock);

module.exports = router;
