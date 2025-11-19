const { OpenAI } = require("openai");
const User = require("../models/User");

// Middleware ensures req.user contains Firebase UID
exports.generateCoverLetter = async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    const uid = req.user.uid;

    if (!jobTitle || !jobDescription) {
      return res.status(400).json({ error: "Missing job title or description" });
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

    const prompt = `
Write a professional and personalized cover letter for the job below.

Job title: ${jobTitle}
Job description: ${jobDescription}

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
