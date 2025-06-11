// Advanced Career Confusion Handler - Comprehensive System for Complex User Scenarios
// Handles extremely diverse interests, contradictory profiles, analysis paralysis, cultural conflicts, and unique situations

export interface AdvancedConfusionAnalysis {
  level: 'low' | 'medium' | 'high' | 'extreme' | 'complex' | 'paralyzed';
  primaryPatterns: {
    contradictoryInterests: boolean;
    vagueLanguage: boolean;
    overwhelmedSignals: boolean;
    scatteredInterests: boolean;
    analysisParalysis: boolean;
    uniqueScenarios: boolean;
  };
  psychologicalFactors: {
    perfectionism: boolean;
    imposterSyndrome: boolean;
    externalPressure: boolean;
    culturalConflicts: boolean;
    fearOfCommitment: boolean;
    comparisonAnxiety: boolean;
  };
  contextualChallenges: {
    economicConstraints: boolean;
    familyExpectations: boolean;
    geographicLimitations: boolean;
    timeConstraints: boolean;
    educationalGaps: boolean;
    marketUncertainty: boolean;
  };
  interventionStrategies: string[];
  therapeuticApproaches: string[];
  confidenceImpact: number;
}

export interface AdvancedAdaptiveRecommendation {
  title: string;
  description: string;
  confidencePercent: number;
  why: string;
  adaptationNote?: string;
  category?: string;
  nextSteps?: string[];
  resources?: string[];
  therapeuticApproach?: boolean;
  explorationFocus?: boolean;
  timelineFlexible?: boolean;
  psychologicalSupport?: string[];
  culturalConsiderations?: string[];
  economicRealistic?: boolean;
}

export interface ComprehensiveCareerResponse {
  primaryRecommendations: AdvancedAdaptiveRecommendation[];
  explorationRecommendations: AdvancedAdaptiveRecommendation[];
  therapeuticRecommendations: AdvancedAdaptiveRecommendation[];
  clarificationQuestions: string[];
  explorationPath: string[];
  psychologicalSupport: string[];
  culturalAdaptations: string[];
  economicRealities: string[];
  guidance: {
    message: string;
    priority: string[];
    timeline: string;
    supportSystems: string[];
    warningFlags: string[];
  };
}

