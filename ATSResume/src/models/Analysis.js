import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    // File information
    originalFilename: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      default: "application/pdf",
    },

    // ATS Scores
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    keywordMatch: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    formatScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    readabilityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Analysis details
    missingKeywords: [
      {
        type: String,
        trim: true,
      },
    ],
    presentKeywords: [
      {
        type: String,
        trim: true,
      },
    ],
    strengths: [
      {
        type: String,
        trim: true,
      },
    ],
    weaknesses: [
      {
        type: String,
        trim: true,
      },
    ],
    suggestions: [
      {
        type: String,
        trim: true,
      },
    ],

    // Metadata
    jobDescriptionHash: {
      type: String,
      index: true,
    },
    processingTime: {
      type: Number, // in milliseconds
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },

    // Extracted text preview (for debugging)
    textPreview: {
      type: String,
      maxlength: 500,
    },

    // Status
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "completed",
    },

    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
analysisSchema.index({ createdAt: -1 });
analysisSchema.index({ atsScore: -1 });
analysisSchema.index({ originalFilename: 1 });

// Virtual for formatted date
analysisSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Method to get score category
analysisSchema.methods.getScoreCategory = function () {
  if (this.atsScore >= 80) return "Excellent";
  if (this.atsScore >= 60) return "Good";
  if (this.atsScore >= 40) return "Average";
  return "Needs Improvement";
};

export const Analyze = mongoose.model("Analysis", analysisSchema);
