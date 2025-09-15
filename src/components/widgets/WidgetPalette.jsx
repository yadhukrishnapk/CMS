import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import useCMSStore from '../../store/useCMSStore';

const WidgetPalette = () => {
  const { addWidget, currentPageId } = useCMSStore();

  const widgetTypes = [
    { type: 'richText', label: 'Rich Text', icon: '📝' },
    { type: 'image', label: 'Image', icon: '🖼️' },
    { type: 'button', label: 'Button', icon: '🔘' },
  ];

  const handleAddWidget = (type) => {
    if (currentPageId) {
      addWidget(type, currentPageId);
    } else {
      alert('Please select a page first');
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Widgets</h3>
      
      <div className="space-y-2">
        {widgetTypes.map((widget) => (
          <button
            key={widget.type}
            onClick={() => handleAddWidget(widget.type)}
            className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <span className="text-xl">{widget.icon}</span>
            <span className="text-gray-700">{widget.label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          Click on a widget to add it to your page, or drag it to reorder.
        </p>
      </div>
    </div>
  );
};

export default WidgetPalette;
