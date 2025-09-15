import React, { useRef } from 'react';
import useCMSStore from '../store/useCMSStore';

const MediaLibrary = () => {
  const { media, addMedia, deleteMedia } = useCMSStore();
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        addMedia(file);
      } else {
        alert(`${file.name} is not an image file`);
      }
    });
  };

  const handleDeleteMedia = (id) => {
    if (confirm('Are you sure you want to delete this image?')) {
      deleteMedia(id);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Media Library</h1>
        <button
          onClick={handleUploadClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload Images
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {media.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🖼️</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No images yet</h3>
          <p className="text-gray-500 mb-6">Upload your first image to get started</p>
          <button
            onClick={handleUploadClick}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Your First Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-800 truncate mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {(item.size / 1024).toFixed(1)} KB
                </p>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(item.url)}
                    className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => handleDeleteMedia(item.id)}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
