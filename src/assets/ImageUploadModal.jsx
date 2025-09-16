import React, { useState } from 'react';
import useCMSStore from '../store/useCMSStore';

const ImageUploadModal = ({ isOpen, onClose, widgetId, onUpdate, currentProps }) => {
  const [previewSrc, setPreviewSrc] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { addMedia } = useCMSStore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewSrc(url);
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    if (selectedFile) {
      setIsSaving(true);
      try {
        const mediaId = addMedia(selectedFile);
        const media = useCMSStore.getState().media.find((m) => m.id === mediaId);
        // Update widget with all existing props plus new image data
        onUpdate(widgetId, {
          props: {
            ...currentProps,
            src: media.url,
            alt: media.alt_text || 'Uploaded image',
            width: currentProps.width || '100%',
            height: currentProps.height || 'auto'
          }
        });
        URL.revokeObjectURL(previewSrc);
        setPreviewSrc(null);
        setSelectedFile(null);
        onClose();
      } catch (error) {
        console.error('Error saving image:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    if (previewSrc) {
      URL.revokeObjectURL(previewSrc);
    }
    setPreviewSrc(null);
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Image</h2>
        
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isSaving}
          />
        </div>

        {previewSrc && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <img
              src={previewSrc}
              alt="Preview"
              className="w-full h-48 object-contain rounded-lg border border-gray-200"
            />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedFile || isSaving}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedFile && !isSaving
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;