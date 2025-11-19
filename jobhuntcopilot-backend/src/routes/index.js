const router = require("express").Router();

const savedRoutes = require('./saved.routes');
const aiRoutes = require("./ai.routes");
const jobsRoutes = require("./jobs.routes");
const resumeRoutes = require("./resume.routes");
const userRoutes = require("./user.routes");

const verifyToken = require("../middleware/auth");



// Public routes (NO LOGIN REQUIRED)
router.get("/public", (req, res) => {
  res.json({ public: true });
});

// Protected routes (LOGIN REQUIRED)

router.use("/ai", verifyToken, aiRoutes);
router.use("/jobs", verifyToken, jobsRoutes);
router.use("/saved-jobs", verifyToken, savedRoutes);
router.use("/resume", verifyToken, resumeRoutes);
router.use("/users", userRoutes);

module.exports = router;
