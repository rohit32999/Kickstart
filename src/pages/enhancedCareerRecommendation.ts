import { integrateConfusionHandling, analyzeCareerConfusion } from '../utils/careerConfusionHandler';
import { integrateAdvancedConfusionHandling } from '../utils/advancedCareerConfusionHandler';

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
  additionalInfo?: string; // For complex user scenarios
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
  adaptationNote?: string; // New field for confusion-related notes
  
  // New AI-powered fields
  marketTrends?: string;
  topCompanies?: string[];
  jobSecurity?: 'High' | 'Medium' | 'Low';
  workLifeBalance?: 'Excellent' | 'Good' | 'Average' | 'Challenging';
  salaryBreakdown?: {
    entry?: string;
    experienced?: string;
    senior?: string;
  };
  
  // Advanced confusion handling fields
  psychologicalSupport?: string[];
  culturalConsiderations?: string[];
  economicRealistic?: boolean;
  timelineFlexible?: boolean;
  therapeuticApproach?: boolean;
  explorationFocus?: boolean;
}

export interface CareerRecommendation {
  title: string;
  description: string;
  why?: string;
  resources?: string[];
  confidencePercent: number;
  metadata?: EnhancedCareerMetadata;
}

export interface EnhancedCareerMetadata {
  category?: string;
  salaryRange?: {
    entry?: string;
    experienced?: string;
    senior?: string;
  };
  skills?: string[];
  education?: string;
  workEnvironment?: string;
  growthPotential?: 'High' | 'Medium' | 'Low';
  nextSteps?: string[];
  marketTrends?: string;
  topCompanies?: string[];
  jobSecurity?: 'High' | 'Medium' | 'Low';
  workLifeBalance?: 'Excellent' | 'Good' | 'Average' | 'Challenging';
}

// Enhanced response interface for confused users
export interface EnhancedCareerResponse {
  recommendations: EnhancedCareerRecommendation[];
  confusionLevel?: 'low' | 'medium' | 'high' | 'extreme';
  explorationRecommendations?: EnhancedCareerRecommendation[];
  specializedRecommendations?: EnhancedCareerRecommendation[];
  clarificationQuestions?: string[];
  explorationPath?: string[];
  guidance?: {
    message: string;
    priority: string[];
    timeline: string;
    supportSystems?: string[];
    warningFlags?: string[];
  };
  // Advanced fields for complex confusion scenarios
  psychologicalSupport?: string[];
  culturalAdaptations?: string[];
  economicRealities?: string[];
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
  const { iqScore, hobbies, interests, academicDetails, location, keywords, personality, useAI } = input;
  
