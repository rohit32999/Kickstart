// Simple rule-based AI/ML logic for personalized career pathway
// This can be replaced with a more advanced ML model as needed

export interface PersonalityProfile {
  introvertExtrovert: 'introvert' | 'extrovert' | 'ambivert' | '';
  leadership: 'high' | 'medium' | 'low' | '';
  creativity: 'high' | 'medium' | 'low' | '';
  riskTolerance: 'high' | 'medium' | 'low' | '';
  communication: 'high' | 'medium' | 'low' | '';
}

export interface CareerInput {
  iqScore: number;
  hobbies: string;
  interests: string;
  academicDetails: string;
  location?: string;
  keywords?: string;
  personality?: PersonalityProfile;
  useAI?: boolean; // NEW: if true, use Gemini AI for recommendations
}

export interface CareerRecommendation {
  title: string;
  description: string;
  why?: string;
  resources?: string[];
  confidencePercent: number;
}

// --- Localization Helper ---
export function getLocalizedText(key: string, lang: string = 'en'): string {
  const translations: Record<string, Record<string, string>> = {
    'career_exploration': {
      en: 'Career Exploration',
      hi: 'कैरियर अन्वेषण',
      es: 'Exploración de Carrera'
    },
    'not_sure_start': {
      en: 'Not sure where to start? Try online self-assessment tools, career quizzes, or talk to a mentor. Explore internships, volunteering, or short courses in different fields to discover what excites you.',
      hi: 'शुरू कहाँ से करें? ऑनलाइन आत्म-मूल्यांकन टूल्स, कैरियर क्विज़ या मेंटर से बात करें। विभिन्न क्षेत्रों में इंटर्नशिप, स्वयंसेवा या शॉर्ट कोर्स आज़माएँ।',
      es: '¿No sabes por dónde empezar? Prueba herramientas de autoevaluación, cuestionarios de carrera o habla con un mentor. Explora pasantías, voluntariado o cursos cortos en diferentes campos.'
    }
  };
  return translations[key]?.[lang] || translations[key]?.en || key;
}

// --- Semantic Similarity Ranking (Backend) ---
export async function getSemanticRankedCareers({ userInput, careerProfiles }: { userInput: string, careerProfiles: any[] }) {
  try {
    const res = await fetch("http://localhost:5000/api/semantic-rank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput, careerProfiles })
    });
    const data = await res.json();
    if (data && Array.isArray(data.results)) {
      return data.results;
    }
    return [];
  } catch (err) {
    return [];
  }
}

