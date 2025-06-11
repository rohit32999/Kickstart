// Enhanced career recommendation system with additional metadata for better UI

// Core types moved from basic version
export interface PersonalityProfile {
  introvertExtrovert: 'introvert' | 'extrovert' | 'ambivert' | '';
  leadership: 'high' | 'medium' | 'low' | '';
  creativity: 'high' | 'medium' | 'low' | '';
  riskTolerance: 'high' | 'medium' | 'low' | '';
  communication: 'high' | 'medium' | 'low' | '';
}

export interface CareerInput {
  iqScore: number;
  hobbies: string;
  interests: string;
  academicDetails: string;
  location?: string;
  keywords?: string;
  personality?: PersonalityProfile;
  useAI?: boolean;
}

export interface EnhancedCareerRecommendation {
  title: string;
  description: string;
  category: string;
  confidencePercent?: number;
  matchScore?: number;
  salaryRange?: string;
  skills?: string[];
  nextSteps?: string[];
  growthPotential?: 'high' | 'medium' | 'low';
  workEnvironment?: string;
  education?: string;
  why?: string;
  resources?: string[];
}

export interface CareerRecommendation {
  title: string;
  description: string;
  why?: string;
  resources?: string[];
  confidencePercent: number;
}

// Career metadata database
const careerMetadata: Record<string, Partial<EnhancedCareerRecommendation>> = {
  'Software Developer': {
    category: 'Technology',
    salaryRange: '$70,000 - $150,000',
    skills: ['Programming', 'Problem Solving', 'Software Design', 'Testing', 'Version Control'],
    nextSteps: ['Learn programming languages', 'Build a portfolio', 'Apply for internships', 'Contribute to open source'],
    growthPotential: 'high',
    workEnvironment: 'Office or Remote',
    education: 'Bachelor\'s in Computer Science or related field',
    resources: ['Codecademy', 'GitHub', 'Stack Overflow', 'FreeCodeCamp']
  },
  
  'AI/ML Engineer': {
    category: 'Technology',
    salaryRange: '$90,000 - $180,000',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'Statistics', 'Deep Learning'],
    nextSteps: ['Master Python and ML frameworks', 'Complete ML projects', 'Get certifications', 'Build ML portfolio'],
    growthPotential: 'high',
    workEnvironment: 'Office or Remote',
    education: 'Bachelor\'s/Master\'s in Computer Science, Data Science, or Mathematics',
    resources: ['Coursera ML Courses', 'Kaggle', 'TensorFlow', 'PyTorch Documentation']
  },

  'Data Scientist': {
    category: 'Technology',
    salaryRange: '$80,000 - $160,000',
    skills: ['Statistics', 'Python/R', 'Data Visualization', 'SQL', 'Business Intelligence'],
    nextSteps: ['Learn data analysis tools', 'Practice with real datasets', 'Build data projects', 'Get cloud certifications'],
    growthPotential: 'high',
    workEnvironment: 'Office or Remote',
    education: 'Bachelor\'s in Statistics, Math, Computer Science, or related field',
    resources: ['Jupyter Notebooks', 'Tableau', 'Power BI', 'Pandas Documentation']
  },

  'Doctor/Medical Professional': {
    category: 'Healthcare',
    salaryRange: '$200,000 - $400,000+',
    skills: ['Medical Knowledge', 'Patient Care', 'Diagnosis', 'Surgery', 'Communication'],
    nextSteps: ['Complete MBBS', 'Pass medical licensing exams', 'Complete residency', 'Specialize if desired'],
    growthPotential: 'high',
    workEnvironment: 'Hospitals, Clinics, Private Practice',
    education: 'MBBS degree, Medical Residency, Board Certification',
    resources: ['Medical Journals', 'Medical Conferences', 'Continuing Education', 'Medical Associations']
  },

  'Engineer': {
    category: 'Engineering',
    salaryRange: '$60,000 - $130,000',
    skills: ['Technical Knowledge', 'Problem Solving', 'Project Management', 'CAD Software', 'Analysis'],
    nextSteps: ['Complete engineering degree', 'Gain practical experience', 'Get professional license', 'Specialize in a field'],
    growthPotential: 'medium',
    workEnvironment: 'Office, Field Work, Manufacturing',
    education: 'Bachelor\'s in Engineering',
    resources: ['Professional Engineering Societies', 'Technical Journals', 'CAD Software Training', 'Certification Programs']
  },

  'Business Analyst': {
    category: 'Business',
    salaryRange: '$65,000 - $120,000',
    skills: ['Data Analysis', 'Business Process', 'Requirements Gathering', 'Communication', 'Problem Solving'],
    nextSteps: ['Learn business analysis tools', 'Get certified', 'Gain domain expertise', 'Build analytical projects'],
    growthPotential: 'medium',
    workEnvironment: 'Office or Remote',
    education: 'Bachelor\'s in Business, Economics, or related field',
    resources: ['Business Analysis Certification', 'Excel/SQL Training', 'Project Management Tools', 'Industry Reports']
  },

  'Creative Professional': {
    category: 'Creative',
    salaryRange: '$40,000 - $90,000',
    skills: ['Creativity', 'Design Software', 'Artistic Skills', 'Communication', 'Project Management'],
    nextSteps: ['Build a portfolio', 'Learn design software', 'Network with other creatives', 'Freelance to gain experience'],
    growthPotential: 'medium',
    workEnvironment: 'Studios, Agencies, Freelance',
    education: 'Bachelor\'s in Fine Arts, Design, or related field',
    resources: ['Adobe Creative Suite', 'Behance', 'Dribbble', 'Design Communities']
  },

  'Graphic Designer': {
    category: 'Creative',
    salaryRange: '$40,000 - $80,000',
    skills: ['Adobe Creative Suite', 'Typography', 'Color Theory', 'Branding', 'Web Design'],
    nextSteps: ['Master design software', 'Build design portfolio', 'Learn UX/UI principles', 'Get design certifications'],
    growthPotential: 'medium',
    workEnvironment: 'Agencies, In-house, Freelance',
    education: 'Bachelor\'s in Graphic Design or related field',
    resources: ['Adobe Tutorials', 'Design Inspiration Sites', 'Typography Resources', 'Color Tools']
  },

  'Finance or Management Professional': {
    category: 'Business',
    salaryRange: '$55,000 - $150,000+',
    skills: ['Financial Analysis', 'Leadership', 'Strategic Planning', 'Communication', 'Risk Management'],
    nextSteps: ['Get finance/business degree', 'Pursue relevant certifications', 'Gain leadership experience', 'Network professionally'],
    growthPotential: 'high',
    workEnvironment: 'Corporate Offices, Banks, Consulting Firms',
    education: 'Bachelor\'s in Finance, Business, Economics, or MBA',
    resources: ['CFA Institute', 'Financial News', 'Business Journals', 'Professional Networks']
  },

  'Research Scientist': {
    category: 'Science',
    salaryRange: '$60,000 - $140,000',
    skills: ['Research Methods', 'Data Analysis', 'Scientific Writing', 'Laboratory Skills', 'Critical Thinking'],
    nextSteps: ['Complete advanced degree', 'Publish research papers', 'Apply for research positions', 'Build lab experience'],
    growthPotential: 'medium',
    workEnvironment: 'Universities, Research Labs, Corporate R&D',
    education: 'PhD in relevant scientific field',
    resources: ['Scientific Journals', 'Research Conferences', 'Laboratory Training', 'Grant Writing Resources']
  },

  'Content Writer or Editor': {
    category: 'Creative',
    salaryRange: '$35,000 - $75,000',
    skills: ['Writing', 'Editing', 'SEO', 'Content Strategy', 'Research'],
    nextSteps: ['Build writing portfolio', 'Learn content marketing', 'Develop niche expertise', 'Practice different writing styles'],
    growthPotential: 'medium',
    workEnvironment: 'Remote, Agencies, Media Companies',
    education: 'Bachelor\'s in English, Journalism, Communications, or related field',
    resources: ['Writing Communities', 'SEO Tools', 'Content Management Systems', 'Style Guides']
  },

  'Sports Coach or Physiotherapist': {
    category: 'Health & Sports',
    salaryRange: '$40,000 - $80,000',
    skills: ['Sports Knowledge', 'Physical Therapy', 'Communication', 'Motivation', 'Anatomy'],
    nextSteps: ['Get sports science degree', 'Obtain coaching certifications', 'Gain practical experience', 'Specialize in specific sports'],
    growthPotential: 'medium',
    workEnvironment: 'Sports Facilities, Clinics, Schools',
    education: 'Bachelor\'s in Sports Science, Kinesiology, or Physical Therapy',
    resources: ['Sports Coaching Certifications', 'Anatomy Resources', 'Sports Medicine Journals', 'Professional Associations']
  },

  'Core Engineer': {
    category: 'Engineering',
    salaryRange: '$70,000 - $140,000',
    skills: ['Engineering Principles', 'Technical Analysis', 'Project Management', 'Quality Control', 'Problem Solving'],
    nextSteps: ['Complete engineering degree', 'Get industry experience', 'Pursue professional certification', 'Develop specialization'],
    growthPotential: 'medium',
    workEnvironment: 'Manufacturing, Construction, Energy',
    education: 'Bachelor\'s in Engineering (Mechanical, Electrical, Civil, etc.)',
    resources: ['Engineering Societies', 'Technical Standards', 'Professional Development', 'Industry Publications']
  },

  'Career Exploration': {
    category: 'General',
    salaryRange: 'Varies by field',
    skills: ['Self-assessment', 'Research', 'Networking', 'Adaptability', 'Learning'],
    nextSteps: ['Take career assessments', 'Explore different fields', 'Talk to professionals', 'Try internships or volunteering'],
    growthPotential: 'high',
    workEnvironment: 'Various',
    education: 'Continue current education while exploring',
    resources: ['Career Assessment Tools', 'Professional Networks', 'Industry Events', 'Informational Interviews']
  }
};

