const { adminAuth } = require("../firebase/firebaseAdmin");

exports.setUserRole = async (req, res) => {
  try {
    const { uid, role } = req.body;

    if (!uid || !role) {
      return res.status(400).json({ message: "UID and role required" });
    }

    await adminAuth.setCustomUserClaims(uid, { role });

    return res.json({
      message: "Role updated successfully",
      role,
    });

  } catch (err) {
    console.error("setUserRole error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
