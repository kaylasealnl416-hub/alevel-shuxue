
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Button } from './UI';
import { 
  RefreshCw, CheckCircle, XCircle, Sparkles, Clock, 
  Printer, History, Save, RotateCcw, Search, 
  Timer, ChevronLeft, ChevronRight, Award, AlertTriangle, BookOpen, Calculator
} from 'lucide-react';
import { generateQuizQuestion, getDeepDiveExplanation, generateMockPaper, generateExamBatch } from '../services/geminiService';
import { Question, PastPaper, QuizSessionState } from '../types';
import { PAST_PAPERS } from '../constants';

interface QuizArenaProps {
  initialTopic?: string | null;
  onAddMistake: (mistake: any) => void;
  onCompleteTopic?: (topic: string) => void;
}

const STORAGE_KEY = 'ELITE_PREP_QUIZ_SESSION';

const QuizArena: React.FC<QuizArenaProps> = ({ initialTopic, onAddMistake, onCompleteTopic }) => {
  const [mode, setMode] = useState<'topic' | 'paper' | 'exam'>('topic');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  const [aiDeepDive, setAiDeepDive] = useState<string | null>(null);
  const [loadingDeepDive, setLoadingDeepDive] = useState(false);

  const [selectedPaper, setSelectedPaper] = useState<PastPaper | null>(null);
  const [mockPaperContent, setMockPaperContent] = useState<any[]>([]);
  const [generatingPaper, setGeneratingPaper] = useState(false);

  const [hasSavedSession, setHasSavedSession] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examAnswers, setExamAnswers] = useState<(string | null)[]>([]);
  const [examTimeRemaining, setExamTimeRemaining] = useState<number>(600);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [currentExamIndex, setCurrentExamIndex] = useState(0);

  const cleanText = (text: string) => text ? text.replace(/[\$\*]/g, '').trim() : "";

  // 1. 初始化加载与存档检测
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHasSavedSession(true);
    } else {
      if (mode === 'topic' && !question && !loading) {
        fetchQuestion(initialTopic || undefined);
      }
    }
  }, []);

  // 2. 监听话题变化（如从课程页面点击“Practice”）
  useEffect(() => {
    if (initialTopic && !hasSavedSession && mode === 'topic') {
      fetchQuestion(initialTopic);
    }
  }, [initialTopic]);

  const saveToStorage = useCallback(() => {
    const sessionState: QuizSessionState = {
      mode, difficulty, question, selected, feedback, aiDeepDive, selectedPaper, mockPaperContent,
      examQuestions, examAnswers, examTimeRemaining, isExamSubmitted, currentExamIndex
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionState));
  }, [mode, difficulty, question, selected, feedback, aiDeepDive, selectedPaper, mockPaperContent, examQuestions, examAnswers, examTimeRemaining, isExamSubmitted, currentExamIndex]);

  useEffect(() => { saveToStorage(); }, [saveToStorage]);

  useEffect(() => {
    let timer: any;
    if (mode === 'exam' && !isExamSubmitted && examQuestions.length > 0 && examTimeRemaining > 0) {
      timer = setInterval(() => {
        setExamTimeRemaining(prev => {
          if (prev <= 1) { handleExamSubmit(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, isExamSubmitted, examQuestions.length, examTimeRemaining]);

  const resumeSession = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setMode(state.mode);
        setDifficulty(state.difficulty);
        setQuestion(state.question);
        setSelected(state.selected);
        setFeedback(state.feedback);
        setAiDeepDive(state.aiDeepDive);
        setSelectedPaper(state.selectedPaper);
        setMockPaperContent(state.mockPaperContent);
        setExamQuestions(state.examQuestions || []);
        setExamAnswers(state.examAnswers || []);
        setExamTimeRemaining(state.examTimeRemaining || 600);
        setIsExamSubmitted(state.isExamSubmitted || false);
        setCurrentExamIndex(state.currentExamIndex || 0);
        setHasSavedSession(false);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasSavedSession(false);
    setQuestion(null);
    setSelected(null);
    setFeedback(null);
    setAiDeepDive(null);
    setSelectedPaper(null);
    setMockPaperContent([]);
    setExamQuestions([]);
    setExamAnswers([]);
    setExamTimeRemaining(600);
    setIsExamSubmitted(false);
    setCurrentExamIndex(0);
    if (mode === 'topic') fetchQuestion(initialTopic || undefined);
  };

  const fetchQuestion = async (topic?: string, diff?: 'Easy' | 'Medium' | 'Hard') => {
    setLoading(true);
    setQuestion(null);
    setSelected(null);
    setFeedback(null);
    setAiDeepDive(null);
    try {
      const targetTopic = topic || initialTopic || question?.topic || "Algebraic Expressions";
      const targetDiff = diff || difficulty;
      const q = await generateQuizQuestion(targetTopic, targetDiff);
      setQuestion({
        ...q,
        question: cleanText(q.question),
        options: q.options.map((opt: string) => cleanText(opt)),
        answer: cleanText(q.answer),
        explanation: cleanText(q.explanation),
        topic: targetTopic,
        isAi: true
      });
    } catch (e) {
      console.error("AI Generation Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const startExam = async () => {
    setMode('exam');
    setLoading(true);
    setExamQuestions([]);
    setExamAnswers([]);
    setIsExamSubmitted(false);
    setCurrentExamIndex(0);
    setExamTimeRemaining(600);
    try {
      const targetTopic = initialTopic || "Algebraic Expressions";
      const batch = await generateExamBatch(targetTopic, difficulty, 5);
      const sanitizedBatch = batch.map(q => ({
        ...q,
        question: cleanText(q.question),
        options: q.options.map((o: string) => cleanText(o)),
        answer: cleanText(q.answer),
        explanation: cleanText(q.explanation),
        topic: targetTopic,
        isAi: true
      }));
      setExamQuestions(sanitizedBatch);
      setExamAnswers(new Array(sanitizedBatch.length).fill(null));
    } catch (e) {
      console.error("Exam Batch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePaper = async (paper: PastPaper) => {
    setSelectedPaper(paper);
    setGeneratingPaper(true);
    setMockPaperContent([]);
    try {
      const content = await generateMockPaper(paper.title);
      setMockPaperContent(content);
    } catch (e) {
      console.error("Mock Paper Error:", e);
    } finally {
      setGeneratingPaper(false);
    }
  };

  const handleDeepDive = async () => {
    if (!question) return;
    setLoadingDeepDive(true);
    try {
      const explanation = await getDeepDiveExplanation(question.question, question.answer);
      setAiDeepDive(explanation ? cleanText(explanation) : "Deep dive unavailable.");
    } catch (e) {
      console.error("Deep Dive Error:", e);
    } finally {
      setLoadingDeepDive(false);
    }
  };

  const handleAnswer = (opt: string) => {
    if (feedback) return;
    setSelected(opt);
    const isCorrect = opt === question?.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect && question && onCompleteTopic) onCompleteTopic(question.topic);
    if (!isCorrect && question) {
      onAddMistake({
        id: Date.now().toString(),
        topic: question.topic,
        date: new Date().toLocaleDateString(),
        question: question.question,
        yourAnswer: opt,
        correctAnswer: question.answer,
        explanation: question.explanation
      });
    }
  };

  const handleExamSubmit = () => {
    setIsExamSubmitted(true);
    examQuestions.forEach((q, idx) => {
      const userAnswer = examAnswers[idx];
      if (userAnswer && userAnswer !== q.answer) {
        onAddMistake({
          id: Date.now().toString() + idx,
          topic: q.topic,
          date: new Date().toLocaleDateString(),
          question: q.question,
          yourAnswer: userAnswer,
          correctAnswer: q.answer,
          explanation: q.explanation
        });
      } else if (userAnswer === q.answer) {
        onCompleteTopic?.(q.topic);
      }
    });
  };

  const filteredPapers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return PAST_PAPERS.filter(p => p.title.toLowerCase().includes(term) || p.year.toString().includes(term) || p.season.toLowerCase().includes(term));
  }, [searchTerm]);

  if (hasSavedSession) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-fade-in">
        <Card className="relative overflow-hidden p-8 border-t-4 border-red-700 shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Save size={120} /></div>
          <div className="w-20 h-20 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
             <Clock size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Resume Session?</h2>
          <p className="text-slate-500 mb-8">You have an unfinished {mode} session from earlier.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={resumeSession}>Resume Progress <ChevronRight size={20} /></Button>
            <Button variant="outline" size="lg" onClick={clearSession}>Start Fresh <RotateCcw size={20} /></Button>
          </div>
        </Card>
      </div>
    );
  }

  // --- EXAM MODE ---
  if (mode === 'exam') {
    if (isExamSubmitted) {
      const score = examQuestions.reduce((acc, q, i) => acc + (examAnswers[i] === q.answer ? 1 : 0), 0);
      return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-20">
          <Card className="text-center py-10 bg-slate-900 text-white border-none relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10"><Award size={140}/></div>
             <h2 className="text-4xl font-black mb-2">Exam Result</h2>
             <div className="text-6xl font-black text-amber-400 mb-4">{score} / {examQuestions.length}</div>
             <p className="text-slate-400">Great effort! Review your answers below.</p>
             <div className="mt-8 flex justify-center gap-4">
               <Button onClick={clearSession}>Return to Arena</Button>
               <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={startExam}>Try Another Exam</Button>
             </div>
          </Card>
          <div className="space-y-4">
            {examQuestions.map((q, idx) => (
              <Card key={idx} className={`border-l-4 ${examAnswers[idx] === q.answer ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-slate-800">Q{idx + 1}: {q.question}</h4>
                  {examAnswers[idx] === q.answer ? <CheckCircle className="text-emerald-500" /> : <XCircle className="text-red-500" />}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="p-2 bg-slate-50 rounded">Your Answer: {examAnswers[idx] || "N/A"}</div>
                  <div className="p-2 bg-emerald-50 rounded font-bold">Correct: {q.answer}</div>
                </div>
                <p className="text-xs text-slate-500 italic bg-slate-100 p-3 rounded-lg">Explanation: {q.explanation}</p>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-20">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Timer className="text-red-700" /> Exam Mode
          </h2>
          <div className={`px-6 py-2 rounded-xl text-xl font-black shadow-lg ${examTimeRemaining < 60 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 text-white'}`}>
            {(Math.floor(examTimeRemaining / 60))}:{(examTimeRemaining % 60).toString().padStart(2, '0')}
          </div>
        </div>
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-slate-400 animate-pulse bg-white border rounded-2xl">
             <RefreshCw className="animate-spin mb-4" size={48} />
             <p className="font-black tracking-widest uppercase">Sealing the Exam Hall...</p>
          </div>
        ) : (
          <Card className="min-h-[400px] flex flex-col shadow-xl">
             <div className="flex-1">
                <div className="text-xs font-black text-slate-400 mb-4 flex items-center gap-2">
                  <Calculator size={14}/> Question {currentExamIndex + 1} of {examQuestions.length}
                </div>
                <p className="text-xl font-serif mb-8 leading-relaxed">{examQuestions[currentExamIndex]?.question}</p>
                <div className="grid gap-3">
                  {examQuestions[currentExamIndex]?.options.map((opt, i) => (
                    <button key={i} onClick={() => {
                      const newAns = [...examAnswers];
                      newAns[currentExamIndex] = opt;
                      setExamAnswers(newAns);
                    }} className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${examAnswers[currentExamIndex] === opt ? 'bg-red-50 border-red-500 text-red-900 ring-2 ring-red-100' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                      <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400">{String.fromCharCode(65 + i)}</span>
                      <span className="font-medium">{opt}</span>
                    </button>
                  ))}
                </div>
             </div>
             <div className="mt-8 flex justify-between items-center pt-6 border-t">
               <Button variant="ghost" disabled={currentExamIndex === 0} onClick={() => setCurrentExamIndex(currentExamIndex - 1)}>Prev</Button>
               {currentExamIndex === examQuestions.length - 1 ? (
                 <Button onClick={handleExamSubmit} className="bg-emerald-600">Submit Exam</Button>
               ) : (
                 <Button onClick={() => setCurrentExamIndex(currentExamIndex + 1)}>Next</Button>
               )}
             </div>
          </Card>
        )}
      </div>
    );
  }

  // --- PAST PAPERS ---
  if (mode === 'paper') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800"><History className="text-red-700" /> Mock Paper Lab</h2>
          <Button variant="outline" size="sm" onClick={() => setMode('topic')}>Back to Arena</Button>
        </div>
        {!selectedPaper ? (
          <div className="space-y-4">
             <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="Search papers..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="w-full bg-white border-2 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-red-600 shadow-sm" /></div>
             <div className="grid gap-3">
                {filteredPapers.map(p => (
                  <Card key={p.id} className="flex justify-between items-center hover:border-red-600 cursor-pointer group" onClick={()=>handleGeneratePaper(p)}>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-red-700 group-hover:text-white transition-all font-black text-slate-500">{p.year.toString().slice(2)}</div>
                       <div><h3 className="font-bold">{p.title}</h3><p className="text-[10px] font-black text-slate-400 uppercase">{p.season} • {p.difficulty}</p></div>
                    </div>
                    <Button variant="secondary" size="sm" className="group-hover:bg-red-700 group-hover:text-white">Start Mock</Button>
                  </Card>
                ))}
             </div>
          </div>
        ) : (
          <Card className="border-t-8 border-t-red-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-bold">{selectedPaper.title}</h3>
              <button onClick={()=>setSelectedPaper(null)} className="text-slate-400 hover:text-red-700 font-bold">Close Paper</button>
            </div>
            {generatingPaper ? (
              <div className="py-20 text-center animate-pulse"><RefreshCw className="animate-spin mx-auto mb-4" size={32} /> Gemini is typesetting your exam paper...</div>
            ) : (
              <div className="space-y-8 font-serif">
                {mockPaperContent.map((q, i) => (
                  <div key={i} className="animate-fade-in">
                    <div className="flex justify-between font-bold text-lg mb-2"><span>{q.number}. {q.text}</span><span>({q.marks} Marks)</span></div>
                    {q.parts.map((p:any, pi:number) => (
                      <div key={pi} className="pl-6 flex justify-between mt-2 text-slate-700"><span>{p.label} {p.text}</span><span className="italic">({p.marks})</span></div>
                    ))}
                    <div className="h-24 w-full border-b border-dotted border-slate-300 mt-4"></div>
                  </div>
                ))}
                <div className="flex justify-end pt-8 border-t border-slate-100">
                   <Button variant="secondary" onClick={()=>window.print()}><Printer size={18}/> Export to PDF</Button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    );
  }

  // --- DEFAULT PRACTICE MODE (TOPIC FOCUS) ---
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Calculator className="text-red-700"/> Elite Quiz Arena
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Current Target:</span>
            <span className="text-sm font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">{initialTopic || question?.topic || "General Practice"}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
           {/* Difficulty Toggles */}
           <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['Easy', 'Medium', 'Hard'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => {
                    setDifficulty(level);
                    fetchQuestion(undefined, level);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${difficulty === level ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {level}
                </button>
              ))}
           </div>
           
           <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>

           <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={startExam} title="Start timed exam">Exam Mode</Button>
             <Button variant="secondary" size="sm" onClick={() => setMode('paper')} title="Browse past papers">Past Papers</Button>
             <Button variant="ghost" size="sm" onClick={clearSession} title="Reset session"><RotateCcw size={16} /></Button>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center text-slate-400 animate-pulse bg-white border rounded-2xl shadow-inner">
           <div className="w-14 h-14 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mb-6"></div>
           <p className="font-bold uppercase tracking-widest text-xs">AI is drafting your {difficulty} challenge...</p>
        </div>
      ) : question ? (
        <Card className="border-l-4 border-l-red-600 relative overflow-hidden shadow-xl animate-fade-in">
           <div className="absolute top-0 right-0 flex bg-slate-50 border-b border-l rounded-bl-xl overflow-hidden">
              <div className={`px-3 py-1 text-[10px] font-black uppercase border-r ${difficulty === 'Easy' ? 'text-emerald-600 bg-emerald-50' : difficulty === 'Medium' ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50'}`}>{difficulty}</div>
              <div className="px-3 py-1 text-[10px] font-black uppercase text-purple-600 bg-purple-50 flex items-center gap-1"><Sparkles size={10} /> AI ORIGIN</div>
           </div>
           
           <div className="text-xl font-serif text-slate-800 mb-10 mt-6 leading-relaxed">
             {question.question}
           </div>

           <div className="grid gap-3">
             {question.options.map((opt, i) => (
               <button key={i} onClick={() => handleAnswer(opt)} disabled={!!feedback}
                 className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${selected === opt ? (feedback === 'correct' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-100' : 'bg-red-50 border-red-500 text-red-900 ring-2 ring-red-100') : 'bg-white border-slate-100 hover:border-red-300 hover:bg-red-50'}`}>
                 <div className="flex items-center gap-4">
                   <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">{String.fromCharCode(65 + i)}</span>
                   <span className="font-medium">{opt}</span>
                 </div>
                 {selected === opt && (feedback === 'correct' ? <CheckCircle className="text-emerald-500" /> : <XCircle className="text-red-500" />)}
               </button>
             ))}
           </div>

           {feedback && (
             <div className={`mt-8 p-6 rounded-xl animate-slide-down ${feedback === 'correct' ? 'bg-emerald-50 border-emerald-200 shadow-[0_4px_12px_rgba(16,185,129,0.1)]' : 'bg-red-50 border-red-200 shadow-[0_4px_12px_rgba(239,68,68,0.1)]'}`}>
               <h4 className="font-black text-lg mb-2 flex items-center gap-2">
                 {feedback === 'correct' ? <CheckCircle /> : <AlertTriangle />}
                 {feedback === 'correct' ? 'Excellent Execution' : 'Conceptual Misalignment'}
               </h4>
               <p className="text-sm text-slate-700 leading-relaxed italic border-l-4 border-slate-300 pl-4 mb-4">
                 {question.explanation}
               </p>
               <div className="flex justify-end gap-2">
                 <Button variant="gemini" size="sm" onClick={handleDeepDive} disabled={loadingDeepDive || !!aiDeepDive}>
                   {loadingDeepDive ? "Synthesizing..." : "Deep Dive ✨"}
                 </Button>
                 <Button size="sm" onClick={() => fetchQuestion()}>Next Challenge</Button>
               </div>
               {aiDeepDive && (
                 <div className="mt-4 p-4 bg-white/60 backdrop-blur rounded-lg border border-indigo-200 text-sm text-slate-800 animate-fade-in shadow-inner">
                   <div className="font-black text-indigo-700 mb-2 flex items-center gap-1">
                     <Sparkles size={14}/> TUTOR LOGIC
                   </div>
                   {aiDeepDive}
                 </div>
               )}
             </div>
           )}
        </Card>
      ) : (
        <div className="text-center py-20 bg-slate-100 rounded-3xl border-4 border-dashed border-slate-200">
           <Calculator className="mx-auto mb-4 opacity-10" size={64} />
           <p className="text-slate-400 font-bold">System initialised. Requesting content from Gemini...</p>
           <Button className="mt-4" onClick={()=>fetchQuestion()}>Force Initialise</Button>
        </div>
      )}
    </div>
  );
};

export default QuizArena;
