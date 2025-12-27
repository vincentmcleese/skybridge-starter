import "@/index.css";
import { mountWidget, useDisplayMode, useTheme } from "skybridge/web";
import { useToolInfo } from "../helpers";

/**
 * Hello Widget - A minimal example demonstrating core Skybridge patterns
 * 
 * This widget shows:
 * - useToolInfo: Access data passed from the MCP tool
 * - useDisplayMode: Toggle between inline and PiP (picture-in-picture) modes
 * - useTheme: Respond to ChatGPT's light/dark theme
 */
function Hello() {
  // Get the initial data passed from the server tool
  const toolInfo = useToolInfo<"hello">();
  
  // Control the widget's display mode (inline vs pip)
  const [displayMode, setDisplayMode] = useDisplayMode();
  
  // Get ChatGPT's current theme
  const theme = useTheme();
  const isDark = theme === "dark";

  // Extract the greeting name from tool output
  const name = toolInfo.output?.name || "World";
  const timestamp = toolInfo.output?.timestamp;

  const isPip = displayMode === "pip";

  return (
    <div
      className={`min-h-full p-6 font-sans transition-colors ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-900"
      }`}
    >
      {/* Header with display mode toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1" />
        
        <h1 className={`text-2xl font-bold text-center flex-1 ${
          isDark ? "text-white" : "text-slate-800"
        }`}>
          Hello Widget
        </h1>
        
        <div className="flex-1 flex justify-end">
          {!isPip ? (
            <button
              onClick={() => setDisplayMode("pip")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                isDark
                  ? "text-white bg-indigo-600 hover:bg-indigo-500"
                  : "text-white bg-indigo-500 hover:bg-indigo-400"
              }`}
            >
              📌 Float
            </button>
          ) : (
            <button
              onClick={() => setDisplayMode("inline")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                isDark
                  ? "text-slate-300 bg-slate-700 hover:bg-slate-600"
                  : "text-slate-600 bg-slate-200 hover:bg-slate-300"
              }`}
            >
              Dock
            </button>
          )}
        </div>
      </div>

      {/* Main greeting */}
      <div className={`text-center p-8 rounded-xl ${
        isDark ? "bg-slate-800/50" : "bg-white shadow-lg"
      }`}>
        <p className={`text-4xl mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>
          👋
        </p>
        <h2 className={`text-3xl font-bold mb-2 ${
          isDark ? "text-white" : "text-slate-800"
        }`}>
          Hello, {name}!
        </h2>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Welcome to your Skybridge app
        </p>
        
        {timestamp && (
          <p className={`text-xs mt-4 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            Created at: {new Date(timestamp).toLocaleString()}
          </p>
        )}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className={`p-4 rounded-lg ${
          isDark ? "bg-slate-800/30" : "bg-white/80 shadow"
        }`}>
          <p className={`text-xs uppercase tracking-wider mb-1 ${
            isDark ? "text-slate-500" : "text-slate-400"
          }`}>
            Display Mode
          </p>
          <p className={`font-medium ${isDark ? "text-white" : "text-slate-800"}`}>
            {displayMode}
          </p>
        </div>
        
        <div className={`p-4 rounded-lg ${
          isDark ? "bg-slate-800/30" : "bg-white/80 shadow"
        }`}>
          <p className={`text-xs uppercase tracking-wider mb-1 ${
            isDark ? "text-slate-500" : "text-slate-400"
          }`}>
            Theme
          </p>
          <p className={`font-medium ${isDark ? "text-white" : "text-slate-800"}`}>
            {theme}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hello;

// Mount the widget - this is required for Skybridge to render it
mountWidget(<Hello />);