  // Use AI-powered recommendations if enabled (with fallback)
  if (useAI) {
    try {
      const apiUrl = import.meta.env.VITE_GEMINI_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/career-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          iqScore,
          hobbies,
          interests,
          academicDetails,
          location,
          keywords,
          personality
        }),
      });

      if (!response.ok) {
        console.warn('AI backend not available, falling back to local recommendations');
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
        if (data.recommendations && Array.isArray(data.recommendations)) {
        return data.recommendations.map((rec: any) => ({
          title: rec.title || 'Career Opportunity',
          description: rec.description || 'Explore this career path based on your profile.',
          confidencePercent: Math.max(30, Math.min(100, rec.confidencePercent || 70)),
          why: rec.why || 'AI-generated recommendation based on your profile.',
          metadata: rec.metadata ? {
            category: rec.metadata.category,
            salaryRange: rec.metadata.salaryRange,
            skills: rec.metadata.skills,
            education: rec.metadata.education,
            workEnvironment: rec.metadata.workEnvironment,
            growthPotential: rec.metadata.growthPotential,
            nextSteps: rec.metadata.nextSteps,
            marketTrends: rec.metadata.marketTrends,
            topCompanies: rec.metadata.topCompanies,
            jobSecurity: rec.metadata.jobSecurity,
            workLifeBalance: rec.metadata.workLifeBalance
          } : undefined
        }));
      }    } catch (error) {
      console.error('AI career recommendations failed, using enhanced fallback:', error);
      // Fall through to enhanced backup logic
    }
  }

  // Enhanced backup/fallback logic for when AI is disabled or fails
  const userText = `${hobbies} ${interests} ${academicDetails} ${keywords || ''}`.toLowerCase();
  
  // Enhanced recommendation logic with better pattern matching
  const recommendations: CareerRecommendation[] = [];
  
  // Medical field detection
  if (userText.includes('medicine') || userText.includes('doctor') || userText.includes('mbbs') || 
      userText.includes('medical') || userText.includes('healthcare') || userText.includes('neet')) {
    recommendations.push({
      title: 'Doctor/Medical Professional',
      description: 'Provide medical care and help people with health issues.',
      confidencePercent: 95,
      why: 'Strong match based on your medical interests and background.',
      metadata: {
        category: 'Healthcare',
        salaryRange: { entry: '$200,000', experienced: '$300,000', senior: '$500,000+' },
        skills: ['Medical Knowledge', 'Patient Care', 'Diagnosis', 'Communication', 'Empathy'],
        education: 'MBBS + Specialization',
        workEnvironment: 'Hospitals, Clinics, Private Practice',
        growthPotential: 'High',
        nextSteps: ['Complete MBBS', 'Pass licensing exams', 'Complete residency', 'Specialize if desired']
      }
    });
  }
  
  // Technology field detection
  if (userText.includes('programming') || userText.includes('coding') || userText.includes('software') || 
      userText.includes('computer') || userText.includes('technology') || userText.includes('tech') ||
      userText.includes('ai') || userText.includes('machine learning') || userText.includes('data')) {
    recommendations.push({
      title: 'Software Developer',
      description: 'Build software applications and systems using programming languages.',
      confidencePercent: Math.min(95, Math.max(60, iqScore + 10)),
      why: 'Excellent fit based on your technical interests and analytical abilities.',
      metadata: {
        category: 'Technology',
        salaryRange: { entry: '$70,000', experienced: '$120,000', senior: '$180,000+' },
        skills: ['Programming', 'Problem Solving', 'Software Design', 'Testing', 'Version Control'],
        education: 'Bachelor\'s in Computer Science or related field',
        workEnvironment: 'Office or Remote',
        growthPotential: 'High',
        nextSteps: ['Learn programming languages', 'Build a portfolio', 'Apply for internships', 'Contribute to open source']
      }
    });
    
    if (userText.includes('ai') || userText.includes('machine learning') || userText.includes('data')) {
      recommendations.push({
        title: 'AI/ML Engineer',
        description: 'Develop artificial intelligence and machine learning solutions.',
        confidencePercent: Math.min(90, Math.max(55, iqScore + 5)),
        why: 'Perfect match for your AI and data science interests.',
        metadata: {
          category: 'Technology',
          salaryRange: { entry: '$90,000', experienced: '$150,000', senior: '$220,000+' },
          skills: ['Python', 'Machine Learning', 'Data Analysis', 'Statistics', 'Deep Learning'],
          education: 'Bachelor\'s/Master\'s in Computer Science, Data Science, or Mathematics',
          workEnvironment: 'Tech Companies, Research Labs',
          growthPotential: 'High'
        }
      });
    }
  }
  
  // Engineering field detection
  if (userText.includes('engineering') || userText.includes('mechanical') || userText.includes('electrical') || 
      userText.includes('civil') || userText.includes('chemical')) {
    recommendations.push({
      title: 'Engineer',
      description: 'Design and build systems, structures, or technology solutions.',
      confidencePercent: Math.min(85, Math.max(50, iqScore)),
      why: 'Engineering aligns with your technical background and problem-solving interests.',
      metadata: {
        category: 'Engineering',
        salaryRange: { entry: '$65,000', experienced: '$90,000', senior: '$130,000+' },
        skills: ['Engineering Principles', 'Technical Analysis', 'Project Management', 'Problem Solving'],
        education: 'Bachelor\'s in Engineering',
        workEnvironment: 'Manufacturing, Construction, Energy',
        growthPotential: 'Medium'
      }
    });
  }
  
  // Business field detection
  if (userText.includes('business') || userText.includes('management') || userText.includes('finance') || 
      userText.includes('accounting') || userText.includes('marketing')) {
    recommendations.push({
      title: 'Business Professional',
      description: 'Work in business management, finance, or related commercial fields.',
      confidencePercent: Math.min(80, Math.max(50, iqScore - 5)),
      why: 'Good match for your business interests and leadership potential.',
      metadata: {
        category: 'Business',
        salaryRange: { entry: '$50,000', experienced: '$80,000', senior: '$150,000+' },
        skills: ['Leadership', 'Communication', 'Strategic Thinking', 'Financial Analysis'],
        education: 'Bachelor\'s in Business, Economics, or related field',
        workEnvironment: 'Corporate Offices',
        growthPotential: 'Medium'
      }
    });
  }
  
  // Creative field detection
  if (userText.includes('art') || userText.includes('design') || userText.includes('creative') || 
      userText.includes('writing') || userText.includes('music') || userText.includes('photography')) {
    recommendations.push({
      title: 'Creative Professional',
      description: 'Express creativity through various artistic and design mediums.',
      confidencePercent: Math.min(75, Math.max(40, iqScore - 10)),
      why: 'Matches your creative interests and artistic talents.',
      metadata: {
        category: 'Creative',
        salaryRange: { entry: '$35,000', experienced: '$60,000', senior: '$100,000+' },
        skills: ['Creativity', 'Design Thinking', 'Communication', 'Technical Skills'],
        education: 'Bachelor\'s in Fine Arts, Design, or related field',
        workEnvironment: 'Studios, Agencies, Freelance',
        growthPotential: 'Medium'
      }
    });
  }
  
  // Default recommendations if no specific field detected
  if (recommendations.length === 0) {
    recommendations.push(
      {
        title: 'Data Scientist',
        description: 'Analyze data to extract insights and support decision-making.',
        confidencePercent: Math.min(80, Math.max(55, iqScore + 5)),
        why: 'Your analytical skills make this a strong match.',
        metadata: {
          category: 'Technology',
          salaryRange: { entry: '$80,000', experienced: '$120,000', senior: '$160,000+' },
          skills: ['Statistics', 'Python/R', 'Data Visualization', 'SQL', 'Business Intelligence'],
          education: 'Bachelor\'s in Statistics, Math, Computer Science, or related field',
          workEnvironment: 'Office or Remote',
          growthPotential: 'High'
        }
      },
      {
        title: 'Career Exploration',
        description: 'Explore different career paths to find what interests you most.',
        confidencePercent: 70,
        why: 'Take time to explore various fields and discover your passion.',
        metadata: {
          category: 'General',
          salaryRange: { entry: 'Varies', experienced: 'Varies', senior: 'Varies' },
          skills: ['Self-assessment', 'Research', 'Networking', 'Adaptability'],
          education: 'Continue current education while exploring',
          workEnvironment: 'Various',
          growthPotential: 'High'
        }
      }
    );
  }
  
  return recommendations.slice(0, 4); // Return top 4 recommendations
}

