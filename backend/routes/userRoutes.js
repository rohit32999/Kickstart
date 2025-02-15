const express = require("express");
const User = require("../models/User");
const upload = require("../middleware/upload");
const router = express.Router();

// Update user profile
router.put(
  "/update",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { email, ...otherFields } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required for profile update" });
      }

      let updateData = { ...otherFields };

      // If files are uploaded, update paths
      if (req.files && req.files.profilePic) {
        updateData.profilePic = `/uploads/profile_pics/${req.files.profilePic[0].filename}`;
      }
      if (req.files && req.files.resume) {
        updateData.resume = `/uploads/resumes/${req.files.resume[0].filename}`;
      }

      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;
