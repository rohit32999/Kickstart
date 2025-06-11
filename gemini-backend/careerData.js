const axios = require("axios");

async function getCareerInsights(career) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    try {
        const prompt = `As an AI career advisor, provide detailed, up-to-date (2025) insights about the ${career} career path. 
Include accurate salary ranges based on current market data, specific in-demand roles, and detailed skill requirements.

Required format - respond ONLY with this exact JSON structure:
{
    "salaryRange": {
        "entryLevel": {
            "usd": "(include range like $50,000-$70,000)",
            "inr": "(include range like ₹5,00,000-₹7,00,000)"
        },
        "experienced": {
            "usd": "(5+ years experience range)",
            "inr": "(5+ years experience range)"
        }
    },
    "inDemandRoles": [
        "list 3-4 specific job titles currently in high demand",
        "include specialized roles",
        "focus on emerging positions"
    ],
    "requiredSkills": [
        "list 5-7 most important technical skills",
        "include both hard and soft skills",
        "mention specific tools/technologies"
    ],
    "qualifications": [
        "list 3-4 required qualifications",
        "include both education and certifications",
        "mention any specialized training"
    ],
    "growthProspects": {
        "rating": "(High/Medium/Low)",
        "explanation": "2-3 sentences about future prospects, industry trends, and job market predictions for next 2-3 years"
    }
}`; const response = await axios.post("https://generativelanguage.googleapis.com/rest/v1/models/gemini-pro:generateContent",
            {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': GEMINI_API_KEY
                }
            }
        );        if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Invalid response format from Gemini API");
        }

        const reply = response.data.candidates[0].content.parts[0].text;

        // Extract JSON from the response
        const jsonMatch = reply.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsedData = JSON.parse(jsonMatch[0]);
                // Validate and clean the data
                const cleanedData = {
                    salaryRange: {
                        entryLevel: {
                            usd: parsedData.salaryRange?.entryLevel?.usd?.replace(/[^$,\d-]/g, '') || "Not available",
                            inr: parsedData.salaryRange?.entryLevel?.inr?.replace(/[^₹,\d-]/g, '') || "Not available"
                        },
                        experienced: {
                            usd: parsedData.salaryRange?.experienced?.usd?.replace(/[^$,\d-]/g, '') || "Not available",
                            inr: parsedData.salaryRange?.experienced?.inr?.replace(/[^₹,\d-]/g, '') || "Not available"
                        }
                    },
                    inDemandRoles: parsedData.inDemandRoles?.filter(role => role && !role.includes("list")) || [],
                    requiredSkills: parsedData.requiredSkills?.filter(skill => skill && !skill.includes("list")) || [],
                    qualifications: parsedData.qualifications?.filter(qual => qual && !qual.includes("list")) || [],
                    growthProspects: {
                        rating: parsedData.growthProspects?.rating?.replace(/[()]/g, '') || "Unknown",
                        explanation: parsedData.growthProspects?.explanation || "Information not available"
                    }
                };
                return cleanedData;
            } catch (parseError) {
                console.error("Failed to parse response:", parseError);
                throw new Error("Invalid response format");
            }
        }
        throw new Error("No valid JSON found in response");    } catch (err) {
        if (process.env.NODE_ENV === 'development') {
            console.error("Error getting career insights:", err.response?.data || err.message);
        }
        // Return a fallback response with researched data
        return getDefaultCareerData(career);
    }
}

// Helper function for fallback data (cached for performance)
const DEFAULT_CAREER_CACHE = new Map();

function getDefaultCareerData(career) {
    if (DEFAULT_CAREER_CACHE.has(career)) {
        return DEFAULT_CAREER_CACHE.get(career);
    }

    const defaultData = {
        "Software Developer": {
            salaryRange: {
                entryLevel: { usd: "$65,000-85,000", inr: "₹6,00,000-9,00,000" },
                experienced: { usd: "$120,000-180,000", inr: "₹18,00,000-30,00,000" }
            },
            inDemandRoles: [
                "Full Stack Developer",
                "Cloud Native Developer",
                "DevOps Engineer",
                "Mobile App Developer"
            ],
            requiredSkills: [
                "JavaScript/TypeScript",
                "Python/Java",
                "Cloud Services (AWS/Azure/GCP)",
                "CI/CD & DevOps",
                "System Design",
                "REST/GraphQL APIs",
                "Git & Version Control"
            ],
            qualifications: [
                "Bachelor's in Computer Science/IT",
                "Cloud Certifications (AWS/Azure)",
                "Relevant Coding Bootcamp",
                "Strong Project Portfolio"
            ],
            growthProspects: {
                rating: "High",
                explanation: "Strong growth expected through 2025-2027 due to digital transformation and AI integration. Remote work opportunities and competitive salaries continue to drive market demand."
            }
        },
        // Add more career defaults as needed...
    };    const result = defaultData[career] || {
        salaryRange: {
            entryLevel: { usd: "$45,000-65,000", inr: "₹4,00,000-6,00,000" },
            experienced: { usd: "$80,000-120,000", inr: "₹12,00,000-18,00,000" }
        },
        inDemandRoles: [
            "Entry Level Position",
            "Mid-Level Role",
            "Senior Position"
        ],
        requiredSkills: [
            "Industry Knowledge",
            "Technical Skills",
            "Communication",
            "Problem Solving",
            "Team Collaboration"
        ],
        qualifications: [
            "Bachelor's Degree",
            "Relevant Certifications",
            "Industry Experience"
        ],
        growthProspects: {
            rating: "Medium",
            explanation: "Stable career path with moderate growth potential. Market demand varies by region and economic conditions."
        }
    };

    // Cache the result for future use
    DEFAULT_CAREER_CACHE.set(career, result);
    return result;
}

module.exports = { getCareerInsights };