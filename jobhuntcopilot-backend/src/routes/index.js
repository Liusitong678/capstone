const router = require("express").Router();

const aiRoutes = require("./ai.routes");
const jobsRoutes = require("./jobs.routes");
const resumeRoutes = require("./resume.routes");


// feature routes
router.use("/ai", aiRoutes);
router.use("/jobs", jobsRoutes);
router.use("/resume", resumeRoutes);

module.exports = router;
