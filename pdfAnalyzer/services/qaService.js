import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import Document from "../models/Document.js";
import { getEmbedding } from "./embedddingService.js";

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-pro",
});

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

export const askQuestion = async (question) => {
  const queryEmbedding = await getEmbedding(question);

  const docs = await Document.find();

  const scoredDocs = docs.map((doc) => ({
    text: doc.text,
    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  const topDocs = scoredDocs.sort((a, b) => b.score - a.score).slice(0, 5);

  const context = topDocs.map((d) => d.text).join("\n");

  const prompt = `
  Answer based only on this context:
  ${context}

  Question: ${question}
  `;

  const response = await model.invoke(prompt);

  return response.content;
};
