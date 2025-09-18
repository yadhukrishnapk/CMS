import React from "react";
import useWidgetLogic from "../../hooks/useWidgetsLogic";

const ButtonWidget = ({ widget, isEditable, onContentChange, onSelect, onUpdate, editorRef }) => {
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
      className={`
        ${widget.props.alignment === 'center' ? 'text-center' : 
          widget.props.alignment === 'right' ? 'text-right' : 'text-left'}
        mb-8 cursor-pointer
      `.trim()}
      onClick={() => onSelect?.(widget.id)}
    >
      <div className="relative group">
        <a
          href={widget.props.link || '#'}
          target={widget.props.target}
          onClick={(e) => isEditable && e.preventDefault()}
          onDoubleClick={(e) => {
            if (isEditable && widget.props.link) {
              e.preventDefault();
              window.open(widget.props.link, widget.props.target || '_self');
            }
          }}
          className={`
            inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300
            hover:scale-105 hover:shadow-2xl active:scale-95 transform
            ${widget.props.size === 'sm' ? 'px-6 py-3 text-sm' : 
              widget.props.size === 'lg' ? 'px-10 py-5 text-lg' : 'px-8 py-4 text-base'}
            shadow-lg hover:shadow-xl
            ${(!widget.props.label || widget.props.label.trim() === '') ? 'opacity-75' : ''}
          `.trim()}
          style={{
            backgroundColor: widget.props.background_color,
            color: widget.props.text_color,
            borderRadius: widget.props.border_radius === 'full' ? '9999px' : 
                         widget.props.border_radius === 'lg' ? '1rem' : 
                         widget.props.border_radius === 'sm' ? '0.5rem' : '0.75rem',
          }}
        >
          {widget.props.label || 'Button Text'}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
        {isEditable && (
          <div className="absolute invisible group-hover:visible z-50 bg-gray-800 text-white text-xs rounded-lg py-1 px-2 -top-8 left-1/4 transform -translate-x-1/2 whitespace-nowrap">
            Double click to see button functionality
          </div>
        )}
      </div>
    </div>
  );
};

export default ButtonWidget;