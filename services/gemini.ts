import { GoogleGenAI } from "@google/genai";

export const analyzeImageForSearch = async (file: File): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Convert file to base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/...;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const imagePart = {
      inlineData: {
        mimeType: file.type,
        data: base64Data,
      },
    };

    const textPart = {
      text: "Analyze this image and provide 2-3 keywords to search for this product in an e-commerce store. Return ONLY the keywords separated by spaces. E.g., 'red cotton t-shirt'.",
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: { parts: [imagePart, textPart] },
    });

    return response.text || '';
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    throw error;
  }
};
