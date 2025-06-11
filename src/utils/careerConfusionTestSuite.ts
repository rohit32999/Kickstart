// Career Confusion System Test Suite
// Validates all confusion detection and recommendation logic

import { analyzeCareerConfusion, integrateConfusionHandling } from '../utils/careerConfusionHandler';
import { analyzeAdvancedCareerConfusion, integrateAdvancedConfusionHandling } from '../utils/advancedCareerConfusionHandler';

// Test data for different user scenarios
export const testScenarios = {
  clearUser: {
    iqScore: 120,
    hobbies: "Programming, building apps, contributing to open source projects, reading tech documentation",
    interests: "Software development, artificial intelligence, machine learning, solving complex problems",
    academicDetails: "Computer Science degree with focus on AI and algorithms",
    personality: {
      introvertExtrovert: 'introvert',
      leadership: 'medium',
      creativity: 'high',
      riskTolerance: 'medium',
      communication: 'medium'
    }
  },

  confusedUser: {
    iqScore: 110,
    hobbies: "Reading various topics, trying different things, learning new skills but getting bored",
    interests: "I like many things - art, science, business, helping people. Not sure what to focus on.",
    academicDetails: "Liberal arts degree, decent grades but no clear specialization",
    additionalInfo: "I feel overwhelmed by all the career options. Everyone else seems to know what they want to do.",
    personality: {
      introvertExtrovert: 'ambivert',
      leadership: '',
      creativity: 'high',
      riskTolerance: '',
      communication: 'medium'
    }
  },

  paralyzedUser: {
    iqScore: 125,
    hobbies: "Researching career options, taking online quizzes, reading about different professions",
    interests: "I want the perfect career that combines creativity, financial security, work-life balance, and social impact",
    academicDetails: "Double major in Psychology and Business, high GPA, but still unsure",
    additionalInfo: "I've been researching careers for years but can't make a decision. I'm paralyzed by the fear of choosing wrong. I need the perfect job.",
    personality: {
      introvertExtrovert: 'introvert',
      leadership: 'high',
      creativity: 'high',
      riskTolerance: 'low',
      communication: 'high'
    }
  },

  culturalConflictUser: {
    iqScore: 115,
    hobbies: "Writing short stories, making videos, creative projects, but hiding them from family",
    interests: "I love creative writing, film, and storytelling, but my family expects me to pursue medicine or engineering",
    academicDetails: "Pre-med student with good grades, but my heart isn't in it",
    additionalInfo: "My family immigrated here and sacrificed a lot. They expect me to become a doctor, but I'm passionate about creative fields. I feel torn between honoring my family and following my dreams.",
    personality: {
      introvertExtrovert: 'introvert',
      leadership: 'low',
      creativity: 'high',
      riskTolerance: 'medium',
      communication: 'medium'
    }
  },

  imposterUser: {
    iqScore: 105,
    hobbies: "Reading about successful people, taking online courses but rarely finishing them",
    interests: "I'm interested in leadership roles and making a difference, but I don't think I'm smart or qualified enough",
    academicDetails: "Average grades, state university, nothing special about my background",
    additionalInfo: "I feel like a fraud. Everyone around me seems more talented and deserving. I don't think I'm qualified for any meaningful career. I compare myself to others constantly.",
    personality: {
      introvertExtrovert: 'introvert',
      leadership: 'low',
      creativity: 'medium',
      riskTolerance: 'low',
      communication: 'low'
    }
  },

  economicConstraintUser: {
    iqScore: 110,
    hobbies: "Volunteering at community center, tutoring kids, reading about social issues",
    interests: "I'd love to pursue social work or teaching, but I need a career that pays well to support my family",
    academicDetails: "Sociology degree with significant student debt",
    additionalInfo: "I'm the first in my family to go to college. I have student loans and need to help support my parents. I want to make a difference, but I also need financial stability.",
    personality: {
      introvertExtrovert: 'extrovert',
      leadership: 'medium',
      creativity: 'medium',
      riskTolerance: 'low',
      communication: 'high'
    }
  }
};

// Expected results for validation
export const expectedResults = {
  clearUser: {
    confusionLevel: 'low',
    shouldUseAdvanced: false,
    recommendationCount: 3-5
  },
  confusedUser: {
    confusionLevel: 'medium',
    shouldUseAdvanced: false,
    recommendationCount: 3-6
  },
  paralyzedUser: {
    confusionLevel: 'extreme',
    shouldUseAdvanced: true,
    hasTherapeuticRecommendations: true
  },
  culturalConflictUser: {
    confusionLevel: 'high',
    shouldUseAdvanced: true,
    hasCulturalAdaptations: true
  },
  imposterUser: {
    confusionLevel: 'high',
    shouldUseAdvanced: true,
    hasPsychologicalSupport: true
  },
  economicConstraintUser: {
    confusionLevel: 'medium',
    shouldUseAdvanced: true,
    hasEconomicRealities: true
  }
};

