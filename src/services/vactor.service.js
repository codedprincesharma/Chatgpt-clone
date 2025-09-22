// Import the Pinecone library
import { Pinecone } from '@pinecone-database/pinecone'

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: "pcsk_3ahgAD_4FDJYoHRhWeWiPaqB879uwRPTgpRzvBJAzHysfRtrn4BA1kHHKcMTpT4EHo1h4H" });

// Create a dense index with integrated embedding
const chatGptIndex = pc.Index("chat-gpt")


async function createMemory({ vectors, metadata, messageId }) {

  await chatGptIndex.upsert([
    {
      id: messageId,
      values: vectors,
      metadata
    }
  ])
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  const data = await chatGptIndex.query({
    vector: queryVector,
    topK: limit,
    filter: metadata || undefined,
    includeMetadata: true
  })

  return data.matches
}

export default { createMemory, queryMemory }