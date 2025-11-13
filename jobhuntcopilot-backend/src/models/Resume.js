const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  userId: { type: String, default: "default-user" }
});

module.exports = mongoose.model("Resume", resumeSchema);
