import React, { useState } from "react";
import { motion } from "framer-motion";

interface Resource {
  title: string;
  description: string;
  category: string;
  link: string;
}

const allResources: Resource[] = [
  // Engineering & Tech
  {
    title: "freeCodeCamp",
    description: "Learn to code for free with interactive lessons and projects.",
    category: "Engineering",
    link: "https://www.freecodecamp.org"
  },
  {
    title: "CS50 by Harvard",
    description: "Introduction to computer science from Harvard University.",
    category: "Engineering",
    link: "https://cs50.harvard.edu"
  },
  {
    title: "GeeksforGeeks",
    description: "A computer science portal with tutorials and coding practice.",
    category: "Engineering",
    link: "https://www.geeksforgeeks.org"
  },
  {
    title: "MDN Web Docs",
    description: "Comprehensive resource for web development documentation.",
    category: "Engineering",
    link: "https://developer.mozilla.org"
  },
  {
    title: "W3Schools",
    description: "Web development tutorials for beginners and pros.",
    category: "Engineering",
    link: "https://www.w3schools.com"
  },

  // Medical
  {
    title: "Khan Academy MCAT",
    description: "Free MCAT prep materials by Khan Academy.",
    category: "Medical",
    link: "https://www.khanacademy.org/test-prep/mcat"
  },
  {
    title: "Osmosis",
    description: "Medical and health education videos and flashcards.",
    category: "Medical",
    link: "https://www.osmosis.org"
  },
  {
    title: "AMBOSS",
    description: "Clinical knowledge library and medical exam prep.",
    category: "Medical",
    link: "https://www.amboss.com"
  },
  {
    title: "Lecturio",
    description: "Comprehensive medical learning platform.",
    category: "Medical",
    link: "https://www.lecturio.com"
  },

  // Mathematics
  {
    title: "Brilliant",
    description: "Interactive problem-solving in math and science.",
    category: "Mathematics",
    link: "https://www.brilliant.org"
  },
  {
    title: "PatrickJMT",
    description: "Math tutorials and explanations.",
    category: "Mathematics",
    link: "https://www.youtube.com/user/patrickJMT"
  },

  // Sports
  {
    title: "Athlean-X",
    description: "Science-based workout plans and fitness advice.",
    category: "Sports",
    link: "https://athleanx.com"
  },
  {
    title: "Nike Training Club",
    description: "Home workouts and training programs.",
    category: "Sports",
    link: "https://www.nike.com/ntc-app"
  },

  // Music
  {
    title: "Yousician",
    description: "Learn guitar, piano, bass, and more interactively.",
    category: "Music",
    link: "https://www.yousician.com"
  },
  {
    title: "Coursera - Music Theory",
    description: "Courses on music theory from Berklee, Yale, and more.",
    category: "Music",
    link: "https://www.coursera.org/browse/arts-and-humanities/music"
  },

  // Physics
  {
    title: "Physics Galaxy",
    description: "Physics video lectures and questions for competitive exams.",
    category: "Physics",
    link: "https://www.physicsgalaxy.com"
  },
  {
    title: "HyperPhysics",
    description: "Conceptual explanations of physics topics.",
    category: "Physics",
    link: "http://hyperphysics.phy-astr.gsu.edu"
  },

  // Geography
  {
    title: "National Geographic Education",
    description: "Geography resources and educational content.",
    category: "Geography",
    link: "https://education.nationalgeographic.org"
  },
  {
    title: "Seterra",
    description: "Interactive map quizzes to learn geography.",
    category: "Geography",
    link: "https://www.seterra.com"
  },

  // History
  {
    title: "CrashCourse History",
    description: "Entertaining educational history series on YouTube.",
    category: "History",
    link: "https://www.youtube.com/user/crashcourse"
  },
  {
    title: "HistoryExtra",
    description: "Podcast and articles from BBC History Magazine.",
    category: "History",
    link: "https://www.historyextra.com"
  },

  // Government Exams
  {
    title: "Unacademy",
    description: "Indian government exam prep platform (UPSC, SSC, etc.).",
    category: "Government Exams",
    link: "https://unacademy.com"
  },
  {
    title: "Testbook",
    description: "Mock tests and preparation material for Indian competitive exams.",
    category: "Government Exams",
    link: "https://testbook.com"
  },

  // Chemistry
  {
    title: "ChemCollective",
    description: "Virtual labs and scenario-based learning in chemistry.",
    category: "Chemistry",
    link: "http://chemcollective.org"
  },
  {
    title: "Khan Academy Chemistry",
    description: "Comprehensive chemistry lessons and practice.",
    category: "Chemistry",
    link: "https://www.khanacademy.org/science/chemistry"
  },

  // Biology
  {
    title: "Bozeman Science",
    description: "Biology and science educational videos.",
    category: "Biology",
    link: "https://www.bozemanscience.com"
  },
  {
    title: "BioInteractive",
    description: "Free classroom resources and science videos.",
    category: "Biology",
    link: "https://www.biointeractive.org"
  },

  // Miscellaneous
  {
    title: "TED-Ed",
    description: "Educational videos on a wide variety of topics.",
    category: "General",
    link: "https://ed.ted.com"
  },
  {
    title: "edX",
    description: "University-level courses from MIT, Harvard, and more.",
    category: "General",
    link: "https://www.edx.org"
  }
];

const categories = [
  "All",
  ...Array.from(new Set(allResources.map((res) => res.category)))
];

export function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredResources = selectedCategory === "All"
    ? allResources
    : allResources.filter((res) => res.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">Explore Learning Resources</h1>

      <div className="flex flex-wrap gap-4 justify-center mb-10">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${selectedCategory === category
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-100"}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResources.map((resource, index) => (
          <motion.a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            key={index}
            className="block bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:border-indigo-500 transition-all"
          >
            <h3 className="text-xl font-bold text-indigo-700 mb-2">{resource.title}</h3>
            <p className="text-gray-600">{resource.description}</p>
            <span className="text-xs mt-2 inline-block text-indigo-500 font-medium">{resource.category}</span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
