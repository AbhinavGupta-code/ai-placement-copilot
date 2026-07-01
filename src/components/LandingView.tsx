import React, { useState } from 'react';
import { FAQS, TESTIMONIALS } from '../data';
import { ArrowRight, ShieldCheck, Zap, Bot, Target, BookOpen, Layers } from 'lucide-react';

interface LandingViewProps {
  onStart: () => void;
  onNavigate: (page: string) => void;
}

export default function LandingView({ onStart, onNavigate }: LandingViewProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = [
    { value: "12,840+", label: "DEMO_COMPILER_RUNS", glow: "text-cyan-glow" },
    { value: "8,421+", label: "SIMULATED_INTERVIEW_SCANS", glow: "text-magenta-glow" },
    { value: "5,102+", label: "ROADMAPS_COMPILED", glow: "text-matrix-green" },
  ];

  const features = [
    {
      icon: <Layers className="h-6 w-6 text-cyan-glow" />,
      title: "AI Resume & ATS Scanner",
      desc: "Simulate exact ATS scoring filters. Re-align resume keywords, vocabulary, and formatting to beat corporate parsing algorithms."
    },
    {
      icon: <Bot className="h-6 w-6 text-magenta-glow" />,
      title: "AI Mock Interview Simulation",
      desc: "Role-specific interview simulation. Receives answers line by line, calculating accurate performance scores, keyword logs, and custom improvements."
    },
    {
      icon: <Target className="h-6 w-6 text-matrix-green" />,
      title: "AI Skill Gap Analysis",
      desc: "Compares current skills against any target career role, identifying critical deficits, priorities, and exact resource grids."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-cyan-glow" />,
      title: "Personalized Learning Roadmap",
      desc: "Generate highly practical, weekly plans detailing day-by-day objectives and tailored developer capstone project specs."
    }
  ];

  return (
    <div className="relative w-full overflow-hidden font-mono text-xs">
      {/* Dynamic Scanlines Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b1e2a_1px,transparent_1px),linear-gradient(to_bottom,#1b1e2a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 md:px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Hacker Ticker */}
        <div className="mb-6 inline-flex items-center gap-2 border-2 border-magenta-glow/30 bg-magenta-glow/5 px-4 py-1.5 rounded-full text-[11px] text-magenta-glow tracking-widest animate-pulse">
          <Zap className="h-3.5 w-3.5" />
          <span>SYS_PROMPT: PLACEMENT CRITICAL PROTOCOL INITIALIZED</span>
        </div>

        {/* Big Glitch Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none select-none max-w-4xl">
          OPTIMIZE YOUR <br className="hidden sm:inline" />
          <span className="text-cyan-glow text-glitch-cyan font-pixel block sm:inline">PLACEMENT POTENTIAL</span>
        </h1>

        <p className="mt-6 text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed">
          Unleash the **COGNITIVE CAREER ADVISOR**. Execute rigorous resume ATS matrix scans, practice real-time generative interview rounds, and synthesize personalized learning roadmaps.
        </p>

        {/* Glowing Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto relative px-8 py-4 bg-cyan-glow text-cyber-black font-extrabold text-sm tracking-widest uppercase hover:bg-cyan-glow/80 transition-all duration-300 cyber-clip-corners flex items-center justify-center gap-2 cyber-glow-cyan"
          >
            <span>INITIALIZE COGNITIVE GRID</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="#features"
            className="w-full sm:w-auto text-center px-8 py-4 border-2 border-magenta-glow text-magenta-glow font-bold text-sm tracking-widest uppercase hover:bg-magenta-glow/10 transition-colors cyber-clip-corners"
          >
            VIEW_CAPABILITIES_
          </a>
        </div>

        {/* Stats Grid Ticker */}
        <div className="mt-20 w-full border-2 border-cyan-glow/20 bg-cyber-dark/80 p-6 rounded-lg relative">
          <div className="absolute -top-3 left-4 bg-cyber-black border border-cyan-glow/30 px-2.5 py-1 rounded text-[8px] text-cyan-glow font-bold tracking-widest uppercase">
            [SYS_DEMO_BENCHMARK_TELEMETRY]
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((st, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-cyan-glow/10 last:border-0">
                <span className={`text-4xl font-extrabold tracking-tight font-pixel ${st.glow}`}>{st.value}</span>
                <span className="text-[10px] text-gray-400 mt-2 tracking-widest font-mono">{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Section */}
      <section id="features" className="py-20 px-4 md:px-6 bg-cyber-black border-t-2 border-magenta-glow relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-magenta-glow text-glitch-magenta font-pixel">
              [SYSTEM_CAPABILITIES]
            </h2>
            <p className="text-gray-400 mt-2 text-xs md:text-sm max-w-xl mx-auto">
              A comprehensive career optimization pipeline powered by the Gemini 3.5 generative matrix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((ft, idx) => (
              <div 
                key={idx} 
                className="relative p-6 border-2 border-cyan-glow/20 bg-cyber-dark hover:border-cyan-glow/50 transition-all duration-300 rounded cyber-clip-panel group"
              >
                <div className="absolute top-0 right-0 p-2 text-cyan-glow/30 group-hover:text-cyan-glow transition-colors">
                  {ft.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2 tracking-wider">
                  0{idx+1} // {ft.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-xs">
                  {ft.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-cyan-glow text-glitch-cyan font-pixel">
            [SAMPLE_SYSTEM_OUTPUTS]
          </h2>
          <p className="text-gray-400 mt-2 max-w-md mx-auto">
            Live previews and sample telemetry logs produced by our Gemini AI alignment pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="p-6 border-2 border-magenta-glow/20 bg-cyber-dark/50 rounded flex flex-col justify-between">
              <p className="text-gray-300 italic leading-relaxed text-xs">
                "{t.quote}"
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-magenta-glow/10 pt-4">
                <span className="font-bold text-cyan-glow font-mono">{t.name}</span>
                <span className="text-[10px] text-gray-500 font-mono">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / Demo Premium */}
      <section className="py-20 px-4 md:px-6 bg-cyber-black border-t-2 border-cyan-glow">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-magenta-glow text-glitch-magenta font-pixel">
              [HACKHAZARDS_GRID_DEPLOYMENT]
            </h2>
            <p className="text-gray-400 mt-2 max-w-md mx-auto">
              Evaluation portal configured. The entire AI Placement Copilot is fully unlocked under HackHazards system parameters.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Single Fully Unlocked Tier */}
            <div className="border-2 border-magenta-glow p-8 bg-cyber-dark rounded relative cyber-glow-magenta text-center">
              <div className="absolute top-4 right-4 bg-matrix-green text-cyber-black text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest animate-pulse">
                SYS_UNLOCKED
              </div>
              
              <span className="text-[10px] text-magenta-glow border border-magenta-glow px-2 py-0.5 rounded uppercase tracking-widest font-mono">
                HACKATHON_DEMO_NODE
              </span>
              <h3 className="text-3xl font-bold text-white mt-4 font-pixel tracking-wider">
                COMPREHENSIVE_FREE_ACCESS
              </h3>
              <p className="text-gray-300 mt-2 text-xs max-w-md mx-auto">
                No token constraints, paywalls, or simulated limits. All Gemini 3.5 live pipelines, CHIP advising models, and roadmap generators are fully active for recruiters and judges.
              </p>
              
              <div className="my-6 border-y border-magenta-glow/10 py-4 inline-block px-12">
                <span className="text-4xl font-black text-matrix-green font-pixel">FREE</span>
                <span className="text-gray-400 font-mono text-xs"> / HACKHAZARDS EV_CYCLE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-gray-300 max-w-lg mx-auto mb-8">
                <div className="flex items-start gap-2 text-xs">
                  <ShieldCheck className="h-4 w-4 text-matrix-green shrink-0 mt-0.5" />
                  <span>Unlimited Gemini ATS Resume Scans</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <ShieldCheck className="h-4 w-4 text-matrix-green shrink-0 mt-0.5" />
                  <span>Active Live Advisor CHIP Mentor Chat</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <ShieldCheck className="h-4 w-4 text-matrix-green shrink-0 mt-0.5" />
                  <span>Day-by-Day Customized Study Roadmaps</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <ShieldCheck className="h-4 w-4 text-matrix-green shrink-0 mt-0.5" />
                  <span>Rounds of Role-Specific Mock Interviews</span>
                </div>
              </div>

              <button 
                onClick={onStart}
                className="w-full sm:w-auto px-12 py-4 bg-magenta-glow text-white font-black hover:bg-magenta-glow/80 transition-all uppercase tracking-widest text-[11px] cyber-clip-corners"
              >
                INITIALIZE_UNRESTRICTED_NODE_
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Built This */}
      <section className="py-20 px-4 md:px-6 bg-cyber-dark/50 border-t border-magenta-glow/30">
        <div className="max-w-4xl mx-auto border border-dashed border-cyan-glow/40 p-8 rounded bg-cyber-black/40">
          <span className="text-[10px] text-magenta-glow font-mono uppercase tracking-widest block mb-2">// STATEMENT_OF_ORIGIN_</span>
          <h2 className="text-2xl font-black text-white font-pixel mb-4 text-left tracking-wider">[WHY_WE_BUILT_THIS]</h2>
          <div className="text-gray-300 space-y-4 text-xs leading-relaxed font-sans">
            <p>
              Millions of students and fresh graduates struggle to secure technology placements because critical guidance is scattered across fragmented, opaque networks. Resume parsing systems (ATS) operate behind closed doors, professional mentoring is often locked behind high subscription paywalls, and mock interview practice is rare and static.
            </p>
            <p>
              <strong className="text-cyan-glow font-mono text-[11px]">AI Placement Copilot</strong> was designed to bridge this divide by bringing robust, real-time resume analysis, technical skill gap audits, personalized learning paths, and high-fidelity mock interview simulation together into a single, cohesive terminal. Powered by Gemini, it gives candidates direct access to the self-optimization tools they need to prove their readiness.
            </p>
          </div>
        </div>
      </section>

      {/* Accordion FAQ */}
      <section className="py-20 px-4 md:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-cyan-glow text-glitch-cyan font-pixel">
            [FREQUENT_QUERIES]
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border-2 border-cyan-glow/20 bg-cyber-dark/60 rounded">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-5 font-bold text-white hover:text-cyan-glow transition-colors flex items-center justify-between text-xs sm:text-sm"
              >
                <span>{faq.q}</span>
                <span className="text-cyan-glow text-base ml-2">{openFaq === idx ? '[-]' : '[+]'}</span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-gray-400 text-xs leading-relaxed border-t border-cyan-glow/10">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
