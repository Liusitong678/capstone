const supabase = require("../config/supabase");
const Resume = require("../models/Resume");

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileExt = req.file.originalname.split(".").pop();
    const fileName = `resume-${Date.now()}.${fileExt}`;

    // Upload to Supabase
    const { data, error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      return res.status(500).json({ message: "Supabase upload failed", uploadError });
    }

    // Generate Public URL
    const publicUrl = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(fileName).data.publicUrl;

    // Save metadata
    const resume = await Resume.create({
      fileName: req.file.originalname,
      fileUrl: publicUrl,
      userId: "default-user"
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getLatestResume = async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ uploadedAt: -1 });

    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }

    res.status(200).json({ resume });
  } catch (err) {
    console.error("Fetch resume error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
