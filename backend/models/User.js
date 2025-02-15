const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile-related fields
    profilePic: { type: String, default: "/default-avatar.png" },
    college: { type: String, default: "" },
    branch: { type: String, default: "" },
    year: { type: String, default: "" },
    enrollment: { type: String, default: "" },
    resume: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    phone: { type: String, default: "" },
    projects: { type: String, default: "" },
    internships: { type: String, default: "" },
    certifications: { type: String, default: "" },
    achievements: { type: String, default: "" },
    interests: { type: String, default: "" },
    hobbies: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
