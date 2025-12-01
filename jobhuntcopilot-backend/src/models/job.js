const { Schema, model } = require("mongoose");

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    skills: [String],
    location: String,
    url: String,

    // When the job was posted (job board date)
    postedAt: { type: Date, default: Date.now },

    /**
     * Where this job came from:
     * - "scraped" / "JSearch" / "manual" → existing flows
     * - "user" → community/user-submitted
     */
    source: { type: String, default: "manual" },

    /**
     * Moderation status for user-submitted jobs
     * - "pending"  → waiting for admin approval
     * - "approved" → visible in public feed
     * - "rejected" → hidden from public
     *
     * For old jobs with no status, we treat them as approved.
     */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    // Who posted the job (Firebase UID + email)
    postedBy: { type: String, default: null }, // firebase UID
    postedByEmail: { type: String, default: null },

    // Optional admin rejection reason
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = model("Job", JobSchema);
