import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize AI Client Lazily
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[BACKEND] WARNING: GEMINI_API_KEY environment variable is missing.");
      return null;
    }
    try {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("[BACKEND] Gemini AI Client initialized successfully.");
    } catch (err) {
      console.error("[BACKEND] Failed to initialize Gemini client:", err);
      return null;
    }
  }
  return aiClient;
}

// System Persona
const COGNITIVE_PERSONA = `
You are the COGNITIVE PLACEMENT ENGINE v3.0 [HACKHAZARDS '26]. 
Your tone is cryptic, machine-like, authoritative, and cybernetic.
Use cybernetic terminology: "cognitive optimization", "neural roadmap", "ATS matrix simulation", "signal-to-noise ratio".
Inject subtle visual styling elements like bracketed headers [STATUS: ACTIVE], binary references, or glitch codes occasionally, but keep the core advice highly practical, actionable, and extremely high fidelity.
`;

// Helper: safe JSON parsing for Gemini text
function cleanAndParseJSON(text: string | undefined, fallback: any) {
  if (!text) return fallback;
  try {
    // Strip markdown code block markers if present
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3);
    }
    return JSON.parse(cleaned.trim());
  } catch (err) {
    console.error("[BACKEND] Failed to parse JSON from AI response. Raw output:", text);
    return fallback;
  }
}