// Advanced confusion detection with psychological and contextual awareness
export function analyzeAdvancedCareerConfusion(input: any): AdvancedConfusionAnalysis {
  const confusionIndicators = {
    vague: ['confused', 'not sure', 'maybe', 'i think', 'i guess', 'probably', 'unclear', 'lost', 'uncertain', 'unsure'],
    contradictory: ['but also', 'however', 'on the other hand', 'mixed feelings', 'torn between', 'conflicted', 'both', 'either or'],
    overwhelmed: ['too many options', 'overwhelming', 'don\'t know where to start', 'everything interests me', 'paralyzed', 'stuck'],
    scattered: ['various', 'different', 'multiple', 'diverse', 'all kinds of', 'many things', 'everything', 'anything'],
    perfectionist: ['perfect job', 'ideal career', 'best option', 'right choice', 'perfect fit', 'flawless', 'no mistakes'],
    imposter: ['not qualified', 'not smart enough', 'not good enough', 'others are better', 'don\'t deserve', 'fraud'],
    pressure: ['family wants', 'expected to', 'should become', 'pressure to', 'parents expect', 'society expects'],
    cultural: ['traditional', 'cultural expectations', 'family tradition', 'not acceptable', 'against culture'],
    economic: ['can\'t afford', 'need money', 'financial pressure', 'expensive', 'poor family', 'need income'],
    fear: ['afraid to choose', 'what if wrong', 'scared of commitment', 'fear of failure', 'regret', 'trapped']
  };

  const userText = `${input.hobbies || ''} ${input.interests || ''} ${input.academicDetails || ''} ${input.keywords || ''} ${input.additionalInfo || ''}`.toLowerCase();
  
  let confusionScore = 0;
  const patterns = {
    contradictoryInterests: false,
    vagueLanguage: false,
    overwhelmedSignals: false,
    scatteredInterests: false,
    analysisParalysis: false,
    uniqueScenarios: false
  };

  const psychologicalFactors = {
    perfectionism: false,
    imposterSyndrome: false,
    externalPressure: false,
    culturalConflicts: false,
    fearOfCommitment: false,
    comparisonAnxiety: false
  };

  const contextualChallenges = {
    economicConstraints: false,
    familyExpectations: false,
    geographicLimitations: false,
    timeConstraints: false,
    educationalGaps: false,
    marketUncertainty: false
  };

  // Analyze primary confusion patterns
  Object.entries(confusionIndicators).forEach(([category, indicators]) => {
    indicators.forEach(indicator => {
      if (userText.includes(indicator)) {
        confusionScore += getIndicatorWeight(category);
        
        switch (category) {
          case 'vague':
            patterns.vagueLanguage = true;
            break;
          case 'contradictory':
            patterns.contradictoryInterests = true;
            break;
          case 'overwhelmed':
            patterns.overwhelmedSignals = true;
            break;
          case 'scattered':
            patterns.scatteredInterests = true;
            break;
          case 'perfectionist':
            psychologicalFactors.perfectionism = true;
            break;
          case 'imposter':
            psychologicalFactors.imposterSyndrome = true;
            break;
          case 'pressure':
            psychologicalFactors.externalPressure = true;
            break;
          case 'cultural':
            psychologicalFactors.culturalConflicts = true;
            break;
          case 'economic':
            contextualChallenges.economicConstraints = true;
            break;
          case 'fear':
            psychologicalFactors.fearOfCommitment = true;
            break;
        }
      }
    });
  });

  // Additional pattern detection
  if (userText.includes('analysis paralysis') || (patterns.overwhelmedSignals && patterns.scatteredInterests)) {
    patterns.analysisParalysis = true;
    confusionScore += 5;
  }

  if (userText.includes('unique situation') || userText.includes('complicated') || userText.includes('complex background')) {
    patterns.uniqueScenarios = true;
    confusionScore += 3;
  }

  // Detect comparison anxiety
  if (userText.includes('everyone else') || userText.includes('my friends') || userText.includes('others have')) {
    psychologicalFactors.comparisonAnxiety = true;
    confusionScore += 3;
  }

  // Detect family expectations
  if (userText.includes('family business') || userText.includes('parents want') || userText.includes('family expects')) {
    contextualChallenges.familyExpectations = true;
    confusionScore += 4;
  }

  // Determine confusion level with new categories
  let level: AdvancedConfusionAnalysis['level'];
  if (confusionScore >= 20) level = 'paralyzed';
  else if (confusionScore >= 16) level = 'complex';
  else if (confusionScore >= 12) level = 'extreme';
  else if (confusionScore >= 8) level = 'high';
  else if (confusionScore >= 4) level = 'medium';
  else level = 'low';

  // Generate intervention strategies
  const interventionStrategies = generateInterventionStrategies(patterns, psychologicalFactors, contextualChallenges);
  const therapeuticApproaches = generateTherapeuticApproaches(psychologicalFactors, level);

  return {
    level,
    primaryPatterns: patterns,
    psychologicalFactors,
    contextualChallenges,
    interventionStrategies,
    therapeuticApproaches,
    confidenceImpact: Math.min(50, confusionScore * 2)
  };
}

function getIndicatorWeight(category: string): number {
  const weights: Record<string, number> = {
    vague: 2,
    contradictory: 3,
    overwhelmed: 4,
    scattered: 2,
    perfectionist: 4,
    imposter: 5,
    pressure: 3,
    cultural: 4,
    economic: 3,
    fear: 4
  };
  return weights[category] || 1;
}

