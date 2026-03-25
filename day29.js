//OUTPUT PARSERS
//What is output parsers---- output parser is used for getting single output not different key with outputs
// like - StringOutputParser

import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  CommaSeperatedListOutputParser,
} from "@langchain/core/prompts";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const prompt = ChatPromptTemplate.fromTemplate([
  // "tell me about {topic} in 50 words"
  "tell me about {topic} in {words} words",
]);
//   const formatedMessage = await prompt.formatMessages({
//     topic: "AL/ML", // ai, google
//     words: 50, //number of words
//   });

// const chain = prompt.pipe(model);

// const response = chain.invoke([
//   {
//     topic: "maths",
//     words: 40,
//   },
//   {
//     topic: "bio",
//     words: 40,
//   },
// ]);
// console.log(response.content); //for two parametr it give undefined in cotent so we use outputparser also

//---Using output parser

// const chain = prompt.pipe(model).pipe(new StringOutputParser());
const chain = prompt.pipe(model).pipe(new CommaSeperatedListOutputParser());

// const response = chain.invoke({
//   topic: "maths",
//   words: 40,
// });
//OR
const response = chain.invoke([
  {
    topic: "maths",
    words: 40,
  },
  {
    topic: "bio",
    words: 40,
  },
]);

console.log(response);
