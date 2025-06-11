export interface CareerInsights {
  salaryRange: {
    entryLevel: { usd: string; inr: string };
    experienced: { usd: string; inr: string };
  };
  inDemandRoles: string[];
  requiredSkills: string[];
  qualifications: string[];
  growthProspects: {
    rating: string;
    explanation: string;
  };
}

export interface CareerRecommendationCardProps {
  title: string;
  description: string;
  why?: string;
  resources?: string[];
  confidencePercent?: number;
  feedback?: string;
  onFeedbackChange?: (feedback: string) => void;
  insights?: CareerInsights;
}