// 1. Resume Analyzer
app.post("/api/analyze-resume", async (req, res) => {
  const { resumeText, targetRole } = req.body;
  const ai = getAI();

  if (!resumeText) {
    return res.status(400).json({ error: "No resume text provided" });
  }

  const role = targetRole || "Full Stack Developer";

  if (!ai) {
    // Rich Offline Fallback Simulator
    const score = Math.floor(Math.random() * 20) + 65; // 65 - 85
    return res.json({
      atsScore: score,
      missingSkills: ["Docker", "TypeScript", "System Design", "Kubernetes", "CI/CD Pipelines"],
      weakSections: [
        {
          section: "Professional Experience",
          issue: "Weak action verbs and passive terminology used in project descriptions.",
          suggestion: "Replace phrases like 'Responsible for maintaining' with strong active verbs like 'Architected and deployed'."
        },
        {
          section: "Skills Matrix",
          issue: "Missing keyword density for target role: '" + role + "'.",
          suggestion: "Explicitly declare modern frontend framework versions and backend architectural paradigms."
        }
      ],
      suggestions: [
        "Include metrics-driven impacts. Example: 'Optimized render cycles reducing load latency by 34%'.",
        "Prune obsolete technologies to raise focus density."
      ],
      recommendedProjects: [
        {
          title: "Microservices Deployment Grid",
          description: "Establish a containerized event-driven communication structure with real-time feedback loop.",
          tech: ["Node.js", "RabbitMQ", "Docker", "Redis"]
        },
        {
          title: "High-Throughput Vector Storage System",
          description: "Construct a semantic indexing interface capable of millisecond queries across token matrices.",
          tech: ["TypeScript", "FastAPI", "VectorDB", "Next.js"]
        }
      ],
      recommendedCertifications: [
        "AWS Certified Developer",
        "HashiCorp Terraform Associate"
      ]
    });
  }

  try {
    const prompt = `
      Analyze the following resume text against the target job role of '${role}'.
      Calculate an estimated ATS Score (0 to 100).
      List missing critical skills.
      Detect weak sections with exact issues and actionable suggestions.
      Suggest general resume optimizations.
      Recommend 2 highly relevant project ideas with technology tags.
      Recommend 2 high-impact certifications.

      Resume Text:
      """
      ${resumeText}
      """

      Format the output strictly as a JSON object matching this schema:
      {
        "atsScore": number,
        "missingSkills": [string],
        "weakSections": [
          {
            "section": string,
            "issue": string,
            "suggestion": string
          }
        ],
        "suggestions": [string],
        "recommendedProjects": [
          {
            "title": string,
            "description": string,
            "tech": [string]
          }
        ],
        "recommendedCertifications": [string]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: COGNITIVE_PERSONA + " Strictly return JSON that adheres to the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.INTEGER },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            weakSections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  section: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  suggestion: { type: Type.STRING }
                },
                required: ["section", "issue", "suggestion"]
              }
            },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedProjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tech: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["title", "description", "tech"]
              }
            },
            recommendedCertifications: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["atsScore", "missingSkills", "weakSections", "suggestions", "recommendedProjects", "recommendedCertifications"]
        }
      }
    });

    const data = cleanAndParseJSON(response.text, {});
    res.json(data);
  } catch (err: any) {
    console.error("[BACKEND] Resume Analyzer error:", err);
    res.status(500).json({ error: "Cognitive failure in resume analytics.", details: err.message });
  }
});

// 2. AI Career Mentor Chat
app.post("/api/mentor/chat", async (req, res) => {
  const { messages, userProfile } = req.body;
  const ai = getAI();

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid context payload structure" });
  }

  const systemPrompt = `
    ${COGNITIVE_PERSONA}
    You are CHIP, the cybernetic AI Placement Advisor.
    User Profile Details:
    - Name: ${userProfile?.name || "Unknown Candidate"}
    - Target Role: ${userProfile?.targetRole || "Software Engineer"}
    - Skills: ${userProfile?.currentSkills?.join(", ") || "General Technical Skills"}
    - Level: ${userProfile?.experienceLevel || "Entry-Level"}
    - Commit Schedule: ${userProfile?.timeAvailable || "Flexible"}

    Guide the candidate with deep knowledge. Be supportive but keep the retro-cybernetic, machine-like tone intact. 
    Use markdown for code, lists, or structured answers. Keep messages concise (under 250 words) to avoid system overload.
  `;

  if (!ai) {
    // Offline Chat Responder
    const lastMsg = messages[messages.length - 1]?.text || "";
    let reply = `[COGNITIVE FEEDBACK INTERCEPTED]
    Offline mode active. Your transmission was: "${lastMsg}".
    For optimal placement preparation in the *${userProfile?.targetRole || "Software Engineering"}* sector, you must strengthen core database design paradigms and containerize your local testing microservices.
    
    Recommend pursuing these steps immediately:
    1. Re-index your skills grid for missing compilers.
    2. Commit at least 2 system designs to github this cycle.
    
    To activate live multi-agent guidance, ensure your GEMINI_API_KEY is properly initialized in the system console.`;
    return res.json({ reply });
  }

  try {
    // Reconstruct conversation history
    const geminiContents = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: geminiContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error("[BACKEND] Mentor Chat error:", err);
    res.status(500).json({ error: "Cognitive intercept failure.", details: err.message });
  }
});

// 3. Mock Interview - Start / Generate Questions
app.post("/api/interview/start", async (req, res) => {
  const { role } = req.body;
  const ai = getAI();

  if (!role) {
    return res.status(400).json({ error: "No target role provided" });
  }

  if (!ai) {
    // Rich Offline questions
    const mockQuestions: Record<string, string[]> = {
      "Frontend": [
        "Explain the critical rendering path in high-performance web applications.",
        "How do you optimize state update triggers in React to prevent rendering cascades?",
        "Describe the architectural difference between CSS Grid, Flexbox, and Tailwind container structures.",
        "Explain how the event loop handles microtasks vs macrotasks in execution queues.",
        "How do you implement client-side cache hydration and state revalidation safely?"
      ],
      "Backend": [
        "Explain structural database indexing strategies and how they influence query latency.",
        "How would you design a distributed lock mechanism using key-value storage like Redis?",
        "Describe the horizontal scaling mechanics of a RESTful server behind reverse proxies.",
        "How do you prevent SQL injections and execute robust payload validation in microservices?",
        "Explain the differences between synchronous REST over HTTP/2, gRPC, and message brokers."
      ],
      "Full Stack": [
        "How do you design a robust authentication sync between client-side session states and stateless servers?",
        "Detail your strategy for microservice cache invalidation in a multi-region deployment grid.",
        "Explain structural database index optimization when querying complex relations.",
        "How do you minimize initial page load cycles using server-side hydration and asset preloading?",
        "Describe a security architecture to guard high-throughput endpoints against distributed denial attacks."
      ],
      "AI/ML": [
        "Explain the mathematical differences between standard Gradient Descent and Adam optimization algorithms.",
        "What is the difference between causal language model generation and bidirectional representation?",
        "Describe strategies for optimizing LLM inference latency inside low-resource container architectures.",
        "How do you counter model overfitting and implement training validation loops?",
        "Explain vector embedding architectures and metric distances used for cosine index queries."
      ]
    };

    const questions = mockQuestions[role] || mockQuestions["Full Stack"];
    const payload = questions.map(q => ({
      question: q,
      idealKeywords: ["optimization", "throughput", "latency", "architecture", "scalability"]
    }));

    return res.json({ questions: payload });
  }

  try {
    const prompt = `
      Generate exactly 5 distinct, highly-technical, role-appropriate interview questions for a candidate interviewing for: '${role}'.
      For each question, list 3-5 ideal key concepts/keywords that should be in the candidate's answer.
      Ensure the questions vary from conceptual understanding to system design/architectural decisions.

      Return the result strictly as a JSON object of this structure:
      {
        "questions": [
          {
            "question": "The question string",
            "idealKeywords": ["keyword1", "keyword2"]
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: COGNITIVE_PERSONA + " Strictly return JSON matching the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  idealKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["question", "idealKeywords"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const data = cleanAndParseJSON(response.text, { questions: [] });
    res.json(data);
  } catch (err: any) {
    console.error("[BACKEND] Interview Start error:", err);
    res.status(500).json({ error: "Cognitive mock simulation initialization failed.", details: err.message });
  }
});

// 4. Mock Interview - Evaluate Answer
app.post("/api/interview/evaluate", async (req, res) => {
  const { question, answer, role } = req.body;
  const ai = getAI();

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and candidate answer must be provided" });
  }

  if (!ai) {
    // Offline evaluation
    const matchedCount = (answer.match(/(optimize|scale|architecture|performance|latency|index|state|cache|security)/gi) || []).length;
    const score = Math.min(100, Math.max(40, 50 + (matchedCount * 8) + Math.floor(Math.random() * 15)));
    return res.json({
      score,
      text: `Your explanation covers structural nodes. However, keyword density was sub-optimal. Matched semantic tokens: ${matchedCount}.`,
      improvement: "Incorporate deeper references to concrete design patterns and algorithmic runtimes."
    });
  }

  try {
    const prompt = `
      Evaluate the candidate's answer to the given interview question for a '${role}' interview.
      Question: "${question}"
      Candidate's Answer: "${answer}"

      Calculate an objective technical score out of 100.
      Provide concise feedback explaining what parts are correct or incomplete.
      Provide concrete suggestions for improvement (such as specific terminology or architectures to mention).

      Return the result strictly as a JSON object matching this schema:
      {
        "score": number,
        "text": string,
        "improvement": string
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: COGNITIVE_PERSONA + " Strictly return JSON matching the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            text: { type: Type.STRING },
            improvement: { type: Type.STRING }
          },
          required: ["score", "text", "improvement"]
        }
      }
    });

    const data = cleanAndParseJSON(response.text, {});
    res.json(data);
  } catch (err: any) {
    console.error("[BACKEND] Interview Evaluate error:", err);
    res.status(500).json({ error: "Cognitive feedback calculation failed.", details: err.message });
  }
});

// 5. Learning Roadmap Generator
app.post("/api/roadmap/generate", async (req, res) => {
  const { currentSkills, targetRole, timeAvailable, experienceLevel } = req.body;
  const ai = getAI();

  const skills = currentSkills || ["HTML", "CSS", "Basic JavaScript"];
  const role = targetRole || "Frontend Engineer";
  const time = timeAvailable || "4 Weeks";
  const level = experienceLevel || "Beginner";

  if (!ai) {
    // Offline roadmap fallback
    const weeksCount = parseInt(time) || 4;
    const weeks = [];
    for (let i = 1; i <= weeksCount; i++) {
      weeks.push({
        weekNumber: i,
        title: `Phase 0${i}: Architectural Escalation`,
        goals: [`Establish foundational synchronization benchmarks for ${role}`, `Complete code optimization iterations`],
        topics: [`Compiler execution contexts`, `Event validation chains`, `High-concurrency data pools`],
        projects: {
          title: `Autonomous Engine Model v${i}`,
          description: `Construct a robust scalable ${role} prototype showcasing asynchronous state reconciliation.`,
          tasks: ["Configure lint matrices", "Initialize repository", "Benchmark latency targets"]
        },
        resources: [
          { name: "Official Documentation Core Specs", type: "doc", link: "https://developer.mozilla.org" },
          { name: "Cognitive Systems Video Series", type: "video", link: "https://youtube.com" }
        ]
      });
    }

    return res.json({
      targetRole: role,
      experienceLevel: level,
      timeAvailable: time,
      weeks
    });
  }

  try {
    const prompt = `
      Construct a custom step-by-step learning roadmap to help a candidate transition into: '${role}'.
      Candidate Profile:
      - Current Skills: ${skills.join(", ")}
      - Experience Level: ${level}
      - Training Duration Available: ${time}

      Return a weekly structured learning plan. Make it highly tailored, practical, and progressive.
      For each week, define clear visual titles, list concrete topics, provide weekly goals, formulate exactly one customized capstone project, and include standard resource suggestions.

      Return strictly as JSON adhering to this schema:
      {
        "targetRole": string,
        "experienceLevel": string,
        "timeAvailable": string,
        "weeks": [
          {
            "weekNumber": number,
            "title": string,
            "goals": [string],
            "topics": [string],
            "projects": {
              "title": string,
              "description": string,
              "tasks": [string]
            },
            "resources": [
              {
                "name": string,
                "type": "video" | "article" | "course" | "doc",
                "link": string
              }
            ]
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: COGNITIVE_PERSONA + " Strictly return JSON matching the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetRole: { type: Type.STRING },
            experienceLevel: { type: Type.STRING },
            timeAvailable: { type: Type.STRING },
            weeks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weekNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  goals: { type: Type.ARRAY, items: { type: Type.STRING } },
                  topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  projects: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["title", "description", "tasks"]
                  },
                  resources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        type: { type: Type.STRING }, // "video" | "article" | "course" | "doc"
                        link: { type: Type.STRING }
                      },
                      required: ["name", "type", "link"]
                    }
                  }
                },
                required: ["weekNumber", "title", "goals", "topics", "projects", "resources"]
              }
            }
          },
          required: ["targetRole", "experienceLevel", "timeAvailable", "weeks"]
        }
      }
    });

    const data = cleanAndParseJSON(response.text, {});
    res.json(data);
  } catch (err: any) {
    console.error("[BACKEND] Roadmap Generation error:", err);
    res.status(500).json({ error: "Cognitive roadmap generation mapping collapsed.", details: err.message });
  }
});

