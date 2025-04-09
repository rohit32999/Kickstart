import { useState } from "react";
import { motion } from "framer-motion";

const categories = [
  "Engineering",
  "Medical",
  "Mathematics",
  "Sports",
  "Music",
  "Physics",
  "Geography",
  "History",
  "Government Exams",
  "Chemistry",
  "Biology"
];

const certifications = [
  {
    title: "Google IT Support Professional Certificate",
    description: "Kickstart a career in IT with a professional certificate from Google.",
    link: "https://www.coursera.org/professional-certificates/google-it-support",
    category: "Engineering"
  },
  {
    title: "Harvard Medical School HMX Fundamentals",
    description: "Fundamental courses in immunology, physiology, and genetics.",
    link: "https://onlinelearning.hms.harvard.edu/hmx",
    category: "Medical"
  },
  {
    title: "Mathematics for Machine Learning by Imperial College London",
    description: "Strengthen your foundational math skills for AI and data science.",
    link: "https://www.coursera.org/specializations/mathematics-machine-learning",
    category: "Mathematics"
  },
  {
    title: "Sport Management Certificate by University of Michigan",
    description: "Learn the business of sports through real-world case studies.",
    link: "https://www.coursera.org/specializations/sport-management",
    category: "Sports"
  },
  {
    title: "Berklee Music Production Specialization",
    description: "Master music production, songwriting, and mixing.",
    link: "https://www.coursera.org/specializations/music-production",
    category: "Music"
  },
  {
    title: "Quantum Mechanics by MITx",
    description: "Learn the principles of quantum physics from MIT.",
    link: "https://learning.edx.org/course/course-v1:MITx+8.04x+3T2020/home",
    category: "Physics"
  },
  {
    title: "Geography of Earth by University of Reading",
    description: "Understand physical landscapes and geographical systems.",
    link: "https://www.futurelearn.com/courses/physical-geography",
    category: "Geography"
  },
  {
    title: "History of the World by University of Virginia",
    description: "Explore global history from ancient to modern times.",
    link: "https://www.coursera.org/learn/big-history",
    category: "History"
  },
  {
    title: "UPSC Preparation by Unacademy",
    description: "Comprehensive resources and mentorship for Indian government exams.",
    link: "https://unacademy.com/goal/upsc-civil-services-examination-ias-preparation/CHIJN",
    category: "Government Exams"
  },
  {
    title: "Introduction to Chemistry by Duke University",
    description: "Grasp the basic concepts of chemistry and their applications.",
    link: "https://www.coursera.org/learn/introduction-chemistry",
    category: "Chemistry"
  },
  {
    title: "Essential Biology by MIT",
    description: "Deep dive into cell biology, genetics and molecular biology.",
    link: "https://ocw.mit.edu/courses/biology/7-012-introduction-to-biology-fall-2004/",
    category: "Biology"
  }
];

export function Certification() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCertifications =
    selectedCategory === "All"
      ? certifications
      : certifications.filter((cert) => cert.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">
          Certification Programs
        </h1>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === "All" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 border-indigo-600"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === cat ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 border-indigo-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertifications.map((cert, index) => (
            <motion.a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              key={index}
              className="block bg-white rounded-xl shadow-md p-6 border hover:border-indigo-500 transition-all"
            >
              <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
                {cert.title}
              </h2>
              <p className="text-gray-600 mb-4">{cert.description}</p>
              <span className="inline-block text-sm text-indigo-500 font-medium">
                Category: {cert.category}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Certification;