function generateInterventionStrategies(
  patterns: any,
  psychological: any,
  contextual: any
): string[] {
  const strategies: string[] = [];

  if (patterns.analysisParalysis) {
    strategies.push('Implement decision-making frameworks with time limits');
    strategies.push('Use the "good enough" principle rather than seeking perfection');
  }

  if (patterns.contradictoryInterests) {
    strategies.push('Explore hybrid careers that combine multiple interests');
    strategies.push('Consider roles that allow for career pivoting or multiple skill use');
  }

  if (psychological.perfectionism) {
    strategies.push('Practice accepting "good enough" career decisions');
    strategies.push('Focus on growth mindset rather than fixed outcomes');
  }

  if (psychological.imposterSyndrome) {
    strategies.push('Document achievements and skills to build confidence');
    strategies.push('Connect with mentors who can provide realistic feedback');
  }

  if (contextual.economicConstraints) {
    strategies.push('Prioritize careers with strong entry-level opportunities');
    strategies.push('Explore scholarship, apprenticeship, and paid training programs');
  }

  if (psychological.culturalConflicts) {
    strategies.push('Find careers that honor cultural values while pursuing personal interests');
    strategies.push('Engage family in understanding modern career opportunities');
  }

  return strategies;
}

function generateTherapeuticApproaches(psychological: any, level: string): string[] {
  const approaches: string[] = [];

  if (psychological.imposterSyndrome || psychological.perfectionism) {
    approaches.push('Cognitive Behavioral Therapy (CBT) techniques for self-doubt');
    approaches.push('Mindfulness practices for anxiety management');
  }

  if (psychological.externalPressure || psychological.culturalConflicts) {
    approaches.push('Family therapy or mediation for career discussions');
    approaches.push('Values clarification exercises');
  }

  if (level === 'paralyzed' || level === 'complex') {
    approaches.push('Professional career counseling with therapeutic support');
    approaches.push('Structured decision-making therapy');
  }

  if (psychological.comparisonAnxiety) {
    approaches.push('Social media detox and comparison reduction strategies');
    approaches.push('Focus on personal journey rather than external benchmarks');
  }

  return approaches;
}

// Generate comprehensive recommendations for complex scenarios
export function generateAdvancedAdaptiveRecommendations(
  standardRecommendations: any[],
  confusionAnalysis: AdvancedConfusionAnalysis
): ComprehensiveCareerResponse {
  
  // Adjust primary recommendations based on confusion level
  const adjustedPrimary: AdvancedAdaptiveRecommendation[] = standardRecommendations.map(rec => ({
    ...rec,
    confidencePercent: Math.max(25, rec.confidencePercent - confusionAnalysis.confidenceImpact),
    adaptationNote: getAdaptationNote(confusionAnalysis.level),
    psychologicalSupport: confusionAnalysis.therapeuticApproaches.slice(0, 2),
    economicRealistic: !confusionAnalysis.contextualChallenges.economicConstraints,
    timelineFlexible: confusionAnalysis.level === 'extreme' || confusionAnalysis.level === 'paralyzed'
  }));
  // Generate exploration recommendations
  const explorationRecs = generateExplorationRecommendations(confusionAnalysis);
  
  // Generate therapeutic recommendations for severe cases
  const therapeuticRecs = generateTherapeuticRecommendations(confusionAnalysis);

  // Generate clarification questions
  const clarificationQuestions = generateAdvancedClarificationQuestions(confusionAnalysis);

  // Generate psychological support recommendations
  const psychologicalSupport = generatePsychologicalSupport(confusionAnalysis);
  // Generate cultural adaptations
  const culturalAdaptations = generateCulturalAdaptations(confusionAnalysis);

  // Generate economic reality checks
  const economicRealities = generateEconomicRealities(confusionAnalysis);

  return {
    primaryRecommendations: adjustedPrimary.slice(0, 3),
    explorationRecommendations: explorationRecs,
    therapeuticRecommendations: therapeuticRecs,
    clarificationQuestions,
    explorationPath: confusionAnalysis.interventionStrategies,
    psychologicalSupport,
    culturalAdaptations,
    economicRealities,
    guidance: {
      message: getAdvancedGuidanceMessage(confusionAnalysis),
      priority: getAdvancedPriorityActions(confusionAnalysis),
      timeline: getAdvancedTimeline(confusionAnalysis),
      supportSystems: getSupportSystems(confusionAnalysis),
      warningFlags: getWarningFlags(confusionAnalysis)
    }
  };
}

