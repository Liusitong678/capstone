const router = require("express").Router();

const aiRoutes = require("./ai.routes");
const jobsRoutes = require("./jobs.routes");


// feature routes
router.use("/ai", aiRoutes);
router.use("/jobs", jobsRoutes);

module.exports = router;
