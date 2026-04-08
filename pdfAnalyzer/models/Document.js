import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    text: String,
    embedding: [Number],
    fileName: String,
  },
  { timestamps: true },
);

export default mongoose.model("Document", documentSchema);
