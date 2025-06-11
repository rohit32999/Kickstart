// Career Confusion Handler System - Advanced refinements for uncertain users
// Handles diverse, unclear, contradictory, or incomplete user profiles

export interface ConfusionAnalysis {
  confusionLevel: 'low' | 'medium' | 'high' | 'extreme';
  contradictions: string[];
  missingElements: string[];
  clarifyingQuestions: string[];
  explorationPath: string[];
  confidenceReduction: number;
}

export interface AdaptiveRecommendation {
  primaryRecommendations: any[];
  explorationRecommendations: any[];
  clarificationSuggestions: string[];
  learningPath: string[];
}

// Detect confusion patterns in user input
export function analyzeCareerConfusion(input: any): ConfusionAnalysis {
  const confusionIndicators = {
    vague: ['confused', 'not sure', 'maybe', 'i think', 'i guess', 'probably', 'unclear', 'lost'],
    contradictory: ['but also', 'however', 'on the other hand', 'mixed feelings', 'torn between'],
    overwhelmed: ['too many options', 'overwhelming', 'don\'t know where to start', 'everything interests me'],
    scattered: ['various', 'different', 'multiple', 'diverse', 'all kinds of', 'many things']
  };

  const userText = `${input.hobbies} ${input.interests} ${input.academicDetails} ${input.keywords || ''}`.toLowerCase();
  
  let confusionScore = 0;
  const contradictions: string[] = [];
  const missingElements: string[] = [];
  
  // Check for vague language
  confusionIndicators.vague.forEach(indicator => {
    if (userText.includes(indicator)) {
      confusionScore += 2;
      contradictions.push(`Vague expression: "${indicator}"`);
    }
  });

  // Check for contradictory statements
  confusionIndicators.contradictory.forEach(indicator => {
    if (userText.includes(indicator)) {
      confusionScore += 3;
      contradictions.push(`Contradictory statement detected: "${indicator}"`);
    }
  });

  // Check for overwhelmed signals
  confusionIndicators.overwhelmed.forEach(indicator => {
    if (userText.includes(indicator)) {
      confusionScore += 4;
      contradictions.push(`Overwhelmed indicator: "${indicator}"`);
    }
  });

  // Check for scattered interests
  confusionIndicators.scattered.forEach(indicator => {
    if (userText.includes(indicator)) {
      confusionScore += 2;
      contradictions.push(`Scattered interests: "${indicator}"`);
    }
  });

  // Check for missing critical information
  if (!input.interests || input.interests.length < 10) {
    missingElements.push('Specific interests are too brief or missing');
    confusionScore += 2;
  }

  if (!input.hobbies || input.hobbies.length < 10) {
    missingElements.push('Detailed hobbies information is missing');
    confusionScore += 1;
  }

  if (!input.personality || Object.values(input.personality || {}).every(v => v === '' || v === 'medium')) {
    missingElements.push('Personality profile is incomplete or generic');
    confusionScore += 2;
  }

  // Determine confusion level
  let confusionLevel: 'low' | 'medium' | 'high' | 'extreme';
  if (confusionScore >= 12) confusionLevel = 'extreme';
  else if (confusionScore >= 8) confusionLevel = 'high';
  else if (confusionScore >= 4) confusionLevel = 'medium';
  else confusionLevel = 'low';

  // Generate clarifying questions based on confusion patterns
  const clarifyingQuestions = generateClarifyingQuestions(contradictions, missingElements);
  
  // Generate exploration path
  const explorationPath = generateExplorationPath(confusionLevel);

  return {
    confusionLevel,
    contradictions,
    missingElements,
    clarifyingQuestions,
    explorationPath,
    confidenceReduction: Math.min(30, confusionScore * 2) // Reduce confidence by up to 30%
  };
}

