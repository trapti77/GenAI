//Basic Config with gemini
//(1)systemInstruction--- you can get answer according to your need like how many words you want ans
//(2) thinkingConfig --- aswer to deta hai but ek summary bhi deta hai chhoti si , it take two parameters.  if you use this then your token use more and token expensive
//(i)includeThoughts -- if it is true then thinkingConfig work means give summanry other wise not  .
//(ii)thinkingBudget -- like how much should think or not
//(3) temperature    -- like kitna stable and good and details ans rahega
//temperature Range and use  
//(1) 0.0->0.3  -- Deteministic, factual , stable outputs , Good for coding , math, precise infrastructure
//(2) 0.5->0.7  -- Balanced creativity+reliability , Good for explanations , tutorials, product descriptions
//(3) 0.8 ->1.0 (for higher ex 1.2-2.0):  -- Create ,varied , imaginative , Useful for Brainstorming , storyTelling , poetry ,jokes
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const googleAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  const response = await googleAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "what should i wear in ",
    config: {
      temperature: 2.0,
      //   thinkingConfig: {
      //     includeThoughts: true,
      //     thinkingBudget:100
      //     },
      systemInstruction: "give answer in 20 words",
    },
  });
  console.log(response.candidates[0].content);
}

main();
