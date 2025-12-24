
import { GoogleGenAI, Type } from "@google/genai";

// Use Gemini 3 Flash for efficient summarization tasks
export async function summarizeChapter(chapterName: string, files: string[]) {
  // Initialize AI client using the direct environment variable for the API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
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

    // Access the text property directly from the response object.
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini AI summarizing error:", error);
    return null;
  }
}
