import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCMSStore from "../store/useCMSStore";

// Inline-editable widget components
const InlineHeadingWidget = ({
  widget,
  isInlineEditing,
  onUpdate,
  onStartEdit,
  onFinishEdit,
}) => {
  const { level = 1, text = "Heading", alignment = "left" } = widget.props;
  const [editingText, setEditingText] = useState(text);
  const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}`;
  const inputRef = useRef(null);

  useEffect(() => {
    if (isInlineEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isInlineEditing]);

  const handleSave = () => {
    onUpdate({ text: editingText });
    onFinishEdit();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setEditingText(text);
      onFinishEdit();
    }
  };

  if (isInlineEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editingText}
        onChange={(e) => setEditingText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
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

  return (
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
      } font-bold text-gray-800 text-${alignment} cursor-pointer hover:bg-gray-100 rounded px-1 transition-colors`}
      onClick={onStartEdit}
      title="Click to edit"
    >
      {text}
    </HeadingTag>
  );
};

const InlineRichTextWidget = ({
  widget,
  isInlineEditing,
  onUpdate,
  onStartEdit,
  onFinishEdit,
}) => {
  const { content = "<p>Click to edit text...</p>" } = widget.props;
  const [editingContent, setEditingContent] = useState(content);
  const editorRef = useRef(null);

  useEffect(() => {
    if (isInlineEditing && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isInlineEditing]);

  const handleSave = () => {
    onUpdate({ content: editorRef.current?.innerHTML || editingContent });
    onFinishEdit();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      editorRef.current.innerHTML = content;
      onFinishEdit();
    }
  };

  if (isInlineEditing) {
    return (
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          className="prose max-w-none min-h-8 p-2 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          dangerouslySetInnerHTML={{ __html: content }}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning={true}
        />
        <div className="absolute -top-6 right-0 text-xs text-gray-500">
          Press Esc to cancel, click outside to save
        </div>
      </div>
    );
  }

  return (
    <div
      className="prose max-w-none cursor-pointer hover:bg-gray-100 rounded p-2 transition-colors"
      dangerouslySetInnerHTML={{ __html: content }}
      onClick={onStartEdit}
      title="Click to edit"
    />
  );
};

const InlineButtonWidget = ({
  widget,
  isInlineEditing,
  onUpdate,
  onStartEdit,
  onFinishEdit,
}) => {
  const { label = "Button", link = "", target = "_self" } = widget.props;
  const [editingLabel, setEditingLabel] = useState(label);
  const [editingLink, setEditingLink] = useState(link);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isInlineEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isInlineEditing]);

  const handleSave = () => {
    onUpdate({ label: editingLabel, link: editingLink });
    onFinishEdit();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setEditingLabel(label);
      setEditingLink(link);
      onFinishEdit();
    }
  };

  if (isInlineEditing) {
    return (
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="text"
          value={editingLabel}
          onChange={(e) => setEditingLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium"
          placeholder="Button text"
        />
        <input
          type="text"
          value={editingLink}
          onChange={(e) => setEditingLink(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="block w-full px-3 py-2 border border-gray-300 rounded text-sm"
          placeholder="Link URL (optional)"
        />
      </div>
    );
  }

  return (
    <button
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        if (link) {
          window.open(link, target);
        } else {
          onStartEdit();
        }
      }}
      onDoubleClick={onStartEdit}
      title="Double-click to edit"
    >
      {label}
    </button>
  );
};

const InlineImageWidget = ({
  widget,
  isInlineEditing,
  onUpdate,
  onStartEdit,
  onFinishEdit,
}) => {
  const { src = "", alt = "", width = "100%", height = "auto" } = widget.props;
  const [editingSrc, setEditingSrc] = useState(src);
  const [editingAlt, setEditingAlt] = useState(alt);

  const handleSave = () => {
    onUpdate({ src: editingSrc, alt: editingAlt });
    onFinishEdit();
  };

  if (isInlineEditing) {
    return (
      <div className="space-y-3 p-4 border-2 border-blue-300 rounded">
        <input
          type="text"
          value={editingSrc}
          onChange={(e) => setEditingSrc(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Image URL"
          autoFocus
        />
        <input
          type="text"
          value={editingAlt}
          onChange={(e) => setEditingAlt(e.target.value)}
          onBlur={handleSave}
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

  return src ? (
    <img
      src={src}
      alt={alt}
      className="max-w-full h-auto cursor-pointer hover:opacity-80 transition-opacity"
      style={{ width, height }}
      onClick={onStartEdit}
      title="Click to edit"
    />
  ) : (
    <div
      className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
      onClick={onStartEdit}
      title="Click to add image"
    >
      <span className="text-gray-500">Click to add image</span>
    </div>
  );
};

// Inline-editable widget container
const InlineEditableWidget = ({ widget }) => {
  const { updateWidget } = useCMSStore();
  const [editingWidgetId, setEditingWidgetId] = useState(null);

  const isInlineEditing = editingWidgetId === widget.id;

  const handleUpdate = (updates) => {
    updateWidget(widget.id, { props: { ...widget.props, ...updates } });
  };

  const handleStartEdit = () => {
    setEditingWidgetId(widget.id);
  };

  const handleFinishEdit = () => {
    setEditingWidgetId(null);
  };

  const renderWidget = () => {
    const commonProps = {
      widget,
      isInlineEditing,
      onUpdate: handleUpdate,
      onStartEdit: handleStartEdit,
      onFinishEdit: handleFinishEdit,
    };

    switch (widget.type) {
      case "heading":
        return <InlineHeadingWidget {...commonProps} />;
      case "richText":
        return <InlineRichTextWidget {...commonProps} />;
      case "button":
        return <InlineButtonWidget {...commonProps} />;
      case "image":
        return <InlineImageWidget {...commonProps} />;
      case "spacer":
        return (
          <div
            style={{ height: widget.props.height || 40 }}
            className="w-full"
          />
        );
      case "divider":
        return (
          <hr
            className="w-full border-gray-300"
            style={{
              borderWidth: widget.props.thickness || 1,
              borderColor: widget.props.color || "#e5e7eb",
            }}
          />
        );
      default:
        return (
          <div className="p-4 text-gray-500">
            Unknown widget type: {widget.type}
          </div>
        );
    }
  };

  return <div className="w-full">{renderWidget()}</div>;
};

const Preview = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { pages, widgets } = useCMSStore();

  const currentPage = pages.find((page) => page.id === pageId);

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Page not found
          </h2>
          <button
            onClick={() => navigate("/pages")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Pages
          </button>
        </div>
      </div>
    );
  }

  const pageWidgets = currentPage.widgets
    .map((id) => widgets[id])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {currentPage.title}
            </h1>
            <p className="text-sm text-blue-600">
              ✨ Inline Editing Mode - Click any content to edit
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/editor/${pageId}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Advanced Editor
            </button>
            <button
              onClick={() => navigate("/pages")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Pages
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {pageWidgets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                This page is empty
              </h3>
              <p className="text-gray-500">
                Go to the Advanced Editor to add some widgets
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {pageWidgets.map((widget) => (
                <InlineEditableWidget key={widget.id} widget={widget} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
