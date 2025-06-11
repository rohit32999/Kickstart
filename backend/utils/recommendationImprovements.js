// Simple Improvements for Career Recommendation System
// These are easy-to-implement enhancements that can significantly improve personalization

/**
 * 1. USER FEEDBACK LEARNING SYSTEM
 * 
 * Current Implementation: Feedback is collected but not used
 * Simple Improvement: Use feedback to adjust future recommendation weights
 */

// Backend route for processing feedback and adjusting user preferences
router.get("/feedback-adjustment/:userId/:careerTitle", async (req, res) => {
  try {
    const { userId, careerTitle } = req.params;
    
    // Get user's feedback history for this career
    const feedbacks = await Feedback.find({ 
      userId, 
      careerTitle 
    });
    
    if (feedbacks.length === 0) {
      return res.json({ adjustment: 0 });
    }
    
    // Calculate adjustment based on sentiment
    const positiveCount = feedbacks.filter(f => f.sentiment === 'positive').length;
    const negativeCount = feedbacks.filter(f => f.sentiment === 'negative').length;
    const totalCount = feedbacks.length;
    
    // Simple adjustment formula
    const positiveRatio = positiveCount / totalCount;
    const negativeRatio = negativeCount / totalCount;
    
    // Adjustment ranges from -0.3 to +0.3
    const adjustment = (positiveRatio - negativeRatio) * 0.3;
    
    res.json({ adjustment });
  } catch (error) {
    console.error("Error calculating feedback adjustment:", error);
    res.json({ adjustment: 0 });
  }
});

/**
 * 2. ENHANCED INTERESTS MATCHING
 * 
 * Current Implementation: Simple keyword matching
 * Simple Improvement: Weight recent interests more heavily
 */

function getTimeWeightedInterests(userInterests, timeData) {
  // If user has recently searched or shown interest in certain fields,
  // weight those interests more heavily
  
  const currentDate = new Date();
  const weightedInterests = {};
  
  // Parse recent activities (last 30 days get higher weight)
  if (timeData && timeData.recentActivities) {
    timeData.recentActivities.forEach(activity => {
      const daysDiff = (currentDate - new Date(activity.date)) / (1000 * 60 * 60 * 24);
      const weight = daysDiff <= 30 ? 1.5 : 1.0; // Recent activities get 50% boost
      
      if (weightedInterests[activity.category]) {
        weightedInterests[activity.category] += weight;
      } else {
        weightedInterests[activity.category] = weight;
      }
    });
  }
  
  return weightedInterests;
}

/**
 * 3. LOCATION-BASED JOB MARKET INSIGHTS
 * 
 * Current Implementation: Basic location matching
 * Simple Improvement: Include local job market trends
 */

async function getLocationBasedInsights(location, careerTitle) {
  try {
    // Simple implementation using job market data
    const response = await fetch(`https://api.api-ninjas.com/v1/jobs?location=${location}&title=${careerTitle}`, {
      headers: { 'X-Api-Key': 'YOUR_API_KEY' }
    });
    
    if (response.ok) {
      const jobs = await response.json();
      const demandScore = Math.min(jobs.length / 10, 1.0); // Normalize to 0-1
      
      return {
        localDemand: demandScore,
        avgSalary: calculateAverageSalary(jobs),
        topCompanies: getTopCompanies(jobs, 3)
      };
    }
  } catch (err) {
    console.error('Location insights error:', err);
  }
  
  return {
    localDemand: 0.5, // Default moderate demand
    avgSalary: 'N/A',
    topCompanies: []
  };
}

/**
 * 4. SKILL GAP ANALYSIS
 * 
 * Current Implementation: None
 * Simple Improvement: Compare user skills with career requirements
 */

function calculateSkillGap(userSkills, careerRequiredSkills) {
  if (!userSkills || !careerRequiredSkills) return { gap: 0.5, missingSkills: [] };
  
  const userSkillsLower = userSkills.toLowerCase().split(/[\s,]+/);
  const requiredSkillsLower = careerRequiredSkills.map(skill => skill.toLowerCase());
  
  const matchingSkills = requiredSkillsLower.filter(skill => 
    userSkillsLower.some(userSkill => 
      userSkill.includes(skill) || skill.includes(userSkill)
    )
  );
  
  const skillMatchRatio = matchingSkills.length / requiredSkillsLower.length;
  const missingSkills = careerRequiredSkills.filter(skill => 
    !matchingSkills.includes(skill.toLowerCase())
  );
  
  return {
    gap: 1 - skillMatchRatio, // 0 = no gap, 1 = complete gap
    missingSkills: missingSkills.slice(0, 5), // Top 5 missing skills
    matchingSkills: matchingSkills.length
  };
}

/**
 * 5. DYNAMIC CONFIDENCE SCORING
 * 
 * Current Implementation: Static confidence calculation
 * Simple Improvement: Adjust confidence based on multiple factors
 */

function calculateDynamicConfidence(baseScore, adjustmentFactors) {
  let confidence = baseScore;
  
  // Factor 1: User feedback history (from database)
  confidence += adjustmentFactors.feedbackAdjustment || 0;
  
  // Factor 2: Local job market demand
  confidence += (adjustmentFactors.localDemand || 0.5) * 0.1;
  
  // Factor 3: Skill gap (lower gap = higher confidence)
  confidence += (1 - (adjustmentFactors.skillGap || 0.5)) * 0.1;
  
  // Factor 4: Profile completeness
  confidence += adjustmentFactors.profileCompleteness * 0.05;
  
  // Ensure confidence stays within 0-100 range
  return Math.max(10, Math.min(100, Math.round(confidence * 100)));
}

/**
 * 6. PERSONALITY TRAIT LEARNING
 * 
 * Current Implementation: Static personality weights
 * Simple Improvement: Learn from successful career matches
 */

async function getAdaptivePersonalityWeights(careerTitle) {
  try {
    // Query successful career matches from database
    const successfulMatches = await getUsersByCareer(careerTitle);
    
    if (successfulMatches.length < 5) {
      return getDefaultPersonalityWeights(careerTitle);
    }
    
    // Analyze personality patterns in successful matches
    const traitAnalysis = analyzePersonalityTraits(successfulMatches);
    
    return {
      introvertExtrovert: traitAnalysis.introvertExtrovert,
      leadership: traitAnalysis.leadership,
      creativity: traitAnalysis.creativity,
      riskTolerance: traitAnalysis.riskTolerance,
      communication: traitAnalysis.communication
    };
  } catch (err) {
    return getDefaultPersonalityWeights(careerTitle);
  }
}

module.exports = {
  getTimeWeightedInterests,
  getLocationBasedInsights,
  calculateSkillGap,
  calculateDynamicConfidence,
  getAdaptivePersonalityWeights
};
