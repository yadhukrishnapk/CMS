import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useCMSStore from "../store/useCMSStore";
import FormattingPanel from "../assets/FormattingPanel";
import ImageUploadModal from "../assets/ImageUploadModal";

// Available widget types configuration
const availableWidgetTypes = [
  { value: 'heading', label: 'Heading' },
  { value: 'richText', label: 'Rich Text' },
  { value: 'image', label: 'Image' },
  { value: 'button', label: 'Button' },
  { value: 'spacer', label: 'Spacer' },
  { value: 'divider', label: 'Divider' },
];

// === Widget Type Selector ===
const WidgetTypeSelector = ({ onSelect, currentType, onClose }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 z-50 bg-white shadow-xl rounded-lg border border-gray-200 py-1 w-48"
    >
      {availableWidgetTypes.map(({ value, label }) => (
        <button
          key={value}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(value);
          }}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
            value === currentType ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

// === Widget Block ===
const WidgetBlock = ({ widget, index, currentPageId, isEditable, onContentChange, addWidget, deleteWidget, onSelect, editorRef }) => {
  const blockRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { changeWidgetType } = useCMSStore();

  const currentTypeConfig = availableWidgetTypes.find((t) => t.value === widget.type);
  const currentLabel = currentTypeConfig ? currentTypeConfig.label : widget.type;

  const handleTypeChange = (newType) => {
    changeWidgetType(widget.id, newType);
    setIsDropdownOpen(false);
  };

  const handleMouseEnter = () => {
    if (isEditable) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (isEditable && !isDropdownOpen) {
      setIsHovered(false);
    }
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
    setIsHovered(false);
  };

  const handleTypeButtonClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
    setIsHovered(true); // Keep hovered state when dropdown is open
  };

  const handleAddWidget = (position) => {
    const insertIndex = position === 'above' ? index : index + 1;
    addWidget('richText', currentPageId, insertIndex);
  };

  const handleDeleteWidget = (e) => {
    e.stopPropagation();
    deleteWidget(widget.id);
  };

  return (
    <div
      ref={blockRef}
      className={`widget-container relative mb-4 rounded-xl transition-all duration-200 ${
        !isEditable ? '' : 'hover:bg-pink-50/10'
      }`}
      style={{
        marginTop: `${widget.layout.margin.top}px`,
        marginRight: `${widget.layout.margin.right}px`,
        marginBottom: `${widget.layout.margin.bottom}px`,
        marginLeft: `${widget.layout.margin.left}px`,
        paddingTop: `${widget.layout.padding.top}px`,
        paddingRight: `${widget.layout.padding.right}px`,
        paddingBottom: `${widget.layout.padding.bottom}px`,
        paddingLeft: `${widget.layout.padding.left}px`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <WidgetRenderer
        widget={widget}
        isEditable={isEditable}
        onContentChange={onContentChange}
        onSelect={onSelect}
        editorRef={editorRef}
      />

      {/* Edit Mode Controls - Only show when hovered or dropdown is open */}
      {isEditable && (isHovered || isDropdownOpen) && (
        <>
          {/* Widget Type Badge */}
          <button
            onClick={handleTypeButtonClick}
            className="absolute -top-2 left-2 z-20 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs px-2 py-1 rounded shadow-lg hover:shadow-md transition-all duration-200"
            title="Change widget type"
          >
            {currentLabel}
          </button>

          {/* Widget Type Selector */}
          {isDropdownOpen && (
            <WidgetTypeSelector 
              onSelect={handleTypeChange} 
              currentType={widget.type}
              onClose={handleDropdownClose}
            />
          )}

          {/* Top + Button */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddWidget('above');
              }}
              className="bg-white border-2 border-pink-400 text-pink-600 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 font-bold text-sm"
              title="Insert new widget above"
            >
              +
            </button>
          </div>

          {/* Bottom + Button */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddWidget('below');
              }}
              className="bg-white border-2 border-pink-400 text-pink-600 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 font-bold text-sm"
              title="Insert new widget below"
            >
              +
            </button>
          </div>

          {/* Delete Button */}
          <div className="absolute top-2 right-2 z-20">
            <button
              onClick={handleDeleteWidget}
              className="bg-red-500/10 border border-red-300 text-red-600 rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:bg-red-500/20 hover:scale-105 font-bold text-xs"
              title="Delete this widget"
            >
              ×
            </button>
          </div>

          {/* Widget Overlay - only show when hovered */}
          <div className="absolute inset-0 border-2 border-pink-400/50 rounded-xl pointer-events-none transition-all duration-200" />
        </>
      )}
    </div>
  );
};

// === Widget Renderer ===
// Enhanced WidgetRenderer component with better placeholders
const WidgetRenderer = ({ widget, isEditable = false, onContentChange, onSelect , onUpdate, editorRef }) => {
  const ref = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const isEmpty = !widget.props.content || widget.props.content.trim() === '' || widget.props.content === '<p></p>';
      
      // Use useEffect to set innerHTML only when necessary (not on every render)
      useEffect(() => {
        if (ref.current && isEmpty && isEditable) {
          ref.current.innerHTML = '';
        } else if (ref.current && widget.props.content && ref.current.innerHTML !== widget.props.content) {
          // Only update if content actually changed to avoid destroying selections
          const currentContent = ref.current.innerHTML;
          const newContent = widget.props.content || '<p>Start writing...</p>';
          if (currentContent !== newContent) {
            ref.current.innerHTML = newContent;
          }
        }
      }, [widget.props.content, isEmpty, isEditable]);
      
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
                <img
                  src={widget.props.src}
                  alt={widget.props.alt}
                  className="max-w-full h-auto shadow-lg"
                  style={{
                    width: widget.props.width,
                    height: widget.props.height,
                    objectFit: widget.props.object_fit,
                    borderRadius: widget.props.border_radius === 'full' ? '9999px' : 
                                widget.props.border_radius === 'lg' ? '1rem' : 
                                widget.props.border_radius === 'sm' ? '0.5rem' : '0'
                  }}
                />
              ) : isEditable ? (
                <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Click to add an image</p>
                  </div>
                </div>
              ) : null}
              {isEditable && hasImage && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                  <span className="text-white text-sm font-medium bg-gray-800/80 px-3 py-1 rounded">
                    Click to replace image
                  </span>
                </div>
              )}
            </div>
            <ImageUploadModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              widgetId={widget.id}
              onUpdate={onUpdate}
            />
          </>
        );
    default:
      return null;
  }
};

