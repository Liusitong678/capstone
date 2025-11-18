const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email:       { type: String, required: true },
    firstName:   { type: String, required: true },
    lastName:    { type: String, required: true },
    role:        { type: String, default: "free" },
    resumeUrl:   { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
