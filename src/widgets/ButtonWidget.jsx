import React, { useState, useRef, useEffect } from "react";

const ButtonWidget = ({
  widget,
  isEditing,
  isInlineEditing,
  onUpdate,
  onStartInlineEdit,
  onFinishInlineEdit,
}) => {
  const { label, link, target } = widget.props;
  const [editingLabel, setEditingLabel] = useState(label);
  const [editingLink, setEditingLink] = useState(link);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditingLabel(label);
    setEditingLink(link);
  }, [label, link]);

  useEffect(() => {
    if (isInlineEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isInlineEditing]);

  const handleInlineSave = () => {
    onUpdate({ label: editingLabel, link: editingLink });
    onFinishInlineEdit && onFinishInlineEdit();
  };

  const handleInlineKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInlineSave();
    } else if (e.key === "Escape") {
      setEditingLabel(label);
      setEditingLink(link);
      onFinishInlineEdit && onFinishInlineEdit();
    }
  };

  // Full editing mode (used in page editor)
  if (isEditing) {
    return (
      <div className="w-full p-4 border border-gray-300 rounded-lg space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Button Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter button text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link URL
          </label>
          <input
            type="text"
            value={link}
            onChange={(e) => onUpdate({ link: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target
          </label>
          <select
            value={target}
            onChange={(e) => onUpdate({ target: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="_self">Same window</option>
            <option value="_blank">New window</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => window.open(link, target)}
            disabled={!link}
          >
            {label || "Button"}
          </button>
        </div>
      </div>
    );
  }

  // Inline editing mode (used in preview)
  if (isInlineEditing) {
    return (
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="text"
          value={editingLabel}
          onChange={(e) => setEditingLabel(e.target.value)}
          onKeyDown={handleInlineKeyDown}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium"
          placeholder="Button text"
        />
        <input
          type="text"
          value={editingLink}
          onChange={(e) => setEditingLink(e.target.value)}
          onBlur={handleInlineSave}
          onKeyDown={handleInlineKeyDown}
          className="block w-full px-3 py-2 border border-gray-300 rounded text-sm"
          placeholder="Link URL (optional)"
        />
      </div>
    );
  }

  // Preview mode
  return (
    <div className="w-full">
      <button
        className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
          onStartInlineEdit ? "cursor-pointer" : ""
        }`}
        onClick={(e) => {
          e.preventDefault();
          if (link && !onStartInlineEdit) {
            window.open(link, target);
          } else if (onStartInlineEdit) {
            onStartInlineEdit();
          }
        }}
        onDoubleClick={onStartInlineEdit}
        title={onStartInlineEdit ? "Double-click to edit" : undefined}
      >
        {label || "Button"}
      </button>
    </div>
  );
};

export default ButtonWidget;
