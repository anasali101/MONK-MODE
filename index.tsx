
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { InterventionModal } from './components/InterventionModal';
import { UnlockModal } from './components/UnlockModal';
import { CompletionModal } from './components/CompletionModal';
import { CalendarModal } from './components/CalendarModal';
import { Button } from './components/Button';
import { ActivityModule } from './components/ActivityModule';
import { InstagramIcon, TikTokIcon, TwitterIcon, YouTubeIcon } from './components/BrandIcons';
import { MOODS, PROFESSIONS, INITIAL_CHALLENGES, INITIAL_APPS } from './constants';
import { Mood, Profession, UserProfile, Tab, Challenge, BlockedApp, ActivityConfig, AuthState } from './types';
import { Lock, Zap, Activity, Home, Shield, LogOut, PlayCircle, StopCircle, Flame, Calendar, Smartphone, TestTube, ScanFace, ChevronDown, User, X, Menu, ArrowRight } from 'lucide-react';

const App = () => {
  // Auth State
  const [auth, setAuth] = useState<AuthState>({ isLoggedIn: false });
  const [gaveUp, setGaveUp] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Dashboard State
  const [profession, setProfession] = useState<Profession>('Software Engineer');
  
  // Activity State
  const [activeActivity, setActiveActivity] = useState<ActivityConfig | null>(null);

  // Vault State
  const [apps, setApps] = useState<BlockedApp[]>(INITIAL_APPS);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<BlockedApp | null>(null);

  // Challenge State
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('sb_challenges');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });
  const [selectedChallengeForOption, setSelectedChallengeForOption] = useState<Challenge | null>(null);
  const [challengeToStop, setChallengeToStop] = useState<Challenge | null>(null);
  const [completedChallenge, setCompletedChallenge] = useState<Challenge | null>(null);

  // Calendar State
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);

  // Persistence
  const [stats, setStats] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sb_stats_v3');
    return saved ? JSON.parse(saved) : {
      name: 'User',
      profession: 'Software Engineer',
      streak: 3,
      minutesSaved: 45,
      xp: 120,
      level: 2
    };
  });

  // Effect: Update progress bars and check for completion
  useEffect(() => {
    const interval = setInterval(() => {
      setChallenges(prev => prev.map(c => {
        if (c.isActive && c.startTime && c.selectedOption) {
          const now = Date.now();
          const targetDurationMs = c.selectedOption * 60 * 60 * 1000; // hours to ms
          
          const elapsed = now - c.startTime;
          // Check for completion (Demo: If > 99% done)
          if (elapsed >= targetDurationMs) {
            setCompletedChallenge({ ...c }); // trigger modal
            return { ...c, isActive: false, isCompleted: true, startTime: undefined };
          }
          return c; // Component will re-render and calculate width
        }
        return c;
      }));
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('sb_stats_v3', JSON.stringify(stats));
    localStorage.setItem('sb_challenges', JSON.stringify(challenges));
    localStorage.setItem('sb_apps', JSON.stringify(apps));
  }, [stats, challenges, apps]);

  // Handlers
  const handleMoodSelect = (moodItem: typeof MOODS[0]) => {
    setActiveActivity(moodItem.activity);
  };

  const handleActivityComplete = () => {
    setStats(prev => ({
      ...prev,
      minutesSaved: prev.minutesSaved + 5,
      xp: prev.xp + 50
    }));
    setActiveActivity(null);
  };

  // Challenge Logic
  const initiateChallengeStart = (challenge: Challenge) => {
    if (challenge.options) {
      setSelectedChallengeForOption(challenge);
    } else {
      activateChallenge(challenge.id);
    }
  };

  const activateChallenge = (id: string, option?: number) => {
    setChallenges(prev => prev.map(c => 
      c.id === id ? { ...c, isActive: true, startTime: Date.now(), selectedOption: option } : c
    ));
    setSelectedChallengeForOption(null);
  };

  const initiateChallengeStop = (challenge: Challenge) => {
    setChallengeToStop(challenge);
  };

  const confirmStopChallenge = () => {
    if (challengeToStop) {
      setChallenges(prev => prev.map(c => 
        c.id === challengeToStop.id ? { ...c, isActive: false, startTime: undefined, selectedOption: undefined } : c
      ));
      setChallengeToStop(null);
    }
  };

  // Debug function to instantly complete a challenge
  const debugComplete = (id: string) => {
     const c = challenges.find(ch => ch.id === id);
     if (c) {
       setCompletedChallenge({ ...c, selectedOption: c.selectedOption || 1 });
       setChallenges(prev => prev.map(ch => ch.id === id ? { ...ch, isActive: false, isCompleted: true } : ch));
     }
  };

  const handleAppClick = (app: BlockedApp) => {
    if (app.usageMinutes >= app.limitMinutes) {
      setSelectedApp(app);
      setUnlockModalOpen(true);
    } else {
      setApps(prev => prev.map(a => 
        a.id === app.id ? { ...a, usageMinutes: Math.min(a.usageMinutes + 5, a.limitMinutes + 1) } : a
      ));
    }
  };

  const handleUnlock = (minutes: number) => {
    if (selectedApp) {
      setApps(prev => prev.map(a => 
        a.id === selectedApp.id ? { ...a, limitMinutes: a.limitMinutes + minutes } : a
      ));
    }
  };

  const handleLogin = (method: string) => {
    setAuth({ isLoggedIn: true, method: method as any });
    setGaveUp(false);
  };
  
  const handleLogout = () => {
    setAuth({ isLoggedIn: false });
    setGaveUp(true);
    setProfileMenuOpen(false);
  };

  const navigateTo = (tab: Tab) => {
    setActiveTab(tab);
    setProfileMenuOpen(false);
  };

  const renderIcon = (id: string, className: string) => {
    switch(id) {
      case 'ig': return <InstagramIcon className={className} />;
      case 'tk': return <TikTokIcon className={className} />;
      case 'x': return <TwitterIcon className={className} />;
      case 'yt': return <YouTubeIcon className={className} />;
      default: return <Smartphone className={className} />;
    }
  };

  // --- Views ---

  const renderLogin = () => (
    <div className={`flex flex-col h-screen p-6 justify-between animate-in fade-in transition-colors duration-700 ${gaveUp ? 'bg-red-950 text-white' : 'bg-black text-white'}`}>
       <div className="mt-20 space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors ${gaveUp ? 'bg-red-600' : 'bg-white'}`}>
            <Shield size={32} className={`${gaveUp ? 'text-white' : 'text-black'}`} />
          </div>
          <h1 className="text-5xl font-display font-bold leading-tight tracking-tighter">
            {gaveUp ? "YOU GAVE UP." : "MONK\nMODE."}
          </h1>
          <p className={`${gaveUp ? 'text-red-200' : 'text-zinc-500'} text-lg leading-relaxed`}>
            {gaveUp ? "The chaos is waiting outside. Are you sure you want to stay there?" : "Kill the scroll. Reclaim your mind."}
          </p>
       </div>

       <div className="space-y-3 mb-10">
          <button onClick={() => handleLogin('apple')} className="w-full bg-white text-black h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
            <span className="text-lg">{gaveUp ? '↺' : ''}</span> {gaveUp ? 'Re-enter the Sanctuary' : 'Continue with Apple'}
          </button>
          {!gaveUp && (
            <button onClick={() => handleLogin('google')} className="w-full bg-zinc-900 text-white border border-zinc-800 h-14 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors">
              G Continue with Google
            </button>
          )}
       </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pt-safe">
      
      {/* IDENTITY PROTOCOL HEADER - REDESIGNED */}
      <div className="px-4 py-4 sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
         <div className="flex items-center gap-2 mb-2 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-lime animate-pulse"></div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Monk Mode OS v3.5</span>
            </div>
            {/* Profile Avatar Trigger */}
            <button onClick={() => setProfileMenuOpen(true)} className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-colors">
               <User size={14} />
            </button>
         </div>

         <div className="bg-zinc-900/80 border border-zinc-700/50 rounded-xl p-1 relative overflow-hidden group">
            {/* Scanning Effect */}
            <div className="absolute top-0 left-0 w-1 h-full bg-neon-lime/50 blur-[2px] animate-scanline opacity-50 group-hover:opacity-100"></div>
            
            <div className="flex items-center justify-between pl-3 pr-2 py-2">
               <div className="flex items-center gap-3">
                  <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 text-neon-lime">
                     <ScanFace size={18} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Identity Protocol</span>
                     <div className="relative">
                        <select 
                           value={profession} 
                           onChange={(e) => setProfession(e.target.value as Profession)}
                           className="bg-transparent text-white font-display font-bold text-sm focus:outline-none cursor-pointer appearance-none pr-6 z-10 relative py-0.5"
                        >
                           {PROFESSIONS.map(p => <option key={p} value={p} className="bg-black text-white">{p}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-2 pr-1">
                  <div className="flex flex-col items-end">
                     <span className="text-[8px] text-zinc-600 uppercase font-bold">Streak</span>
                     <div className="flex items-center gap-1 text-orange-500">
                        <Flame size={12} fill="currentColor" />
                        <span className="font-mono font-bold text-sm">{stats.streak}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="px-4 mt-6 mb-8">
        <h1 className="text-4xl font-display font-bold text-white leading-tight mb-2 tracking-tight">
          Kill the Scroll.<br/>
          <span className="text-zinc-600">Reclaim Focus.</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-2 font-mono">Select your current state to override.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 px-4 pb-32">
        {MOODS.map((m) => (
          <button
            key={m.value}
            onClick={() => handleMoodSelect(m)}
            className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-center justify-between hover:border-neon-lime/50 hover:bg-zinc-900 transition-all active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center text-2xl border border-zinc-800 group-hover:scale-110 transition-transform group-hover:border-neon-lime/30 group-hover:text-neon-lime shadow-lg">
                {m.emoji}
              </div>
              <div className="text-left">
                <h3 className="text-lg font-display font-bold text-white group-hover:text-neon-lime transition-colors">{m.label}</h3>
                <p className="text-xs text-zinc-500 font-medium">{m.description}</p>
              </div>
            </div>
            <div className="text-zinc-700 group-hover:text-neon-lime transition-colors relative z-10">
              <PlayCircle size={24} strokeWidth={1.5} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderVault = () => (
    <div className="h-full px-4 pt-6 animate-in slide-in-from-right-4 duration-500 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-display font-bold text-white">The Vault</h2>
        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center animate-pulse border border-rose-500/20">
           <Lock size={16} className="text-rose-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {apps.map(app => {
          const isLocked = app.usageMinutes >= app.limitMinutes;
          
          return (
            <div 
              key={app.id}
              onClick={() => handleAppClick(app)}
              className={`relative rounded-3xl p-5 border aspect-square flex flex-col justify-between transition-all active:scale-[0.95] cursor-pointer overflow-hidden group
                ${isLocked 
                  ? 'bg-rose-950/20 border-rose-900/50' 
                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600'
                }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${app.brandColor} opacity-5 group-hover:opacity-10 transition-opacity`}></div>

              <div className="flex justify-between items-start z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-black/50 backdrop-blur-sm ${isLocked ? "text-rose-400" : "text-white"}`}>
                  {renderIcon(app.id, "w-6 h-6")}
                </div>
                {isLocked && <Lock size={16} className="text-rose-500" />}
              </div>
              
              <div className="z-10">
                <h3 className="font-bold text-white text-lg leading-none mb-1">{app.name}</h3>
                <div className="flex items-center gap-1.5">
                   <div className={`h-1.5 flex-1 rounded-full overflow-hidden ${isLocked ? 'bg-rose-900' : 'bg-zinc-800'}`}>
                      <div className={`h-full ${isLocked ? 'bg-rose-500' : 'bg-white'}`} style={{width: `${(app.usageMinutes/app.limitMinutes)*100}%`}}></div>
                   </div>
                </div>
                <p className={`text-[10px] font-mono mt-1 ${isLocked ? 'text-rose-400' : 'text-zinc-500'}`}>
                   {isLocked ? 'LOCKED' : `${app.limitMinutes - app.usageMinutes}m left`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderQuests = () => {
    const heatmapDays = Array.from({ length: 35 }, (_, i) => ({
      val: Math.random() > 0.4,
      day: i
    }));

    return (
      <div className="h-full px-4 pt-6 animate-in fade-in duration-500 pb-24">
        <h2 className="text-3xl font-display font-bold text-white mb-6">Protocols</h2>
        
        {/* Interactive Heatmap */}
        <div 
           onClick={() => setCalendarModalOpen(true)}
           className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl mb-8 cursor-pointer hover:bg-zinc-900 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-2 group-hover:text-neon-lime transition-colors font-bold">
              <Calendar size={12}/> Focus Integrity
            </p>
            <span className="text-zinc-600 font-mono text-[10px] group-hover:text-white">ACCESS LOG →</span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-between">
            {heatmapDays.map((d, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-[2px] transition-all duration-300 ${d.val ? 'bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.4)]' : 'bg-zinc-800/50'}`}
              ></div>
            ))}
          </div>
        </div>

        <h3 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-widest pl-1">Active Protocols</h3>
        <div className="space-y-4">
          {challenges.map(c => {
             // Calculate Progress
             let progress = 0;
             if (c.isActive && c.startTime && c.selectedOption) {
               const now = Date.now();
               const total = c.selectedOption * 60 * 60 * 1000;
               const elapsed = now - c.startTime;
               progress = Math.min((elapsed / total) * 100, 100);
             }

             return (
              <div key={c.id} className={`border rounded-2xl p-5 transition-all overflow-hidden relative group ${c.isActive ? 'bg-zinc-950 border-neon-lime/30 shadow-[0_0_15px_rgba(204,255,0,0.05)]' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}>
                 
                 <div className="flex justify-between items-start mb-2 relative z-10">
                   <div>
                      <h4 className={`font-bold text-lg ${c.isActive ? 'text-neon-lime' : 'text-white'}`}>{c.title}</h4>
                      <p className="text-zinc-500 text-xs mt-1 leading-relaxed max-w-[90%]">{c.description}</p>
                   </div>
                   <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${c.isActive ? 'bg-neon-lime/10 border-neon-lime/20 text-neon-lime' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
                     {c.difficulty}
                   </div>
                 </div>
                 
                 {c.isActive && c.selectedOption && (
                   <div className="mb-5 mt-5 relative z-10">
                     <div className="flex justify-between text-[10px] font-mono text-neon-lime mb-2 uppercase tracking-widest font-bold">
                       <span className="flex items-center gap-1"><Activity size={10} className="animate-pulse"/> Processing</span>
                       <span>{Math.round(progress)}%</span>
                     </div>
                     
                     {/* COOL PLASMA PROGRESS BAR */}
                     <div className="w-full h-4 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 relative">
                        <div 
                          className="h-full plasma-bar relative transition-all duration-1000 rounded-full"
                          style={{ width: `${Math.max(progress, 5)}%` }}
                        >
                           {/* Glow Core */}
                           <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[2px] animate-pulse"></div>
                           {/* Particles simulation */}
                           <div className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuNCkiLz48L3N2Zz4=')] opacity-50"></div>
                        </div>
                     </div>

                   </div>
                 )}

                 <div className="flex items-center justify-between mt-4 relative z-10 border-t border-zinc-900/50 pt-4">
                   <div className="flex items-center gap-1">
                      <Zap size={14} className="text-neon-purple"/>
                      <span className="text-neon-purple text-xs font-bold">+{c.baseReward} XP</span>
                   </div>
                   
                   <div className="flex gap-2">
                     {c.isActive && (
                        <button 
                          onClick={() => debugComplete(c.id)} 
                          className="px-3 py-1.5 bg-zinc-900 text-zinc-500 rounded-lg text-[10px] font-medium hover:text-white transition-colors border border-zinc-800"
                        >
                          DEBUG: FINISH
                        </button>
                     )}
                     
                     <Button 
                       size="sm" 
                       variant={c.isActive ? 'secondary' : 'primary'}
                       onClick={() => c.isActive ? initiateChallengeStop(c) : initiateChallengeStart(c)}
                       className={c.isActive ? 'border-rose-900/50 text-rose-500 hover:bg-rose-950/20 hover:text-rose-400' : 'bg-white text-black hover:bg-zinc-200 border-0'}
                     >
                       {c.isActive ? 'ABORT' : 'INITIALIZE'}
                     </Button>
                   </div>
                 </div>
              </div>
            );
          })}
        </div>

        {/* DEMO TOOL */}
        <div className="mt-8 pt-6 border-t border-zinc-900">
           <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-950/50">
             <div className="flex items-center gap-2 mb-2">
               <TestTube size={14} className="text-zinc-600" />
               <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">System Override</p>
             </div>
             <Button 
               variant="ghost" 
               className="w-full border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 font-mono text-xs h-10"
               onClick={() => setCompletedChallenge({
                 id: 'demo-completion',
                 title: 'Digital Fasting',
                 description: 'A complete detox from all screens and inputs.',
                 baseReward: 1000,
                 difficulty: 'Hard',
                 isActive: false,
                 isCompleted: true,
                 selectedOption: 24,
                 options: [24]
               })}
             >
               Preview Completion Sequence
             </Button>
           </div>
        </div>
      </div>
    );
  };

  // --- Main Render Flow ---

  if (!auth.isLoggedIn) {
    return renderLogin();
  }

  if (activeActivity) {
    return (
      <div className="fixed inset-0 bg-black text-white z-50 animate-in slide-in-from-bottom duration-300">
        <ActivityModule 
          config={activeActivity} 
          onComplete={handleActivityComplete}
          onExit={() => setActiveActivity(null)}
          profession={profession}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-neon-lime/30 flex justify-center">
      
      <div className="w-full max-w-md h-screen relative bg-black flex flex-col shadow-2xl overflow-hidden border-x border-zinc-900/50">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-zinc-900/30 to-transparent pointer-events-none z-0"></div>

        <main className="flex-grow overflow-y-auto no-scrollbar z-10 bg-black">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'vault' && renderVault()}
          {activeTab === 'quests' && renderQuests()}
        </main>

        <div className="absolute bottom-0 w-full bg-black/95 backdrop-blur-xl border-t border-zinc-800 pb-safe z-20">
          <div className="flex justify-around items-center h-16">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`flex flex-col items-center gap-1.5 transition-all w-20 ${activeTab === 'dashboard' ? 'text-neon-lime' : 'text-zinc-600'}`}
            >
              <Home size={22} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
              <span className="text-[9px] font-bold uppercase tracking-wide">Base</span>
            </button>
            <button 
              onClick={() => setActiveTab('vault')} 
              className={`flex flex-col items-center gap-1.5 transition-all w-20 ${activeTab === 'vault' ? 'text-neon-lime' : 'text-zinc-600'}`}
            >
              <Lock size={22} strokeWidth={activeTab === 'vault' ? 2.5 : 2} />
              <span className="text-[9px] font-bold uppercase tracking-wide">Vault</span>
            </button>
            <button 
              onClick={() => setActiveTab('quests')} 
              className={`flex flex-col items-center gap-1.5 transition-all w-20 ${activeTab === 'quests' ? 'text-neon-lime' : 'text-zinc-600'}`}
            >
              <Zap size={22} strokeWidth={activeTab === 'quests' ? 2.5 : 2} />
              <span className="text-[9px] font-bold uppercase tracking-wide">Quests</span>
            </button>
          </div>
        </div>

        {/* Profile Command Menu Overlay */}
        {profileMenuOpen && (
           <div className="absolute inset-0 z-50 flex items-start justify-end p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={() => setProfileMenuOpen(false)}></div>
              <div className="relative bg-zinc-900 border border-zinc-800 w-64 rounded-2xl p-4 shadow-2xl mt-14 animate-in slide-in-from-top-4 mr-2">
                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                    <div className="w-10 h-10 rounded-full bg-neon-lime/10 flex items-center justify-center text-neon-lime border border-neon-lime/20">
                       <User size={20} />
                    </div>
                    <div>
                       <p className="font-bold text-white text-sm">Operative</p>
                       <p className="text-[10px] text-zinc-500">Lvl {stats.level} • {stats.xp} XP</p>
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <button onClick={() => navigateTo('vault')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-black text-left group">
                       <span className="text-zinc-400 group-hover:text-white text-sm font-medium">Open Vault</span>
                       <Lock size={14} className="text-zinc-600 group-hover:text-neon-lime" />
                    </button>
                    <button onClick={() => navigateTo('quests')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-black text-left group">
                       <span className="text-zinc-400 group-hover:text-white text-sm font-medium">Quest Log</span>
                       <Zap size={14} className="text-zinc-600 group-hover:text-neon-lime" />
                    </button>
                    <div className="h-px bg-zinc-800 my-2"></div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-rose-950/30 text-left group">
                       <span className="text-zinc-400 group-hover:text-rose-500 text-sm font-medium">Disengage</span>
                       <LogOut size={14} className="text-zinc-600 group-hover:text-rose-500" />
                    </button>
                 </div>
              </div>
           </div>
        )}

        {/* Modals */}
        {selectedApp && (
          <UnlockModal 
            appName={selectedApp.name}
            isOpen={unlockModalOpen}
            onClose={() => setUnlockModalOpen(false)}
            onUnlock={handleUnlock}
          />
        )}

        <CalendarModal 
           isOpen={calendarModalOpen}
           onClose={() => setCalendarModalOpen(false)}
           streak={stats.streak}
        />

        <CompletionModal 
           isOpen={!!completedChallenge}
           challenge={completedChallenge}
           onClose={() => setCompletedChallenge(null)}
        />

        {/* Challenge Duration Modal */}
        {selectedChallengeForOption && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden">
               <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
               <h3 className="text-xl font-bold text-white mb-2 font-display">{selectedChallengeForOption.title}</h3>
               <p className="text-zinc-400 text-sm mb-6">Select protocol intensity.</p>
               <div className="space-y-3">
                 {selectedChallengeForOption.options?.map(opt => (
                   <button 
                     key={opt}
                     onClick={() => activateChallenge(selectedChallengeForOption.id, opt)}
                     className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-neon-lime/50 hover:bg-zinc-800 text-left flex justify-between items-center group transition-all"
                   >
                     <span className="font-bold text-white font-mono">{opt} HOURS</span>
                     <span className="text-xs text-zinc-500 group-hover:text-neon-lime transition-colors">INITIALIZE →</span>
                   </button>
                 ))}
               </div>
               <button onClick={() => setSelectedChallengeForOption(null)} className="w-full mt-4 py-3 text-zinc-600 hover:text-white transition-colors text-sm">Cancel</button>
            </div>
          </div>
        )}

        {challengeToStop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
             <div className="w-full max-w-sm bg-zinc-950 border border-rose-900/50 rounded-3xl p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-rose-900/5 animate-pulse"></div>
                <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                  <Shield size={32} className="text-rose-500"/>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-display">Abort Protocol?</h3>
                <p className="text-rose-200/70 text-sm mb-6 leading-relaxed">
                  Warning: All progress for <span className="font-bold text-white border-b border-rose-500/30">{challengeToStop.title}</span> will be lost immediately.
                </p>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setChallengeToStop(null)} className="flex-1 bg-zinc-800 text-white border-0 hover:bg-zinc-700">STAY FOCUSED</Button>
                  <Button variant="danger" onClick={confirmStopChallenge} className="flex-1 bg-rose-600 hover:bg-rose-500">ABORT</Button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
