const express = require("express");
const router = express.Router();
const {
  listJobs,
  getJobById,
  addJob,
  updateJob,
  deleteJob,
  seedJobs
} = require("../controller/jobs.controller");
const {parseCareerPage, getJobDetails} = require("../controller/jobImport.controller");

router.get("/", listJobs);
router.get("/:id", getJobById);
router.post("/", addJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);
router.post("/parse-jobs", parseCareerPage)
router.post("/fetch-job-detail", getJobDetails )

module.exports = router;