// --- Localization Helper ---
export function getLocalizedText(key: string, lang: string = 'en'): string {
  const translations: Record<string, Record<string, string>> = {
    'career_exploration': {
      en: 'Career Exploration',
      hi: 'कैरियर अन्वेषण',
      es: 'Exploración de Carrera'
    },
    'not_sure_start': {
      en: 'Not sure where to start? Try online self-assessment tools, career quizzes, or talk to a mentor. Explore internships, volunteering, or short courses in different fields to discover what excites you.',
      hi: 'शुरू कहाँ से करें? ऑनलाइन आत्म-मूल्यांकन टूल्स, कैरियर क्विज़ या मेंटर से बात करें। विभिन्न क्षेत्रों में इंटर्नशिप, स्वयंसेवा या शॉर्ट कोर्स आज़माएँ।',
      es: '¿No sabes por dónde empezar? Prueba herramientas de autoevaluación, cuestionarios de carrera o habla con un mentor. Explora pasantías, voluntariado o cursos cortos en diferentes campos.'
    }
  };
  return translations[key]?.[lang] || translations[key]?.en || key;
}

// --- Semantic Similarity Ranking (Backend) ---
export async function getSemanticRankedCareers({ userInput, careerProfiles }: { userInput: string, careerProfiles: any[] }) {
  try {
    const res = await fetch("http://localhost:5000/api/semantic-rank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput, careerProfiles })
    });
    const data = await res.json();
    if (data && Array.isArray(data.results)) {
      return data.results;
    }
    return [];
  } catch (err) {
    return [];
  }
}

