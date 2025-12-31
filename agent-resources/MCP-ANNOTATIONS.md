# MCP Tool Annotations Cheat Sheet

## What Are Annotations?

Annotations are hints that describe a tool's behavior to clients (like ChatGPT). They help the system understand what a tool does without executing it.

> **Important:** These are *hints*, not guarantees. Clients use them for UI/UX decisions but should not rely on them for security.

---

## The 3 Key Annotations

| Annotation | Default | Meaning |
|------------|---------|---------|
| `readOnlyHint` | `false` | Does the tool modify anything? |
| `openWorldHint` | `true` | Does the tool access external services? |
| `destructiveHint` | `true` | Can the tool delete/overwrite data? |

### `readOnlyHint`
- `true` = Tool only reads data, no side effects
- `false` = Tool writes, creates, or modifies something

### `openWorldHint`
- `true` = Tool makes HTTP requests to external APIs/services
- `false` = Tool only accesses local/internal resources (cache, database, memory)

### `destructiveHint`
- `true` = Tool may delete or overwrite existing data
- `false` = Tool only creates new data (additive operations)
- *(Only meaningful when `readOnlyHint: false`)*

---

## How to Add Annotations

```typescript
import { McpServer } from "skybridge/server";
import { z } from "zod";

const server = new McpServer(...)
  .registerTool(
    "my-tool",
    {
      description: "What the tool does",
      inputSchema: {
        param: z.string().describe("Parameter description"),
      },
      annotations: {
        readOnlyHint: true,      // Only reads, no writes
        openWorldHint: false,    // No external API calls
        destructiveHint: false,  // Doesn't delete anything
      },
    },
    async ({ param }) => {
      // Tool implementation
    }
  );
```

---

## Quick Decision Tree

```
Does the tool write/create/modify anything?
├─ NO  → readOnlyHint: true
└─ YES → readOnlyHint: false
         │
         ├─ Does it DELETE or OVERWRITE existing data?
         │  ├─ YES → destructiveHint: true
         │  └─ NO  → destructiveHint: false
         │
         └─ Does it call external APIs/services?
            ├─ YES → openWorldHint: true
            └─ NO  → openWorldHint: false
```

---

## Justification Templates for App Submission

### readOnlyHint: true
> "This tool only reads from [cache/database/memory]. It makes no writes and no external API calls."

### readOnlyHint: false
> "This tool writes to [describe what: cache, database, external service]. It [creates/uploads/stores] [what]."

### openWorldHint: true
> "This tool makes HTTP requests to [service name] API to [fetch/upload/store] data."

### openWorldHint: false
> "This tool only accesses local [cache/memory/database]. It makes no HTTP requests to external services."

### destructiveHint: true
> "This tool may [delete/overwrite/modify] existing [data/resources/records]."

### destructiveHint: false
> "This tool only creates new [resources/entries/data]. It does not delete, modify, or overwrite existing data."

---

## Example: Gradient Tweet App

| Tool | readOnly | openWorld | destructive | Why |
|------|----------|-----------|-------------|-----|
| `tweet-card` | `false` | `true` | `false` | Writes to cache, calls Apify API, only creates new entries |
| `check-tweet-status` | `true` | `false` | `false` | Only reads from in-memory cache |
| `generate-share` | `false` | `true` | `false` | Uploads to Cloudinary, stores in KV, only creates new resources |

