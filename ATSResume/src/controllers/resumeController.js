import { Rsumepaserservice } from "../services/resumeParserService.js";
import { geminiAnalysisservice } from "../services/geminiAnalysisService.js";
import { atsService } from "../services/atsScoreService.js";
import { Analysis } from "../models/Analysis.js";
import logger from "../utils/logger.js";
import { createHash } from "crypto";

class ResumeController {
  async saveAnalysis(file, analysis, jobDescription, req) {
    const jobDescriptionHash = createHash("md5")
      .update(jobDescription)
      .digest("hex");

    const analysisDoc = new Analysis({
      originalFilename: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      atsScore: analysis.atsScore,
      keywordMatch: analysis.keywordMatch,
      formatScore: analysis.formatScore,
      readabilityScore: analysis.readabilityScore,
      missingKeywords: analysis.missingKeywords,
      presentKeywords: analysis.presentKeywords,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions,
      jobDescriptionHash: jobDescriptionHash,
      processingTime: analysis.metadata.processingTime,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
      textPreview: analysis.metadata.textPreview || "",
    });

    return await analysisDoc.save();
  }
  
  async analyzeResume(req, res, next) {
    const startTime = Date.now();
    try {
      //validate request

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No resume file uploaded",
        });
      }

      const { jobDescription } = req.body;
      // console.log("body data ------", req.file);

      if (!jobDescription || jobDescription.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Job description is required",
        });
      }

      const parseResult = await Rsumepaserservice.parsePDF(
        req.file.buffer,
        req.file.originalname,
      );

      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: parseResult.error,
        });
      }
      // console.log("parseResultparseResult--------------", parseResult);

      // Analyze with Gemini
      const aiAnalysis = await geminiAnalysisservice.analyzeResume(
        parseResult.text,
        jobDescription,
        {
          filename: req.file.originalname,
          fileSize: req.file.size,
        },
      );

      console.log("aiAnalysis--------------", aiAnalysis);

      if (aiAnalysis.success == false) {
        // Use fallback analysis
        logger.warn("Using fallback analysis due to AI failure");
      }

      const analysisData = aiAnalysis.analysis || aiAnalysis.fallbackAnalysis;
      // console.log("anaDta--------------", analysisData);

      // Calculate detailed scores
      const detailedScores = atsService.calculateDetailedScores(
        analysisData,
        parseResult.text,
        jobDescription,
      );
      // Generate recommendations
      const recommendations =
        atsService.generateRecommendations(detailedScores);

      // Prepare final response
      const finalAnalysis = {
        ...detailedScores,
        missingKeywords: analysisData.missingKeywords || [],
        presentKeywords: analysisData.presentKeywords || [],
        strengths: analysisData.strengths || [],
        weaknesses: analysisData.weaknesses || [],
        suggestions: analysisData.suggestions || [],
        recommendations: recommendations,
        metadata: {
          wordCount: parseResult.wordCount,
          pages: parseResult.metadata.pages,
          processingTime: Date.now() - startTime,
          aiModel: process.env.GEMINI_MODEL || "gemini-2.0-flash-exp",
        },
      };

      // Save to database
      const savedAnalysis =await this.saveAnalysis(
        req.file,
        finalAnalysis,
        jobDescription,
        req,
      );

      // console.log("save anaoo----------------", savedAnalysis);

      // Log success
      logger.info(`Resume analyzed successfully: ${req.file.originalname}`, {
        atsScore: finalAnalysis.atsScore,
        processingTime: Date.now() - startTime,
        analysisId: savedAnalysis._id,
      });

      res.status(200).json({
        success: true,
        data: finalAnalysis,
        analysisId: savedAnalysis._id,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.log("Analyze Error : ", error);

      logger.error("Resume analysis controller error:", error);
      next(error);
    }
  }

  async getAnalysisHistory(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [analyses, total] = await Promise.all([
        Analysis.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select("-jobDescriptionHash -textPreview"), // Exclude large fields
        Analysis.countDocuments(),
      ]);

      res.status(200).json({
        success: true,
        data: analyses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      logger.error("Get history error:", error);
      next(error);
    }
  }
  async getAnalysisById(req, res, next) {
    try {
      const { id } = req.params;

      const analysis = await Analysis.findById(id);

      if (!analysis) {
        return res.status(404).json({
          success: false,
          error: "Analysis not found",
        });
      }

      res.status(200).json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      logger.error("Get analysis by ID error:", error);
      next(error);
    }
  }
  async getStatistics(req, res, next) {
    try {
      const stats = await Analysis.aggregate([
        {
          $group: {
            _id: null,
            averageATS: { $avg: "$atsScore" },
            averageKeyword: { $avg: "$keywordMatch" },
            totalAnalyses: { $sum: 1 },
            avgProcessingTime: { $avg: "$processingTime" },
          },
        },
      ]);
      const scoreDistribution = await Analysis.aggregate([
        {
          $bucket: {
            groupBy: "$atsScore",
            boundaries: [0, 40, 60, 80, 101],
            defualt: "Other",
            output: {
              count: { $sum: 1 },
            },
          },
        },
      ]);
      res.status(200).json({
        success: true,
        data: {
          overall: stats[0] || {},
          distribution: scoreDistribution,
          topKeywords: await this.getTopKeywords(),
        },
      });
    } catch (error) {
      logger.error("Get statistics error:", error);
      next(error);
    }
  }
  async getTopKeywords() {
    const analyses = await Analysis.find().select("presentKeywords").limit(100);

    const keywordCount = new Map();

    analyses.forEach((analysis) => {
      analysis.presentKeywords.forEach((keyword) => {
        keywordCount.set(keyword, (keywordCount.get(keyword) || 0) + 1);
      });
    });

    const sortedKeywords = Array.from(keywordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([keyword, count]) => ({ keyword, count }));

    return sortedKeywords;
  }
  async deleteAnalysis(req, res, next) {
    try {
      const { id } = req.params;

      const analysis = await Analysis.findByIdAndDelete(id);

      if (!analysis) {
        return res.status(404).json({
          success: false,
          error: "Analysis not found",
        });
      }

      logger.info(`Analysis deleted: ${id}`);

      res.status(200).json({
        success: true,
        message: "Analysis deleted successfully",
      });
    } catch (error) {
      logger.error("Delete analysis error:", error);
      next(error);
    }
  }
}

export const resumeController = new ResumeController();
