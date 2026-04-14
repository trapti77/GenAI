class PromptBuilder {
  buildATSPrompt(resumeText, jobDescription) {
    return `
You are an ATS (Applicant Tracking System) evaluator.

STRICT RULES (VERY IMPORTANT):
- Return ONLY valid JSON
- DO NOT add explanation, markdown, or extra text
- DO NOT truncate JSON
- Ensure JSON is COMPLETE and PARSEABLE
- If unsure, still return valid JSON

LIMITS:
- Max 5 items per array
- Keep each string under 20 words

OUTPUT FORMAT:
{
  "atsScore": 0,
  "keywordMatch": 0,
  "missingKeywords": [],
  "presentKeywords": [],
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Now return the JSON.
`;
  }

  parseATSResponse(response) {
    try {
      let text = response?.text || response;

      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // Extract JSON block
      let jsonMatch = text.match(/\{[\s\S]*$/);
      if (!jsonMatch) throw new Error("No JSON found");

      let jsonString = jsonMatch[0];

      // 🔥 Fix broken JSON step-by-step

      // 1. Remove trailing commas
      jsonString = jsonString.replace(/,\s*]/g, "]").replace(/,\s*}/g, "}");

      // 2. Close open quotes (VERY IMPORTANT)
      const quoteCount = (jsonString.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        jsonString += '"';
      }

      // 3. Balance brackets
      const openBrackets = (jsonString.match(/\[/g) || []).length;
      const closeBrackets = (jsonString.match(/]/g) || []).length;

      if (openBrackets > closeBrackets) {
        jsonString += "]".repeat(openBrackets - closeBrackets);
      }

      // 4. Balance braces
      const openBraces = (jsonString.match(/{/g) || []).length;
      const closeBraces = (jsonString.match(/}/g) || []).length;

      if (openBraces > closeBraces) {
        jsonString += "}".repeat(openBraces - closeBraces);
      }

      return JSON.parse(jsonString);
    } catch (error) {
      console.error("❌ Raw AI response:", response);
      throw new Error("Invalid JSON from AI");
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
