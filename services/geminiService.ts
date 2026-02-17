
import { GoogleGenAI, Type } from "@google/genai";

// Ensure initialization follows the coding guideline: Always use a named parameter for apiKey
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStudyPlan = async (mockGrades: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `
      Act as a strict but encouraging LSE admissions tutor.
      Current Performance: ${mockGrades}
      Target: LSE Economics (Requires A*A*A*).
      Create a high-yield 3-day revision schedule focusing on fixing weaknesses.
      IMPORTANT: Use plain text only. DO NOT use Markdown formatting like **bold** or *italics*.
      Keep it under 150 words.
    `,
    config: { thinkingConfig: { thinkingBudget: 4000 } }
  });
  return response.text;
};

export const generateQuizQuestion = async (topic: string, difficulty: string = "Medium"): Promise<any> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a ${difficulty} difficulty multiple-choice A-Level Math question for Edexcel IAL on the topic: "${topic}". 
    Format as JSON. Ensure the 'answer' is the full text of the correct option. 
    IMPORTANT: No LaTeX symbols like '$' or Markdown symbols like '*'.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          answer: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["question", "options", "answer", "explanation"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateExamBatch = async (topic: string, difficulty: string = "Medium", count: number = 5): Promise<any[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate exactly ${count} different ${difficulty} difficulty multiple-choice A-Level Math questions on: "${topic}". 
    Format as a JSON array.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "answer", "explanation"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const getTopicSummary = async (topic: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide a "Magic Note" summary for A-Level Math: "${topic}". Plain text only.`,
  });
  return response.text;
};

export const getVideoAnalysis = async (chapterTitle: string, topics: string[]) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze educational content for "${chapterTitle}" topics: ${topics.join(', ')}. Format JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          synopsis: { type: Type.STRING },
          knowledgePoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          examinerTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          formulaVault: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["synopsis", "knowledgePoints", "examinerTips", "formulaVault"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getTutorChatResponse = async (topic: string, history: any[], userMessage: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Topic: ${topic}. User: ${userMessage}. Tutor reply (plain text).`,
  });
  return response.text;
};

export const getDeepDiveExplanation = async (question: string, correctAnswer: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Explain A-Level Math question: "${question}". Correct answer: "${correctAnswer}". Step-by-step logic. Plain text.`,
    config: { thinkingConfig: { thinkingBudget: 2000 } }
  });
  return response.text;
};

export const getDiagnosticReport = async (mistakes: any[]) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze these Math mistakes: ${JSON.stringify(mistakes)}. Root cause report in plain text.`,
  });
  return response.text;
};

export const getDailyWisdom = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "1-sentence motivational math wisdom. No markdown.",
  });
  return response.text;
};

export const generateMockPaper = async (paperTitle: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Mock exam paper for "${paperTitle}". JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            number: { type: Type.NUMBER },
            text: { type: Type.STRING },
            marks: { type: Type.NUMBER },
            parts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, text: { type: Type.STRING }, marks: { type: Type.NUMBER } } } }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};
