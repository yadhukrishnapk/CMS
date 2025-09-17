import React, { useEffect, useRef, useState } from "react";
import ImageUploadModal from "../../../assets/ImageUploadModal";

const WidgetRenderer = ({ widget, isEditable = false, onContentChange, onSelect, onUpdate, editorRef }) => {
    const ref = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isEmpty = widget.type === 'richText' && (!widget.props.content || widget.props.content.trim() === '' || widget.props.content === '<p></p>');
    
    // Handle rich text content updates
    useEffect(() => {
      if (widget.type === 'richText' && ref.current) {
        if (isEmpty && isEditable) {
          ref.current.innerHTML = '';
        } else if (widget.props.content && ref.current.innerHTML !== widget.props.content) {
          // Only update if content actually changed to avoid destroying selections
          const currentContent = ref.current.innerHTML;
          const newContent = widget.props.content || '<p>Start writing...</p>';
          if (currentContent !== newContent) {
            ref.current.innerHTML = newContent;
          }
        }
      }
    }, [widget.type, widget.props.content, isEmpty, isEditable]);
  
    // Set up editor reference for Rich Text widgets
    useEffect(() => {
      if (widget.type === 'richText' && ref.current && editorRef) {
        // If this is a rich text widget, make sure it's included in the editor ref context
        if (!editorRef.current) {
          editorRef.current = ref.current.parentElement;
        }
      }
    }, [widget.type, editorRef]);
  
    // Function to get current cursor position
    const getCursorPosition = (element) => {
      const selection = window.getSelection();
      if (selection.rangeCount === 0) return 0;
      
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      return preCaretRange.toString().length;
    };
  
    // Function to set cursor position
    const setCursorPosition = (element, position) => {
      const range = document.createRange();
      const selection = window.getSelection();
      
      let charCount = 0;
      let nodeStack = [element];
      
      while (nodeStack.length > 0) {
        const node = nodeStack.pop();
        
        if (node.nodeType === Node.TEXT_NODE) {
          const nextCharCount = charCount + node.length;
          if (position >= charCount && position <= nextCharCount) {
            range.setStart(node, position - charCount);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            return;
          }
          charCount = nextCharCount;
        } else {
          for (let i = node.childNodes.length - 1; i >= 0; i--) {
            nodeStack.push(node.childNodes[i]);
          }
        }
      }
    };
  
    const handleContentChange = (e, type) => {
      if (!onContentChange || !isEditable) return;
      
      const element = e.target || e.currentTarget;
      const cursorPosition = getCursorPosition(element);
      
      let newContent;
      if (type === 'text') {
        newContent = element.textContent;
      } else {
        newContent = element.innerHTML;
      }
      
      // Update the content
      onContentChange(widget.id, newContent);
      
      // For Rich Text widgets, we need to be more careful about cursor restoration
      // since we're dealing with HTML content
      if (type === 'html') {
        // Use requestAnimationFrame to ensure DOM updates are complete
        requestAnimationFrame(() => {
          if (element && document.contains(element)) {
            setCursorPosition(element, cursorPosition);
            // Keep focus on the element
            element.focus();
          }
        });
      } else {
        // For text-only widgets (like headings), use setTimeout
        setTimeout(() => {
          if (element && document.contains(element)) {
            setCursorPosition(element, cursorPosition);
          }
        }, 0);
      }
    };
  
    const handleFocus = (e) => {
      // Clear placeholder styling on focus
      const element = e.target;
      if (element.classList.contains('empty-placeholder')) {
        element.classList.remove('empty-placeholder');
        if (element.textContent.trim() === '') {
          element.innerHTML = '';
        }
      }
      // Select the widget
      onSelect?.(widget.id);
    };
  
    const handleBlur = (e) => {
      // Add placeholder styling if empty
      const element = e.target;
      if (element.textContent.trim() === '') {
        element.classList.add('empty-placeholder');
      }
    };
  
    switch (widget.type) {
      case 'heading':
        const HeadingTag = `h${widget.props.level}`;
        const headingClasses = `
          ${widget.props.font_size === '3xl' ? 'text-5xl md:text-6xl' : 
            widget.props.font_size === '2xl' ? 'text-4xl md:text-5xl' : 
            widget.props.font_size === 'xl' ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}
          ${widget.props.font_weight === 'bold' ? 'font-bold' : 'font-semibold'}
          ${widget.props.alignment === 'center' ? 'text-center' : 
            widget.props.alignment === 'right' ? 'text-right' : 'text-left'}
          mb-6 leading-tight tracking-tight
          ${!widget.props.text || widget.props.text.trim() === '' ? 'empty-placeholder' : ''}
        `.trim();
        
        return React.createElement(
          HeadingTag,
          {
            className: headingClasses,
            style: { 
              color: widget.props.color,
              ...((!widget.props.text || widget.props.text.trim() === '') && isEditable ? {
                position: 'relative'
              } : {})
            },
            contentEditable: isEditable,
            suppressContentEditableWarning: true,
            onInput: isEditable ? (e) => handleContentChange(e, 'text') : undefined,
            onFocus: isEditable ? handleFocus : undefined,
            onBlur: isEditable ? handleBlur : undefined,
            'data-placeholder': 'Enter heading text...'
          },
          widget.props.text || (isEditable ? '' : 'Heading')
        );
  
      case 'richText':
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
              minHeight: isEditable ? '3rem' : 'auto'
            }}
          />
        );
  
        case 'button':
          return (
            <div 
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
                                 widget.props.border_radius === 'sm' ? '0.5rem' : '0.75rem'
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
  
      case 'spacer':
        return (
          <div
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
  
      case 'divider':
        return (
          <div className={`my-8 flex justify-center relative ${isEditable ? 'cursor-pointer' : ''}`} onClick={() => isEditable && onSelect?.(widget.id)}>
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
  
        case 'image':
          const hasImage = widget.props.src && widget.props.src.trim() !== '';
          
          return (
            <>
              <div 
                className={`mb-8 relative ${isEditable ? 'cursor-pointer' : ''}`} 
                onClick={(e) => {
                  if (isEditable) {
                    e.preventDefault();
                    setIsModalOpen(true);
                    onSelect?.(widget.id);
                  }
                }}
              >
                {hasImage ? (
                  <div className="relative">
                    <img
                      src={widget.props.src}
                      alt={widget.props.alt || 'Image'}
                      className="max-w-full h-auto shadow-lg"
                      style={{
                        width: widget.props.width || '100%',
                        height: widget.props.height || 'auto',
                        objectFit: widget.props.object_fit || 'cover',
                        borderRadius: widget.props.border_radius === 'full' ? '9999px' : 
                                    widget.props.border_radius === 'lg' ? '1rem' : 
                                    widget.props.border_radius === 'sm' ? '0.5rem' : '0'
                      }}
                    />
                    {isEditable && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                        <span className="text-white text-sm font-medium bg-gray-800/80 px-3 py-1 rounded">
                          Click to replace image
                        </span>
                      </div>
                    )}
                  </div>
                ) : isEditable ? (
                  <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors">
                    <div className="text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Click to add an image</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No image available</span>
                  </div>
                )}
              </div>
              
              {/* Image Upload Modal */}
              <ImageUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                widgetId={widget.id}
                currentProps={widget.props}
                onUpdate={onUpdate}
              />
            </>
          );
      default:
        return null;
    }
  };

  export default WidgetRenderer;