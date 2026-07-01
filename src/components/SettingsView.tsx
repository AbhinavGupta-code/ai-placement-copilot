import React, { useState } from 'react';
import { UserProfile } from '../types';
import { TARGET_ROLES } from '../data';
import { Settings, Save, AlertCircle, Sparkles, Moon, Sun, ShieldCheck } from 'lucide-react';

interface SettingsViewProps {
  userProfile: UserProfile;
  onSave: (newProfile: UserProfile) => void;
  isLight: boolean;
  onThemeToggle: () => void;
}

export default function SettingsView({
  userProfile,
  onSave,
  isLight,
  onThemeToggle
}: SettingsViewProps) {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [academicRole, setAcademicRole] = useState(userProfile.role);
  const [targetRole, setTargetRole] = useState(userProfile.targetRole);
  const [experienceLevel, setExperienceLevel] = useState(userProfile.experienceLevel);
  const [timeAvailable, setTimeAvailable] = useState(userProfile.timeAvailable);
  const [skillsCsv, setSkillsCsv] = useState(userProfile.currentSkills.join(', '));
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [diagLogs, setDiagLogs] = useState<string[]>([]);
  const [isDiagRunning, setIsDiagRunning] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    const skillList = skillsCsv
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const updated: UserProfile = {
      name,
      email,
      role: academicRole,
      targetRole,
      experienceLevel,
      timeAvailable,
      currentSkills: skillList
    };

    onSave(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const executeSystemDiagnostics = () => {
    setIsDiagRunning(true);
    setDiagLogs([]);
    
    const messages = [
      "[SYS] LOADING CORE TELEMETRY PACKSETS...",
      "[SYS] CONNECTING TO COGNITIVE HOST: LOCAL_ROUTERS",
      `[SYS] ANALYZING CANDIDATE: ${name.toUpperCase()} (ID: AX_9901)`,
      `[SYS] TARGET ROLE REGISTERED: ${targetRole.toUpperCase()}`,
      `[SYS] COMPILER SKILLS BUFFER: ${skillsCsv.length} CHIPS INITIALIZED`,
      "[SYS] CHECKING THEME PARADIGMS... OK",
      "[SYS] COMPILING SHADERS FOR GLITCH ART CANVAS... OK",
      "[SYS] DIAGNOSTIC LOGGING_SUCCESSFUL: SYS_STABLE [NO ANOMALIES FOUND]"
    ];

    messages.forEach((msg, idx) => {
      setTimeout(() => {
        setDiagLogs(prev => [...prev, msg]);
        if (idx === messages.length - 1) {
          setIsDiagRunning(false);
        }
      }, (idx + 1) * 400);
    });
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Title */}
      <div className="border-b border-cyan-glow/20 pb-4">
        <h2 className="text-xl font-bold tracking-wider text-white">
          <span className="text-cyan-glow">[SYS_CONSOLE_SETTINGS]</span>
        </h2>
        <p className="text-[10px] text-gray-400">
          Calibrate system variables, customize your profile credentials, and configure visual styles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-8">
          <div className="border-2 border-cyan-glow/30 bg-cyber-dark p-6 rounded relative">
            <h3 className="text-white font-bold tracking-wider mb-4 border-b border-cyan-glow/10 pb-2 flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-cyan-glow" />
              <span>VARIABLE_CALIBRATION_FORM</span>
            </h3>

            {saveSuccess && (
              <div className="mb-4 p-3 border-l-2 border-matrix-green bg-matrix-green/10 text-matrix-green flex items-start gap-2 rounded">
                <Sparkles className="h-4 w-4 shrink-0 mt-0.5 animate-spin" />
                <span>[SYS_VECTORS_RECALIBRATED_SUCCESSFULLY] System indices updated.</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-gray-400 text-[10px] uppercase tracking-wider block">CANDIDATE_NAME</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white px-3 py-2 outline-none rounded"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-gray-400 text-[10px] uppercase tracking-wider block">EMAIL_CHANNEL</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white px-3 py-2 outline-none rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Academic Classification */}
                <div className="space-y-1">
                  <label className="text-gray-400 text-[10px] uppercase tracking-wider block">ACADEMIC_CLASSIFICATION</label>
                  <select
                    value={academicRole}
                    onChange={(e) => setAcademicRole(e.target.value)}
                    className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white px-2 py-2 outline-none rounded"
                  >
                    <option value="College Student">College Student</option>
                    <option value="Diploma Student">Diploma Student</option>
                    <option value="Fresh Graduate">Fresh Graduate</option>
                    <option value="Placement Candidate">Placement Candidate</option>
                  </select>
                </div>

                {/* Target role */}
                <div className="space-y-1">
                  <label className="text-gray-400 text-[10px] uppercase tracking-wider block">TARGET_CAREER_ROLE</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white px-2 py-2 outline-none rounded"
                  >
                    {TARGET_ROLES.map((r, i) => (
                      <option key={i} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Exp level */}
                <div className="space-y-1">
                  <label className="text-gray-400 text-[10px] uppercase tracking-wider block">COGNITIVE_EXPERIENCE_LEVEL</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white px-2 py-2 outline-none rounded"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Entry-Level">Entry-Level (0-1 yrs)</option>
                    <option value="Intermediate">Intermediate (2+ yrs)</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-gray-400 text-[10px] uppercase tracking-wider block">TRAINING_COMMITMENT_DURATION</label>
                  <select
                    value={timeAvailable}
                    onChange={(e) => setTimeAvailable(e.target.value)}
                    className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white px-2 py-2 outline-none rounded"
                  >
                    <option value="4 Weeks">4 Weeks</option>
                    <option value="8 Weeks">8 Weeks</option>
                    <option value="12 Weeks">12 Weeks</option>
                  </select>
                </div>
              </div>

              {/* Skills Area */}
              <div className="space-y-1">
                <label className="text-gray-400 text-[10px] uppercase tracking-wider block">
                  COMPILE_ACTIVE_SKILLS (COMMA_SEPARATED)
                </label>
                <textarea
                  value={skillsCsv}
                  onChange={(e) => setSkillsCsv(e.target.value)}
                  rows={4}
                  className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white p-2 outline-none rounded leading-relaxed"
                  placeholder="React, CSS, JavaScript, Python"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-cyan-glow text-cyber-black font-extrabold text-[11px] tracking-widest uppercase hover:bg-cyan-glow/80 rounded transition-colors cyber-clip-corners flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>SAVE_PROFILE_VARIABLES_</span>
              </button>
            </form>
          </div>
        </div>

        {/* Theme Settings & System Diagnostics */}
        <div className="lg:col-span-4 space-y-4">
          {/* Visual Theme Selection */}
          <div className="border-2 border-magenta-glow bg-cyber-dark p-5 rounded relative">
            <h3 className="text-white font-bold tracking-wider mb-4 border-b border-magenta-glow/10 pb-2">
              COGNITIVE_THEME_SELECT
            </h3>
            
            <p className="text-gray-400 text-[10px] mb-4 leading-relaxed">
              Switch themes between deep terminal dark and high-contrast glitch light:
            </p>

            <button
              onClick={onThemeToggle}
              className="w-full py-3 border-2 border-magenta-glow text-magenta-glow font-bold hover:bg-magenta-glow/10 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span>ACTIVATE_{isLight ? 'DARK_CYBERPUNK' : 'GLITCH_LIGHT_'}</span>
            </button>
          </div>

          {/* Diagnostics terminal emulator */}
          <div className="border border-cyan-glow/30 bg-cyber-dark p-5 rounded space-y-4">
            <h3 className="text-white font-bold tracking-wider border-b border-cyan-glow/10 pb-2">
              SYS_DIAGNOSTIC_UTILITY
            </h3>
            <p className="text-gray-400 text-[10px] leading-relaxed">
              Run local network compliance tests to verify compiler matrices and telemetry alignments:
            </p>

            <button
              onClick={executeSystemDiagnostics}
              disabled={isDiagRunning}
              className="w-full py-2 bg-cyber-black border border-cyan-glow text-cyan-glow font-mono uppercase tracking-wider hover:bg-cyan-glow/10 disabled:opacity-40 transition-colors text-[10px]"
            >
              {isDiagRunning ? 'RUNNING_DIAGNOSTICS...' : 'RUN_CORE_DIAGNOSTICS'}
            </button>

            {diagLogs.length > 0 && (
              <div className="p-3 bg-cyber-black border border-cyan-glow/10 rounded font-mono text-[9px] text-matrix-green leading-relaxed space-y-1 overflow-y-auto max-h-[140px]">
                {diagLogs.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
