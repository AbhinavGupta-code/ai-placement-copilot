import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingView from './components/LandingView';
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';
import ResumeAnalyzerView from './components/ResumeAnalyzerView';
import AIMentorView from './components/AIMentorView';
import MockInterviewView from './components/MockInterviewView';
import RoadmapView from './components/RoadmapView';
import SkillGapView from './components/SkillGapView';
import InternshipFinderView from './components/InternshipFinderView';
import SettingsView from './components/SettingsView';

import { INITIAL_PROFILE } from './data';
import { UserProfile, ResumeAnalysis, RoadmapPlan, SkillGapAnalysis } from './types';

import { 
  LayoutDashboard, 
  FileText, 
  Bot, 
  Award, 
  BookOpen, 
  Target, 
  Search, 
  Settings as SettingsIcon, 
  ChevronRight, 
  Menu, 
  X,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Theme & Flicker states
  const [isLight, setIsLight] = useState(false);
  const [isFlickerActive, setIsFlickerActive] = useState(true);

  // User Auth & Profiles
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync state variables (passed across screens)
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [interviewScore, setInterviewScore] = useState<number | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [roadmapPlan, setRoadmapPlan] = useState<RoadmapPlan | null>(null);
  const [gapAnalysis, setGapAnalysis] = useState<SkillGapAnalysis | null>(null);

  // Adjust DOM classes based on theme choice
  const handleThemeToggle = () => {
    setIsLight(!isLight);
  };

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isLight]);

  const handleAuthSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleDisconnect = () => {
    setIsLoggedIn(false);
    setUserProfile(INITIAL_PROFILE);
    setResumeAnalysis(null);
    setInterviewScore(null);
    setCompletedTasks([]);
    setRoadmapPlan(null);
    setGapAnalysis(null);
    setCurrentPage('landing');
  };

  const handleNavigate = (page: string) => {
    // If attempting to go to full features without auth, redirect to Auth View
    if (!isLoggedIn && page !== 'landing' && page !== 'auth') {
      setCurrentPage('auth');
    } else {
      setCurrentPage(page);
    }
    setSidebarOpen(false);
  };

  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: <LayoutDashboard className="h-4 w-4 shrink-0" /> },
    { id: 'resume', label: 'ATS SCANNER', icon: <FileText className="h-4 w-4 shrink-0" /> },
    { id: 'mentor', label: 'COGNITIVE MENTOR', icon: <Bot className="h-4 w-4 shrink-0" /> },
    { id: 'mock', label: 'MOCK SCREENING', icon: <Award className="h-4 w-4 shrink-0" /> },
    { id: 'roadmap', label: 'DYNAMIC PATHWAYS', icon: <BookOpen className="h-4 w-4 shrink-0" /> },
    { id: 'gap', label: 'SKILL DEFICITS', icon: <Target className="h-4 w-4 shrink-0" /> },
    { id: 'internships', label: 'PROCUREMENTS', icon: <Search className="h-4 w-4 shrink-0" /> },
    { id: 'settings', label: 'SYS SETTINGS', icon: <SettingsIcon className="h-4 w-4 shrink-0" /> }
  ];

  return (
    <div className={`min-h-screen flex flex-col relative bg-cyber-black overflow-x-hidden ${isFlickerActive ? 'animate-crt-flicker crt-overlay' : ''}`}>
      {/* Platform Header */}
      <Header
        onThemeToggle={handleThemeToggle}
        isLight={isLight}
        onFlickerToggle={() => setIsFlickerActive(!isFlickerActive)}
        isFlickerActive={isFlickerActive}
        currentUser={isLoggedIn ? userProfile : null}
        onAuthToggle={handleDisconnect}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Render Sidebar Menu for Logged In users */}
        {isLoggedIn && currentPage !== 'landing' && (
          <>
            {/* Mobile menu toggle */}
            <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-cyber-dark/95 border-b border-cyan-glow/20 z-40">
              <span className="text-gray-400 font-mono text-[10px] tracking-widest">MENU_VECTORS</span>
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 border border-cyan-glow text-cyan-glow bg-transparent rounded"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>

            {/* Actual Sidebar layout */}
            <aside className={`fixed md:sticky top-0 left-0 h-full md:h-auto w-64 border-r-2 border-cyan-glow/40 bg-cyber-dark z-40 shrink-0 transition-transform duration-300 md:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full md:block'
            }`}>
              <div className="p-4 border-b border-cyan-glow/10">
                <span className="text-[10px] text-magenta-glow font-bold uppercase tracking-widest font-mono">[COGNITIVE RUNTIMES]</span>
              </div>
              <nav className="p-2 space-y-1 font-mono text-xs">
                {menuItems.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-all group ${
                        isActive 
                          ? 'border-l-4 border-magenta-glow text-magenta-glow bg-magenta-glow/5 font-bold' 
                          : 'text-gray-400 hover:text-cyan-glow hover:bg-cyan-glow/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-magenta-glow' : 'text-cyan-glow'}`} />
                    </button>
                  );
                })}
              </nav>

              <div className="absolute bottom-16 left-0 w-full p-4 border-t border-cyan-glow/10 bg-cyber-dark">
                <div className="flex items-start gap-2 text-magenta-glow">
                  <AlertOctagon className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] font-bold block">SYS_STATUS</span>
                    <span className="text-[8px] text-gray-500">PLACEMENTS PROTOCOL IS HIGH_ALERT</span>
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Core Component Stage wrapper */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {currentPage === 'landing' && (
            <LandingView 
              onStart={() => handleNavigate(isLoggedIn ? 'dashboard' : 'auth')} 
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'auth' && (
            <AuthView 
              onAuthSuccess={handleAuthSuccess} 
              onBack={() => setCurrentPage('landing')} 
            />
          )}

          {isLoggedIn && (
            <>
              {currentPage === 'dashboard' && (
                <DashboardView 
                  userProfile={userProfile} 
                  resumeAnalysis={resumeAnalysis}
                  interviewScore={interviewScore}
                  completedTasks={completedTasks}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'resume' && (
                <ResumeAnalyzerView 
                  onAnalysisComplete={(analysis) => setResumeAnalysis(analysis)}
                  initialAnalysis={resumeAnalysis}
                />
              )}

              {currentPage === 'mentor' && (
                <AIMentorView userProfile={userProfile} />
              )}

              {currentPage === 'mock' && (
                <MockInterviewView 
                  onInterviewFinished={(finalScore) => setInterviewScore(finalScore)}
                />
              )}

              {currentPage === 'roadmap' && (
                <RoadmapView 
                  userProfile={userProfile}
                  onRoadmapSync={(plan) => {
                    setRoadmapPlan(plan);
                    if (!completedTasks.includes('roadmap')) {
                      setCompletedTasks(prev => [...prev, 'roadmap']);
                    }
                  }}
                  initialRoadmap={roadmapPlan}
                />
              )}

              {currentPage === 'gap' && (
                <SkillGapView 
                  userProfile={userProfile}
                  onAnalysisSync={(gapData) => setGapAnalysis(gapData)}
                  initialGapAnalysis={gapAnalysis}
                />
              )}

              {currentPage === 'internships' && (
                <InternshipFinderView userProfile={userProfile} />
              )}

              {currentPage === 'settings' && (
                <SettingsView 
                  userProfile={userProfile}
                  onSave={(newProfile) => setUserProfile(newProfile)}
                  isLight={isLight}
                  onThemeToggle={handleThemeToggle}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
