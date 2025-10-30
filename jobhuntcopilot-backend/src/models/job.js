const { Schema, model } = require("mongoose");

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    skills: [String],
    location: String,
    url: String,
    postedAt: { type: Date, default: Date.now },
    source: { type: String, default: "manual" }
  },
  { timestamps: true }
);

module.exports = model("Job", JobSchema);
