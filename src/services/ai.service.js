import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI("AIzaSyDtWaKZctVq8PT6L3cdceu_ph55hPYsqUg");

async function generateResponse(content) {
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(content);
  return result.response.text();
}

export default generateResponse;
