// Comprehensive Career Recommendation System Integration
// Combines standard recommendations, advanced confusion handling, and sophisticated UI

import React, { useState } from 'react';
import { CareerInput, EnhancedCareerResponse, getEnhancedCareerRecommendations } from '../pages/enhancedCareerRecommendation';
import { AdvancedConfusedUserUI } from './AdvancedConfusedUserUI';
import EnhancedCareerRecommendationList from './EnhancedCareerRecommendationList';
import { PersonalityProfileForm } from './PersonalityProfileForm';

interface ComprehensiveCareerSystemProps {
  initialInput?: Partial<CareerInput>;
  onRecommendationSelect?: (recommendation: any) => void;
  onTherapeuticSupport?: () => void;
}

export const ComprehensiveCareerSystem: React.FC<ComprehensiveCareerSystemProps> = ({
  initialInput,
  onRecommendationSelect,
  onTherapeuticSupport
}) => {
  const [careerInput, setCareerInput] = useState<CareerInput>({
    iqScore: 100,
    hobbies: '',
    interests: '',
    academicDetails: '',
    location: '',
    keywords: '',
    useAI: true,
    additionalInfo: '',
    personality: {
      introvertExtrovert: '',
      leadership: '',
      creativity: '',
      riskTolerance: '',
      communication: ''
    },
    ...initialInput
  });

  const [recommendations, setRecommendations] = useState<EnhancedCareerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'input' | 'results'>('input');
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);

  // Auto-detect if user needs advanced confusion handling
  const needsAdvancedHandling = () => {
    const textInput = `${careerInput.hobbies} ${careerInput.interests} ${careerInput.additionalInfo || ''}`.toLowerCase();
    
    const advancedIndicators = [
      'paralyzed', 'stuck', 'overwhelmed', 'too many options', 'analysis paralysis',
      'perfectionist', 'perfect job', 'imposter', 'not qualified', 'not good enough',
      'cultural', 'family expects', 'traditional', 'pressure',
      'complex', 'complicated', 'unique situation', 'unusual background'
    ];

    return advancedIndicators.some(indicator => textInput.includes(indicator));
  };  const handleInputSubmit = async () => {
    if (!careerInput.interests || !careerInput.hobbies) {
      setError('Please fill in your interests and hobbies to get recommendations.');
      return;
    }

    console.log('🚀 Starting career recommendation process with input:', careerInput);
    setLoading(true);
    setError(null);

    try {
      console.log('📡 Calling getEnhancedCareerRecommendations...');
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - taking too long')), 15000)
      );
      
      const recommendationPromise = getEnhancedCareerRecommendations(careerInput);
      
      const result = await Promise.race([recommendationPromise, timeoutPromise]);
      console.log('✅ Received recommendations result:', result);
      
      if (!result) {
        throw new Error('No response received from recommendation system');
      }
      
      if (!result.recommendations) {
        console.warn('⚠️ No recommendations field in result:', result);
        throw new Error('Invalid response format - no recommendations found');
      }
      
      if (result.recommendations.length === 0) {
        throw new Error('No career recommendations were generated - please try different inputs');
      }
      
      setRecommendations(result);
      setCurrentStep('results');
      console.log('🎯 Successfully set recommendations and switched to results view');
    } catch (err: any) {
      console.error('❌ Error getting recommendations:', err);
      setError(`Failed to get career recommendations: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
      console.log('🔄 Loading state set to false');
    }
  };

  const handleClarificationAnswer = (answers: Record<string, string>) => {
    // Update input with clarification answers
    const additionalInfo = Object.entries(answers)
      .map(([question, answer]) => `${question}: ${answer}`)
      .join(' | ');
    
    setCareerInput(prev => ({
      ...prev,
      additionalInfo: `${prev.additionalInfo || ''} ${additionalInfo}`.trim()
    }));

    // Re-run recommendations with updated input
    handleInputSubmit();
  };

  // Direct API test function that bypasses complex state management
  const handleDirectAPITest = async () => {
    console.log('🧪 Running direct API test...');
    setLoading(true);
    setError(null);

    try {
      const testInput = {
        iqScore: 100,
        hobbies: careerInput.hobbies || 'listening music',
        interests: careerInput.interests || 'books',
        academicDetails: careerInput.academicDetails || 'I am in 12th standard now',
        keywords: careerInput.keywords || 'Become a doctor',
        location: careerInput.location || '',
        useAI: true,
        additionalInfo: careerInput.additionalInfo || '',
        personality: {
          introvertExtrovert: '',
          leadership: '',
          creativity: '',
          riskTolerance: '',
          communication: ''
        }
      };

      console.log('🚀 Direct API call with:', testInput);
      
      const response = await fetch('http://localhost:5001/api/career-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testInput)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Direct API response:', data);      // Create a simple recommendations response
      const simpleResponse: EnhancedCareerResponse = {
        recommendations: data.recommendations.map((rec: any) => ({
          title: rec.title,
          description: rec.description,
          category: rec.metadata?.category || 'General',
          confidencePercent: rec.confidencePercent || 70,
          matchScore: rec.confidencePercent || 70,
          salaryRange: rec.metadata?.salaryRange?.experienced || 'Competitive',
          skills: rec.metadata?.skills || [],
          nextSteps: rec.metadata?.nextSteps || [],
          growthPotential: (rec.metadata?.growthPotential as 'high' | 'medium' | 'low') || 'medium',
          workEnvironment: rec.metadata?.workEnvironment || 'Various',
          education: rec.metadata?.education || 'As required',
          why: rec.why || 'AI-powered recommendation',
          resources: rec.metadata?.resources || []
        })),
        confusionLevel: 'low' as const
      };

      setRecommendations(simpleResponse);
      setCurrentStep('results');
      console.log('🎯 Direct API test successful - switched to results');
    } catch (err: any) {
      console.error('❌ Direct API test failed:', err);
      setError(`Direct API test failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExplorationChoice = (choice: string) => {
    if (onRecommendationSelect) {
      onRecommendationSelect({ title: choice, type: 'exploration' });
    }
  };

  const handleTherapeuticSupportClick = () => {
    if (onTherapeuticSupport) {
      onTherapeuticSupport();
    } else {
      // Default action - open therapeutic resources
      window.open('https://www.psychologytoday.com/us/therapists', '_blank');
    }
  };
  const renderInputForm = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-xl">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          🎯 Comprehensive Career Guidance System
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
          Get personalized career recommendations with advanced support for complex situations, 
          cultural considerations, and psychological factors.
        </p>

        <div className="grid md:grid-cols-2 gap-6">          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Interests *
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                value={careerInput.interests}
                onChange={(e) => setCareerInput(prev => ({ ...prev, interests: e.target.value }))}
                placeholder="What topics, activities, or fields genuinely interest you?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Hobbies *
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                value={careerInput.hobbies}
                onChange={(e) => setCareerInput(prev => ({ ...prev, hobbies: e.target.value }))}
                placeholder="What do you enjoy doing in your free time?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Academic Background
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={2}
                value={careerInput.academicDetails}
                onChange={(e) => setCareerInput(prev => ({ ...prev, academicDetails: e.target.value }))}
                placeholder="Your education, qualifications, and academic achievements"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={careerInput.location}
                onChange={(e) => setCareerInput(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, Country or Region"
              />
            </div>
          </div>          {/* Advanced Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Additional Context</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Any Specific Challenges or Complex Situations?
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={4}
                value={careerInput.additionalInfo}
                onChange={(e) => setCareerInput(prev => ({ ...prev, additionalInfo: e.target.value }))}
                placeholder="e.g., feeling overwhelmed by options, cultural/family expectations, perfectionism, imposter syndrome, analysis paralysis, economic constraints, etc."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This helps us provide specialized guidance for complex situations
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keywords or Specific Interests
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={careerInput.keywords}
                onChange={(e) => setCareerInput(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="technology, healthcare, creative, business, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                IQ Score (Optional)
              </label>
              <input
                type="number"
                min="70"
                max="200"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={careerInput.iqScore}
                onChange={(e) => setCareerInput(prev => ({ ...prev, iqScore: parseInt(e.target.value) || 100 }))}
                placeholder="100"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useAI"
                checked={careerInput.useAI}
                onChange={(e) => setCareerInput(prev => ({ ...prev, useAI: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="useAI" className="text-sm text-gray-700 dark:text-gray-300">
                Use AI-powered recommendations
              </label>
            </div>
          </div>
        </div>        {/* Personality Profile Toggle */}
        <div className="mt-8">
          <button
            onClick={() => setShowAdvancedForm(!showAdvancedForm)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            {showAdvancedForm ? '▼' : '▶'} Advanced Personality Profile (Optional)
          </button>
            {showAdvancedForm && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <PersonalityProfileForm
                onSubmit={(personality) => setCareerInput(prev => ({ ...prev, personality }))}
              />
            </div>
          )}
        </div>        {/* Advanced Guidance Detection */}
        {needsAdvancedHandling() && (
          <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <span className="text-amber-600 dark:text-amber-400 text-lg">💡</span>
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-300">Advanced Guidance Detected</h4>
                <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                  Based on your input, our system will provide specialized support for complex career decisions, 
                  including psychological support, cultural considerations, and structured exploration approaches.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="mt-8 text-center space-y-4">
          <button
            onClick={handleInputSubmit}
            disabled={loading || !careerInput.interests || !careerInput.hobbies}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-medium"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generating Recommendations...</span>
              </span>
            ) : (
              'Get My Career Recommendations'
            )}
          </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
            or
          </div>
          
          <button
            onClick={handleDirectAPITest}
            disabled={loading || !careerInput.interests || !careerInput.hobbies}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            🧪 Direct API Test (Fast)
          </button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Having issues with recommendations getting stuck? Try the Direct API Test for a faster, simplified recommendation process.
          </p>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!recommendations) return null;    // Check if user needs advanced confusion handling
    const needsAdvancedUI = recommendations.confusionLevel === 'extreme' || 
                           (recommendations.psychologicalSupport && recommendations.psychologicalSupport.length > 0) ||
                           (recommendations.culturalAdaptations && recommendations.culturalAdaptations.length > 0) ||
                           needsAdvancedHandling();

    if (needsAdvancedUI) {
      // Use advanced confused user interface
      return (
        <AdvancedConfusedUserUI
          confusionResponse={{
            primaryRecommendations: recommendations.recommendations.map(rec => ({
              title: rec.title,
              description: rec.description,
              confidencePercent: rec.confidencePercent || 70,
              why: rec.why || '',
              adaptationNote: rec.adaptationNote,
              category: rec.category,
              nextSteps: rec.nextSteps,
              resources: rec.resources,
              therapeuticApproach: rec.therapeuticApproach,
              explorationFocus: rec.explorationFocus,
              timelineFlexible: rec.timelineFlexible,
              psychologicalSupport: rec.psychologicalSupport,
              culturalConsiderations: rec.culturalConsiderations,
              economicRealistic: rec.economicRealistic
            })),
            explorationRecommendations: recommendations.explorationRecommendations?.map(rec => ({
              title: rec.title,
              description: rec.description,
              confidencePercent: rec.confidencePercent || 70,
              why: rec.why || '',
              nextSteps: rec.nextSteps,
              resources: rec.resources,
              therapeuticApproach: rec.therapeuticApproach,
              explorationFocus: true
            })) || [],
            therapeuticRecommendations: recommendations.specializedRecommendations?.map(rec => ({
              title: rec.title,
              description: rec.description,
              confidencePercent: rec.confidencePercent || 70,
              why: rec.why || '',
              nextSteps: rec.nextSteps,
              therapeuticApproach: true
            })) || [],
            clarificationQuestions: recommendations.clarificationQuestions || [],
            explorationPath: recommendations.explorationPath || [],
            psychologicalSupport: recommendations.psychologicalSupport || [],
            culturalAdaptations: recommendations.culturalAdaptations || [],
            economicRealities: recommendations.economicRealities || [],            guidance: {
              message: recommendations.guidance?.message || "Let's work together to find your career direction.",
              priority: recommendations.guidance?.priority || ["Complete self-assessment", "Explore options systematically"],
              timeline: recommendations.guidance?.timeline || "Take your time - this is a journey",
              supportSystems: recommendations.guidance?.supportSystems || ["Professional guidance", "Peer support"],
              warningFlags: recommendations.guidance?.warningFlags || []
            }
          }}
          onClarificationAnswer={handleClarificationAnswer}
          onExplorationChoice={handleExplorationChoice}
          onTherapeuticSupport={handleTherapeuticSupportClick}
        />
      );
    } else {      // Use standard enhanced recommendation interface
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Career Recommendations</h2>
            <button
              onClick={() => setCurrentStep('input')}
              className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Edit Profile
            </button>
          </div><EnhancedCareerRecommendationList
            recommendations={recommendations.recommendations}
          />          {recommendations.explorationRecommendations && recommendations.explorationRecommendations.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Exploration Options</h3>              <EnhancedCareerRecommendationList
                recommendations={recommendations.explorationRecommendations}
              />
            </div>
          )}
        </div>
      );
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {currentStep === 'input' && renderInputForm()}
      {currentStep === 'results' && renderResults()}
    </div>
  );
};

export default ComprehensiveCareerSystem;
