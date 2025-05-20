import React from "react";
import { Home as HomeIcon, BookOpen, Award, MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!user) {
      navigate("/login");
    } else {
      navigate("/services");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white flex flex-col">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full px-4 sm:px-8 lg:px-0 pt-12 pb-24 text-center flex flex-col items-center justify-center bg-transparent shadow-none border-none rounded-none"
        style={{ minHeight: 'unset', maxWidth: 'unset' }}
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white drop-shadow-xl mb-2 w-full leading-[1.1] md:leading-[1.4]" style={{ paddingBottom: '0.25em' }}>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-blue-700 dark:from-yellow-300 dark:via-yellow-500 dark:to-yellow-700 animate-gradient-x">
            Launching Dreams,
          </span>
          <span className="block text-indigo-700 dark:text-yellow-400 animate-fade-in">Shaping Futures</span>
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg sm:text-xl text-gray-700 dark:text-gray-200 font-medium animate-fade-in">
          Navigate your career journey with <span className="font-bold text-indigo-600 dark:text-yellow-400">AI-powered guidance</span> and <span className="font-bold text-indigo-600 dark:text-yellow-400">secure credential management</span>.
        </p>
        <div className="mt-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleButtonClick}
            className="px-12 py-5 font-semibold text-2xl rounded-full text-white bg-gradient-to-r from-indigo-600 via-blue-500 to-blue-700 hover:from-indigo-700 hover:to-blue-800 dark:from-yellow-500 dark:via-yellow-400 dark:to-yellow-600 dark:hover:from-yellow-600 dark:hover:to-yellow-700 shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-yellow-200 animate-bounce-slow"
          >
            Start Your Journey
          </motion.button>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                icon: HomeIcon,
                title: "Personalized Guidance",
                description: "AI-powered career recommendations tailored to your profile.",
              },
              {
                icon: BookOpen,
                title: "Learning Resources",
                description: "Access curated educational materials and courses.",
              },
              {
                icon: Award,
                title: "Secure Credentials",
                description: "Blockchain-powered document verification system.",
              },
              {
                icon: MessageCircle,
                title: "AI Chat Support",
                description: "24/7 intelligent career guidance assistance.",
              },
            ].map((feature, index) => (
              <button
                onClick={handleButtonClick}
                key={index}
                className="relative flex flex-col p-6 bg-white/90 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-lg transition-all duration-300 ease-in-out group hover:scale-105 hover:shadow-2xl hover:bg-indigo-50 dark:hover:bg-yellow-100 hover:border-indigo-500 dark:hover:border-yellow-500"
              >
                {/* Icon */}
                <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-yellow-400 shadow-lg transition-all duration-300 group-hover:bg-indigo-500 group-hover:scale-110 group-hover:shadow-indigo-400/60 dark:group-hover:bg-yellow-300">
                  <feature.icon className="h-10 w-10 text-indigo-600 dark:text-yellow-700 transition-all duration-300 group-hover:text-white dark:group-hover:text-yellow-800" />
                </div>

                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white transition-all duration-300 group-hover:text-indigo-700 dark:group-hover:text-yellow-700">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-center transition-all duration-300 group-hover:text-indigo-600 dark:group-hover:text-yellow-800">
                  {feature.description}
                </p>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
