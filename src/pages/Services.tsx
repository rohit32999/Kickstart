import React from 'react';
import { Brain, FileCheck, BookOpen, MessageSquare, Award, Users } from 'lucide-react';
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function Services() {
  // const { user } = useAuth();
  useAuth();
  const navigate = useNavigate();
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>, title: string) => {
    event.preventDefault();
    if (title === "Learning Resources") {
      navigate("/resources");
    } 
    else if (title === "Certification Programs") {
      navigate("/certification");
    }
    else if (title === "AI Career Guidance") {
      navigate("/AICareerGuidance");
    }
    else if (title === "AI Chat Support") {
      navigate("/services/career-chat");
    }
    else {
      navigate("/dashboard");
    }
  };

  const services = [
    {
      icon: Brain,
      title: "AI Career Guidance",
      description: "Get personalized career recommendations based on your skills, interests, and academic performance using advanced AI algorithms.",
      features: [
        "Personalized career path recommendations",
        "Skill gap analysis",
        "Industry trend insights",
        "Career progression planning"
      ]
    },
    {
      icon: FileCheck,
      title: "Secure Document Management",
      description: "Store and verify your academic credentials securely using blockchain technology.",
      features: [
        "Blockchain verification",
        "Secure document storage",
        "Easy sharing options",
        "Tamper-proof records"
      ]
    },
    {
      icon: BookOpen,
      title: "Learning Resources",
      description: "Access curated learning materials and courses tailored to your career goals.",
      features: [
        "Curated course recommendations",
        "Skill development resources",
        "Industry-specific training",
        "Progress tracking"
      ]
    },    {
      icon: MessageSquare,
      title: "AI Chat Support",
      description: "Get instant answers to your career-related questions from our AI-powered chatbot with personalized career guidance.",
      features: [
        "24/7 career chat availability",
        "Instant AI-powered responses",
        "Personalized career guidance",
        "Multi-language support",
        "Career recommendation chat",
        "PDF export of conversations"
      ]
    },
    {
      icon: Award,
      title: "Certification Programs",
      description: "Earn certificates in various domains to enhance your professional profile.",
      features: [
        "Industry-recognized certificates",
        "Skill assessments",
        "Digital badges",
        "Portfolio building"
      ]
    },
    {
      icon: Users,
      title: "Mentorship Connection",
      description: "Connect with industry professionals for guidance and mentorship.",
      features: [
        "Expert mentorship",
        "Industry connections",
        "Networking opportunities",
        "Career advice"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white sm:text-6xl mb-2">Our <span className="text-indigo-600 dark:text-yellow-400">Services</span></h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 sm:text-xl max-w-3xl mx-auto">
          Comprehensive career development solutions powered by AI and blockchain technology.
        </p>
      </motion.div>

      <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.button
              key={index}
              onClick={(e) => handleButtonClick(e, service.title)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="relative group bg-white/90 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 text-left w-full border border-gray-200 dark:border-gray-700 backdrop-blur-lg hover:border-indigo-500 dark:hover:border-yellow-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl"
            >
              <div className="flex items-center mb-4">
                <motion.div whileHover={{ rotate: 10, scale: 1.2 }}>
                  <service.icon className="h-12 w-12 text-indigo-600 dark:text-yellow-400 transition-all duration-300 group-hover:text-indigo-800 dark:group-hover:text-yellow-300" />
                </motion.div>
                <h3 className="ml-3 text-xl font-bold text-gray-900 dark:text-white transition-all duration-300 group-hover:text-indigo-800 dark:group-hover:text-yellow-300">
                  {service.title}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>

              <ul className="mt-2 space-y-2">
                {service.features.map((feature, index) => (
                  typeof feature === "string" ? (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                      <svg className="h-5 w-5 text-indigo-600 dark:text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ) : (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                      <svg className="h-5 w-5 text-indigo-600 dark:text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <button
                        onClick={e => { e.stopPropagation(); navigate('/services/iq-test'); }}
                        className="ml-1 underline text-indigo-600 dark:text-yellow-400 hover:text-indigo-800 dark:hover:text-yellow-300 transition-all"
                      >
                        {feature}
                      </button>
                    </li>
                  )
                ))}
              </ul>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
