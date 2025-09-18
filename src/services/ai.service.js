import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })


async function genrateResponse(content) {

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flase",
    contents: content
  })
  return response.text
}


export default genrateResponse;