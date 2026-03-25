//Generat images with help of langchain
//(1) import dalle wrapper(open ai ka dalle model)
//(2) pass params to dalle wrapper
//(3) pass prompt

import {DallEAPIWrapper} from "@langchain/openai";
import dotenv from "dotenv";
dotenv.config()

async function generateImages() {
    const dalleWrapper = new DallEAPIWrapper({
      apiKey: process.env.OPENAI_API_KEY,
      n: 1, //number of result
      model: "dall-e-3",
    });

    const imageURL = await dalleWrapper.invoke("cat jumping on bed");
    console.log(imageURL);
}

generateImages();