// --- Main Recommendation Logic ---
export async function getCareerRecommendations(input: CareerInput): Promise<CareerRecommendation[]> {
  // Simplified implementation that provides basic career recommendations
  // This replaces the complex logic from the original file
  const { iqScore, hobbies, interests, academicDetails, keywords } = input;
  
  const defaultRecommendations: CareerRecommendation[] = [
    {
      title: 'Software Developer',
      description: 'Build software applications and systems using programming languages.',
      confidencePercent: Math.min(95, Math.max(60, iqScore + 10)),
      why: 'Good fit based on your profile and technical interests.'
    },
    {
      title: 'Data Scientist',
      description: 'Analyze data to extract insights and support decision-making.',
      confidencePercent: Math.min(90, Math.max(55, iqScore + 5)),
      why: 'Your analytical skills make this a strong match.'
    }
  ];

  // Simple keyword matching logic
  const userText = `${hobbies} ${interests} ${academicDetails} ${keywords || ''}`.toLowerCase();
  
  if (userText.includes('medicine') || userText.includes('doctor') || userText.includes('mbbs')) {
    defaultRecommendations.unshift({
      title: 'Doctor/Medical Professional',
      description: 'Provide medical care and help people with health issues.',
      confidencePercent: 95,
      why: 'Strong match based on your medical interests and background.'
    });
  }
  
  if (userText.includes('engineer') || userText.includes('technical')) {
    defaultRecommendations.push({
      title: 'Engineer',
      description: 'Design and build systems, structures, or technology solutions.',
      confidencePercent: Math.min(85, Math.max(50, iqScore)),
      why: 'Engineering aligns with your technical background.'
    });
  }

  return defaultRecommendations.slice(0, 4);
}

export async function getEnhancedCareerRecommendations(input: CareerInput): Promise<EnhancedCareerRecommendation[]> {
  try {
    // Get basic recommendations first
    const basicRecommendations = await getCareerRecommendations({ ...input, useAI: true });
    
    // Enhance each recommendation with additional metadata
    const enhancedRecommendations: EnhancedCareerRecommendation[] = basicRecommendations.map((rec: CareerRecommendation) => {
      const metadata = careerMetadata[rec.title] || {};
      
      return {
        title: rec.title,
        description: rec.description,
        category: metadata.category || 'General',
        confidencePercent: rec.confidencePercent,
        matchScore: rec.confidencePercent, // Use confidence as match score
        salaryRange: metadata.salaryRange,
        skills: metadata.skills,
        nextSteps: metadata.nextSteps,
        growthPotential: metadata.growthPotential || 'medium',
        workEnvironment: metadata.workEnvironment,
        education: metadata.education,
        why: rec.why,
        resources: metadata.resources || []
      };
    });    return enhancedRecommendations;
  } catch (error) {
    console.error('Error getting enhanced career recommendations:', error);
    
    // Fallback to default recommendations if everything fails
    return [
      {
        title: 'Career Exploration',
        description: 'Explore different career paths to find what interests you most.',
        category: 'General',
        confidencePercent: 70,
        matchScore: 70,
        ...careerMetadata['Career Exploration']
      }
    ];
  }
}
