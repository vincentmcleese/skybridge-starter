# Agent Instructions

> Guidelines for AI coding agents working on Skybridge ChatGPT Apps

---

## Communication Style

**Explain everything as if teaching a junior engineer:**

- Use simple, clear language
- Avoid jargon without explanation
- Break complex tasks into small steps
- Explain the "why" behind decisions, not just the "what"

**When in doubt, ASK:**

- If you're unsure about a pattern or approach, STOP and ask the user
- If requirements are unclear, clarify before writing code
- If you encounter something unexpected, explain it and ask for guidance
- Never guess or assume - it's better to ask than to introduce bugs

---

## Skybridge Framework

**This app uses the Skybridge framework for building ChatGPT Apps.**

### Required Reading

Before writing ANY widget or server code, thoroughly reference:

```
@skybridge-agent-docs.md
```

This documentation contains:
- All available hooks (`useToolInfo`, `useCallTool`, `useTheme`, etc.)
- Patterns for state management, context sync, and data flow
- Best practices and anti-patterns
- Type inference with `generateHelpers`

### When Writing New Code

1. **Check the docs first** - Is there a hook or pattern for what you need?
2. **Follow existing patterns** - Look at how similar features are implemented
3. **Ask if unsure** - If a pattern seems new or undocumented, ask the user

---

## Development Setup

### Installing Dependencies

```bash
pnpm install
```

### Running the Dev Server

```bash
pnpm dev
```

This runs `nodemon` which watches for file changes and restarts automatically.

### Running ngrok (for ChatGPT to reach local server)

```bash
# In a separate terminal
ngrok http 3000
```

---

## Commit Workflow

**Always follow this sequence before committing:**

### Step 1: Type Check

```bash
cd server
pnpm build
```

Fix any TypeScript errors before proceeding.

### Step 2: Build

```bash
pnpm build
```

Ensure the production build succeeds.

### Step 3: Commit

Write a **short, concise commit message** that:
- Starts with a verb (Add, Fix, Update, Remove, Refactor)
- Is under 50 characters for the subject line
- Describes WHAT changed, not HOW

---

## Code Principles

### DRY (Don't Repeat Yourself)

- Extract repeated logic into reusable functions
- Create shared components for common UI patterns
- Use custom hooks to encapsulate repeated stateful logic
- If you copy-paste code, that's a signal to refactor

### Modular Design

- One component, one file, one responsibility
- Keep components small and focused (< 100 lines ideally)
- Separate concerns: UI, state, data fetching, styling
- Create helper files for utility functions
- Use TypeScript types to define clear interfaces between modules

---

## Widget Naming Convention

**CRITICAL:** The endpoint name in your MCP server must match the widget file name.

| Server Endpoint | Widget File Path |
|-----------------|------------------|
| `hello` | `web/src/widgets/hello.tsx` |
| `my-widget` | `web/src/widgets/my-widget.tsx` |
| `search-results` | `web/src/widgets/search-results.tsx` |

---

## Key Patterns

### Initial Data from Tool

```typescript
const toolInfo = useToolInfo<"widget-name">();
const data = toolInfo.output; // Data from structuredContent
```

### Display Mode Toggle (PiP)

```typescript
const [displayMode, setDisplayMode] = useDisplayMode();
const isPip = displayMode === "pip";

// User must click a button to activate PiP (ChatGPT requirement)
<button onClick={() => setDisplayMode("pip")}>Float</button>
```

### Theme Awareness

```typescript
const theme = useTheme();
const isDark = theme === "dark";
```

### Calling Other Tools

```typescript
const { callTool, isPending, data } = useCallTool("other-tool");
callTool({ arg1: "value" });
```

