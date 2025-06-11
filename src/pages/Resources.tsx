import { useState } from "react";
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
  {
  title: "MIT OpenCourseWare - Engineering",
  description: "Free courses and lecture materials from MIT’s engineering departments.",
  category: "Engineering",
  link: "https://ocw.mit.edu/courses/find-by-topic/#cat=engineering"
},
{
  title: "NPTEL",
  description: "India’s premier platform for engineering and technical courses by IITs and IISc.",
  category: "Engineering",
  link: "https://nptel.ac.in"
},
{
  title: "Coursera - Engineering Courses",
  description: "University-led courses on electrical, mechanical, and software engineering topics.",
  category: "Engineering",
  link: "https://www.coursera.org/browse/engineering"
},
{
  title: "MIT Open Learning Library",
  description: "Interactive engineering courses and problem sets from MIT.",
  category: "Engineering",
  link: "https://openlearninglibrary.mit.edu"
},
{
  title: "Engineering Toolbox",
  description: "Reference tools, formulas, and data tables for mechanical, civil, and electrical engineering.",
  category: "Engineering",
  link: "https://www.engineeringtoolbox.com"
},
{
  title: "Khan Academy - Electrical Engineering",
  description: "Basic to intermediate video tutorials on electrical engineering topics.",
  category: "Engineering",
  link: "https://www.khanacademy.org/science/electrical-engineering"
},
{
  title: "EDN Network",
  description: "Technical articles, news, and how-to guides for professional electronics engineers.",
  category: "Engineering",
  link: "https://www.edn.com"
},


  // Medical
  {
  title: "AnkiWeb – Medical Decks",
  description: "Spaced repetition flashcards for medical topics like anatomy, pharmacology, and USMLE.",
  category: "Medical",
  link: "https://ankiweb.net/shared/decks/medicine"
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
  {
  title: "Pathoma",
  description: "Concise, high-yield pathology video lectures and textbook by Dr. Sattar, widely used for USMLE prep.",
  category: "Medical",
  link: "https://www.pathoma.com"
},
{
  title: "Dr. Najeeb Lectures",
  description: "Extensive video lectures on medical topics with detailed illustrations and explanations.",
  category: "Medical",
  link: "https://www.drnajeeblectures.com"
},
{
  title: "Kenhub",
  description: "Interactive anatomy tutorials, quizzes, and videos for medical students.",
  category: "Medical",
  link: "https://www.kenhub.com"
},
{
  title: "Radiopaedia",
  description: "A collaborative radiology resource with cases, imaging, and reference articles.",
  category: "Medical",
  link: "https://radiopaedia.org"
},
{
  title: "OnlineMedEd",
  description: "Comprehensive medical curriculum videos, notes, and question banks for clinical learning.",
  category: "Medical",
  link: "https://www.onlinemeded.org"
},
{
  title: "PubMed",
  description: "Massive database of peer-reviewed biomedical research articles for reference and review.",
  category: "Medical",
  link: "https://pubmed.ncbi.nlm.nih.gov"
},
{
  title: "BMJ Learning",
  description: "Interactive continuing medical education modules and clinical case discussions.",
  category: "Medical",
  link: "https://learning.bmj.com"
},
{
  title: "MedCram",
  description: "Clear and concise medical videos covering topics like ECG, COVID-19, and internal medicine.",
  category: "Medical",
  link: "https://www.medcram.com"
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
  {
   title: "Khan Academy",
   description: "Free online courses, lessons, and practice in math and more.",
   category: "Mathematics",
   link: "https://www.khanacademy.org/"
  },

  {
  title: "Art of Problem Solving (AoPS)",
  description: "Advanced math resources and community for problem-solving enthusiasts.",
  category: "Mathematics",
  link: "https://artofproblemsolving.com"
},
{
  title: "Numberphile",
  description: "YouTube channel exploring fascinating math concepts through storytelling.",
  category: "Mathematics",
  link: "https://www.youtube.com/user/numberphile"
},
{
  title: "Paul's Online Math Notes",
  description: "Comprehensive notes and tutorials on algebra, calculus, and more.",
  category: "Mathematics",
  link: "https://tutorial.math.lamar.edu"
},
{
  title: "Mathigon",
  description: "Interactive math platform with engaging lessons and manipulatives.",
  category: "Mathematics",
  link: "https://mathigon.org"
},
{
  title: "Wolfram Demonstrations Project",
  description: "Interactive math & science visualizations powered by Wolfram code.",
  category: "Mathematics",
  link: "https://demonstrations.wolfram.com"
},
{
  title: "Geogebra",
  description: "Dynamic math software for geometry, algebra, calculus, and more.",
  category: "Mathematics",
  link: "https://www.geogebra.org"
},
{
  title: "Wolfram Alpha",
  description: "Computational engine that solves math problems with step‑by‑step solutions.",
  category: "Mathematics",
  link: "https://www.wolframalpha.com"
},
{
  title: "Polypad (by Mathigon)",
  description: "Digital manipulatives for hands‑on exploration in math.",
  category: "Mathematics",
  link: "https://mathigon.org/polypad"
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
  {
  title: "ESPN",
  description: "Comprehensive sports coverage including scores, news, and analysis.",
  category: "Sports",
  link: "https://www.espn.com"
},
{
  title: "Olympics",
  description: "Official Olympic Games website featuring news, results, and athlete stories.",
  category: "Sports",
  link: "https://olympics.com"
},
{
  title: "Bleacher Report",
  description: "Sports news, highlights, and commentary on major leagues and events.",
  category: "Sports",
  link: "https://bleacherreport.com"
},
{
  title: "FIFA",
  description: "Official site for international football (soccer), including news and tournament info.",
  category: "Sports",
  link: "https://www.fifa.com"
},
{
  title: "Sports‑Reference",
  description: "Extensive stats and historical data across major sports.",
  category: "Sports",
  link: "https://www.sports-reference.com"
},
{
  title: "Science for Sport",
  description: "Evidence‑based performance and sports science content.",
  category: "Sports",
  link: "https://www.scienceforsport.com"
},
{
  title: "Journal of Sports Science & Medicine",
  description: "Peer‑reviewed research on sports science and medicine.",
  category: "Sports",
  link: "https://www.jssm.org"
},
{
  title: "My Sport Science",
  description: "Insights on sports science and nutrition by Asker Jeukendrup.",
  category: "Sports",
  link: "https://www.mysportscience.com"
},
{
  title: "Exercise Therapy Association",
  description: "Resources and training on exercise therapy and rehabilitation.",
  category: "Sports",
  link: "https://www.exercisetherapyassociation.org"
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
  {
  title: "musictheory.net",
  description: "Free lessons and tools for learning music theory.",
  category: "Music",
  link: "https://www.musictheory.net"
},
{
  title: "Justin Guitar",
  description: "Free guitar lessons for beginners and intermediate players.",
  category: "Music",
  link: "https://www.justinguitar.com"
},
{
  title: "Soundtrap by Spotify",
  description: "Online music studio for creating, recording, and collaborating on music.",
  category: "Music",
  link: "https://www.soundtrap.com"
},
{
  title: "8notes",
  description: "Free sheet music, lessons, and tools for various instruments and styles.",
  category: "Music",
  link: "https://www.8notes.com"
},
{
  title: "Musicca",
  description: "Free interactive music theory lessons and exercises.",
  category: "Music",
  link: "https://www.musicca.com"
},
{
  title: "Carnegie Hall Music Educators Toolbox",
  description: "Free lesson plans and classroom music materials.",
  category: "Music",
  link: "https://www.carnegiehall.org/Education/Programs/Music-Educators-Toolbox"
},
{
  title: "Flat.io",
  description: "Collaborative music notation tool, popular in teaching.",
  category: "Music",
  link: "https://flat.io"
},
{
  title: "SmartMusic",
  description: "Interactive practice software for instrumentalists & educators.",
  category: "Music",
  link: "https://www.smartmusic.com"
},
{
  title: "Chrome Music Lab",
  description: "Web‑based experiments exploring music creation and sound.",
  category: "Music",
  link: "https://musiclab.chromeexperiments.com"
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
  {
  title: "MinutePhysics",
  description: "Engaging short videos explaining physics concepts with clarity and creativity.",
  category: "Physics",
  link: "https://www.youtube.com/user/minutephysics"
},
{
  title: "The Physics Classroom",
  description: "Student-friendly tutorials, simulations, and concept builders for high school physics.",
  category: "Physics",
  link: "https://www.physicsclassroom.com"
},
{
  title: "Phys.org - Physics News",
  description: "Latest physics research news and articles from around the world.",
  category: "Physics",
  link: "https://phys.org/physics-news"
},
{
  title: "MIT OpenCourseWare - Physics",
  description: "Free MIT physics courses and lecture videos available to all learners.",
  category: "Physics",
  link: "https://ocw.mit.edu/courses/physics"
},
{
  title: "APlusPhysics",
  description: "AP Physics resource recommended by teachers.",
  category: "Physics",
  link: "https://www.aplusphysics.com"
},
{
  title: "Physics to Go",
  description: "Curated free physics games, webcasts, and articles.",
  category: "Physics",
  link: "https://guides.lib.uw.edu/physics"
},
{
  title: "The Quantum Cat",
  description: "Aggregated list of free modern physics resources.",
  category: "Physics",
  link: "https://www.thequantumcat.space"
},
{
  title: "Physics Forums",
  description: "Peer discussions, problem help, and resource sharing.",
  category: "Physics",
  link: "https://www.physicsforums.com"
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
{
  title: "CIA World Factbook",
  description: "Comprehensive information on the history, geography, and politics of every country.",
  category: "Geography",
  link: "https://www.cia.gov/the-world-factbook"
},
{
  title: "NASA Earth Observatory",
  description: "Global maps and satellite data visualizing Earth’s physical and environmental changes.",
  category: "Geography",
  link: "https://earthobservatory.nasa.gov"
},
{
  title: "Royal Geographical Society",
  description: "Educational resources, fieldwork guides, and case studies for geography students and teachers.",
  category: "Geography",
  link: "https://www.rgs.org"
},
{
  title: "Royal Geographical Society – Geography at Home",
  description: "Resources and events for remote geography learning.",
  category: "Geography",
  link: "https://www.rgs.org/schools/resources-for-schools/geography-at-home"
},
{
  title: "Coursera Geography Courses",
  description: "University‑led geography courses and certificates.",
  category: "Geography",
  link: "https://www.coursera.org/courses?query=geography"
},
{
  title: "CIA World Factbook",
  description: "Authoritative country facts, maps, and statistics.",
  category: "Geography",
  link: "https://www.cia.gov/the-world-factbook"
},
{
  title: "NASA Earth Observatory",
  description: "Satellite imagery and data visualizing Earth’s changes.",
  category: "Geography",
  link: "https://earthobservatory.nasa.gov"
},
{
  title: "World Geography Games",
  description: "Interactive quizzes and maps for learning world geography.",
  category: "Geography",
  link: "https://world-geography-games.com"
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
  {
  title: "History Today",
  description: "Well-researched articles and essays on global historical topics and current perspectives.",
  category: "History",
  link: "https://www.historytoday.com"
},
{
  title: "BBC Bitesize - History",
  description: "Student-friendly history revision and learning resources from the BBC.",
  category: "History",
  link: "https://www.bbc.co.uk/bitesize/subjects/zxsfnbk"
},
{
  title: "Facing History and Ourselves",
  description: "Explores history with a focus on social justice, ethics, and civic responsibility.",
  category: "History",
  link: "https://www.facinghistory.org"
},
{
  title: "Digital Public Library of America (DPLA) - Exhibitions",
  description: "Curated digital history exhibitions and primary sources from U.S. libraries and museums.",
  category: "History",
  link: "https://dp.la/exhibitions"
},
{
  title: "Stanford History Education Group",
  description: "World history lessons and curricula for students & teachers :contentReference[oaicite:87]{index=87}",
  category: "History",
  link: "https://sheg.stanford.edu"
},
{
  title: "Gilder Lehrman Institute",
  description: "Primary sources and teaching materials for US history :contentReference[oaicite:88]{index=88}",
  category: "History",
  link: "https://www.gilderlehrman.org"
},
{
  title: "H‑Net: The History Network",
  description: "Scholarly discussions, resources, and job listings :contentReference[oaicite:89]{index=89}",
  category: "History",
  link: "https://www.h-net.org"
},
{
  title: "EuroDocs",
  description: "Primary historical documents from Western Europe :contentReference[oaicite:90]{index=90}",
  category: "History",
  link: "https://eudocs.lib.byu.edu"
},
{
  title: "Fordham University history resources",
  description: "Curated list of useful history websites :contentReference[oaicite:91]{index=91}",
  category: "History",
  link: "https://www.fordham.edu/academics/departments/history/resources/websites-for-historians"
},
{
  title: "History.com Classroom",
  description: "Lesson plans and study guides from HISTORY Channel :contentReference[oaicite:92]{index=92}",
  category: "History",
  link: "https://www.history.com/classroom"
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

  {
  title: "BYJU'S Exam Prep",
  description: "Comprehensive preparation for UPSC, SSC, Banking, and other Indian government exams.",
  category: "Government Exams",
  link: "https://byjusexamprep.com"
},
{
  title: "Adda247",
  description: "Popular platform offering study material, quizzes, and mock tests for various government exams.",
  category: "Government Exams",
  link: "https://www.adda247.com"
},
{
  title: "ClearIAS",
  description: "Strategic guidance, study materials, and mock exams tailored for UPSC Civil Services.",
  category: "Government Exams",
  link: "https://www.clearias.com"
},
{
  title: "Drishti IAS",
  description: "Hindi and English resources including current affairs, mains answer writing, and test series for UPSC and state PSCs.",
  category: "Government Exams",
  link: "https://www.drishtiias.com"
},
{
  title: "SarkariPariksha",
  description: "Practice tests and past papers for SSC, Railways, UPSC, etc.",
  category: "Government Exams",
  link: "https://sarkaripariksha.com"
},
{
  title: "Leverage Edu",
  description: "Overview of accessible Indian government exams and strategies.",
  category: "Government Exams",
  link: "https://leverageedu.com"
},
{
  title: "Colleges18",
  description: "Detailed profiles of India’s major government exams.",
  category: "Government Exams",
  link: "https://colleges18.com"
},
{
  title: "AskIndia Reddit – govt exam advice",
  description: "Community Q&A on exams and preparation tips.",
  category: "Government Exams",
  link: "https://www.reddit.com/r/india"
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
  {
  title: "Royal Society of Chemistry - Learn Chemistry",
  description: "Educational resources, experiments, and simulations for students and teachers.",
  category: "Chemistry",
  link: "https://edu.rsc.org"
},
{
  title: "MIT OpenCourseWare - Chemistry",
  description: "Free chemistry lecture notes, videos, and assignments from MIT courses.",
  category: "Chemistry",
  link: "https://ocw.mit.edu/courses/chemistry"
},
{
  title: "Periodic Videos",
  description: "YouTube series featuring videos on every element and fascinating chemistry experiments.",
  category: "Chemistry",
  link: "https://www.youtube.com/user/periodicvideos"
},
{
  title: "Chemguide",
  description: "Detailed explanations of chemistry concepts for high school and early college students.",
  category: "Chemistry",
  link: "https://www.chemguide.co.uk"
},
{
  title: "American Chemical Society – Education",
  description: "Lesson plans, multimedia & activities from ACS.",
  category: "Chemistry",
  link: "https://www.acs.org/education/resources.html"
},
{
  title: "Purdue Online Chemistry Resources",
  description: "Assistance materials and textbook references.",
  category: "Chemistry",
  link: "https://chemistry.purdue.edu/resource-room"
},
{
  title: "ChemSpider",
  description: "Chemical structure database with 67M+ structures.",
  category: "Chemistry",
  link: "https://www.chemspider.com"
},
{
  title: "Periodic Videos",
  description: "Videos on every chemical element and experiments.",
  category: "Chemistry",
  link: "https://www.youtube.com/user/periodicvideos"
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
  {
  title: "CrashCourse Biology",
  description: "Engaging YouTube series covering core biology concepts with animations and clarity.",
  category: "Biology",
  link: "https://www.youtube.com/playlist?list=PL3EED4C1D684D3ADF"
},
{
  title: "Learn Genetics - University of Utah",
  description: "Interactive tutorials and videos on genetics, heredity, and biotechnology.",
  category: "Biology",
  link: "https://learn.genetics.utah.edu"
},
{
  title: "Nature Education - Scitable",
  description: "Articles and learning modules on cell biology, genetics, evolution, and more.",
  category: "Biology",
  link: "https://www.nature.com/scitable"
},
{
  title: "Biology LibreTexts",
  description: "Comprehensive, open-access biology textbook content for students and educators.",
  category: "Biology",
  link: "https://bio.libretexts.org"
},
{
  title: "PubMed",
  description: "Vast database of peer-reviewed biomedical literature.",
  category: "Biology",
  link: "https://pubmed.ncbi.nlm.nih.gov"
},{
  title: "CrashCourse Biology",
  description: "Animated video series on core biology topics.",
  category: "Biology",
  link: "https://www.youtube.com/playlist?list=PL3EED4C1D684D3ADF"
},
{
  title: "Kenhub",
  description: "Interactive anatomy tutorials, quizzes, and videos.",
  category: "Biology",
  link: "https://www.kenhub.com"
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
  },
  {
  title: "Coursera",
  description: "Online courses from top universities and companies on a wide range of topics.",
  category: "General",
  link: "https://www.coursera.org"
},
{
  title: "CrashCourse",
  description: "Entertaining and educational YouTube series covering subjects from history to biology.",
  category: "General",
  link: "https://www.youtube.com/user/crashcourse"
},
{
  title: "Khan Academy",
  description: "Free educational platform offering lessons across math, science, humanities, and more.",
  category: "General",
  link: "https://www.khanacademy.org"
},
{
  title: "FutureLearn",
  description: "Short online courses from global universities and institutions on various disciplines.",
  category: "General",
  link: "https://www.futurelearn.com"
},
{
  title: "FutureLearn",
  description: "Short courses across disciplines from global universities.",
  category: "General",
  link: "https://www.futurelearn.com"
},
{
  title: "Udacity",
  description: "Technology‑focused courses and career nanodegrees.",
  category: "General",
  link: "https://www.udacity.com"
},
{
  title: "Udemy",
  description: "Affordable courses on virtually any subject by independent instructors.",
  category: "General",
  link: "https://www.udemy.com"
},
{
  title: "MasterClass",
  description: "Celebrity‑taught online courses in multiple fields.",
  category: "General",
  link: "https://www.masterclass.com"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-indigo-700 dark:text-yellow-400 mb-8">Explore Learning Resources</h1>

      <div className="flex flex-wrap gap-4 justify-center mb-10">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${selectedCategory === category
                ? "bg-indigo-600 dark:bg-yellow-500 text-white dark:text-gray-900"
                : "bg-white dark:bg-gray-800 text-indigo-600 dark:text-yellow-400 border border-indigo-300 dark:border-yellow-400 hover:bg-indigo-100 dark:hover:bg-gray-700"}`}
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
            className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-yellow-400 transition-all"
          >
            <h3 className="text-xl font-bold text-indigo-700 dark:text-yellow-400 mb-2">{resource.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{resource.description}</p>
            <span className="text-xs mt-2 inline-block text-indigo-500 dark:text-yellow-400 font-medium">{resource.category}</span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
