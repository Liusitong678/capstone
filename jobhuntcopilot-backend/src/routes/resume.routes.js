const express = require("express");
const upload = require("../middleware/upload");
const { uploadResume } = require("../controller/resume.controller");
const { getLatestResume } = require("../controller/resume.controller");

const router = express.Router();

router.post("/upload", upload.single("resume"), uploadResume);
// router.get("/latest", getLatestResume);

module.exports = router;
