
import React, { useState } from 'react';
import { Card, Button } from './UI';
import { AlertTriangle, Trash2, Brain, Sparkles, X, ChevronRight } from 'lucide-react';
import { getDiagnosticReport } from '../services/geminiService';
import { Mistake } from '../types';

interface MistakeBookProps {
  mistakes: Mistake[];
  onDelete: (id: string) => void;
  onRetry: (topic: string) => void;
}

const MistakeBook: React.FC<MistakeBookProps> = ({ mistakes, onDelete, onRetry }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const generateReport = async () => {
    setLoadingReport(true);
    try {
      const data = await getDiagnosticReport(mistakes.slice(0, 10));
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <AlertTriangle className="text-orange-500" /> Cognitive Error Analysis
        </h2>
        <div className="flex gap-2">
           {mistakes.length > 0 && (
             <Button variant="gemini" size="sm" onClick={generateReport} disabled={loadingReport}>
               {loadingReport ? "Analyzing..." : "AI Diagnostic Report ✨"}
             </Button>
           )}
           <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black flex items-center">
             {mistakes.length} LOGGED ERRORS
           </span>
        </div>
      </div>

      {report && (
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Brain size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-amber-400 flex items-center gap-2">
                <Sparkles size={20} /> AI DIAGNOSTIC INSIGHT
              </h3>
              <button onClick={() => setReport(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {report}
            </div>
          </div>
        </Card>
      )}

      {mistakes.length === 0 ? (
        <div className="text-center py-20 bg-slate-100 rounded-xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">Clear sheet. No cognitive errors identified yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {mistakes.map((m) => (
            <Card key={m.id} className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.topic} • {m.date}</span>
                  <h3 className="font-bold text-slate-800 mt-1">{m.question}</h3>
                </div>
                <button onClick={() => onDelete(m.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <span className="text-[10px] font-black text-red-700 uppercase">Your Answer</span>
                  <p className="text-sm font-bold text-red-900 mt-1">{m.yourAnswer}</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <span className="text-[10px] font-black text-emerald-700 uppercase">Correct Mapping</span>
                  <p className="text-sm font-bold text-emerald-900 mt-1">{m.correctAnswer}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                 <p className="text-xs text-slate-500 italic flex-1 mr-4">
                   Explanation: {m.explanation.slice(0, 80)}...
                 </p>
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   className="text-xs text-red-700 hover:text-red-800 font-bold"
                   onClick={() => onRetry(m.topic)}
                 >
                   Retry Topic <ChevronRight size={14}/>
                 </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MistakeBook;
