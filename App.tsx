import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BookOpen, PlayCircle, BrainCircuit, FileText, 
  History, Target, CheckCircle, XCircle, ChevronRight, 
  ArrowLeft, Clock, Award, Search, AlertCircle
} from 'lucide-react';

// ==========================================
// 1. 数据结构预设 (P1, P2, S1 教材核心大纲)
// ==========================================
const SYLLABUS = {
  P1: {
    title: "Pure Mathematics 1 (P1)",
    chapters: [
      { id: "p1-1", title: "Algebraic Expressions", overview: "代数表达式的基础，包括指数定律、展开括号、因式分解和有理化分母。", formulas: ["a^m \\times a^n = a^{m+n}", "(x+a)(x+b) = x^2 + (a+b)x + ab"], videoSearch: "Edexcel IAL Pure Math 1 Algebraic Expressions" },
      { id: "p1-2", title: "Quadratics", overview: "二次函数的解法、图像、配方法以及判别式的应用。", formulas: ["x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", "b^2 - 4ac"], videoSearch: "Edexcel IAL Pure Math 1 Quadratics" },
      { id: "p1-3", title: "Equations and Inequalities", overview: "联立方程组（一次与二次）以及线性、二次不等式的解法。", formulas: [], videoSearch: "Edexcel IAL Pure Math 1 Equations and Inequalities" },
      { id: "p1-4", title: "Graphs and Transformations", overview: "常见函数图像（三次、倒数）及其平移、缩放变换。", formulas: ["y = f(x+a)", "y = af(x)"], videoSearch: "Edexcel IAL Pure Math 1 Graphs and Transformations" },
      { id: "p1-5", title: "Straight Line Graphs", overview: "直线方程、平行线与垂直线、两点间距离及中点公式。", formulas: ["y - y_1 = m(x - x_1)", "m_1 \\times m_2 = -1"], videoSearch: "Edexcel IAL Pure Math 1 Straight Line Graphs" },
      { id: "p1-6", title: "Trigonometric Ratios", overview: "正弦定理、余弦定理、三角形面积公式。", formulas: ["\\frac{a}{\\sin A} = \\frac{b}{\\sin B}", "a^2 = b^2 + c^2 - 2bc \\cos A", "\\text{Area} = \\frac{1}{2}ab \\sin C"], videoSearch: "Edexcel IAL Pure Math 1 Trigonometric Ratios" },
      { id: "p1-7", title: "Radians", overview: "弧度制，扇形弧长与面积的计算。", formulas: ["l = r\\theta", "\\text{Area} = \\frac{1}{2}r^2\\theta"], videoSearch: "Edexcel IAL Pure Math 1 Radians" },
      { id: "p1-8", title: "Differentiation", overview: "导数的基础概念，求导法则，切线与法线方程。", formulas: ["f'(x) = nx^{n-1}"], videoSearch: "Edexcel IAL Pure Math 1 Differentiation" },
      { id: "p1-9", title: "Integration", overview: "不定积分基础，寻找原函数。", formulas: ["\\int x^n dx = \\frac{x^{n+1}}{n+1} + c"], videoSearch: "Edexcel IAL Pure Math 1 Integration" }
    ]
  },
  P2: {
    title: "Pure Mathematics 2 (P2)",
    chapters: [
      { id: "p2-1", title: "Algebraic Methods", overview: "代数分式、代数除法、因子定理和余数定理。", formulas: ["f(a)=0 \\implies (x-a) \\text{ is a factor}"], videoSearch: "Edexcel IAL Pure Math 2 Algebraic Methods" },
      { id: "p2-2", title: "Coordinate Geometry in the (x,y) plane", overview: "圆的方程，圆与直线的相交，切线特性。", formulas: ["(x-a)^2 + (y-b)^2 = r^2"], videoSearch: "Edexcel IAL Pure Math 2 Coordinate Geometry" },
      { id: "p2-3", title: "Exponentials and Logarithms", overview: "指数函数、对数定律、解指数方程。", formulas: ["\\log_a x + \\log_a y = \\log_a(xy)", "a^x = b \\implies x = \\frac{\\log_c b}{\\log_c a}"], videoSearch: "Edexcel IAL Pure Math 2 Exponentials and Logarithms" },
      { id: "p2-4", title: "Binomial Expansion", overview: "二项式展开及其应用。", formulas: ["(a+b)^n = a^n + \\binom{n}{1}a^{n-1}b + ..."], videoSearch: "Edexcel IAL Pure Math 2 Binomial Expansion" },
      { id: "p2-5", title: "Sequences and Series", overview: "等差数列、等比数列，求和公式及收敛性。", formulas: ["u_n = a + (n-1)d", "S_n = \\frac{n}{2}(2a + (n-1)d)", "u_n = ar^{n-1}", "S_\\infty = \\frac{a}{1-r}"], videoSearch: "Edexcel IAL Pure Math 2 Sequences and Series" },
      { id: "p2-6", title: "Trigonometric Identities", overview: "三角恒等式，解给定区间内的三角方程。", formulas: ["\\sin^2\\theta + \\cos^2\\theta = 1", "\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}"], videoSearch: "Edexcel IAL Pure Math 2 Trigonometric Identities" },
      { id: "p2-7", title: "Differentiation", overview: "导数的应用：判断增减性，驻点性质，最大值最小值问题。", formulas: ["f''(x) > 0 \\implies \\text{Minimum}"], videoSearch: "Edexcel IAL Pure Math 2 Differentiation Applications" },
      { id: "p2-8", title: "Integration", overview: "定积分，利用积分计算曲线下方的面积，梯形法则。", formulas: ["\\int_a^b f(x) dx = F(b) - F(a)"], videoSearch: "Edexcel IAL Pure Math 2 Integration Area Trapezium" }
    ]
  },
  S1: {
    title: "Statistics 1 (S1)",
    chapters: [
      { id: "s1-1", title: "Mathematical Models in Probability", overview: "概率模型的基础，实验，结果，事件。", formulas: ["P(A^\\prime) = 1 - P(A)"], videoSearch: "Edexcel IAL Statistics 1 Probability Models" },
      { id: "s1-2", title: "Representation and Summary of Data", overview: "直方图、茎叶图、箱线图。集中趋势（均值、中位数、众数）和离散度（方差、标准差）。", formulas: ["\\bar{x} = \\frac{\\sum x}{n}", "\\sigma = \\sqrt{\\frac{\\sum x^2}{n} - \\bar{x}^2}"], videoSearch: "Edexcel IAL Statistics 1 Data Summary" },
      { id: "s1-3", title: "Probability", overview: "互斥事件、独立事件，条件概率，树状图。", formulas: ["P(A \\cup B) = P(A) + P(B) - P(A \\cap B)", "P(A|B) = \\frac{P(A \\cap B)}{P(B)}"], videoSearch: "Edexcel IAL Statistics 1 Probability Rules" },
      { id: "s1-4", title: "Correlation and Regression", overview: "散点图，乘积矩相关系数（PMCC），线性回归方程。", formulas: ["r = \\frac{S_{xy}}{\\sqrt{S_{xx}S_{yy}}}", "y = a + bx"], videoSearch: "Edexcel IAL Statistics 1 Correlation Regression" },
      { id: "s1-5", title: "Discrete Random Variables", overview: "离散随机变量的概率分布，期望值 E(X) 和方差 Var(X)。", formulas: ["E(X) = \\sum x P(X=x)", "Var(X) = E(X^2) - (E(X))^2"], videoSearch: "Edexcel IAL Statistics 1 Discrete Random Variables" },
      { id: "s1-6", title: "The Normal Distribution", overview: "正态分布的性质，标准化公式，查表求概率。", formulas: ["Z = \\frac{X - \\mu}{\\sigma}"], videoSearch: "Edexcel IAL Statistics 1 Normal Distribution" }
    ]
  }
};

