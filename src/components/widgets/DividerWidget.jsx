import React from "react";
import useWidgetLogic from "../../hooks/useWidgetsLogic";

const DividerWidget = ({ widget, isEditable, onContentChange, onSelect, onUpdate, editorRef }) => {
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
      className={`my-8 flex justify-center relative ${isEditable ? 'cursor-pointer' : ''}`}
      onClick={() => isEditable && onSelect?.(widget.id)}
    >
      <hr
        style={{
          borderStyle: widget.props.style,
          borderWidth: `${widget.props.thickness}px 0 0 0`,
          borderColor: widget.props.color,
          width: widget.props.width,
          opacity: widget.props.opacity,
        }}
        className="border-0 max-w-md"
      />
      {isEditable && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <span className="text-xs text-gray-400 bg-white/90 px-2 py-1 rounded">
            Divider
          </span>
        </div>
      )}
    </div>
  );
};

export default DividerWidget;