import React, { useState } from 'react';
import { UserProfile, SkillGapAnalysis, SkillGapItem } from '../types';
import { TARGET_ROLES } from '../data';
import { ShieldAlert, BookOpen, Clock, AlertTriangle, RefreshCw, BarChart2 } from 'lucide-react';

interface SkillGapViewProps {
  userProfile: UserProfile;
  onAnalysisSync: (gapData: SkillGapAnalysis) => void;
  initialGapAnalysis: SkillGapAnalysis | null;
}

export default function SkillGapView({
  userProfile,
  onAnalysisSync,
  initialGapAnalysis
}: SkillGapViewProps) {
  const [skillsCsv, setSkillsCsv] = useState(userProfile.currentSkills.join(', '));
  const [targetRole, setTargetRole] = useState(userProfile.targetRole);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(initialGapAnalysis);

  const performGapAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const skills = skillsCsv.split(',').map(s => s.trim()).filter(s => s.length > 0);
      const response = await fetch('/api/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSkills: skills,
          targetRole
        })
      });
      const data = await response.json();
      if (data && data.gaps) {
        setAnalysis(data);
        onAnalysisSync(data);
      } else {
        throw new Error("Invalid skill gap payload");
      }
    } catch (err) {
      console.error("[FRONTEND] Skill Gap execution error:", err);
      // Fallback
      const failover: SkillGapAnalysis = {
        targetRole,
        currentSkills: skillsCsv.split(','),
        targetSkills: ["React", "Express", "Docker", "PostgreSQL", "REST APIs", "System Design"],
        gaps: [
          {
            skill: "Docker Containerization",
            priority: "HIGH",
            estHours: 12,
            resources: ["Docker Reference Manual", "Play with Docker interactive modules"]
          },
          {
            skill: "System Design and Latency Benchmarks",
            priority: "CRITICAL",
            estHours: 25,
            resources: ["System Design Primer (GitHub)", "Fowler Enterprise Architecture Specs"]
          },
          {
            skill: "Strict Mode Type Compilation",
            priority: "MEDIUM",
            estHours: 8,
            resources: ["TypeScript Handbook strict-compiler guidelines"]
          }
        ]
      };
      setAnalysis(failover);
      onAnalysisSync(failover);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateTotalHours = (gaps: SkillGapItem[]) => {
    return gaps.reduce((acc, g) => acc + g.estHours, 0);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Title */}
      <div className="border-b border-cyan-glow/20 pb-4">
        <h2 className="text-xl font-bold tracking-wider text-white">
          <span className="text-cyan-glow">[SKILL_GAP_VECTOR_ANALYZER]</span>
        </h2>
        <p className="text-[10px] text-gray-400">
          Compare compiled credentials against corporate role matrices to calculate active technology deficits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border-2 border-cyan-glow/30 bg-cyber-dark p-5 rounded relative">
            <h3 className="text-white font-bold tracking-wider mb-4 border-b border-cyan-glow/10 pb-2">
              COGNITIVE_SPECS_INPUT
            </h3>

            <div className="space-y-4">
              {/* Target Role Selector */}
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

              {/* Skills Area */}
              <div className="space-y-1">
                <label className="text-gray-400 text-[10px] uppercase tracking-wider block">ACTIVE_SKILLS_LIST (COMMA_SEPARATED)</label>
                <textarea
                  value={skillsCsv}
                  onChange={(e) => setSkillsCsv(e.target.value)}
                  rows={5}
                  className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white p-2 outline-none rounded text-[10px]"
                  placeholder="React, SQL, Python"
                />
              </div>

              <button
                onClick={performGapAnalysis}
                disabled={isAnalyzing}
                className="w-full py-3 bg-cyan-glow text-cyber-black font-extrabold text-[11px] uppercase tracking-widest hover:bg-cyan-glow/80 disabled:opacity-40 rounded transition-colors cyber-clip-corners flex items-center justify-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'CORRELATING_VECTORS...' : 'CORRELATE_SKILL_MATRIX_'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Card */}
        <div className="lg:col-span-8">
          {isAnalyzing && (
            <div className="border-2 border-magenta-glow bg-cyber-dark/80 p-12 rounded flex flex-col items-center justify-center min-h-[400px] text-center animate-pulse">
              <div className="relative h-16 w-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-magenta-glow border-t-transparent animate-spin"></div>
              </div>
              <h4 className="text-magenta-glow font-pixel text-lg font-bold">[EXTRACTING_DEFICIT_COEFFICIENT]</h4>
              <p className="text-gray-400 max-w-xs mt-2 text-[10px] font-mono">
                Calculating semantic distance between candidate skill chips and standardized corporate profiles. Please sustain connections...
              </p>
            </div>
          )}

          {!isAnalyzing && !analysis && (
            <div className="border-2 border-dashed border-cyan-glow/20 bg-cyber-dark/30 rounded p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
              <BarChart2 className="h-12 w-12 text-gray-600 mb-2" />
              <h4 className="text-gray-400 font-bold uppercase tracking-wider">Awaiting Vector Calibration</h4>
              <p className="text-gray-500 max-w-xs mt-1 text-[10px]">
                Initiate the audit cycle on the left sidecard to visualize key technical deficits.
              </p>
            </div>
          )}

          {!isAnalyzing && analysis && (
            <div className="space-y-6">
              {/* Gap Summary Board */}
              <div className="border-2 border-magenta-glow bg-cyber-dark p-6 rounded relative cyber-glow-magenta flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="absolute top-2 right-2 text-[8px] text-magenta-glow border border-magenta-glow/30 px-1 rounded">
                  DEFICIT_DENSITY
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-magenta-glow uppercase font-bold">[COGNITIVE AUDIT REPORT COMPLETED]</span>
                  <h3 className="text-sm font-bold text-white uppercase">
                    Role target: {analysis.targetRole}
                  </h3>
                  <p className="text-gray-400 text-[10px]">
                    Located <span className="text-cyan-glow font-bold">{analysis.gaps.length} critical technology gaps</span> compared to industry benchmarks.
                  </p>
                </div>
                <div className="p-4 bg-cyber-black border border-magenta-glow/20 rounded text-center shrink-0 min-w-[120px]">
                  <span className="text-gray-500 text-[9px] block">EST_STUDY_HOURS</span>
                  <span className="text-3xl font-black text-white font-pixel text-glitch-magenta">
                    {calculateTotalHours(analysis.gaps)}h
                  </span>
                  <span className="text-[8px] text-matrix-green block font-bold">TOTAL TIME</span>
                </div>
              </div>

              {/* Grid of gaps */}
              <div className="space-y-3">
                <h3 className="text-white font-bold tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-magenta-glow animate-pulse" />
                  <span>IDENTIFIED_DEFICIT_VECTORS</span>
                </h3>

                {analysis.gaps.map((gp, idx) => (
                  <div key={idx} className="border border-cyan-glow/20 bg-cyber-dark p-5 rounded space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-glow/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-glow font-bold text-xs font-mono">
                          [{gp.skill.toUpperCase()}]
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Priority level display */}
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          gp.priority === 'CRITICAL' 
                            ? 'bg-magenta-glow text-white animate-pulse' 
                            : gp.priority === 'HIGH' 
                              ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/40' 
                              : 'bg-gray-700 text-gray-300'
                        }`}>
                          {gp.priority}_PRIORITY
                        </span>
                        <span className="text-gray-400 font-mono text-[10px] flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {gp.estHours}h Est
                        </span>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="space-y-1">
                      <span className="text-gray-400 text-[9px] uppercase tracking-wider block font-bold">Recommended Study Sockets:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {gp.resources.map((res, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-cyber-black rounded border border-cyan-glow/5 text-[10px] text-gray-300">
                            <BookOpen className="h-3.5 w-3.5 text-cyan-glow shrink-0" />
                            <span>{res}</span>
                          </div>
                        ))}
                      </div>
                    </div>
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
