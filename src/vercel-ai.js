// https://github.com/sgomez/ollama-ai-provider

import { generateText, streamText, embedMany } from 'ai'
import { ollama } from 'ollama-ai-provider'

async function main() {
  // const { text } = await generateText({
  //   model: ollama('gemma:2b'),
  //   messages: [{ role: "user", content: 'Invent a new holiday and describe its traditions.' }],
  // });

  const result = await streamText({
    maxTokens: 1024,
    model: ollama('gemma:2b'),
    prompt: 'Invent a new holiday and describe its traditions.',
    temperature: 0.3,
  })

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart)
  }

  console.log('Token usage:', await result.usage)

  console.log('Generating embeddings...')
  generateEmbeddings(`
    My favorite food is sushi.
    My hobby is reading.
    I often go hiking on weekends.
  `)
}

main()

const generateEmbeddings = async (value) => {
  const chunks = generateChunks(value);
  const embeddingModel = ollama.embedding("nomic-embed-text");

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  console.log(embeddings.map((e, i) => ({ content: chunks[i], embedding: e })));
};

const generateChunks = (input) => {
  return input
    .trim()
    .split("\n")
    .filter((i) => i !== "");
};
