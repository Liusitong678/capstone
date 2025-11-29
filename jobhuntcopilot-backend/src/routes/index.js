const router = require("express").Router();

const savedRoutes = require('./saved.routes');
const aiRoutes = require("./ai.routes");
const jobsRoutes = require("./jobs.routes");
const resumeRoutes = require("./resume.routes");
const userRoutes = require("./user.routes");
const paymentRoutes = require("./payment.routes");

const { verifyFirebaseToken } = require("../middleware/auth");



// Public routes (NO LOGIN REQUIRED)
router.get("/public", (req, res) => {
  res.json({ public: true });
});

// Protected routes (LOGIN REQUIRED)

router.use("/ai", verifyFirebaseToken, aiRoutes);
router.use("/jobs", verifyFirebaseToken, jobsRoutes);
router.use("/saved-jobs", verifyFirebaseToken, savedRoutes);
router.use("/resume", verifyFirebaseToken, resumeRoutes);
router.use("/users", verifyFirebaseToken, userRoutes);
router.use("/payment", verifyFirebaseToken, paymentRoutes);

module.exports = router;
