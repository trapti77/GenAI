import OpenAI from "openai";
import { encoding_for_model } from "tiktoken";

const prompt = "what is coding in 20 word";
const model = "gpt-4o-mini";


const client = new OpenAI({ apiKey: SECRET_KEY });

const response = await client.responses.create({
  input: [{ role: "developer", content: prompt }],
  model: model,
});

console.log(response);

function calculateToken() {
    const encoder = encoding_for_model(model);
    const tokenData = encoder.encode(prompt);

    console.log(tokenData);
}

calculateToken();
