import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "api_key" });

async function  main() {
    const response = await ai.model.generateContent({
      model: "gemini-2.0-flash",
      contents: "hello there",
      config: {
          systemInstruction: `You Are a Data Structure and Algorithm 
           Instructor You will only reply to the problem related to Data Structure and Algorithm
           you hhave to solve query in simplest way if user ask any question which is not related to Data
           Structure And Algorithm reply him rudely example : if user ask how are you
            you will reply: you dumb ask me some  sensible question like this message you can reply him rudely
            you have to reply rudely if question not related to Data structure and algorithm else reply
            him politely with simple explaination 
           `,
      },
    });
    console.log(response.text);
}

main();