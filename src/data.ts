import { InternshipPost, UserProfile } from "./types";

export const DEFAULT_RESUME_TEXT = `JOHN CANDIDATE
Email: john.candidate@neurogrid.net | Phone: +1-555-0101 | GitHub: github.com/johncandidate

OBJECTIVE
Highly motivated Entry-Level Engineer seeking an internship or full-time placement in Software Development. Eager to deploy system engineering concepts and React principles to optimize application throughput.

EDUCATION
Cybernetic Institute of Technology, B.S. in Computer Science
- Expected Graduation: May 2027
- GPA: 3.6/4.0
- Key Courses: Data Structures, Database Systems, Software Engineering, Parallel Computing.

TECHNICAL SKILLS
- Languages: JavaScript, Python, SQL, C++
- Frameworks: React, HTML5, CSS3, Tailwind
- Tools: Git, VS Code, Postman
- Concepts: REST APIs, Object-Oriented Programming, MVC Architecture

ACADEMIC PROJECTS
Task Scheduler App (React, Tailwind)
- Designed a client-side interface to manage personal productivity goals.
- Integrated localStorage APIs to enable browser-level data persistence.
- Styled components with Tailwind utility layers to support active responsiveness.

Library Catalog DBMS (Python, SQLite)
- Built a command-line interface to coordinate book rentals, indexing, and user tables.
- Formulated relational triggers to handle concurrent return anomalies.

WORK EXPERIENCE
IT Support Technician, Campus Computing Center (Part-Time, 2025 - Present)
- Diagnosed local network connectivity blockages for over 200 daily active users.
- Re-imaged damaged laboratory terminals, ensuring hardware alignment.
`;

export const TARGET_ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Developer",
  "AI/ML Engineer",
  "Python Developer",
  "Java Systems Engineer",
  "C++ Systems Engineer",
  "Human Resources (HR)"
];

export const MOCK_INTERNSHIPS: InternshipPost[] = [
  {
    id: "int-01",
    title: "Systems Grid Architect Intern",
    company: "NEURALYTICS CORP",
    location: "Tokyo Grid / Remote",
    skillsRequired: ["React", "TypeScript", "Docker", "REST APIs"],
    matchScore: 94,
    tips: [
      "Prepare to describe Docker volume structures in detail.",
      "Brush up on React StrictMode and render-cycle bottlenecks."
    ]
  },
  {
    id: "int-02",
    title: "Junior Backend Processor",
    company: "KRONOS AUTOMATIONS",
    location: "Neo-Denver Sector",
    skillsRequired: ["Python", "Express", "PostgreSQL", "REST APIs"],
    matchScore: 81,
    tips: [
      "They test heavily on database isolation levels (Serializable, Repeatable Read).",
      "Highlight multi-threaded script performance in your interview."
    ]
  },
  {
    id: "int-03",
    title: "Full-Stack Node Specialist",
    company: "XENO-SYSTEMS LTD",
    location: "Singapore Hub / Hybrid",
    skillsRequired: ["TypeScript", "React", "Docker", "Express"],
    matchScore: 73,
    tips: [
      "Study JWT token rotation mechanics and cookie session security.",
      "Be ready for a live-coding exercise in standard TypeScript bundlers."
    ]
  },
  {
    id: "int-04",
    title: "Cognitive ML Pipeline Apprentice",
    company: "AETHERIA LABS",
    location: "Virtual Sector 07",
    skillsRequired: ["Python", "Docker", "TypeScript"],
    matchScore: 65,
    tips: [
      "Review vector retrieval optimization and embedding calculation latency.",
      "Expect questions regarding model accuracy metric comparisons."
    ]
  }
];

export const FAQS = [
  {
    q: "Which AI model powers the application?",
    a: "The entire cognitive suite is powered by Google's Gemini 3.5 Flash neural models, proxied securely via backend Express route gates to protect access credentials while delivering high-speed latency metrics."
  },
  {
    q: "Is my resume stored permanently?",
    a: "Negative. Your privacy is critical. Resume documents are parsed client-side inside the browser using custom PDF.js array buffers. No plain text payloads are ever written to persistent cloud disks."
  },
  {
    q: "Which file formats are supported?",
    a: "The parser accepts both standard plain text (.txt) entries and raw Portable Document Format (.pdf) files, utilizing local memory blocks to strip metadata and extract clear characters."
  },
  {
    q: "How does the ATS Scanner evaluate my resume?",
    a: "Our scanner parses your resume text structure and cross-references key technical tokens against current placement requirement matrices. It returns an objective ATS score and identifies semantic gap codes."
  },
  {
    q: "Is the AI mock interviewer role-specific?",
    a: "Yes. Selecting 'Backend' or 'Frontend' triggers our COGNITIVE INTERVIEW engine to fetch highly targeted system and conceptual questions corresponding to real-world tech stack screenings."
  },
  {
    q: "How can I maximize my Readiness Score?",
    a: "Upload a validated resume, solve mock interviews to accumulate feedback score logs, complete items on your learning roadmap, and eliminate skill gaps flagged in the analyzer."
  }
];

export const TESTIMONIALS = [
  {
    name: "SAMPLE_ATS_SCAN_OUTFLOW",
    role: "Full-Stack Dev Profile",
    quote: "CRITICAL: 'Docker' and 'Kubernetes' tokens are absent from academic project matrices. ATS Score: 52/100. Resolution: Document container deployments within your database project node."
  },
  {
    name: "EXAMPLE_MOCK_INTERVIEW_FEEDBACK",
    role: "Concurrency & Locking",
    quote: "EVALUATION LOG: Candidate failed to explain 'Serializable' isolation behavior in concurrent write-skew anomalies. Score: 68/100. Action: Practice explaining lock escalations verbally."
  },
  {
    name: "AI_GENERATED_ROADMAP_GRID",
    role: "4-Week Capstone Sequence",
    quote: "TIMELINE COMPILE: Week 2 dedicates 15 hours to Express middleware authorization. Deliverable: Build a functional JWT rotation scheme. Output: Verifiable Git repository logs."
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: "Candidate_Alpha",
  email: "candidate@neurogrid.net",
  role: "Diploma Student",
  targetRole: "Full Stack Developer",
  experienceLevel: "Entry-Level",
  timeAvailable: "4 Weeks",
  currentSkills: ["HTML", "CSS", "Basic JavaScript", "Python", "SQL"]
};
