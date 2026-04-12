import { gemini } from "../config/gemini.js";
import logger from "../utils/logger.js";

import { promptBuilder } from "../utils/promptBuilder.js";

class GeminiAnalysisService {
  truncateText(text, maxLength = 5000) {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) : text;
  }
  async analyzeResume(resumeText, jobDescription, metadata = {}) {
    const startTime = Date.now();

    try {
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error("Resume text is empty");
      }

      if (!jobDescription || jobDescription.trim().length === 0) {
        throw new Error("Job description is empty");
      }

      const truncatedResume = this.truncateText(resumeText, 15000);
      const truncatedJobDesc = this.truncateText(jobDescription, 5000);

      const prompt = promptBuilder.buildATSPrompt(
        truncatedResume,
        truncatedJobDesc,
      );

      const aiResponse = await gemini.generateContent(prompt, {
        temperature: 0.3,
        maxOutputTokens: 1500,
      });

      const analysis = promptBuilder.parseAIResponse(aiResponse);

      console.log("analysis -------------",analysis);
      

      analysis.processingTime = Date.now() - startTime;
      analysis.wordCount = resumeText.split(/\s+/).length;
      analysis.resumeLength = resumeText.length;
      analysis.jobDescriptionLength = jobDescription.length;

      logger.info(`Resume analysis completed in ${analysis.processingTime}ms`);
      return {
        success: true,
        analysis,
      };
    } catch (error) {
      logger.error("Gemini analysis failed:", error);
      return {
        success: false,
        error: error.message,
        // fallbackAnalysis:await  this.getFallbackAnalysis(),
      };
    }
  }

  async batchAnalyze(resumes, jobDescription) {
    const results = [];
    for (const resume of resumes) {
      try {
        const result = await this.analyzeResume(resume.text, jobDescription);
        results.push({
          filename: resume.filename,
          ...result,
        });
      } catch (error) {
        results.push({
          filename: resume.filename,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }
}

export const geminiAnalysisservice = new GeminiAnalysisService();
