const { adminAuth } = require("../firebase/firebaseAdmin");
const User = require("../models/User");

async function verifyFirebaseToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const token = header.replace("Bearer ", "").trim();

  try {
    // Verify Firebase ID Token
    const decoded = await adminAuth.verifyIdToken(token);

    // Check if user exists in MongoDB
    let mongoUser = await User.findOne({ firebaseUid: decoded.uid });

    // Auto-create profile if not found
    if (!mongoUser) {
      mongoUser = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email || "",
        firstName: decoded.name?.split(" ")[0] || "New",
        lastName: decoded.name?.split(" ")[1] || "User",
        role: decoded.role || "free",
      });
      console.log("Auto-created Mongo user:", mongoUser.email);
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role || "free"
    };

    next();
  } catch (err) {
    console.error("Firebase Auth Error:", err);
    return res.status(401).json({ message: "Invalid Firebase token" });
  }
}

module.exports = verifyFirebaseToken;
