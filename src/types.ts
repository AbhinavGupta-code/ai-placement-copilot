export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isGlitchy?: boolean;
}

export interface ResumeAnalysis {
  atsScore: number;
  missingSkills: string[];
  weakSections: {
    section: string;
    issue: string;
    suggestion: string;
  }[];
  suggestions: string[];
  recommendedProjects: {
    title: string;
    description: string;
    tech: string[];
  }[];
  recommendedCertifications: string[];
}

export interface InterviewQuestion {
  question: string;
  idealKeywords: string[];
}

export interface QuestionFeedback {
  score: number;
  text: string;
  improvement: string;
}

export interface MockInterview {
  role: string;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  answers: string[];
  feedbacks: QuestionFeedback[];
  status: 'setup' | 'interviewing' | 'completed';
  finalScore?: number;
  overallFeedback?: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  goals: string[];
  topics: string[];
  projects: {
    title: string;
    description: string;
    tasks: string[];
  };
  resources: {
    name: string;
    type: 'video' | 'article' | 'course' | 'doc';
    link: string;
  }[];
}

export interface RoadmapPlan {
  targetRole: string;
  experienceLevel: string;
  timeAvailable: string;
  weeks: RoadmapWeek[];
}

export interface SkillGapItem {
  skill: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  estHours: number;
  resources: string[];
}

export interface SkillGapAnalysis {
  targetRole: string;
  currentSkills: string[];
  targetSkills: string[];
  gaps: SkillGapItem[];
}

export interface InternshipPost {
  id: string;
  title: string;
  company: string;
  location: string;
  skillsRequired: string[];
  matchScore: number;
  tips: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  targetRole: string;
  experienceLevel: string;
  timeAvailable: string;
  currentSkills: string[];
}
