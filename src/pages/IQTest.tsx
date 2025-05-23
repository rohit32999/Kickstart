import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { IQ_QUESTIONS as LOCAL_IQ_QUESTIONS } from "./IQQuestions";
import { useNavigate } from "react-router-dom";
import { CareerRecommendationList } from "../components/CareerRecommendationList";
import { PersonalityProfileForm } from "../components/PersonalityProfileForm";

export default function IQTest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);
  const [personalityProfile, setPersonalityProfile] = useState<any>(null);
  const [editingPersonality, setEditingPersonality] = useState(false); // State to manage editing of personality profile
  const [careerRecs, setCareerRecs] = useState<any[]>([]); // Restored for career recommendations

  // --- Personality Profile Persistence ---
  useEffect(() => {
    // On mount, load personality profile from localStorage if present
    const savedProfile = localStorage.getItem('personalityProfile');
    if (savedProfile) {
      setPersonalityProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Helper to get random unique and strongly dissimilar questions from local bank
  function getRandomQuestions(count: number) {
    function normalize(text: string) {
      return text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(Boolean);
    }
    function jaccard(a: string[], b: string[]) {
      const setA = new Set(a);
      const setB = new Set(b);
      const intersection = new Set([...setA].filter(x => setB.has(x)));
      const union = new Set([...setA, ...setB]);
      return intersection.size / union.size;
    }
    function isTooSimilar(q1: string, q2: string) {
      const n1 = normalize(q1);
      const n2 = normalize(q2);
      const prefix1 = n1.slice(0, 5).join(' ');
      const prefix2 = n2.slice(0, 5).join(' ');
      if (prefix1 === prefix2) return true;
      if (jaccard(n1, n2) > 0.4) return true;
      return false;
    }
    // Categorize questions
    function isSequenceQuestion(q: any) {
      const text = q.question.toLowerCase();
      return (
        text.includes('sequence') ||
        text.includes('series') ||
        text.includes('next number') ||
        text.includes('missing number') ||
        text.includes('comes next') ||
        text.includes('number is next')
      );
    }
    function isOddOneOut(q: any) {
      return q.question.toLowerCase().includes('odd one out');
    }
    function isRearrange(q: any) {
      return q.question.toLowerCase().includes('rearrange');
    }
    function isMath(q: any) {
      const text = q.question.toLowerCase();
      return (
        text.includes('square root') ||
        text.includes('cube root') ||
        text.includes('x') ||
        text.includes('prime number') ||
        text.includes('square number') ||
        text.includes('cube number')
      );
    }
    // Shuffle with seed for variety
    function seededShuffle(array: any[], seed: number) {
      let m = array.length, t, i;
      while (m) {
        i = Math.floor(Math.abs(Math.sin(seed + m)) * m);
        m--;
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
      return array;
    }
    const seed = (user?.id ? user.id.length : 0) + Date.now();
    const all = seededShuffle([...LOCAL_IQ_QUESTIONS], seed);
    // Split by category
    const seq = all.filter(isSequenceQuestion);
    const odd = all.filter(isOddOneOut);
    const rearr = all.filter(isRearrange);
    const math = all.filter(isMath);
    const general = all.filter(q => !isSequenceQuestion(q) && !isOddOneOut(q) && !isRearrange(q) && !isMath(q));
    // Pick from each category
    const selected: any[] = [];
    let sequenceCount = 0, oddCount = 0, rearrCount = 0, mathCount = 0;
    const seenQuestions = new Set<string>();
    // Helper to add from a pool
    function addFromPool(pool: any[], max: number) {
      for (const q of pool) {
        if (selected.length >= count) break;
        const normText = normalize(q.question).join(' ');
        if (seenQuestions.has(normText)) continue;
        if (selected.some((sel: any) => isTooSimilar(sel.question, q.question))) continue;
        if (pool === seq && sequenceCount >= max) continue;
        if (pool === odd && oddCount >= max) continue;
        if (pool === rearr && rearrCount >= max) continue;
        if (pool === math && mathCount >= max) continue;
        selected.push(q);
        seenQuestions.add(normText);
        if (pool === seq) sequenceCount++;
        if (pool === odd) oddCount++;
        if (pool === rearr) rearrCount++;
        if (pool === math) mathCount++;
      }
    }
    // Try to ensure a mix (tweak numbers as needed)
    addFromPool(seq, 2);
    addFromPool(odd, 2);
    addFromPool(rearr, 2);
    addFromPool(math, 2);
    addFromPool(general, 4);
    // If not enough, fill from remaining
    if (selected.length < count) {
      const remaining = all.filter(q => !seenQuestions.has(normalize(q.question).join(' ')) && selected.every((sel: any) => !isTooSimilar(sel.question, q.question)));
      for (const q of remaining) {
        if (selected.length >= count) break;
        selected.push(q);
      }
    }
    return selected.slice(0, count);
  }

  useEffect(() => {
    // Only redirect if user is explicitly null (not undefined or still resolving)
    if (user === null) {
      navigate("/login");
      return;
    }
    if (!user) return; // Wait for user to resolve (undefined)
    // If user is present, refresh questions
    setFetching(true);
    const uniqueQuestions = getRandomQuestions(12);
    setQuestions(uniqueQuestions);
    setAnswers(Array(uniqueQuestions.length).fill(null));
    setFetching(false);
    // eslint-disable-next-line
  }, [user]); // Remove navigate from deps to avoid re-running on navigation

  // On mount, load IQ score from localStorage if present
  useEffect(() => {
    const savedScore = localStorage.getItem('iqScore');
    if (savedScore) {
      setScore(Number(savedScore));
      setSubmitted(true);
    }
  }, []);

  const calculateIQScore = (userAnswers: any[], questions: any[]) => {
    let correct = 0;
    let total = 0;
    for (let i = 0; i < questions.length; i++) {
      if (
        typeof questions[i].answer !== 'undefined' &&
        userAnswers[i] !== null
      ) {
        total++;
        if (Number(userAnswers[i]) === Number(questions[i].answer)) {
          correct++;
        }
      }
    }
    if (total === 0) return 85;
    // Refined IQ calculation: mean = total*0.75, stddev = sqrt(total*0.1875)
    // This assumes a harder test, so average is 75% correct
    const mean = total * 0.75;
    const stddev = Math.sqrt(total * 0.1875);
    const z = (correct - mean) / stddev;
    const iq = Math.round(100 + z * 15);
    return Math.max(55, Math.min(145, iq));
  };

  const handleOptionChange = (qIdx: number, optIdx: number) => {
    const updated = [...answers];
    updated[qIdx] = Number(optIdx); // Ensure always a number
    setAnswers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (answers.some((a) => a === null)) {
      setError("Please answer all questions.");
      return;
    }
    setLoading(true);
    try {
      const score = calculateIQScore(answers, questions);
      setScore(score);
      setSubmitted(true);
      localStorage.setItem('iqScore', String(score)); // Persist IQ score
      await axios.post("http://localhost:5000/api/user/submit-score", {
        email: user?.email,
        answers,
        type: "intelligenceQuotient",
        score,
      }, { withCredentials: true });
    } catch (err) {
      setError("Failed to submit score. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setSubmitted(false);
    setScore(null);
    setError("");
    setFetching(true);
    localStorage.removeItem('iqScore'); // Clear persisted IQ score
    // Use 12 questions for more refined scoring
    const uniqueQuestions = getRandomQuestions(12);
    setQuestions(uniqueQuestions);
    setAnswers(Array(uniqueQuestions.length).fill(null));
    setFetching(false);
  };

  // Helper to load 'about yourself' data from localStorage
  const getAboutYourself = () => {
    try {
      return JSON.parse(localStorage.getItem('aboutYourself') || '{}');
    } catch {
      return {};
    }
  };
  const aboutYourself = getAboutYourself();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-10"
      style={{ userSelect: 'none' }}
      onContextMenu={e => e.preventDefault()}
    >
      <div className="max-w-2xl w-full bg-white/90 dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-indigo-700 dark:text-yellow-400 mb-6 text-center">IQ Test</h2>
        {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
        {fetching ? (
          <div className="text-center text-lg">Loading questions...</div>
        ) : submitted && score !== null ? (
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">Your IQ Score: <span className="text-indigo-600 dark:text-yellow-400">{score}</span></h3>
            <button className="mt-4 px-6 py-2 bg-indigo-600 dark:bg-yellow-500 text-white rounded hover:bg-indigo-700 dark:hover:bg-yellow-600" onClick={handleRetake}>Retake Test</button>
            {/* Personality Profile Step */}
            {!personalityProfile || editingPersonality ? (
              <div className="mt-8 p-6 bg-indigo-50 dark:bg-gray-800 rounded-xl shadow-md border border-indigo-200 dark:border-yellow-400 max-w-lg mx-auto">
                <h4 className="text-xl font-bold mb-4 text-indigo-700 dark:text-yellow-400">Tell us about your personality</h4>
                <PersonalityProfileForm onSubmit={(profile) => { setPersonalityProfile(profile); setEditingPersonality(false); }} />
              </div>
            ) : (
            <div className="mt-8 p-6 bg-indigo-50 dark:bg-gray-800 rounded-xl shadow-md border border-indigo-200 dark:border-yellow-400 max-w-lg mx-auto">
              <h4 className="text-xl font-bold mb-4 text-indigo-700 dark:text-yellow-400">Your Personality Profile</h4>
              <ul className="mb-4 text-gray-800 dark:text-gray-200">
                <li><b>Introvert/Extrovert:</b> {personalityProfile.introvertExtrovert}</li>
                <li><b>Leadership:</b> {personalityProfile.leadership}</li>
                <li><b>Creativity:</b> {personalityProfile.creativity}</li>
                <li><b>Risk Tolerance:</b> {personalityProfile.riskTolerance}</li>
                <li><b>Communication:</b> {personalityProfile.communication}</li>
              </ul>
              <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600" onClick={() => setEditingPersonality(true)}>Edit</button>
            </div>
            )}
            {/* Tell us more about yourself form, only if not editing personality */}
            {submitted && score !== null && personalityProfile && !editingPersonality && (
              <div className="mt-8 p-6 bg-indigo-50 dark:bg-gray-800 rounded-xl shadow-md border border-indigo-200 dark:border-yellow-400 max-w-lg mx-auto">
                <h4 className="text-xl font-bold mb-4 text-indigo-700 dark:text-yellow-400">Tell us more about yourself</h4>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setError("");
                  const form = e.target as HTMLFormElement;
                  const data = {
                    hobbies: form.hobbies.value,
                    interests: form.interests.value,
                    academicDetails: form.academicDetails.value,
                    email: user?.email,
                    iqScore: score,
                    keywords: form.keywords ? form.keywords.value : undefined,
                    location: form.location ? form.location.value : undefined,
                    personality: personalityProfile
                  };
                  // Save to localStorage
                  localStorage.setItem('aboutYourself', JSON.stringify({
                    hobbies: data.hobbies,
                    interests: data.interests,
                    academicDetails: data.academicDetails,
                    keywords: data.keywords,
                    location: data.location
                  }));
                  try {
                    await axios.put("http://localhost:5000/api/user/update", data);
                    // Fetch personalized career recommendations
                    const recRes = await import("./careerRecommendation");
                    const { getCareerRecommendations } = recRes;
                    const recommendations = await getCareerRecommendations({
                      iqScore: score,
                      hobbies: data.hobbies,
                      interests: data.interests,
                      academicDetails: data.academicDetails,
                      keywords: data.keywords,
                      location: data.location,
                      personality: personalityProfile
                    });
                    setCareerRecs(recommendations as any[]);
                    alert("Thank you! Your details have been saved. See your personalized career pathway below.");
                  } catch (err) {
                    setError("Failed to save details or fetch recommendations. Please try again.");
                  } finally {
                    setLoading(false);
                  }
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hobbies</label>
                    <input
                      type="text"
                      name="hobbies"
                      required
                      className="block w-full p-3 border rounded-md bg-white text-gray-900 border-gray-300 focus:ring focus:ring-indigo-500 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 transition-all"
                      defaultValue={aboutYourself.hobbies || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interests</label>
                    <input
                      type="text"
                      name="interests"
                      required
                      className="block w-full p-3 border rounded-md bg-white text-gray-900 border-gray-300 focus:ring focus:ring-indigo-500 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 transition-all"
                      defaultValue={aboutYourself.interests || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Academic Details</label>
                    <input
                      type="text"
                      name="academicDetails"
                      required
                      className="block w-full p-3 border rounded-md bg-white text-gray-900 border-gray-300 focus:ring focus:ring-indigo-500 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 transition-all"
                      defaultValue={aboutYourself.academicDetails || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keywords (for career recommendations)</label>
                    <input
                      type="text"
                      name="keywords"
                      className="block w-full p-3 border rounded-md bg-white text-gray-900 border-gray-300 focus:ring focus:ring-indigo-500 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 transition-all"
                      defaultValue={aboutYourself.keywords || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location (optional)</label>
                    <input
                      type="text"
                      name="location"
                      className="block w-full p-3 border rounded-md bg-white text-gray-900 border-gray-300 focus:ring focus:ring-indigo-500 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 transition-all"
                      defaultValue={aboutYourself.location || ''}
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 dark:bg-yellow-500 text-white rounded shadow hover:bg-indigo-700 dark:hover:bg-yellow-600 transition-all flex items-center"
                    >
                      {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4zm16 0a8 8 0 01-8 8v-8h8z"></path></svg>}
                      Save and See Recommendations
                    </button>
                  </div>
                </form>
              </div>
            )}
            {/* Career Recommendations */}
            {submitted && score !== null && careerRecs.length > 0 && (
              <div className="mt-8 p-6 bg-indigo-50 dark:bg-gray-800 rounded-xl shadow-md border border-indigo-200 dark:border-yellow-400 max-w-lg mx-auto">
                <h4 className="text-xl font-bold mb-4 text-indigo-700 dark:text-yellow-400">Personalized Career Recommendations</h4>
                <CareerRecommendationList recommendations={careerRecs} />
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="p-4 bg-white rounded-lg shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <div className="text-gray-800 dark:text-gray-200 mb-2">
                    <span className="font-semibold">Question {qIdx + 1}:</span> {q.question}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {q.options.map((opt: string, optIdx: number) => (
                        <button
                          key={optIdx}
                          onClick={() => handleOptionChange(qIdx, optIdx)}
                          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center
                          ${answers[qIdx] === optIdx ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}
                          ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={loading}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </button>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 dark:bg-yellow-500 text-white rounded-lg shadow hover:bg-indigo-700 dark:hover:bg-yellow-600 transition-all flex items-center"
                disabled={loading}
              >
                {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4zm16 0a8 8 0 01-8 8v-8h8z"></path></svg>}
                Submit Answers
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}