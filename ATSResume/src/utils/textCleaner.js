class TextCleaner {
  cleanText(text) {
    if (!text) return "";

    let cleaned = text;

    // Remove extra whitespace
    cleaned = cleaned.replace(/\s+/g, " ");

    // Remove special characters but keep important ones
    cleaned = cleaned.replace(/[^\w\s\-\.\,\@\(\)\/]/g, "");

    // Normalize line breaks
    cleaned = cleaned.replace(/\n/g, " ");

    // Remove multiple spaces
    cleaned = cleaned.replace(/\s{2,}/g, " ");

    // Trim
    cleaned = cleaned.trim();

    return cleaned;
  }

  extractWords(text, limit = 100) {
    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2) // Remove very short words
      .filter((word) => !this.isStopWord(word)); // Remove common stop words

    // Count frequency
    const frequency = new Map();
    words.forEach((word) => {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    });

    // Sort by frequency
    const sorted = Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map((entry) => entry[0]);

    return sorted;
  }

  isStopWord(word) {
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
      "from",
      "up",
      "down",
      "off",
      "over",
      "under",
      "again",
      "further",
      "then",
      "once",
      "here",
      "there",
      "all",
      "any",
      "both",
      "each",
      "few",
      "more",
      "most",
      "other",
      "some",
      "such",
      "no",
      "nor",
      "not",
      "only",
      "own",
      "same",
      "so",
      "than",
      "that",
      "thus",
      "very",
      "just",
      "but",
      "do",
      "does",
      "doing",
      "did",
      "have",
      "has",
      "having",
      "had",
      "see",
      "saw",
      "seen",
      "seeing",
    ]);

    return stopWords.has(word);
  }

  extractEmailAndPhone(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/g;

    return {
      emails: text.match(emailRegex) || [],
      phones: text.match(phoneRegex) || [],
    };
  }

  detectLanguage(text) {
    // Simple language detection based on character sets
    const hasChinese = /[\u4e00-\u9fff]/.test(text);
    const hasArabic = /[\u0600-\u06FF]/.test(text);
    const hasCyrillic = /[\u0400-\u04FF]/.test(text);

    if (hasChinese) return "zh";
    if (hasArabic) return "ar";
    if (hasCyrillic) return "ru";
    return "en";
  }
}

export const textCleaner = new TextCleaner();
