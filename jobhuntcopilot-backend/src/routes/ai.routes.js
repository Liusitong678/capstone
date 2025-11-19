const express = require("express");
const { scoreResume } = require("../controller/ai.controller");
const { generateCoverLetter } = require("../controller/ai.coverLetter");

const router = express.Router();

// Routes
router.post("/coverLetter", generateCoverLetter);
router.post("/score", scoreResume);

module.exports = router;
