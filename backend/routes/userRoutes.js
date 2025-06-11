const express = require("express");
const User = require("../models/User");
const upload = require("../middleware/upload");
const Feedback = require('../models/FeedbackModel');
const router = express.Router();

// Update user profile
router.put(
  "/update",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log(req.body);
    try {
      const { email, ...otherFields } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      let updateData = { ...otherFields };

      if (req.files?.profilePic) {
        updateData.profilePic = `/uploads/profile_pics/${req.files.profilePic[0].filename}`;
      }
      if (req.files?.resume) {
        updateData.resume = `/uploads/resumes/${req.files.resume[0].filename}`;
      }

      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// Submit EI/IQ Form and Calculate Score
router.post("/submit-score", async (req, res) => {
  try {
    const { email, answers, type } = req.body;
    if (!email || !answers || !type) {
      return res.status(400).json({ message: "Email, answers, and type are required" });
    }

    // Example scoring algorithm (replace with your own logic)
    let score = 0;
    if (Array.isArray(answers)) {
      score = answers.reduce((acc, val) => acc + Number(val), 0);
    }

    // Update user with the calculated score
    const updateField =
      type === "emotionalIntelligence"
        ? { emotionalIntelligenceScore: score }
        : { intelligenceQuotientScore: score };

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateField },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Score submitted successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error submitting score:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// --- Dynamic IQ Questions Endpoint ---
const IQ_QUESTIONS = require("../models/IQQuestions").default;

// Returns a randomized set of IQ questions
router.get("/iq-questions", (req, res) => {
  const numQuestions = parseInt(req.query.count) || 12;
  // Shuffle and pick random questions, ensuring uniqueness by question text
  const uniqueQuestions = Array.from(
    new Map(IQ_QUESTIONS.map(q => [q.question, q])).values()
  );
  const shuffled = uniqueQuestions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, numQuestions).map(q => ({
    question: q.question,
    options: q.options
  })); // Do not send the answer
  res.json({ questions: selected });
});

// Collect user feedback for career recommendations
router.post("/feedback", async (req, res) => {
  try {
    const { userId, careerTitle, feedback, rating, userProfile } = req.body;
    
    if (!careerTitle || !feedback) {
      return res.status(400).json({ message: "Career title and feedback are required" });
    }

    // Simple sentiment analysis (can be enhanced with external libraries)
    const sentiment = feedback.toLowerCase().includes('good') || 
                     feedback.toLowerCase().includes('great') || 
                     feedback.toLowerCase().includes('excellent') ? 'positive' :
                     feedback.toLowerCase().includes('bad') || 
                     feedback.toLowerCase().includes('poor') || 
                     feedback.toLowerCase().includes('wrong') ? 'negative' : 'neutral';

    const feedbackRecord = new Feedback({
      userId,
      careerTitle,
      feedback,
      sentiment,
      rating,
      userProfile,
      timestamp: new Date()
    });

    await feedbackRecord.save();

    res.json({
      message: "Feedback saved successfully",
      feedbackId: feedbackRecord._id
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get feedback-based adjustment for career recommendations
router.get("/feedback-adjustment/:userId/:careerTitle", async (req, res) => {
  try {
    const { userId, careerTitle } = req.params;
    
    // For now, return a simple adjustment
    // This would be enhanced with actual feedback data
    const feedbackAdjustment = 0; // Placeholder
    
    res.json({ adjustment: feedbackAdjustment });
  } catch (error) {
    console.error("Error calculating feedback adjustment:", error);
    res.json({ adjustment: 0 });
  }
});

module.exports = router;
