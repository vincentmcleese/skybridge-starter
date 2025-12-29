# Skybridge Starter

A minimal starter template for building ChatGPT Apps using the Skybridge framework and Model Context Protocol (MCP).

## Overview

This template includes:

- **Server**: Express + MCP server with example tools
- **Web**: React widgets with Vite HMR, Tailwind CSS, and shadcn/ui
- **Example Widget**: A "hello" widget demonstrating core patterns

## Quick Start

### Prerequisites

- Node.js 22+ (see `.nvmrc`)
- pnpm (`npm install -g pnpm`)
- ngrok (for exposing local server to ChatGPT)

### 1. Install Dependencies

```bash
cd skybridge-starter
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

This starts an Express server on port 3000 with:
- MCP endpoint at `/mcp`
- Vite HMR for React widgets

### 3. Expose to ChatGPT

In a separate terminal:

```bash
ngrok http 3000
```

Copy the forwarding URL (e.g., `https://abc123.ngrok-free.app`).

### 4. Connect to ChatGPT

1. Go to **Settings → Connectors → Create** in ChatGPT
2. Enable **Developer mode** in Settings → Connectors → Advanced
3. Enter your ngrok URL with `/mcp` path: `https://abc123.ngrok-free.app/mcp`
4. Click **Create**

### 5. Test It

Start a new conversation, select your connector, and try:
- "Say hello to me"
- "What time is it?"

## Project Structure

```
skybridge-starter/
├── server/
│   └── src/
│       ├── index.ts      # Express server entry point
│       ├── server.ts     # MCP tools and widgets
│       ├── middleware.ts # MCP transport handler
│       └── env.ts        # Environment config
├── web/
│   └── src/
│       ├── widgets/      # React widget components
│       │   └── hello.tsx # Example widget
│       ├── icons/        # Reusable icon components
│       │   └── index.tsx # SVG icons as React components
│       ├── helpers.ts    # Skybridge type helpers
│       ├── utils.ts      # Utility functions
│       └── index.css     # Tailwind + theme CSS
├── agent-resources/      # AI agent reference (see note below)
└── AGENTS.md             # AI agent instructions (see note below)
```

### Agent Resources (Safe to Delete)

The following files are **for AI coding agents only** and are **not required** for the app to build or run:

- `agent-resources/` - Design guidelines, icon reference library, and framework docs
- `AGENTS.md` - Instructions for AI coding assistants

These files help AI agents understand the project and follow best practices, but they are **not bundled** with your production build. You can safely delete them if you're not using AI coding tools, or keep them for future AI-assisted development.

## Adding New Features

### Creating a Widget

1. **Register the widget in `server/src/server.ts`**:

```typescript
.registerWidget(
  "my-widget",           // Must match widget filename
  { description: "..." },
  {
    description: "...",
    inputSchema: { /* zod schema */ },
  },
  async (args) => ({
    structuredContent: { /* data for widget */ },
    content: [{ type: "text", text: "..." }],
  })
)
```

2. **Create matching widget file `web/src/widgets/my-widget.tsx`**:

```typescript
import { mountWidget, useDisplayMode, useTheme } from "skybridge/web";
import { useToolInfo } from "../helpers";

function MyWidget() {
  const toolInfo = useToolInfo<"my-widget">();
  const [displayMode, setDisplayMode] = useDisplayMode();
  const theme = useTheme();
  
  // Your widget UI here
  return <div>...</div>;
}

export default MyWidget;
mountWidget(<MyWidget />);
```

### Creating a Regular Tool (No Widget)

```typescript
.registerTool(
  "my-tool",
  {
    description: "...",
    inputSchema: { /* zod schema */ },
  },
  async (args) => ({
    content: [{ type: "text", text: "Response text" }],
  })
)
```

## Key Hooks

| Hook | Purpose |
|------|---------|
| `useToolInfo<"widget-name">()` | Access data from the MCP tool |
| `useDisplayMode()` | Toggle inline/PiP mode |
| `useTheme()` | Get ChatGPT's light/dark theme |
| `useCallTool("tool-name")` | Call other tools from widget |
| `useSendFollowUpMessage()` | Send messages to chat |

## Building for Production

```bash
pnpm build
```

This:
1. Builds the React widgets
2. Compiles TypeScript server
3. Bundles everything into `server/dist/`

## Resources

- [Skybridge Agent Docs](agent-resources/skybridge-agent-docs.md) - Full framework documentation
- [OpenAI Design Guidelines](agent-resources/openai-design-guidelines.md) - UI/UX guidelines for ChatGPT Apps
- [OpenAI Apps SDK](https://developers.openai.com/apps-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io/)