function generateClarifyingQuestions(contradictions: string[], missingElements: string[]): string[] {
  const questions: string[] = [];

  // Questions based on contradictions
  if (contradictions.some(c => c.includes('Contradictory'))) {
    questions.push("What are your top 3 most important values in a career? (e.g., creativity, stability, helping others)");
    questions.push("If you had to choose just one area to focus on, what would excite you most?");
  }

  // Questions for vague responses
  if (contradictions.some(c => c.includes('Vague'))) {
    questions.push("Can you describe a specific activity or project that made you feel accomplished?");
    questions.push("What type of work environment energizes you? (team-based, independent, creative, analytical)");
  }

  // Questions for overwhelmed users
  if (contradictions.some(c => c.includes('Overwhelmed'))) {
    questions.push("Let's start small - what's one career you've heard about that sounds interesting?");
    questions.push("What matters more to you: job security, high salary, personal fulfillment, or work-life balance?");
  }

  // Questions for missing personality info
  if (missingElements.some(m => m.includes('personality'))) {
    questions.push("Do you prefer working with people, data, ideas, or things?");
    questions.push("Are you more energized by planning/organizing or by improvising/adapting?");
  }

  // Questions for brief interests
  if (missingElements.some(m => m.includes('interests'))) {
    questions.push("What topics do you find yourself reading about or watching videos about in your free time?");
    questions.push("If you could learn any skill without time or money constraints, what would it be?");
  }

  return questions.slice(0, 4); // Limit to 4 most relevant questions
}

function generateExplorationPath(confusionLevel: string): string[] {
  const basePath = [
    "Take a comprehensive career assessment (16Personalities, StrengthsFinder)",
    "Shadow professionals in 2-3 different fields for a day",
    "Try online courses in areas that slightly interest you",
    "Talk to career counselors or mentors in different industries"
  ];

  const advancedPath = [
    "Complete internships or volunteer work in diverse fields",
    "Join professional associations in areas of potential interest",
    "Attend industry conferences or networking events",
    "Consider a gap year for structured career exploration"
  ];

  if (confusionLevel === 'extreme' || confusionLevel === 'high') {
    return [...basePath, ...advancedPath].slice(0, 6);
  } else if (confusionLevel === 'medium') {
    return basePath.slice(0, 4);
  } else {
    return basePath.slice(0, 2);
  }
}

