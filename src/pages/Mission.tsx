import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, Users, Rocket, Globe } from "lucide-react";

const Mission = () => {
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
          Our <span className="text-indigo-600">Mission</span>
        </h1>
        <p className="mt-5 text-lg text-gray-600 sm:text-xl max-w-3xl mx-auto">
          Empowering individuals through technology, fostering collaboration, and 
          driving innovation for a brighter and more connected future.
        </p>
      </motion.div>

      {/* Mission Statement */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mt-16 max-w-5xl mx-auto px-6 lg:px-8 bg-white/90 rounded-xl shadow-lg p-8 border border-gray-200 backdrop-blur-lg hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl text-center"
      >
        <h2 className="text-3xl font-semibold text-gray-900">Our Purpose</h2>
        <p className="mt-4 text-gray-600 text-lg">
          We aim to revolutionize career guidance by leveraging AI technology and blockchain security, 
          making professional development accessible and personalized for everyone. Our mission is to 
          promote technological advancement, encourage collaborations between individuals, and empower 
          the next generation of innovators.
        </p>
      </motion.div>

      {/* Core Values */}
      <div className="mt-16 max-w-6xl mx-auto px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 text-center">Core Values</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8"
        >
          {/* Innovation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/90 rounded-xl shadow-lg p-6 border border-gray-200 backdrop-blur-lg hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl text-center"
          >
            <Lightbulb className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Innovation</h3>
            <p className="text-gray-600 mt-2">
              We embrace cutting-edge technologies to provide forward-thinking solutions.
            </p>
          </motion.div>

          {/* Collaboration */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/90 rounded-xl shadow-lg p-6 border border-gray-200 backdrop-blur-lg hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl text-center"
          >
            <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Collaboration</h3>
            <p className="text-gray-600 mt-2">
              Encouraging teamwork and knowledge-sharing to achieve collective success.
            </p>
          </motion.div>

          {/* Growth */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/90 rounded-xl shadow-lg p-6 border border-gray-200 backdrop-blur-lg hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl text-center"
          >
            <Rocket className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Growth</h3>
            <p className="text-gray-600 mt-2">
              Providing opportunities for continuous learning and personal development.
            </p>
          </motion.div>

          {/* Global Impact */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/90 rounded-xl shadow-lg p-6 border border-gray-200 backdrop-blur-lg hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl text-center"
          >
            <Globe className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Global Impact</h3>
            <p className="text-gray-600 mt-2">
              Aiming to create solutions that benefit communities worldwide.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Our Approach */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mt-20 max-w-6xl mx-auto px-6 lg:px-8 bg-white/90 rounded-xl shadow-lg p-8 border border-gray-200 backdrop-blur-lg hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl text-center"
      >
        <h2 className="text-3xl font-semibold text-gray-900">Our Approach</h2>
        <p className="mt-4 text-gray-600 text-lg">
          We combine AI-powered analytics with a deep understanding of industry needs to create a platform 
          that guides individuals toward the right career paths. By harnessing blockchain technology, we ensure 
          security, transparency, and credibility in all processes.
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mt-20 max-w-5xl mx-auto px-6 lg:px-8 text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900">Join Us in Shaping the Future</h2>
        <p className="mt-4 text-gray-600 text-lg">
          Be part of a movement that is redefining career guidance and professional development. 
          Let's build a smarter and more innovative tomorrow together.
        </p>
      </motion.div>
    </div>
  );
};

export default Mission;
