import { generateText, tool } from 'ai';
import { ollama } from 'ollama-ai-provider'
import { z } from 'zod';

async function main() {
  const result = await generateText({
    // I don't think this model supports function calling
    // https://www.reddit.com/r/ollama/comments/1ei3tdc/gemma2b_calling_function_ollama/
    model: ollama('gemma:2b'), 
    maxTokens: 512,
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      }),
      cityAttractions: tool({
        parameters: z.object({ city: z.string() }),
      }),
    },
    prompt:
      'What is the weather in San Francisco and what attractions should I visit?',
  });

  // If the model decides to call a tool, it will generate a tool call.
  // You can access the tool call by checking the toolCalls property on the result.
  for (const toolCall of result.toolCalls) {
    switch (toolCall.toolName) {
      case 'cityAttractions': {
        toolCall.args.city; // string
        break;
      }

      case 'weather': {
        toolCall.args.location; // string
        break;
      }
    }
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);