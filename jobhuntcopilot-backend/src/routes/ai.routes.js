const express = require("express");
const { scoreResume } = require("../controller/ai.controller");

const router = express.Router();

router.post("/score", scoreResume);

module.exports = router;
