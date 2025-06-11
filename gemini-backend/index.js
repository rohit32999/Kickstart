const express = require("express");
const axios = require("axios");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const { getCareerInsights } = require("./careerData");
require("dotenv").config();

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false
});

// Chat rate limiter (more restrictive)
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 chat requests per minute
  message: { error: "Too many chat requests, please try again later" }
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY environment variable is not set');
  process.exit(1);
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Gemini backend is running" });
});

app.post("/api/chat", chatLimiter, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{
              text: `You are a helpful and concise career guidance assistant. Please answer every question in under 3 sentences. Avoid long explanations unless the user specifically asks for details.\n\n${message}`
            }],
          },
        ],        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.4,
          topP: 0.8,
          topK: 20
        },
      },      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    res.json({ reply });  } catch (err) {
    // Log only in development
    if (process.env.NODE_ENV === 'development') {
      console.error("API Error:", err.response?.data || err.message);
    }
    res.status(500).json({ error: "Failed to get response from Gemini." });
  }
});

// Career insights endpoint
app.get("/api/career-insights/:career", apiLimiter, async (req, res) => {
  try {
    const career = decodeURIComponent(req.params.career);    const insights = await getCareerInsights(career);
    
    res.json(insights);
  } catch (err) {    if (process.env.NODE_ENV === 'development') {
      console.error(`Career insights error for ${req.params.career}:`, err.message);
    }
    res.status(500).json({ error: "Failed to get career insights" });
  }
});

// AI-powered career recommendation endpoint
app.post("/api/career-recommendations", chatLimiter, async (req, res) => {
  const { iqScore, hobbies, interests, academicDetails, location, keywords, personality } = req.body;

  if (!iqScore || !interests || !academicDetails) {
    return res.status(400).json({ error: "IQ score, interests, and academic details are required" });
  }

  try {
    const personalityStr = personality ? JSON.stringify(personality) : "Not provided";    const prompt = `You are an expert career guidance AI with access to 2025 job market data. Analyze this user profile and recommend 4 best-fit career paths.

USER PROFILE:
- IQ Score: ${iqScore}
- Interests: ${interests}
- Academic Background: ${academicDetails}
- Hobbies: ${hobbies || 'Not specified'}
- Location: ${location || 'India'}
- Keywords: ${keywords || 'Not specified'}
- Personality Profile: ${personalityStr}

RESPOND ONLY WITH VALID JSON IN THIS EXACT FORMAT:
[
  {
    "title": "Specific career title",
    "description": "Brief 1-2 sentence description",
    "confidencePercent": 85,
    "why": "Why this career fits the user's profile",
    "metadata": {
      "category": "Technology",
      "salaryRange": {
        "entry": "₹5,00,000 - ₹8,00,000",
        "experienced": "₹15,00,000 - ₹30,00,000",
        "senior": "₹40,00,000+"
      },
      "skills": ["Programming", "Problem Solving", "Data Analysis", "Machine Learning", "Communication"],
      "education": "Masters in Computer Science or related field",
      "workEnvironment": "Remote/Office/Hybrid",
      "growthPotential": "High",
      "nextSteps": ["Master Python/R", "Build portfolio", "Apply for ML roles", "Get certifications"],
      "marketTrends": "AI/ML demand is rapidly growing in India with 40% YoY growth in 2025.",
      "topCompanies": ["Google", "Microsoft", "TCS", "Infosys"],
      "jobSecurity": "High",
      "workLifeBalance": "Good"
    }
  }
]

REQUIREMENTS:
- Use ALL user data to personalize recommendations
- Provide realistic confidence scores (70-95%)
- Include comprehensive metadata for each career
- Consider ${location || 'India'} job market and salary ranges
- Ensure at least one recommendation has 80%+ confidence`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{
              text: prompt
            }],
          },
        ],        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.7,
          topP: 0.9,
          topK: 40
        },
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    
    try {
      // Extract JSON from the response
      const jsonMatch = reply.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const recommendations = JSON.parse(jsonMatch[0]);        // Validate and ensure at least one high confidence recommendation
        if (Array.isArray(recommendations) && recommendations.length > 0) {
          const maxConfidence = Math.max(...recommendations.map(r => r.confidencePercent || 0));
          if (maxConfidence < 75) {
            recommendations[0].confidencePercent = Math.max(85, recommendations[0].confidencePercent || 0);
            recommendations[0].why += " [Confidence boosted to ensure a strong match]";
          }
          
          // Enhance recommendations with metadata if not present
          const enhancedRecommendations = recommendations.map((rec, index) => {
            console.log(`Processing recommendation ${index}: ${rec.title}`);
            // If metadata is already present, use it; otherwise, add default metadata
            if (!rec.metadata) {
              console.log(`Adding metadata for: ${rec.title}`);
              rec.metadata = generateMetadataForCareer(rec.title, location || 'India');
              console.log(`Metadata added:`, rec.metadata);
            }
            return rec;
          });
          
          console.log(`Returning ${enhancedRecommendations.length} enhanced recommendations`);
          res.json({ recommendations: enhancedRecommendations });
        } else {
          throw new Error("Invalid recommendations format");
        }
      } else {
        throw new Error("No valid JSON found in response");
      }
    } catch (parseError) {
      // Fallback recommendations if parsing fails
      console.error("JSON parsing failed:", parseError.message);
      res.json({
        recommendations: [
          {
            title: "Career Exploration",
            description: "Explore different career paths to find what interests you most.",
            confidencePercent: 70,
            why: "Given your profile, taking time to explore various options would help identify the best career path."
          },
          {
            title: "Technology Professional",
            description: "Leverage technology skills in software development or data analysis.",
            confidencePercent: 65,
            why: "Your analytical skills and IQ score suggest good potential in technology fields."
          }
        ]
      });
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Career recommendations API Error:", err.response?.data || err.message);
    }
    res.status(500).json({ error: "Failed to get career recommendations from AI." });
  }
});

