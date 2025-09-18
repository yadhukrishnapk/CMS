import React, { useRef, useEffect } from "react";

export const availableWidgetTypes = [
    { value: "heading", label: "Heading" },
    { value: "richText", label: "Rich Text" },
    { value: "image", label: "Image" },
    { value: "button", label: "Button" },
    { value: "spacer", label: "Spacer" },
    { value: "divider", label: "Divider" },
  ];  

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

export default WidgetTypeSelector;
