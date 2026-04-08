import express from "express";
import multer from "multer";
import { processPDF } from "../services/pdfService.js";
import { askQuestion } from "../services/qaService.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Upload PDF
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    await processPDF(req.file.path, req.file.originalname);

    res.json({ message: "PDF processed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ask Question
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const answer = await askQuestion(question);

    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