// --- Main Recommendation Logic ---
export async function getCareerRecommendations(input: CareerInput): Promise<CareerRecommendation[]> {
  const { iqScore, hobbies, interests, academicDetails, location, keywords, personality, useAI } = input;

  // --- AI-powered recommendations (Gemini) ---
  let aiRecs: CareerRecommendation[] = [];
  if (useAI) {
    try {
      const aiPrompt = `You are an expert career guidance AI. Given the following user profile, recommend 3-5 best-fit career paths. For each, provide a title, a 1-sentence description, a confidencePercent (0-100, integer), and a 'why' field justifying the confidence.\n\nUser Profile:\n- IQ: ${iqScore}\n- Hobbies: ${hobbies}\n- Interests: ${interests}\n- Academics: ${academicDetails}\n- Location: ${location || ''}\n- Keywords: ${keywords || ''}\n- Personality: ${personality ? JSON.stringify(personality) : ''}\n\nInstructions:\n- Use all available user data to personalize recommendations.\n- Calibrate confidencePercent so that the best-fit career for a strong match is 85-100%, a moderate match is 60-84%, and a weak match is 30-59%.\n- Never give all low percentages.\n- Always justify the confidencePercent in the 'why' field.\n- If the user profile is very generic, still provide at least one strong match.\n- Be as personalized, realistic, and user-trustworthy as possible.\n- Output a JSON array of objects with fields: title, description, confidencePercent, why.\n\nSpecial Instructions:\n- If the user mentions unique, domain-specific, or rare terms (such as MBBS, NEET, IAS, JEE, UPSC, CA, CLAT, NDA, etc.), always map these to the most relevant career path, even if the term is not a standard job title.\n- Prioritize and explain these mappings in your recommendations.\n- Example mappings:\n  - If user mentions MBBS, NEET, or medical entrance, recommend 'Doctor/Medical Professional' as a top match.\n  - If user mentions IAS, UPSC, or civil services, recommend 'Civil Services/IAS Officer' as a top match.\n  - If user mentions JEE or engineering entrance, recommend 'Engineer' as a top match.\n  - If user mentions CA or chartered accountant, recommend 'Chartered Accountant' or 'Finance Professional'.\n  - If user mentions CLAT or law entrance, recommend 'Lawyer/Legal Professional'.\n  - If user mentions NDA or defense entrance, recommend 'Defense Services/Armed Forces'.\n- If you encounter a term you do not recognize, do your best to infer the intended career path and explain your reasoning in the 'why' field.\n`;
      const res = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: aiPrompt })
      });
      const data = await res.json();
      const match = data.reply.match(/\[.*\]/s);
      if (match) {
        let parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const maxConf = Math.max(...parsed.map((r:any) => Number(r.confidencePercent) || 0));
          if (maxConf < 70) {
            parsed = parsed.map((r:any,i:number) => i===0 ? { ...r, confidencePercent: 92 } : { ...r, confidencePercent: Math.max(70, Number(r.confidencePercent)||0) });
          }
          aiRecs = parsed.map((rec: any) => ({
            title: rec.title,
            description: rec.description,
            confidencePercent: Math.max(0, Math.min(100, Number(rec.confidencePercent) || 0)),
            why: rec.why || 'AI-generated recommendation based on your profile.'
          }));
        }
      }
    } catch (err) {
      // Fallback to rule-based if Gemini fails
    }
  }

  // Normalize IQ score to 0-1 scale (assuming 70-150 range)
  const normIQ = Math.max(0, Math.min(1, (iqScore - 70) / 80));
  // --- Fuzzy and Semantic Matching for Interests/Academics/Keywords ---
  function strictWordMatch(str: string, arr: string[]) {
    // Only match if a full word in str matches a keyword
    const words = str.split(/\W+/).map(w => w.toLowerCase());
    return arr.some(keyword => words.includes(keyword.toLowerCase()));
  }

  // Helper: Use semantic similarity for keyword understanding
  async function semanticKeywordMatch(userText: string, keywords: string[]): Promise<boolean> {
    if (!userText || !keywords.length) return false;
    // Use the backend semantic endpoint to compare userText to each keyword
    const profiles = keywords.map(k => ({ title: k, description: k }));
    const results = await getSemanticRankedCareers({ userInput: userText, careerProfiles: profiles });
    // If any keyword has similarity > 0.7, consider it a match
    return results.some((r: { title: string; description: string; similarity: number }) => r.similarity > 0.7);
  }

  const userInterests = (hobbies + ' ' + interests + ' ' + (keywords || '')).toLowerCase();
  const userAcademics = academicDetails.toLowerCase();

  // Helper: Personality fit scoring for each career
  /**
   * Calculates a normalized personality fit score for a given career profile and user personality.
   * - Considers both 'high' and 'medium' values for relevant traits.
   * - Easily extensible: add new careers/traits by updating the config below.
   * - Returns a score between 0 and 1 (relative to max possible for that profile).
   */
  function getPersonalityScore(profile: any, personality?: PersonalityProfile): number {
    if (!personality) return 0;
    // Configurable trait weights for each career
    const traitConfig: Record<string, Array<{ trait: keyof PersonalityProfile; values: string[]; weight: number }>> = {
      'Research Scientist': [
        { trait: 'introvertExtrovert', values: ['introvert', 'ambivert'], weight: 0.2 },
        { trait: 'creativity', values: ['high', 'medium'], weight: 0.2 },
        { trait: 'leadership', values: ['medium'], weight: 0.1 }
      ],
      'Engineer': [
        { trait: 'creativity', values: ['high', 'medium'], weight: 0.15 },
        { trait: 'riskTolerance', values: ['medium', 'high'], weight: 0.1 },
        { trait: 'communication', values: ['medium', 'high'], weight: 0.1 }
      ],
      'Business Analyst': [
        { trait: 'leadership', values: ['high', 'medium'], weight: 0.15 },
        { trait: 'communication', values: ['high', 'medium'], weight: 0.15 },
        { trait: 'riskTolerance', values: ['medium', 'high'], weight: 0.1 }
      ],
      'Creative Professional': [
        { trait: 'creativity', values: ['high', 'medium'], weight: 0.25 },
        { trait: 'introvertExtrovert', values: ['ambivert', 'extrovert'], weight: 0.1 }
      ],
      'Graphic Designer': [
        { trait: 'creativity', values: ['high', 'medium'], weight: 0.25 },
        { trait: 'introvertExtrovert', values: ['ambivert', 'extrovert'], weight: 0.1 }
      ],
      'Sports Coach or Physiotherapist': [
        { trait: 'leadership', values: ['high', 'medium'], weight: 0.15 },
        { trait: 'communication', values: ['high', 'medium'], weight: 0.15 },
        { trait: 'riskTolerance', values: ['high', 'medium'], weight: 0.1 }
      ],
      'AI/ML Engineer': [
        { trait: 'introvertExtrovert', values: ['introvert', 'ambivert'], weight: 0.15 },
        { trait: 'creativity', values: ['high', 'medium'], weight: 0.1 }
      ],
      'Software Developer': [
        { trait: 'introvertExtrovert', values: ['introvert', 'ambivert'], weight: 0.15 },
        { trait: 'creativity', values: ['high', 'medium'], weight: 0.1 }
      ],
      'Content Writer or Editor': [
        { trait: 'introvertExtrovert', values: ['introvert'], weight: 0.15 },
        { trait: 'creativity', values: ['high', 'medium'], weight: 0.15 }
      ],
      'Core Engineer': [
        { trait: 'riskTolerance', values: ['medium', 'high'], weight: 0.1 },
        { trait: 'leadership', values: ['medium', 'high'], weight: 0.1 }
      ],
      'Finance or Management Professional': [
        { trait: 'leadership', values: ['high', 'medium'], weight: 0.2 },
        { trait: 'communication', values: ['high', 'medium'], weight: 0.2 }
      ],
      'Doctor/Medical Professional': [
        { trait: 'leadership', values: ['high', 'medium'], weight: 0.15 },
        { trait: 'communication', values: ['high', 'medium'], weight: 0.15 },
        { trait: 'riskTolerance', values: ['high', 'medium'], weight: 0.1 }
      ]
      // Add more careers/traits as needed
    };
    const config = traitConfig[profile.title];
    if (!config) return 0;
    let score = 0;
    let maxScore = 0;
    for (const rule of config) {
      maxScore += rule.weight;
      if (rule.values.includes(personality[rule.trait])) {
        score += rule.weight;
      }
    }
    // Normalize to 0-1 for consistency
    return maxScore > 0 ? score / maxScore : 0;
  }

  // Example career profiles (expand as needed)
  const careerProfiles = [
    {
      title: 'Research Scientist',
      description: 'Your high IQ and analytical skills are ideal for research and academia.',
      iqWeight: 1.0,
      interestKeywords: ['research', 'science', 'innovation', 'ai', 'robotics'],
      interestWeight: 0.7,
      academicKeywords: ['science', 'cse', 'computer', 'it', 'software'],
      academicWeight: 0.7
    },
    {
      title: 'Engineer',
      description: 'Engineering roles suit your logical thinking and creativity.',
      iqWeight: 0.8,
      interestKeywords: ['engineering', 'robotics', 'ai', 'machine learning', 'data'],
      interestWeight: 0.7,
      academicKeywords: ['cse', 'computer', 'it', 'software', 'mechanical', 'civil', 'electrical'],
      academicWeight: 0.8
    },
    {
      title: 'Business Analyst',
      description: 'Business analysis and management roles fit your reasoning skills.',
      iqWeight: 0.6,
      interestKeywords: ['business', 'analysis', 'management', 'project'],
      interestWeight: 0.7,
      academicKeywords: ['commerce', 'bcom', 'mba', 'business'],
      academicWeight: 0.8
    },
    {
      title: 'Creative Professional',
      description: 'Creative fields like design, arts, or communication may suit you.',
      iqWeight: 0.3,
      interestKeywords: ['art', 'design', 'paint', 'draw', 'writing', 'literature', 'reading'],
      interestWeight: 1.0,
      academicKeywords: ['arts', 'communication', 'media'],
      academicWeight: 0.7
    },
    {
      title: 'Graphic Designer',
      description: 'A career in graphic or UI/UX design could be fulfilling.',
      iqWeight: 0.4,
      interestKeywords: ['art', 'design', 'paint', 'draw'],
      interestWeight: 1.0,
      academicKeywords: ['design', 'arts', 'media'],
      academicWeight: 0.8
    },
    {
      title: 'Sports Coach or Physiotherapist',
      description: 'Coaching, sports management, or physiotherapy could be ideal.',
      iqWeight: 0.3,
      interestKeywords: ['football', 'cricket', 'sports', 'athlete'],
      interestWeight: 1.0,
      academicKeywords: ['sports', 'physiotherapy', 'physical'],
      academicWeight: 0.7
    },
    {
      title: 'AI/ML Engineer',
      description: 'Careers in artificial intelligence, robotics, or data science await you.',
      iqWeight: 0.8,
      interestKeywords: ['ai', 'robotics', 'machine learning', 'data'],
      interestWeight: 1.0,
      academicKeywords: ['cse', 'computer', 'it', 'software', 'data'],
      academicWeight: 0.8
    },
    {
      title: 'Content Writer or Editor',
      description: 'Content creation, editing, or publishing could be your calling.',
      iqWeight: 0.4,
      interestKeywords: ['literature', 'writing', 'reading'],
      interestWeight: 1.0,
      academicKeywords: ['arts', 'literature', 'media', 'communication'],
      academicWeight: 0.7
    },
    {
      title: 'Software Developer',
      description: 'Software development roles fit your computer science or IT background.',
      iqWeight: 0.7,
      interestKeywords: ['coding', 'programming', 'software', 'technology'],
      interestWeight: 0.8,
      academicKeywords: ['cse', 'computer', 'it', 'software'],
      academicWeight: 1.0
    },
    {
      title: 'Core Engineer',
      description: 'Opportunities in core engineering sectors are open to you.',
      iqWeight: 0.7,
      interestKeywords: ['mechanical', 'civil', 'electrical', 'engineering'],
      interestWeight: 0.8,
      academicKeywords: ['mechanical', 'civil', 'electrical'],
      academicWeight: 1.0
    },
    {
      title: 'Finance or Management Professional',
      description: 'Finance, accounting, or management roles suit your background.',
      iqWeight: 0.5,
      interestKeywords: ['finance', 'accounting', 'management', 'business'],
      interestWeight: 0.8,
      academicKeywords: ['commerce', 'bcom', 'mba', 'business'],
      academicWeight: 1.0
    },
    {
      title: 'Doctor/Medical Professional',
      description: 'A career in medicine, such as becoming a doctor, surgeon, or healthcare specialist, matches your academic and career interests.',
      iqWeight: 0.7,
      interestKeywords: ['doctor', 'medicine', 'mbbs', 'medical', 'healthcare', 'neet', 'hospital', 'surgeon', 'physician', 'clinic'],
      interestWeight: 1.0,
      academicKeywords: ['mbbs', 'medical', 'medicine', 'biology', 'neet', '12th pass', 'doctor'],
      academicWeight: 1.0
    }
  ];

  // Score each career profile
  const scoredCareers = await Promise.all(careerProfiles.map(async profile => {
    const iqScorePart = normIQ * profile.iqWeight;
    let interestScore = 0;
    // For Core Engineer, use strict word match for academics
    let academicScore = 0;
    if (profile.title === 'Core Engineer') {
      // Only match if strict word match or very strong semantic match
      if (strictWordMatch(userAcademics, profile.academicKeywords)) {
        academicScore = profile.academicWeight;
      } else {
        // Use a higher threshold for semantic match to avoid false positives
        const profiles = profile.academicKeywords.map(k => ({ title: k, description: k }));
        const results = await getSemanticRankedCareers({ userInput: userAcademics, careerProfiles: profiles });
        if (results.some((r: any) => r.similarity > 0.85)) {
          academicScore = profile.academicWeight * 0.7;
        } else {
          academicScore = 0;
        }
      }
    } else {
      // For other careers, use fuzzy and semantic matching
      profile.academicKeywords.forEach(keyword => {
        if (userAcademics.includes(keyword)) academicScore += 1;
      });
      if (academicScore === 0 && await semanticKeywordMatch(userAcademics, profile.academicKeywords)) {
        academicScore = profile.academicWeight * 0.7;
      }
      academicScore = Math.min(1, academicScore / profile.academicKeywords.length) * profile.academicWeight;
    }
    // Interests: use fuzzy and semantic
    profile.interestKeywords.forEach(keyword => {
      if (userInterests.includes(keyword)) interestScore += 1;
    });
    if (interestScore === 0 && await semanticKeywordMatch(userInterests, profile.interestKeywords)) {
      interestScore = profile.interestWeight * 0.7;
    }
    interestScore = Math.min(1, interestScore / profile.interestKeywords.length) * profile.interestWeight;
    const personalityScore = getPersonalityScore(profile, personality);
    let maxPersonalityScore = 0;
    switch (profile.title) {
      case 'Research Scientist': maxPersonalityScore = 0.2 + 0.2 + 0.1; break;
      case 'Engineer': maxPersonalityScore = 0.15 + 0.1 + 0.1; break;
      case 'Business Analyst': maxPersonalityScore = 0.15 + 0.15 + 0.1; break;
      case 'Creative Professional':
      case 'Graphic Designer': maxPersonalityScore = 0.25 + 0.1; break;
      case 'Sports Coach or Physiotherapist': maxPersonalityScore = 0.15 + 0.15 + 0.1; break;
      case 'AI/ML Engineer':
      case 'Software Developer': maxPersonalityScore = 0.15 + 0.1; break;
      case 'Content Writer or Editor': maxPersonalityScore = 0.15 + 0.15; break;
      case 'Core Engineer': maxPersonalityScore = 0.1 + 0.1; break;
      case 'Finance or Management Professional': maxPersonalityScore = 0.2 + 0.2; break;
      case 'Doctor/Medical Professional': maxPersonalityScore = 0.15 + 0.15 + 0.1; break;
      default: maxPersonalityScore = 0;
    }
    const maxPossibleScore = profile.iqWeight + profile.interestWeight + profile.academicWeight + maxPersonalityScore;
    const totalScore = iqScorePart + interestScore + academicScore + personalityScore;
    return { ...profile, totalScore, personalityScore, maxPossibleScore };
  }));

  // After scoring and before sorting/filtering topCareers:
  // If user profile is strongly medical, prioritize medical careers
  const isMedical = /\b(mbbs|medicine|doctor|neet|medical|healthcare|surgeon|physician|clinic)\b/i.test(
    [hobbies, interests, academicDetails, keywords].join(' ')
  );
  let scored = scoredCareers;
  if (isMedical) {
    // Boost Doctor/Medical Professional score
    scored = scoredCareers.map(c =>
      c.title === 'Doctor/Medical Professional'
        ? { ...c, totalScore: c.totalScore + 1 }
        : c
    );
    // Optionally, filter out unrelated careers if medical is a strong match
    const med = scored.find(c => c.title === 'Doctor/Medical Professional' && c.totalScore > 0.5);
    if (med) {
      scored = scored.filter(c => c.title === 'Doctor/Medical Professional' || c.totalScore > 0.4);
    }
  }
  // Sort by total score descending and pick top 3-5
  const topCareers = scored
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 5)
    .filter(c => c.totalScore > 0.2); // Only recommend if score is meaningful

  let recommendations: CareerRecommendation[] = topCareers.map(c => ({
    title: c.title,
    description: c.description,
    why: `Recommended because of your IQ (${iqScore}), interests (${hobbies}, ${interests}), academics (${academicDetails})${personality ? ", and personality traits" : ""}.`,
    confidencePercent: Math.round((c.totalScore / (c.maxPossibleScore || 1)) * 100)
  }));

  // --- Online research and geolocation-based recommendations ---
  if (keywords || location) {
    try {
      const query = encodeURIComponent((keywords || '') + ' ' + (location || ''));
      const response = await fetch(`https://api.api-ninjas.com/v1/jobs?query=${query}`, {
        headers: { 'X-Api-Key': '45Tm8GwloFOt40YVe0w8PA==fbxdSVqIzJ6DJTNP' }
      });
      if (response.ok) {
        const jobs = await response.json();
        if (Array.isArray(jobs) && jobs.length > 0) {
          const seen = new Set();
          const realTimeRecsRaw = jobs.slice(0, 3).map((job: any) => {
            const title = job.title || 'Job Opportunity';
            const desc = `${job.company || ''} - ${job.location || location || ''}. ${job.description || ''}`.trim() + '\n[Real-time opportunity based on your profile and location]';
            const key = title + desc;
            if (seen.has(key)) return null;
            seen.add(key);
            return { title, description: desc, why: 'This is a real-time job opportunity matched to your keywords and/or location.', confidencePercent: 50 };
          });
          const realTimeRecs: CareerRecommendation[] = realTimeRecsRaw.filter(r => r !== null) as CareerRecommendation[];
          recommendations = recommendations.concat(realTimeRecs);
        }
      }
    } catch (err) {
      // Ignore errors
    }
  }

  // --- Semantic Similarity Integration ---
  // Combine user input fields for semantic matching
  const semanticInput = [hobbies, interests, academicDetails, keywords, location].filter(Boolean).join(". ");
  const semanticProfiles = careerProfiles.map(p => ({ title: p.title, description: p.description }));
  const semanticResults = await getSemanticRankedCareers({ userInput: semanticInput, careerProfiles: semanticProfiles });

  // Boost confidencePercent for top semantic matches
  if (semanticResults && semanticResults.length > 0) {
    const topSemantic = semanticResults.slice(0, 3);
    recommendations = recommendations.map(rec => {
      const found = topSemantic.find((s: any) => s.title === rec.title);
      if (found && found.similarity > 0.7) {
        return { ...rec, confidencePercent: Math.max(rec.confidencePercent, Math.round(found.similarity * 100), 75) };
      }
      return rec;
    });
    topSemantic.forEach((s: any) => {
      if (!recommendations.some(r => r.title === s.title) && s.similarity > 0.6) {
        recommendations.push({
          title: s.title,
          description: s.description,
          confidencePercent: Math.round(s.similarity * 100),
          why: 'Semantic match to your profile.'
        });
      }
    });
  }

  // --- Merge AI/LLM recommendations if present ---
  if (aiRecs.length > 0) {
    aiRecs.forEach(ai => {
      const idx = recommendations.findIndex(r => r.title === ai.title);
      if (idx !== -1) {
        // Merge, boost if both semantic and AI agree
        recommendations[idx] = {
          ...recommendations[idx],
          confidencePercent: Math.max(recommendations[idx].confidencePercent, ai.confidencePercent, 80),
          why: (recommendations[idx].why || '') + ' [AI agrees: ' + ai.why + ']'
        };
      } else {
        recommendations.push(ai);
      }
    });
  }

  // --- Always ensure at least one strong match ---
  if (!recommendations.some(r => r.confidencePercent >= 70) && recommendations.length > 0) {
    recommendations[0] = {
      ...recommendations[0],
      confidencePercent: 90,
      why: (recommendations[0].why || '') + ' [Promoted to ensure a strong match]'
    };
  }

  // Remove duplicates overall (by title+desc)
  const deduped: CareerRecommendation[] = [];
  const seen = new Set();
  for (const rec of recommendations) {
    const key = rec.title + rec.description;
    if (!seen.has(key)) {
      deduped.push(rec);
      seen.add(key);
    }
  }
  return deduped;
}