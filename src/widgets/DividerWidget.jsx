import React from 'react';

const DividerWidget = ({ widget, isEditing, onUpdate }) => {
  const { style = 'solid', thickness = 1, color = '#e5e7eb' } = widget.props;

  if (isEditing) {
    return (
      <div className="w-full p-4 border border-gray-300 rounded-lg space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Style
            </label>
            <select
              value={style}
              onChange={(e) => onUpdate({ style: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thickness (px)
            </label>
            <input
              type="number"
              value={thickness}
              onChange={(e) => onUpdate({ thickness: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
              max="10"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="w-12 h-8 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              placeholder="#e5e7eb"
            />
          </div>
        </div>
        
        <div className="pt-2">
          <div 
            className="w-full"
            style={{
              borderTop: `${thickness}px ${style} ${color}`,
              height: `${thickness}px`
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        className="w-full"
        style={{
          borderTop: `${thickness}px ${style} ${color}`,
          height: `${thickness}px`
        }}
      ></div>
    </div>
  );
};

export default DividerWidget;
