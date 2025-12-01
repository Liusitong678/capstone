const Job = require("../models/job");

/**
 * PUBLIC JOB FEED (for logged-in users)
 * Only show:
 *  - jobs with status "approved"
 *  - jobs with no status field (old data)
 */
async function listJobs(req, res, next) {
  try {
    const filter = {
      $or: [{ status: "approved" }, { status: { $exists: false } }],
    };

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
}

// ADMIN: GET ALL JOBS (for Admin Dashboard)
async function listAllJobsAdmin(req, res, next) {
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

// ADMIN: POST /api/jobs  (existing Admin flow)
async function addJob(req, res, next) {
  try {
    const payload = {
      ...req.body,
    };

    // Admin-created jobs should be visible by default
    if (!payload.status) {
      payload.status = "approved";
    }
    if (!payload.source) {
      payload.source = "manual";
    }

    const newJob = await Job.create(payload);
    res.status(201).json(newJob);
  } catch (err) {
    next(err);
  }
}

// ADMIN: PUT /api/jobs/:id
async function updateJob(req, res, next) {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
}

// ADMIN: DELETE /api/jobs/:id
async function deleteJob(req, res, next) {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    next(err);
  }
}

/* ==========================
 * USER JOB SUBMISSION FLOW
 * ========================== */

/**
 * POST /api/jobs/submit
 * Any logged-in user can submit a job.
 * Applies rate limits:
 *  - max 3 posts per 24h
 *  - max 5 posts per rolling 7 days
 */
async function submitJob(req, res, next) {
  try {
    const user = req.user; // from verifyFirebaseToken
    if (!user || !user.uid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, company, description, location, url, skills } = req.body;

    if (!title || !company || !description || !url) {
      return res.status(400).json({
        message:
          "Missing required fields: title, company, description, and url are required.",
      });
    }

    if (description.length < 50) {
      return res.status(400).json({
        message: "Job description must be at least 50 characters.",
      });
    }

    const now = new Date();

    // Start of day (for 3/day)
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // 7 days window (for 5/week)
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    const [todayCount, weekCount] = await Promise.all([
      Job.countDocuments({
        postedBy: user.uid,
        createdAt: { $gte: startOfDay },
      }),
      Job.countDocuments({
        postedBy: user.uid,
        createdAt: { $gte: weekAgo },
      }),
    ]);

    if (todayCount >= 3) {
      return res.status(429).json({
        message:
          "Daily job posting limit reached (3 per day). Try again tomorrow.",
      });
    }

    if (weekCount >= 5) {
      return res.status(429).json({
        message:
          "Weekly job posting limit reached (5 per week). Try again next week.",
      });
    }

    const job = await Job.create({
      title,
      company,
      description,
      location,
      url,
      skills: Array.isArray(skills) ? skills : [],
      postedAt: now,
      source: "user",
      status: "pending",
      postedBy: user.uid,
      postedByEmail: user.email || null,
    });

    return res.status(201).json(job);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/jobs/my
 * List jobs submitted by the current user
 */
async function listMyJobs(req, res, next) {
  try {
    const user = req.user;
    if (!user || !user.uid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const jobs = await Job.find({ postedBy: user.uid }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
}

/* ==========================
 * ADMIN MODERATION
 * ========================== */

/**
 * GET /api/jobs/admin/pending
 * Admin view of pending jobs
 */
async function listPendingJobs(req, res, next) {
  try {
    const jobs = await Job.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/jobs/:id/approve
 */
async function approveJob(req, res, next) {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: "approved", rejectionReason: null },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/jobs/:id/reject
 */
async function rejectJob(req, res, next) {
  try {
    const reason =
      req.body?.reason || "Job rejected by admin due to quality concerns.";

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", rejectionReason: reason },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
}

module.exports = {
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
};
