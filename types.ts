
export enum ViewType {
  DASHBOARD = 'dashboard',
  COURSE = 'course',
  QUIZ = 'quiz',
  MISTAKES = 'mistakes'
}

export interface Mistake {
  id: string;
  topic: string;
  date: string;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export interface Chapter {
  id: string;
  title: string;
  videoId: string;
  topics: string[];
  videoGuide?: {
    structure: string[];
    coreContent: string;
    tips: string[];
  };
  details?: {
    keyPoints: string[];
    formulas: string[];
    concepts: { term: string; def: string }[];
  };
}

export interface SubjectData {
  title: string;
  color: string;
  bg: string;
  chapters: Chapter[];
}

export interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  topic: string;
  isAi?: boolean;
}

export interface PastPaper {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  year: number;
  season: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface QuizSessionState {
  mode: 'topic' | 'paper' | 'exam';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: Question | null;
  selected: string | null;
  feedback: 'correct' | 'wrong' | null;
  aiDeepDive: string | null;
  selectedPaper: PastPaper | null;
  mockPaperContent: any[];
  examQuestions?: Question[];
  examAnswers?: (string | null)[];
  examTimeRemaining?: number;
  isExamSubmitted?: boolean;
  currentExamIndex?: number;
}
