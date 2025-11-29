const { adminAuth } = require("../firebase/firebaseAdmin");

async function verifyFirebaseToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const token = header.replace("Bearer ", "").trim();

  try {
    // Verify Firebase ID Token
    const decoded = await adminAuth.verifyIdToken(token);

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


function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
}

module.exports = { verifyFirebaseToken, requireAdmin };