// Enhanced recommendation system for confused users
export function generateAdaptiveRecommendations(
  standardRecommendations: any[],
  confusionAnalysis: ConfusionAnalysis
): AdaptiveRecommendation {
  
  // Reduce confidence scores based on confusion level
  const adjustedPrimary = standardRecommendations.map(rec => ({
    ...rec,
    confidencePercent: Math.max(30, rec.confidencePercent - confusionAnalysis.confidenceReduction),
    adaptationNote: confusionAnalysis.confusionLevel === 'high' || confusionAnalysis.confusionLevel === 'extreme' 
      ? "Confidence adjusted due to profile uncertainty - consider exploration first"
      : undefined
  }));

  // Generate exploration-focused recommendations
  const explorationRecs = [
    {
      title: "Career Discovery Program",
      description: "Structured exploration of multiple career paths through assessments, job shadowing, and informational interviews.",
      category: "Exploration",
      confidencePercent: 85,
      why: "Designed specifically for people who are uncertain about their career direction.",
      nextSteps: confusionAnalysis.explorationPath.slice(0, 3),
      resources: [
        "Career assessment tools (Myers-Briggs, DISC)",
        "Informational interview guides",
        "Job shadowing programs",
        "Career exploration workbooks"
      ]
    },
    {
      title: "Multi-Field Internship Program",
      description: "Gain hands-on experience across different industries to discover your preferences and strengths.",
      category: "Exploration", 
      confidencePercent: 75,
      why: "Practical experience helps clarify interests better than theoretical exploration.",
      nextSteps: [
        "Research internship programs in different fields",
        "Apply to 3-4 diverse internships",
        "Keep a reflection journal during experiences",
        "Network with professionals in each field"
      ]
    },
    {
      title: "Skill-Based Career Exploration",
      description: "Focus on developing transferable skills while exploring how they apply across different careers.",
      category: "Exploration",
      confidencePercent: 80,
      why: "Building skills provides direction while keeping options open.",
      nextSteps: [
        "Identify your natural talents and interests",
        "Take online courses in high-interest skills",
        "Find projects that combine multiple interests",
        "Build a portfolio showcasing diverse abilities"
      ]
    }
  ];

  // Add generalist careers for highly confused users
  if (confusionAnalysis.confusionLevel === 'extreme' || confusionAnalysis.confusionLevel === 'high') {
    explorationRecs.push({
      title: "Business Consultant/Analyst",
      description: "Work across multiple industries and functions, perfect for those with diverse interests.",
      category: "Generalist",
      confidencePercent: 70,
      why: "Consulting exposes you to various fields and allows you to use different skills.",
      nextSteps: [
        "Learn basic business analysis skills",
        "Study different industries and their challenges",
        "Practice problem-solving methodologies",
        "Build communication and presentation skills"
      ]
    });

    explorationRecs.push({
      title: "Project Manager",
      description: "Coordinate complex projects across various domains - adaptable to any industry.",
      category: "Generalist", 
      confidencePercent: 65,
      why: "Project management skills are valuable in every field and provide industry flexibility.",
      nextSteps: [
        "Get certified in project management (PMP, Agile)",
        "Practice managing small projects or events",
        "Learn project management software",
        "Develop leadership and communication skills"
      ]
    });
  }

  return {
    primaryRecommendations: adjustedPrimary,
    explorationRecommendations: explorationRecs,
    clarificationSuggestions: confusionAnalysis.clarifyingQuestions,
    learningPath: confusionAnalysis.explorationPath
  };
}

// Specialized handlers for different types of confusion

export function handleContradictoryInterests(): any[] {
  // When user has conflicting interests (e.g., "I like both science and art")
  const recommendations = [
    {
      title: "Science Communication Specialist",
      description: "Combine scientific knowledge with creative communication skills.",
      confidencePercent: 78,
      why: "Perfect blend of analytical and creative interests."
    },
    {
      title: "UX Research Designer", 
      description: "Use scientific methodology to solve design problems.",
      confidencePercent: 75,
      why: "Combines analytical thinking with creative problem-solving."
    },
    {
      title: "Educational Content Creator",
      description: "Create engaging educational materials combining subject expertise with creativity.",
      confidencePercent: 72,
      why: "Allows expression of both technical knowledge and creative skills."
    }
  ];

  return recommendations;
}

export function handleVagueProfile(): any[] {
  // When user provides very little specific information
  const broad_recommendations = [
    {
      title: "Liberal Arts Education + Internships",
      description: "Pursue broad education while gaining practical experience in various fields.",
      confidencePercent: 70,
      why: "Provides flexibility while you discover your specific interests."
    },
    {
      title: "Rotational Graduate Program",
      description: "Join programs that rotate you through different departments/functions.",
      confidencePercent: 75,
      why: "Structured way to explore different career paths within one organization."
    },
    {
      title: "Freelancing/Gig Economy",
      description: "Take on diverse projects to discover what type of work energizes you.",
      confidencePercent: 65,
      why: "Low-risk way to experiment with different types of work."
    }
  ];

  return broad_recommendations;
}

export function handleOverwhelmedUser(): any[] {
  // When user expresses being overwhelmed by too many options
  const simplified_recommendations = [
    {
      title: "Career Coaching Session",
      description: "Work with a professional to narrow down your options systematically.",
      confidencePercent: 85,
      why: "Professional guidance can help organize your thoughts and priorities."
    },
    {
      title: "Values-Based Career Assessment",
      description: "Start by identifying your core values, then find careers that align.",
      confidencePercent: 80,
      why: "Values provide a clear filter for eliminating unsuitable options."
    },
    {
      title: "One-Month Career Experiments",
      description: "Try one career-related activity per month to gradually narrow your focus.",
      confidencePercent: 75,
      why: "Manageable approach that reduces overwhelm while providing clarity."
    }
  ];

  return simplified_recommendations;
}

