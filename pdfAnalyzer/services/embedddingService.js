import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
});

export const getEmbedding = async (text) => {
  return await embeddings.embedQuery(text);
};
