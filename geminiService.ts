
import { GoogleGenAI, Type } from "@google/genai";

export async function summarizeChapter(chapterName: string, files: string[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I have a study chapter called "${chapterName}" which contains these files: ${files.join(', ')}. Provide a 3-bullet point summary of what this chapter likely covers and a "Quick Tip" for studying it. Keep it under 100 words.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three bullet points about the chapter."
            },
            studyTip: {
              type: Type.STRING,
              description: "A single piece of study advice."
            }
          },
          required: ["summary", "studyTip"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini AI summarizing error:", error);
    return null;
  }
}
