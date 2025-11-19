const express = require("express");
const router = express.Router();

const {
  createProfile,
  getProfile,
  updateProfile,
  setUserRole
} = require("../controller/user.controller");

const verifyFirebaseToken = require("../middleware/auth");

// For debugging in console
console.log("Loaded controller methods:", {
  createProfile,
  getProfile,
  updateProfile,
  setUserRole
});
console.log("verifyFirebaseToken:", verifyFirebaseToken);


// DEVELOPMENT ONLY – make admin
router.post("/make-me-admin", async (req, res) => {
  const { adminAuth } = require("../firebase/firebaseAdmin");
  const { uid } = req.body;

  if (!uid) return res.status(400).json({ message: "Missing uid" });

  try {
    await adminAuth.setCustomUserClaims(uid, { role: "admin" });
    return res.json({ message: "You are now ADMIN" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed", error: err.message });
  }
});


// CREATE PROFILE  (POST /api/users/create-profile)
router.post("/create-profile", verifyFirebaseToken, createProfile);


// GET PROFILE (GET /api/users/me)
router.get("/me", verifyFirebaseToken, getProfile);


// UPDATE PROFILE (PATCH /api/users/update)
router.patch("/update", verifyFirebaseToken, updateProfile);


// SET ROLE (ADMIN ONLY)
router.post("/set-role", verifyFirebaseToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can set roles" });
    }

    return setUserRole(req, res);

  } catch (err) {
    console.error("Role route error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