// ==========================================
// 2.API 调用服务 （Gemini）
// ==========================================
const apiKey = ""; // 执行环境将提供此 Key。

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, options, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    // 修复 Bug：原来的代码写成了 试试{
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      if (i === maxRetries - 1) throw e;
      await sleep(1000 * Math.pow(2, i));
    }
  }
}

async function generateAIQuestions(topic, count, difficulty, isExam = false) {
  if (!apiKey) {
      console.warn("No API key provided, returning mock data.");
      return mockQuestions(count, difficulty);
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const prompt = `
    You are an expert A-Level Mathematics teacher specializing in the Edexcel IAL curriculum.
    Generate a JSON array of ${count} multiple-choice questions for the topic: "${topic}".
    The difficulty should be: ${difficulty} (Medium: standard exam level, Hard: A* differentiation level).
    ${isExam ? "This is for a full simulation exam, integrate multiple concepts if possible." : ""}
    
    CRITICAL INSTRUCTIONS FOR MATH FORMATTING:
    - Use clear LaTeX formatting for ALL math expressions.
    - Wrap inline math in \\( and \\).
    - Wrap block math in \\[ and \\].
    - ALWAYS double escape backslashes in your JSON strings. For example, \\frac should be \\\\frac, \\sqrt should be \\\\sqrt, \\int should be \\\\int.
    
    Respond STRICTLY with a valid JSON array. DO NOT wrap in markdown \`\`\`json blocks. Just the raw JSON array using this schema:
    [
      {
        "question": "The question text here, e.g., Find the derivative of \\\\( y = 3x^2 + 2x \\\\).",
        "options": ["\\\\( 6x + 2 \\\\)", "\\\\( 3x + 2 \\\\)", "\\\\( 6x^2 \\\\)", "\\\\( 6x \\\\)"],
        "correctIndex": 0,
        "explanation": "Detailed step-by-step explanation. E.g., Using the power rule...",
        "knowledgePoint": "Power Rule Differentiation"
      }
    ]
  `;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  };

  try {
    const data = await fetchWithRetry(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResult) throw new Error("Empty response from AI");
    
    textResult = textResult.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(textResult);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return mockQuestions(count, difficulty);
  }
}

