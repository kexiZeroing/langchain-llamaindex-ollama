// https://ts.llamaindex.ai/getting_started/starter_tutorial/retrieval_augmented_generation

import fs from "node:fs/promises";
import {
  Document,
  MetadataMode,
  Ollama,
  Settings,
  VectorStoreIndex,
} from "llamaindex";

// Using a local model via Ollama
Settings.llm = new Ollama({
  model: "gemma:2b",
});
Settings.embedModel = new Ollama({
  model: "nomic-embed-text",
});

async function main() {
  const path = "node_modules/llamaindex/examples/abramov.txt";

  const essay = await fs.readFile(path, "utf-8");

  // Create Document object with essay
  const document = new Document({ text: essay, id_: path });

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments([document]);

  // Query the index
  const queryEngine = index.asQueryEngine();
  const { response, sourceNodes } = await queryEngine.query({
    query: "What did the author do in college?",
  });

  console.log(response);

  if (sourceNodes) {
    sourceNodes.forEach((source, index) => {
      console.log(
        `\n${index}: Score: ${source.score} - ${source.node.getContent(MetadataMode.NONE).substring(0, 50)}...\n`,
      );
    });
  }
}

main().catch(console.error);