import React, { useRef, useState, useEffect } from "react";
import WidgetRenderer from "./WidgetRenderer";
import useCMSStore from "../../../store/useCMSStore";

const availableWidgetTypes = [
    { value: "heading", label: "Heading" },
    { value: "richText", label: "Rich Text" },
    { value: "image", label: "Image" },
    { value: "button", label: "Button" },
    { value: "spacer", label: "Spacer" },
    { value: "divider", label: "Divider" },
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

  export default WidgetBlock;