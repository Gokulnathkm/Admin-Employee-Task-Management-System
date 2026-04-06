const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "employee" },
  isApproved: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);
