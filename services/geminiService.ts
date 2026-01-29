
import { GoogleGenAI } from "@google/genai";

export class RateLimitError extends Error {
  constructor(message = 'Rate limit reached. Please try again later.') {
    super(message);
    this.name = 'RateLimitError';
  }
}

// Global error handler for Gemini API calls
const handleGeminiError = (error: unknown, defaultMessage: string): never => {
  console.error("Error calling Gemini API:", error);

  const errorContent = error instanceof Error ? error.message : JSON.stringify(error);

  // If the request fails with "Requested entity was not found.", prompt for key selection
  if (errorContent.includes('Requested entity was not found.')) {
    if (typeof window !== 'undefined' && window.aistudio) {
      window.aistudio.openSelectKey();
    }
  }

  if (errorContent.includes('API key not valid')) {
    throw new Error('Your API Key is invalid or not configured correctly. Please check it in your settings.');
  }
  
  if (errorContent.includes('429') || errorContent.toLowerCase().includes('rate limit') || errorContent.includes('RESOURCE_EXHAUSTED')) {
    throw new RateLimitError();
  }
  
  throw new Error(defaultMessage);
};

export const generateImageFromPrompt = async (
  prompt: string,
  aspectRatio: string
): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: (aspectRatio === 'auto' || !aspectRatio) ? '1:1' : aspectRatio as any,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    }
    
    return null;
  } catch (error) {
    handleGeminiError(error, "An error occurred while generating image from text.");
  }
};


export const stylizeImage = async (
  base64ContentImage: string,
  contentImageType: string,
  prompt: string,
  base64StyleImage: string | null,
  styleImageType: string | null,
  styleId?: string,
  aspectRatio: string = '1:1',
): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const parts: any[] = [
      {
        inlineData: {
          data: base64ContentImage,
          mimeType: contentImageType,
        },
      },
    ];

    if (base64StyleImage && styleImageType) {
      parts.push({
        inlineData: {
          data: base64StyleImage,
          mimeType: styleImageType,
        }
      });
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: parts },
      config: {
        imageConfig: {
          aspectRatio: (aspectRatio === 'auto' || !aspectRatio) ? '1:1' : aspectRatio as any
        }
      }
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
    }
    return null;
  } catch (error) {
    handleGeminiError(error, "An error occurred while stylizing the image.");
  }
};

export const animateImage = async (
  base64Image: string,
  mimeType: string,
): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: 'Animate this image with subtle, beautiful motion.',
      image: {
        imageBytes: base64Image,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    return downloadLink ? `${downloadLink}&key=${process.env.API_KEY}` : null;
  } catch (error) {
    handleGeminiError(error, "An error occurred while animating the image.");
  }
};

export const upscaleImage = async (
  base64Image: string,
  mimeType: string,
  size: '2K' | '4K' = '2K'
): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Upscale this image to ${size} resolution while strictly preserving the original art style.`;

    const parts: any[] = [
      { inlineData: { data: base64Image, mimeType: mimeType } },
      { text: prompt },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: parts },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1"
        }
      }
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    handleGeminiError(error, "An error occurred while upscaling the image.");
  }
};
