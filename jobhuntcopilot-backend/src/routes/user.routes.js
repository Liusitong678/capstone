const express = require("express");
const router = express.Router();
const { setUserRole } = require("../controller/user.controller");
const verifyFirebaseToken = require("../middleware/auth");



console.log("Loaded setUserRole:", setUserRole);
console.log("verifyFirebaseToken:", verifyFirebaseToken);

router.post("/make-me-admin", async (req, res) => {
  const adminAuth = require("../firebase/firebaseAdmin").adminAuth;

  const { uid } = req.body; // Your Firebase UID

  if (!uid) return res.status(400).json({ message: "Missing uid" });

  try {
    await adminAuth.setCustomUserClaims(uid, { role: "admin" });
    return res.json({ message: "You are now ADMIN" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed", error: err.message });
  }
});


// Allow only authenticated admins to update roles
router.post("/set-role", verifyFirebaseToken, async (req, res) => {
  try {
    const { role: userRole } = req.user;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Only admins can set roles" });
    }

    return setUserRole(req, res);

  } catch (err) {
    console.error("Role route error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
