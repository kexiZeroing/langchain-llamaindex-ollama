import { ChromaClient } from 'chromadb'

// import { ProxyAgent, setGlobalDispatcher } from 'undici'
// const dispatcher = new ProxyAgent({ uri: new URL('http://127.0.0.1:7890').toString() });
// setGlobalDispatcher(dispatcher);

// docker pull chromadb/chroma 
// docker run -p 8000:8000 chromadb/chroma 
const client = new ChromaClient();

// https://docs.trychroma.com/integrations/ollama
// const embedder = new OllamaEmbeddingFunction({
//   url: "http://127.0.0.1:11434/api/embeddings",
//   model: "nomic-embed-text"
// });

const collection = await client.getOrCreateCollection({
  name: "my_collection",
  // embeddingFunction: embedder
});

await collection.upsert({
  documents: [
    "This is a document about pineapple",
    "This is a document about oranges"
  ],
  ids: ["id1", "id2"],
});

const results = await collection.query({
  queryTexts: ["This is a query document about florida"], // Chroma will embed this for you
  nResults: 2, // how many results to return
});

console.log(results);
