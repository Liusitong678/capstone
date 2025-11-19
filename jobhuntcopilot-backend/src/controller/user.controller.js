const User = require("../models/User");
const { adminAuth } = require("../firebase/firebaseAdmin");


// CREATE PROFILE (signup)
exports.createProfile = async (req, res) => {
  try {
    const { uid, email } = req.user; // from Firebase Auth middleware
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if already exists
    let existing = await User.findOne({ firebaseUid: uid });
    if (existing) {
      return res.json({ message: "Profile already exists", user: existing });
    }

    const newUser = await User.create({
      firebaseUid: uid,
      email,
      firstName,
      lastName,
      role: req.user.role || "free",
    });

    return res.json({
      message: "Profile created successfully",
      user: newUser,
    });

  } catch (err) {
    console.error("createProfile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// FETCH PROFILE
exports.getProfile = async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ firebaseUid: uid });

    if (!user) return res.status(404).json({ message: "Profile not found" });

    return res.json({ user });

  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const updateData = req.body;

    const updated = await User.findOneAndUpdate(
      { firebaseUid: uid },
      updateData,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Profile not found" });

    return res.json({
      message: "Profile updated",
      user: updated,
    });

  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// --------------------------------------
// SET ROLE (requires ADMIN permissions)
// --------------------------------------
exports.setUserRole = async (req, res) => {
  try {
    const { uid, role } = req.body;

    if (!uid || !role) {
      return res.status(400).json({ message: "UID and role required" });
    }

    // Update Firebase custom claim
    await adminAuth.setCustomUserClaims(uid, { role });

    // Also update local MongoDB profile
    await User.findOneAndUpdate(
      { firebaseUid: uid },
      { role },
      { new: true }
    );

    return res.json({
      message: "Role updated successfully",
      role,
    });

  } catch (err) {
    console.error("setUserRole error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