// === Main Preview Component ===
const Preview = () => {
  const { widgets, pages, currentPageId, updateWidget, initializeDemoData, deleteWidget, addWidget, selectWidget } = useCMSStore();
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);
  const [isFormattingPanelVisible, setIsFormattingPanelVisible] = useState(true);
  
  // Get current location to determine if we're in preview mode
  const location = useLocation();
  const isPreviewMode = location.pathname.startsWith('/preview/');

  // Initialize demo data on mount
  useEffect(() => {
    initializeDemoData();
  }, [initializeDemoData]);

  // Get current page and its widgets
  const currentPage = pages.find(page => page.id === currentPageId) || pages[0];
  const pageWidgets = currentPage ? currentPage.widgets.map(widgetId => widgets[widgetId]).filter(Boolean) : [];

  const handleWidgetContentChange = (widgetId, newContent) => {
    // Don't allow content changes in preview mode
    if (isPreviewMode) return;
    
    const widget = widgets[widgetId];
    if (widget) {
      if (widget.type === 'richText') {
        updateWidget(widgetId, {
          props: { ...widget.props, content: newContent }
        });
      } else if (widget.type === 'heading') {
        updateWidget(widgetId, {
          props: { ...widget.props, text: newContent }
        });
      }
    }
  };

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl border border-white/20">
        <div className="px-6 py-4 flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Contento</h1>
              <p className="text-xs text-gray-500">
                {isPreviewMode ? 'Preview Mode' : 'Live Preview'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Only show formatting panel toggle in editor mode */}
            {!isPreviewMode && (
              <button
                onClick={() => setIsFormattingPanelVisible(!isFormattingPanelVisible)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors duration-200"
              >
                {isFormattingPanelVisible ? 'Hide' : 'Show'} Tools
              </button>
            )}
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
                isPreviewMode 
                  ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200'
                  : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200'
              }`}>
                {isPreviewMode ? 'Preview' : currentPage.status}
              </span>
              {!isPreviewMode && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Auto-save active"></div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-12 bg-red-100">
        <div className="max-w-6xl mx-auto flex gap-8 px-4 ">
          {/* Main Content Area */}
          <main className={`${(!isPreviewMode && isFormattingPanelVisible) ? 'flex-1' : 'w-full max-w-4xl mx-auto'} transition-all duration-300`}>
            <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden -ml-48">
              {/* Page Header */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentPage.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>By {currentPage.author.name}</span>
                  <span>•</span>
                  <span>Updated {new Date(currentPage.updated_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs">/{currentPage.slug}</span>
                  {isPreviewMode && (
                    <>
                      <span>•</span>
                      <span className="text-blue-600 font-medium">Read-only Preview</span>
                    </>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div 
                ref={editorRef}
                className={`px-8 py-12 lg:px-16 lg:py-16 min-h-[800px] transition-all duration-300 ${
                  !isPreviewMode ? 'focus-within:bg-blue-50/20' : ''
                }`}
              >
                {pageWidgets.length > 0 ? (
                  <div className="max-w-4xl mx-auto">
                    {pageWidgets.map((widget, index) => (
                      <WidgetBlock
                        key={widget.id}
                        widget={widget}
                        index={index}
                        currentPageId={currentPageId}
                        isEditable={!isPreviewMode}
                        onContentChange={handleWidgetContentChange}
                        addWidget={addWidget}
                        deleteWidget={deleteWidget}
                        onSelect={selectWidget}
                        onUpdate={updateWidget}
                        editorRef={editorRef}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 max-w-2xl mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {isPreviewMode ? 'No Content Available' : 'Ready to Create'}
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                      {isPreviewMode 
                        ? 'This page doesn\'t have any content yet.' 
                        : 'Start building your page by adding content widgets.'
                      }
                    </p>
                    {!isPreviewMode && (
                      <button 
                        onClick={() => addWidget('richText', currentPageId)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        Add Your First Widget
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Floating Formatting Panel - only show in editor mode */}
          {!isPreviewMode && isFormattingPanelVisible && (
            <aside className="w-80 sticky top-28 h-fit -mr-48">
              <FormattingPanel savedRangeRef={savedRangeRef} editorRef={editorRef} />
              
              {/* Enhanced Page Stats */}
              <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-xl">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  Page Insights
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Content Blocks</span>
                    <span className="text-blue-600 font-bold text-lg">{pageWidgets.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Status</span>
                    <span className="text-green-600 font-bold capitalize">{currentPage.status}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Author</span>
                    <span className="text-purple-600 font-bold">{currentPage.author.name}</span>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Floating Save Indicator - only show in editor mode */}
      {!isPreviewMode && (
        <div className="fixed bottom-6 right-6 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl px-6 py-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
            <span className="text-sm font-medium text-gray-700">Auto-saved</span>
            <span className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;