import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

const loader = new CheerioWebBaseLoader(
  "https://kexizeroing.github.io/",
  {
    selector: "div.bio.show",
  }
);

const docs = await loader.load();

console.log(docs)