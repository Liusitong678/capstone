const admin = require("firebase-admin");
const path = require("path");

// Load service account
const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));

// Initialize app ONCE
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminAuth = admin.auth();   // ✔ admin.auth() is valid ONLY here

module.exports = {
  admin,
  adminAuth,
};
