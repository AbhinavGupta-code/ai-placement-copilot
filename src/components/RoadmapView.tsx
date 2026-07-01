import React, { useState } from 'react';
import { UserProfile, RoadmapPlan, RoadmapWeek } from '../types';
import { TARGET_ROLES } from '../data';
import { Sparkles, Calendar, BookOpen, Layers, CheckCircle, ArrowRight, RefreshCw, Code, Video } from 'lucide-react';

interface RoadmapViewProps {
  userProfile: UserProfile;
  onRoadmapSync: (plan: RoadmapPlan) => void;
  initialRoadmap: RoadmapPlan | null;
}

export default function RoadmapView({
  userProfile,
  onRoadmapSync,
  initialRoadmap
}: RoadmapViewProps) {
  const [skillsCsv, setSkillsCsv] = useState(userProfile.currentSkills.join(', '));
  const [targetRole, setTargetRole] = useState(userProfile.targetRole);
  const [experienceLevel, setExperienceLevel] = useState(userProfile.experienceLevel);
  const [timeAvailable, setTimeAvailable] = useState(userProfile.timeAvailable);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapPlan | null>(initialRoadmap);
  const [activeWeek, setActiveWeek] = useState<number | null>(1);

  const generateNeuralPathway = async () => {
    setIsGenerating(true);
    setRoadmap(null);
    try {
      const skills = skillsCsv.split(',').map(s => s.trim()).filter(s => s.length > 0);
      const response = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSkills: skills,
          targetRole,
          experienceLevel,
          timeAvailable
        })
      });
      const data = await response.json();
      if (data && data.weeks) {
        setRoadmap(data);
        onRoadmapSync(data);
        setActiveWeek(1);
      } else {
        throw new Error("Invalid roadmap payload");
      }
    } catch (err) {
      console.error("[FRONTEND] Roadmap generation failed:", err);
      // Offline fallback
      const failoverPlan: RoadmapPlan = {
        targetRole,
        experienceLevel,
        timeAvailable,
        weeks: [
          {
            weekNumber: 1,
            title: "Phase 01: Core Compiler Setup & Runtime Systems",
            goals: ["Establish fundamental compiler targets", "Resolve REST endpoint throttling errors"],
            topics: ["ES6 closures & lexical scopes", "Async state hydration bottlenecks"],
            projects: {
              title: "Autonomous Web Grid Socket",
              description: "Architect a custom TCP socket frame to monitor event logs in real time.",
              tasks: ["Initialize git structures", "Benchmark message routing throughput"]
            },
            resources: [
              { name: "Node.js Advanced Event Architecture", type: "doc", link: "https://nodejs.org" },
              { name: "TypeScript Handbook: Deep Dive Types", type: "course", link: "https://typescriptlang.org" }
            ]
          },
          {
            weekNumber: 2,
            title: "Phase 02: High-Performance Database Sharding",
            goals: ["Optimize relational query latency", "Deploy multi-tenant index pools"],
            topics: ["B-Tree layout parameters", "JWT rotation security vectors"],
            projects: {
              title: "Relational Index Sharding Pipeline",
              description: "Formulate custom relational sharding algorithms across concurrent SQL cores.",
              tasks: ["Construct index sharding schemas", "Measure query fetch times under lock loads"]
            },
            resources: [
              { name: "PostgreSQL Index Optimization guide", type: "article", link: "https://postgresql.org" }
            ]
          }
        ]
      };
      setRoadmap(failoverPlan);
      onRoadmapSync(failoverPlan);
      setActiveWeek(1);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Title */}
      <div className="border-b border-cyan-glow/20 pb-4">
        <h2 className="text-xl font-bold tracking-wider text-white">
          <span className="text-cyan-glow">[DYNAMIC_NEURAL_ROADMAP]</span>
        </h2>
        <p className="text-[10px] text-gray-400">
          Synthesize high-fidelity study plans matching available placement countdown horizons.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col inputs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border-2 border-cyan-glow/30 bg-cyber-dark p-5 rounded relative">
            <h3 className="text-white font-bold tracking-wider mb-4 border-b border-cyan-glow/10 pb-2">
              ROADMAP_SYNTHESIZER
            </h3>

            <div className="space-y-4">
              {/* Target role */}
              <div className="space-y-1">
                <label className="text-gray-400 text-[10px] uppercase tracking-wider block">TARGET_CAREER_ROLE</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white px-2 py-1.5 outline-none rounded"
                >
                  {TARGET_ROLES.map((r, i) => (
                    <option key={i} value={r} className="bg-cyber-dark text-white">{r}</option>
                  ))}
                </select>
              </div>

              {/* Exp level & countdown */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-gray-400 text-[10px] uppercase tracking-wider block">CANDIDATE_LEVEL</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white px-2 py-1.5 outline-none rounded"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Entry-Level">Entry-Level</option>
                    <option value="Intermediate">Intermediate</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 text-[10px] uppercase tracking-wider block">HORIZON (TIME)</label>
                  <select
                    value={timeAvailable}
                    onChange={(e) => setTimeAvailable(e.target.value)}
                    className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white px-2 py-1.5 outline-none rounded"
                  >
                    <option value="4 Weeks">4 Weeks</option>
                    <option value="8 Weeks">8 Weeks</option>
                    <option value="12 Weeks">12 Weeks</option>
                  </select>
                </div>
              </div>

              {/* Current Skills CSV */}
              <div className="space-y-1">
                <label className="text-gray-400 text-[10px] uppercase tracking-wider block">CURRENT_TECHNICAL_BASE</label>
                <textarea
                  value={skillsCsv}
                  onChange={(e) => setSkillsCsv(e.target.value)}
                  rows={4}
                  className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white p-2 outline-none rounded text-[10px]"
                  placeholder="React, CSS, SQL, Python"
                />
              </div>

              <button
                onClick={generateNeuralPathway}
                disabled={isGenerating}
                className="w-full py-3 bg-cyan-glow text-cyber-black font-extrabold text-[11px] uppercase tracking-widest hover:bg-cyan-glow/80 disabled:opacity-40 rounded transition-colors cyber-clip-corners flex items-center justify-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'SYNTHESIZING_PATHWAY...' : 'SYNTHESIZE_SYLLABUS_'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col output */}
        <div className="lg:col-span-8">
          {isGenerating && (
            <div className="border-2 border-magenta-glow bg-cyber-dark/80 p-12 rounded flex flex-col items-center justify-center min-h-[400px] text-center animate-pulse">
              <div className="relative h-16 w-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-magenta-glow border-t-transparent animate-spin"></div>
              </div>
              <h4 className="text-magenta-glow font-pixel text-lg font-bold">[COGNITIVE_GRID_CALIBRATION]</h4>
              <p className="text-gray-400 max-w-xs mt-2 text-[10px] font-mono">
                Structuring step-by-step weekly milestone arrays, resource reference vectors, and tailored project specifications. Please preserve signal integrity...
              </p>
            </div>
          )}

          {!isGenerating && !roadmap && (
            <div className="border-2 border-dashed border-cyan-glow/20 bg-cyber-dark/30 rounded p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
              <Calendar className="h-12 w-12 text-gray-600 mb-2" />
              <h4 className="text-gray-400 font-bold uppercase tracking-wider">Awaiting Generation Protocol</h4>
              <p className="text-gray-500 max-w-xs mt-1 text-[10px]">
                Define your transition timeline on the left sidecard to synthesize your custom learning matrix.
              </p>
            </div>
          )}

          {!isGenerating && roadmap && (
            <div className="space-y-4">
              <div className="border border-cyan-glow bg-cyber-dark p-4 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-cyan-glow uppercase font-bold">[COGNITIVE PATHWAY SYNCHRONIZED]</span>
                  <h3 className="text-sm font-bold text-white mt-1">
                    Transitioning to {roadmap.targetRole.toUpperCase()} // Duration: {roadmap.timeAvailable}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => {
                      const reportText = `=====================================================
AI PLACEMENT COPILOT - CAREER PATHWAY SYLLABUS
=====================================================
TARGET PROFILE ROLE: ${roadmap.targetRole.toUpperCase()}
LEVEL OF DIFFICULTY: ${roadmap.experienceLevel.toUpperCase()}
PREPARATION DURATION: ${roadmap.timeAvailable}
TIMESTAMP: ${new Date().toISOString().split('T')[0]}

=====================================================
WEEK-BY-WEEK PROGRESS MATRIX:
=====================================================
${roadmap.weeks.map(wk => `WEEK 0${wk.weekNumber} // TITLE: ${wk.title.toUpperCase()}
-----------------------------------------------------
WEEKLY MILESTONE GOALS:
${wk.goals.map((g, i) => `- [${i+1}] ${g}`).join('\n')}

TECHNICAL SUBJECT COGNITION MAP:
${wk.topics.join(', ')}

WEEKLY PRACTICE DEPLOYMENT (CAPSTONE):
- Title: ${wk.projects.title.toUpperCase()}
- Scope: ${wk.projects.description}
- Project Core Objectives:
${wk.projects.tasks.map((tsk, i) => `  » [${i+1}] ${tsk}`).join('\n')}

LEARNING CURATION RESOURCES:
${wk.resources.map(res => `- ${res.name} (${res.type.toUpperCase()}): ${res.link}`).join('\n')}
`).join('\n\n=====================================================\n')}

=====================================================
REPORT END // COGNITIVE PATHWAY SYSTEM ARCHITECTS
=====================================================`;
                      const element = document.createElement("a");
                      const file = new Blob([reportText], { type: 'text/plain' });
                      element.href = URL.createObjectURL(file);
                      element.download = `Career_Syllabus_${roadmap.targetRole.replace(/\s+/g, '_')}.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="w-full sm:w-auto px-3 py-1.5 bg-magenta-glow text-white font-extrabold text-[10px] tracking-wider uppercase hover:bg-magenta-glow/85 transition-colors shrink-0 rounded font-mono"
                  >
                    EXPORT_SYLLABUS_
                  </button>

                  <span className="px-2.5 py-1 border border-matrix-green bg-matrix-green/10 text-matrix-green rounded font-bold uppercase text-[9px] block text-center shrink-0 font-mono">
                    {roadmap.experienceLevel}
                  </span>
                </div>
              </div>

              {/* Weekly collapsible items */}
              <div className="space-y-3">
                {roadmap.weeks.map((wk, idx) => (
                  <div key={idx} className="border-2 border-cyan-glow/20 bg-cyber-dark/50 rounded overflow-hidden">
                    <button
                      onClick={() => setActiveWeek(activeWeek === wk.weekNumber ? null : wk.weekNumber)}
                      className="w-full text-left p-4 hover:bg-cyan-glow/5 flex items-center justify-between border-b border-cyan-glow/10"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-magenta-glow font-pixel text-base">
                          WEEK_0{wk.weekNumber}
                        </span>
                        <span className="text-white font-bold text-xs">
                          {wk.title}
                        </span>
                      </div>
                      <span className="text-cyan-glow">{activeWeek === wk.weekNumber ? '[-]' : '[+]'}</span>
                    </button>

                    {activeWeek === wk.weekNumber && (
                      <div className="p-5 space-y-4 bg-cyber-black/20">
                        {/* Weekly goals */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-cyan-glow font-bold uppercase tracking-wider block">Target Milestone Goals</span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
                            {wk.goals.map((g, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-matrix-green shrink-0 mt-0.5" />
                                <span>{g}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Core topics */}
                        <div className="space-y-1.5 border-t border-cyan-glow/10 pt-3">
                          <span className="text-[10px] text-cyan-glow font-bold uppercase tracking-wider block">Technical Topics to Compile</span>
                          <div className="flex flex-wrap gap-1.5">
                            {wk.topics.map((tp, i) => (
                              <span key={i} className="px-2 py-0.5 bg-cyan-glow/5 border border-cyan-glow/10 text-gray-300 rounded font-mono text-[10px]">
                                {tp}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Weekly Capstone Project */}
                        <div className="p-4 border border-magenta-glow/30 bg-cyber-dark rounded space-y-3">
                          <div className="flex items-center justify-between border-b border-magenta-glow/10 pb-1.5">
                            <span className="text-magenta-glow font-bold uppercase tracking-wider flex items-center gap-1">
                              <Code className="h-3.5 w-3.5" />
                              <span>CAPSTONE_PROJECT: {wk.projects.title.toUpperCase()}</span>
                            </span>
                            <span className="text-[8px] border border-magenta-glow/30 text-magenta-glow px-1 py-0.5 rounded uppercase font-bold">
                              CRITICAL_TASK
                            </span>
                          </div>
                          <p className="text-gray-300 text-[11px] leading-relaxed">
                            {wk.projects.description}
                          </p>
                          <div className="space-y-1 pl-4 border-l border-magenta-glow/20">
                            <span className="text-gray-400 text-[9px] uppercase tracking-wider block font-bold">Development Tasks:</span>
                            {wk.projects.tasks.map((tsk, i) => (
                              <div key={i} className="text-gray-300 flex items-center gap-2 text-[10px]">
                                <span className="text-magenta-glow font-bold">»</span>
                                <span>{tsk}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Study resources */}
                        <div className="border-t border-cyan-glow/10 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <span className="text-[10px] text-cyan-glow font-bold uppercase tracking-wider block">Learning Resource Sockets</span>
                          <div className="flex flex-wrap gap-2">
                            {wk.resources.map((res, i) => (
                              <a
                                key={i}
                                href={res.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1 bg-cyber-black hover:bg-cyan-glow hover:text-cyber-black text-cyan-glow border border-cyan-glow/20 rounded transition-all font-bold text-[10px]"
                              >
                                {res.type === 'video' ? <Video className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                                <span>{res.name}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
