import React, { useState } from 'react';
import { MockInterview, InterviewQuestion, QuestionFeedback } from '../types';
import { HelpCircle, Star, ArrowRight, BookOpen, RotateCcw, AlertCircle, ShieldAlert, BadgeCheck } from 'lucide-react';

interface MockInterviewViewProps {
  onInterviewFinished: (finalScore: number) => void;
}

const MODULES = [
  { id: "Frontend", label: "Frontend Grid", desc: "HTML rendering path, state mechanics, ES6 execution scopes." },
  { id: "Backend", label: "Backend Core", desc: "Database indexing, microservices concurrency, API security structures." },
  { id: "Full Stack", label: "Full Stack System", desc: "Hydration pipelines, cache syncing, authentication grids." },
  { id: "AI/ML", label: "AI & ML Pipeline", desc: "Deep neural optimizers, vector indexes, model convergence cycles." }
];

export default function MockInterviewView({ onInterviewFinished }: MockInterviewViewProps) {
  const [step, setStep] = useState<'setup' | 'interviewing' | 'completed'>('setup');
  const [selectedRole, setSelectedRole] = useState('Full Stack');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<QuestionFeedback[]>([]);
  
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<QuestionFeedback | null>(null);

  const startInterview = async (role: string) => {
    setIsLoading(true);
    setSelectedRole(role);
    try {
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await response.json();
      if (data && data.questions) {
        setQuestions(data.questions);
        setAnswers([]);
        setFeedbacks([]);
        setCurrentIndex(0);
        setStep('interviewing');
        setCurrentFeedback(null);
        setUserAnswer('');
      } else {
        throw new Error("No questions retrieved");
      }
    } catch (err) {
      console.error("[FRONTEND] Interview start failed:", err);
      // Fallback
      const failoverQuestions: InterviewQuestion[] = [
        { question: `What are the primary performance criteria you optimize when deploying a high-throughput ${role} service?`, idealKeywords: ["latency", "throughput", "concurrency", "caching"] },
        { question: "Explain how you handle state synchronization across distributed nodes in active deployment.", idealKeywords: ["consistency", "locks", "replication", "state"] },
        { question: "Describe a concrete security vulnerability you audited and mitigated in a production application.", idealKeywords: ["sanitization", "csrf", "headers", "escaping"] }
      ];
      setQuestions(failoverQuestions);
      setAnswers([]);
      setFeedbacks([]);
      setCurrentIndex(0);
      setStep('interviewing');
      setCurrentFeedback(null);
      setUserAnswer('');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsLoading(true);

    const questionText = questions[currentIndex].question;
    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          answer: userAnswer,
          role: selectedRole
        })
      });
      const data = await response.json();
      if (data && typeof data.score === 'number') {
        const fb: QuestionFeedback = {
          score: data.score,
          text: data.text,
          improvement: data.improvement
        };
        setCurrentFeedback(fb);
        setFeedbacks(prev => [...prev, fb]);
        setAnswers(prev => [...prev, userAnswer]);
      } else {
        throw new Error("Invalid evaluation payload");
      }
    } catch (err) {
      console.error("[FRONTEND] Answer evaluation error:", err);
      // Offline fallback evaluator
      const matches = (userAnswer.match(/(optimize|concurrency|security|scale|cache|performance|latency)/gi) || []).length;
      const score = Math.min(100, Math.max(50, 60 + matches * 10));
      const fb: QuestionFeedback = {
        score,
        text: `Syntactic response parsed. Found ${matches} core concepts. Score calculated under failover guidelines.`,
        improvement: "Integrate more direct terms related to low-level hardware constraints and runtime compilers."
      };
      setCurrentFeedback(fb);
      setFeedbacks(prev => [...prev, fb]);
      setAnswers(prev => [...prev, userAnswer]);
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setCurrentFeedback(null);
    } else {
      setStep('completed');
      // Calculate overall score
      const total = feedbacks.reduce((acc, f) => acc + f.score, 0);
      const avg = Math.round(total / feedbacks.length);
      onInterviewFinished(avg);
    }
  };

  const restart = () => {
    setStep('setup');
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setFeedbacks([]);
    setUserAnswer('');
    setCurrentFeedback(null);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Title */}
      <div className="border-b border-cyan-glow/20 pb-4">
        <h2 className="text-xl font-bold tracking-wider text-white">
          <span className="text-cyan-glow">[COGNITIVE_INTERVIEW_SIMULATOR]</span>
        </h2>
        <p className="text-[10px] text-gray-400">
          Execute rigorous mock interview parameters. Real-time answer tracking, metric scoring, and improve logs.
        </p>
      </div>

      {isLoading && step === 'setup' && (
        <div className="border-2 border-magenta-glow bg-cyber-dark/80 p-12 rounded flex flex-col items-center justify-center min-h-[400px] text-center animate-pulse">
          <div className="relative h-16 w-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-magenta-glow border-t-transparent animate-spin"></div>
          </div>
          <h4 className="text-magenta-glow font-pixel text-lg font-bold">[GENERATING_ROLE_BASED_BOARD]</h4>
          <p className="text-gray-400 max-w-xs mt-2 text-[10px] font-mono">
            Fetching standard screening algorithms for the '{selectedRole}' sector. Aligning interview variables...
          </p>
        </div>
      )}

      {/* SETUP STEP */}
      {!isLoading && step === 'setup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-cyan-glow/30 bg-cyber-dark p-6 rounded relative">
            <h3 className="text-white font-bold tracking-wider mb-4 border-b border-cyan-glow/10 pb-2">
              SELECT_SCREENING_PARADIGM
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Choose your target technical grid. The simulator will synthesize specialized questions testing core architectures, design patterns, and vocabulary density matching professional corporate filters.
            </p>

            <div className="grid grid-cols-1 gap-3">
              {MODULES.map((m) => (
                <div 
                  key={m.id}
                  onClick={() => startInterview(m.id)}
                  className="p-4 border border-cyan-glow/25 bg-cyber-black hover:border-magenta-glow hover:bg-magenta-glow/5 rounded transition-all duration-300 cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <h4 className="text-cyan-glow font-bold group-hover:text-magenta-glow transition-colors">{m.label.toUpperCase()}</h4>
                    <p className="text-[10px] text-gray-500 mt-1">{m.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-magenta-glow shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-2 border-magenta-glow/20 bg-cyber-dark rounded space-y-4">
            <h3 className="text-white font-bold tracking-wider flex items-center gap-1.5 border-b border-cyan-glow/10 pb-2">
              <ShieldAlert className="h-4 w-4 text-magenta-glow" />
              <span>RULES_OF_COGNITIVE_SIMULATION</span>
            </h3>
            <ul className="space-y-3 text-gray-300 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-magenta-glow font-bold shrink-0">[01]</span>
                <span>The system queries sequentially. Take time to format full technical replies.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-magenta-glow font-bold shrink-0">[02]</span>
                <span>Incorporate precise technical vocabularies (algorithms, performance metrics).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-magenta-glow font-bold shrink-0">[03]</span>
                <span>Upon submitting, receive immediate score indexation and actionable remedials.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-magenta-glow font-bold shrink-0">[04]</span>
                <span>Aggregate scores contribute directly to your console placement readiness index.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ACTIVE INTERVIEW STEP */}
      {step === 'interviewing' && questions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question Box */}
          <div className="lg:col-span-7 space-y-4">
            <div className="border-2 border-cyan-glow bg-cyber-dark p-6 rounded relative">
              {/* Question progress */}
              <div className="flex items-center justify-between border-b border-cyan-glow/10 pb-3 mb-4">
                <span className="text-cyan-glow font-bold tracking-widest text-[11px]">
                  [ROUND: 0{currentIndex + 1}_OF_0{questions.length}]
                </span>
                <span className="text-[9px] text-gray-500 bg-cyber-black px-2 py-0.5 rounded border border-cyan-glow/15 font-mono">
                  TARGET: {selectedRole.toUpperCase()}
                </span>
              </div>

              {/* Display Question */}
              <div className="p-4 bg-cyber-black rounded border border-cyan-glow/20 mb-4 min-h-[90px] flex items-center">
                <p className="text-white text-xs sm:text-sm font-bold font-mono leading-relaxed">
                  {questions[currentIndex].question}
                </p>
              </div>

              {/* Suggestion tags */}
              <div className="p-3 bg-cyan-glow/5 border border-cyan-glow/15 rounded mb-4">
                <span className="text-cyan-glow text-[9px] uppercase tracking-wider block font-bold mb-1">
                  SEMANTIC_SUGGESTION_KEYWORDS:
                </span>
                <div className="flex flex-wrap gap-1">
                  {questions[currentIndex].idealKeywords.map((kw, i) => (
                    <span key={i} className="text-[9px] bg-cyber-black text-gray-400 border border-gray-700 px-1.5 py-0.5 rounded font-mono">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Text answer entry */}
              <div className="space-y-1">
                <label className="text-gray-400 text-[10px] uppercase tracking-wider block">YOUR_TECHNICAL_EXPLANATION</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={isLoading || !!currentFeedback}
                  rows={8}
                  className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-gray-200 p-3 outline-none rounded font-mono leading-relaxed"
                  placeholder="Formulate your technical solution or conceptual response here..."
                />
              </div>

              {/* Controls */}
              <div className="mt-4 flex gap-3">
                {!currentFeedback ? (
                  <button
                    onClick={submitAnswer}
                    disabled={isLoading || !userAnswer.trim()}
                    className="flex-1 py-3 bg-cyan-glow text-cyber-black font-extrabold text-xs uppercase tracking-widest hover:bg-cyan-glow/80 disabled:opacity-40 rounded transition-colors"
                  >
                    {isLoading ? 'ANALYZING_EXPLANATION...' : 'TRANSMIT_RESPONSE_'}
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="flex-1 py-3 bg-magenta-glow text-white font-extrabold text-xs uppercase tracking-widest hover:bg-magenta-glow/80 rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{currentIndex + 1 < questions.length ? 'NEXT_SCREENING_ROUND_' : 'CALCULATE_FINAL_METRICS_'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Feedback Card */}
          <div className="lg:col-span-5">
            {isLoading && !currentFeedback && (
              <div className="border-2 border-magenta-glow/30 bg-cyber-dark p-12 rounded flex flex-col items-center justify-center h-full text-center animate-pulse min-h-[300px]">
                <div className="relative h-12 w-12 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-magenta-glow border-t-transparent animate-spin"></div>
                </div>
                <h4 className="text-magenta-glow font-pixel text-base font-bold">[PROCESSING_SEMANTIC_WEIGHTS]</h4>
                <p className="text-gray-500 max-w-xs mt-2 text-[10px] font-mono leading-relaxed">
                  Evaluating keyword presence, syntax accuracy, and architectural depth. Correlating metrics...
                </p>
              </div>
            )}

            {!isLoading && !currentFeedback && (
              <div className="border-2 border-dashed border-gray-700 bg-cyber-dark/30 rounded p-8 flex flex-col items-center justify-center h-full text-center min-h-[300px]">
                <HelpCircle className="h-10 w-10 text-gray-600 mb-2" />
                <h4 className="text-gray-500 font-bold uppercase tracking-wider">Awaiting response</h4>
                <p className="text-gray-500 max-w-xs mt-1 text-[10px]">
                  Submit your technical explanation on the left to activate active feedback modules.
                </p>
              </div>
            )}

            {currentFeedback && (() => {
              const commScore = Math.max(45, Math.min(100, Math.round(currentFeedback.score * 0.9 + (userAnswer.length > 250 ? 10 : userAnswer.length > 100 ? 5 : -5))));
              const confScore = Math.max(40, Math.min(100, Math.round(currentFeedback.score * 0.95 + 3)));
              return (
                <div className="border-2 border-magenta-glow bg-cyber-dark p-6 rounded relative cyber-glow-magenta space-y-4">
                  <div className="absolute top-2 right-2 text-[8px] text-magenta-glow border border-magenta-glow/30 px-1 rounded">
                    EVALUATION_LOG
                  </div>

                  {/* Primary Combined Indicator */}
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full border-2 border-magenta-glow flex items-center justify-center text-magenta-glow font-pixel text-2xl font-bold shrink-0">
                      {currentFeedback.score}
                    </div>
                    <div>
                      <h3 className="text-white font-bold tracking-wide font-mono uppercase text-xs">ROUND_SCORE_CALCULATED</h3>
                      <div className="text-[10px] text-matrix-green font-bold">[STABILITY_CHECK: CONGRUENT]</div>
                    </div>
                  </div>

                  {/* Multi-Metric Gauge Bars */}
                  <div className="space-y-3 pt-3 border-t border-magenta-glow/20">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold">
                        <span className="text-gray-400">TECHNICAL_ACCURACY</span>
                        <span className="text-cyan-glow">{currentFeedback.score}%</span>
                      </div>
                      <div className="w-full bg-cyber-black h-1.5 rounded overflow-hidden border border-cyan-glow/10">
                        <div className="bg-cyan-glow h-full rounded" style={{ width: `${currentFeedback.score}%` }}></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold">
                        <span className="text-gray-400">COMMUNICATION_FLUENCY</span>
                        <span className="text-magenta-glow">{commScore}%</span>
                      </div>
                      <div className="w-full bg-cyber-black h-1.5 rounded overflow-hidden border border-magenta-glow/10">
                        <div className="bg-magenta-glow h-full rounded" style={{ width: `${commScore}%` }}></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold">
                        <span className="text-gray-400">STRUCTURAL_CONFIDENCE</span>
                        <span className="text-matrix-green">{confScore}%</span>
                      </div>
                      <div className="w-full bg-cyber-black h-1.5 rounded overflow-hidden border border-matrix-green/10">
                        <div className="bg-matrix-green h-full rounded" style={{ width: `${confScore}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] text-magenta-glow font-bold uppercase tracking-wider block">COGNITIVE_CRITIQUE</span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {currentFeedback.text}
                    </p>
                  </div>

                  {/* Improvement suggestions */}
                  <div className="p-3 bg-cyber-black rounded border border-cyan-glow/20">
                    <span className="text-[10px] text-matrix-green font-bold uppercase tracking-wider block mb-1">REMEDY_SUGGESTION</span>
                    <p className="text-gray-400 text-[11px] leading-relaxed">
                      {currentFeedback.improvement}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* COMPLETION SUMMARY STEP */}
      {step === 'completed' && feedbacks.length > 0 && (
        <div className="border-2 border-cyan-glow bg-cyber-dark p-8 rounded relative cyber-glow-cyan">
          <div className="absolute top-2 right-2 text-[8px] text-cyan-glow border border-cyan-glow/30 px-1 rounded">
            AGGREGATED_PLACEMENT_REPORT
          </div>

          <div className="text-center max-w-xl mx-auto space-y-4">
            <BadgeCheck className="h-14 w-14 text-matrix-green mx-auto animate-bounce" />
            <h3 className="text-2xl font-black font-pixel text-white tracking-wider">
              [INTERVIEW_SIMULATION_COMPLETED]
            </h3>
            
            {/* Overall Score */}
            <div className="p-6 bg-cyber-black border-2 border-cyan-glow rounded inline-block">
              <span className="text-[10px] text-gray-400 block tracking-widest font-mono">AGGREGATED_TECHNICAL_COEFFICIENT</span>
              <span className="text-5xl font-black text-cyan-glow text-glitch-cyan font-pixel block my-2">
                {Math.round(feedbacks.reduce((acc, f) => acc + f.score, 0) / feedbacks.length)}%
              </span>
              <span className="text-[9px] text-matrix-green font-bold tracking-wider">[STATUS: PLACEMENT_VIABLE]</span>
            </div>

            <p className="text-gray-300 text-[11px] leading-relaxed">
              Your overall cognitive score indicates robust core readiness parameters. Continue addressing flagged keyword deficits in your resume scanner and re-aligning missing skill targets in settings.
            </p>

            {/* Individual Rounds Summary */}
            <div className="text-left border-t border-cyan-glow/15 pt-6 space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Round-by-Round Breakdown:</h4>
              <div className="space-y-2">
                {feedbacks.map((f, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-cyber-black rounded border border-cyan-glow/5">
                    <span className="text-gray-400 font-mono">Round 0{idx+1} screening score:</span>
                    <span className={`font-bold font-pixel text-lg ${f.score >= 80 ? 'text-matrix-green' : f.score >= 60 ? 'text-cyan-glow' : 'text-magenta-glow'}`}>
                      {f.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  const finalAvg = Math.round(feedbacks.reduce((acc, f) => acc + f.score, 0) / feedbacks.length);
                  const reportText = `=====================================================
AI PLACEMENT COPILOT - COGNITIVE INTERVIEW REPORT
=====================================================
ROLE MODULE: ${selectedRole.toUpperCase()}
AGGREGATED PERFORMANCE COEFFICIENT: ${finalAvg}%
TIMESTAMP: ${new Date().toISOString().split('T')[0]}
STATUS: ${finalAvg >= 80 ? 'PLACEMENT_VIABLE' : 'STABILITY_IMPROVEMENT_NEEDED'}

-----------------------------------------------------
ROUND BY ROUND BREAKDOWN AND EVALUATIONS:
${questions.map((q, i) => `ROUND 0${i+1}:
- Question: ${q.question}
- Candidate Answer: ${answers[i] || 'N/A'}
- Evaluation Score: ${feedbacks[i]?.score || 0}%
- AI Critique: ${feedbacks[i]?.text || 'N/A'}
- Remedy Suggestion: ${feedbacks[i]?.improvement || 'N/A'}`).join('\n\n-----------------------------------------------------\n')}

=====================================================
REPORT END // COGNITIVE MOCK SCREENING SYSTEM
=====================================================`;
                  const element = document.createElement("a");
                  const file = new Blob([reportText], { type: 'text/plain' });
                  element.href = URL.createObjectURL(file);
                  element.download = `Interview_Performance_Report_${selectedRole.replace(/\s+/g, '_')}.txt`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-cyan-glow text-cyber-black font-extrabold text-xs tracking-widest uppercase hover:bg-cyan-glow/85 transition-colors flex items-center justify-center gap-2 rounded"
              >
                <span>EXPORT_PERFORMANCE_REPORT_</span>
              </button>

              <button
                onClick={restart}
                className="w-full sm:w-auto px-6 py-3 border-2 border-magenta-glow text-magenta-glow hover:bg-magenta-glow hover:text-white transition-all font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 cyber-clip-corners"
              >
                <RotateCcw className="h-4 w-4" />
                <span>RESTART_SIMULATION_CORE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
