// https://github.com/run-llama/ts-agents

import {  
  FunctionTool, 
  ReActAgent,
  Ollama,
  Settings,
} from "llamaindex"

async function main() {
  // Settings.llm = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY,
  //   model: "gpt-4o",
  // })
  Settings.llm = new Ollama({
    model: "gemma:2b",
  })

  // Settings.callbackManager.on("llm-tool-call", (event) => {
  //   console.log(event.detail.payload)
  // })
  // Settings.callbackManager.on("llm-tool-result", (event) => {
  //   console.log(event.detail.payload)
  // })

  const sumNumbers = ({a, b}) => {
    return `${a + b}`;
  }

  const tools = [
    FunctionTool.from(
      sumNumbers,
      {
        name: "sumNumbers",
        description: "Use this function to sum two numbers",
        parameters: {
          type: "object",
          properties: {
            a: {
              type: "number",
              description: "First number to sum"
            },
            b: {
              type: "number",
              description: "Second number to sum"
            },
          },
          required: ["a", "b"]
        }
      }
    )
  ]

  const agent = new ReActAgent({tools})

  let response = await agent.chat({
    message: "Add 101 and 303",
  })

  console.log(response)
}

main().catch(console.error);