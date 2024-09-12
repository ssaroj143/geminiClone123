import { GoogleGenerativeAI} from "@google/generative-ai";

  const apiKey = "AIzaSyCZLMEpXtfEHJs3yCMeFIssg09MuofOtxE";
  const Model_Name ="gemini-1.5-flash";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({model: Model_Name});
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run(prompt, image) {
    const chatSession = model.startChat({
      generationConfig,
      // ... existing code ...
    });

    let result;
    if (image) {
      result = await chatSession.sendMessageStream([prompt, image]);
    } else {
      result = await chatSession.sendMessageStream(prompt);
    }

    const response = await result.response;
    console.log("Raw response:", response);
    return response.text();
  }

export default run;