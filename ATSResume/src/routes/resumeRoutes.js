import express from "express";
const router = express.Router();
import { resumeController } from "../controllers/resumeController.js";
import { handleMulter } from "../middleware/uploadMiddleware.js";
import { validationMiddleware } from "../middleware/validationMiddleware.js";


// POST /api/resume/analyze - Analyze a resume

router.post(
  "/analyze",
  handleMulter.single("resume"),
  resumeController.analyzeResume.bind(resumeController),
);
// router.post(
//   "/analyze",
//   handleMulter.single("resume"),
//   // validationMiddleware.validateAnalysisRequest,
//   resumeController.analyzeResume,
// );

// GET /api/resume/history - Get analysis history
router.get("/history", resumeController.getAnalysisHistory);

// GET /api/resume/stats - Get statistics
router.get("/stats", resumeController.getStatistics);

// GET /api/resume/:id - Get specific analysis
router.get(
  "/:id",
  validationMiddleware.validateId,
  resumeController.getAnalysisById,
);

// DELETE /api/resume/:id - Delete analysis
router.delete(
  "/:id",
  validationMiddleware.validateId,
  resumeController.deleteAnalysis,
);

export default router;
