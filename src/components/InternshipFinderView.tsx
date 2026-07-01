import React, { useState } from 'react';
import { MOCK_INTERNSHIPS } from '../data';
import { UserProfile } from '../types';
import { Search, MapPin, Check, X, ShieldAlert, Sparkles, Send } from 'lucide-react';

interface InternshipFinderViewProps {
  userProfile: UserProfile;
}

export default function InternshipFinderView({ userProfile }: InternshipFinderViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  // Function to filter internships
  const filteredInternships = MOCK_INTERNSHIPS.filter(int => 
    int.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    int.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApply = (id: string) => {
    if (appliedIds.includes(id)) return;
    setAppliedIds(prev => [...prev, id]);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Page Title */}
      <div className="border-b border-cyan-glow/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-white">
            <span className="text-cyan-glow">[INTERNSHIP_PROCUREMENT_GRID]</span>
          </h2>
          <p className="text-[10px] text-gray-400">
            Compare active placement nodes and evaluate matches using current compiled technology matrices.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company or position..."
            className="bg-cyber-dark border border-cyan-glow/30 focus:border-cyan-glow text-white pl-10 pr-4 py-2 outline-none rounded w-full sm:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInternships.map((int) => {
          const isApplied = appliedIds.includes(int.id);

          return (
            <div 
              key={int.id} 
              className={`border-2 p-6 bg-cyber-dark/80 rounded relative flex flex-col justify-between ${
                isApplied 
                  ? 'border-matrix-green/30 cyber-glow-green' 
                  : 'border-cyan-glow/20 hover:border-cyan-glow/50 transition-colors'
              }`}
            >
              <div className="absolute top-2 right-2 text-[8px] text-gray-500 font-mono">
                NODE_REF: {int.id}
              </div>

              <div className="space-y-4">
                {/* Title & Company */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-cyan-glow font-bold uppercase tracking-widest bg-cyan-glow/5 border border-cyan-glow/10 px-1.5 py-0.5 rounded">
                      {int.company}
                    </span>
                    <span className="text-gray-500 flex items-center gap-0.5 text-[9px]">
                      <MapPin className="h-3 w-3" />
                      {int.location}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-sm tracking-wide mt-2">
                    {int.title.toUpperCase()}
                  </h3>
                </div>

                {/* Match score bar */}
                <div className="p-3 bg-cyber-black rounded border border-cyan-glow/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SKILLS_MATCH_COEFFICIENT:</span>
                    <span className={`font-pixel font-bold text-base ${int.matchScore >= 80 ? 'text-matrix-green' : 'text-cyan-glow'}`}>
                      {int.matchScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${int.matchScore >= 80 ? 'bg-matrix-green' : 'bg-cyan-glow'}`} 
                      style={{ width: `${int.matchScore}%` }}
                    />
                  </div>
                </div>

                {/* Skills comparison checklist */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">COMPILER_CHECKLIST:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {int.skillsRequired.map((sk, idx) => {
                      const hasSkill = userProfile.currentSkills.some(s => s.toLowerCase() === sk.toLowerCase());
                      return (
                        <span 
                          key={idx} 
                          className={`px-2 py-0.5 rounded text-[9px] font-mono flex items-center gap-1 ${
                            hasSkill 
                              ? 'bg-matrix-green/10 border border-matrix-green/30 text-matrix-green' 
                              : 'bg-magenta-glow/10 border border-magenta-glow/30 text-magenta-glow'
                          }`}
                        >
                          {hasSkill ? <Check className="h-2.5 w-2.5 shrink-0" /> : <X className="h-2.5 w-2.5 shrink-0" />}
                          {sk}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Application tips */}
                <div className="p-3 border-l-2 border-magenta-glow/30 bg-magenta-glow/5 rounded space-y-1">
                  <span className="text-[9px] text-magenta-glow font-bold uppercase tracking-widest flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" />
                    <span>TACTICAL_APPLICATION_TIPS:</span>
                  </span>
                  <ul className="space-y-1 text-gray-300 text-[10px]">
                    {int.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-magenta-glow font-bold">»</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Submit application controls */}
              <div className="mt-6 border-t border-cyan-glow/10 pt-4">
                <button
                  onClick={() => handleApply(int.id)}
                  disabled={isApplied}
                  className={`w-full py-2.5 font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 text-[11px] ${
                    isApplied 
                      ? 'bg-matrix-green/10 text-matrix-green border-2 border-matrix-green cursor-default' 
                      : 'bg-cyan-glow text-cyber-black hover:bg-cyan-glow/80 cyber-clip-corners'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>APPLICATION_RAN_SUCCESSFULLY</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>EXECUTE_DIRECT_APPLY_</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
