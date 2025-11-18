const supabase = require("../config/supabase");
const User = require("../models/User");

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

    // update user with resume URL
    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { resumeUrl: publicUrl },
      { new: true }
    );

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resumeUrl: updatedUser.resumeUrl,
    });

  } catch (err) {
    console.error("Upload Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