// Test runner class
export class CareerConfusionTestSuite {
  private results: any[] = [];

  async runAllTests(): Promise<TestResults> {
    console.log('🧪 Starting Career Confusion System Test Suite...\n');
    
    const testResults: TestResults = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };

    for (const [scenarioName, testData] of Object.entries(testScenarios)) {
      const result = await this.testScenario(scenarioName, testData);
      testResults.details.push(result);
      testResults.total++;
      
      if (result.passed) {
        testResults.passed++;
      } else {
        testResults.failed++;
      }
    }

    this.printSummary(testResults);
    return testResults;
  }

  private async testScenario(scenarioName: string, input: any): Promise<TestResult> {
    console.log(`📋 Testing: ${scenarioName}`);
    
    const testResult: TestResult = {
      scenario: scenarioName,
      passed: true,
      issues: [],
      performance: { startTime: Date.now(), endTime: 0 }
    };

    try {
      // Test basic confusion analysis
      const basicAnalysis = analyzeCareerConfusion(input);
      console.log(`   ✓ Basic confusion level: ${basicAnalysis.confusionLevel}`);

      // Test advanced confusion analysis
      const advancedAnalysis = analyzeAdvancedCareerConfusion(input);
      console.log(`   ✓ Advanced confusion level: ${advancedAnalysis.level}`);

      // Test basic integration
      const mockRecommendations = this.generateMockRecommendations();
      const basicIntegration = integrateConfusionHandling(input, mockRecommendations);
      
      // Test advanced integration
      const advancedIntegration = integrateAdvancedConfusionHandling(input, mockRecommendations);

      // Validate results against expectations
      const expected = expectedResults[scenarioName as keyof typeof expectedResults];
      if (expected) {
        this.validateResults(scenarioName, basicAnalysis, advancedAnalysis, basicIntegration, advancedIntegration, expected, testResult);
      }

      testResult.performance.endTime = Date.now();
      console.log(`   ⏱️  Completed in ${testResult.performance.endTime - testResult.performance.startTime}ms\n`);

    } catch (error) {
      testResult.passed = false;
      testResult.issues.push(`Execution error: ${error}`);
      console.log(`   ❌ Error: ${error}\n`);
    }

    return testResult;
  }

  private validateResults(
    scenarioName: string, 
    basicAnalysis: any, 
    advancedAnalysis: any, 
    basicIntegration: any, 
    advancedIntegration: any, 
    expected: any, 
    testResult: TestResult
  ): void {
    
    // Validate confusion level detection
    if (expected.confusionLevel && basicAnalysis.confusionLevel !== expected.confusionLevel) {
      testResult.issues.push(`Expected confusion level ${expected.confusionLevel}, got ${basicAnalysis.confusionLevel}`);
      testResult.passed = false;
    }

    // Validate advanced features
    if (expected.shouldUseAdvanced) {
      if (advancedAnalysis.level === 'low') {
        testResult.issues.push('Should trigger advanced handling but detected low confusion');
        testResult.passed = false;
      }
    }

    // Validate specific features
    if (expected.hasTherapeuticRecommendations && (!advancedIntegration.therapeuticRecommendations || advancedIntegration.therapeuticRecommendations.length === 0)) {
      testResult.issues.push('Expected therapeutic recommendations but none found');
      testResult.passed = false;
    }

    if (expected.hasCulturalAdaptations && (!advancedIntegration.culturalAdaptations || advancedIntegration.culturalAdaptations.length === 0)) {
      testResult.issues.push('Expected cultural adaptations but none found');
      testResult.passed = false;
    }

    if (expected.hasPsychologicalSupport && (!advancedIntegration.psychologicalSupport || advancedIntegration.psychologicalSupport.length === 0)) {
      testResult.issues.push('Expected psychological support but none found');
      testResult.passed = false;
    }

    if (expected.hasEconomicRealities && (!advancedIntegration.economicRealities || advancedIntegration.economicRealities.length === 0)) {
      testResult.issues.push('Expected economic realities but none found');
      testResult.passed = false;
    }

    // Validate recommendation counts
    if (expected.recommendationCount) {
      const count = basicIntegration.primaryRecommendations?.length || 0;
      if (typeof expected.recommendationCount === 'string') {
        const [min, max] = expected.recommendationCount.split('-').map(Number);
        if (count < min || count > max) {
          testResult.issues.push(`Expected ${expected.recommendationCount} recommendations, got ${count}`);
          testResult.passed = false;
        }
      }
    }

    if (testResult.passed) {
      console.log('   ✅ All validations passed');
    } else {
      console.log(`   ❌ Validation issues: ${testResult.issues.join(', ')}`);
    }
  }

  private generateMockRecommendations(): any[] {
    return [
      {
        title: "Software Developer",
        description: "Build software applications and systems",
        confidencePercent: 85,
        why: "Good fit based on technical background"
      },
      {
        title: "Data Scientist", 
        description: "Analyze data to extract insights",
        confidencePercent: 75,
        why: "Strong analytical skills match"
      },
      {
        title: "Business Analyst",
        description: "Bridge business and technical requirements",
        confidencePercent: 70,
        why: "Communication and problem-solving skills"
      }
    ];
  }

  private printSummary(results: TestResults): void {
    console.log('📊 TEST SUITE SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${results.passed}/${results.total}`);
    console.log(`❌ Failed: ${results.failed}/${results.total}`);
    console.log(`📈 Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    
    if (results.failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      results.details.filter(t => !t.passed).forEach(test => {
        console.log(`   ${test.scenario}: ${test.issues.join(', ')}`);
      });
    }

    console.log('\n🎯 PERFORMANCE METRICS:');
    const avgTime = results.details.reduce((sum, test) => 
      sum + (test.performance.endTime - test.performance.startTime), 0) / results.details.length;
    console.log(`   Average test time: ${avgTime.toFixed(2)}ms`);
    
    const maxTime = Math.max(...results.details.map(test => 
      test.performance.endTime - test.performance.startTime));
    console.log(`   Slowest test: ${maxTime}ms`);
  }

  // Individual test methods for specific features
  async testConfusionDetection(): Promise<boolean> {
    console.log('🔍 Testing confusion detection accuracy...');
    
    for (const [name, input] of Object.entries(testScenarios)) {
      const analysis = analyzeCareerConfusion(input);
      const expected = expectedResults[name as keyof typeof expectedResults];
      
      if (expected && expected.confusionLevel !== analysis.confusionLevel) {
        console.log(`❌ ${name}: Expected ${expected.confusionLevel}, got ${analysis.confusionLevel}`);
        return false;
      }
    }
    
    console.log('✅ Confusion detection tests passed');
    return true;
  }

  async testRecommendationAdaptation(): Promise<boolean> {
    console.log('🎯 Testing recommendation adaptation...');
    
    const mockRecs = this.generateMockRecommendations();
    
    for (const [name, input] of Object.entries(testScenarios)) {
      const result = integrateConfusionHandling(input, mockRecs);
      
      // Validate that confused users get lower confidence scores
      if (result.confusionLevel !== 'low') {
        const hasReducedConfidence = result.primaryRecommendations?.some(
          (rec: any) => rec.confidencePercent < 70
        );
        
        if (!hasReducedConfidence) {
          console.log(`❌ ${name}: Expected reduced confidence for confused user`);
          return false;
        }
      }
    }
    
    console.log('✅ Recommendation adaptation tests passed');
    return true;
  }

  async testAdvancedFeatures(): Promise<boolean> {
    console.log('🧠 Testing advanced psychological features...');
    
    // Test imposter syndrome detection
    const imposterResult = integrateAdvancedConfusionHandling(testScenarios.imposterUser, this.generateMockRecommendations());
    if (!imposterResult.psychologicalSupport || imposterResult.psychologicalSupport.length === 0) {
      console.log('❌ Failed to detect imposter syndrome and provide psychological support');
      return false;
    }

    // Test cultural conflict handling
    const culturalResult = integrateAdvancedConfusionHandling(testScenarios.culturalConflictUser, this.generateMockRecommendations());
    if (!culturalResult.culturalAdaptations || culturalResult.culturalAdaptations.length === 0) {
      console.log('❌ Failed to detect cultural conflicts and provide adaptations');
      return false;
    }

    console.log('✅ Advanced features tests passed');
    return true;
  }
}

// Type definitions for test results
interface TestResult {
  scenario: string;
  passed: boolean;
  issues: string[];
  performance: {
    startTime: number;
    endTime: number;
  };
}

interface TestResults {
  passed: number;
  failed: number;
  total: number;
  details: TestResult[];
}

// Export test runner for use in components
export const runCareerConfusionTests = async (): Promise<TestResults> => {
  const testSuite = new CareerConfusionTestSuite();
  return await testSuite.runAllTests();
};

export default CareerConfusionTestSuite;
