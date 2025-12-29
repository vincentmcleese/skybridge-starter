import "@/index.css";
import { mountWidget, useDisplayMode, useTheme } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { PipIcon, CollapseIcon, SunIcon, MoonIcon } from "../icons";
import { useState } from "react";

/**
 * Hello Widget - Skybridge Starter Template Showcase
 *
 * Demonstrates the starter template features and Skybridge framework benefits.
 * Follows OpenAI design guidelines for colors, spacing, and accessibility.
 */
function Hello() {
  const toolInfo = useToolInfo<"hello">();
  const [displayMode, setDisplayMode] = useDisplayMode();
  const systemTheme = useTheme();
  const isPip = displayMode === "pip";

  // Local theme override for demo purposes
  const [themeOverride, setThemeOverride] = useState<"light" | "dark" | null>(null);
  const theme = themeOverride ?? systemTheme;
  const isDark = theme === "dark";

  const name = toolInfo.output?.name;

  // Skybridge USPs
  const whySkybridge = [
    "End-to-end type safety",
    "React hooks, not raw APIs",
    "Hot reload development",
    "Widget-to-model sync",
  ];

  // Template features
  const whatsIncluded = [
    ["MCP Server", "React Widgets"],
    ["Design System", "Icon Library"],
    ["PiP Support", "Theme Aware"],
  ];

  // Theme-aware colors (using inline styles for proper contrast)
  const colors = {
    bgPrimary: isDark ? "#212121" : "#FFFFFF",
    bgSecondary: isDark ? "#303030" : "#F3F3F3",
    bgTertiary: isDark ? "#414141" : "#E8E8E8",
    textPrimary: isDark ? "#FFFFFF" : "#0D0D0D",
    textSecondary: isDark ? "#CDCDCD" : "#5D5D5D",
    textTertiary: isDark ? "#AFAFAF" : "#8F8F8F",
    iconSecondary: isDark ? "#CDCDCD" : "#5D5D5D",
    accentGreen: isDark ? "#68C977" : "#0B8535",
    accentBlue: "#0285FF",
  };

  const toggleTheme = () => {
    if (themeOverride === null) {
      // First click: switch to opposite of system theme
      setThemeOverride(systemTheme === "dark" ? "light" : "dark");
    } else if (themeOverride !== systemTheme) {
      // Currently overridden to opposite, go back to system
      setThemeOverride(null);
    } else {
      // Currently same as system, switch to opposite
      setThemeOverride(systemTheme === "dark" ? "light" : "dark");
    }
  };

  return (
    <div
      className="min-h-full p-6 flex flex-col transition-colors duration-200"
      style={{ backgroundColor: colors.bgPrimary }}
    >
      {/* Header with controls */}
      <div className="flex justify-between items-center mb-6">
        {/* Theme Toggle - using custom monochromatic icons */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{
            backgroundColor: colors.bgSecondary,
            color: colors.iconSecondary,
          }}
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
          {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>

        {/* PiP Toggle - circular container per design guidelines */}
        <button
          onClick={() => setDisplayMode(isPip ? "inline" : "pip")}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{
            color: colors.iconSecondary,
            backgroundColor: colors.bgSecondary,
          }}
          aria-label={isPip ? "Dock widget" : "Float widget"}
        >
          {isPip ? <CollapseIcon className="w-5 h-5" /> : <PipIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Headline */}
        <div className="text-center mb-6">
          <h1
            className="text-2xl font-semibold mb-1"
            style={{ color: colors.textPrimary }}
          >
            {name ? `Welcome, ${name}!` : "Your ChatGPT App Starter"}
          </h1>
          <p style={{ color: colors.textSecondary }}>
            Powered by Skybridge
          </p>
        </div>

        {/* Feature Cards - using tertiary bg for better text contrast */}
        <div className="space-y-4">
          {/* Why Skybridge Card */}
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: colors.bgSecondary }}
          >
            <h2
              className="text-sm font-medium uppercase tracking-wide mb-3"
              style={{ color: colors.textSecondary }}
            >
              Why Skybridge?
            </h2>
            <ul className="space-y-2">
              {whySkybridge.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: colors.textPrimary }}
                >
                  <span style={{ color: colors.accentGreen }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* What's Included Card */}
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: colors.bgSecondary }}
          >
            <h2
              className="text-sm font-medium uppercase tracking-wide mb-3"
              style={{ color: colors.textSecondary }}
            >
              What's Included
            </h2>
            <div className="space-y-2">
              {whatsIncluded.map((row, i) => (
                <div key={i} className="flex gap-4">
                  {row.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm flex-1"
                      style={{ color: colors.textPrimary }}
                    >
                      <span style={{ color: colors.accentGreen }}>✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Edit{" "}
            <code
              className="px-1.5 py-0.5 rounded text-xs font-mono"
              style={{
                backgroundColor: colors.bgTertiary,
                color: colors.textPrimary,
              }}
            >
              server/src/server.ts
            </code>{" "}
            to get started →
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-6 pt-4 text-center"
        style={{ borderTop: `1px solid ${colors.bgTertiary}` }}
      >
        <p className="text-xs" style={{ color: colors.textTertiary }}>
          ❤️ Created with love by Ghost Team
        </p>
      </div>
    </div>
  );
}

export default Hello;

// Mount the widget - required for Skybridge to render it
mountWidget(<Hello />);
