//OPEN AI Optional Prameter

//tempreture
//max_output_token
////store and retriev response with id

import OpenAI from "openai";
import { encoding_for_model } from "tiktoken";

const prompt = "what is coding in 20 word";
const model = "gpt-4o-mini";


const client = new OpenAI({ apiKey: SECRET_KEY });

const response = await client.responses.create({
  input: [{ role: "developer", content: prompt }],
    model: model,
    temperature: 0 ,
    //0,1,2  --- number wise random charatcter badh jate hai
    max_output_tokens: 10,
    //max 10 word ka output dega
    store:true
//store response id jiske through you can get(retrieve) old response
});

console.log(response);

const oldRes = await client.responses.retrieve("resp_fhefhdf73457345f7y5745f78593");

console.log(oldRes);

