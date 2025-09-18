import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI("AIzaSyDtWaKZctVq8PT6L3cdceu_ph55hPYsqUg")


async function genrateResponse(content) {

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flase",
    contents: content
  })
  return response.text
}


export default genrateResponse;