function getAdaptationNote(level: string): string {
  switch (level) {
    case 'paralyzed':
      return "Confidence severely reduced due to decision paralysis - therapeutic support recommended";
    case 'complex':
      return "Complex scenario detected - multiple intervention strategies needed";
    case 'extreme':
      return "High uncertainty detected - structured exploration strongly recommended";
    default:
      return "Some uncertainty present - consider additional exploration";
  }
}

function generateExplorationRecommendations(
  confusionAnalysis: AdvancedConfusionAnalysis
): AdvancedAdaptiveRecommendation[] {
  const recs: AdvancedAdaptiveRecommendation[] = [];

  if (confusionAnalysis.primaryPatterns.analysisParalysis) {
    recs.push({
      title: "Decision-Making Bootcamp",
      description: "Structured program to overcome analysis paralysis and make confident career decisions.",
      confidencePercent: 85,
      why: "Specifically designed for people who struggle with too many options.",
      therapeuticApproach: true,
      nextSteps: [
        "Enroll in decision-making workshops",
        "Practice time-limited career research",
        "Use elimination techniques to narrow options",
        "Set decision deadlines with accountability"
      ],
      psychologicalSupport: ["Decision fatigue management", "Cognitive restructuring for perfectionism"]
    });
  }

  if (confusionAnalysis.psychologicalFactors.culturalConflicts) {
    recs.push({
      title: "Cultural Bridge Career Program",
      description: "Find careers that honor your cultural background while pursuing personal fulfillment.",
      confidencePercent: 80,
      why: "Designed for individuals navigating cultural expectations and personal interests.",
      culturalConsiderations: ["Family involvement in career planning", "Cultural values integration"],
      nextSteps: [
        "Research successful professionals from similar backgrounds",
        "Engage family in career education discussions",
        "Find mentors who've navigated similar cultural challenges",
        "Explore careers that integrate cultural heritage"
      ]
    });
  }

  if (confusionAnalysis.contextualChallenges.economicConstraints) {
    recs.push({
      title: "Economic Opportunity Career Track",
      description: "Focus on careers with strong earning potential and accessible entry paths.",
      confidencePercent: 88,
      why: "Prioritizes economic stability while building toward long-term career satisfaction.",
      economicRealistic: true,
      nextSteps: [
        "Research high-ROI education and training programs",
        "Explore apprenticeships and paid training opportunities",
        "Focus on skills with immediate market value",
        "Plan staged career progression for financial stability"
      ]
    });
  }

  return recs;
}

function generateTherapeuticRecommendations(
  confusionAnalysis: AdvancedConfusionAnalysis
): AdvancedAdaptiveRecommendation[] {
  const recs: AdvancedAdaptiveRecommendation[] = [];

  if (confusionAnalysis.level === 'paralyzed' || confusionAnalysis.psychologicalFactors.imposterSyndrome) {
    recs.push({
      title: "Career Therapy Program",
      description: "Professional counseling focused on career decision-making and self-confidence building.",
      confidencePercent: 90,
      why: "Addresses underlying psychological barriers to career decision-making.",
      therapeuticApproach: true,
      nextSteps: [
        "Find a licensed career counselor or therapist",
        "Participate in cognitive behavioral therapy sessions",
        "Practice exposure therapy for career fears",
        "Build confidence through small achievements"
      ]
    });
  }

  if (confusionAnalysis.psychologicalFactors.perfectionism) {
    recs.push({
      title: "Perfectionism Recovery for Career Success",
      description: "Learn to make 'good enough' career decisions and embrace growth over perfection.",
      confidencePercent: 85,
      why: "Perfectionism often prevents any career decision - this addresses the root cause.",
      therapeuticApproach: true,
      nextSteps: [
        "Practice 'good enough' decision-making in low-stakes situations",
        "Set time limits for career research and planning",
        "Reframe career as an evolving journey, not a fixed destination",
        "Celebrate progress over perfection"
      ]
    });
  }

  return recs;
}

