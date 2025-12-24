
import { GoogleGenAI, Type } from "@google/genai";

// Use Gemini 3 Flash for efficient summarization tasks
export async function summarizeChapter(chapterName: string, files: string[]) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I have a study chapter called "${chapterName}" which contains these files: ${files.join(', ')}. 
      Provide a 3-bullet point summary of what this chapter likely covers and a "Quick Tip" for studying it. 
      Also, calculate a confidence score from 0 to 100 based on how descriptive the file names are for accurately guessing the content.
      Keep the text concise (under 100 words).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three bullet points about the chapter likely content."
            },
            studyTip: {
              type: Type.STRING,
              description: "A single piece of study advice."
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: "A value from 0 to 100 indicating the model's confidence in the summary."
            }
          },
          required: ["summary", "studyTip", "confidenceScore"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini AI summarizing error:", error);
    return null;
  }
}

// Generate multiple choice questions from text content
export async function generateMCQs(content: string, fileName: string, count: number = 5) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate a high-quality study test based on the following material: "${content}" from file "${fileName}".
      Provide exactly ${count} multiple-choice questions. 
      Each question must have 4 options.
      Include a brief explanation for why the correct answer is right.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                minItems: 4,
                maxItems: 4
              },
              correctAnswer: { 
                type: Type.INTEGER, 
                description: "The 0-based index of the correct option." 
              },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini AI test generation error:", error);
    return null;
  }
}
