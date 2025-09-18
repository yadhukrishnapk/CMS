import React from "react";
import useWidgetLogic from "../../hooks/useWidgetsLogic";

const RichTextWidget = ({ widget, isEditable, onContentChange, onSelect, onUpdate, editorRef }) => {
  const { ref, isEmpty, handleContentChange, handleFocus, handleBlur } = useWidgetLogic({
    widget,
    isEditable,
    onContentChange,
    onSelect,
    editorRef,
  });

  return (
    <div
      ref={ref}
      className={`
        prose prose-lg prose-gray max-w-none
        ${widget.props.text_align === 'center' ? 'text-center' : 
          widget.props.text_align === 'right' ? 'text-right' : 'text-left'}
        ${widget.props.font_size === 'lg' ? 'text-lg leading-relaxed' : 
          widget.props.font_size === 'sm' ? 'text-sm leading-relaxed' : 'text-base leading-relaxed'}
        ${widget.props.line_height === 'tight' ? 'leading-tight' : 
          widget.props.line_height === 'loose' ? 'leading-loose' : 'leading-relaxed'}
        mb-8 prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900
        ${isEmpty && isEditable ? 'empty-placeholder' : ''}
      `.trim()}
      contentEditable={isEditable}
      suppressContentEditableWarning={true}
      onInput={isEditable ? (e) => handleContentChange(e, 'html') : undefined}
      onFocus={isEditable ? handleFocus : undefined}
      onBlur={isEditable ? handleBlur : undefined}
      data-placeholder="Start writing your content here..."
      style={{
        minHeight: isEditable ? '3rem' : 'auto',
      }}
    />
  );
};

export default RichTextWidget;