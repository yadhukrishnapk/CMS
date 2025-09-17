import React, { useState, useEffect } from "react";
import useCMSStore from "../store/useCMSStore";

// Button Formatting Panel Component
const ButtonFormattingPanel = ({ widgetId }) => {
  const { widgets, updateWidget } = useCMSStore();
  const widget = widgets[widgetId];

  if (!widget || widget.type !== 'button') return null;

  const { props } = widget;

  const handleUpdate = (updates) => {
    updateWidget(widgetId, { props: { ...props, ...updates } });
  };

  return (
    <>
      <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        Button Settings
      </h3>

      {/* Label */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
        <input
          type="text"
          value={props.label || ''}
          onChange={(e) => handleUpdate({ label: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter button text"
        />
      </div>

      {/* Link */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
        <input
          type="url"
          value={props.link || ''}
          onChange={(e) => handleUpdate({ link: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com"
        />
      </div>

      {/* Target */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Open in new tab</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={props.target === '_blank'}
            onChange={(e) => handleUpdate({ target: e.target.checked ? '_blank' : '_self' })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900">New tab</span>
        </label>
      </div>

      {/* Background Color */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
        <input
          type="color"
          value={props.background_color || '#3b82f6'}
          onChange={(e) => handleUpdate({ background_color: e.target.value })}
          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
      </div>

      {/* Text Color */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
        <input
          type="color"
          value={props.text_color || '#ffffff'}
          onChange={(e) => handleUpdate({ text_color: e.target.value })}
          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
      </div>

      {/* Size */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
        <select
          value={props.size || 'md'}
          onChange={(e) => handleUpdate({ size: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </div>

      {/* Border Radius */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
        <select
          value={props.border_radius || 'md'}
          onChange={(e) => handleUpdate({ border_radius: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="none">None</option>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="full">Full (Pill)</option>
        </select>
      </div>
    </>
  );
};

const FormattingPanel = ({ savedRangeRef, editorRef }) => {
  const [selectedText, setSelectedText] = useState("");
  const { widgets, selectedWidgetId } = useCMSStore();
  const selectedWidget = selectedWidgetId ? widgets[selectedWidgetId] : null;
  const isButtonSelected = selectedWidget?.type === 'button';

  // Save current selection
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  // Restore saved selection
  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRangeRef.current);
      editorRef.current?.focus();
    }
  };

  // Apply formatting with improved cursor handling
  const applyFormat = (command, value = null) => {
    if (!savedRangeRef.current) return;
  
    // Restore selection first
    restoreSelection();

    // Ensure we have a valid selection before applying formatting
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
  
    try {
      // Apply formatting
      document.execCommand(command, false, value);
      
      // For HTML content, trigger an input event to update the widget content
      if (editorRef.current) {
        const inputEvent = new Event('input', { bubbles: true });
        editorRef.current.dispatchEvent(inputEvent);
      }
    } catch (error) {
      console.warn('Format command failed:', command, error);
    }
  
    // Save the new selection state
    setTimeout(() => {
      const newSelection = window.getSelection();
      if (newSelection.rangeCount > 0) {
        savedRangeRef.current = newSelection.getRangeAt(0).cloneRange();
      }
    }, 10);
  };

  // Listen to selection change with improved handling
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      // Only process selections within the editor
      if (editorRef.current && selection.anchorNode) {
        const isWithinEditor = editorRef.current.contains(selection.anchorNode);
        
        if (isWithinEditor) {
          setSelectedText(text);
          
          // Save the range if there's a valid selection
          if (selection.rangeCount > 0) {
            savedRangeRef.current = selection.getRangeAt(0).cloneRange();
          }
        } else if (text === "") {
          // Clear selected text if selection is outside editor
          setSelectedText("");
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [editorRef, savedRangeRef]);

  // Colors for text formatting
  const textColors = [
    "#000000", "#374151", "#6B7280", "#DC2626",
    "#059669", "#2563EB", "#7C3AED", "#FFFFFF"
  ];

  // Background colors for highlighting
  const backgroundColors = [
    "#FBBF24", "#10B981", "#3B82F6", "#8B5CF6",
    "#EF4444", "#F97316", "#EC4899", "#FFFFFF", 
  ];

  if (isButtonSelected) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-6 w-80 border border-gray-100 backdrop-blur-sm bg-white/95">
        <ButtonFormattingPanel widgetId={selectedWidgetId} />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-80 border border-gray-100 backdrop-blur-sm bg-white/95">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        Text Formatting
      </h3>

      {selectedText && (
        <div className="mb-4 text-sm text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3">
          <div className="font-medium mb-1">Selected text:</div>
          <div className="text-gray-600 truncate font-mono text-xs bg-white/60 px-2 py-1 rounded">
            {selectedText.slice(0, 30)}{selectedText.length > 30 ? '...' : ''}
          </div>
        </div>
      )}

      {/* Basic Formatting */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-3">Basic Formatting</p>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <button 
            onClick={() => applyFormat("bold")} 
            className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl font-bold transition-all duration-200 hover:shadow-md active:scale-95 border border-gray-200"
            title="Bold (Ctrl/Cmd + B)"
          >
            B
          </button>
          <button 
            onClick={() => applyFormat("italic")} 
            className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl italic transition-all duration-200 hover:shadow-md active:scale-95 border border-gray-200"
            title="Italic (Ctrl/Cmd + I)"
          >
            I
          </button>
          <button 
            onClick={() => applyFormat("underline")} 
            className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl underline transition-all duration-200 hover:shadow-md active:scale-95 border border-gray-200"
            title="Underline (Ctrl/Cmd + U)"
          >
            U
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => applyFormat("strikeThrough")} 
            className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl line-through transition-all duration-200 hover:shadow-md active:scale-95 border border-gray-200"
            title="Strikethrough"
          >
            S
          </button>
          <button 
            onClick={() => applyFormat("subscript")} 
            className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95 border border-gray-200"
            title="Subscript"
          >
            X<sub>2</sub>
          </button>
        </div>
      </div>

      {/* Text Color */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-3">Text Color</p>
        <div className="grid grid-cols-8 gap-2">
          {textColors.map((color) => (
            <button
              key={`text-${color}`}
              onClick={() => applyFormat("foreColor", color)}
              className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
              style={{ background: color }}
              title={`Text color: ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Background Color (Highlight) */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-3">Highlight Color</p>
        <div className="grid grid-cols-8 gap-2">
          {backgroundColors.map((color) => (
            <button
              key={`bg-${color}`}
              onClick={() => applyFormat("backColor", color)}
              className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
              style={{ background: color }}
              title={`Highlight: ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Alignment */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-3">Text Alignment</p>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => applyFormat("justifyLeft")} 
            className="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95 border border-gray-200"
            title="Align Left"
          >
            <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
          <button 
            onClick={() => applyFormat("justifyCenter")} 
            className="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95 border border-gray-200"
            title="Align Center"
          >
            <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8M6 18h12" />
            </svg>
          </button>
          <button 
            onClick={() => applyFormat("justifyRight")} 
            className="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95 border border-gray-200"
            title="Align Right"
          >
            <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M12 12h8M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Lists */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-3">Lists</p>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => applyFormat("insertUnorderedList")} 
            className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95 border border-gray-200 text-sm"
            title="Bullet List"
          >
            • List
          </button>
          <button 
            onClick={() => applyFormat("insertOrderedList")} 
            className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95 border border-gray-200 text-sm"
            title="Numbered List"
          >
            1. List
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={() => applyFormat("removeFormat")}
          className="w-full px-4 py-3 text-red-600 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl hover:from-red-100 hover:to-pink-100 transition-all duration-200 font-medium hover:shadow-md active:scale-95"
        >
          <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear Formatting
        </button>
        
        {selectedText && (
          <button
            onClick={() => {
              if (savedRangeRef.current) {
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(savedRangeRef.current);
                setSelectedText("");
              }
            }}
            className="w-full px-4 py-3 text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 font-medium hover:shadow-md active:scale-95"
          >
            Clear Selection
          </button>
        )}
      </div>
    </div>
  );
};

export default FormattingPanel;