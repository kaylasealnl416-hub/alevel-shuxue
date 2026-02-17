
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CourseHub from './components/CourseHub';
import QuizArena from './components/QuizArena';
import MistakeBook from './components/MistakeBook';
import { ViewType, Mistake } from './types';
import { Trophy, Brain, BookOpen, Calculator, AlertTriangle, Settings, Sparkles, MessageSquareQuote } from 'lucide-react';
import { getDailyWisdom } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>(ViewType.DASHBOARD);
  
  // 初始化错题列表，尝试从 localStorage 加载
  const [mistakes, setMistakes] = useState<Mistake[]>(() => {
    const savedMistakes = localStorage.getItem('ELITE_PREP_MISTAKES');
    return savedMistakes ? JSON.parse(savedMistakes) : [];
  });

  const [quizTopic, setQuizTopic] = useState<string | null>(null);
  const [dailyTip, setDailyTip] = useState<string>("Consistency is the bedrock of A* success.");
  
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem('ELITE_PREP_COMPLETED_TOPICS');
    return saved ? JSON.parse(saved) : [];
  });

  // 辅助函数：清洗文本
  const cleanText = (text: string) => {
    if (!text) return "";
    return text.replace(/[\$\*]/g, '').trim();
  };

  // 持久化保存完成的话题
  useEffect(() => {
    localStorage.setItem('ELITE_PREP_COMPLETED_TOPICS', JSON.stringify(completedTopics));
  }, [completedTopics]);

  // 持久化保存错题本
  useEffect(() => {
    localStorage.setItem('ELITE_PREP_MISTAKES', JSON.stringify(mistakes));
  }, [mistakes]);

  // 获取每日格言
  useEffect(() => {
    const fetchWisdom = async () => {
      try {
        const tip = await getDailyWisdom();
        if (tip) setDailyTip(cleanText(tip));
      } catch (e) {
        console.error(e);
      }
    };
    fetchWisdom();
  }, []);

  const handleAddMistake = (mistake: Mistake) => {
    setMistakes(prev => [mistake, ...prev]);
  };

  const handleStartQuiz = (topic: string) => {
    setQuizTopic(topic);
    setView(ViewType.QUIZ);
  };

  const handleToggleTopic = (topic: string) => {
    setCompletedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleCompleteTopic = (topic: string) => {
    if (!completedTopics.includes(topic)) {
      setCompletedTopics(prev => [...prev, topic]);
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: ViewType, icon: any, label: string }) => (
    <button
      onClick={() => setView(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all group ${
        view === id 
          ? 'bg-red-700 text-white shadow-lg shadow-red-200 ring-2 ring-red-700 ring-offset-2' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
      }`}
    >
      <Icon size={20} className={view === id ? 'text-white' : 'text-slate-400 group-hover:text-red-600'} />
      <span className="font-bold text-sm hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <aside className="w-16 md:w-64 bg-white border-r border-slate-200 flex flex-col h-full sticky top-0 transition-all z-20">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
           <Trophy className="text-red-700" size={28} />
           <h1 className="hidden md:block font-black text-xl text-slate-800 tracking-tight">ELITE PREP</h1>
        </div>

        <nav className="flex-1 p-3">
          <NavItem id={ViewType.DASHBOARD} icon={Brain} label="Performance" />
          <NavItem id={ViewType.COURSE} icon={BookOpen} label="Curriculum" />
          <NavItem id={ViewType.QUIZ} icon={Calculator} label="Quiz Arena" />
          <NavItem id={ViewType.MISTAKES} icon={AlertTriangle} label="Error Log" />
        </nav>

        <div className="p-4 hidden md:block">
           <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
               <Settings size={48} />
             </div>
             <div className="relative z-10">
               <div className="text-[10px] text-amber-400 font-black mb-2 flex items-center gap-1">
                 <MessageSquareQuote size={12}/> AI WISDOM
               </div>
               <p className="text-xs text-slate-300 italic leading-relaxed font-serif">
                 "{dailyTip}"
               </p>
             </div>
           </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="max-w-6xl mx-auto pb-20">
          {view === ViewType.DASHBOARD && <Dashboard />}
          {view === ViewType.COURSE && (
            <CourseHub 
              onStartQuiz={handleStartQuiz} 
              completedTopics={completedTopics} 
              onToggleTopic={handleToggleTopic} 
            />
          )}
          {view === ViewType.QUIZ && (
            <QuizArena 
              initialTopic={quizTopic} 
              onAddMistake={handleAddMistake} 
              onCompleteTopic={handleCompleteTopic}
            />
          )}
          {view === ViewType.MISTAKES && (
            <MistakeBook 
              mistakes={mistakes} 
              onDelete={(id) => setMistakes(mistakes.filter(m => m.id !== id))} 
              onRetry={handleStartQuiz}
            />
          )}
        </div>

        <div className="fixed bottom-6 right-6 p-4 bg-white rounded-full shadow-2xl border border-slate-200 flex items-center gap-2 animate-bounce cursor-help hover:bg-slate-50 transition-colors">
          <Sparkles className="text-indigo-600" size={20} />
          <span className="text-[10px] font-black text-slate-500 hidden md:inline">GEMINI ANALYTICS ACTIVE</span>
        </div>
      </main>
    </div>
  );
};

export default App;
