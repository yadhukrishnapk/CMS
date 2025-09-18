import React from "react";
import useWidgetLogic from "../../hooks/useWidgetsLogic";

const SpacerWidget = ({ widget, isEditable, onContentChange, onSelect, onUpdate, editorRef }) => {
  const { ref } = useWidgetLogic({
    widget,
    isEditable,
    onContentChange,
    onSelect,
    editorRef,
  });

  return (
    <div
      ref={ref}
      style={{
        height: `${widget.props.height}px`,
        backgroundColor: widget.props.background_color,
      }}
      className={`w-full ${isEditable ? 'relative cursor-pointer' : ''}`}
      onClick={() => isEditable && onSelect?.(widget.id)}
    >
      {isEditable && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs text-gray-400 bg-white/90 px-2 py-1 rounded">
            Spacer ({widget.props.height}px)
          </span>
        </div>
      )}
    </div>
  );
};

export default SpacerWidget;