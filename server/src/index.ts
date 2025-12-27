import express, { type Express } from "express";
import cors from "cors";

import { widgetsDevServer } from "skybridge/server";
import type { ViteDevServer } from "vite";
import { env } from "./env.js";
import { mcp } from "./middleware.js";
import server from "./server.js";

const app = express() as Express & { vite: ViteDevServer };

// Enable CORS for potential API endpoints
app.use(cors());
app.use(express.json());

// Mount the MCP handler
app.use(mcp(server));

// Enable Vite HMR in development
if (env.NODE_ENV !== "production") {
  app.use(await widgetsDevServer());
}

// Start the server
app.listen(3000, (error) => {
  if (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }

  console.log(`Server listening on port 3000 - ${env.NODE_ENV}`);
  console.log(
    "Make your local server accessible with 'ngrok http 3000' and connect to ChatGPT with URL https://xxxxxx.ngrok-free.app/mcp",
  );
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Server shutdown complete");
  process.exit(0);
});

