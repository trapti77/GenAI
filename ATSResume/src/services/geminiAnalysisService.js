import { gemini } from "../config/gemini.js";
import logger from "../utils/logger.js";

import { promptBuilder } from "../utils/promptBuilder.js";

class GeminiAnalysisService {
  truncateText(text, maxLength = 5000) {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) : text;
  }

  async generateWithRetry(prompt, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        // ✅ ONLY this
        console.log("🔥 generateWithRetry called");
        return await gemini.generateContent(prompt, options);
      } catch (error) {
        const isRetryable =
          error.message.includes("503") || error.message.includes("overloaded");

        if (i === retries - 1 || !isRetryable) {
          throw error;
        }

        console.log(`🔁 Retry ${i + 1}...`);
        await new Promise((res) => setTimeout(res, 1000 * (i + 1)));
      }
    }
  }

  getFallbackAnalysis(resumeText, jobDescription) {
    try {
      const resume = resumeText.toLowerCase();
      const job = jobDescription.toLowerCase();

      // 🔹 Extract keywords from job description
      const jobKeywords = job
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 3);

      const uniqueJobKeywords = [...new Set(jobKeywords)];

      // 🔹 Find matched & missing keywords
      const presentKeywords = [];
      const missingKeywords = [];

      uniqueJobKeywords.forEach((keyword) => {
        if (resume.includes(keyword)) {
          presentKeywords.push(keyword);
        } else {
          missingKeywords.push(keyword);
        }
      });

      // 🔹 Calculate keyword match %
      const keywordMatch = Math.round(
        (presentKeywords.length / uniqueJobKeywords.length) * 100,
      );

      // 🔹 Basic ATS Score (simple logic)
      let atsScore = keywordMatch;

      // Bonus checks
      if (resume.includes("experience")) atsScore += 5;
      if (resume.includes("education")) atsScore += 5;
      if (resume.includes("skills")) atsScore += 5;

      atsScore = Math.min(atsScore, 100);

      // 🔹 Strengths
      const strengths = [];
      if (keywordMatch > 70)
        strengths.push("Strong keyword alignment with job description");
      if (resume.length > 1000) strengths.push("Detailed resume content");
      if (resume.includes("project"))
        strengths.push("Includes project experience");

      // 🔹 Weaknesses
      const weaknesses = [];
      if (keywordMatch < 50)
        weaknesses.push("Low keyword match with job description");
      if (!resume.includes("skills")) weaknesses.push("Skills section missing");
      if (!resume.includes("experience"))
        weaknesses.push("Work experience not clearly defined");

      // 🔹 Suggestions
      const suggestions = [
        "Add missing keywords from job description",
        "Improve skills section with relevant technologies",
        "Use action verbs in experience section",
        "Tailor resume for each job application",
        "Keep formatting ATS-friendly (no tables/images)",
      ];

      return {
        atsScore,
        keywordMatch,
        missingKeywords: missingKeywords.slice(0, 10),
        presentKeywords: presentKeywords.slice(0, 10),
        strengths: strengths.slice(0, 5),
        weaknesses: weaknesses.slice(0, 5),
        suggestions: suggestions.slice(0, 5),
      };
    } catch (error) {
      console.error("Fallback analysis failed:", error);

      // 🔥 Ultimate safe fallback (never crash)
      return {
        atsScore: 50,
        keywordMatch: 50,
        missingKeywords: [],
        presentKeywords: [],
        strengths: ["Resume submitted"],
        weaknesses: ["Unable to analyze resume"],
        suggestions: ["Try again later"],
      };
    }
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
   
      let aiResponse;
      let analysis;

      for (let i = 0; i < 2; i++) {
        aiResponse = await this.generateWithRetry(prompt, {
          temperature: 0.3,
          maxOutputTokens: 1800,
        });
        console.log("aiResponse-------------", aiResponse);

        try {
           analysis = promptBuilder.parseATSResponse(aiResponse);

          return {
            success: true,
            analysis,
          };
        } catch (err) {
          console.log("🔁 Retrying due to JSON error...");
        }
      }

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
        fallbackAnalysis: this.getFallbackAnalysis(resumeText, jobDescription),
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
