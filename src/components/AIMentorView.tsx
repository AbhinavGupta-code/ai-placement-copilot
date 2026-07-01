import React, { useState, useRef, useEffect } from 'react';
import { Message, UserProfile } from '../types';
import { Send, Bot, User, Terminal, HelpCircle, ShieldAlert } from 'lucide-react';

interface AIMentorViewProps {
  userProfile: UserProfile;
}

export default function AIMentorView({ userProfile }: AIMentorViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-01',
      sender: 'ai',
      text: `[CHIP ADVISORY ENGINE ONLINE]
Greetings, candidate ${userProfile.name}. I am CHIP, your cybernetic placement mentor.
I have parsed your parameters:
- Target Role: ${userProfile.targetRole}
- Skills compiled: [${userProfile.currentSkills.join(', ')}]
- Commitment cycle: ${userProfile.timeAvailable}

Ask me anything regarding ATS formatting, portfolio optimization, technology pathways, or internship procurement. Direct a transmission below.`,
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const presetPrompts = [
    { label: "DEFICIT_ANALYSIS", text: "What major technology deficits are holding me back from securing a position as a " + userProfile.targetRole + "?" },
    { label: "PORTFOLIO_SPECS", text: "Suggest 2 high-impact open-source project ideas to make my resume stand out to recruiter filters." },
    { label: "INTERNSHIP_ADVICE", text: "Give me actionable strategies and tips to secure an entry-level " + userProfile.targetRole + " internship." },
    { label: "INTERVIEW_BOARDS", text: "How should I structure my answers to behavioral and HR interview questions?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ sender: m.sender, text: m.text })),
          userProfile
        })
      });

      const data = await response.json();
      if (data && data.reply) {
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString()
        }]);
      } else {
        throw new Error("Invalid reply format");
      }
    } catch (err) {
      console.error("[FRONTEND] Mentor Chat error:", err);
      // Failover message
      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `[SIGNAL INTERCEPT ERROR]
Cognitive carrier wave collapsed. Failing over to local cache.
To secure full multi-agent reasoning, verify your system GEMINI_API_KEY.
Recommendation: Continue building deep core projects and focus heavily on database performance parameters.`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Page Title */}
      <div className="border-b border-cyan-glow/20 pb-4">
        <h2 className="text-xl font-bold tracking-wider text-white">
          <span className="text-cyan-glow">[COGNITIVE_CAREER_MENTOR]</span>
        </h2>
        <p className="text-[10px] text-gray-400">
          Sync with advisor CHIP. Access continuous technical screening insight and structural roadmap queries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Preset Vectors Sidecard */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border-2 border-cyan-glow/30 bg-cyber-dark p-5 rounded relative">
            <h3 className="text-white font-bold tracking-wider mb-3 flex items-center gap-1.5 border-b border-cyan-glow/10 pb-2">
              <Terminal className="h-4 w-4 text-cyan-glow" />
              <span>PRESET_COMMAND_VECTORS</span>
            </h3>
            <p className="text-gray-400 text-[10px] mb-4 leading-relaxed">
              Inject these predefined queries into CHIP's cognitive queue to query sector metrics instantly:
            </p>
            <div className="space-y-2.5">
              {presetPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.text)}
                  className="w-full text-left p-3 border border-cyan-glow/20 bg-cyber-black hover:border-magenta-glow hover:bg-magenta-glow/5 rounded transition-all duration-300 text-gray-300 text-[10px] flex items-center justify-between gap-2 group"
                >
                  <span className="font-bold text-cyan-glow group-hover:text-magenta-glow">/{p.label}</span>
                  <HelpCircle className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-2 border-magenta-glow/30 bg-cyber-dark rounded text-gray-400 space-y-2">
            <div className="text-[10px] text-magenta-glow font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>COGNITIVE_RULESET</span>
            </div>
            <p className="text-[10px] leading-relaxed">
              CHIP adapts responses dynamically using your active profile parameters. If you modify your targets in the Settings panel, CHIP will re-align all responses to reflect those changes.
            </p>
          </div>
        </div>

        {/* Conversation Box */}
        <div className="lg:col-span-8 flex flex-col h-[520px] border-2 border-magenta-glow bg-cyber-dark rounded relative cyber-glow-magenta">
          {/* Header */}
          <div className="px-4 py-3 border-b border-magenta-glow/20 bg-cyber-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-magenta-glow animate-pulse" />
              <div>
                <span className="text-white font-bold tracking-wide">CHIP_TERMINAL_V1.0.4</span>
                <span className="text-[8px] bg-matrix-green/20 text-matrix-green px-1 ml-2 font-bold rounded">ONLINE</span>
              </div>
            </div>
            <span className="text-[10px] text-gray-500 font-bold">MODE: INTERACTIVE</span>
          </div>

          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-cyber-black/40">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${
                  m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div className={`p-1.5 border shrink-0 h-8 w-8 flex items-center justify-center rounded ${
                  m.sender === 'user' 
                    ? 'border-cyan-glow bg-cyan-glow/10 text-cyan-glow' 
                    : 'border-magenta-glow bg-magenta-glow/10 text-magenta-glow'
                }`}>
                  {m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Bubble */}
                <div className={`p-4 rounded border-2 text-[11px] leading-relaxed whitespace-pre-wrap font-mono ${
                  m.sender === 'user'
                    ? 'border-cyan-glow/20 bg-cyber-dark text-cyan-glow'
                    : 'border-magenta-glow/20 bg-cyber-dark text-gray-300'
                }`}>
                  {m.text}
                  <div className="text-[8px] text-gray-500 mt-2 text-right">
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="p-1.5 border border-magenta-glow bg-magenta-glow/10 text-magenta-glow shrink-0 h-8 w-8 flex items-center justify-center rounded">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-3 border border-magenta-glow/20 bg-cyber-dark text-magenta-glow rounded text-[10px] italic font-mono animate-pulse">
                  [CHIP IS CORRELATING NEURAL RESPONSES...]
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleFormSubmit} className="p-4 border-t border-magenta-glow/20 bg-cyber-black flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Query placement advisor regarding skills or career strategy..."
              className="flex-1 bg-cyber-dark border border-magenta-glow/30 focus:border-magenta-glow text-white px-3 py-2 outline-none rounded font-mono"
            />
            <button
              type="submit"
              className="p-2.5 bg-magenta-glow text-white hover:bg-magenta-glow/80 rounded transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
