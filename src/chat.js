// import { ChatOllama } from "@langchain/community/chat_models/ollama";
// import { StringOutputParser } from "@langchain/core/output_parsers";

// const model = new ChatOllama({
//   baseUrl: "http://localhost:11434",
//   model: "gemma:2b",
// });

// const stream = await model
//   .pipe(new StringOutputParser())
//   .stream(`Translate "I love programming" into Chinese.`);

// const chunks = [];
// for await (const chunk of stream) {
//   chunks.push(chunk);
// }

// console.log(chunks.join(""));

import ollama from 'ollama'

const message = { role: 'user', content: 'Translate "I love programming" into Chinese.' }
const response = await ollama.chat({
  model: "gemma:2b",
  messages: [message],
  stream: true 
})

for await (const part of response) {
  process.stdout.write(part.message.content)
}
