import React from "react";
import { motion } from "framer-motion";
import { Eye, Target, Users, TrendingUp } from "lucide-react";

const Vision = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-6 lg:px-8 text-center"
      >
        <h1 className="text-5xl font-extrabold text-gray-900">
          Our <span className="text-indigo-600">Vision</span>
        </h1>
        <p className="mt-5 text-lg text-gray-600 sm:text-xl max-w-3xl mx-auto">
          To become the global leader in career development, empowering individuals
          with cutting-edge technology, fostering innovation, and building a future
          where opportunities are accessible to everyone.
        </p>
      </motion.div>

      {/* Vision Statement */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mt-16 max-w-5xl mx-auto px-6 lg:px-8 bg-white/90 rounded-xl shadow-lg p-8 border border-gray-200 backdrop-blur-lg hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl text-center"
      >
        <h2 className="text-3xl font-semibold text-gray-900">Our Aspiration</h2>
        <p className="mt-4 text-gray-600 text-lg">
          We strive to build a world where individuals can seamlessly access personalized
          career guidance, leveraging AI and blockchain to drive professional growth and
          global collaborations.
        </p>
      </motion.div>

      {/* Pillars of Our Vision */}
      <div className="mt-16 max-w-6xl mx-auto px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 text-center">Pillars of Our Vision</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8"
        >
          {/* Clarity of Purpose */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/90 rounded-xl shadow-lg p-6 border border-gray-200 backdrop-blur-lg hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl text-center"
          >
            <Eye className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Clarity of Purpose</h3>
            <p className="text-gray-600 mt-2">
              We envision a world where individuals have clear career pathways powered by AI insights.
            </p>
          </motion.div>

          {/* Innovation & Growth */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/90 rounded-xl shadow-lg p-6 border border-gray-200 backdrop-blur-lg hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl text-center"
          >
            <TrendingUp className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Innovation & Growth</h3>
            <p className="text-gray-600 mt-2">
              Continuously evolving our platform to match the ever-changing job market.
            </p>
          </motion.div>

          {/* Community & Collaboration */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/90 rounded-xl shadow-lg p-6 border border-gray-200 backdrop-blur-lg hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl text-center"
          >
            <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Community & Collaboration</h3>
            <p className="text-gray-600 mt-2">
              Building a strong global network to foster learning and shared success.
            </p>
          </motion.div>

          {/* Impactful Solutions */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/90 rounded-xl shadow-lg p-6 border border-gray-200 backdrop-blur-lg hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl text-center"
          >
            <Target className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Impactful Solutions</h3>
            <p className="text-gray-600 mt-2">
              Creating career tools that are meaningful, reliable, and transformative.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mt-20 max-w-5xl mx-auto px-6 lg:px-8 text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900">Be Part of the Future</h2>
        <p className="mt-4 text-gray-600 text-lg">
          Join us in shaping a future where career success is not just a dream but an
          achievable reality for all.
        </p>
      </motion.div>
    </div>
  );
};

export default Vision;
