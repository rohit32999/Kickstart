import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { IQ_QUESTIONS as LOCAL_IQ_QUESTIONS } from "./IQQuestions";
import { useNavigate } from "react-router-dom";

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
    // Use 12 questions for more refined scoring
    const uniqueQuestions = getRandomQuestions(12);
    setQuestions(uniqueQuestions);
    setAnswers(Array(uniqueQuestions.length).fill(null));
    setFetching(false);
  };

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
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map((q, idx) => (
              <div key={idx} className="mb-6">
                <div className="font-medium mb-2">{idx + 1}. {q.question}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt: string, oIdx: number) => (
                    <label key={oIdx} className={`flex items-center p-2 rounded cursor-pointer border ${answers[idx] === oIdx ? "border-indigo-600 bg-indigo-50 dark:bg-yellow-100/10" : "border-gray-300"}`}>
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={oIdx}
                        checked={answers[idx] === oIdx}
                        onChange={() => handleOptionChange(idx, oIdx)}
                        className="mr-2"
                        required
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 dark:bg-yellow-500 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-yellow-600 transition-all font-semibold">
              {loading ? "Submitting..." : "Submit Answers"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}