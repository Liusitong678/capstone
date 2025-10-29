const Job = require("../models/job");

// GET all jobs /api/jobs
async function listJobs(req, res, next) {
  try {
    // mock data
    const mockJobs = [
      {
        id: "1",
        title: "Frontend Developer",
        company: "NovaTech",
        description: "Work on UI using React and Bootstrap.",
        applyUrl: "https://example.com/frontend",
      },
      {
        id: "2",
        title: "Backend Engineer",
        company: "CodeWorks",
        description: "Develop RESTful APIs using Node.js and Express.",
        applyUrl: "https://example.com/backend",
      },
      {
        id: "3",
        title: "Full Stack Developer",
        company: "NextWave",
        description: "Work on both React frontend and Node.js backend.",
        applyUrl: "https://example.com/fullstack",
      },
    ];
    res.json(mockJobs);
    // const jobs = await Job.find().sort({ createdAt: -1 });
    // res.json(jobs);
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

// POST test data /api/jobs/seed  
async function seedJobs(req, res, next) {
  try {
    const data = [
      {
        title: "Frontend Developer",
        company: "NovaTech",
        description: "Work on UI using React and Bootstrap",
        skills: ["React", "Bootstrap"],
        location: "Toronto, ON",
        url: "https://example.com/frontend"
      },
      {
        title: "Backend Engineer",
        company: "CodeWorks",
        description: "Node.js, Express, and MongoDB API development",
        skills: ["Node.js", "Express", "MongoDB"],
        location: "Waterloo, ON",
        url: "https://example.com/backend"
      }
    ];
    const result = await Job.insertMany(data);
    res.json({ message: "Seeded jobs successfully", count: result.length });
  } catch (err) {
    next(err);
  }
}

module.exports = { listJobs, getJobById, addJob, updateJob, deleteJob, seedJobs };
