// import OpenAI from "openai";
// import dotenv from "dotenv";

// dotenv.config({
//   path: "./.env",
// });

// const client = new OpenAI({ apiKey: process.env.API_KEY });

// const response = await client.responses.create({
//   instructions: "", //instruction tell us how we want to find result like -- in one line or in multiple line
//   input: "what is ai",
//   model: "gpt-4o-mini",
// });

//OPEN AI Roles --
//if
//Role== Developer --- then response will be technical
//Role== User --- then response will be simple answer
//Role== Assistant --- that can remember old chat
//Role== Tools --- like instruction come from like - vs code, cursor
//Role -- System -- means we ask question then what rules we have to apply

// const response = await client.responses.create({
//   input: [
//        {role:"system",content:"give answer in hindi"},
//         {role:"developer",content:"give basic example in js"}
//   ],
//   model: "gpt-4o-mini",
// });

// console.log(response);
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.7,
});

app.post("/api/prompts", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await model.invoke(prompt);

    res.json({
      response: response.content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(4000, () => {
  console.log("SERVER RUNNING ON PORT 4000");
});


//Open AI Roles

//system --- 