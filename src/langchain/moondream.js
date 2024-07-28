import { Ollama } from "@langchain/community/llms/ollama";
import * as fs from "node:fs/promises";

const imageData = await fs.readFile("../../files/cat.jpg");
const model = new Ollama({
  model: "moondream", // a tiny vision model 
  baseUrl: "http://localhost:11434",
}).bind({
  images: [imageData.toString("base64")],
});

const res = await model.invoke("What's in this image?");
console.log({ res });
