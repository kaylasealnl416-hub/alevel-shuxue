
import React, { useState, useEffect } from 'react';
import { Card, Button } from './UI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';
import { getStudyPlan } from '../services/geminiService';

const progressData = [
  { day: 'Mon', hours: 2 },
  { day: 'Tue', hours: 3.5 },
  { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 4 },
  { day: 'Fri', hours: 3 },
  { day: 'Sat', hours: 5 },
  { day: 'Sun', hours: 4.5 },
];

const Dashboard: React.FC = () => {
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const cleanText = (text: string) => {
    if (!text) return "";
    return text.replace(/[\$\*]/g, '').trim();
  };

  const handleGeneratePlan = async () => {
    setLoadingPlan(true);
    try {
      const plan = await getStudyPlan("P1: 85%, P2: 62% (Weak Trigonometry), S1: 91%");
      if (plan) setStudyPlan(cleanText(plan));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlan(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Elite Scholar Dashboard</h2>
          <p className="text-slate-500 mt-1">LSE Economics Target: A*A*A*</p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-sm text-slate-500">Predicted Grade</div>
          <div className="text-4xl font-black text-red-700">A*</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-red-600" /> Cognitive Intensity (Weekly)
          </h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#b91c1c" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#b91c1c', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
             </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 flex flex-col">
          <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-purple-600" /> AI Strategic Planner
          </h3>
          <div className="flex-1 text-sm text-indigo-800 space-y-3">
             {studyPlan ? (
               <div className="animate-fade-in whitespace-pre-wrap leading-relaxed bg-white/50 p-3 rounded-lg border border-indigo-100">
                 {studyPlan}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-indigo-400 text-center p-4">
                 <Brain size={48} className="mb-4 opacity-20" />
                 <p className="font-medium">Your Pure Math 2 needs immediate attention before the mock exams.</p>
                 <p className="text-xs mt-2 opacity-70">Ready for a recovery strategy?</p>
               </div>
             )}
          </div>
          <Button variant="gemini" className="mt-4 w-full" onClick={handleGeneratePlan} disabled={loadingPlan}>
            {loadingPlan ? "Calculating..." : studyPlan ? "Update Strategy" : "Generate Strategy ✨"}
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'P1 Grade', val: '85%', color: 'blue', desc: 'Secure' },
           { label: 'P2 Grade', val: '62%', color: 'indigo', desc: 'Critical' },
           { label: 'S1 Grade', val: '91%', color: 'emerald', desc: 'Mastery' },
           { label: 'Weak Points', val: '12', color: 'orange', desc: 'Unresolved' }
         ].map((stat, i) => (
           <div key={i} className={`bg-${stat.color}-50 p-4 rounded-xl border border-${stat.color}-100`}>
             <div className={`text-${stat.color}-600 font-bold text-sm uppercase tracking-wider`}>{stat.label}</div>
             <div className={`text-3xl font-black mt-1 text-${stat.color}-900`}>{stat.val}</div>
             <div className={`text-xs text-${stat.color}-500 mt-1 font-medium`}>{stat.desc}</div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Dashboard;
