import React, { useState, useEffect, useRef } from "react";

const HeadingWidget = ({
  widget,
  isEditing,
  isInlineEditing,
  onUpdate,
  onStartInlineEdit,
  onFinishInlineEdit,
}) => {
  const { level = 1, text = "Heading", alignment = "left" } = widget.props;
  const [editingText, setEditingText] = useState(text);
  const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}`;
  const inputRef = useRef(null);

  useEffect(() => {
    setEditingText(text);
  }, [text]);

  useEffect(() => {
    if (isInlineEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isInlineEditing]);

  const handleInlineSave = () => {
    onUpdate({ text: editingText });
    onFinishInlineEdit && onFinishInlineEdit();
  };

  const handleInlineKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInlineSave();
    } else if (e.key === "Escape") {
      setEditingText(text);
      onFinishInlineEdit && onFinishInlineEdit();
    }
  };

  // Full editing mode (used in page editor)
  if (isEditing) {
    return (
      <div className="w-full p-4 border border-gray-300 rounded-lg space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heading Text
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter heading text"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level (1-6)
            </label>
            <select
              value={level}
              onChange={(e) => onUpdate({ level: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value={1}>H1 (Largest)</option>
              <option value={2}>H2</option>
              <option value={3}>H3</option>
              <option value={4}>H4</option>
              <option value={5}>H5</option>
              <option value={6}>H6 (Smallest)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alignment
            </label>
            <select
              value={alignment}
              onChange={(e) => onUpdate({ alignment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <HeadingTag
            className={`text-${
              level === 1
                ? "4xl"
                : level === 2
                ? "3xl"
                : level === 3
                ? "2xl"
                : level === 4
                ? "xl"
                : level === 5
                ? "lg"
                : "base"
            } font-bold text-gray-800 text-${alignment}`}
          >
            {text}
          </HeadingTag>
        </div>
      </div>
    );
  }

  // Inline editing mode (used in preview)
  if (isInlineEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editingText}
        onChange={(e) => setEditingText(e.target.value)}
        onBlur={handleInlineSave}
        onKeyDown={handleInlineKeyDown}
        className={`w-full bg-transparent border-none outline-none text-${
          level === 1
            ? "4xl"
            : level === 2
            ? "3xl"
            : level === 3
            ? "2xl"
            : level === 4
            ? "xl"
            : level === 5
            ? "lg"
            : "base"
        } font-bold text-gray-800 text-${alignment} focus:ring-2 focus:ring-blue-300 rounded px-1`}
        style={{ fontSize: "inherit", fontWeight: "inherit" }}
      />
    );
  }

  // Preview mode
  return (
    <div className="w-full">
      <HeadingTag
        className={`text-${
          level === 1
            ? "4xl"
            : level === 2
            ? "3xl"
            : level === 3
            ? "2xl"
            : level === 4
            ? "xl"
            : level === 5
            ? "lg"
            : "base"
        } font-bold text-gray-800 text-${alignment} ${
          onStartInlineEdit
            ? "cursor-pointer hover:bg-gray-100 rounded px-1 transition-colors"
            : ""
        }`}
        onClick={onStartInlineEdit}
        title={onStartInlineEdit ? "Click to edit" : undefined}
      >
        {text}
      </HeadingTag>
    </div>
  );
};

export default HeadingWidget;
