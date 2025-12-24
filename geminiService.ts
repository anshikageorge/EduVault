
import { GoogleGenAI, Type, Part } from "@google/genai";

/**
 * Initializes a fresh GoogleGenAI instance using the environment API key.
 */
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a concise summary and study tips for a chapter based on file names.
 * Uses 'gemini-3-flash-preview' for efficient text processing.
 */
export async function summarizeChapter(chapterName: string, files: string[]) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [{
          text: `I have a study chapter called "${chapterName}" which contains these files: ${files.join(', ')}. 
          Provide a 3-bullet point summary of what this chapter likely covers and a "Quick Tip" for studying it. 
          Also, calculate a confidence score from 0 to 100 based on how descriptive the file names are for accurately guessing the content.
          Keep the response extremely concise and professional.`
        }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three high-level bullet points about the probable content."
            },
            studyTip: {
              type: Type.STRING,
              description: "A single piece of actionable study advice."
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: "Percentage of confidence in the summary (0-100)."
            }
          },
          required: ["summary", "studyTip", "confidenceScore"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI summarizing error:", error);
    return null;
  }
}

/**
 * Generates multiple-choice questions from educational content.
 * Accepts a multimodal 'Part' which can contain text or binary file data (PDF, Images, etc.).
 * Uses 'gemini-3-pro-preview' for advanced reasoning and high-quality question drafting.
 */
export async function generateMCQs(filePart: Part, fileName: string, count: number = 5) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{
        parts: [
          filePart,
          {
            text: `Generate a high-quality study test based on the attached material "${fileName}".
            Provide exactly ${count} multiple-choice questions. 
            Each question must have 4 options and include a detailed explanation for the correct answer.
            Ensure the questions cover the core concepts presented in the material.`
          }
        ]
      }],
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
                description: "Zero-based index of the correct option." 
              },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI test generation error:", error);
    return null;
  }
}
