const mongoose = require('mongoose');

const SavedJobSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // 先用 demo-user
    jobId: { type: String, required: true },               // 对应 jobs 集合里的 _id / id
    // 冗余字段（可选）
    title: String,
    company: String,
    location: String,
    url: String, // 或 applyUrl
    source: String,
    skills: [String],
    postedAt: Date,
  },
  { timestamps: true }
);

// 同一用户同一职位只能收藏一次
SavedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('SavedJob', SavedJobSchema);
