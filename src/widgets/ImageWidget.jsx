import React from 'react';

const ImageWidget = ({ widget, isEditing, onUpdate }) => {
  const { src, alt, width, height } = widget.props;

  if (isEditing) {
    return (
      <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg">
        {src ? (
          <div className="space-y-3">
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded"
              style={{ width, height }}
            />
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Image URL"
                value={src}
                onChange={(e) => onUpdate({ src: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Alt text"
                value={alt}
                onChange={(e) => onUpdate({ alt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Width"
                  value={width}
                  onChange={(e) => onUpdate({ width: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Height"
                  value={height}
                  onChange={(e) => onUpdate({ height: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-3">No image selected</p>
            <input
              type="text"
              placeholder="Enter image URL"
              onChange={(e) => onUpdate({ src: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto"
          style={{ width, height }}
        />
      ) : (
        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">No image</span>
        </div>
      )}
    </div>
  );
};

export default ImageWidget;
