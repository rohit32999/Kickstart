import React, { useState } from 'react';
import { CareerRecommendationCard } from './CareerRecommendationCard';

interface CareerRecommendation {
  title: string;
  description: string;
  why?: string;
  resources?: string[];
  confidencePercent?: number;
}

interface CareerRecommendationListProps {
  recommendations: CareerRecommendation[];
  onFeedback?: (title: string, feedback: string) => void;
}

export const CareerRecommendationList: React.FC<CareerRecommendationListProps> = ({ recommendations, onFeedback }) => {
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});

  const handleFeedbackChange = (title: string, feedback: string) => {
    setFeedbacks(prev => ({ ...prev, [title]: feedback }));
    if (onFeedback) onFeedback(title, feedback);
  };

  return (
    <div>
      {recommendations.map((rec, idx) => (
        <CareerRecommendationCard
          key={rec.title + idx}
          {...rec}
          feedback={feedbacks[rec.title]}
          onFeedbackChange={onFeedback ? (fb => handleFeedbackChange(rec.title, fb)) : undefined}
        />
      ))}
    </div>
  );
};
