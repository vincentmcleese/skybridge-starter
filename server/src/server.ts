import { z } from "zod";
import { McpServer } from "skybridge/server";

const server = new McpServer(
  { name: "my-app", version: "0.0.1" },
  { capabilities: {} }
)
  // Example widget tool - displays a greeting in ChatGPT
  .registerWidget(
    "hello",
    { description: "A simple greeting widget" },
    {
      description: "Show a personalized greeting. Use this when the user asks for a greeting or wants to see a demo.",
      inputSchema: {
        name: z.string().optional().describe("Name to greet (defaults to 'World')"),
      },
    },
    async ({ name }) => {
      const greetName = name || "World";
      
      return {
        structuredContent: {
          name: greetName,
          timestamp: new Date().toISOString(),
        },
        content: [
          {
            type: "text",
            text: `Greeting ${greetName}! The widget is now displayed.`,
          },
        ],
        isError: false,
      };
    }
  )
  // Example regular tool (no widget) - just returns text
  .registerTool(
    "get_time",
    {
      description: "Get the current server time. Use this when the user asks what time it is.",
      inputSchema: {},
    },
    async () => {
      const now = new Date();
      
      return {
        content: [
          {
            type: "text",
            text: `The current server time is ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}.`,
          },
        ],
        isError: false,
      };
    }
  );

export default server;
export type AppType = typeof server;

