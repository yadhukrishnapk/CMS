import React from 'react';

const ButtonWidget = ({ widget, isEditing, onUpdate }) => {
  const { label, link, target } = widget.props;

  if (isEditing) {
    return (
      <div className="w-full p-4 border border-gray-300 rounded-lg space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Button Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter button text"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link URL
          </label>
          <input
            type="text"
            value={link}
            onChange={(e) => onUpdate({ link: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="https://example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target
          </label>
          <select
            value={target}
            onChange={(e) => onUpdate({ target: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="_self">Same window</option>
            <option value="_blank">New window</option>
          </select>
        </div>
        
        <div className="pt-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => window.open(link, target)}
            disabled={!link}
          >
            {label || 'Button'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        onClick={() => link && window.open(link, target)}
      >
        {label || 'Button'}
      </button>
    </div>
  );
};

export default ButtonWidget;
