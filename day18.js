
//how embedding help to find result
//dimensionas in embedding
//Generate embedding for string


//important ------ dimantions jitni jyada hogi result utana hi accurate aata hai
//like --  (1) text-embedding-3-small ------1536 dimention
//         (2) text-embedding-3-large -----3042 dimentions
//          (3)  text-embedding-ada-002 ----1536 dimention
import OpenAI from "openai";
import { configDotenv } from "dotenv";
import {writeFileSync} from "fs"

const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });
const animals = ["Lions", "Tiger", "Elephant", "Giraffe", "Zebra", "Monkey", "Panda", "Kangaroo", "Leopard", "Bear"];
//ham find karenge kaun se animal jyada logo se friendly hai kaun se animal ka size bada hai


async function main() {
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: animals,  //"dog is a animal"
  });
    const manageEmbedding = response.data.map((item, index) => {
        const itemKey = data[index];
        return {[itemKey]:item.embedding}
    })
    console.log(response.data);
    writeFileSync("animals.json",JSON.stringify(manageEmbedding));
}

main();
