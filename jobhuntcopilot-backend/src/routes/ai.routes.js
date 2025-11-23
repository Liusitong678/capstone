const express = require("express");
const { scoreResume, chatWithCareerCoach } = require("../controller/ai.controller");
const { generateCoverLetter } = require("../controller/ai.coverLetter");

const router = express.Router();

// Routes
router.post("/coverLetter", generateCoverLetter);
router.post("/score", scoreResume);
router.post("/chat", chatWithCareerCoach);

module.exports = router;
