require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import auth and user routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize the app
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Fix for handling form-data
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

// ✅ Serve Uploaded Files (Ensure 'uploads' folder exists)
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
// === Semantic Ranking Endpoint ===
let embedder = null;

// Load the model once at startup using dynamic import
(async () => {
  const { pipeline } = await import('@xenova/transformers');
  embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
})();

// Helper: Compute cosine similarity
function cosineSimilarity(a, b) {
  let dot = 0.0, normA = 0.0, normB = 0.0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// POST /api/semantic-rank
app.post('/api/semantic-rank', async (req, res) => {
  try {
    if (!embedder) return res.status(503).json({ error: 'Model loading, try again.' });

    const { userInput, careerProfiles } = req.body;
    if (!userInput || !careerProfiles || !Array.isArray(careerProfiles)) {
      return res.status(400).json({ error: 'Missing userInput or careerProfiles array.' });
    }

    // Compute embeddings
    const userEmb = (await embedder(userInput))[0][0];

    const results = await Promise.all(
      careerProfiles.map(async (profile) => {
        const text = profile.text || profile.title || profile.name || '';
        const emb = (await embedder(text))[0][0];
        const similarity = cosineSimilarity(userEmb, emb);
        return { ...profile, similarity };
      })
    );

    // Sort by similarity descending
    results.sort((a, b) => b.similarity - a.similarity);
    res.json({ results });

  } catch (err) {
    console.error('Semantic rank error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


// ✅ Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
