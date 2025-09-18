import React from "react";
import useWidgetLogic from "../../hooks/useWidgetsLogic";

const HeadingWidget = ({ widget, isEditable, onContentChange, onSelect, onUpdate, editorRef }) => {
  const { ref, isHeadingEmpty, handleContentChange, handleFocus, handleBlur } = useWidgetLogic({
    widget,
    isEditable,
    onContentChange,
    onSelect,
    editorRef,
  });

  const HeadingTag = `h${widget.props.level}`;
  const headingClasses = `
    ${widget.props.font_size === '3xl' ? 'text-5xl md:text-6xl' : 
      widget.props.font_size === '2xl' ? 'text-4xl md:text-5xl' : 
      widget.props.font_size === 'xl' ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}
    ${widget.props.font_weight === 'bold' ? 'font-bold' : 'font-semibold'}
    ${widget.props.alignment === 'center' ? 'text-center' : 
      widget.props.alignment === 'right' ? 'text-right' : 'text-left'}
    mb-6 leading-tight tracking-tight
    ${isHeadingEmpty ? 'empty-placeholder' : ''}
  `.trim();

  return React.createElement(
    HeadingTag,
    {
      ref,
      className: headingClasses,
      style: { 
        color: widget.props.color,
        ...(isHeadingEmpty && isEditable ? { position: 'relative' } : {})
      },
      contentEditable: isEditable,
      suppressContentEditableWarning: true,
      onInput: isEditable ? (e) => handleContentChange(e, 'html') : undefined,
      onFocus: isEditable ? handleFocus : undefined,
      onBlur: isEditable ? handleBlur : undefined,
      'data-placeholder': 'Enter heading text...',
      dangerouslySetInnerHTML: !isEditable && widget.props.text ? { __html: widget.props.text } : undefined,
    },
    isEditable ? null : undefined
  );
};

export default HeadingWidget;