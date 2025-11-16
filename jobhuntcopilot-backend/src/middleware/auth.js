const { adminAuth } = require("../firebase/firebaseAdmin");


async function verifyFirebaseToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const token = header.replace("Bearer ", "").trim();

  try {
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

module.exports = verifyFirebaseToken;
