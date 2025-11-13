const router = require("express").Router();
const savedRoutes = require('./saved.routes');
const aiRoutes = require("./ai.routes");
const jobsRoutes = require("./jobs.routes");


// feature routes
router.use("/ai", aiRoutes);
router.use("/jobs", jobsRoutes);
router.use('/saved-jobs', savedRoutes);  

module.exports = router;
