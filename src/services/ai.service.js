import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

const ai = new GoogleGenerativeAI("AIzaSyDtWaKZctVq8PT6L3cdceu_ph55hPYsqUg");

async function generateResponse(content) {
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(content);
  return result.response.text();
}



async function genrateVector(content) {
  // Step 1: Generative model for embedding
  const model = ai.getGenerativeModel({ model: "models/embedding-001" });

  // Step 2: Embed the content
  const result = await model.embedContent({
    content: {
      parts: [{ text: content }],
    },
  });

  // Step 3: Return embedding array
  return result.embedding;
}

export default { generateResponse, genrateVector };



// import OpenAI from "openai";
// import { config } from "dotenv";
// config(); // Load .env

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Chat / text generation
// async function generateResponse(messages) {
//   // messages format: [{ role: "user", content: "Hello AI" }]
//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages,
//   });
//   return response.choices[0].message.content;
// }

// // Embeddings / vectors
// async function genrateVector(text) {
//   const response = await openai.embeddings.create({
//     model: "text-embedding-3-small",
//     input: text,
//   });
//   return response.data[0].embedding; // 1536-dimensional vector
// }

// export default { generateResponse, genrateVector };