// Function to generate enhanced metadata for career recommendations
function generateMetadataForCareer(careerTitle, location) {
  const title = careerTitle.toLowerCase();
  
  // Default metadata structure
  const baseMetadata = {
    category: "General",
    salaryRange: {
      entry: "₹3,00,000 - ₹5,00,000",
      experienced: "₹8,00,000 - ₹15,00,000",
      senior: "₹20,00,000+"
    },
    skills: ["Communication", "Problem Solving", "Teamwork", "Adaptability"],
    education: "Bachelor's degree or equivalent",
    workEnvironment: "Office",
    growthPotential: "Medium",
    nextSteps: ["Research the field", "Network with professionals", "Develop relevant skills", "Apply for entry-level positions"],
    marketTrends: "Industry outlook varies based on market conditions and technological changes.",
    topCompanies: ["Local companies", "Startups", "Government organizations"],
    jobSecurity: "Medium",
    workLifeBalance: "Good"
  };

  // Career-specific metadata mappings
  if (title.includes('machine learning') || title.includes('ml engineer')) {
    return {
      category: "Technology",
      salaryRange: {
        entry: "₹6,00,000 - ₹12,00,000",
        experienced: "₹15,00,000 - ₹35,00,000",
        senior: "₹40,00,000 - ₹80,00,000+"
      },
      skills: ["Python", "Machine Learning", "Data Analysis", "Statistics", "Deep Learning", "TensorFlow", "Communication"],
      education: "Masters in Computer Science, Data Science, or related field",
      workEnvironment: "Remote/Hybrid",
      growthPotential: "High",
      nextSteps: ["Master Python and ML libraries", "Build ML portfolio projects", "Get AWS/Google Cloud certifications", "Apply to tech companies"],
      marketTrends: "AI/ML field is experiencing explosive growth with 45% YoY increase in job postings. High demand across industries in 2025.",
      topCompanies: ["Google", "Microsoft", "Amazon", "TCS", "Infosys", "Wipro", "Flipkart"],
      jobSecurity: "High",
      workLifeBalance: "Good"
    };
  }
  
  if (title.includes('data scientist') || title.includes('data science')) {
    return {
      category: "Technology",
      salaryRange: {
        entry: "₹5,00,000 - ₹10,00,000",
        experienced: "₹12,00,000 - ₹30,00,000",
        senior: "₹35,00,000 - ₹70,00,000+"
      },
      skills: ["Python", "R", "SQL", "Data Visualization", "Statistics", "Machine Learning", "Business Intelligence"],
      education: "Masters in Data Science, Statistics, Computer Science or related field",
      workEnvironment: "Remote/Hybrid",
      growthPotential: "High",
      nextSteps: ["Learn Python/R and SQL", "Master data visualization tools", "Complete data science projects", "Get industry certifications"],
      marketTrends: "Data science continues to be one of the fastest-growing fields with 35% growth expected in 2025.",
      topCompanies: ["IBM", "Accenture", "Deloitte", "TCS", "Cognizant", "PayTM", "Ola"],
      jobSecurity: "High",
      workLifeBalance: "Good"
    };
  }
  
  if (title.includes('ai') || title.includes('artificial intelligence')) {
    return {
      category: "Technology",
      salaryRange: {
        entry: "₹7,00,000 - ₹15,00,000",
        experienced: "₹18,00,000 - ₹40,00,000",
        senior: "₹45,00,000 - ₹1,00,00,000+"
      },
      skills: ["AI/ML Algorithms", "Python", "Neural Networks", "Computer Vision", "NLP", "Research", "Critical Thinking"],
      education: "Masters/PhD in Computer Science, AI, or related field",
      workEnvironment: "Remote/Hybrid",
      growthPotential: "High",
      nextSteps: ["Specialize in AI subfield", "Contribute to open source projects", "Publish research papers", "Join AI research labs"],
      marketTrends: "AI research and development is booming with massive investments from tech giants and government initiatives in 2025.",
      topCompanies: ["OpenAI", "Google DeepMind", "Microsoft Research", "IIT Research Labs", "ISRO", "DRDO"],
      jobSecurity: "High",
      workLifeBalance: "Average"
    };
  }
  
  if (title.includes('software engineer') || title.includes('developer')) {
    return {
      category: "Technology",
      salaryRange: {
        entry: "₹4,00,000 - ₹8,00,000",
        experienced: "₹10,00,000 - ₹25,00,000",
        senior: "₹30,00,000 - ₹60,00,000+"
      },
      skills: ["Programming Languages", "Software Development", "Problem Solving", "Debugging", "Version Control", "Testing"],
      education: "Bachelor's in Computer Science or related field",
      workEnvironment: "Remote/Hybrid",
      growthPotential: "High",
      nextSteps: ["Master programming languages", "Build software projects", "Learn frameworks", "Contribute to open source"],
      marketTrends: "Software development remains strong with consistent demand across all industries in 2025.",
      topCompanies: ["Google", "Microsoft", "Amazon", "Flipkart", "Swiggy", "Zomato", "TCS"],
      jobSecurity: "High",
      workLifeBalance: "Good"
    };
  }

  if (title.includes('data analyst')) {
    return {
      category: "Technology",
      salaryRange: {
        entry: "₹3,50,000 - ₹6,00,000",
        experienced: "₹8,00,000 - ₹18,00,000",
        senior: "₹22,00,000 - ₹40,00,000+"
      },
      skills: ["Excel", "SQL", "Data Visualization", "Statistics", "Python/R", "Business Intelligence", "Critical Thinking"],
      education: "Bachelor's in any field with data analysis skills",
      workEnvironment: "Office/Hybrid",
      growthPotential: "Medium",
      nextSteps: ["Learn Excel and SQL", "Master Tableau/Power BI", "Complete data analysis projects", "Get Google Analytics certification"],
      marketTrends: "Data analysis roles are growing steadily as businesses increasingly rely on data-driven decisions in 2025.",
      topCompanies: ["Accenture", "Deloitte", "EY", "KPMG", "Mu Sigma", "Fractal Analytics"],
      jobSecurity: "Medium",
      workLifeBalance: "Good"
    };
  }
  
  // Return base metadata for unknown careers
  return baseMetadata;
}

const PORT = process.env.PORT || 5001;

console.log("Starting server...");
console.log("Environment:", process.env.NODE_ENV);
console.log("API Key loaded:", !!process.env.GEMINI_API_KEY);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});
