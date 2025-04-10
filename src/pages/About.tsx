import React from "react";
import { Rocket, Target, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations

export function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-16 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white sm:text-6xl">
          About <span className="text-indigo-600 dark:text-yellow-400">Kickstart</span>
        </h1>
        <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 sm:text-xl max-w-3xl mx-auto">
          Empowering students and professionals to make informed career decisions through AI-driven guidance and secure credential management.
        </p>
      </motion.div>

      {/* Mission & Vision Section */}
      <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {[
            {
              icon: Rocket,
              title: "Our Mission",
              text: "To revolutionize career guidance by leveraging AI technology and blockchain security, making professional development accessible and personalized for everyone.",
              link: "/mission",
            },
            {
              icon: Target,
              title: "Our Vision",
              text: "To become the leading platform for career development, trusted by students and professionals worldwide for its innovative approach to career guidance.",
              link: "/vision",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="p-8 rounded-xl bg-white/90 dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-lg hover:border-indigo-500 dark:hover:border-yellow-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl"
            >
              <div className="flex items-center mb-4">
                <motion.div whileHover={{ rotate: 10, scale: 1.2 }}>
                  <item.icon className="h-10 w-10 text-indigo-600 dark:text-yellow-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white ml-3">{item.title}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{item.text}</p>
              <button
                onClick={() => navigate(item.link)}
                className="mt-4 px-5 py-2 bg-indigo-600 dark:bg-yellow-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-yellow-600 transition-all duration-300"
              >
                Learn More
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Values Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {[
            { icon: Users, title: "User-Centric", text: "We prioritize our users, ensuring a seamless and valuable experience." },
            { icon: Shield, title: "Security", text: "Blockchain technology ensures secure and private data handling." },
            { icon: Target, title: "Innovation", text: "We continuously innovate to provide top-tier career solutions." },
          ].map((value, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="p-6 rounded-lg bg-white/90 dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 backdrop-blur-lg hover:border-indigo-500 dark:hover:border-yellow-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl"
            >
              <motion.div whileHover={{ rotate: 10, scale: 1.2 }} className="mb-4">
                <value.icon className="h-12 w-12 text-indigo-600 dark:text-yellow-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{value.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Information Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mt-16 max-w-5xl mx-auto bg-white/90 dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 backdrop-blur-lg"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Project Details</h2>
        <div className="space-y-4">
          {[
            { label: "Department", value: "Computer Science & Engineering" },
            { label: "Semester", value: "7th" },
            { label: "Subject", value: "Project-II (CS781)" },
            { label: "Institution", value: "Academy of Technology" },
            { label: "Affiliated to", value: "Maulana Abul Kalam Azad University of Technology, West Bengal" },
          ].map((detail, index) => (
            <p key={index} className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-white">{detail.label}:</span> {detail.value}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
