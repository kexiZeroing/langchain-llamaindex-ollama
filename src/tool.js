import { z } from "zod";
// Only available in @langchain/core version 0.2.7 and above.
import { tool, DynamicStructuredTool } from "@langchain/core/tools";

const adderSchema = z.object({
  a: z.number(),
  b: z.number(),
});

const adderTool = tool(
  async (input) => {
    const sum = input.a + input.b;
    console.log(`The sum of ${input.a} and ${input.b} is ${sum}`);
    return `The sum of ${input.a} and ${input.b} is ${sum}`;
  },
  {
    name: "adder",
    description: "Adds two numbers together",
    schema: adderSchema,
  }
);

await adderTool.invoke({ a: 1, b: 2 });


const multiplyTool = new DynamicStructuredTool({
  name: "multiply",
  description: "multiply two numbers together",
  schema: z.object({
    a: z.number().describe("the first number to multiply"),
    b: z.number().describe("the second number to multiply"),
  }),
  func: async ({ a, b }) => {
    console.log(`The product of ${a} and ${b} is ${a * b}`);
    return (a * b).toString();
  },
});

await multiplyTool.invoke({ a: 8, b: 9 });