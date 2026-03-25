//ChatPromptTemplate in LangChain

//(1)What is ChatPromptTemplate---jb bhi ham chahte hai ki ek specific format me chatgpt se communicate kare
//                                  then we will use ChatPromptTemplate  . ye langchain ka feature hai.
//like --   tell me about ai in 100 words ,  temm me about google in 100 words

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

async function chat() {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "explain topic within 100 words"],
    ["human", "tell me about {topic} with example"],
  ]);
    const formatedMessage = await prompt.formatMessages({
        topic: "javascript"// ai, google  
    });

    const response = await model.invoke(formatedMessage);

    console.log(response.content);
    
}
