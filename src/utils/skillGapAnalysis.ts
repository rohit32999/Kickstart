// Skill Gap Analysis for Career Recommendations
// Simple implementation that can be integrated into the existing system

export interface SkillGap {
  matchingSkills: string[];
  missingSkills: string[];
  gapPercentage: number;
  recommendations: string[];
}

// Career skill requirements database
const CAREER_SKILLS: Record<string, string[]> = {
  'Software Developer': [
    'JavaScript', 'Python', 'HTML/CSS', 'Git', 'Problem Solving', 
    'Debugging', 'API Integration', 'Database Management'
  ],
  'AI/ML Engineer': [
    'Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 
    'Statistics', 'Linear Algebra', 'Neural Networks', 'Model Training'
  ],
  'Data Scientist': [
    'Python', 'R', 'SQL', 'Statistics', 'Data Visualization', 
    'Machine Learning', 'Pandas', 'Numpy', 'Business Intelligence'
  ],
  'Doctor/Medical Professional': [
    'Medical Knowledge', 'Patient Care', 'Diagnosis', 'Communication',
    'Emergency Response', 'Medical Ethics', 'Anatomy', 'Pharmacology'
  ],
  'Business Analyst': [
    'Data Analysis', 'Excel', 'SQL', 'Project Management', 'Communication',
    'Process Improvement', 'Requirements Gathering', 'Stakeholder Management'
  ],
  'Graphic Designer': [
    'Adobe Creative Suite', 'Design Principles', 'Typography', 'Color Theory',
    'User Experience', 'Branding', 'Print Design', 'Digital Design'
  ],
  'Engineer': [
    'Mathematics', 'Physics', 'CAD Software', 'Problem Solving',
    'Project Management', 'Technical Drawing', 'Materials Science'
  ]
};

export function analyzeSkillGap(userSkills: string, careerTitle: string): SkillGap {
  const requiredSkills = CAREER_SKILLS[careerTitle] || [];
  
  if (!userSkills || requiredSkills.length === 0) {
    return {
      matchingSkills: [],
      missingSkills: requiredSkills,
      gapPercentage: 100,
      recommendations: []
    };
  }

  // Parse user skills (case-insensitive)
  const userSkillsArray = userSkills
    .toLowerCase()
    .split(/[,\s]+/)
    .filter(skill => skill.length > 0);
  // Find matching skills
  const matchingSkills = requiredSkills.filter((skill: string) =>
    userSkillsArray.some(userSkill =>
      userSkill.includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(userSkill)
    )
  );

  // Find missing skills
  const missingSkills = requiredSkills.filter((skill: string) => 
    !matchingSkills.includes(skill)
  );

  // Calculate gap percentage
  const gapPercentage = Math.round((missingSkills.length / requiredSkills.length) * 100);

  // Generate recommendations
  const recommendations = generateSkillRecommendations(missingSkills);

  return {
    matchingSkills,
    missingSkills,
    gapPercentage,
    recommendations
  };
}

function generateSkillRecommendations(missingSkills: string[]): string[] {
  const recommendations: string[] = [];
  
  // Prioritize top 3 missing skills
  const prioritySkills = missingSkills.slice(0, 3);
  
  prioritySkills.forEach(skill => {
    const recommendation = getSkillLearningPath(skill);
    if (recommendation) {
      recommendations.push(recommendation);
    }
  });

  return recommendations;
}

function getSkillLearningPath(skill: string): string {
  const learningPaths: Record<string, string> = {
    'JavaScript': 'Start with FreeCodeCamp or MDN Web Docs for JavaScript fundamentals',
    'Python': 'Complete Python.org tutorial or Codecademy Python course',
    'Machine Learning': 'Take Andrew Ng\'s Machine Learning course on Coursera',
    'Data Analysis': 'Learn with Kaggle Learn courses and practice on real datasets',
    'Adobe Creative Suite': 'Adobe tutorials and YouTube channels like Adobe Creative Cloud',
    'SQL': 'Practice on SQLBolt or W3Schools SQL tutorial',
    'Communication': 'Join Toastmasters or take online communication courses',
    'Project Management': 'Consider PMP certification or Scrum Master certification'
  };

  return learningPaths[skill] || `Research online courses and tutorials for ${skill}`;
}

// Integration with existing recommendation system
export function enhanceRecommendationWithSkills(
  recommendation: any, 
  userSkills: string
) {
  const skillGap = analyzeSkillGap(userSkills, recommendation.title);
  
  return {
    ...recommendation,
    skillGap,
    // Adjust confidence based on skill match
    confidencePercent: Math.max(
      recommendation.confidencePercent - skillGap.gapPercentage * 0.3,
      10
    )
  };
}