function generateAdvancedClarificationQuestions(
  confusionAnalysis: AdvancedConfusionAnalysis
): string[] {
  const questions: string[] = [];

  if (confusionAnalysis.psychologicalFactors.perfectionism) {
    questions.push("If you knew you couldn't fail, what career would you try first?");
    questions.push("What would a 'good enough' career look like for you right now?");
  }

  if (confusionAnalysis.psychologicalFactors.externalPressure) {
    questions.push("What career would you choose if family/social expectations didn't exist?");
    questions.push("How can you honor both your personal interests and important relationships?");
  }

  if (confusionAnalysis.contextualChallenges.economicConstraints) {
    questions.push("What's the minimum financial stability you need to feel secure?");
    questions.push("Which careers offer the best balance of personal interest and economic opportunity?");
  }

  if (confusionAnalysis.primaryPatterns.analysisParalysis) {
    questions.push("If you had to choose a career path today, what would your gut instinct tell you?");
    questions.push("What's the worst that could realistically happen if you made the 'wrong' choice?");
  }

  if (confusionAnalysis.psychologicalFactors.comparisonAnxiety) {
    questions.push("What career path would make YOU personally fulfilled, regardless of others?");
    questions.push("How would you define success for yourself, independent of social media or peer achievements?");
  }

  return questions.slice(0, 4);
}

function generatePsychologicalSupport(confusionAnalysis: AdvancedConfusionAnalysis): string[] {
  const support: string[] = [];

  if (confusionAnalysis.psychologicalFactors.imposterSyndrome) {
    support.push("Practice self-compassion and realistic self-assessment");
    support.push("Keep an achievement journal to track progress");
  }

  if (confusionAnalysis.psychologicalFactors.perfectionism) {
    support.push("Embrace 'good enough' decision-making");
    support.push("Set time limits for career research to prevent overthinking");
  }

  if (confusionAnalysis.psychologicalFactors.comparisonAnxiety) {
    support.push("Limit social media consumption during career planning");
    support.push("Focus on personal values rather than external validation");
  }

  return support;
}

function generateCulturalAdaptations(confusionAnalysis: AdvancedConfusionAnalysis): string[] {
  const adaptations: string[] = [];

  if (confusionAnalysis.psychologicalFactors.culturalConflicts) {
    adaptations.push("Research professionals from similar cultural backgrounds");
    adaptations.push("Find ways to integrate cultural values into modern career choices");
    adaptations.push("Engage family in understanding evolving career landscapes");
  }

  if (confusionAnalysis.contextualChallenges.familyExpectations) {
    adaptations.push("Practice respectful communication about personal career interests");
    adaptations.push("Find career mentors who've navigated similar family dynamics");
  }

  return adaptations;
}

function generateEconomicRealities(confusionAnalysis: AdvancedConfusionAnalysis): string[] {
  const realities: string[] = [];

  if (confusionAnalysis.contextualChallenges.economicConstraints) {
    realities.push("Prioritize careers with strong entry-level earning potential");
    realities.push("Consider staged career progression - immediate stability first, passion later");
    realities.push("Explore careers with good ROI on education/training investments");
  }

  return realities;
}

function getAdvancedGuidanceMessage(confusionAnalysis: AdvancedConfusionAnalysis): string {
  switch (confusionAnalysis.level) {
    case 'paralyzed':
      return "You're experiencing decision paralysis - this is more common than you think. Professional support can help break through this barrier.";
    case 'complex':
      return "Your situation involves multiple complex factors. A multi-faceted approach with professional guidance is recommended.";
    case 'extreme':
      return "You're dealing with significant uncertainty across multiple areas. Structured, step-by-step exploration will help.";
    case 'high':
      return "You have several conflicting factors to consider. Let's organize your thoughts systematically.";
    case 'medium':
      return "Some confusion is normal during career planning. Here's a focused approach to gain clarity.";
    default:
      return "You have good direction overall. These recommendations can help fine-tune your path.";
  }
}

