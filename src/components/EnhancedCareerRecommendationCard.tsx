import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Briefcase, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  Target,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { CareerInsights, CareerRecommendationCardProps } from '../types/career';
import { analyzeSkillGap, SkillGap } from '../utils/skillGapAnalysis';

interface EnhancedCareerRecommendationProps extends CareerRecommendationCardProps {
  category?: string;
  salaryRange?: string;
  skills?: string[];
  nextSteps?: string[];
  growthPotential?: 'high' | 'medium' | 'low';
  workEnvironment?: string;
  education?: string;
  onSave?: (career: string) => void;
  isSaved?: boolean;
  matchScore?: number;
  
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
}

const EnhancedCareerRecommendationCard: React.FC<EnhancedCareerRecommendationProps> = memo(({
  title,
  description,
  why,
  resources,
  confidencePercent,
  insights,
  category = 'General',
  salaryRange,
  skills = [],
  nextSteps = [],
  growthPotential = 'medium',
  workEnvironment,
  education,
  onSave,
  isSaved = false,
  matchScore = 0,
  marketTrends,
  topCompanies = [],
  jobSecurity,
  workLifeBalance,
  salaryBreakdown
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadedInsights, setLoadedInsights] = useState<CareerInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'steps' | 'insights'>('overview');
  const [localSaved, setLocalSaved] = useState(isSaved);
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null);

  // Load insights when expanded
  const loadCareerInsights = useCallback(async () => {
    if (!loadedInsights && !loading) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5001/api/career-insights/${encodeURIComponent(title)}`);
        if (!response.ok) throw new Error('Failed to load insights');
        
        const data = await response.json();
        setLoadedInsights(data);
      } catch (err) {
        setError('Unable to load career insights');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }, [loadedInsights, loading, title]);

  useEffect(() => {
    if (insights) {
      setLoadedInsights(insights);
    }
  }, [insights]);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && !loadedInsights) {
      loadCareerInsights();
    }
  }, [isExpanded, loadedInsights, loadCareerInsights]);

  const handleSave = useCallback(() => {
    setLocalSaved(!localSaved);
    onSave?.(title);
  }, [localSaved, onSave, title]);

  const getGrowthColor = (growth: string) => {
    switch (growth) {
      case 'high': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (score >= 70) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    if (score >= 55) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
  };

  // Calculate skill gap when skills tab is accessed
  useEffect(() => {
    if (activeTab === 'skills' && !skillGap) {
      // Get user skills from localStorage or context (for demo purposes)
      const userSkillsData = localStorage.getItem('userSkills') || '';
      if (userSkillsData) {
        const gap = analyzeSkillGap(userSkillsData, title);
        setSkillGap(gap);
      }
    }
  }, [activeTab, skillGap, title]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
    >      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{title}</h3>
              <span className="px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full whitespace-nowrap">
                {category}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {matchScore > 0 && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getMatchScoreColor(matchScore)}`}>
                  <Star className="h-3 w-3 flex-shrink-0" />
                  <span className="whitespace-nowrap">{matchScore}% Match</span>
                </div>
              )}
              
              {salaryRange && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <DollarSign className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{salaryRange}</span>
                </div>
              )}
              
              <div className={`flex items-center gap-1.5 text-sm ${getGrowthColor(growthPotential)}`}>
                <TrendingUp className="h-4 w-4 flex-shrink-0" />
                <span className="capitalize whitespace-nowrap">{growthPotential} Growth</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <button
              onClick={handleSave}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={localSaved ? 'Remove from saved' : 'Save career'}
            >
              {localSaved ? (
                <BookmarkCheck className="h-5 w-5 text-indigo-600 dark:text-yellow-400" />
              ) : (
                <Bookmark className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              )}
            </button>
            
            <button
              onClick={handleToggleExpanded}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-yellow-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            >
              <span>{isExpanded ? 'Less' : 'More'}</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">{description}</p>        {/* Confidence/Why section */}
        {(confidencePercent || why) && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {confidencePercent && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Recommendation Strength</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{confidencePercent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${confidencePercent}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            )}
            
            {why && (
              <div className={`${confidencePercent ? 'mt-3 pt-3 border-t border-gray-200 dark:border-gray-600' : ''}`}>
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {why.replace(/Confidence: [0-9.]+/, "").trim()}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              {[
                { id: 'overview', label: 'Overview', icon: Target },
                { id: 'skills', label: 'Skills', icon: CheckCircle },
                { id: 'steps', label: 'Next Steps', icon: Clock },
                { id: 'insights', label: 'Market Insights', icon: TrendingUp }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 flex-1 ${
                    activeTab === id
                      ? 'text-indigo-600 dark:text-yellow-400 border-b-2 border-indigo-600 dark:border-yellow-400 bg-white dark:bg-gray-900 -mb-px'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      {workEnvironment && (
                        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Work Environment</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{workEnvironment}</p>
                          </div>
                        </div>
                      )}
                      
                      {education && (
                        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Education Required</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{education}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}                {activeTab === 'skills' && (
                  <motion.div
                    key="skills"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Skill Gap Analysis */}
                    {skillGap && (
                      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Your Skill Match</h4>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${100 - skillGap.gapPercentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {Math.round(100 - skillGap.gapPercentage)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          {skillGap.matchingSkills.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                                ✅ Skills You Have ({skillGap.matchingSkills.length})
                              </p>
                              <div className="space-y-1">
                                {skillGap.matchingSkills.slice(0, 3).map((skill, idx) => (
                                  <span key={idx} className="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md mr-2 mb-1">
                                    {skill}
                                  </span>
                                ))}
                                {skillGap.matchingSkills.length > 3 && (
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    +{skillGap.matchingSkills.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {skillGap.missingSkills.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-2">
                                📚 Skills to Learn ({skillGap.missingSkills.length})
                              </p>
                              <div className="space-y-1">
                                {skillGap.missingSkills.slice(0, 3).map((skill, idx) => (
                                  <span key={idx} className="inline-block px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-md mr-2 mb-1">
                                    {skill}
                                  </span>
                                ))}
                                {skillGap.missingSkills.length > 3 && (
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    +{skillGap.missingSkills.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {skillGap.recommendations.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                            <p className="text-sm font-medium text-indigo-700 dark:text-indigo-400 mb-2">
                              🎯 Quick Start Recommendations
                            </p>
                            <ul className="space-y-1">
                              {skillGap.recommendations.slice(0, 2).map((rec, idx) => (
                                <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                  <span className="text-indigo-500 mt-1">•</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {skills.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Key Skills Required</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {skills.map((skill, index) => {
                            const isMatched = skillGap?.matchingSkills.includes(skill);
                            return (
                              <div
                                key={index}
                                className={`flex items-center gap-2 px-3 py-2 border text-sm rounded-lg ${
                                  isMatched 
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
                                }`}
                              >
                                <CheckCircle className={`h-4 w-4 flex-shrink-0 ${
                                  isMatched ? 'text-green-500 dark:text-green-400' : 'text-blue-500 dark:text-blue-400'
                                }`} />
                                <span className="font-medium">{skill}</span>
                                {isMatched && (
                                  <span className="ml-auto text-xs text-green-600 dark:text-green-400">✓</span>
                                )}
                              </div>                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">No specific skills data available</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Skills requirements may vary by employer</p>
                      </div>
                    )}
                  </motion.div>
                )}                {activeTab === 'steps' && (
                  <motion.div
                    key="steps"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {nextSteps.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Your Next Steps</h4>
                        <div className="space-y-3">
                          {nextSteps.map((step, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{step}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">General Career Steps</h4>
                        <div className="space-y-3">
                          {[
                            'Research the field and current market trends',
                            'Connect with professionals in this career',
                            'Identify relevant skills to develop',
                            'Look for internships or entry-level opportunities'
                          ].map((step, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}                {activeTab === 'insights' && (
                  <motion.div
                    key="insights"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading market insights...</span>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Enhanced AI-Powered Metadata */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Salary Breakdown - AI Enhanced */}
                          {salaryBreakdown ? (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                              <h5 className="font-medium text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Salary Breakdown (AI Enhanced)
                              </h5>
                              <div className="space-y-2 text-sm text-green-700 dark:text-green-400">
                                {salaryBreakdown.entry && (
                                  <div className="flex justify-between">
                                    <span>Entry Level:</span>
                                    <span className="font-medium">{salaryBreakdown.entry}</span>
                                  </div>
                                )}
                                {salaryBreakdown.experienced && (
                                  <div className="flex justify-between">
                                    <span>Experienced:</span>
                                    <span className="font-medium">{salaryBreakdown.experienced}</span>
                                  </div>
                                )}
                                {salaryBreakdown.senior && (
                                  <div className="flex justify-between">
                                    <span>Senior Level:</span>
                                    <span className="font-medium">{salaryBreakdown.senior}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : loadedInsights?.salaryRange ? (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                              <h5 className="font-medium text-green-800 dark:text-green-300 mb-2">Salary Range</h5>
                              <div className="text-sm text-green-700 dark:text-green-400">
                                <p>Entry: {loadedInsights.salaryRange.entryLevel.usd} ({loadedInsights.salaryRange.entryLevel.inr})</p>
                                <p>Experienced: {loadedInsights.salaryRange.experienced.usd} ({loadedInsights.salaryRange.experienced.inr})</p>
                              </div>
                            </div>
                          ) : null}

                          {/* Job Security */}
                          {jobSecurity && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Job Security
                              </h5>
                              <div className={`text-sm font-medium ${
                                jobSecurity === 'High' ? 'text-green-600 dark:text-green-400' :
                                jobSecurity === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-red-600 dark:text-red-400'
                              }`}>
                                {jobSecurity}
                              </div>
                            </div>
                          )}

                          {/* Work-Life Balance */}
                          {workLifeBalance && (
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                              <h5 className="font-medium text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Work-Life Balance
                              </h5>
                              <div className={`text-sm font-medium ${
                                workLifeBalance === 'Excellent' ? 'text-green-600 dark:text-green-400' :
                                workLifeBalance === 'Good' ? 'text-blue-600 dark:text-blue-400' :
                                workLifeBalance === 'Average' ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-red-600 dark:text-red-400'
                              }`}>
                                {workLifeBalance}
                              </div>
                            </div>
                          )}

                          {/* Growth Prospects - Fallback */}
                          {!jobSecurity && !workLifeBalance && loadedInsights?.growthProspects && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Growth Prospects</h5>
                              <p className="text-sm text-blue-700 dark:text-blue-400">{loadedInsights.growthProspects.rating}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{loadedInsights.growthProspects.explanation}</p>
                            </div>
                          )}
                        </div>

                        {/* Market Trends */}
                        {marketTrends && (
                          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <h5 className="font-medium text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Market Trends & Outlook
                            </h5>
                            <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">{marketTrends}</p>
                          </div>
                        )}

                        {/* Top Companies */}
                        {topCompanies && topCompanies.length > 0 && (
                          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                            <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-3 flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              Top Companies Hiring
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {topCompanies.map((company, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm rounded-full border border-indigo-200 dark:border-indigo-700"
                                >
                                  {company}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* In-Demand Roles - Fallback */}
                        {(!topCompanies || topCompanies.length === 0) && loadedInsights?.inDemandRoles && (
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white mb-2">In-Demand Roles</h5>
                            <div className="flex flex-wrap gap-2">
                              {loadedInsights.inDemandRoles.map((role, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Error State */}
                        {error && (
                          <div className="text-center py-8">
                            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                            <button
                              onClick={loadCareerInsights}
                              className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            >
                              Try Again
                            </button>
                          </div>
                        )}

                        {/* No Data State */}
                        {!salaryBreakdown && !jobSecurity && !workLifeBalance && !marketTrends && (!topCompanies || topCompanies.length === 0) && !loadedInsights && !error && (
                          <div className="text-center py-8">
                            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                              <TrendingUp className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 mb-2">No market insights available</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">Market data will be generated by AI for new recommendations</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources */}
            {resources && resources.length > 0 && (
              <div className="px-6 pb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Helpful Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Resource {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

EnhancedCareerRecommendationCard.displayName = 'EnhancedCareerRecommendationCard';

export { EnhancedCareerRecommendationCard };
export default EnhancedCareerRecommendationCard;
