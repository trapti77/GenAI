class PromptBuilder {
  buildATSPrompt(resumeText, jobDescription) {
    return `
You are an expert ATS (Applicant Tracking System) evaluator with 10+ years of experience in HR technology. Analyze this resume against the job description and provide detailed feedback.

JOB DESCRIPTION:
${jobDescription}

RESUME TEXT:
${resumeText}

Analyze the following aspects:
1. Keyword matching - How well does the resume match job-specific keywords?
2. Format and structure - Is it ATS-friendly?
3. Content relevance - Are the experiences and skills relevant?
4. Missing elements - What important keywords or sections are missing?

Return ONLY valid JSON in this exact format (no other text):
{
    "atsScore": number (0-100 overall score),
    "keywordMatch": number (0-100 keyword match percentage),
    "missingKeywords": ["keyword1", "keyword2"] (at least 5 if applicable),
    "presentKeywords": ["keyword1", "keyword2"] (top 10 matched keywords),
    "strengths": ["strength1", "strength2"] (3-5 strengths),
    "weaknesses": ["weakness1", "weakness2"] (3-5 areas for improvement),
    "suggestions": ["suggestion1", "suggestion2"] (3-5 actionable suggestions)
}

Be specific, practical, and honest in your assessment. Focus on actionable feedback.
`;
  }

  parseATSResponse(response) {
    try {
      let text = response?.text || response;

      // ✅ Remove markdown ```json ```
      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // ✅ Extract JSON safely
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Raw response:", response);
      throw error;
    }
  }

  validateAnalysis(analysis) {
    return {
      atsScore: Math.min(100, Math.max(0, analysis.atsScore || 50)),
      keywordMatch: Math.min(100, Math.max(0, analysis.keywordMatch || 50)),
      missingKeywords: analysis.missingKeywords || [
        "Technical skills",
        "Industry-specific terms",
        "Certifications",
      ],
      presentKeywords: analysis.presentKeywords || [
        "Communication",
        "Teamwork",
      ],
      strengths: analysis.strengths || ["Basic qualifications met"],
      weaknesses: analysis.weaknesses || ["Could improve keyword optimization"],
      suggestions: analysis.suggestions || [
        "Add more relevant keywords from job description",
      ],
    };
  }

  getDefaultAnalysis() {
    return {
      atsScore: 50,
      keywordMatch: 50,
      missingKeywords: ["Unable to complete full analysis"],
      presentKeywords: ["Resume submitted"],
      strengths: ["Please try again with clearer formatting"],
      weaknesses: ["Analysis could not be completed"],
      suggestions: [
        "Ensure your resume is in PDF format",
        "Remove special characters and tables",
        "Use standard section headings",
        "Include more keywords from job description",
      ],
    };
  }
}

export const promptBuilder = new PromptBuilder();