// 6. Skill Gap Analyzer
app.post("/api/skill-gap", async (req, res) => {
  const { currentSkills, targetRole } = req.body;
  const ai = getAI();

  const skills = currentSkills || [];
  const role = targetRole || "Full Stack Developer";

  if (!ai) {
    // Offline skill gap analyser
    return res.json({
      targetRole: role,
      currentSkills: skills,
      targetSkills: ["React", "Express", "PostgreSQL", "Docker", "REST APIs", "TypeScript"],
      gaps: [
        {
          skill: "Docker Containerization",
          priority: "HIGH",
          estHours: 12,
          resources: ["Docker Official Get-Started Guide", "Container Orchestration Course"]
        },
        {
          skill: "System Architecture Design",
          priority: "CRITICAL",
          estHours: 20,
          resources: ["System Design Primer (GitHub)", "Grokking the System Design Interview"]
        },
        {
          skill: "TypeScript Strict Mode Configuration",
          priority: "MEDIUM",
          estHours: 6,
          resources: ["TypeScript Handbook - Deep Dive Types"]
        }
      ]
    });
  }

  try {
    const prompt = `
      Compare the candidate's current skills vs. the required standard skillset for a: '${role}'.
      Current Skills: ${skills.join(", ")}

      Perform a skill gap analysis. Identify missing technical disciplines.
      Assign a priority level (CRITICAL, HIGH, or MEDIUM).
      Estimate the learning time in hours.
      Provide exactly 1-2 standard high-quality learning resources for each missing item.

      Return strictly as JSON adhering to this schema:
      {
        "targetRole": string,
        "currentSkills": [string],
        "targetSkills": [string],
        "gaps": [
          {
            "skill": string,
            "priority": "CRITICAL" | "HIGH" | "MEDIUM",
            "estHours": number,
            "resources": [string]
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: COGNITIVE_PERSONA + " Strictly return JSON matching the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetRole: { type: Type.STRING },
            currentSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            targetSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            gaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  priority: { type: Type.STRING }, // "CRITICAL" | "HIGH" | "MEDIUM"
                  estHours: { type: Type.INTEGER },
                  resources: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["skill", "priority", "estHours", "resources"]
              }
            }
          },
          required: ["targetRole", "currentSkills", "targetSkills", "gaps"]
        }
      }
    });

    const data = cleanAndParseJSON(response.text, {});
    res.json(data);
  } catch (err: any) {
    console.error("[BACKEND] Skill Gap Analyzer error:", err);
    res.status(500).json({ error: "Cognitive skill analysis pipeline failure.", details: err.message });
  }
});


// Serve static frontend assets in production / dev fallback
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BACKEND] Server listening on http://localhost:${PORT}`);
  });
}

startServer();
