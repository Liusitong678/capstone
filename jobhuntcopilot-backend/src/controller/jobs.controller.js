const Job = require("../models/job");

// GET all jobs /api/jobs
async function listJobs(req, res, next) {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
}

// GET job by id /api/jobs/:id 
async function getJobById(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
}

// POST /api/jobs 
async function addJob(req, res, next) {
  try {
    const newJob = await Job.create(req.body);
    res.status(201).json(newJob);
  } catch (err) {
    next(err);
  }
}

// PUT /api/jobs/:id 
async function updateJob(req, res, next) {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/jobs/:id
async function deleteJob(req, res, next) {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    next(err);
  }
}



module.exports = { listJobs, getJobById, addJob, updateJob, deleteJob };