// Integration with existing recommendation system
export function integrateConfusionHandling(input: any, standardRecommendations: any[]): any {
  const confusionAnalysis = analyzeCareerConfusion(input);
  
  if (confusionAnalysis.confusionLevel === 'low') {
    // For users with clear direction, return standard recommendations
    return {
      recommendations: standardRecommendations,
      guidance: {
        message: "Your profile shows clear direction. Here are targeted recommendations:",
        nextSteps: ["Research these specific careers in detail", "Connect with professionals in these fields"]
      }
    };
  }
  // For confused users, provide adaptive recommendations
  const adaptiveRecs = generateAdaptiveRecommendations(standardRecommendations, confusionAnalysis);
  
  // Handle special confusion patterns
  let specialRecs: any[] = [];
  
  if (confusionAnalysis.contradictions.some(c => c.includes('Contradictory'))) {
    specialRecs = handleContradictoryInterests();
  } else if (confusionAnalysis.contradictions.some(c => c.includes('Overwhelmed'))) {
    specialRecs = handleOverwhelmedUser();
  } else if (confusionAnalysis.missingElements.length > 2) {
    specialRecs = handleVagueProfile();
  }

  return {
    confusionLevel: confusionAnalysis.confusionLevel,
    primaryRecommendations: adaptiveRecs.primaryRecommendations.slice(0, 3),
    explorationRecommendations: adaptiveRecs.explorationRecommendations,
    specializedRecommendations: specialRecs,
    clarificationQuestions: adaptiveRecs.clarificationSuggestions,
    explorationPath: adaptiveRecs.learningPath,
    guidance: {
      message: getGuidanceMessage(confusionAnalysis.confusionLevel),
      priority: getPriorityActions(confusionAnalysis.confusionLevel),
      timeline: getRecommendedTimeline(confusionAnalysis.confusionLevel)
    }
  };
}

function getGuidanceMessage(confusionLevel: string): string {
  switch (confusionLevel) {
    case 'extreme':
      return "Your profile shows significant uncertainty. That's completely normal! Let's focus on structured exploration and self-discovery first.";
    case 'high':
      return "You seem to have multiple interests but lack clarity on direction. Let's help you narrow down your options systematically.";
    case 'medium':
      return "You have some career direction but could benefit from more specific exploration. Here's a focused approach:";
    default:
      return "Your profile shows good direction. Here are some targeted next steps:";
  }
}

function getPriorityActions(confusionLevel: string): string[] {
  switch (confusionLevel) {
    case 'extreme':
      return [
        "Complete a comprehensive career assessment",
        "Schedule informational interviews in 3 different fields",
        "Consider working with a career counselor"
      ];
    case 'high':
      return [
        "Take career exploration courses",
        "Shadow professionals in fields of interest", 
        "Join relevant professional associations"
      ];
    case 'medium':
      return [
        "Research specific roles in detail",
        "Network with industry professionals",
        "Gain relevant experience through projects"
      ];
    default:
      return [
        "Apply for relevant positions",
        "Build required skills",
        "Expand professional network"
      ];
  }
}

function getRecommendedTimeline(confusionLevel: string): string {
  switch (confusionLevel) {
    case 'extreme':
      return "6-12 months of structured exploration before making major career decisions";
    case 'high':
      return "3-6 months of focused research and experimentation";
    case 'medium':
      return "1-3 months of targeted investigation";
    default:
      return "Ready to take action within 1 month";
  }
}

export default {
  analyzeCareerConfusion,
  generateAdaptiveRecommendations,
  integrateConfusionHandling,
  handleContradictoryInterests,
  handleVagueProfile,
  handleOverwhelmedUser
};
