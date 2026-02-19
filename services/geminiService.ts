const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

const getApiUrl = (model: string, apiKey: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

const requestGemini = async <T = string>(model: string, prompt: string, expectsJson = false): Promise<T> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing Gemini API key. Set VITE_GEMINI_API_KEY (recommended) or GEMINI_API_KEY.");
  }

  const response = await fetch(getApiUrl(model, apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: expectsJson ? { responseMimeType: "application/json" } : undefined,
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

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Gemini JSON parse failed. Raw response: ${text}`);
  }
};

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
    true
  );

export const generateExamBatch = async (topic: string, difficulty: string = "Medium", count: number = 5) =>
  requestGemini<any[]>(
    "gemini-2.0-flash",
    `Generate exactly ${count} different ${difficulty} A-Level Math multiple-choice questions on "${topic}".
Return a JSON array. Each item must have question, options (string[]), answer, explanation.`,
    true
  );

export const getTopicSummary = async (topic: string) =>
  requestGemini<string>("gemini-2.0-flash", `Provide a plain-text "Magic Note" summary for A-Level Math: "${topic}".`);

export const getVideoAnalysis = async (chapterTitle: string, topics: string[]) =>
  requestGemini<any>(
    "gemini-2.0-flash",
    `Analyze educational content for "${chapterTitle}" with topics: ${topics.join(", ")}.
Return JSON with keys: synopsis, knowledgePoints (string[]), examinerTips (string[]), formulaVault (string[]).`,
    true
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
    true
  );
