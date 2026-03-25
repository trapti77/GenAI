//Maitain chat Context==means maintain(remember) old question answer or content
//What it context 
//How can you maintain Context so that token less use
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.Open_api_key });

const context = [
    {
        role: 'system',
        content:"keep answer short and simple"
    }
]
const aiAnswer = async (question) => {
    context.push({ role: "user", content: question });
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: context,
  });
   context.push({role:"assistant",content:response.output_text})
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


