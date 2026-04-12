export const constant = {
  // File upload limits
  FILE_SIZE_LIMIT: 5 * 1024 * 1024, // 5MB

  ALLOWED_FILE_TYPES: [
    { ext: "pdf", mime: "application/pdf", name: "PDF Document" },
    {
      ext: "docx",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "Word Document",
    },
    { ext: "doc", mime: "application/msword", name: "Word Document" },
  ],

  // ATS scoring weights
  ATS_WEIGHTS: {
    KEYWORD_MATCH: 0.4,
    FORMAT: 0.2,
    READABILITY: 0.2,
    RELEVANCE: 0.2,
  },

  // Score thresholds
  SCORE_THRESHOLDS: {
    EXCELLENT: 80,
    GOOD: 60,
    AVERAGE: 40,
  },

  // API rate limits
  RATE_LIMITS: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },

  // Gemini AI configuration
  GEMINI_CONFIG: {
    MODEL: "gemini-2.0-flash-exp",
    TEMPERATURE: 0.3,
    MAX_OUTPUT_TOKENS: 1500,
    TOP_P: 0.9,
    TOP_K: 40,
  },
};
