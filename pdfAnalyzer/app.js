import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

app.use("/api/ai", aiRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
