const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: String,
  password: String,
  name: String,
  profilePic: String,
  college: String,
  branch: String,
  year: String,
  enrollment: String,
  resume: String,
  bio: String,
  skills: String,
  github: String,
  linkedin: String,
  portfolio: String,
  phone: String,
  projects: String,
  internships: String,
  certifications: String,
  achievements: String,
  interests: String,
  hobbies: String,
  emotionalIntelligenceScore: { type: Number, default: null },
  intelligenceQuotientScore: { type: Number, default: null },
});

module.exports = mongoose.model("User", UserSchema);
