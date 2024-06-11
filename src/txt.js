import { TextLoader } from "langchain/document_loaders/fs/text";

const loader = new TextLoader("files/example_TXT.txt");

const docs = await loader.load();

console.log(docs)