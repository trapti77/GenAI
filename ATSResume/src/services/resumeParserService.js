import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdf = require("pdf-parse/lib/pdf-parse.js");

import logger from "../utils/logger.js";

class ResumeParserService {
  async cleanText(text) {
    return text
      .replace(/\s+/g, " ")
      .replace(/[^\w\s@.+-]/g, "")
      .trim();
  }

  async extractWords(text, limit = 50) {
    const words = text.toLowerCase().split(/\s+/);
    const freq = {};

    words.forEach((word) => {
      if (word.length > 3) {
        freq[word] = (freq[word] || 0) + 1;
      }
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word]) => word);
  }
  async parsePDF(fileBuffer, originalFilename) {
    const startTime = Date.now();
    try {
      const data = await pdf(fileBuffer);


      const rawText = data.text;
      const cleanedText =await  this.cleanText(rawText);
      

      const metadata = {
        pages: data.numpages,
        info: data.info,
        version: data.version,
      };

      const processingTime = Date.now() - startTime;

      logger.info(
        `PDF parsed successfully : ${originalFilename} (${processingTime}ms)`,
      );

      return {
        success: true,
        text: cleanedText,
        rawText: rawText.substring(0, 1000),
        metadata,
        wordCount: cleanedText.split(/\s+/).length,
        characterCount: cleanedText.length,
        keywords:await this.extractWords(cleanedText, 50),
      };
    } catch (error) {
      logger.error(`PDF parsing failed for ${originalFilename}:`, error);
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }

  async parseDOCX(fileBuffer) {
    throw new Error("DOCX support commig soon");
  }

  customPageRenderer(pageData) {
    return pageData.getTextContent();
  }
  extractContactInfo(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = text.match(emailRegex) || [];

    const phoneRegex = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/g;
    const phones = text.match(phoneRegex) || [];

    return {
      emails: [...new Set(emails)],
      phones: [...new Set(phones)],
    };
  }
}

export const Rsumepaserservice = new ResumeParserService();
