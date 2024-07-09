// https://github.com/sgomez/ollama-ai-provider

import { streamText } from 'ai'
import { ollama } from 'ollama-ai-provider'

async function main() {
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
}

main()
