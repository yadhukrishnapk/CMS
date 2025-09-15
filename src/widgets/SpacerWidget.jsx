import React from 'react';

const SpacerWidget = ({ widget, isEditing, onUpdate }) => {
  const { height = 40 } = widget.props;

  if (isEditing) {
    return (
      <div className="w-full p-4 border border-gray-300 rounded-lg space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spacer Height (px)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => onUpdate({ height: parseInt(e.target.value) || 40 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            min="10"
            max="200"
          />
        </div>
        
        <div className="pt-2">
          <div 
            className="bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center"
            style={{ height: `${height}px` }}
          >
            <span className="text-gray-500 text-sm">Spacer ({height}px)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: `${height}px` }}></div>
  );
};

export default SpacerWidget;
