import React, { useState, useRef, useEffect } from "react";

const RichTextWidget = ({
  widget,
  isEditing,
  isInlineEditing,
  onUpdate,
  onStartInlineEdit,
  onFinishInlineEdit,
}) => {
  const [content, setContent] = useState(widget.props.content || "");
  const [isEditingText, setIsEditingText] = useState(false);
  const editorRef = useRef(null);
  const inlineEditorRef = useRef(null);

  useEffect(() => {
    setContent(widget.props.content || "");
  }, [widget.props.content]);

  useEffect(() => {
    if (isInlineEditing && inlineEditorRef.current) {
      inlineEditorRef.current.focus();
    }
  }, [isInlineEditing]);

  const handleChange = (e) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
    if (onUpdate) {
      onUpdate({ content: newContent });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.execCommand("insertHTML", false, "<br><br>");
    }
  };

  const handleBlur = () => {
    setIsEditingText(false);
    if (onUpdate) {
      onUpdate({ content: editorRef.current?.innerHTML || "" });
    }
  };

  const handleInlineSave = () => {
    onUpdate({ content: inlineEditorRef.current?.innerHTML || content });
    onFinishInlineEdit && onFinishInlineEdit();
  };

  const handleInlineKeyDown = (e) => {
    if (e.key === "Escape") {
      inlineEditorRef.current.innerHTML = content;
      onFinishInlineEdit && onFinishInlineEdit();
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Full editing mode (used in page editor)
  if (isEditing) {
    return (
      <div className="w-full">
        {isEditingText ? (
          <div className="border border-gray-300 rounded-lg">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-300">
              <button
                type="button"
                onClick={() => execCommand("bold")}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                onClick={() => execCommand("italic")}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Italic"
              >
                <em>I</em>
              </button>
              <button
                type="button"
                onClick={() => execCommand("underline")}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Underline"
              >
                <u>U</u>
              </button>
              <div className="w-px bg-gray-300 mx-1"></div>
              <button
                type="button"
                onClick={() => execCommand("insertUnorderedList")}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Bullet List"
              >
                • List
              </button>
              <button
                type="button"
                onClick={() => execCommand("insertOrderedList")}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Numbered List"
              >
                1. List
              </button>
              <div className="w-px bg-gray-300 mx-1"></div>
              <button
                type="button"
                onClick={() => execCommand("justifyLeft")}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Align Left"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => execCommand("justifyCenter")}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Align Center"
              >
                ↔
              </button>
              <button
                type="button"
                onClick={() => execCommand("justifyRight")}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Align Right"
              >
                →
              </button>
            </div>

            {/* Editor */}
            <div
              ref={editorRef}
              contentEditable
              className="min-h-32 p-3 focus:outline-none"
              dangerouslySetInnerHTML={{ __html: content }}
              onInput={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              style={{ minHeight: "100px" }}
            />
          </div>
        ) : (
          <div
            className="min-h-32 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-text hover:border-gray-400 transition-colors"
            onClick={() => setIsEditingText(true)}
          >
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p className="text-gray-500 italic">Click to edit text...</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Inline editing mode (used in preview)
  if (isInlineEditing) {
    return (
      <div className="relative">
        <div
          ref={inlineEditorRef}
          contentEditable
          className="prose max-w-none min-h-8 p-2 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          dangerouslySetInnerHTML={{ __html: content }}
          onBlur={handleInlineSave}
          onKeyDown={handleInlineKeyDown}
          suppressContentEditableWarning={true}
        />
        <div className="absolute -top-6 right-0 text-xs text-gray-500">
          Press Esc to cancel, click outside to save
        </div>
      </div>
    );
  }

  // Preview mode
  return (
    <div
      className={`prose max-w-none ${
        onStartInlineEdit
          ? "cursor-pointer hover:bg-gray-100 rounded p-2 transition-colors"
          : ""
      }`}
      dangerouslySetInnerHTML={{ __html: content }}
      onClick={onStartInlineEdit}
      title={onStartInlineEdit ? "Click to edit" : undefined}
    />
  );
};

export default RichTextWidget;
