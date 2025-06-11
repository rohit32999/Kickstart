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

const PORT = process.env.PORT || 5001;

console.log("Starting server...");
console.log("Environment:", process.env.NODE_ENV);
console.log("API Key loaded:", !!process.env.GEMINI_API_KEY);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});