export async function getEnhancedCareerRecommendations(input: CareerInput): Promise<EnhancedCareerResponse> {
  try {
    // Get basic recommendations first
    const basicRecommendations = await getCareerRecommendations({ ...input, useAI: true });
    
    // Analyze user confusion level first to determine which handler to use
    const confusionAnalysis = analyzeCareerConfusion(input);
    
    // For complex/extreme confusion, use advanced handling
    if (confusionAnalysis.confusionLevel === 'extreme' || 
        (input.additionalInfo && 
         (input.additionalInfo.toLowerCase().includes('paralyzed') ||
          input.additionalInfo.toLowerCase().includes('cultural') ||
          input.additionalInfo.toLowerCase().includes('perfectionist') ||
          input.additionalInfo.toLowerCase().includes('imposter')))) {
      
      // Use advanced confusion handling for complex scenarios
      const advancedResult = integrateAdvancedConfusionHandling(input, basicRecommendations);
      
      return {
        recommendations: advancedResult.primaryRecommendations.map((rec: any) => ({
          title: rec.title,
          description: rec.description,
          category: rec.category || 'General',
          confidencePercent: rec.confidencePercent,
          matchScore: rec.confidencePercent,
          why: rec.why,
          nextSteps: rec.nextSteps,
          resources: rec.resources || [],
          adaptationNote: rec.adaptationNote,
          psychologicalSupport: rec.psychologicalSupport,
          culturalConsiderations: rec.culturalConsiderations,
          economicRealistic: rec.economicRealistic,
          timelineFlexible: rec.timelineFlexible,
          therapeuticApproach: rec.therapeuticApproach,
          explorationFocus: rec.explorationFocus
        })),
        confusionLevel: advancedResult.guidance ? 'extreme' : 'high',
        explorationRecommendations: advancedResult.explorationRecommendations?.map((rec: any) => ({
          title: rec.title,
          description: rec.description,
          category: rec.category || 'Exploration',
          confidencePercent: rec.confidencePercent,
          why: rec.why,
          nextSteps: rec.nextSteps,
          resources: rec.resources || [],
          therapeuticApproach: rec.therapeuticApproach,
          psychologicalSupport: rec.psychologicalSupport
        })),
        specializedRecommendations: advancedResult.therapeuticRecommendations?.map((rec: any) => ({
          title: rec.title,
          description: rec.description,
          category: 'Therapeutic',
          confidencePercent: rec.confidencePercent,
          why: rec.why,
          nextSteps: rec.nextSteps,
          therapeuticApproach: true
        })),
        clarificationQuestions: advancedResult.clarificationQuestions,
        explorationPath: advancedResult.explorationPath,
        guidance: advancedResult.guidance,
        psychologicalSupport: advancedResult.psychologicalSupport,
        culturalAdaptations: advancedResult.culturalAdaptations,
        economicRealities: advancedResult.economicRealities
      };
    }
    
    // For standard confusion levels, use regular adaptive handling
    const adaptiveResult = integrateConfusionHandling(input, basicRecommendations);
    
    // If user has low confusion, proceed with standard enhanced recommendations
    if (adaptiveResult.confusionLevel === 'low' || !adaptiveResult.confusionLevel) {
      const enhancedRecommendations: EnhancedCareerRecommendation[] = basicRecommendations.map((rec: CareerRecommendation) => {
        const staticMetadata = careerMetadata[rec.title] || {};
        const aiMetadata = rec.metadata;
        
        // Merge AI metadata with static fallback data
        return {
          title: rec.title,
          description: rec.description,
          category: aiMetadata?.category || staticMetadata.category || 'General',
          confidencePercent: rec.confidencePercent,
          matchScore: rec.confidencePercent,
          
          // Salary information - prefer AI data, fallback to static
          salaryRange: aiMetadata?.salaryRange?.experienced || staticMetadata.salaryRange,
          
          // Skills - merge AI and static data
          skills: aiMetadata?.skills || staticMetadata.skills,
          
          // Next steps - prefer AI data for personalization
          nextSteps: aiMetadata?.nextSteps || staticMetadata.nextSteps,
          
          // Growth potential
          growthPotential: (aiMetadata?.growthPotential?.toLowerCase() as 'high' | 'medium' | 'low') || staticMetadata.growthPotential || 'medium',
          
          // Work environment
          workEnvironment: aiMetadata?.workEnvironment || staticMetadata.workEnvironment,
          
          // Education requirements
          education: aiMetadata?.education || staticMetadata.education,
          
          // Why explanation
          why: rec.why,
          
          // Resources - keep static for now
          resources: staticMetadata.resources || [],
          
          // New AI-powered fields
          marketTrends: aiMetadata?.marketTrends,
          topCompanies: aiMetadata?.topCompanies,
          jobSecurity: aiMetadata?.jobSecurity,
          workLifeBalance: aiMetadata?.workLifeBalance,
          
          // Detailed salary breakdown
          salaryBreakdown: aiMetadata?.salaryRange ? {
            entry: aiMetadata.salaryRange.entry,
            experienced: aiMetadata.salaryRange.experienced,
            senior: aiMetadata.salaryRange.senior
          } : undefined
        };
      });

      return {
        recommendations: enhancedRecommendations,
        confusionLevel: 'low'
      };
    }

    // For confused users, provide comprehensive adaptive response
    const primaryEnhanced: EnhancedCareerRecommendation[] = adaptiveResult.primaryRecommendations.map((rec: any) => {
      const staticMetadata = careerMetadata[rec.title] || {};
      
      return {
        title: rec.title,
        description: rec.description,
        category: staticMetadata.category || 'General',
        confidencePercent: rec.confidencePercent,
        matchScore: rec.confidencePercent,
        salaryRange: staticMetadata.salaryRange,
        skills: staticMetadata.skills,
        nextSteps: staticMetadata.nextSteps,
        growthPotential: staticMetadata.growthPotential || 'medium',
        workEnvironment: staticMetadata.workEnvironment,
        education: staticMetadata.education,
        why: rec.why,
        resources: staticMetadata.resources || [],
        adaptationNote: rec.adaptationNote // Include confusion-related notes
      };
    });

    const explorationEnhanced: EnhancedCareerRecommendation[] = adaptiveResult.explorationRecommendations?.map((rec: any) => ({
      title: rec.title,
      description: rec.description,
      category: rec.category || 'Exploration',
      confidencePercent: rec.confidencePercent,
      matchScore: rec.confidencePercent,
      why: rec.why,
      nextSteps: rec.nextSteps,
      resources: rec.resources || [],
      skills: ['Self-assessment', 'Research', 'Networking', 'Adaptability'],
      growthPotential: 'high' as const,
      workEnvironment: 'Various',
      education: 'Open to all backgrounds'
    })) || [];

    const specializedEnhanced: EnhancedCareerRecommendation[] = adaptiveResult.specializedRecommendations?.map((rec: any) => ({
      title: rec.title,
      description: rec.description,
      category: rec.category || 'Specialized',
      confidencePercent: rec.confidencePercent,
      matchScore: rec.confidencePercent,
      why: rec.why,
      nextSteps: rec.nextSteps || [],
      resources: rec.resources || [],
      skills: ['Versatility', 'Problem-solving', 'Communication'],
      growthPotential: 'medium' as const,
      workEnvironment: 'Varied',
      education: 'Flexible requirements'
    })) || [];

    return {
      recommendations: primaryEnhanced,
      confusionLevel: adaptiveResult.confusionLevel,
      explorationRecommendations: explorationEnhanced,
      specializedRecommendations: specializedEnhanced,
      clarificationQuestions: adaptiveResult.clarificationQuestions,
      explorationPath: adaptiveResult.explorationPath,
      guidance: adaptiveResult.guidance
    };

  } catch (error) {
    console.error('Error getting enhanced career recommendations:', error);
    
    // Fallback to default recommendations if everything fails
    return {
      recommendations: [
        {
          title: 'Career Exploration',
          description: 'Explore different career paths to find what interests you most.',
          category: 'General',
          confidencePercent: 70,
          matchScore: 70,
          ...careerMetadata['Career Exploration']
        }
      ],
      confusionLevel: 'medium',
      guidance: {
        message: "We couldn't process your full profile, but here are some exploration options:",
        priority: ['Complete a career assessment', 'Talk to a career counselor'],
        timeline: '1-3 months of exploration recommended'
      }
    };
  }
}
