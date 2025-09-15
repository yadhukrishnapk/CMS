import React, { useState, useRef, useEffect } from "react";

const ImageWidget = ({
  widget,
  isEditing,
  isInlineEditing,
  onUpdate,
  onStartInlineEdit,
  onFinishInlineEdit,
}) => {
  const { src, alt, width, height } = widget.props;
  const [editingSrc, setEditingSrc] = useState(src);
  const [editingAlt, setEditingAlt] = useState(alt);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditingSrc(src);
    setEditingAlt(alt);
  }, [src, alt]);

  useEffect(() => {
    if (isInlineEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInlineEditing]);

  const handleInlineSave = () => {
    onUpdate({ src: editingSrc, alt: editingAlt });
    onFinishInlineEdit && onFinishInlineEdit();
  };

  const handleInlineKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInlineSave();
    } else if (e.key === "Escape") {
      setEditingSrc(src);
      setEditingAlt(alt);
      onFinishInlineEdit && onFinishInlineEdit();
    }
  };

  // Full editing mode (used in page editor)
  if (isEditing) {
    return (
      <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg">
        {src ? (
          <div className="space-y-3">
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded"
              style={{ width, height }}
            />
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Image URL"
                value={src}
                onChange={(e) => onUpdate({ src: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Alt text"
                value={alt}
                onChange={(e) => onUpdate({ alt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Width"
                  value={width}
                  onChange={(e) => onUpdate({ width: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Height"
                  value={height}
                  onChange={(e) => onUpdate({ height: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-3">No image selected</p>
            <input
              type="text"
              placeholder="Enter image URL"
              onChange={(e) => onUpdate({ src: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}
      </div>
    );
  }

  // Inline editing mode (used in preview)
  if (isInlineEditing) {
    return (
      <div className="space-y-3 p-4 border-2 border-blue-300 rounded">
        <input
          ref={inputRef}
          type="text"
          value={editingSrc}
          onChange={(e) => setEditingSrc(e.target.value)}
          onKeyDown={handleInlineKeyDown}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Image URL"
        />
        <input
          type="text"
          value={editingAlt}
          onChange={(e) => setEditingAlt(e.target.value)}
          onBlur={handleInlineSave}
          onKeyDown={handleInlineKeyDown}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Alt text"
        />
        {editingSrc && (
          <img
            src={editingSrc}
            alt={editingAlt}
            className="max-w-full h-auto rounded"
            style={{ width, height }}
          />
        )}
      </div>
    );
  }

  // Preview mode
  return (
    <div className="w-full">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`max-w-full h-auto ${
            onStartInlineEdit
              ? "cursor-pointer hover:opacity-80 transition-opacity"
              : ""
          }`}
          style={{ width, height }}
          onClick={onStartInlineEdit}
          title={onStartInlineEdit ? "Click to edit" : undefined}
        />
      ) : (
        <div
          className={`w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center ${
            onStartInlineEdit
              ? "cursor-pointer hover:bg-gray-300 transition-colors"
              : ""
          }`}
          onClick={onStartInlineEdit}
          title={onStartInlineEdit ? "Click to add image" : undefined}
        >
          <span className="text-gray-500">
            {onStartInlineEdit ? "Click to add image" : "No image"}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageWidget;
