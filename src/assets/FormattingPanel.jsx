// src/components/FormattingPanel.jsx

import React from "react";

const FormattingPanel = ({ selectedWidget, onFormatText, isVisible }) => {
  const colors = [
    "#000000",
    "#374151",
    "#6B7280",
    "#DC2626",
    "#EA580C",
    "#D97706",
    "#65A30D",
    "#059669",
    "#0891B2",
    "#2563EB",
    "#7C3AED",
    "#C026D3",
    "#BE185D",
  ];

  const backgroundColors = [
    "transparent",
    "#F3F4F6",
    "#FEF3C7",
    "#DBEAFE",
    "#D1FAE5",
    "#FCE7F3",
    "#F3E8FF",
    "#FEE2E2",
  ];

  if (!isVisible || !selectedWidget) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🎨</div>
          <p>Select a text block to see formatting options</p>
        </div>
      </div>
    );
  }

  const isTextWidget = ["heading", "richText"].includes(selectedWidget.type);

  if (!isTextWidget) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">⚙️</div>
          <p>Widget options coming soon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6 formatting-panel">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Text Formatting
        </h3>

        {/* Basic Formatting */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Basic Formatting
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => onFormatText("bold")}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded border font-bold"
                title="Bold"
              >
                B
              </button>
              <button
                onClick={() => onFormatText("italic")}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded border italic"
                title="Italic"
              >
                I
              </button>
              <button
                onClick={() => onFormatText("underline")}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded border underline"
                title="Underline"
              >
                U
              </button>
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Color
            </label>
            <div className="grid grid-cols-7 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => onFormatText("color", color)}
                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="grid grid-cols-4 gap-1">
              {backgroundColors.map((color) => (
                <button
                  key={color}
                  onClick={() => onFormatText("backgroundColor", color)}
                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500"
                  style={{
                    backgroundColor: color === "transparent" ? "#fff" : color,
                    backgroundImage:
                      color === "transparent"
                        ? "linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)"
                        : "none",
                    backgroundSize:
                      color === "transparent" ? "8px 8px" : "auto",
                    backgroundPosition:
                      color === "transparent" ? "0 0, 4px 4px" : "initial",
                  }}
                  title={color === "transparent" ? "No background" : color}
                />
              ))}
            </div>
          </div>

          {/* Additional Actions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actions
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onFormatText("removeFormat")}
                className="w-full px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded border border-red-200"
              >
                Remove Formatting
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-xs text-gray-500">
          Select text in the editor and use these tools to format it.
        </p>
      </div>
    </div>
  );
};

export default FormattingPanel;