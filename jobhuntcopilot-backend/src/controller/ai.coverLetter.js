const { OpenAI } = require("openai");
const User = require("../models/User");

// Middleware ensures req.user contains Firebase UID
exports.generateCoverLetter = async (req, res) => {
  try {
    const { job } = req.body;  // receive the full job object
    const uid = req.user.uid;

    if (!job || !job.title || !job.description) {
      return res.status(400).json({ error: "Missing job information" });
    }

    // Fetch user profile from MongoDB
    const profile = await User.findOne({ firebaseUid: uid }).lean();
    if (!profile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Only include fields you actually have
    const name = profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : "";
    const email = profile.email || "";
    const skills = Array.isArray(profile.skills) ? profile.skills.join(", ") : "";

    // Build the prompt using full job object
    const prompt = `
Write a professional and personalized cover letter for the job below.

Job title: ${job.title}
Job description: ${job.description}
Company: ${job.company || ""}
Location: ${job.location || ""}
Level: ${job.level || ""}
Skills required: ${Array.isArray(job.skills) ? job.skills.join(", ") : ""}

Applicant:
${name ? `- Name: ${name}` : ""}
${email ? `- Email: ${email}` : ""}
${skills ? `- Skills: ${skills}` : ""}

Keep it concise (200-250 words), professional tone.
    `;

    const client = new OpenAI({
      apiKey: process.env.HF_API_KEY,
      baseURL: "https://router.huggingface.co/v1"
    });

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:groq",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message || "Failed to generate text";
    res.json({ text });

  } catch (err) {
    console.error("❌ AI Cover Letter Error:", err);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
};
