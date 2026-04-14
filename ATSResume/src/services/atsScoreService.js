import logger from "../utils/logger.js";

class ATSScoreService {
  calculateDetailedScores(analysis, resumeText, jobDescription) {
      //calculate weighted scores based on multiple factors
    
      console.log("ana-----------------------",analysis);
      
      if (!analysis) {
        throw new Error("analysis not found")
    }
    const keywordScore = analysis.keywordMatch || 0;
    const formatScore = this.calculateFormatScore(resumeText);
    const readilityScore = this.calculateReadabilityScore(resumeText);
    const relevanceScore = this.calculateRelevanceScore(
      resumeText,
      jobDescription,
    );

    //weighted average

    const finalScore =
      keywordScore * 0.4 +
      formatScore * 0.2 +
      readilityScore * 0.2 +
      relevanceScore * 0.2;

    return {
      atsScore: Math.round(finalScore),
      keywordMatch: keywordScore,
      formatScore: formatScore,
      readabilityScore: readilityScore,
      relevanceScore: relevanceScore,
    };
  }
  calculateFormatScore(resumeText) {
    let score = 70;
    //check for common section

    const sections = ["exprerience", "education", "skills", "summery"];
    let foundSections = 0;
    sections.forEach((section) => {
      if (resumeText.toLowerCase().includes(section)) {
        foundSections++;
      }
    });
    score += (foundSections / sections.length) * 20;
    //check if bullet points (good for ATS)

    if (
      resumeText.includes("•") ||
      resumeText.includes("-") ||
      resumeText.includes("*")
    ) {
      score += 5;
    }

    //check for dates
    const datePattern = /\d{4}/g;
    const dates = resumeText.match(datePattern);
    if (dates && dates.length > 2) {
      score += 5;
    }
    return Math.min(100, score);
  }
  calculateReadabilityScore(resumeText) {
    let score = 80;

    //check average sentenvse lenght
    const sentences = resumeText.split(/[.!?]+/);
    const avgSentenceLength =
      sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) /
      sentences.length;

    if (avgSentenceLength > 25) {
      score -= 10; //Too verbose
    } else if (avgSentenceLength < 10) {
      score -= 5; //Too brief
    }

    // Check for passive voice indicators
    const passiveIndicators = ["was", "were", "been", "being", "by"];
    let passiveCount = 0;
    passiveIndicators.forEach((indicator) => {
      const regex = new RegExp(`\\b${indicator}\\b`, "gi");
      const matches = resumeText.match(regex);
      if (matches) passiveCount += matches.length;
    });

    if (passiveCount > 20) {
      score -= 15;
    }
    // Check for action verbs
    const actionVerbs = [
      "achieved",
      "managed",
      "developed",
      "created",
      "implemented",
      "led",
      "designed",
      "built",
    ];
    let actionCount = 0;
    actionVerbs.forEach((verb) => {
      const regex = new RegExp(`\\b${verb}\\b`, "gi");
      const matches = resumeText.match(regex);
      if (matches) actionCount += matches.length;
    });

    if (actionCount < 5) {
      score -= 10;
    } else if (actionCount > 10) {
      score += 5;
    }

    return Math.max(0, Math.min(100, score));
  }
  calculateRelevanceScore(resumeText, jobDescription) {
    // Extract key terms from job description
    const jobTerms = this.extractKeyTerms(jobDescription);
    const resumeTerms = this.extractKeyTerms(resumeText);

    let matchCount = 0;
    jobTerms.forEach((term) => {
      if (resumeTerms.has(term.toLowerCase())) {
        matchCount++;
      }
    });

    const score = (matchCount / jobTerms.size) * 100;
    return Math.round(score);
  }

  extractKeyTerms(text) {
    // Remove common stop words
    const stopWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
    ]);

    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word));

    // Get frequency
    const frequency = new Map();
    words.forEach((word) => {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    });

    // Return top 30 terms
    const sortedTerms = Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map((entry) => entry[0]);

    return new Set(sortedTerms);
  }

  generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.keywordMatch < 60) {
      recommendations.push({
        priority: "high",
        category: "Keywords",
        message: "Include more keywords from the job description",
        action:
          "Review the job posting and add relevant skills and technologies",
      });
    }

    if (analysis.formatScore < 70) {
      recommendations.push({
        priority: "medium",
        category: "Format",
        message: "Improve resume structure and formatting",
        action: "Use clear section headers and consistent formatting",
      });
    }

    if (analysis.readabilityScore < 70) {
      recommendations.push({
        priority: "medium",
        category: "Readability",
        message: "Use more action verbs and shorter sentences",
        action: "Start bullet points with strong action verbs",
      });
    }

    if (analysis.missingKeywords && analysis.missingKeywords.length > 5) {
      recommendations.push({
        priority: "high",
        category: "Content Gap",
        message: `Add these ${analysis.missingKeywords.length} missing keywords to your resume`,
        action: `Key terms to add: ${analysis.missingKeywords.slice(0, 5).join(", ")}`,
      });
    }

    return recommendations;
  }
}

export const atsService = new ATSScoreService();
