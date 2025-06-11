import { useState, useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Target, TrendingUp, BookOpen, ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { IQ_QUESTIONS as LOCAL_IQ_QUESTIONS } from "./IQQuestions";
import EnhancedCareerRecommendationList from "../components/EnhancedCareerRecommendationList";
import { PersonalityProfileForm } from "../components/PersonalityProfileForm";
import { getEnhancedCareerRecommendations } from "./enhancedCareerRecommendation";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5002';

interface Question {
  question: string;
  options: string[];
  answer?: number;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

interface PersonalityProfile {
  introvertExtrovert: "" | "introvert" | "extrovert" | "ambivert";
  leadership: "" | "high" | "medium" | "low";
  creativity: "" | "high" | "medium" | "low";
  riskTolerance: "" | "high" | "medium" | "low";
  communication: "" | "high" | "medium" | "low";
}

interface EnhancedCareerRecommendation {
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

const EnhancedIQTest = memo(() => {
  const { user } = useAuth();
  
  // Core state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  
  // Test state
  const [testState, setTestState] = useState<'not-started' | 'in-progress' | 'results'>('not-started');
  const [score, setScore] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
    // Personality and recommendations
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile | null>(null);
  const [careerRecs, setCareerRecs] = useState<EnhancedCareerRecommendation[]>([]);
  const [savedCareers, setSavedCareers] = useState<string[]>([]);
  const [editingPersonality, setEditingPersonality] = useState(false);
    // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Timer effect
  useEffect(() => {
    let interval: number;
    if (testState === 'in-progress' && startTime) {
      interval = window.setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => window.clearInterval(interval);
  }, [testState, startTime]);
  // Load saved data
  useEffect(() => {
    const savedProfile = localStorage.getItem('personalityProfile');
    const savedScore = localStorage.getItem('iqScore');
    const savedCareersList = localStorage.getItem('savedCareers');
    
    if (savedProfile) {
      setPersonalityProfile(JSON.parse(savedProfile));
    }
    if (savedScore) {
      setScore(Number(savedScore));
      setTestState('results');
    }
    if (savedCareersList) {
      setSavedCareers(JSON.parse(savedCareersList));
    }
  }, []);

  // Enhanced question selection with categories
  const generateQuestions = useCallback(() => {
    const categorizedQuestions = LOCAL_IQ_QUESTIONS.map(q => ({
      ...q,
      category: getCategoryFromQuestion(q.question),
      difficulty: getDifficultyFromQuestion(q.question)
    }));

    // Select balanced questions from different categories
    const categories = ['logical', 'mathematical', 'spatial', 'verbal', 'pattern'];
    const selected: Question[] = [];
    
    categories.forEach(category => {
      const categoryQuestions = categorizedQuestions.filter(q => q.category === category);
      const shuffled = categoryQuestions.sort(() => Math.random() - 0.5);
      selected.push(...shuffled.slice(0, 2)); // 2 from each category
    });

    // Fill remaining slots
    const remaining = categorizedQuestions.filter(q => !selected.includes(q));
    selected.push(...remaining.sort(() => Math.random() - 0.5).slice(0, 2));

    return selected.slice(0, 10); // Total 10 questions for better experience
  }, []);

  const getCategoryFromQuestion = (question: string): string => {
    if (question.toLowerCase().includes('sequence') || question.toLowerCase().includes('pattern')) return 'pattern';
    if (question.toLowerCase().includes('number') || question.toLowerCase().includes('calculate')) return 'mathematical';
    if (question.toLowerCase().includes('shape') || question.toLowerCase().includes('figure')) return 'spatial';
    if (question.toLowerCase().includes('word') || question.toLowerCase().includes('letter')) return 'verbal';
    return 'logical';
  };

  const getDifficultyFromQuestion = (question: string): 'easy' | 'medium' | 'hard' => {
    if (question.length < 50) return 'easy';
    if (question.length < 100) return 'medium';
    return 'hard';
  };

  const startTest = useCallback(() => {
    const newQuestions = generateQuestions();
    setQuestions(newQuestions);
    setAnswers(Array(newQuestions.length).fill(null));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTestState('in-progress');
    setStartTime(Date.now());
    setTimeElapsed(0);
  }, [generateQuestions]);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  }, []);

  const handleNext = useCallback(() => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
      setSelectedAnswer(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        handleSubmit(newAnswers);
      }
    }
  }, [selectedAnswer, answers, currentQuestionIndex, questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
    }
  }, [currentQuestionIndex, answers]);

  const calculateScore = useCallback((userAnswers: (number | null)[]) => {
    let correct = 0;
    let total = 0;
    
    questions.forEach((question, index) => {
      if (question.answer !== undefined && userAnswers[index] !== null) {
        total++;
        if (userAnswers[index] === question.answer) {
          correct++;
        }
      }
    });

    if (total === 0) return 100;
    const percentage = (correct / total) * 100;
    return Math.round(85 + (percentage - 50) * 0.6); // Normalized IQ score
  }, [questions]);
  const handleSubmit = useCallback(async (finalAnswers: (number | null)[]) => {
    setLoading(true);
    try {
      const finalScore = calculateScore(finalAnswers);
      setScore(finalScore);
      setTestState('results');
      
      localStorage.setItem('iqScore', String(finalScore));
      
      // Submit to backend
      await axios.post(`${API_BASE_URL}/api/user/submit-score`, {
        email: user?.email,
        answers: finalAnswers,
        type: "intelligenceQuotient",
        score: finalScore,
        timeElapsed
      }, { withCredentials: true });
      
    } catch (err) {
      console.error(err);
      setError("Failed to submit test results");
    } finally {
      setLoading(false);
    }
  }, [calculateScore, user?.email, timeElapsed]);  const handleSaveCareer = useCallback((career: string) => {
    setSavedCareers(prev => {
      const newSaved = prev.includes(career) 
        ? prev.filter(c => c !== career)
        : [...prev, career];
      localStorage.setItem('savedCareers', JSON.stringify(newSaved));
      return newSaved;
    });
  }, []);

  // Direct API test function that bypasses complex state management
  const handleDirectAPITest = useCallback(async () => {
    console.log('🧪 Running direct API test...');
    setLoading(true);
    setError("");

    try {
      const testInput = {
        iqScore: score || 100,
        hobbies: 'listening music',
        interests: 'books',
        academicDetails: 'I am in 12th standard now',
        keywords: 'Become a doctor',
        location: '',
        useAI: true,
        additionalInfo: '',
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
      console.log('✅ Direct API response:', data);

      // Convert response to match EnhancedCareerRecommendation format
      const recommendations: EnhancedCareerRecommendation[] = data.recommendations.map((rec: any) => ({
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
      }));

      setCareerRecs(recommendations);
      console.log('🎯 Direct API test successful - recommendations set');
    } catch (err: any) {
      console.error('❌ Direct API test failed:', err);
      setError(`Direct API test failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [score]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (testState === 'not-started') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-700 dark:text-yellow-400 mb-4">
              Enhanced IQ Assessment
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              A comprehensive cognitive ability test designed to evaluate your reasoning skills
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 dark:bg-gray-800 rounded-lg">
              <Target className="mx-auto mb-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-800 dark:text-white">10 Questions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Carefully selected from different categories</p>
            </div>
            <div className="text-center p-6 bg-green-50 dark:bg-gray-800 rounded-lg">
              <Clock className="mx-auto mb-3 h-8 w-8 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-gray-800 dark:text-white">No Time Limit</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Take your time to think through each question</p>
            </div>
            <div className="text-center p-6 bg-purple-50 dark:bg-gray-800 rounded-lg">
              <TrendingUp className="mx-auto mb-3 h-8 w-8 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-800 dark:text-white">Detailed Results</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get insights and career recommendations</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startTest}
              className="px-8 py-4 bg-indigo-600 dark:bg-yellow-500 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 dark:hover:bg-yellow-600 transition-all transform hover:scale-105"
            >
              Start Assessment
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (testState === 'in-progress' && currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with progress */}
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentQuestion.category} • {currentQuestion.difficulty}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeElapsed)}</span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-indigo-600 dark:bg-yellow-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question content */}
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white dark:bg-gray-900 shadow-lg p-8"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              {currentQuestion.question}
            </h2>

            <div className="grid gap-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-medium text-gray-800 dark:text-white">
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="bg-white dark:bg-gray-900 rounded-b-2xl shadow-lg p-6">
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:text-indigo-600 dark:hover:text-yellow-400"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 dark:bg-yellow-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 dark:hover:bg-yellow-600"
              >
                <span>{currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (testState === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8"
        >
          {/* Results Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4"
            >
              <Target className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-indigo-700 dark:text-yellow-400 mb-2">
              Assessment Complete!
            </h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-6xl font-bold text-gray-800 dark:text-white mb-2"
            >
              {score}
            </motion.div>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Your IQ Score
            </p>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Completed in {formatTime(timeElapsed)}
            </div>
          </div>

          {/* Score Analysis */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 dark:bg-gray-800 rounded-lg">
              <TrendingUp className="mx-auto mb-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-800 dark:text-white">Performance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {score && score >= 130 ? 'Exceptional' : 
                 score && score >= 115 ? 'Above Average' : 
                 score && score >= 85 ? 'Average' : 'Below Average'}
              </p>
            </div>
            <div className="text-center p-6 bg-green-50 dark:bg-gray-800 rounded-lg">
              <BookOpen className="mx-auto mb-3 h-8 w-8 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-gray-800 dark:text-white">Categories</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {questions.length} questions across 5 areas
              </p>
            </div>
            <div className="text-center p-6 bg-purple-50 dark:bg-gray-800 rounded-lg">
              <Clock className="mx-auto mb-3 h-8 w-8 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-800 dark:text-white">Time Efficiency</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {Math.round(timeElapsed / questions.length)}s per question
              </p>
            </div>
          </div>          {/* Action Buttons */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => {
                setTestState('not-started');
                setScore(null);
                localStorage.removeItem('iqScore');
              }}
              className="px-6 py-3 border border-indigo-600 dark:border-yellow-500 text-indigo-600 dark:text-yellow-500 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
            >
              Retake Test
            </button>
          </div>

          {/* Personality Profile Section */}
          {testState === 'results' && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                {!personalityProfile || editingPersonality ? (
                  <div className="p-6 bg-indigo-50 dark:bg-gray-800 rounded-xl border border-indigo-200 dark:border-indigo-700">
                    <h3 className="text-xl font-bold text-indigo-700 dark:text-yellow-400 mb-4">
                      Complete Your Personality Profile
                    </h3>
                    <PersonalityProfileForm 
                      onSubmit={(profile) => {
                        setPersonalityProfile(profile);
                        setEditingPersonality(false);
                        localStorage.setItem('personalityProfile', JSON.stringify(profile));
                      }}
                    />
                  </div>
                ) : (
                  <div className="p-6 bg-indigo-50 dark:bg-gray-800 rounded-xl border border-indigo-200 dark:border-indigo-700">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-indigo-700 dark:text-yellow-400">
                        Your Personality Profile
                      </h3>
                      <button
                        onClick={() => setEditingPersonality(true)}
                        className="text-sm px-3 py-1 text-indigo-600 dark:text-yellow-400 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div><strong>Style:</strong> {personalityProfile.introvertExtrovert}</div>
                      <div><strong>Leadership:</strong> {personalityProfile.leadership}</div>
                      <div><strong>Creativity:</strong> {personalityProfile.creativity}</div>
                      <div><strong>Risk Tolerance:</strong> {personalityProfile.riskTolerance}</div>
                      <div><strong>Communication:</strong> {personalityProfile.communication}</div>
                    </div>
                  </div>
                )}

                {/* Career Recommendations Form */}
                {personalityProfile && !editingPersonality && (
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Get Personalized Career Recommendations
                    </h3>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setLoading(true);
                        setError("");
                        
                        const formData = new FormData(e.target as HTMLFormElement);
                        const data = {
                          hobbies: formData.get('hobbies') as string,
                          interests: formData.get('interests') as string,
                          academicDetails: formData.get('academicDetails') as string,
                          keywords: formData.get('keywords') as string,
                          location: formData.get('location') as string,
                          email: user?.email,
                          iqScore: score,
                          personality: personalityProfile
                        };                        try {
                          // Save user data
                          await axios.put(`${API_BASE_URL}/api/user/update`, data, { withCredentials: true });
                            // Get enhanced career recommendations
                          if (score !== null) {
                            const recommendations = await getEnhancedCareerRecommendations({
                              ...data,
                              iqScore: score
                            });
                            setCareerRecs(recommendations.recommendations);
                          }
                            } catch (err) {
                          console.error(err);
                          setError("Failed to generate recommendations");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Hobbies *
                          </label>
                          <input
                            type="text"
                            name="hobbies"
                            required
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            placeholder="e.g., reading, sports, music"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Interests *
                          </label>
                          <input
                            type="text"
                            name="interests"
                            required
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            placeholder="e.g., technology, healthcare, arts"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Academic Background *
                          </label>
                          <input
                            type="text"
                            name="academicDetails"
                            required
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            placeholder="e.g., Computer Science, Business"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Keywords
                          </label>
                          <input
                            type="text"
                            name="keywords"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            placeholder="e.g., remote work, startup, leadership"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Preferred Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            placeholder="e.g., New York, Remote, Global"
                          />
                        </div>                      </div>
                      
                      <div className="space-y-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 bg-indigo-600 dark:bg-yellow-500 text-white rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-yellow-600 disabled:opacity-50 transition-all"
                        >
                          {loading ? 'Generating Recommendations...' : 'Get Career Recommendations'}
                        </button>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">or</div>
                          <button
                            type="button"
                            onClick={handleDirectAPITest}
                            disabled={loading}
                            className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-all"
                          >
                            🧪 Direct API Test (Fast)
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}                {/* Career Recommendations Display */}
                {careerRecs.length > 0 && (
                  <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Your Personalized Career Recommendations
                      </h3>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Based on your profile</span>
                      </div>
                    </div>
                    <EnhancedCareerRecommendationList 
                      recommendations={careerRecs}
                      onSaveCareer={handleSaveCareer}
                      savedCareers={savedCareers}
                    />
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    );
  }

  return null;
});

EnhancedIQTest.displayName = 'EnhancedIQTest';

export default EnhancedIQTest;
