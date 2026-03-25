//FromTemplate-----------------
//(1) what is fromTemplate in ChatPromptTemplate
//(2)fromTemplate vs fromMessage
//(3)how to pass multiple params in fromTemplate

//fromTemplate-----in from template we can pass single instruction while in fromMessage we can pass multiple instruction


import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

async function chat() {
  const prompt = ChatPromptTemplate.fromTemplate([
    // "tell me about {topic} in 50 words"
    "tell me about {topic} in {words} words",
  ]);
  const formatedMessage = await prompt.formatMessages({
      topic: "AL/ML", // ai, google
      words:50 //number of words
  });

  const response = await model.invoke(formatedMessage);

  console.log(response.content);
}

