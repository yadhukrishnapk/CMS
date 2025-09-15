import React from 'react';
import useCMSStore from '../../store/useCMSStore';

const PropertiesPanel = () => {
  const { selectedWidgetId, widgets, updateWidget } = useCMSStore();
  
  const selectedWidget = selectedWidgetId ? widgets[selectedWidgetId] : null;

  if (!selectedWidget) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Properties</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">Select a widget to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleUpdate = (updates) => {
    updateWidget(selectedWidget.id, { props: { ...selectedWidget.props, ...updates } });
  };

  const renderProperties = () => {
    switch (selectedWidget.type) {
      case 'richText':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={selectedWidget.props.content || ''}
                onChange={(e) => handleUpdate({ content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                placeholder="Enter text content..."
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={selectedWidget.props.src || ''}
                onChange={(e) => handleUpdate({ src: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Text
              </label>
              <input
                type="text"
                value={selectedWidget.props.alt || ''}
                onChange={(e) => handleUpdate({ alt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Describe the image"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Width
                </label>
                <input
                  type="text"
                  value={selectedWidget.props.width || ''}
                  onChange={(e) => handleUpdate({ width: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="100%"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <input
                  type="text"
                  value={selectedWidget.props.height || ''}
                  onChange={(e) => handleUpdate({ height: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="auto"
                />
              </div>
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Label
              </label>
              <input
                type="text"
                value={selectedWidget.props.label || ''}
                onChange={(e) => handleUpdate({ label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Click me"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link URL
              </label>
              <input
                type="text"
                value={selectedWidget.props.link || ''}
                onChange={(e) => handleUpdate({ link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target
              </label>
              <select
                value={selectedWidget.props.target || '_self'}
                onChange={(e) => handleUpdate({ target: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="_self">Same window</option>
                <option value="_blank">New window</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4">
            <p className="text-gray-500">No properties available for this widget type</p>
          </div>
        );
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Properties</h3>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Type:</strong> {selectedWidget.type}
        </p>
        <p className="text-sm text-gray-600">
          <strong>ID:</strong> {selectedWidget.id.slice(0, 8)}...
        </p>
      </div>
      
      {renderProperties()}
    </div>
  );
};

export default PropertiesPanel;
