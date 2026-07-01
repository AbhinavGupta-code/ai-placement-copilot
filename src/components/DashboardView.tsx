import React from 'react';
import { UserProfile, ResumeAnalysis } from '../types';
import { Award, Briefcase, CheckSquare, Star, ArrowUpRight, Code, AlertCircle } from 'lucide-react';

interface DashboardViewProps {
  userProfile: UserProfile;
  resumeAnalysis: ResumeAnalysis | null;
  interviewScore: number | null;
  completedTasks: string[];
  onNavigate: (page: string) => void;
}

export default function DashboardView({
  userProfile,
  resumeAnalysis,
  interviewScore,
  completedTasks,
  onNavigate
}: DashboardViewProps) {
  
  // Calculate a mock Placement Readiness Score dynamically
  const resumeScore = resumeAnalysis ? resumeAnalysis.atsScore : 65; // base fallback
  const skillsCount = userProfile.currentSkills.length;
  const intScore = interviewScore || 0;
  
  const skillPoints = Math.min(30, skillsCount * 6); // Up to 30%
  const resPoints = Math.min(40, (resumeScore / 100) * 40); // Up to 40%
  const interviewPoints = intScore ? Math.min(30, (intScore / 100) * 30) : 10; // Up to 30%
  
  const readinessScore = Math.round(skillPoints + resPoints + interviewPoints);

  // Recommended skills based on targeted role
  const getRecommendedSkills = (role: string) => {
    switch (role) {
      case 'Frontend Engineer':
        return ['TypeScript', 'React Router', 'Next.js', 'Vite', 'Testing Library'];
      case 'Backend Engineer':
        return ['Docker', 'PostgreSQL', 'Express', 'Redis', 'Node.js', 'gRPC'];
      case 'AI/ML Engineer':
        return ['TensorFlow', 'PyTorch', 'Vector Databases', 'scikit-learn', 'FastAPI'];
      default:
        return ['Docker', 'TypeScript', 'Express', 'PostgreSQL', 'CI/CD Pipelines'];
    }
  };

  const recommendedSkills = getRecommendedSkills(userProfile.targetRole);

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-glow/20 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-white flex items-center gap-2">
            <span className="text-cyan-glow">[CONSOLE_DASHBOARD]</span>
          </h2>
          <p className="text-[10px] text-gray-400">
            Welcome back, <span className="text-magenta-glow font-bold">{userProfile.name}</span>. Review cognitive readiness status.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-cyber-black border border-magenta-glow/30 rounded text-[11px]">
          <span className="text-gray-400">TARGET_SECTOR:</span>
          <span className="text-magenta-glow font-bold uppercase">{userProfile.targetRole}</span>
        </div>
      </div>

      {/* Main Score Ticker & Profile Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placement Readiness Gauge */}
        <div className="md:col-span-1 border-2 border-magenta-glow bg-cyber-dark/80 p-6 rounded relative cyber-glow-magenta flex flex-col justify-between">
          <div className="absolute top-2 right-2 text-[8px] text-magenta-glow border border-magenta-glow/30 px-1 rounded">
            METRIC_01
          </div>
          <div>
            <h3 className="text-white font-bold tracking-wider flex items-center gap-1">
              <Award className="h-4 w-4 text-magenta-glow" />
              <span>PLACEMENT_READINESS</span>
            </h3>
            <p className="text-gray-400 text-[10px] mt-1">Aggregated career readiness factor.</p>
          </div>

          <div className="my-6 flex flex-col items-center justify-center relative">
            {/* Circle Progress simulation */}
            <div className="relative h-32 w-32 flex items-center justify-center border-4 border-cyan-glow/10 rounded-full">
              <div className="absolute inset-2 border-4 border-magenta-glow border-t-transparent rounded-full animate-spin duration-3000"></div>
              <div className="text-center">
                <span className="text-4xl font-extrabold text-white font-pixel tracking-tighter text-glitch-magenta">
                  {readinessScore}%
                </span>
                <div className="text-[8px] text-matrix-green tracking-widest font-bold">OPTIMIZED</div>
              </div>
            </div>
          </div>

          <div className="border-t border-magenta-glow/20 pt-4 space-y-2 text-[10px]">
            <div className="flex justify-between">
              <span className="text-gray-400">RESUME_ATS_FACTOR:</span>
              <span className="text-cyan-glow font-bold">{Math.round(resumeScore)}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">INTERVIEW_SCORE:</span>
              <span className="text-magenta-glow font-bold">{intScore ? `${intScore}/100` : 'NOT_LOGGED'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">SKILL_MATRIX_DENSITY:</span>
              <span className="text-matrix-green font-bold">{skillsCount} COMPILER NODES</span>
            </div>
          </div>
        </div>

        {/* User profile & Stats */}
        <div className="md:col-span-2 border-2 border-cyan-glow bg-cyber-dark p-6 rounded relative flex flex-col justify-between">
          <div className="absolute top-2 right-2 text-[8px] text-cyan-glow border border-cyan-glow/30 px-1 rounded">
            METRIC_02
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left Col: Profile Details */}
            <div className="space-y-4">
              <h3 className="text-white font-bold tracking-wider flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-cyan-glow" />
                <span>USER_METRIC_VECTORS</span>
              </h3>
              
              <div className="space-y-2 border-l border-cyan-glow/20 pl-3">
                <div>
                  <span className="text-gray-400 text-[10px] block">CANDIDATE_ID:</span>
                  <span className="text-white font-bold">{userProfile.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">ACADEMIC_RANK:</span>
                  <span className="text-white">{userProfile.role}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">COMMITMENT_LEVEL:</span>
                  <span className="text-matrix-green font-bold">{userProfile.timeAvailable}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">COGNITIVE_EXPERIENCE:</span>
                  <span className="text-white">{userProfile.experienceLevel}</span>
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Tasks */}
            <div className="space-y-4">
              <h3 className="text-white font-bold tracking-wider flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4 text-matrix-green" />
                <span>PENDING_SYS_TASKS</span>
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-cyber-black border border-cyan-glow/10 rounded">
                  <span className="text-gray-300">Resume ATS Alignment scan</span>
                  <span className={`px-1 rounded text-[9px] ${resumeAnalysis ? 'bg-matrix-green/20 text-matrix-green' : 'bg-magenta-glow/20 text-magenta-glow'}`}>
                    {resumeAnalysis ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-cyber-black border border-cyan-glow/10 rounded">
                  <span className="text-gray-300">Cognitive Interview Round</span>
                  <span className={`px-1 rounded text-[9px] ${intScore > 0 ? 'bg-matrix-green/20 text-matrix-green' : 'bg-magenta-glow/20 text-magenta-glow'}`}>
                    {intScore > 0 ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-cyber-black border border-cyan-glow/10 rounded">
                  <span className="text-gray-300">Deficit gap roadmap sync</span>
                  <span className={`px-1 rounded text-[9px] ${completedTasks.includes('roadmap') ? 'bg-matrix-green/20 text-matrix-green' : 'bg-gray-700 text-gray-400'}`}>
                    {completedTasks.includes('roadmap') ? 'SYNCHRONIZED' : 'LOCKED'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-cyan-glow/10 pt-4 mt-4 flex items-center justify-between">
            <span className="text-gray-400 text-[10px]">[COGNITIVE_GRID: RE-ALIGNED]</span>
            <button
              onClick={() => onNavigate('resume')}
              className="text-cyan-glow hover:underline flex items-center gap-1 text-[11px] font-bold"
            >
              <span>RUN_RESUME_ATS_SCAN</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Skills Matrix Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Skills Panel */}
        <div className="border-2 border-cyan-glow/30 bg-cyber-dark p-5 rounded">
          <h3 className="text-white font-bold tracking-wider mb-4 flex items-center gap-1">
            <Code className="h-4 w-4 text-cyan-glow" />
            <span>ACTIVE_COMPILER_SKILLS</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.currentSkills.map((sk, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-cyan-glow/10 border border-cyan-glow text-cyan-glow rounded font-mono text-[10px] tracking-wide">
                {sk.toUpperCase()}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-4 italic">
            * These skills represent your compiled neural vector base. Modify them in the settings node at any time.
          </p>
        </div>

        {/* Recommended Skills Panel */}
        <div className="border-2 border-magenta-glow/30 bg-cyber-dark p-5 rounded">
          <h3 className="text-white font-bold tracking-wider mb-4 flex items-center gap-1">
            <Star className="h-4 w-4 text-magenta-glow" />
            <span>RECOMMENDED_NEURAL_NODES</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {recommendedSkills.map((sk, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-magenta-glow/10 border border-magenta-glow text-magenta-glow rounded font-mono text-[10px] tracking-wide">
                {sk.toUpperCase()}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-4 flex items-start gap-1">
            <AlertCircle className="h-3.5 w-3.5 text-magenta-glow shrink-0 mt-0.5" />
            <span>Acquiring these nodes will raise your general candidate match score across international recruiter databases.</span>
          </p>
        </div>
      </div>

      {/* Dynamic AI Placement Suggestions Card */}
      <div className="border-2 border-matrix-green/30 bg-matrix-green/5 p-5 rounded">
        <div className="flex items-center gap-2 text-matrix-green font-bold tracking-wider mb-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-matrix-green animate-ping"></span>
          <span>CYBER_ADVISORY: COPILOT SUGGESTIONS</span>
        </div>
        <p className="text-gray-300 leading-relaxed text-[11px]">
          [DECRYPTED RECOMMENDATIONS]: Candidates targeting <span className="text-cyan-glow font-bold font-mono">{userProfile.targetRole}</span> should prioritize container deployment workflows (such as Docker). System analysis reveals a high keyword match frequency for containerization in 84% of placements cataloged in Sector 07. 
          We recommend executing a <span onClick={() => onNavigate('mock')} className="text-matrix-green underline hover:text-white font-bold cursor-pointer">Mock Interview Round</span> to log dynamic keyword metrics and align cognitive response pathways.
        </p>
      </div>
    </div>
  );
}
