
import React, { useState, useRef, useEffect } from 'react';
import { Card, Button } from './UI';
import { 
  ChevronRight, Play, Pause, Volume2, VolumeX, Maximize, 
  Book, ScrollText, Zap, ChevronDown, 
  List, MonitorPlay, Sparkles, MessageCircle, Send, X, 
  BrainCircuit, Info, Target, FileCode, CheckCircle2, Circle
} from 'lucide-react';
import { COURSE_DATA } from '../constants';
import { getTopicSummary, getTutorChatResponse, getVideoAnalysis } from '../services/geminiService';
import { ChatMessage } from '../types';

interface CourseHubProps {
  onStartQuiz: (topic: string) => void;
  completedTopics: string[];
  onToggleTopic: (topic: string) => void;
}

interface VideoAnalysisData {
  synopsis: string;
  knowledgePoints: string[];
  examinerTips: string[];
  formulaVault: string[];
}

const CourseHub: React.FC<CourseHubProps> = ({ onStartQuiz, completedTopics, onToggleTopic }) => {
  const [activeSub, setActiveSub] = useState('P1');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [magicSummary, setMagicSummary] = useState<{topic: string, text: string} | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);
  const [videoAnalyses, setVideoAnalyses] = useState<Record<string, VideoAnalysisData>>({});
  const [loadingAnalysis, setLoadingAnalysis] = useState<string | null>(null);
  const [chatTopic, setChatTopic] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const cleanText = (text: string) => text ? text.replace(/[\$\*]/g, '').trim() : "";

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  const handleMagicSummary = async (topic: string) => {
    setLoadingSummary(topic);
    try {
      const summary = await getTopicSummary(topic);
      setMagicSummary({ topic, text: cleanText(summary || "") });
    } finally { setLoadingSummary(null); }
  };

  const fetchVideoAnalysis = async (chapterId: string, title: string, topics: string[]) => {
    if (videoAnalyses[chapterId]) return;
    setLoadingAnalysis(chapterId);
    try {
      const analysis = await getVideoAnalysis(title, topics);
      setVideoAnalyses(prev => ({ ...prev, [chapterId]: analysis }));
    } finally { setLoadingAnalysis(null); }
  };

  const handleExpand = (chapter: any) => {
    if (expandedId === chapter.id) setExpandedId(null);
    else {
      setExpandedId(chapter.id);
      fetchVideoAnalysis(chapter.id, chapter.title, chapter.topics);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
    setIsPlaying(!videoRef.current.paused);
  };

  const handleSeek = (e: any) => {
    if (!videoRef.current) return;
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6 relative h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Curriculum Repository</h2>
        <div className="flex bg-slate-200 p-1 rounded-lg">
          {Object.keys(COURSE_DATA).map(key => (
            <button key={key} onClick={() => setActiveSub(key)} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeSub === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{key}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 pb-20">
        {COURSE_DATA[activeSub].chapters.map((chapter) => {
          const progress = (chapter.topics.filter(t => completedTopics.includes(t)).length / chapter.topics.length) * 100;
          return (
            <div key={chapter.id} className={`border rounded-xl bg-white overflow-hidden shadow-sm ${progress === 100 ? 'border-emerald-200' : 'border-slate-200'}`}>
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => handleExpand(chapter)}>
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${progress === 100 ? 'bg-emerald-100 text-emerald-600' : `${COURSE_DATA[activeSub].bg} ${COURSE_DATA[activeSub].color}`}`}>
                    {expandedId === chapter.id ? <ChevronDown size={20}/> : (progress === 100 ? <CheckCircle2 size={20}/> : <ChevronRight size={20}/>)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold">{chapter.title}</h3>
                      <span className="text-[10px] font-black text-slate-400">{Math.round(progress)}% COMPLETE</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-red-600'}`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {expandedId === chapter.id && (
                <div className="p-4 bg-slate-50 border-t border-slate-200 animate-slide-down space-y-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="aspect-video bg-slate-900 rounded-lg relative flex flex-col justify-end overflow-hidden group shadow-lg" onMouseEnter={() => setShowControls(true)} onMouseLeave={() => isPlaying && setShowControls(false)}>
                        <video ref={videoRef} onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)} onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)} onClick={togglePlay} className="w-full h-full cursor-pointer object-cover" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" />
                        {!isPlaying && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white ring-4 ring-white/20"><Play fill="white" size={28} className="ml-1" /></div></div>}
                        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-4 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                          <input type="range" min="0" max={duration || 0} step="0.1" value={currentTime} onChange={handleSeek} className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-red-600 mb-3" />
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-4">
                              <button onClick={togglePlay}>{isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button>
                              <button onClick={() => {if(videoRef.current) {videoRef.current.muted = !isMuted; setIsMuted(!isMuted)}}}>{isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}</button>
                              <span className="text-xs font-mono">{formatTime(currentTime)} / {formatTime(duration)}</span>
                            </div>
                            <button><Maximize size={18} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-80">
                      <div className="bg-slate-900 text-white rounded-lg p-4 shadow-xl border border-slate-700 min-h-[300px] flex flex-col text-xs">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2"><BrainCircuit size={18} className="text-indigo-400" /><span className="font-black uppercase tracking-widest text-indigo-400">Lecture Intelligence</span></div>
                        {loadingAnalysis === chapter.id ? <div className="flex-1 flex flex-col items-center justify-center animate-pulse"><Sparkles size={24} className="mb-2" /><p className="font-bold">Decoding...</p></div> : videoAnalyses[chapter.id] ? (
                          <div className="space-y-4 overflow-y-auto max-h-[300px]">
                            <section><h4 className="flex items-center gap-1.5 text-slate-400 font-bold mb-1"><Info size={12}/> Synopsis</h4><p className="text-slate-300 italic">{videoAnalyses[chapter.id].synopsis}</p></section>
                            <section><h4 className="flex items-center gap-1.5 text-slate-400 font-bold mb-1"><Target size={12}/> Knowledge Points</h4><ul className="grid gap-1">{videoAnalyses[chapter.id].knowledgePoints.map((kp, i) => <li key={i} className="flex gap-2 text-slate-200"><span className="text-red-500">•</span> {kp}</li>)}</ul></section>
                          </div>
                        ) : <div className="text-slate-600 text-center mt-10">Metadata failed to load.</div>}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><List size={12} /> Adaptive Practice Sessions</p>
                    {chapter.topics.map((topic, i) => (
                      <div key={i} className={`bg-white p-3 rounded-lg border flex items-center justify-between ${completedTopics.includes(topic) ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                          <button onClick={() => onToggleTopic(topic)} className={`w-6 h-6 rounded flex items-center justify-center ${completedTopics.includes(topic) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'}`}>{completedTopics.includes(topic) ? <CheckCircle2 size={14} /> : <Circle size={14} />}</button>
                          <span className={`text-sm font-semibold ${completedTopics.includes(topic) ? 'text-emerald-900' : 'text-slate-700'}`}>{topic}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {setChatTopic(topic); setChatHistory([{role:'assistant', text:'Ask me anything about '+topic}])}} className="p-1.5 text-indigo-600"><MessageCircle size={16} /></button>
                          <button onClick={() => handleMagicSummary(topic)} className="p-1.5 text-purple-600">{loadingSummary === topic ? <Zap size={16} className="animate-spin"/> : <Sparkles size={16} />}</button>
                          <Button variant={completedTopics.includes(topic) ? "secondary" : "primary"} size="sm" onClick={() => onStartQuiz(topic)}>{completedTopics.includes(topic) ? "Review" : "Practice"}</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {magicSummary && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in"><Card className="max-w-md w-full border-t-4 border-t-purple-600"><div className="flex justify-between items-center mb-4"><h3 className="font-black text-purple-900 flex items-center gap-2"><Sparkles size={20} /> Magic Note</h3><button onClick={() => setMagicSummary(null)}>✕</button></div><div className="text-sm text-slate-700">{magicSummary.text}</div><div className="mt-6 flex justify-end"><Button onClick={() => setMagicSummary(null)}>Got it</Button></div></Card></div>}
    </div>
  );
};

export default CourseHub;
