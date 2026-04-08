import fs from "fs";
import pdf from "pdf-parse";
import { v4 as uuidv4 } from "uuid";
import Document from "../models/Document.js";
import { getEmbedding } from "./embeddingService.js";

export const processPDF = async (filePath, fileName) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);

  const text = pdfData.text;

  // Split into chunks
  const chunks = text.match(/(.|[\r\n]){1,500}/g);

  for (let chunk of chunks) {
    const embedding = await getEmbedding(chunk);

    await Document.create({
      text: chunk,
      embedding,
      fileName,
    });
  }

  return true;
};
