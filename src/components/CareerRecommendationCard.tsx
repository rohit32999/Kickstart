import React from 'react';

interface CareerRecommendationCardProps {
  title: string;
  description: string;
  why?: string;
  resources?: string[];
  confidencePercent?: number;
  feedback?: string;
  onFeedbackChange?: (feedback: string) => void;
}

export const CareerRecommendationCard: React.FC<CareerRecommendationCardProps> = ({
  title,
  description,
  why,
  resources,
  confidencePercent,
  feedback,
  onFeedbackChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-indigo-700 dark:text-yellow-400 mb-2">{title}</h3>
      <p className="mb-2 text-gray-700 dark:text-gray-200">{description}</p>
      {typeof confidencePercent === 'number' && (
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold text-green-700 dark:text-green-300">Recommendation Strength:</span>
          <span className="text-xs font-bold">{confidencePercent}%</span>
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded ml-2">
            <div
              className="h-2 rounded bg-green-500 dark:bg-green-400"
              style={{ width: `${confidencePercent}%`, minWidth: 8, maxWidth: '100%' }}
            ></div>
          </div>
        </div>
      )}
      {why && (
        <div className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">Why this? {why.replace(/Confidence: [0-9.]+/, "")}</div>
      )}
      {resources && resources.length > 0 && (
        <div className="mb-2">
          <div className="font-semibold text-sm text-indigo-600 dark:text-yellow-300">Learning Pathways:</div>
          <ul className="list-disc ml-6 mt-1">
            {resources.map((res, idx) => (
              <li key={idx} className="text-xs text-gray-600 dark:text-gray-300">{res}</li>
            ))}
          </ul>
        </div>
      )}
      {onFeedbackChange && (
        <div className="mt-3">
          <label className="block text-xs font-medium mb-1">Your Feedback:</label>
          <input
            type="text"
            value={feedback || ''}
            onChange={e => onFeedbackChange(e.target.value)}
            className="w-full px-2 py-1 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-600 text-sm"
            placeholder="What do you think about this recommendation?"
          />
        </div>
      )}
    </div>
  );
};