function getAdvancedPriorityActions(confusionAnalysis: AdvancedConfusionAnalysis): string[] {
  if (confusionAnalysis.level === 'paralyzed') {
    return [
      "Seek professional career counseling or therapy",
      "Start with tiny, low-stakes career exploration activities",
      "Practice decision-making on unrelated small choices to build confidence"
    ];
  }

  if (confusionAnalysis.psychologicalFactors.culturalConflicts) {
    return [
      "Have honest conversations with family about career interests",
      "Research successful professionals from similar cultural backgrounds",
      "Find mentors who've navigated cultural and personal career integration"
    ];
  }

  if (confusionAnalysis.contextualChallenges.economicConstraints) {
    return [
      "Research high-ROI career training programs",
      "Explore paid apprenticeships and training opportunities",
      "Focus on building immediately marketable skills"
    ];
  }

  return [
    "Complete comprehensive self-assessment",
    "Begin structured career exploration",
    "Connect with career counseling resources"
  ];
}

function getAdvancedTimeline(confusionAnalysis: AdvancedConfusionAnalysis): string {
  switch (confusionAnalysis.level) {
    case 'paralyzed':
      return "6-18 months with professional support - focus on therapeutic progress first";
    case 'complex':
      return "6-12 months of multi-faceted exploration and professional guidance";
    case 'extreme':
      return "6-9 months of structured exploration with regular check-ins";
    default:
      return "3-6 months of focused research and experimentation";
  }
}

function getSupportSystems(confusionAnalysis: AdvancedConfusionAnalysis): string[] {
  const systems: string[] = ["Career counseling services", "Professional mentors"];

  if (confusionAnalysis.psychologicalFactors.imposterSyndrome || confusionAnalysis.level === 'paralyzed') {
    systems.push("Therapeutic counseling", "Support groups for career anxiety");
  }

  if (confusionAnalysis.psychologicalFactors.culturalConflicts) {
    systems.push("Cultural community networks", "Bicultural career mentors");
  }

  return systems;
}

function getWarningFlags(confusionAnalysis: AdvancedConfusionAnalysis): string[] {
  const flags: string[] = [];

  if (confusionAnalysis.level === 'paralyzed') {
    flags.push("Seek immediate professional help if decision paralysis is affecting daily life");
  }

  if (confusionAnalysis.psychologicalFactors.imposterSyndrome) {
    flags.push("Watch for persistent self-doubt that prevents taking action");
  }

  if (confusionAnalysis.psychologicalFactors.perfectionism) {
    flags.push("Be aware of endless research without decision-making");
  }

  return flags;
}

// Main integration function for advanced confusion handling
export function integrateAdvancedConfusionHandling(input: any, standardRecommendations: any[]): ComprehensiveCareerResponse {
  const confusionAnalysis = analyzeAdvancedCareerConfusion(input);
  
  if (confusionAnalysis.level === 'low') {
    // For users with clear direction, enhance standard recommendations slightly
    const enhancedStandard = standardRecommendations.map(rec => ({
      ...rec,
      psychologicalSupport: [],
      culturalConsiderations: [],
      economicRealistic: true,
      timelineFlexible: false
    }));

    return {
      primaryRecommendations: enhancedStandard,
      explorationRecommendations: [],
      therapeuticRecommendations: [],
      clarificationQuestions: [],
      explorationPath: ["Research these careers in detail", "Network with professionals"],
      psychologicalSupport: [],
      culturalAdaptations: [],
      economicRealities: [],
      guidance: {
        message: "Your profile shows clear direction. Here are targeted recommendations:",
        priority: ["Research specific roles", "Build relevant skills", "Network in target industries"],
        timeline: "Ready to take action within 1-2 months",
        supportSystems: ["Professional networks", "Industry mentors"],
        warningFlags: []
      }
    };
  }
  // For confused users, provide comprehensive advanced support
  return generateAdvancedAdaptiveRecommendations(standardRecommendations, confusionAnalysis);
}

export default {
  analyzeAdvancedCareerConfusion,
  generateAdvancedAdaptiveRecommendations,
  integrateAdvancedConfusionHandling
};
