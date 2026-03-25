//openai chat

import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.Open_api_key });

const aiAnswer = async (question) => {
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: question,
  });

  console.log(response.output_text);
};

aiAnswer();

process.stdout.write("Ask your question : ");
process.stdin.on("Data", (data) => {
  const question = data.toString().trim();
  if (question == "exit") {
    process.exit();
  } else {
    aiAnswer(question);
  }
});
