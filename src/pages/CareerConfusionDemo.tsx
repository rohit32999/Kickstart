// Demo page for the Comprehensive Career Confusion Handling System
import React, { useState } from 'react';
import ComprehensiveCareerSystem from '../components/ComprehensiveCareerSystem';

const CareerConfusionDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<string>('standard');

  const demoScenarios = {
    standard: {
      title: "Standard User",
      description: "A user with clear interests and goals",
      initialInput: {
        interests: "I'm interested in technology, programming, and solving complex problems. I enjoy working with data and creating innovative solutions.",
        hobbies: "Coding personal projects, reading tech blogs, participating in hackathons, playing strategy games",
        academicDetails: "Computer Science degree, strong in mathematics and algorithms",
        iqScore: 120
      }
    },
    confused: {
      title: "Confused User",
      description: "A user with scattered interests and uncertainty",
      initialInput: {
        interests: "I like many things - art, science, business, helping people. I'm not sure what I want to do.",
        hobbies: "Reading, painting, volunteering, learning new things, but I get bored easily",
        academicDetails: "Liberal arts degree, decent grades but no clear specialization",
        additionalInfo: "I feel overwhelmed by all the career options. Everyone else seems to know what they want to do, but I'm still confused.",
        iqScore: 110
      }
    },
    paralyzed: {
      title: "Decision Paralyzed User",
      description: "A user with analysis paralysis and perfectionism",
      initialInput: {
        interests: "I want the perfect career that combines creativity, financial security, work-life balance, and social impact. Nothing seems to check all the boxes.",
        hobbies: "Researching career options, taking online quizzes, reading about different professions",
        academicDetails: "Double major in Psychology and Business, high GPA, but still unsure",
        additionalInfo: "I've been researching careers for years but can't make a decision. I'm paralyzed by the fear of choosing wrong. I need the perfect job that won't disappoint me.",
        iqScore: 125
      }
    },
    cultural: {
      title: "Cultural Conflict User",
      description: "A user dealing with family expectations and cultural pressures",
      initialInput: {
        interests: "I love creative writing, film, and storytelling, but my family expects me to pursue medicine or engineering for job security.",
        hobbies: "Writing short stories, making videos, creative projects",
        academicDetails: "Pre-med student with good grades, but my heart isn't in it",
        additionalInfo: "My family immigrated here and sacrificed a lot. They expect me to become a doctor, but I'm passionate about creative fields. I feel torn between honoring my family and following my dreams.",
        iqScore: 115
      }
    },
    imposter: {
      title: "Imposter Syndrome User",
      description: "A user struggling with self-doubt and feeling unqualified",
      initialInput: {
        interests: "I'm interested in leadership roles and making a difference, but I don't think I'm smart or qualified enough.",
        hobbies: "Reading about successful people, taking online courses, but rarely finishing them",
        academicDetails: "Average grades, state university, nothing special about my background",
        additionalInfo: "I feel like a fraud. Everyone around me seems more talented and deserving. I don't think I'm qualified for any meaningful career. I compare myself to others constantly and always come up short.",
        iqScore: 105
      }
    },
    economic: {
      title: "Economic Constraints User",
      description: "A user with financial pressures affecting career choices",
      initialInput: {
        interests: "I'd love to pursue social work or teaching, but I need a career that pays well to support my family and pay off student loans.",
        hobbies: "Volunteering at community center, tutoring kids, reading about social issues",
        academicDetails: "Sociology degree with significant student debt",
        additionalInfo: "I'm the first in my family to go to college. I have student loans and need to help support my parents. I want to make a difference, but I also need financial stability. I feel guilty for prioritizing money over passion.",
        iqScore: 110
      }
    }
  };

  const handleRecommendationSelect = (recommendation: any) => {
    console.log('Selected recommendation:', recommendation);
    // In a real app, this might navigate to a detailed career page or save the selection
  };

  const handleTherapeuticSupport = () => {
    alert('In a real application, this would connect the user to professional career counseling or therapeutic support resources.');
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            🧠 Advanced Career Confusion Handling System Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Demonstrating sophisticated career guidance for complex user scenarios
          </p>
        </div>
      </div>

      {/* Demo Scenario Selector */}
      <div className="max-w-6xl mx-auto px-6 py-6">        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Choose a Demo Scenario</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(demoScenarios).map(([key, scenario]) => (
              <div
                key={key}
                onClick={() => setSelectedDemo(key)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedDemo === key 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                }`}
              >
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{scenario.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{scenario.description}</p>
              </div>
            ))}
          </div>          {/* Selected Scenario Details */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
              Current Scenario: {demoScenarios[selectedDemo as keyof typeof demoScenarios].title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {demoScenarios[selectedDemo as keyof typeof demoScenarios].description}
            </p>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p><strong>Sample Input:</strong></p>
              <p className="mt-1">
                <strong>Interests:</strong> {demoScenarios[selectedDemo as keyof typeof demoScenarios].initialInput.interests.substring(0, 100)}...
              </p>              {('additionalInfo' in demoScenarios[selectedDemo as keyof typeof demoScenarios].initialInput) && (
                <p className="mt-1">
                  <strong>Complex Situation:</strong> {(demoScenarios[selectedDemo as keyof typeof demoScenarios].initialInput as any).additionalInfo?.substring(0, 100)}...
                </p>
              )}
            </div>
          </div>
        </div>        {/* System Features Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">System Features Demonstrated</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Confusion Detection</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Automatically identifies user confusion patterns</p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🧠</div>
              <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Psychological Support</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Addresses anxiety, perfectionism, imposter syndrome</p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🌍</div>
              <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Cultural Awareness</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Handles family expectations and cultural conflicts</p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Economic Reality</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Considers financial constraints and practical needs</p>
            </div>
          </div>
        </div>

        {/* Comprehensive Career System */}
        <ComprehensiveCareerSystem
          initialInput={demoScenarios[selectedDemo as keyof typeof demoScenarios].initialInput}
          onRecommendationSelect={handleRecommendationSelect}
          onTherapeuticSupport={handleTherapeuticSupport}
        />
      </div>
    </div>
  );
};

export default CareerConfusionDemo;
