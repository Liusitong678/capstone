const express = require("express");
const router = express.Router();
// const { listJobs, seedJobs } = require("../controllers/jobs.controller");

// router.get("/", listJobs);
// router.post("/seed", seedJobs);
router.get("/", (req, res) => {
  // Mock implementation of list jobs endpoint
  const mockJobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Tech Corp",
      location: "New York, NY",
      description: "Develop and maintain web applications."
    },
    {
      id: 2,
      title: "Data Analyst",
      company: "Data Inc.",
      location: "San Francisco, CA",
      description: "Analyze data and generate insights."
    }
  ];
  res.json({ jobs: mockJobs, message: "This is a mock job listing." });
});
const {
  listJobs,
  getJobById,
  addJob,
  updateJob,
  deleteJob,
  seedJobs
} = require("../controller/jobs.controller");

router.get("/", listJobs);
router.get("/:id", getJobById);
router.post("/", addJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);
router.post("/seed", seedJobs);

module.exports = router;
