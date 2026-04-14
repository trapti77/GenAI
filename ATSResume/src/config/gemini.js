import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "../utils/logger.js";

console.log(process.env.GEMINI_API_KEY);

 class GeminiConfig {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required in environment variables");
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    this.model = this.genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });
    logger.info(
      `🤖 Gemini AI initialized with model: ${process.env.GEMINI_MODEL || "gemini-2.5-flash"}`,
    );
  }
  getModel() {
    return this.model;
  }

  async generateContent(prompt, options = {}) {
    try {
      const generationConfig = {
        temperature: options.temperature || 0.3,
        maxOutputTokens: options.maxOutputTokens || 1000,
        topP: options.topP || 0.9,
        topK: options.topK || 40,
      };

      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      });
      const response = await result.response;
      return response.text();
    } catch (error) {
      logger.error("Gemini API error:", error);
      throw new Error(`Gemini API failed: ${error.message}`);
    }
  }
}

export const gemini = new GeminiConfig();
