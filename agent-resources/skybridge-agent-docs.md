# Skybridge Framework Documentation

> Agent-optimized reference for building ChatGPT Apps with Skybridge

---

## Quick Navigation

- [Quick Reference](#quick-reference)
- [Introduction](#introduction)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
  - [State Management](#state-management)
  - [Context Sync](#context-sync)
  - [Actions](#actions)
  - [UI and Display](#ui-and-display)
  - [Type Inference](#type-inference)
  - [Low-Level Access](#low-level-access)
- [Patterns and Recipes](#patterns-and-recipes)
- [Decision Trees](#decision-trees)
- [Type Reference](#type-reference)

---

## Quick Reference

### Hook Selection Guide

| Need | Hook | When to Use |
|------|------|-------------|
| Initial tool data | `useToolInfo` | Access data passed from MCP tool to widget on mount |
| Persist widget state | `useWidgetState` | Simple state that survives re-renders |
| Complex state with actions | `createStore` | Zustand-like store with actions and middleware |
| Call MCP tools | `useCallTool` | User-triggered data fetching from server |
| Send chat messages | `useSendFollowUpMessage` | Programmatically continue the conversation |
| Open external URLs | `useOpenExternal` | Navigate users to external sites |
| Upload/download files | `useFiles` | File operations within widget |
| Get theme | `useTheme` | Match widget styling to ChatGPT theme |
| Get/set display mode | `useDisplayMode` | Control inline/fullscreen/pip modes |
| Open modal | `useRequestModal` | Show content outside iframe bounds |
| Get locale | `useLocale` | Internationalization support |
| Get device info | `useUserAgent` | Responsive layouts and touch detection |
| Low-level globals | `useOpenAiGlobal` | Access any window.openai property |
| Sync state to model | `data-llm` attribute | Tell ChatGPT what user is viewing |

### Import Cheatsheet

```typescript
import {
  // State Management
  useToolInfo,
  useWidgetState,
  createStore,
  
  // Actions
  useCallTool,
  useSendFollowUpMessage,
  useOpenExternal,
  useFiles,
  
  // UI and Display
  useTheme,
  useDisplayMode,
  useRequestModal,
  useLocale,
  useUserAgent,
  
  // Low-Level
  useOpenAiGlobal,
} from "skybridge/web";

// Type-safe hooks (recommended)
import { generateHelpers } from "skybridge/web";
import type { AppType } from "../server";
export const { useCallTool, useToolInfo } = generateHelpers<AppType>();
```

---

## Introduction

### What is Skybridge?

Skybridge is a modular framework for quickly building ChatGPT apps, the modern TypeScript way.

**Core Features:**
- Full dev environment with HMR, debug traces, and devtools
- End-to-end typesafe APIs
- Widget-to-model synchronization tooling
- React-query and Zustand-like state management hooks

### Three Main Components

| Component | Description |
|-----------|-------------|
| `skybridge/server` | Drop-in replacement for official MCP SDK with widget registration and type inference |
| `skybridge/web` | React library with hooks, components, and runtime glue for ChatGPT iframe widgets |
| Vite Plugin | Local dev environment with HMR and optimized asset building |

### What Skybridge is NOT

Skybridge is **NOT** another MCP SDK. It extends the official TypeScript MCP SDK and improves ChatGPT Apps APIs, making it compatible with any MCP Server and runtime.

### Prerequisites

To build effectively with Skybridge, you need to understand:
1. **Model Context Protocol (MCP)** - Open standard for AI models to connect with external tools and resources
2. **OpenAI Apps SDK** - ChatGPT Apps primitives for UI rendering and state persistence

---

## Architecture

### MCP (Model Context Protocol)

MCP is an API layer specifically designed for LLMs. An MCP server exposes:

| Type | Description | Examples |
|------|-------------|----------|
| **Tools** | Functions the model can call | `search_flights`, `get_weather` |
| **Resources** | Data the model can access | Files, UI components |

### ChatGPT Apps Components

A ChatGPT App consists of:

| Component | Role |
|-----------|------|
| **MCP Server** | Handles business logic, exposes tools |
| **UI Widgets** | React components rendered in ChatGPT's interface |

When a tool is called, it returns:
- **Text content**: What the model sees and responds with
- **Widget content**: Visual UI that renders for the user

### The Three Actors

```
┌─────────────────────────────────────────────────────────────┐
│                      ChatGPT (Host)                         │
│         Conversational interface for user/model             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Your MCP Server                         │
│              Backend exposing tools and logic               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Your Widget (Guest)                       │
│          React component in iframe inside ChatGPT          │
└─────────────────────────────────────────────────────────────┘
```

### Widget Rendering Flow

1. User asks ChatGPT to perform an action (e.g., "Show me flight options to Paris")
2. ChatGPT calls your MCP tool (e.g., `search_flights`)
3. Tool returns result with data and UI resource reference
4. ChatGPT fetches resource (compiled React component)
5. Widget renders in iframe, hydrated with `structuredContent` and `_meta`

### The window.openai API

Widgets have access to a special `window.openai` API:

| Property/Method | Purpose |
|----------------|---------|
| `toolOutput` | Access initial data from tool |
| `widgetState` | Persist UI state across interactions |
| `callTool()` | Trigger additional tool calls |
| `sendFollowUpMessage()` | Send messages back to chat |
| `setWidgetState()` | Update persistent state |
| `theme` | Current theme ("light" or "dark") |
| `locale` | User's locale |
| `displayMode` | Current display mode |

**Skybridge wraps these with React hooks for better DX.**

---

## Getting Started

### Widget Naming Convention

**CRITICAL:** The endpoint name in your MCP server must match the widget file name.

| Server Endpoint | Widget File Path |
|-----------------|------------------|
| `pokemon-card` | `web/src/widgets/pokemon-card.tsx` |
| `search-hotels` | `web/src/widgets/search-hotels.tsx` |

### Project Structure

```
my-chatgpt-app/
├── server/
│   └── src/
│       └── index.ts        # MCP server with tool registrations
├── web/
│   └── src/
│       ├── skybridge.ts    # generateHelpers setup
│       └── widgets/
│           └── my-widget.tsx
```

### Basic Server Setup

```typescript
// server/src/index.ts
import { McpServer } from "skybridge/server";
import { z } from "zod";

const server = new McpServer({ name: "my-app", version: "1.0" }, {})
  .registerWidget("my-widget", {}, {
    inputSchema: { query: z.string() },
  }, async ({ query }) => {
    return {
      content: [{ type: "text", text: `Results for ${query}` }],
      structuredContent: { results: [] }
    };
  });

export type AppType = typeof server;
```

### Basic Widget Setup

```typescript
// web/src/widgets/my-widget.tsx
import { useToolInfo } from "skybridge/web";

export function MyWidget() {
  const { output, isSuccess } = useToolInfo<{
    output: { results: string[] };
  }>();

  if (!isSuccess) return <div>Loading...</div>;

  return (
    <ul>
      {output.results.map((r, i) => <li key={i}>{r}</li>)}
    </ul>
  );
}
```

---

## Core Concepts

### From Imperative to Declarative

Skybridge wraps the raw `window.openai` API with React hooks.

#### Hook Mapping Table

| Raw API | Skybridge Hook | Purpose |
|---------|----------------|---------|
| `window.openai.toolOutput` | `useToolInfo()` | Access initial tool input and output |
| `window.openai.widgetState` | `useWidgetState()` | Manage persistent widget state |
| `window.openai.callTool()` | `useCallTool()` | Make additional tool calls |
| `window.openai.sendFollowUpMessage()` | `useSendFollowUpMessage()` | Send follow-up messages |
| `window.openai.openExternal()` | `useOpenExternal()` | Open external URLs |
| `window.openai.requestModal()` | `useRequestModal()` | Request modal display |
| `window.openai.theme` | `useTheme()` | Access ChatGPT theme |
| `window.openai.locale` | `useLocale()` | Access user locale |
| `window.openai.displayMode` | `useDisplayMode()` | Access display mode |
| `window.openai.requestDisplayMode()` | `useDisplayMode()` | Request display mode change |
| `window.openai.userAgent` | `useUserAgent()` | Access user agent info |
| `window.openai.*` | `useOpenAiGlobal()` | Access any global value |

#### Before and After Comparison

**Without Skybridge (Raw API):**

```typescript
import { useEffect, useState } from "react";

function WeatherWidget() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const updateTheme = () => {
      setTheme(window.openai?.theme || "light");
    };
    updateTheme();
    
    window.addEventListener("message", (event) => {
      if (event.data.type === "openai:set_globals") {
        updateTheme();
      }
    });
  }, []);

  const handleGetWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.openai.callTool("getWeather", { 
        city, 
        units: "metric" 
      });
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <div style={{ 
      backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000" 
    }}>
      <button 
        disabled={loading} 
        onClick={() => handleGetWeather("Paris")}
      >
        {loading ? "Loading..." : "Get Weather"}
      </button>
      
      {error && <p>Error: {String(error)}</p>}
      {data && <p>Temperature: {data.structuredContent.temperature}°C</p>}
    </div>
  );
}
```

**With Skybridge (React Hooks):**

```typescript
import { useCallTool, useTheme } from "skybridge/web";

function WeatherWidget() {
  const { callTool, isPending, data, isError, error } = useCallTool<
    { city: string; units: string },
    { structuredContent: { temperature: number } }
  >("getWeather");
  const theme = useTheme();
  const isDark = theme === "dark";

  return (
    <div style={{ 
      backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000" 
    }}>
      <button 
        disabled={isPending} 
        onClick={() => callTool({ city: "Paris", units: "metric" })}
      >
        {isPending ? "Loading..." : "Get Weather"}
      </button>
      
      {isError && <p>Error: {String(error)}</p>}
      {data && <p>Temperature: {data.structuredContent.temperature}°C</p>}
    </div>
  );
}
```

### Data Flow Patterns

#### Pattern 1: Tool to Widget (Initial Hydration)

Use `useToolInfo` for the initial data that hydrates your widget.

**Server:**

```typescript
server.registerWidget("show_flights", {}, {
  inputSchema: { destination: z.string() },
}, async ({ destination }) => {
  const flights = await searchFlights(destination);
  
  return {
    content: [{ type: "text", text: `Found ${flights.length} flights` }],
    structuredContent: { flights }
  };
});
```

**Widget:**

```typescript
import { useToolInfo } from "skybridge/web";

export function FlightWidget() {
  const toolInfo = useToolInfo<{ flights: Flight[] }>();
  
  if (toolInfo.isSuccess) {
    const { flights } = toolInfo.output.structuredContent;
    return (
      <ul>
        {flights.map(flight => <li key={flight.id}>{flight.name}</li>)}
      </ul>
    );
  }
  
  return <div>Loading...</div>;
}
```

#### Pattern 2: Widget to Model (Context Sync)

Use `data-llm` attribute to sync UI state with ChatGPT.

```typescript
export function FlightWidget() {
  const [selectedFlight, setSelectedFlight] = useState(null);
  
  return (
    <div data-llm={selectedFlight 
      ? `User is viewing details for flight ${selectedFlight.id}` 
      : "User is browsing the flight list"
    }>
      {/* Your UI */}
    </div>
  );
}
```

The `data-llm` value is automatically injected into the model's context.

#### Pattern 3: Widget to Server (Tool Calls)

Use `useCallTool` for user-triggered data fetching.

```typescript
import { useCallTool } from "skybridge/web";

export function FlightWidget() {
  const { callTool, isPending, data } = useCallTool("get_flight_details");
  
  const handleViewDetails = (flightId: string) => {
    callTool({ flightId });
  };
  
  return (
    <button onClick={() => handleViewDetails("AF123")} disabled={isPending}>
      {isPending ? "Loading..." : "View Details"}
    </button>
  );
}
```

#### Pattern 4: Widget to Chat (Follow-up Messages)

Use `useSendFollowUpMessage` to continue the conversation.

```typescript
import { useSendFollowUpMessage } from "skybridge/web";

export function FlightWidget() {
  const sendMessage = useSendFollowUpMessage();
  
  const handleBookFlight = (flight: Flight) => {
    sendMessage({ 
      prompt: `I'd like to book the ${flight.name} flight. What payment methods do you accept?` 
    });
  };
  
  return <button onClick={() => handleBookFlight(selectedFlight)}>Book Now</button>;
}
```

### The Communication Loop

1. ChatGPT calls your tool -> Server responds with `structuredContent`
2. Widget hydrates with `useToolInfo`
3. User interacts -> Widget updates `data-llm` -> Model sees context
4. User triggers action -> Widget calls `useCallTool` -> Server responds
5. Widget sends follow-up -> `useSendFollowUpMessage` -> ChatGPT replies

### Key Takeaways

| Principle | Implementation |
|-----------|----------------|
| Initial data | Use `useToolInfo` for hydration |
| User actions | Use `useCallTool` for data fetching |
| Context sync | Use `data-llm` attribute |
| Type safety | Use `generateHelpers` for autocomplete |
| Mount behavior | Do NOT call tools on mount - pass initial data through `structuredContent` |

---

## API Reference

### State Management

#### useToolInfo

Access the tool's input arguments, output, and response metadata.

**Signature:**

```typescript
const {
  status,      // "pending" | "success"
  isPending,   // boolean
  isSuccess,   // boolean
  input,       // ToolInput (always available)
  output,      // ToolOutput | undefined
  responseMetadata, // ToolResponseMetadata | undefined
} = useToolInfo<ToolSignature>();
```

**Type Parameters:**

```typescript
type ToolSignature = {
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  responseMetadata?: Record<string, unknown>;
}
```

**When to Use:**
- Access initial data passed from MCP tool
- Display loading states during tool execution
- Access response metadata (request IDs, timing, etc.)

**When NOT to Use:**
- For user-triggered data fetching (use `useCallTool` instead)

**Basic Example:**

```typescript
import { useToolInfo } from "skybridge/web";

function WeatherWidget() {
  const { input, output, isPending, isSuccess } = useToolInfo<{
    input: { city: string };
    output: { temperature: number; conditions: string };
  }>();

  if (isPending) {
    return <p>Loading weather for {input.city}...</p>;
  }

  if (isSuccess) {
    return (
      <div>
        <h3>Weather in {input.city}</h3>
        <p>{output.temperature}°C - {output.conditions}</p>
      </div>
    );
  }

  return null;
}
```

**Loading State Example:**

```typescript
function DataWidget() {
  const { input, isPending, isSuccess, output } = useToolInfo<{
    input: { query: string };
    output: { results: string[] };
  }>();

  return (
    <div>
      <h3>Search: {input.query}</h3>
      {isPending && (
        <div className="loading">
          <span className="spinner" />
          <p>Searching...</p>
        </div>
      )}
      {isSuccess && (
        <ul>
          {output.results.map((result, i) => (
            <li key={i}>{result}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**With Response Metadata Example:**

```typescript
function ApiResultWidget() {
  const { input, output, responseMetadata, isSuccess } = useToolInfo<{
    input: { endpoint: string };
    output: { data: unknown };
    responseMetadata: { 
      requestId: string;
      duration: number;
      cached: boolean;
    };
  }>();

  if (!isSuccess) {
    return <p>Loading {input.endpoint}...</p>;
  }

  return (
    <div>
      <pre>{JSON.stringify(output.data, null, 2)}</pre>
      <footer className="metadata">
        <span>Request ID: {responseMetadata.requestId}</span>
        <span>Duration: {responseMetadata.duration}ms</span>
        {responseMetadata.cached && <span>Cached</span>}
      </footer>
    </div>
  );
}
```

**Progressive Enhancement Example:**

```typescript
function ProductWidget() {
  const { input, output, isPending, isSuccess } = useToolInfo<{
    input: { productId: string; name: string };
    output: { 
      price: number;
      stock: number;
      reviews: { rating: number; count: number };
    };
  }>();

  return (
    <div className="product-card">
      <h2>{input.name}</h2>

      {isPending && (
        <>
          <div className="skeleton price-skeleton" />
          <div className="skeleton stock-skeleton" />
        </>
      )}

      {isSuccess && (
        <>
          <p className="price">${output.price}</p>
          <p className="stock">
            {output.stock > 0 ? `${output.stock} in stock` : "Out of stock"}
          </p>
          <div className="reviews">
            <span>⭐ {output.reviews.rating}</span>
            <span>({output.reviews.count} reviews)</span>
          </div>
        </>
      )}
    </div>
  );
}
```

**Error Handling Pattern:**

```typescript
function SafeWidget() {
  const { input, output, isSuccess } = useToolInfo<{
    input: { id: string };
    output: { success: boolean; data?: unknown; error?: string };
  }>();

  if (!isSuccess) {
    return <p>Loading...</p>;
  }

  if (!output.success) {
    return (
      <div className="error">
        <p>Error: {output.error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="success">
      <pre>{JSON.stringify(output.data, null, 2)}</pre>
    </div>
  );
}
```

---

#### useWidgetState

Persist state across widget renders with a React `useState`-like API.

**When to Use:**
- Simple state that needs to persist
- Quick setup without Zustand knowledge

**When NOT to Use:**
- Complex state with actions (use `createStore`)
- Fine-grained subscriptions needed

---

#### createStore

Create a Zustand store that automatically syncs with widget's persistent state.

**Signature:**

```typescript
const useStore = createStore<State>(
  storeCreator: StateCreator<State>,
  defaultState?: State | (() => State)
);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `storeCreator` | `StateCreator<State>` | Zustand state creator function |
| `defaultState` | `State \| (() => State)` | Optional default state |

**Returns:**

```typescript
UseBoundStore<StoreApi<State>>
```

**Features:**
- Automatic State Persistence to `window.openai.setWidgetState`
- State serialized (functions stripped) before persistence

**State Initialization Priority:**
1. `window.openai.widgetState` (if available) - highest priority
2. `defaultState` parameter (if provided)
3. State returned by `storeCreator`

**Basic Example:**

```typescript
import { createStore } from "skybridge/web";

type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

const useCounterStore = createStore<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

function CounterWidget() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
```

**Todo List Example:**

```typescript
import { createStore } from "skybridge/web";
import { useState } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type TodoState = {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearCompleted: () => void;
};

const useTodoStore = createStore<TodoState>((set) => ({
  todos: [],
  addTodo: (text) =>
    set((state) => ({
      todos: [
        ...state.todos,
        { id: crypto.randomUUID(), text, completed: false },
      ],
    })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
  clearCompleted: () =>
    set((state) => ({
      todos: state.todos.filter((todo) => !todo.completed),
    })),
}));

function TodoWidget() {
  const todos = useTodoStore((state) => state.todos);
  const addTodo = useTodoStore((state) => state.addTodo);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input.trim());
      setInput("");
    }
  };

  return (
    <div className="todo-widget">
      <h3>Todo List</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
              {todo.text}
            </span>
            <button onClick={() => removeTodo(todo.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={clearCompleted}>Clear Completed</button>
    </div>
  );
}
```

**Comparison: createStore vs useWidgetState**

| Feature | createStore | useWidgetState |
|---------|-------------|----------------|
| Type | Zustand store | React hook |
| Use Case | Complex state with actions | Simple state updates |
| Actions | Supported | Not supported |
| Middleware | Can be composed | Not supported |
| Selectors | Full Zustand selectors | Returns full state |
| Performance | Fine-grained subscriptions | Re-renders on any change |
| API | Zustand API | React useState-like API |

**Use createStore when:**
- Actions and methods on your state
- Complex state logic
- Fine-grained subscriptions
- Zustand middleware support

**Use useWidgetState when:**
- Simple state management
- React useState-like API
- Quick setup without Zustand knowledge

---

### Context Sync

#### data-llm Attribute

The `data-llm` attribute syncs widget UI state with the ChatGPT model, enabling contextual responses.

**Purpose:** Tell ChatGPT what the user is currently viewing/doing in your widget.

**How it Works:**
1. Attribute is syntactic sugar transformed by Skybridge's Babel plugin
2. Each `data-llm` creates a `DataLLM` component
3. Component registers content in global state tree
4. Content synced to `window.openai.widgetState.__widget_context`
5. ChatGPT reads this value for model context

**Basic Usage - Static:**

```typescript
export function StatusWidget() {
  return (
    <div data-llm="User is on the home page">
      <h1>Welcome Home</h1>
    </div>
  );
}
```

**Basic Usage - Dynamic:**

```typescript
export function FlightWidget() {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  return (
    <div data-llm={
      selectedFlight
        ? `User is viewing ${selectedFlight.name} (${selectedFlight.id})`
        : "User is browsing the flight list"
    }>
      {selectedFlight ? (
        <FlightDetails flight={selectedFlight} />
      ) : (
        <FlightList onSelect={setSelectedFlight} />
      )}
    </div>
  );
}
```

**Why It Exists:**

Without `data-llm`, the model only knows about the initial tool call. As users interact with your UI, the model remains unaware unless you sync state.

Example scenario:
1. User asks "Show me flights to Paris"
2. Widget displays 10 flights
3. User clicks "Flight AF123" to view details
4. User asks "What's the baggage policy?"
5. **Without data-llm:** Model doesn't know which flight was selected
6. **With data-llm:** Model can answer accurately about AF123

**Babel Transform:**

What you write:
```tsx
<div data-llm="User is viewing Flight AF123">
  {/* Your UI */}
</div>
```

What gets compiled:
```tsx
import { DataLLM } from "skybridge/web";

<DataLLM content="User is viewing Flight AF123">
  <div>
    {/* Your UI */}
  </div>
</DataLLM>
```

**Example: E-commerce Product Browsing**

```typescript
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export function ProductCatalogWidget() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);

  return (
    <div data-llm={
      selectedProduct
        ? `User is viewing ${selectedProduct.name} ($${selectedProduct.price}).
           Cart has ${cart.length} items.`
        : `User is browsing products. Cart has ${cart.length} items.`
    }>
      {selectedProduct ? (
        <ProductDetails
          product={selectedProduct}
          onAddToCart={() => setCart([...cart, selectedProduct])}
          onBack={() => setSelectedProduct(null)}
        />
      ) : (
        <ProductGrid onSelect={setSelectedProduct} />
      )}
    </div>
  );
}
```

**Example: Multi-step Wizard**

```typescript
export function BookingWizard() {
  const [step, setStep] = useState<"dates" | "rooms" | "payment">("dates");
  const [bookingData, setBookingData] = useState({
    checkIn: null,
    checkOut: null,
    roomType: null,
  });

  const stepDescriptions = {
    dates: "User is selecting check-in and check-out dates",
    rooms: `User is selecting a room type. Dates: ${bookingData.checkIn} to ${bookingData.checkOut}`,
    payment: `User is on the payment page. Room: ${bookingData.roomType}, Dates: ${bookingData.checkIn} to ${bookingData.checkOut}`,
  };

  return (
    <div data-llm={stepDescriptions[step]}>
      {step === "dates" && <DateSelector onNext={(dates) => {
        setBookingData({ ...bookingData, ...dates });
        setStep("rooms");
      }} />}
      {step === "rooms" && <RoomSelector onNext={(room) => {
        setBookingData({ ...bookingData, roomType: room });
        setStep("payment");
      }} />}
      {step === "payment" && <PaymentForm bookingData={bookingData} />}
    </div>
  );
}
```

**Example: Interactive Data Visualization**

```typescript
export function AnalyticsWidget() {
  const [selectedMetric, setSelectedMetric] = useState<string>("revenue");
  const [dateRange, setDateRange] = useState<string>("last-7-days");
  const [hoveredDataPoint, setHoveredDataPoint] = useState<string | null>(null);

  return (
    <div data-llm={
      hoveredDataPoint
        ? `User is hovering over ${hoveredDataPoint} in the ${selectedMetric} chart (${dateRange})`
        : `User is viewing ${selectedMetric} chart for ${dateRange}`
    }>
      <MetricSelector value={selectedMetric} onChange={setSelectedMetric} />
      <DateRangeSelector value={dateRange} onChange={setDateRange} />
      <Chart
        metric={selectedMetric}
        dateRange={dateRange}
        onHover={setHoveredDataPoint}
      />
    </div>
  );
}
```

**Example: Search and Filter**

```typescript
export function SearchWidget() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ category: "all", priceRange: "any" });
  const [results, setResults] = useState<SearchResult[]>([]);

  return (
    <div data-llm={
      query
        ? `User searched for "${query}" with filters: ${JSON.stringify(filters)}.
           Found ${results.length} results.`
        : "User hasn't searched yet"
    }>
      <SearchInput value={query} onChange={setQuery} />
      <Filters values={filters} onChange={setFilters} />
      <ResultsList results={results} />
    </div>
  );
}
```

**Advanced Pattern: Nested data-llm**

```typescript
export function DashboardWidget() {
  const [activeSection, setActiveSection] = useState<"overview" | "details">("overview");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div data-llm={`User is on the ${activeSection} section`}>
      {activeSection === "overview" && (
        <div data-llm="Viewing 10 summary cards">
          <SummaryCards onSelectItem={setSelectedItem} />
        </div>
      )}

      {activeSection === "details" && selectedItem && (
        <div data-llm={`Viewing detailed information for ${selectedItem}`}>
          <DetailView item={selectedItem} />
        </div>
      )}
    </div>
  );
}
```

Produces hierarchical context:
```
- User is on the details section
  - Viewing detailed information for Item-123
```

**Advanced Pattern: Conditional Context**

```typescript
export function NotificationWidget() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  return (
    <div data-llm={
      notifications.length === 0
        ? "User has no notifications"
        : selectedNotification
        ? `User is reading notification: ${selectedNotification.title}`
        : `User has ${notifications.length} unread notifications`
    }>
      {/* Your UI */}
    </div>
  );
}
```

**Advanced Pattern: Rich Context Descriptions**

```typescript
export function FormWidget() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    preferences: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <div data-llm={
      `User is filling out a registration form.
       Completed fields: ${Object.keys(formData).filter(k => formData[k]).join(", ")}.
       ${Object.keys(errors).length > 0
         ? `Has validation errors in: ${Object.keys(errors).join(", ")}`
         : "No validation errors"
       }`
    }>
      <Form data={formData} errors={errors} onChange={setFormData} />
    </div>
  );
}
```

**Best Practices**

| Do | Don't |
|----|-------|
| Describe what user sees | Describe internal state |
| Update on meaningful state changes | Update on every mouse move |
| Be concise but descriptive | Be overly verbose |
| Use user-focused descriptions | Include implementation details |
| One meaningful context per view | Use data-llm for every element |

**Good Examples:**

```tsx
// Describes current UI state
<div data-llm="User is viewing 3 available time slots for Dr. Smith">

// Updates when selection changes
<div data-llm={selectedItem ? `Selected: ${selectedItem.name}` : "No selection"}>

// Clear and concise
<div data-llm="User viewing Flight AF123 details. Price: $450. Departure: 10:30 AM">

// User-focused description
<div data-llm="User has filtered products by price: $50-$100">

// One meaningful context per view
<div data-llm="User is reviewing their order before checkout">
  <button>Submit</button>
  <button>Cancel</button>
</div>
```

**Bad Examples:**

```tsx
// Describes internal state (BAD)
<div data-llm="timeSlots.length === 3">

// Updates on every mouse move (BAD)
<div data-llm={`Mouse at ${mouseX}, ${mouseY}`}>

// Too verbose (BAD)
<div data-llm="The user is currently in the process of viewing the detailed information panel for the flight with the identifier AF123...">

// Exposes technical details (BAD)
<div data-llm={`State: ${JSON.stringify(internalState)}`}>

// Too granular (BAD)
<div data-llm="Main container">
  <button data-llm="Submit button">Submit</button>
  <button data-llm="Cancel button">Cancel</button>
</div>
```

**When to Use data-llm:**
- User interactions change what's displayed (navigation, selections, filters)
- Widget shows different views or states (wizard steps, tabs, modals)
- Context about current view helps answer user questions
- Model needs to understand progressive actions (multi-step flows)

**When NOT to Use data-llm:**
- Widget is purely static and never changes
- State changes are too frequent (animations, hover effects)
- Information is already in conversation history
- State is purely cosmetic (theme, collapsed panels)

**Technical Details:**

Component Lifecycle:
```typescript
// On mount or content change
setNode({ id, parentId, content });
window.openai.setWidgetState({
  ...window.openai.widgetState,
  __widget_context: formatTree()
});

// On unmount
removeNode(id);
window.openai.setWidgetState({
  ...window.openai.widgetState,
  __widget_context: formatTree()
});
```

---

### Actions

#### useCallTool

Call additional MCP tools from your widget with React Query-like state management.

**Signature:**

```typescript
const {
  data,
  error,
  isError,
  isIdle,
  isPending,
  isSuccess,
  status,
  callTool,
  callToolAsync,
} = useCallTool<ToolArgs, ToolResponse>(name);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | The name of the tool to call (must match server registration) |

**Type Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `ToolArgs` | `Record<string, unknown> \| null` | Shape of tool arguments. Use `null` for no-arg tools |
| `ToolResponse` | `{ structuredContent?, meta? }` | Shape of tool response |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `callTool` | `(args?, callbacks?) => void` | Trigger the tool call |
| `callToolAsync` | `(args?) => Promise<Response>` | Async version for await |
| `status` | `"idle" \| "pending" \| "success" \| "error"` | Current state |
| `isPending` | `boolean` | Tool call in progress |
| `isSuccess` | `boolean` | Tool call succeeded |
| `isError` | `boolean` | Tool call failed |
| `isIdle` | `boolean` | No call made yet |
| `data` | `ToolResponse \| undefined` | Response data when successful |
| `error` | `unknown \| undefined` | Error when failed |

**CallToolResponse Type:**

```typescript
type CallToolResponse = {
  content: { type: "text"; text: string }[];
  isError: boolean;
  result: string;
  structuredContent: Record<string, unknown>;
  meta: Record<string, unknown>;
};
```

**When to Use:**
- User-triggered actions that need server data
- Fetching additional information on demand
- Submitting forms or performing operations

**When NOT to Use:**
- Initial data loading (use `useToolInfo` + `structuredContent`)
- Do NOT wrap in `useEffect` to call on mount

**Basic Example:**

```typescript
import { useCallTool } from "skybridge/web";

function BookTableWidget() {
  const { callTool, isPending, isSuccess, data } = useCallTool<
    { time: string; people: number },
    { structuredContent: { tableNumber: string } }
  >("bookTable");

  return (
    <div>
      <button
        disabled={isPending}
        onClick={() => callTool({ time: "12:00", people: 2 })}
      >
        Book Table
      </button>
      {isSuccess && <p>Table booked: {data.structuredContent.tableNumber}</p>}
    </div>
  );
}
```

**With Callbacks:**

```typescript
const { callTool, isPending } = useCallTool<{ email: string }>("subscribe");

const handleSubmit = (email: string) => {
  callTool(
    { email },
    {
      onSuccess: (data) => {
        console.log("Subscribed successfully!", data);
      },
      onError: (error) => {
        console.error("Subscription failed:", error);
      },
      onSettled: (data, error) => {
        console.log("Request completed", { data, error });
      },
    }
  );
};
```

**Async/Await Pattern:**

```typescript
const { callToolAsync, isPending, isError, error } = useCallTool<
  { id: string },
  { structuredContent: { name: string; price: number } }
>("getProduct");

const handleClick = async () => {
  try {
    const response = await callToolAsync({ id: "123" });
    console.log("Product:", response.structuredContent.name);
  } catch (err) {
    console.error("Failed to fetch product:", err);
  }
};
```

**Tools Without Arguments:**

```typescript
const { callTool, isPending } = useCallTool("refresh");

<button
  disabled={isPending}
  onClick={() =>
    callTool({
      onSuccess: () => console.log("Refreshed"),
    })
  }
>
  {isPending ? "Refreshing..." : "Refresh"}
</button>
```

**Typed Response Example:**

```typescript
type WeatherArgs = {
  city: string;
  units?: "metric" | "imperial";
};

type WeatherResponse = {
  structuredContent: {
    temperature: number;
    conditions: string;
    humidity: number;
  };
};

function WeatherWidget() {
  const { callTool, data, isPending, isSuccess } = useCallTool<
    WeatherArgs,
    WeatherResponse
  >("getWeather");

  return (
    <div>
      <button
        disabled={isPending}
        onClick={() => callTool({ city: "Paris", units: "metric" })}
      >
        Get Weather
      </button>

      {isSuccess && (
        <div>
          <p>Temperature: {data.structuredContent.temperature}°C</p>
          <p>Conditions: {data.structuredContent.conditions}</p>
          <p>Humidity: {data.structuredContent.humidity}%</p>
        </div>
      )}
    </div>
  );
}
```

> **Note:** Ensure your tool has `_meta["openai/widgetAccessible"]` set to `true` to make it callable from widgets.

---

#### useSendFollowUpMessage

Programmatically trigger follow-up messages in the ChatGPT conversation.

**Signature:**

```typescript
const sendFollowUpMessage = useSendFollowUpMessage();
sendFollowUpMessage(prompt: string): Promise<void>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `prompt` | `string` | The message to send as a follow-up |

**When to Use:**
- Continuing conversations based on user actions
- Requesting more information from the model
- Creating guided experiences with suggested prompts

**Basic Example:**

```typescript
import { useSendFollowUpMessage } from "skybridge/web";

function FollowUpButton() {
  const sendFollowUpMessage = useSendFollowUpMessage();

  return (
    <button onClick={() => sendFollowUpMessage("Tell me more about this topic")}>
      Learn More
    </button>
  );
}
```

**Quick Actions Example:**

```typescript
function QuickActions() {
  const sendFollowUpMessage = useSendFollowUpMessage();

  const actions = [
    { label: "Explain this", prompt: "Can you explain this in more detail?" },
    { label: "Give examples", prompt: "Can you provide some examples?" },
    { label: "Simplify", prompt: "Can you simplify this explanation?" },
  ];

  return (
    <div className="quick-actions">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => sendFollowUpMessage(action.prompt)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
```

**Search Results with Follow-up:**

```typescript
function SearchResults({ results }: { results: SearchResult[] }) {
  const sendFollowUpMessage = useSendFollowUpMessage();

  const handleLearnMore = (result: SearchResult) => {
    sendFollowUpMessage(`Tell me more about "${result.title}"`);
  };

  return (
    <ul className="search-results">
      {results.map((result) => (
        <li key={result.id}>
          <h3>{result.title}</h3>
          <p>{result.summary}</p>
          <button onClick={() => handleLearnMore(result)}>
            Learn More
          </button>
        </li>
      ))}
    </ul>
  );
}
```

**Feedback Widget Example:**

```typescript
function FeedbackWidget() {
  const sendFollowUpMessage = useSendFollowUpMessage();
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = async (type: "helpful" | "not-helpful") => {
    setSubmitted(true);
    if (type === "helpful") {
      await sendFollowUpMessage(
        "That was helpful! Can you provide more information on related topics?"
      );
    } else {
      await sendFollowUpMessage(
        "I need a different explanation. Can you try explaining it another way?"
      );
    }
  };

  if (submitted) {
    return <p>Thanks for your feedback!</p>;
  }

  return (
    <div className="feedback">
      <p>Was this helpful?</p>
      <button onClick={() => handleFeedback("helpful")}>👍 Yes</button>
      <button onClick={() => handleFeedback("not-helpful")}>👎 No</button>
    </div>
  );
}
```

**Context-Aware Suggestions:**

```typescript
function ContextSuggestions() {
  const sendFollowUpMessage = useSendFollowUpMessage();
  const { input, isSuccess } = useToolInfo<{
    input: { topic: string; depth: "basic" | "advanced" };
  }>();

  if (!isSuccess) return null;

  const suggestions =
    input.depth === "basic"
      ? [
          `Give me an advanced explanation of ${input.topic}`,
          `What are common misconceptions about ${input.topic}?`,
          `How is ${input.topic} used in practice?`,
        ]
      : [
          `Can you provide research papers about ${input.topic}?`,
          `What are the latest developments in ${input.topic}?`,
          `How does ${input.topic} compare to alternatives?`,
        ];

  return (
    <div className="suggestions">
      <p>Continue exploring:</p>
      {suggestions.map((suggestion, i) => (
        <button key={i} onClick={() => sendFollowUpMessage(suggestion)}>
          {suggestion}
        </button>
      ))}
    </div>
  );
}
```

---

#### useOpenExternal

Open external links properly delegated to the host application.

**Signature:**

```typescript
const openExternal = useOpenExternal();
openExternal(href: string): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `href` | `string` | The URL to open |

**When to Use:**
- Navigating users to external websites
- Opening documentation or reference links
- Social media links, product pages, etc.

**Basic Example:**

```typescript
import { useOpenExternal } from "skybridge/web";

function ExternalLink() {
  const openExternal = useOpenExternal();

  return (
    <button onClick={() => openExternal("https://example.com")}>
      Visit Website
    </button>
  );
}
```

**Link Button Component:**

```typescript
type ExternalLinkButtonProps = {
  href: string;
  children: React.ReactNode;
};

function ExternalLinkButton({ href, children }: ExternalLinkButtonProps) {
  const openExternal = useOpenExternal();

  return (
    <button
      onClick={() => openExternal(href)}
      className="external-link-button"
    >
      {children}
      <span aria-hidden="true"> ↗</span>
    </button>
  );
}
```

**Product Card with External Link:**

```typescript
function ProductCard({ product }: { product: Product }) {
  const openExternal = useOpenExternal();

  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => openExternal(product.url)}>
        Buy Now
      </button>
    </div>
  );
}
```

**Social Links:**

```typescript
const socialLinks = [
  { name: "Twitter", url: "https://twitter.com/example", icon: "🐦" },
  { name: "GitHub", url: "https://github.com/example", icon: "🐙" },
  { name: "LinkedIn", url: "https://linkedin.com/in/example", icon: "💼" },
];

function SocialLinks() {
  const openExternal = useOpenExternal();

  return (
    <div className="social-links">
      {socialLinks.map((link) => (
        <button
          key={link.name}
          onClick={() => openExternal(link.url)}
          aria-label={`Visit ${link.name}`}
        >
          {link.icon}
        </button>
      ))}
    </div>
  );
}
```

**Dynamic URL Opening:**

```typescript
function SearchRedirect() {
  const openExternal = useOpenExternal();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      openExternal(searchUrl);
    }
  };

  return (
    <div className="search-redirect">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button onClick={handleSearch}>
        Search on Google
      </button>
    </div>
  );
}
```

---

#### useFiles

Upload and download files within your widget.

**Signature:**

```typescript
const { upload, download } = useFiles();

upload(file: File): Promise<{ fileId: string }>
download(file: { fileId: string }): Promise<{ downloadUrl: string }>
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `upload` | `(file: File) => Promise<{ fileId }>` | Upload a file, returns file ID |
| `download` | `({ fileId }) => Promise<{ downloadUrl }>` | Get download URL for a file |

> **Note:** Only files uploaded by the same connector instance can be downloaded.

**Basic Example:**

```typescript
import { useFiles } from "skybridge/web";
import { useState } from "react";

function FileUploader() {
  const { upload, download } = useFiles();
  const [fileId, setFileId] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const { fileId } = await upload(file);
      setFileId(fileId);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      {fileId && <p>Uploaded file ID: {fileId}</p>}
    </div>
  );
}
```

**Image Upload and Preview:**

```typescript
function ImageUploader() {
  const { upload, download } = useFiles();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { fileId } = await upload(file);
      const { downloadUrl } = await download({ fileId });
      setPreviewUrl(downloadUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={isUploading}
      />
      {isUploading && <p>Uploading...</p>}
      {previewUrl && <img src={previewUrl} alt="Preview" />}
    </div>
  );
}
```

**Document Manager:**

```typescript
type Document = {
  name: string;
  fileId: string;
};

function DocumentManager() {
  const { upload, download } = useFiles();
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const { fileId } = await upload(file);
    setDocuments((prev) => [...prev, { name: file.name, fileId }]);
  };

  const handleDownload = async (doc: Document) => {
    const { downloadUrl } = await download({ fileId: doc.fileId });
    window.open(downloadUrl, "_blank");
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      <ul>
        {documents.map((doc) => (
          <li key={doc.fileId}>
            {doc.name}
            <button onClick={() => handleDownload(doc)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Multiple File Upload with Progress:**

```typescript
function MultiFileUploader() {
  const { upload } = useFiles();
  const [uploadedIds, setUploadedIds] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const ids: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const { fileId } = await upload(files[i]);
      ids.push(fileId);
      setProgress(((i + 1) / files.length) * 100);
    }
    setUploadedIds(ids);
    setProgress(0);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleUpload} />
      {progress > 0 && <progress value={progress} max={100} />}
      {uploadedIds.length > 0 && (
        <p>Uploaded {uploadedIds.length} files</p>
      )}
    </div>
  );
}
```

---

### UI and Display

#### useTheme

Get the current color theme from the host application.

**Signature:**

```typescript
const theme = useTheme();
// theme: "light" | "dark"
```

**Returns:**

| Value | Description |
|-------|-------------|
| `"light"` | Light theme active |
| `"dark"` | Dark theme active |

**Basic Example:**

```typescript
import { useTheme } from "skybridge/web";

function ThemedWidget() {
  const theme = useTheme();

  return (
    <div className={`widget widget--${theme}`}>
      <p>Current theme: {theme}</p>
    </div>
  );
}
```

**Conditional Styling:**

```typescript
function ThemedCard() {
  const theme = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      style={{
        backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000",
        padding: "16px",
        borderRadius: "8px",
        border: `1px solid ${isDark ? "#333" : "#e0e0e0"}`,
      }}
    >
      <h3>Themed Card</h3>
      <p>This card adapts to the current theme.</p>
    </div>
  );
}
```

**CSS Class-Based Theming:**

```typescript
function Widget() {
  const theme = useTheme();

  return (
    <div className={`widget ${theme === "dark" ? "dark" : "light"}`}>
      <header className="widget-header">
        <h2>My Widget</h2>
      </header>
      <main className="widget-content">
        <p>Content goes here</p>
      </main>
    </div>
  );
}
```

```css
.widget.light {
  background-color: #ffffff;
  color: #1a1a1a;
}

.widget.dark {
  background-color: #1a1a1a;
  color: #f5f5f5;
}
```

**CSS Variables Theme Provider:**

```typescript
const lightTheme = {
  "--bg-primary": "#ffffff",
  "--bg-secondary": "#f5f5f5",
  "--text-primary": "#1a1a1a",
  "--accent-color": "#0066cc",
};

const darkTheme = {
  "--bg-primary": "#1a1a1a",
  "--bg-secondary": "#2d2d2d",
  "--text-primary": "#f5f5f5",
  "--accent-color": "#4da6ff",
};

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const variables = theme === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme, variables]);

  return <>{children}</>;
}
```

**Theme-Sensitive Images:**

```typescript
function Logo() {
  const theme = useTheme();

  return (
    <img
      src={theme === "dark" ? "/logo-light.svg" : "/logo-dark.svg"}
      alt="Logo"
      className="logo"
    />
  );
}
```

---

#### useDisplayMode

Read and control the widget's display mode.

**Signature:**

```typescript
const [displayMode, setDisplayMode] = useDisplayMode();
// displayMode: "inline" | "fullscreen" | "pip"
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `displayMode` | `"inline" \| "fullscreen" \| "pip"` | Current display mode |
| `setDisplayMode` | `(mode) => void` | Request mode change |

**Display Modes:**

| Mode | Description |
|------|-------------|
| `inline` | Widget embedded in chat flow |
| `fullscreen` | Widget takes full screen |
| `pip` | Picture-in-picture (mobile coerced to fullscreen) |

**Basic Example:**

```typescript
import { useDisplayMode } from "skybridge/web";

function ExpandableWidget() {
  const [displayMode, setDisplayMode] = useDisplayMode();

  return (
    <div>
      <p>Current mode: {displayMode}</p>
      <button onClick={() => setDisplayMode("fullscreen")}>
        Go Fullscreen
      </button>
      <button onClick={() => setDisplayMode("inline")}>
        Back to Inline
      </button>
    </div>
  );
}
```

**Fullscreen Media Player:**

```typescript
function MediaPlayer() {
  const [displayMode, setDisplayMode] = useDisplayMode();
  const isFullscreen = displayMode === "fullscreen";

  return (
    <div className={isFullscreen ? "fullscreen-player" : "inline-player"}>
      <video src="/media/video.mp4" controls />
      <button onClick={() => setDisplayMode(isFullscreen ? "inline" : "fullscreen")}>
        {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      </button>
    </div>
  );
}
```

**Adaptive Layout:**

```typescript
function AdaptiveWidget() {
  const [displayMode] = useDisplayMode();

  if (displayMode === "fullscreen") {
    return (
      <div className="detailed-view">
        <h1>Full Details</h1>
        {/* Comprehensive content */}
      </div>
    );
  }

  return (
    <div className="compact-view">
      <h3>Summary</h3>
      {/* Condensed content */}
    </div>
  );
}
```

**Picture-in-Picture Mode:**

```typescript
function FloatingWidget() {
  const [displayMode, setDisplayMode] = useDisplayMode();
  const userAgent = useUserAgent();
  const isMobile = userAgent.device.type === "mobile";

  return (
    <div>
      <p>Mode: {displayMode}</p>
      {!isMobile && (
        <button onClick={() => setDisplayMode("pip")}>
          Float (PiP)
        </button>
      )}
      {isMobile && (
        <p>PiP mode is not available on mobile devices</p>
      )}
    </div>
  );
}
```

---

#### useRequestModal

Open a modal portaled outside the widget iframe.

**Signature:**

```typescript
const requestModal = useRequestModal();
requestModal(options: { title: string }): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `options.title` | `string` | Title for the modal header |

> **Note:** When modal opens, your widget re-renders with `displayMode` set to `"modal"`. Use `useDisplayMode` to detect this and render different content.

**Basic Example:**

```typescript
import { useRequestModal } from "skybridge/web";

function ModalTrigger() {
  const requestModal = useRequestModal();

  return (
    <button onClick={() => requestModal({ title: "Details" })}>
      View Details
    </button>
  );
}
```

**Modal with Different Content:**

```typescript
function ProductWidget() {
  const requestModal = useRequestModal();
  const [displayMode] = useDisplayMode();

  // When in modal mode, show detailed view
  if (displayMode === "modal") {
    return (
      <div className="product-details">
        <h2>Product Details</h2>
        <p>Full product description with all specifications...</p>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
          <li>Feature 3</li>
        </ul>
        <button>Add to Cart</button>
      </div>
    );
  }

  // Inline view shows summary
  return (
    <div className="product-summary">
      <h3>Product Name</h3>
      <p>Brief description...</p>
      <button onClick={() => requestModal({ title: "Product Details" })}>
        View Details
      </button>
    </div>
  );
}
```

**Settings Modal:**

```typescript
function SettingsWidget() {
  const requestModal = useRequestModal();
  const [displayMode] = useDisplayMode();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: "en",
  });

  if (displayMode === "modal") {
    return (
      <form className="settings-form">
        <label>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) =>
              setSettings((s) => ({ ...s, notifications: e.target.checked }))
            }
          />
          Enable Notifications
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(e) =>
              setSettings((s) => ({ ...s, darkMode: e.target.checked }))
            }
          />
          Dark Mode
        </label>
        <label>
          Language:
          <select
            value={settings.language}
            onChange={(e) =>
              setSettings((s) => ({ ...s, language: e.target.value }))
            }
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>
        </label>
      </form>
    );
  }

  return (
    <div className="settings-summary">
      <span>⚙️ Settings</span>
      <button onClick={() => requestModal({ title: "Settings" })}>
        Configure
      </button>
    </div>
  );
}
```

**Image Gallery Modal:**

```typescript
function ImageGallery({ images }: { images: Image[] }) {
  const requestModal = useRequestModal();
  const [displayMode] = useDisplayMode();
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (displayMode === "modal") {
    const current = images[selectedIndex];
    return (
      <div className="gallery-modal">
        <img src={current.full} alt={current.alt} />
        <div className="gallery-nav">
          <button
            onClick={() => setSelectedIndex((i) => Math.max(0, i - 1))}
            disabled={selectedIndex === 0}
          >
            Previous
          </button>
          <span>
            {selectedIndex + 1} / {images.length}
          </span>
          <button
            onClick={() =>
              setSelectedIndex((i) => Math.min(images.length - 1, i + 1))
            }
            disabled={selectedIndex === images.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-thumbnails">
      {images.slice(0, 4).map((image, index) => (
        <button
          key={image.id}
          onClick={() => {
            setSelectedIndex(index);
            requestModal({ title: "Gallery" });
          }}
        >
          <img src={image.thumbnail} alt={image.alt} />
        </button>
      ))}
      {images.length > 4 && <span>+{images.length - 4} more</span>}
    </div>
  );
}
```

---

#### useLocale

Get the user's locale for internationalization.

**Signature:**

```typescript
const locale = useLocale();
// locale: string (e.g., "en-US", "fr-FR", "ja-JP")
```

**Returns:**

BCP 47 locale string (e.g., `"en-US"`, `"fr-FR"`, `"ja-JP"`)

**Basic Example:**

```typescript
import { useLocale } from "skybridge/web";

function LocalizedGreeting() {
  const locale = useLocale();

  const greetings: Record<string, string> = {
    en: "Hello!",
    fr: "Bonjour!",
    es: "¡Hola!",
    de: "Hallo!",
    ja: "こんにちは！",
  };

  const language = locale.split("-")[0];
  const greeting = greetings[language] || greetings.en;

  return <h1>{greeting}</h1>;
}
```

**Date Formatting:**

```typescript
function LocalizedDate({ date }: { date: Date }) {
  const locale = useLocale();

  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);

  return <time dateTime={date.toISOString()}>{formattedDate}</time>;
}
```

**Number/Currency Formatting:**

```typescript
function PriceDisplay({ amount, currency }: { amount: number; currency: string }) {
  const locale = useLocale();

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

  return <span className="price">{formattedPrice}</span>;
}
```

**List Formatting:**

```typescript
function ItemList({ items }: { items: string[] }) {
  const locale = useLocale();

  const formatter = new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  });

  return <p>{formatter.format(items)}</p>;
}

// Usage: <ItemList items={["Apple", "Banana", "Cherry"]} />
// en-US: "Apple, Banana, and Cherry"
// fr-FR: "Apple, Banana et Cherry"
```

**Relative Time:**

```typescript
function RelativeTime({ date }: { date: Date }) {
  const locale = useLocale();

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const diffInSeconds = Math.floor((date.getTime() - Date.now()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  let formatted: string;
  if (Math.abs(diffInDays) >= 1) {
    formatted = rtf.format(diffInDays, "day");
  } else if (Math.abs(diffInHours) >= 1) {
    formatted = rtf.format(diffInHours, "hour");
  } else if (Math.abs(diffInMinutes) >= 1) {
    formatted = rtf.format(diffInMinutes, "minute");
  } else {
    formatted = rtf.format(diffInSeconds, "second");
  }

  return <span>{formatted}</span>;
}
```

**i18n Integration:**

```typescript
function useTranslations() {
  const locale = useLocale();
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadTranslations = async () => {
      const language = locale.split("-")[0];
      const response = await fetch(`/locales/${language}.json`);
      const data = await response.json();
      setTranslations(data);
    };

    loadTranslations();
  }, [locale]);

  const t = (key: string) => translations[key] || key;

  return { t, locale };
}
```

---

#### useUserAgent

Get device type and capabilities information.

**Signature:**

```typescript
const userAgent = useUserAgent();
```

**Returns:**

```typescript
type UserAgent = {
  device: {
    type: "mobile" | "tablet" | "desktop" | "unknown";
  };
  capabilities: {
    hover: boolean;  // Supports hover (typically desktop)
    touch: boolean;  // Supports touch (mobile/tablet)
  };
};
```

**Basic Example:**

```typescript
import { useUserAgent } from "skybridge/web";

function DeviceInfo() {
  const userAgent = useUserAgent();

  return (
    <div>
      <p>Device: {userAgent.device.type}</p>
      <p>Touch: {userAgent.capabilities.touch ? "Yes" : "No"}</p>
      <p>Hover: {userAgent.capabilities.hover ? "Yes" : "No"}</p>
    </div>
  );
}
```

**Responsive Layout:**

```typescript
function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  const { device } = useUserAgent();

  const layoutClass = {
    mobile: "layout-compact",
    tablet: "layout-medium",
    desktop: "layout-full",
    unknown: "layout-full",
  }[device.type];

  return <div className={layoutClass}>{children}</div>;
}
```

**Touch-Friendly Controls:**

```typescript
function Slider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const { capabilities } = useUserAgent();

  // Use larger touch targets on touch devices
  const thumbSize = capabilities.touch ? 44 : 20;

  return (
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        height: thumbSize,
        cursor: capabilities.hover ? "pointer" : "default",
      }}
    />
  );
}
```

**Hover vs Tap Instructions:**

```typescript
function InteractionHint() {
  const { capabilities } = useUserAgent();

  return (
    <p className="hint">
      {capabilities.hover
        ? "Hover over items to see details"
        : "Tap items to see details"}
    </p>
  );
}
```

**Adaptive Navigation:**

```typescript
function Navigation({ items }: { items: { label: string; href: string }[] }) {
  const { device, capabilities } = useUserAgent();
  const [isOpen, setIsOpen] = useState(false);

  // On mobile, show hamburger menu
  if (device.type === "mobile") {
    return (
      <nav className="mobile-nav">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        {isOpen && (
          <ul className="mobile-menu">
            {items.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    );
  }

  // On desktop/tablet, show horizontal nav
  return (
    <nav className="desktop-nav">
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={capabilities.hover ? "hoverable" : ""}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

**Adaptive Grid:**

```typescript
function ProductGrid({ products }: { products: Product[] }) {
  const { device } = useUserAgent();

  const columns = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
    unknown: 2,
  }[device.type];

  return (
    <div
      className="product-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: device.type === "mobile" ? "8px" : "16px",
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Input Method Detection:**

```typescript
function SearchInput() {
  const { capabilities } = useUserAgent();

  return (
    <div className="search-container">
      <input
        type="search"
        placeholder="Search..."
        // On touch devices, use search keyboard
        inputMode={capabilities.touch ? "search" : undefined}
        // Larger font on touch to prevent zoom
        style={{
          fontSize: capabilities.touch ? "16px" : "14px",
        }}
      />
    </div>
  );
}
```

---

### Type Inference

#### generateHelpers

Create fully typed hooks with end-to-end type inference from your MCP server.

**Signature:**

```typescript
const { useCallTool, useToolInfo } = generateHelpers<AppType>();
```

**Type Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `T` | `typeof server` | Your MCP server type (must use method chaining) |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `useCallTool` | Typed hook | `useCallTool` with autocomplete for tool names and typed args/responses |
| `useToolInfo` | Typed hook | `useToolInfo` with autocomplete for widget names and typed input/output |

**Why generateHelpers?**

Instead of manually typing each hook:

```typescript
// ❌ Without generateHelpers - manual type annotations required
const { callTool } = useCallTool<
  { destination: string },
  { structuredContent: { results: string[] } }
>("search-voyage");
```

You get automatic type inference:

```typescript
// ✅ With generateHelpers - fully typed, zero annotations
const { callTool } = useCallTool("search-voyage");
// TypeScript knows: tool name, input shape, output shape
```

**Prerequisites: Method Chaining Required**

For type inference to work, your server **must** use method chaining:

✅ **Works:**

```typescript
const server = new McpServer({ name: "my-app", version: "1.0" }, {})
  .registerWidget("search-voyage", {}, {
    inputSchema: { destination: z.string() },
  }, async ({ destination }) => {
    return {
      content: [{ type: "text", text: `Found trips to ${destination}` }],
    };
  })
  .registerTool("calculate-price", {
    inputSchema: { tripId: z.string() },
  }, async ({ tripId }) => {
    return { content: [{ type: "text", text: `Price for ${tripId}` }] };
  });

export type AppType = typeof server; // ✅ Type inference works
```

❌ **Doesn't work:**

```typescript
const server = new McpServer({ name: "my-app", version: "1.0" }, {});

server.registerWidget("search-voyage", {}, {
  inputSchema: { destination: z.string() },
}, async ({ destination }) => {
  return { content: [{ type: "text", text: `Found trips` }] };
});

export type AppType = typeof server; // ❌ Type inference fails
```

**Quick Start:**

**Step 1: Export server type**

```typescript
// server/src/index.ts
export type AppType = typeof server;
```

**Step 2: Create bridge file**

```typescript
// web/src/skybridge.ts
import type { AppType } from "../server"; // type-only import
import { generateHelpers } from "skybridge/web";

export const { useCallTool, useToolInfo } = generateHelpers<AppType>();
```

**Step 3: Use typed hooks**

```typescript
// web/src/widgets/search.tsx
import { useCallTool, useToolInfo } from "../skybridge";

export function SearchWidget() {
  const { callTool, data, isPending } = useCallTool("search-voyage");
  //                                      ^ autocomplete for tool names

  const toolInfo = useToolInfo<"search-voyage">();
  //                              ^ autocomplete for widget names

  const handleSearch = () => {
    callTool({ destination: "Spain" });
    //         ^ autocomplete for input fields
  };

  return (
    <div>
      <button onClick={handleSearch} disabled={isPending}>
        Search
      </button>
      {toolInfo.isSuccess && (
        <div>Found {toolInfo.output.structuredContent.totalCount} results</div>
        //                      ^ typed output
      )}
    </div>
  );
}
```

**Limitations:**

1. **Chaining Required**: Server must use method chaining for type inference
2. **Runtime Types**: Types are compile-time; runtime validation uses Zod
3. **Callback Return Type**: Output types inferred from callback return, not `outputSchema`

---

### Low-Level Access

#### useOpenAiGlobal

Subscribe to any `window.openai` global state value directly.

**Signature:**

```typescript
const value = useOpenAiGlobal(key);
```

**Parameters:**

| Key | Type | Description |
|-----|------|-------------|
| `theme` | `"light" \| "dark"` | Current color theme |
| `locale` | `string` | User's locale (e.g., "en-US") |
| `displayMode` | `"inline" \| "fullscreen" \| "pip"` | Widget's display mode |
| `userAgent` | `UserAgent` | Device and capability info |
| `maxHeight` | `number` | Maximum height for widget |
| `safeArea` | `SafeArea` | Safe area insets |
| `toolInput` | `object` | Input arguments passed to tool |
| `toolOutput` | `object \| null` | Tool's output |
| `toolResponseMetadata` | `object \| null` | Response metadata |
| `widgetState` | `object \| null` | Persisted widget state |

**Returns:**

The current value of the specified global, or `undefined` if not available.

> **Tip:** Prefer specialized hooks (`useTheme`, `useLocale`, etc.) for most use cases. Use `useOpenAiGlobal` only when you need direct access to specific globals.

**Basic Example:**

```typescript
import { useOpenAiGlobal } from "skybridge/web";

function ThemeDisplay() {
  const theme = useOpenAiGlobal("theme");

  return <p>Current theme: {theme}</p>;
}
```

**Reading Safe Area Insets:**

```typescript
function SafeAreaAwareWidget() {
  const safeArea = useOpenAiGlobal("safeArea");

  if (!safeArea) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: safeArea.insets.top,
        paddingBottom: safeArea.insets.bottom,
        paddingLeft: safeArea.insets.left,
        paddingRight: safeArea.insets.right,
      }}
    >
      <p>Content with safe area padding</p>
    </div>
  );
}
```

**Respecting Max Height:**

```typescript
function ScrollableContent() {
  const maxHeight = useOpenAiGlobal("maxHeight");

  return (
    <div
      style={{
        maxHeight: maxHeight ? `${maxHeight}px` : "auto",
        overflow: "auto",
      }}
    >
      {/* Scrollable content */}
    </div>
  );
}
```

**Accessing Tool Input:**

```typescript
function ToolInputDisplay() {
  const toolInput = useOpenAiGlobal("toolInput");

  return (
    <div>
      <h3>Tool Input:</h3>
      <pre>{JSON.stringify(toolInput, null, 2)}</pre>
    </div>
  );
}
```

**Multiple Globals:**

```typescript
function EnvironmentInfo() {
  const theme = useOpenAiGlobal("theme");
  const locale = useOpenAiGlobal("locale");
  const displayMode = useOpenAiGlobal("displayMode");
  const userAgent = useOpenAiGlobal("userAgent");

  return (
    <div>
      <h3>Environment</h3>
      <ul>
        <li>Theme: {theme}</li>
        <li>Locale: {locale}</li>
        <li>Display Mode: {displayMode}</li>
        <li>Device: {userAgent?.device.type}</li>
        <li>Touch: {userAgent?.capabilities.touch ? "Yes" : "No"}</li>
        <li>Hover: {userAgent?.capabilities.hover ? "Yes" : "No"}</li>
      </ul>
    </div>
  );
}
```

---

## Patterns and Recipes

### E-commerce Product Browsing

```typescript
import { useState } from "react";
import { useToolInfo, useCallTool, useSendFollowUpMessage } from "skybridge/web";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export function ProductCatalogWidget() {
  const { output, isSuccess } = useToolInfo<{
    output: { products: Product[] };
  }>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const { callTool, isPending } = useCallTool("add_to_cart");
  const sendMessage = useSendFollowUpMessage();

  if (!isSuccess) return <p>Loading products...</p>;

  return (
    <div data-llm={
      selectedProduct
        ? `User is viewing ${selectedProduct.name} ($${selectedProduct.price}). Cart has ${cart.length} items.`
        : `User is browsing ${output.products.length} products. Cart has ${cart.length} items.`
    }>
      {selectedProduct ? (
        <div className="product-details">
          <button onClick={() => setSelectedProduct(null)}>← Back</button>
          <h2>{selectedProduct.name}</h2>
          <p>${selectedProduct.price}</p>
          <p>{selectedProduct.description}</p>
          <button 
            onClick={() => {
              setCart([...cart, selectedProduct]);
              callTool({ productId: selectedProduct.id });
            }}
            disabled={isPending}
          >
            Add to Cart
          </button>
          <button onClick={() => sendMessage(`Tell me more about ${selectedProduct.name}`)}>
            Ask about this product
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {output.products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button onClick={() => setSelectedProduct(product)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Multi-Step Wizard Flow

```typescript
import { useState } from "react";
import { useCallTool } from "skybridge/web";

type WizardData = {
  dates?: { checkIn: string; checkOut: string };
  room?: string;
  guests?: number;
};

export function BookingWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<WizardData>({});
  const { callTool, isPending, isSuccess } = useCallTool("complete_booking");

  const stepContext = {
    1: "User is selecting check-in and check-out dates",
    2: `User is selecting a room. Dates: ${data.dates?.checkIn} to ${data.dates?.checkOut}`,
    3: `User is on payment. Room: ${data.room}, Dates: ${data.dates?.checkIn} to ${data.dates?.checkOut}`,
  };

  return (
    <div data-llm={stepContext[step]}>
      {step === 1 && (
        <DateSelector 
          onNext={(dates) => {
            setData({ ...data, dates });
            setStep(2);
          }} 
        />
      )}
      {step === 2 && (
        <RoomSelector 
          onNext={(room) => {
            setData({ ...data, room });
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <PaymentForm 
          data={data}
          onSubmit={() => callTool(data)}
          isPending={isPending}
          onBack={() => setStep(2)}
        />
      )}
      {isSuccess && <p>Booking confirmed!</p>}
    </div>
  );
}
```

### Internationalization (i18n)

```typescript
import { useLocale } from "skybridge/web";
import { useEffect, useState } from "react";

type Translations = Record<string, string>;

const translations: Record<string, Translations> = {
  en: {
    welcome: "Welcome!",
    search: "Search...",
    results: "Found {count} results",
  },
  fr: {
    welcome: "Bienvenue!",
    search: "Rechercher...",
    results: "{count} résultats trouvés",
  },
  es: {
    welcome: "¡Bienvenido!",
    search: "Buscar...",
    results: "Se encontraron {count} resultados",
  },
};

function useI18n() {
  const locale = useLocale();
  const language = locale.split("-")[0];
  const t = translations[language] || translations.en;

  const translate = (key: string, params?: Record<string, string | number>) => {
    let text = t[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  const formatDate = (date: Date) => 
    new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date);

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);

  return { t: translate, formatDate, formatCurrency, locale };
}

export function LocalizedWidget() {
  const { t, formatDate, formatCurrency } = useI18n();

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <input placeholder={t("search")} />
      <p>{t("results", { count: 42 })}</p>
      <p>Today: {formatDate(new Date())}</p>
      <p>Price: {formatCurrency(99.99, "USD")}</p>
    </div>
  );
}
```

### Theming System

```typescript
import { useTheme } from "skybridge/web";
import { createContext, useContext, useMemo } from "react";

const lightColors = {
  bg: "#ffffff",
  bgSecondary: "#f5f5f5",
  text: "#1a1a1a",
  textSecondary: "#666666",
  border: "#e0e0e0",
  accent: "#0066cc",
  accentHover: "#0052a3",
};

const darkColors = {
  bg: "#1a1a1a",
  bgSecondary: "#2d2d2d",
  text: "#f5f5f5",
  textSecondary: "#a0a0a0",
  border: "#404040",
  accent: "#4da6ff",
  accentHover: "#80c1ff",
};

type Colors = typeof lightColors;
const ThemeContext = createContext<Colors>(lightColors);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const colors = useMemo(
    () => (theme === "dark" ? darkColors : lightColors),
    [theme]
  );

  return (
    <ThemeContext.Provider value={colors}>
      <div
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
          minHeight: "100%",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useColors() {
  return useContext(ThemeContext);
}

// Usage
function ThemedButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const colors = useColors();

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: colors.accent,
        color: "#ffffff",
        border: "none",
        padding: "8px 16px",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
```

### Responsive Layouts

```typescript
import { useUserAgent, useDisplayMode } from "skybridge/web";

type Breakpoint = "mobile" | "tablet" | "desktop";

function useResponsive() {
  const { device, capabilities } = useUserAgent();
  const [displayMode] = useDisplayMode();

  const breakpoint: Breakpoint = device.type === "mobile" 
    ? "mobile" 
    : device.type === "tablet" 
    ? "tablet" 
    : "desktop";

  const isTouch = capabilities.touch;
  const isHover = capabilities.hover;
  const isFullscreen = displayMode === "fullscreen";

  return { breakpoint, isTouch, isHover, isFullscreen };
}

export function ResponsiveWidget() {
  const { breakpoint, isTouch, isFullscreen } = useResponsive();

  const gridColumns = {
    mobile: 1,
    tablet: 2,
    desktop: isFullscreen ? 4 : 3,
  }[breakpoint];

  const gap = breakpoint === "mobile" ? "8px" : "16px";
  const padding = breakpoint === "mobile" ? "12px" : "24px";

  return (
    <div
      style={{
        padding,
        display: "grid",
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap,
      }}
    >
      {/* Cards with touch-friendly sizing */}
      <Card touchOptimized={isTouch} />
      <Card touchOptimized={isTouch} />
      <Card touchOptimized={isTouch} />
    </div>
  );
}

function Card({ touchOptimized }: { touchOptimized: boolean }) {
  return (
    <div
      style={{
        padding: touchOptimized ? "16px" : "12px",
        minHeight: touchOptimized ? "60px" : "48px",
      }}
    >
      Card content
    </div>
  );
}
```

---

## Decision Trees

### Which Hook Should I Use?

```
Need to access data from initial tool call?
├─ YES → useToolInfo()
│   └─ Returns: input, output, isPending, isSuccess
│
Need to fetch data based on user action?
├─ YES → useCallTool()
│   └─ Do NOT use in useEffect on mount
│
Need to continue the conversation?
├─ YES → useSendFollowUpMessage()
│   └─ Sends prompt to ChatGPT
│
Need to open external URL?
├─ YES → useOpenExternal()
│
Need to upload/download files?
├─ YES → useFiles()
│
Need to show modal outside iframe?
├─ YES → useRequestModal()
│   └─ Check displayMode === "modal" to render modal content
│
Need to match ChatGPT theme?
├─ YES → useTheme()
│   └─ Returns "light" | "dark"
│
Need responsive layout?
├─ YES → useUserAgent()
│   └─ Returns device.type and capabilities
│
Need internationalization?
├─ YES → useLocale()
│   └─ Returns BCP 47 locale string
│
Need fullscreen/pip control?
├─ YES → useDisplayMode()
│
Need type-safe hooks from server?
├─ YES → generateHelpers()
│   └─ Requires method chaining in server
│
Need direct window.openai access?
├─ YES → useOpenAiGlobal()
│   └─ Low-level, prefer specialized hooks
```

### How to Sync State with Model?

```
Is state purely cosmetic (theme, collapsed panels)?
├─ YES → Don't use data-llm
│
Does user interaction change what's displayed?
├─ YES → Use data-llm
│   └─ Describe what user sees, not internal state
│
Is the widget static and never changes?
├─ YES → Don't use data-llm (or use once for static description)
│
Are state changes very frequent (animations, hover)?
├─ YES → Don't use data-llm for these
│
Does context help answer user questions?
├─ YES → Use data-llm
│   └─ Example: "User is viewing Flight AF123 details. Price: $450"
```

### How to Handle State Management?

```
Need simple state that persists across renders?
├─ YES → useWidgetState()
│   └─ React useState-like API
│
Need complex state with actions?
├─ YES → createStore()
│   └─ Zustand-like API with actions
│
Need fine-grained subscriptions?
├─ YES → createStore()
│   └─ Only re-renders when selected state changes
│
Need middleware (logging, persistence)?
├─ YES → createStore()
│
Just need quick local state?
├─ YES → Regular React useState()
│   └─ Won't persist when widget re-renders from tool call
```

---

## Type Reference

### OpenAiProperties

```typescript
type OpenAiProperties = {
  theme: "light" | "dark";
  userAgent: UserAgent;
  locale: string;
  maxHeight: number;
  displayMode: "inline" | "fullscreen" | "pip";
  safeArea: SafeArea;
  toolInput: Record<string, unknown>;
  toolOutput: Record<string, unknown> | { text: string } | null;
  toolResponseMetadata: Record<string, unknown> | null;
  widgetState: Record<string, unknown> | null;
};
```

### UserAgent

```typescript
type UserAgent = {
  device: {
    type: "mobile" | "tablet" | "desktop" | "unknown";
  };
  capabilities: {
    hover: boolean;
    touch: boolean;
  };
};
```

### SafeArea

```typescript
type SafeArea = {
  insets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
};
```

### CallToolResponse

```typescript
type CallToolResponse = {
  content: { type: "text"; text: string }[];
  isError: boolean;
  result: string;
  structuredContent: Record<string, unknown>;
  meta: Record<string, unknown>;
};
```

### ToolSignature (for useToolInfo)

```typescript
type ToolSignature = {
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  responseMetadata?: Record<string, unknown>;
};
```

### DisplayMode

```typescript
type DisplayMode = "inline" | "fullscreen" | "pip" | "modal";
```

### Theme

```typescript
type Theme = "light" | "dark";
```

---

## Complete Import Reference

```typescript
import {
  // State Management
  useToolInfo,      // Access initial tool data
  useWidgetState,   // Simple persistent state
  createStore,      // Zustand-like store
  
  // Context Sync
  // data-llm        // Attribute (no import needed)
  
  // Actions
  useCallTool,           // Call MCP tools
  useSendFollowUpMessage, // Send chat messages
  useOpenExternal,       // Open external URLs
  useFiles,              // Upload/download files
  
  // UI and Display
  useTheme,         // Get current theme
  useDisplayMode,   // Get/set display mode
  useRequestModal,  // Open modal
  useLocale,        // Get user locale
  useUserAgent,     // Get device info
  
  // Type Inference
  generateHelpers,  // Create typed hooks
  
  // Low-Level
  useOpenAiGlobal,  // Direct window.openai access
} from "skybridge/web";
```

---


