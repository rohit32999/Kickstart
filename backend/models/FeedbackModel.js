const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  careerTitle: {
    type: String,
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  userProfile: {
    iqScore: Number,
    interests: String,
    hobbies: String,
    academicDetails: String,
    personality: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
