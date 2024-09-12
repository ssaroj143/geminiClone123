import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from './config';

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run(prompt, imageData, retries = 3, backoff = 1000) {
  try {
    console.log("Starting API request with prompt:", prompt);
    console.log("Image data present:", !!imageData);

    let result;
    if (imageData) {
      const imageParts = [
        {
          inlineData: {
            data: imageData,
            mimeType: "image/jpeg"
          }
        }
      ];
      result = await model.generateContent([prompt, ...imageParts]);
    } else {
      result = await model.generateContent(prompt);
    }

    console.log("API response received:", result);

    const response = await result.response;
    const text = response.text();
    console.log("Extracted text:", text);

    return text;
  } catch (error) {
    console.error("Error in Gemini API:", error);
    if (retries > 0) {
      console.log(`Retrying in ${backoff}ms... (${retries} attempts left)`);
      await delay(backoff);
      return run(prompt, imageData, retries - 1, backoff * 2);
    }
    throw new Error("Gemini API is currently unavailable. Please try again later.");
  }
}

export default run;