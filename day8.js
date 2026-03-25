//generate text from audio with ui

import OpenAI from "openai";
import dotenv from "dotenv";
import express, { text } from "express";
import multer from "multer";
import path from "path";
import { createReadStream } from "fs";
const app = express();

app.use(express.json());

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });

app.get("/", (req, res) => {
  res.send(`<form action='/upload' method='post' enctype='multipart/form-data' >
       <input type='file'  name='audio'/>
       <button>upload file</button> `);
});
const storage = multer.diskStorage({
  diskStorage: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.filename + ext);
  },
});
const upload = multer({ storage });
app.post("/uploads",upload.single('audio'), async (req,res) => {
    const filePath = req.file.path;
    const textResponse = await client.audio.transcriptions.create({
        model: 'whisper-1',
        file: createReadStream(filePath),
        language:'en'
    })
    const response = textResponse.text;
    res.send(`<h1>${response}<h1>`)
});

app.listen(3000);
