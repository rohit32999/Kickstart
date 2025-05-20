import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function AICareerGuidance() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only run redirect logic after user is resolved at least once
    if (user === undefined) return; // Wait for AuthProvider to resolve
    setAuthChecked(true);
    if (user === null) {
      navigate("/login");
    }
    // If user is present, do nothing
  }, [user, navigate]);

  if (!authChecked) {
    // Optionally show a loading spinner or nothing while auth is being checked
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100/80 to-blue-200/60 dark:from-gray-900/80 dark:to-gray-800/60 text-gray-900 dark:text-white py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="bg-white/90 dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center border border-gray-200 dark:border-gray-700"
      >
        {/* Centered circular icon with poppy hover effect */}
        <motion.div
          className="flex justify-center mb-6"
          whileHover={{ scale: 1.15, rotate: 6 }}
        >
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200 to-blue-200 dark:from-yellow-300 dark:to-yellow-500 shadow-xl transition-all duration-300 hover:bg-indigo-300 dark:hover:bg-yellow-200 hover:shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" strokeWidth={2} stroke="currentColor" className="w-14 h-14 text-indigo-600 dark:text-yellow-700 transition-all duration-300 group-hover:text-indigo-900 dark:group-hover:text-yellow-900">
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M24 14v8m0 0v8m0-8h8m-8 0h-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>
        <h1 className="text-4xl font-extrabold mb-4 text-indigo-600 dark:text-yellow-400 drop-shadow-lg animate-fade-in">AI Career Guidance</h1>
        <p className="mb-8 text-lg text-gray-700 dark:text-gray-300 animate-fade-in">
          Discover your unique strengths and explore tailored career opportunities with the help of our intelligent AI system. Our platform analyzes your profile to suggest pathways that align with your aspirations and evolving industry needs.
        </p>
        <div className="mb-8 flex justify-center">
          <span className="text-center text-lg font-semibold italic text-gray-500 dark:text-gray-400 opacity-80 animate-fade-in" style={{ letterSpacing: '0.5px' }}>
            Let's dive deep into your potential and start planning for long-term professional growth.
          </span>
        </div>
        <p className="mb-6 text-base text-gray-600 dark:text-gray-400 animate-fade-in">
          Take our IQ assessment to gain deeper insights into your cognitive strengths. Your results will help us further personalize your career recommendations and identify roles where your unique abilities can shine.
        </p>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/IQTest")}
          className="px-10 py-4 font-semibold text-lg rounded-full text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 dark:from-yellow-500 dark:to-yellow-400 dark:hover:from-yellow-600 dark:hover:to-yellow-500 shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-yellow-200"
        >
          Assess Your Cognitive Strengths
        </motion.button>
      </motion.div>
    </div>
  );
}