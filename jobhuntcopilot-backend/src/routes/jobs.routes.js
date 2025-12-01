const express = require("express");
const router = express.Router();
const {parseCareerPage, getJobDetails} = require("../controller/jobImport.controller");

const {
  listJobs,
  listAllJobsAdmin,
  getJobById,
  addJob,
  updateJob,
  deleteJob,
  submitJob,
  listMyJobs,
  listPendingJobs,
  approveJob,
  rejectJob,
} = require("../controller/jobs.controller");

const { requireAdmin } = require("../middleware/auth");

// PUBLIC FEED (for logged-in users)
router.get("/", listJobs);

router.post("/parse-jobs", parseCareerPage)
router.post("/fetch-job-detail", getJobDetails )

// USER: submit job + view their own
router.post("/submit", submitJob);
router.get("/my", listMyJobs);

// ADMIN: moderation & full job list
router.get("/admin/all", requireAdmin, listAllJobsAdmin);
router.get("/admin/pending", requireAdmin, listPendingJobs);
router.put("/:id/approve", requireAdmin, approveJob);
router.put("/:id/reject", requireAdmin, rejectJob);

// EXISTING ADMIN CRUD
router.get("/:id", getJobById);
router.post("/", addJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