function mockQuestions(count, difficulty) {
  return Array.from({ length: count }).map((_, i) => ({
    question: `(Mock Data ${difficulty}) Calculate the value of \\( x \\) if \\( 2x + ${i} = 10 \\).`,
    options: [`\\( ${ (10 - i) / 2 } \\)`, `\\( ${ (10 + i) / 2 } \\)`, `\\( 5 \\)`, `\\( 0 \\)`],
    correctIndex: 0,
    explanation: `To solve \\( 2x + ${i} = 10 \\), subtract ${i} from both sides, then divide by 2.`,
    knowledgePoint: "Linear Equations"
  }));
}

// ==========================================
// 3. UI 组件与主应用
// ==========================================

export default function App() {
  const [view, setView] = useState('dashboard');
  const [activeModule, setActiveModule] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  
  // Quiz/Exam State
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizStatus, setQuizStatus] = useState('idle');
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  const [mistakes, setMistakes] = useState([]);

  // Inject MathJax
  useEffect(() => {
    if (!document.getElementById('mathjax-script')) {
      const script = document.createElement('script');
      script.id = 'mathjax-script';
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Trigger MathJax re-render
  useEffect(() => {
    const timerId = setTimeout(() => {
      // 增加安全检查防崩溃
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise().catch((err) => console.error(err));
      }
    }, 100);
    return () => clearTimeout(timerId);
  }, [view, activeModule, activeChapter, currentQIndex, quizStatus, mistakes]);

  // 修复闭包陷阱：使用 useCallback 包裹 submitQuiz，确保读取到最新的 userAnswers 状态
  const submitQuiz = useCallback(() => {
    setQuizStatus('review');
    const newMistakes = [];
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] !== q.correctIndex) {
        newMistakes.push({
          ...q,
          userSelected: userAnswers[idx] !== undefined ? userAnswers[idx] : -1,
          timestamp: new Date().toISOString(),
          module: activeModule || "Comprehensive Exam",
          chapter: activeChapter?.title || "Mixed Topics"
        });
      }
    });
    setMistakes(prev => [...prev, ...newMistakes]);
  }, [quizQuestions, userAnswers, activeModule, activeChapter]);

  // Timer Effect 优化：时间到时安全交卷
  useEffect(() => {
    let timer;
    if (quizStatus === 'active' && timeRemaining > 0) {
      timer = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
    } else if (timeRemaining === 0 && quizStatus === 'active' && quizConfig?.isExam) {
      submitQuiz(); // 这里安全调用
    }
    return () => clearInterval(timer);
  }, [quizStatus, timeRemaining, quizConfig, submitQuiz]);

  const goHome = () => { setView('dashboard'); setActiveModule(null); setActiveChapter(null); };
  const goModule = (mod) => { setActiveModule(mod); setView('module'); };
  const goChapter = (chap) => { setActiveChapter(chap); setView('chapter'); };
  
  const startQuiz = async (topic, count, difficulty, isExam = false, timeLimitMinutes = 0) => {
    setQuizConfig({ topic, count, difficulty, isExam });
    setQuizStatus('loading');
    setView('quiz');
    
    const questions = await generateAIQuestions(topic, count, difficulty, isExam);
    setQuizQuestions(questions);
    setUserAnswers({});
    setCurrentQIndex(0);
    setTimeRemaining(timeLimitMinutes > 0 ? timeLimitMinutes * 60 : 0);
    setQuizStatus('active');
  };

  const handleAnswer = (qIndex, oIndex) => {
    if (quizStatus !== 'active') return;
    setUserAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
  };

  const handleManualSubmit = () => {
    if (Object.keys(userAnswers).length < quizQuestions.length && timeRemaining > 0) {
      if (!window.confirm("您还有未作答的题目，确定要交卷吗？")) return;
    }
    submitQuiz();
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-10">
          <BookOpen className="w-64 h-64" />
        </div>
        <h1 className="text-3xl font-bold mb-3 relative z-10">欢迎来到 A-Level 核心学习系统</h1>
        <p className="text-blue-100 opacity-90 relative z-10 max-w-2xl">
          专为冲击 A* 打造。系统紧贴 Edexcel 考纲，提供智能考点梳理、名师视频映射、AI 自适应测验与智能错题追踪。
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-800 flex items-center mt-8 px-2">
        <BookOpen className="mr-2 text-blue-600" /> 选择学习模块 (基于标准教材)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(SYLLABUS).map(([key, data]) => (
          <div 
            key={key} 
            onClick={() => goModule(key)}
            className="bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
              {key}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{data.title}</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">包含 {data.chapters.length} 个核心章节的学习与真题测验</p>
            <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              进入模块学习 <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div 
          onClick={() => setView('mistakes')}
          className="bg-white border border-rose-100 rounded-2xl p-6 cursor-pointer shadow-sm hover:shadow-xl hover:border-rose-300 transition-all flex items-center group"
        >
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
            <History className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">专属错题本</h3>
            <p className="text-sm text-gray-500 mt-1">目前累计收录 <span className="font-bold text-rose-500">{mistakes.length}</span> 道错题，支持针对性重练</p>
          </div>
        </div>

        <div 
          onClick={() => startQuiz("Edexcel IAL Math P1 P2 S1 Mixed Past Paper Style", 10, "Hard", true, 30)}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 cursor-pointer shadow-md hover:shadow-xl transition-all flex items-center text-white group"
        >
          <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
            <Target className="w-7 h-7 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">AI 全仿真题大考</h3>
            <p className="text-sm text-slate-300 mt-1">综合 P1/P2/S1，限时 30 分钟，智能判卷评分</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModuleView = () => {
    const mod = SYLLABUS[activeModule];
    return (
      <div className="animate-fade-in pb-10">
        <button onClick={goHome} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" /> 返回主面板
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{mod.title} 学习路径</h1>
          <p className="text-gray-600">知识点已根据考纲精确拆分，建议按顺序完成章节学习与小测。</p>
        </div>
        
        <div className="space-y-4">
          {mod.chapters.map((chap, idx) => (
            <div key={chap.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg transition-all duration-300">
              <div className="flex-1 pr-6">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">CH {idx + 1}</span>
                  <h3 className="text-lg font-bold text-gray-800">{chap.title}</h3>
                </div>
                <p className="text-sm text-gray-500">{chap.overview}</p>
              </div>
              <div className="mt-5 md:mt-0 flex flex-wrap gap-3">
                <button 
                  onClick={() => goChapter(chap)}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> 学习此章
                </button>
                <button 
                  onClick={() => startQuiz(`Edexcel A-Level Math ${activeModule} ${chap.title}`, 5, "Medium")}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-sm hover:shadow"
                >
                  <BrainCircuit className="w-4 h-4 mr-2" /> 章节小测
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderChapterView = () => {
    if (!activeChapter) return null;
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(activeChapter.videoSearch)}`;
    
    return (
      <div className="animate-fade-in pb-10">
        <button onClick={() => goModule(activeModule)} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" /> 返回 {activeModule} 目录
        </button>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="text-blue-200 font-semibold mb-2">{activeModule} 核心章节</div>
            <h1 className="text-3xl font-bold mb-2">{activeChapter.title}</h1>
          </div>
          
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
              <FileText className="w-5 h-5 mr-2 text-blue-500" /> 知识点概述与难点
            </h2>
            <div className="text-gray-700 leading-relaxed mb-8 bg-slate-50 border border-slate-100 p-5 rounded-2xl">
              {activeChapter.overview}
            </div>

            {activeChapter.formulas.length > 0 && (
              <>
                <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                  <BookOpen className="w-5 h-5 mr-2 text-purple-500" /> 核心公式与定理
                </h2>
                <div className="bg-purple-50/50 border border-purple-100 p-6 rounded-2xl mb-8 space-y-4">
                  {activeChapter.formulas.map((f, i) => (
                    <div key={i} className="text-xl text-center font-serif text-gray-800 bg-white py-4 px-2 rounded-xl shadow-sm border border-purple-50 overflow-x-auto">
                      {`\\[ ${f} \\]`}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              <div className="border border-red-100 bg-gradient-to-b from-red-50 to-white p-6 rounded-2xl text-center hover:shadow-md transition-shadow">
                <PlayCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-800 mb-2 text-lg">名师精讲视频</h3>
                <p className="text-sm text-gray-500 mb-6">已自动为您匹配 YouTube 上最符合本章节的 A-Level 教学资源。</p>
                <a 
                  href={searchUrl} target="_blank" rel="noreferrer"
                  className="inline-block px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-sm w-full md:w-auto"
                >
                  去 YouTube 听课
                </a>
              </div>
              
              <div className="border border-indigo-100 bg-gradient-to-b from-indigo-50 to-white p-6 rounded-2xl text-center hover:shadow-md transition-shadow">
                <BrainCircuit className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-800 mb-2 text-lg">AI 动态题库生成</h3>
                <p className="text-sm text-gray-500 mb-6">由 AI 分析考纲动态出题，题目无限生成，支持分难度训练。</p>
                <div className="flex flex-col space-y-3">
                  <button onClick={() => startQuiz(`Edexcel A-Level Math ${activeModule} ${activeChapter.title}`, 5, "Medium")} className="w-full px-4 py-3 bg-white border border-indigo-200 text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                    标准难度训练 (5题)
                  </button>
                  <button onClick={() => startQuiz(`Edexcel A-Level Math ${activeModule} ${activeChapter.title}`, 5, "Hard")} className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                    A* 冲刺难度 (5题)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuizView = () => {
    if (quizStatus === 'loading') {
      return (
        <div className="flex flex-col items-center justify-center h-80 animate-pulse">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <BrainCircuit className="w-10 h-10 text-blue-600 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI 正在为您定制题目...</h2>
          <p className="text-gray-500">正在分析 Edexcel 历年真题模型并生成独一无二的试卷</p>
        </div>
      );
    }

    if (quizStatus === 'review') {
      const score = quizQuestions.reduce((acc, q, i) => acc + (userAnswers[i] === q.correctIndex ? 1 : 0), 0);
      const passRate = (score / quizQuestions.length) * 100;
      
      return (
        <div className="animate-fade-in max-w-4xl mx-auto pb-10">
          <div className="bg-white rounded-3xl p-8 text-center mb-8 shadow-sm border border-gray-100">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${passRate >= 80 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
              <Award className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">测试评分完成</h1>
            <div className="text-5xl font-black text-blue-600 mb-2">{score} <span className="text-2xl text-gray-400">/ {quizQuestions.length}</span></div>
            {passRate < 100 ? (
               <p className="text-sm text-rose-500 bg-rose-50 inline-block px-4 py-1.5 rounded-full font-medium mt-2">做错的题目已自动加入您的错题本</p>
            ) : (
               <p className="text-sm text-green-600 bg-green-50 inline-block px-4 py-1.5 rounded-full font-medium mt-2">完美！全部正确，请继续保持！</p>
            )}
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q, i) => {
              const userAnswerIndex = userAnswers[i];
              const isCorrect = userAnswerIndex === q.correctIndex;
              const isUnanswered = userAnswerIndex === undefined || userAnswerIndex === -1;
              
              return (
                <div key={i} className={`p-6 md:p-8 rounded-2xl border bg-white shadow-sm ${isCorrect ? 'border-green-200' : isUnanswered ? 'border-orange-200' : 'border-rose-200'}`}>
                  <div className="flex items-start">
                    <div className="mt-1 mr-4 flex-shrink-0">
                      {isCorrect ? <CheckCircle className="w-7 h-7 text-green-500" /> : 
                       isUnanswered ? <AlertCircle className="w-7 h-7 text-orange-400" /> :
                       <XCircle className="w-7 h-7 text-rose-500" />}
                    </div>
                    <div className="flex-1 w-full overflow-hidden">
                      <div className="mb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Question {i+1}</div>
                      <h3 className="font-medium text-gray-800 mb-5 text-lg leading-relaxed">{q.question}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                        {q.options.map((opt, oIdx) => {
                          let itemClass = "p-4 rounded-xl border transition-colors ";
                          if (q.correctIndex === oIdx) {
                            itemClass += "bg-green-50 border-green-300 shadow-inner";
                          } else if (userAnswerIndex === oIdx && !isCorrect) {
                            itemClass += "bg-rose-50 border-rose-300 shadow-inner";
                          } else {
                            itemClass += "bg-gray-50 border-gray-200 opacity-60";
                          }
                          return (
                            <div key={oIdx} className={itemClass}>
                              <div className="flex items-center">
                                <span className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 text-sm flex-shrink-0 ${q.correctIndex === oIdx ? 'bg-green-500 border-green-500 text-white' : userAnswerIndex === oIdx ? 'bg-rose-500 border-rose-500 text-white' : 'border-gray-300 text-gray-500'}`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span className="overflow-x-auto">{opt}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl text-sm text-gray-700 mt-4 shadow-sm">
                        <div className="flex items-center font-bold text-indigo-700 mb-2">
                           <BrainCircuit className="w-4 h-4 mr-1.5"/> AI 深度解析
                        </div>
                        <div className="leading-relaxed overflow-x-auto">{q.explanation}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
            <button onClick={() => setView(activeChapter ? 'chapter' : 'dashboard')} className="w-full md:w-auto px-8 py-3.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
              返回学习路径
            </button>
            <button onClick={() => setView('mistakes')} className="w-full md:w-auto px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center">
              <History className="w-5 h-5 mr-2" /> 立即查看错题本
            </button>
          </div>
        </div>
      );
    }

    const q = quizQuestions[currentQIndex];
    if (!q) return null;

    return (
      <div className="max-w-3xl mx-auto animate-fade-in pb-10">
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-200 mb-6 flex items-center justify-between sticky top-20 z-40">
          <div className="flex-1 mr-6">
            <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
              <span>进度: 第 {currentQIndex + 1} 题</span>
              <span>共 {quizQuestions.length} 题</span>
            </div>
            <div className="bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-500 ease-out rounded-full" style={{ width: `${((currentQIndex + 1) / quizQuestions.length) * 100}%` }}></div>
            </div>
          </div>
          
          {timeRemaining > 0 && (
            <div className={`flex items-center font-mono font-bold px-4 py-2 rounded-xl border flex-shrink-0 ${timeRemaining < 300 ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
              <Clock className="w-5 h-5 mr-2" /> {formatTime(timeRemaining)}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-6 md:p-10">
          <div className="mb-4 inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-lg border border-indigo-100">
            考点: {q.knowledgePoint || "A-Level Math Concept"}
          </div>
          
          <h2 className="text-xl md:text-2xl font-medium text-gray-800 mb-8 leading-relaxed overflow-x-auto">
            {q.question}
          </h2>

          <div className="space-y-4">
            {q.options.map((opt, idx) => {
              const isSelected = userAnswers[currentQIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(currentQIndex, idx)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 group ${isSelected ? 'border-blue-600 bg-blue-50/50 shadow-md transform scale-[1.01]' : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 text-sm font-bold flex-shrink-0 transition-colors ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-400 group-hover:border-blue-300 group-hover:text-blue-500'}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-gray-800 text-lg overflow-x-auto">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
            <button 
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="px-6 py-3 text-gray-500 hover:bg-gray-100 font-medium rounded-xl disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              上一题
            </button>
            
            {currentQIndex === quizQuestions.length - 1 ? (
              <button 
                onClick={handleManualSubmit} // 修复：这里调用修改后的 handleManualSubmit
                className={`px-8 py-3 font-bold rounded-xl transition-all shadow-md ${userAnswers[currentQIndex] === undefined ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
              >
                交卷评分
              </button>
            ) : (
              <button 
                onClick={() => setCurrentQIndex(prev => prev + 1)}
                className={`px-8 py-3 font-bold rounded-xl transition-all shadow-md flex items-center ${userAnswers[currentQIndex] === undefined ? 'bg-gray-200 text-gray-500 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                下一题 <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMistakesView = () => (
    <div className="animate-fade-in pb-10">
      <div className="flex justify-between items-center mb-8">
        <button onClick={goHome} className="flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" /> 返回主面板
        </button>
        <div className="flex items-center bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 text-rose-600 font-bold">
          <History className="w-5 h-5 mr-2" /> 共 {mistakes.length} 道错题
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">专属错题本</h1>
        <p className="text-gray-600">系统已自动为您收录做错的题目。建议定期重做相似题以巩固薄弱知识点。</p>
      </div>

      {mistakes.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">太棒了！暂无错题</h2>
          <p className="text-gray-500">您的掌握情况非常好，继续保持！</p>
        </div>
      ) : (
        <div className="space-y-8">
          {[...mistakes].reverse().map((m, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center text-sm text-gray-500 font-medium">
                <span className="flex items-center text-slate-700">
                  <BookOpen className="w-4 h-4 mr-2" /> {m.module} - {m.chapter}
                </span>
                <span className="mt-2 sm:mt-0 text-slate-400">收录于: {new Date(m.timestamp).toLocaleString()}</span>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="mb-3 inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-lg">考点: {m.knowledgePoint}</div>
                <h3 className="text-xl font-medium text-gray-800 mb-6 leading-relaxed overflow-x-auto">{m.question}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl flex flex-col">
                    <span className="font-bold text-rose-600 text-sm mb-2 flex items-center">
                       <XCircle className="w-4 h-4 mr-1" /> 您的错解
                    </span> 
                    <span className="text-gray-800 text-lg mt-auto overflow-x-auto">{m.userSelected !== -1 && m.options[m.userSelected] ? m.options[m.userSelected] : "未作答"}</span>
                  </div>
                  <div className="bg-green-50/50 border border-green-100 p-5 rounded-2xl flex flex-col">
                    <span className="font-bold text-green-600 text-sm mb-2 flex items-center">
                       <CheckCircle className="w-4 h-4 mr-1" /> 标准答案
                    </span> 
                    <span className="text-gray-800 text-lg mt-auto overflow-x-auto">{m.options[m.correctIndex]}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-700 bg-slate-50 border border-slate-100 p-5 rounded-2xl shadow-inner">
                  <span className="font-bold text-indigo-700 block mb-2 text-base">深度解析:</span> 
                  <span className="leading-relaxed block overflow-x-auto">{m.explanation}</span>
                </div>
                
                <div className="mt-8 text-right border-t border-gray-100 pt-6">
                  <button 
                    onClick={() => startQuiz(`Edexcel A-Level Math similar to: ${m.knowledgePoint}`, 3, "Hard")}
                    className="w-full md:w-auto px-6 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors inline-flex items-center justify-center border border-indigo-200"
                  >
                    <Search className="w-5 h-5 mr-2" /> 根据此考点 AI 生成 3 道相似题
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-200 text-gray-900">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200/80 sticky top-0 z-50 backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer group" onClick={goHome}>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-md group-hover:scale-105 transition-transform">
                <span className="text-white font-bold font-serif italic text-lg">A*</span>
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">Elite Prep Math</span>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setView('mistakes')} 
                className="text-gray-600 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg font-medium flex items-center transition-all"
              >
                <History className="w-4 h-4 mr-1.5" /> 错题本
                {mistakes.length > 0 && (
                  <span className="ml-2 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {mistakes.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {view === 'dashboard' && renderDashboard()}
        {view === 'module' && renderModuleView()}
        {view === 'chapter' && renderChapterView()}
        {view === 'quiz' && renderQuizView()}
        {view === 'mistakes' && renderMistakesView()}
      </main>
    </div>
  );
}
