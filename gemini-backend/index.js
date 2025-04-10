const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "system",
            parts: [
              {
                text:
                  "You are a helpful and concise career guidance assistant. Please answer every question in under 3 sentences. Avoid long explanations unless the user specifically asks for details.",
              },
            ],
          },
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 150, // 🔧 Trim long replies
          temperature: 0.4,      // 🔽 Keep replies focused
          topP: 0.8,
          topK: 20,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_DANGEROUS",
            threshold: 3,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Gemini API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get response from Gemini." });
  }
});

app.listen(5000, () => {
  console.log("✅ Gemini proxy server is running on http://localhost:5000");
});
