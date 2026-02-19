const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

const getApiUrl = (model: string, apiKey: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

type GeminiSchema = Record<string, unknown>;
type GeminiValidator<T> = (value: unknown) => value is T;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const hasStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const requestGemini = async <T = string>(
  model: string,
  prompt: string,
  expectsJson = false,
  responseSchema?: GeminiSchema,
  validator?: GeminiValidator<T>
): Promise<T> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing Gemini API key. Set VITE_GEMINI_API_KEY (recommended) or GEMINI_API_KEY.");
  }

  const response = await fetch(getApiUrl(model, apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: expectsJson
        ? {
            responseMimeType: "application/json",
            ...(responseSchema ? { responseSchema } : {}),
          }
        : undefined,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini API returned an empty response.");
  }

  if (!expectsJson) return text as T;

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Gemini JSON parse failed. Raw response: ${text}`);
  }

  if (validator && !validator(parsed)) {
    throw new Error(`Gemini JSON validation failed. Raw response: ${text}`);
  }

  return parsed as T;
};

const quizQuestionSchema: GeminiSchema = {
  type: "OBJECT",
  required: ["question", "options", "answer", "explanation"],
  properties: {
    question: { type: "STRING" },
    options: {
      type: "ARRAY",
      minItems: 2,
      items: { type: "STRING" },
    },
    answer: { type: "STRING" },
    explanation: { type: "STRING" },
  },
};

const examBatchSchema: GeminiSchema = {
  type: "ARRAY",
  minItems: 1,
  items: quizQuestionSchema,
};

const videoAnalysisSchema: GeminiSchema = {
  type: "OBJECT",
  required: ["synopsis", "knowledgePoints", "examinerTips", "formulaVault"],
  properties: {
    synopsis: { type: "STRING" },
    knowledgePoints: { type: "ARRAY", items: { type: "STRING" } },
    examinerTips: { type: "ARRAY", items: { type: "STRING" } },
    formulaVault: { type: "ARRAY", items: { type: "STRING" } },
  },
};

const mockPaperQuestionSchema: GeminiSchema = {
  type: "OBJECT",
  required: ["number", "text", "marks"],
  properties: {
    number: { type: "NUMBER" },
    text: { type: "STRING" },
    marks: { type: "NUMBER" },
    parts: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        required: ["label", "text", "marks"],
        properties: {
          label: { type: "STRING" },
          text: { type: "STRING" },
          marks: { type: "NUMBER" },
        },
      },
    },
  },
};

const isQuizQuestion = (value: unknown): value is {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
} =>
  isRecord(value) &&
  typeof value.question === "string" &&
  hasStringArray(value.options) &&
  value.options.length >= 2 &&
  typeof value.answer === "string" &&
  typeof value.explanation === "string";

const isExamBatch = (value: unknown): value is Array<{ question: string; options: string[]; answer: string; explanation: string }> =>
  Array.isArray(value) && value.length > 0 && value.every(isQuizQuestion);

const isVideoAnalysis = (value: unknown): value is {
  synopsis: string;
  knowledgePoints: string[];
  examinerTips: string[];
  formulaVault: string[];
} =>
  isRecord(value) &&
  typeof value.synopsis === "string" &&
  hasStringArray(value.knowledgePoints) &&
  hasStringArray(value.examinerTips) &&
  hasStringArray(value.formulaVault);

const isMockPaper = (
  value: unknown
): value is Array<{ number: number; text: string; marks: number; parts?: Array<{ label: string; text: string; marks: number }> }> =>
  Array.isArray(value) &&
  value.every(
    (question) =>
      isRecord(question) &&
      typeof question.number === "number" &&
      typeof question.text === "string" &&
      typeof question.marks === "number" &&
      (question.parts === undefined ||
        (Array.isArray(question.parts) &&
          question.parts.every(
            (part) =>
              isRecord(part) &&
              typeof part.label === "string" &&
              typeof part.text === "string" &&
              typeof part.marks === "number"
          )))
  );

export const getStudyPlan = async (mockGrades: string) =>
  requestGemini<string>(
    "gemini-2.0-flash",
    `Act as a strict but encouraging LSE admissions tutor.
Current Performance: ${mockGrades}
Target: LSE Economics (Requires A*A*A*).
Create a high-yield 3-day revision schedule focusing on fixing weaknesses.
IMPORTANT: Use plain text only. DO NOT use Markdown formatting.
Keep it under 150 words.`
  );

export const generateQuizQuestion = async (topic: string, difficulty: string = "Medium") =>
  requestGemini<any>(
    "gemini-2.0-flash",
    `Generate a ${difficulty} difficulty multiple-choice A-Level Math question for Edexcel IAL on "${topic}".
Return JSON with keys: question, options (string[]), answer, explanation.
IMPORTANT: No LaTeX and no Markdown.`,
    true,
    quizQuestionSchema,
    isQuizQuestion
  );

export const generateExamBatch = async (topic: string, difficulty: string = "Medium", count: number = 5) =>
  requestGemini<any[]>(
    "gemini-2.0-flash",
    `Generate exactly ${count} different ${difficulty} A-Level Math multiple-choice questions on "${topic}".
Return a JSON array. Each item must have question, options (string[]), answer, explanation.`,
    true,
    examBatchSchema,
    isExamBatch
  );

export const getTopicSummary = async (topic: string) =>
  requestGemini<string>("gemini-2.0-flash", `Provide a plain-text "Magic Note" summary for A-Level Math: "${topic}".`);

export const getVideoAnalysis = async (chapterTitle: string, topics: string[]) =>
  requestGemini<any>(
    "gemini-2.0-flash",
    `Analyze educational content for "${chapterTitle}" with topics: ${topics.join(", ")}.
Return JSON with keys: synopsis, knowledgePoints (string[]), examinerTips (string[]), formulaVault (string[]).`,
    true,
    videoAnalysisSchema,
    isVideoAnalysis
  );

export const getTutorChatResponse = async (topic: string, history: any[], userMessage: string) =>
  requestGemini<string>(
    "gemini-2.0-flash",
    `You are an A-Level Math tutor.
Topic: ${topic}
Conversation history: ${JSON.stringify(history)}
User message: ${userMessage}
Reply in concise plain text.`
  );

export const getDeepDiveExplanation = async (question: string, correctAnswer: string) =>
  requestGemini<string>(
    "gemini-2.0-flash",
    `Explain this A-Level Math question step by step:
Question: ${question}
Correct answer: ${correctAnswer}
Use clear plain text and no markdown.`
  );

export const getDiagnosticReport = async (mistakes: any[]) =>
  requestGemini<string>(
    "gemini-2.0-flash",
    `Analyze these A-Level Math mistakes and provide a root cause report in plain text:
${JSON.stringify(mistakes)}`
  );

export const getDailyWisdom = async () =>
  requestGemini<string>("gemini-2.0-flash", "Give one motivational math sentence. Plain text only.");

export const generateMockPaper = async (paperTitle: string) =>
  requestGemini<any[]>(
    "gemini-2.0-flash",
    `Create a mock exam paper for "${paperTitle}".
Return a JSON array. Each item should have: number (number), text (string), marks (number), and optional parts (array of {label, text, marks}).`,
    true,
    { type: "ARRAY", items: mockPaperQuestionSchema },
    isMockPaper
  );
