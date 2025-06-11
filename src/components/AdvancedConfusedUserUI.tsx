// Advanced Confused User Interface Component
// Sophisticated UI for handling complex career confusion scenarios with psychological support

import React, { useState, useEffect } from 'react';
import { ComprehensiveCareerResponse, AdvancedAdaptiveRecommendation } from '../utils/advancedCareerConfusionHandler';

interface AdvancedConfusedUserUIProps {
  confusionResponse: ComprehensiveCareerResponse;
  onClarificationAnswer: (answers: Record<string, string>) => void;
  onExplorationChoice: (choice: string) => void;
  onTherapeuticSupport: () => void;
}

export const AdvancedConfusedUserUI: React.FC<AdvancedConfusedUserUIProps> = ({
  confusionResponse,
  onClarificationAnswer,
  onExplorationChoice,
  onTherapeuticSupport
}) => {
  const [currentStep, setCurrentStep] = useState<'guidance' | 'clarification' | 'recommendations' | 'support'>('guidance');
  const [clarificationAnswers, setClarificationAnswers] = useState<Record<string, string>>({});
  const [selectedTab, setSelectedTab] = useState<'primary' | 'exploration' | 'therapeutic'>('primary');
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Show warning modal for severe confusion cases
  useEffect(() => {
    if (confusionResponse.guidance.warningFlags.length > 0) {
      setShowWarningModal(true);
    }
  }, [confusionResponse]);

  const getConfusionLevelColor = (level: string) => {
    switch (level) {
      case 'paralyzed': return 'bg-red-100 border-red-500 text-red-800';
      case 'complex': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'extreme': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'high': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-green-100 border-green-500 text-green-800';
    }
  };

  const getConfusionIcon = (level: string) => {
    switch (level) {
      case 'paralyzed': return '🚨';
      case 'complex': return '🧩';
      case 'extreme': return '🌪️';
      case 'high': return '🤔';
      default: return '💡';
    }
  };

  const renderGuidanceStep = () => (
    <div className="space-y-6">
      {/* Confusion Level Indicator */}
      <div className={`p-4 rounded-lg border-l-4 ${getConfusionLevelColor('high')}`}>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getConfusionIcon('high')}</span>
          <div>
            <h3 className="font-semibold text-lg">Career Confusion Detected</h3>
            <p className="text-sm opacity-80">{confusionResponse.guidance.message}</p>
          </div>
        </div>
      </div>

      {/* Priority Actions */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-3">🎯 Priority Actions</h4>
        <ul className="space-y-2">
          {confusionResponse.guidance.priority.map((action, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="text-blue-800">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Timeline */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-2">⏰ Recommended Timeline</h4>
        <p className="text-purple-800">{confusionResponse.guidance.timeline}</p>
      </div>

      {/* Support Systems */}
      {confusionResponse.guidance.supportSystems.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">🤝 Support Systems</h4>
          <div className="flex flex-wrap gap-2">
            {confusionResponse.guidance.supportSystems.map((system, index) => (
              <span key={index} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
                {system}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Warning Flags */}
      {confusionResponse.guidance.warningFlags.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-2">⚠️ Important Considerations</h4>
          <ul className="space-y-1">
            {confusionResponse.guidance.warningFlags.map((flag, index) => (
              <li key={index} className="text-red-800 text-sm">• {flag}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={() => setCurrentStep('clarification')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Clarification Process
        </button>
        
        {confusionResponse.therapeuticRecommendations.length > 0 && (
          <button
            onClick={onTherapeuticSupport}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Get Professional Support
          </button>
        )}
      </div>
    </div>
  );

  const renderClarificationStep = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">🎯 Let's Clarify Your Direction</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          These questions will help us better understand your unique situation and provide more targeted guidance.
        </p><div className="space-y-4">
          {confusionResponse.clarificationQuestions.map((question, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {question}
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                value={clarificationAnswers[question] || ''}
                onChange={(e) => setClarificationAnswers({
                  ...clarificationAnswers,
                  [question]: e.target.value
                })}
                placeholder="Take your time to reflect and answer honestly..."
              />
            </div>
          ))}
        </div>

        {/* Psychological Support Tips */}
        {confusionResponse.psychologicalSupport.length > 0 && (
          <div className="mt-6 bg-amber-50 p-4 rounded-lg">
            <h4 className="font-semibold text-amber-900 mb-2">🧠 Psychological Support Tips</h4>
            <ul className="space-y-1">
              {confusionResponse.psychologicalSupport.map((tip, index) => (
                <li key={index} className="text-amber-800 text-sm">• {tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Cultural Adaptations */}
        {confusionResponse.culturalAdaptations.length > 0 && (
          <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold text-indigo-900 mb-2">🌍 Cultural Considerations</h4>
            <ul className="space-y-1">
              {confusionResponse.culturalAdaptations.map((adaptation, index) => (
                <li key={index} className="text-indigo-800 text-sm">• {adaptation}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Economic Realities */}
        {confusionResponse.economicRealities.length > 0 && (
          <div className="mt-4 bg-emerald-50 p-4 rounded-lg">
            <h4 className="font-semibold text-emerald-900 mb-2">💰 Economic Considerations</h4>
            <ul className="space-y-1">
              {confusionResponse.economicRealities.map((reality, index) => (
                <li key={index} className="text-emerald-800 text-sm">• {reality}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => {
              onClarificationAnswer(clarificationAnswers);
              setCurrentStep('recommendations');
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={Object.keys(clarificationAnswers).length === 0}
          >
            Continue to Recommendations
          </button>
          <button
            onClick={() => setCurrentStep('guidance')}
            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            Back to Guidance
          </button>
        </div>
      </div>
    </div>
  );
  const renderRecommendationCard = (rec: AdvancedAdaptiveRecommendation, index: number) => (
    <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{rec.title}</h4>
        <div className="flex items-center space-x-2">
          {rec.therapeuticApproach && (
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
              Therapeutic
            </span>
          )}
          {rec.explorationFocus && (
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
              Exploration
            </span>
          )}
          {rec.timelineFlexible && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              Flexible
            </span>
          )}
        </div>
      </div>      <p className="text-gray-600 dark:text-gray-300 mb-4">{rec.description}</p>

      {rec.adaptationNote && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-3 mb-4">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">
            <strong>Note:</strong> {rec.adaptationNote}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Why this fits:</span>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.why}</p>
        </div>

        {rec.nextSteps && rec.nextSteps.length > 0 && (
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Next Steps:</span>
            <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">{rec.nextSteps.map((step, stepIndex) => (
                <li key={stepIndex}>• {step}</li>
              ))}
            </ul>
          </div>
        )}

        {rec.psychologicalSupport && rec.psychologicalSupport.length > 0 && (
          <div>
            <span className="text-sm font-medium text-purple-700">Psychological Support:</span>
            <ul className="text-sm text-purple-600 mt-1 space-y-1">
              {rec.psychologicalSupport.map((support, supportIndex) => (
                <li key={supportIndex}>• {support}</li>
              ))}
            </ul>
          </div>
        )}

        {rec.culturalConsiderations && rec.culturalConsiderations.length > 0 && (
          <div>
            <span className="text-sm font-medium text-indigo-700">Cultural Considerations:</span>
            <ul className="text-sm text-indigo-600 mt-1 space-y-1">
              {rec.culturalConsiderations.map((consideration, consIndex) => (
                <li key={consIndex}>• {consideration}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${rec.confidencePercent}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">{rec.confidencePercent}%</span>
        </div>
        
        <button
          onClick={() => onExplorationChoice(rec.title)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Explore This
        </button>
      </div>
    </div>
  );

  const renderRecommendationsStep = () => (
    <div className="space-y-6">      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button
          onClick={() => setSelectedTab('primary')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'primary' 
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
          }`}
        >
          Primary Recommendations ({confusionResponse.primaryRecommendations.length})
        </button>
        {confusionResponse.explorationRecommendations.length > 0 && (
          <button
            onClick={() => setSelectedTab('exploration')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'exploration' 
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            Exploration Options ({confusionResponse.explorationRecommendations.length})
          </button>
        )}
        {confusionResponse.therapeuticRecommendations.length > 0 && (
          <button
            onClick={() => setSelectedTab('therapeutic')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'therapeutic' 
                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            Therapeutic Support ({confusionResponse.therapeuticRecommendations.length})
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {selectedTab === 'primary' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🎯 Primary Career Recommendations
            </h3>
            <div className="grid gap-4">
              {confusionResponse.primaryRecommendations.map((rec, index) => 
                renderRecommendationCard(rec, index)
              )}
            </div>
          </div>
        )}

        {selectedTab === 'exploration' && confusionResponse.explorationRecommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🔍 Exploration and Discovery Options
            </h3>
            <div className="grid gap-4">
              {confusionResponse.explorationRecommendations.map((rec, index) => 
                renderRecommendationCard(rec, index)
              )}
            </div>
          </div>
        )}

        {selectedTab === 'therapeutic' && confusionResponse.therapeuticRecommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🧠 Therapeutic and Support Options
            </h3>
            <div className="grid gap-4">
              {confusionResponse.therapeuticRecommendations.map((rec, index) => 
                renderRecommendationCard(rec, index)
              )}
            </div>
          </div>
        )}
      </div>

      {/* Exploration Path */}
      {confusionResponse.explorationPath.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">🗺️ Your Exploration Path</h4>
          <div className="space-y-2">
            {confusionResponse.explorationPath.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={() => setCurrentStep('clarification')}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Back to Clarification
        </button>
        <button
          onClick={() => setCurrentStep('support')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Find Support Resources
        </button>
      </div>
    </div>
  );

  const renderSupportStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">🤝 Support Resources</h3>

      {/* Professional Support */}
      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-3">Professional Support</h4>
        <div className="space-y-2">
          <p className="text-purple-800">• Career counselors and therapists</p>
          <p className="text-purple-800">• Decision-making specialists</p>
          <p className="text-purple-800">• Cultural integration counselors</p>
        </div>
        <button
          onClick={onTherapeuticSupport}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
          Find Professional Help
        </button>
      </div>

      {/* Self-Help Resources */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-3">Self-Help Resources</h4>
        <div className="space-y-2">
          <p className="text-blue-800">• Career assessment tools</p>
          <p className="text-blue-800">• Decision-making frameworks</p>
          <p className="text-blue-800">• Mindfulness and anxiety management</p>
        </div>
      </div>

      {/* Community Support */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-3">Community Support</h4>
        <div className="space-y-2">
          <p className="text-green-800">• Career exploration groups</p>
          <p className="text-green-800">• Professional networking events</p>
          <p className="text-green-800">• Mentorship programs</p>
        </div>
      </div>
    </div>
  );
  // Warning Modal for Severe Cases
  const WarningModal = () => (
    showWarningModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">Important Notice</h3>
          </div>
          
          <div className="space-y-3 mb-6">
            {confusionResponse.guidance.warningFlags.map((flag, index) => (
              <p key={index} className="text-red-700 dark:text-red-400 text-sm">{flag}</p>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                setShowWarningModal(false);
                onTherapeuticSupport();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Get Professional Help
            </button>
            <button
              onClick={() => setShowWarningModal(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <WarningModal />
      
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {['guidance', 'clarification', 'recommendations', 'support'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              {index < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  ['clarification', 'recommendations', 'support'].indexOf(currentStep) > index - 1
                    ? 'bg-blue-600' 
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Guidance</span>
          <span>Clarification</span>
          <span>Recommendations</span>
          <span>Support</span>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'guidance' && renderGuidanceStep()}
      {currentStep === 'clarification' && renderClarificationStep()}
      {currentStep === 'recommendations' && renderRecommendationsStep()}
      {currentStep === 'support' && renderSupportStep()}
    </div>
  );
};

export default AdvancedConfusedUserUI;
