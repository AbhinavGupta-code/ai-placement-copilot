import React, { useState } from 'react';
import { Shield, Key, Mail, User, AlertCircle, Sparkles } from 'lucide-react';
import { TARGET_ROLES } from '../data';
import { UserProfile } from '../types';

interface AuthViewProps {
  onAuthSuccess: (profile: UserProfile) => void;
  onBack: () => void;
}

export default function AuthView({ onAuthSuccess, onBack }: AuthViewProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('candidate@neurogrid.net');
  const [name, setName] = useState('Candidate_Alpha');
  const [password, setPassword] = useState('password123');
  
  // Custom sign-up configs to initialize the profile
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState('Entry-Level');
  const [timeAvailable, setTimeAvailable] = useState('4 Weeks');
  const [skillsCsv, setSkillsCsv] = useState('HTML, CSS, Basic JavaScript, Python, SQL');

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (mode === 'login') {
      if (!email || !password) {
        setError('CRITICAL_ERROR: Missing login credentials');
        return;
      }
      // Successful simulated login
      const initialProfile: UserProfile = {
        name: email.split('@')[0] || 'User_99',
        email,
        role: 'Diploma Student',
        targetRole: 'Full Stack Developer',
        experienceLevel: 'Entry-Level',
        timeAvailable: '4 Weeks',
        currentSkills: ['HTML', 'CSS', 'Basic JavaScript', 'Python', 'SQL']
      };
      onAuthSuccess(initialProfile);
    } else if (mode === 'signup') {
      if (!email || !name || !password) {
        setError('CRITICAL_ERROR: Required signup parameters undefined');
        return;
      }
      const skillArray = skillsCsv
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const customProfile: UserProfile = {
        name,
        email,
        role: 'Student Candidate',
        targetRole,
        experienceLevel,
        timeAvailable,
        currentSkills: skillArray
      };
      onAuthSuccess(customProfile);
    } else {
      // Forgot Password
      if (!email) {
        setError('CRITICAL_ERROR: Email channel not defined');
        return;
      }
      setMessage('[RECOVERY TRANSMISSION: DISPATCHED] Check your standard inbox link.');
    }
  };

  const handleGoogleSimulate = () => {
    const googleProfile: UserProfile = {
      name: 'Google_Candidate',
      email: 'google@gmail.com',
      role: 'Internship Candidate',
      targetRole: 'AI/ML Engineer',
      experienceLevel: 'Entry-Level',
      timeAvailable: '8 Weeks',
      currentSkills: ['Python', 'SQL', 'Linear Algebra', 'Git']
    };
    onAuthSuccess(googleProfile);
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 font-mono text-xs">
      <div className="border-2 border-cyan-glow bg-cyber-dark/95 p-6 rounded relative cyber-glow-cyan">
        <div className="absolute -top-3 left-4 bg-cyber-black border-2 border-cyan-glow px-2 py-0.5 text-[10px] text-cyan-glow font-bold uppercase tracking-widest">
          MAINFRAME_ACCESS_NODE
        </div>

        {/* Form Title */}
        <div className="text-center mb-6">
          <Shield className="h-10 w-10 text-magenta-glow mx-auto mb-2 animate-pulse" />
          <h2 className="text-xl font-bold tracking-wider text-white">
            {mode === 'login' && 'INITIALIZE_SESSION'}
            {mode === 'signup' && 'CREATE_CREDENTIAL_NODE'}
            {mode === 'forgot' && 'CREDENTIAL_RECOVERY'}
          </h2>
          <p className="text-[10px] text-gray-400 mt-1">
            {mode === 'login' && 'Verify cryptographic access keys.'}
            {mode === 'signup' && 'Sync career specifications to initialize system copilot.'}
            {mode === 'forgot' && 'Re-route validation beams.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 border-l-2 border-magenta-glow bg-magenta-glow/10 text-magenta-glow flex items-start gap-2 rounded">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="font-mono text-[11px]">{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 border-l-2 border-matrix-green bg-matrix-green/10 text-matrix-green flex items-start gap-2 rounded">
            <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="font-mono text-[11px]">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block">CANDIDATE_NAME</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white pl-10 pr-3 py-2 outline-none rounded"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-gray-400 text-[10px] uppercase tracking-wider block">EMAIL_CHANNEL</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@neurogrid.net"
                className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white pl-10 pr-3 py-2 outline-none rounded"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1">
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block">ACCESS_KEY (PASSWORD)</label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white pl-10 pr-3 py-2 outline-none rounded"
                />
              </div>
            </div>
          )}

          {/* Custom profile inputs for signup */}
          {mode === 'signup' && (
            <div className="p-3 border border-magenta-glow/20 bg-magenta-glow/5 rounded space-y-3">
              <div className="text-[10px] text-magenta-glow font-bold uppercase tracking-widest border-b border-magenta-glow/10 pb-1 mb-2">
                COPILOT_INITIALIZATION_VECTORS
              </div>
              
              <div className="space-y-1">
                <label className="text-gray-400 text-[9px] uppercase tracking-wider block">TARGET_CAREER_ROLE</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-cyber-black border border-magenta-glow/30 text-white px-2 py-1 outline-none rounded text-xs font-mono"
                >
                  {TARGET_ROLES.map((r, i) => (
                    <option key={i} value={r} className="bg-cyber-dark text-white">{r}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-gray-400 text-[9px] uppercase tracking-wider block">EXPERIENCE_LEVEL</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-cyber-black border border-magenta-glow/30 text-white px-2 py-1 outline-none rounded text-xs font-mono"
                  >
                    <option value="Beginner" className="bg-cyber-dark text-white">Beginner</option>
                    <option value="Entry-Level" className="bg-cyber-dark text-white">Entry-Level (0-1 yrs)</option>
                    <option value="Intermediate" className="bg-cyber-dark text-white">Intermediate (2+ yrs)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 text-[9px] uppercase tracking-wider block">TIME_COMMITMENT</label>
                  <select
                    value={timeAvailable}
                    onChange={(e) => setTimeAvailable(e.target.value)}
                    className="w-full bg-cyber-black border border-magenta-glow/30 text-white px-2 py-1 outline-none rounded text-xs font-mono"
                  >
                    <option value="4 Weeks" className="bg-cyber-dark text-white">4 Weeks</option>
                    <option value="8 Weeks" className="bg-cyber-dark text-white">8 Weeks</option>
                    <option value="12 Weeks" className="bg-cyber-dark text-white">12 Weeks</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 text-[9px] uppercase tracking-wider block">CURRENT_SKILLS (COMMA_SEPARATED)</label>
                <input
                  type="text"
                  value={skillsCsv}
                  onChange={(e) => setSkillsCsv(e.target.value)}
                  placeholder="HTML, CSS, JavaScript"
                  className="w-full bg-cyber-black border border-magenta-glow/30 text-white px-2 py-1.5 outline-none rounded text-xs font-mono"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-magenta-glow text-white font-extrabold tracking-widest uppercase hover:bg-magenta-glow/85 transition-colors cyber-clip-corners"
          >
            {mode === 'login' && 'EXECUTE_LOGIN_'}
            {mode === 'signup' && 'INITIALIZE_COPILOT_'}
            {mode === 'forgot' && 'TRANSMIT_RECOVERY_SIGNAL_'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="absolute w-full h-[1px] bg-cyan-glow/20"></div>
          <span className="relative bg-cyber-dark px-2 text-[9px] text-gray-500 font-mono">OR_SECURE_AUTH</span>
        </div>

        {/* Google Authentication simulation */}
        <button
          onClick={handleGoogleSimulate}
          className="w-full py-2 border-2 border-cyan-glow text-cyan-glow font-bold hover:bg-cyan-glow/10 transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>CONNECT_VIA_GOOGLE_SECURE</span>
        </button>

        {/* Links to toggle mode */}
        <div className="mt-5 text-center space-y-2 border-t border-cyan-glow/15 pt-4 text-gray-400">
          {mode === 'login' && (
            <>
              <div>
                First terminal sync?{' '}
                <button onClick={() => setMode('signup')} className="text-cyan-glow hover:underline font-bold">
                  Create Account Protocol
                </button>
              </div>
              <div>
                <button onClick={() => setMode('forgot')} className="text-magenta-glow hover:underline">
                  Keys misplaced? Recover code
                </button>
              </div>
            </>
          )}

          {mode === 'signup' && (
            <div>
              Already verified?{' '}
              <button onClick={() => setMode('login')} className="text-cyan-glow hover:underline font-bold">
                Deploy existing session
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div>
              <button onClick={() => setMode('login')} className="text-cyan-glow hover:underline font-bold">
                Return to mainframe sign-in
              </button>
            </div>
          )}

          <div>
            <button onClick={onBack} className="text-gray-500 hover:text-white mt-1 underline">
              Return to Landing Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
