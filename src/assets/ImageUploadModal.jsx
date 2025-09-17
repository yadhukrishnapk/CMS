import React, { useState, useEffect } from 'react';
import useCMSStore from '../store/useCMSStore';

const ImageUploadModal = ({ isOpen, onClose, widgetId, currentProps = {}, onUpdate }) => {
  const [previewSrc, setPreviewSrc] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [altText, setAltText] = useState('');
  const { addMedia } = useCMSStore();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAltText(currentProps.alt || '');
      setPreviewSrc(null);
      setSelectedFile(null);
      setIsSaving(false);
    }
  }, [isOpen, currentProps.alt]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Revoke previous URL to prevent memory leaks
      if (previewSrc) {
        URL.revokeObjectURL(previewSrc);
      }
      
      const url = URL.createObjectURL(file);
      setPreviewSrc(url);
      setSelectedFile(file);
      
      // Set default alt text from filename
      if (!altText) {
        const filename = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        setAltText(filename.replace(/[-_]/g, ' ')); // Replace dashes/underscores with spaces
      }
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    
    setIsSaving(true);
    try {
      // Add media to store (this creates a blob URL)
      const mediaId = addMedia(selectedFile);
      const store = useCMSStore.getState();
      const media = store.media.find((m) => m.id === mediaId);
      
      if (media) {
        // Update widget with new image data
        onUpdate(widgetId, {
          props: {
            ...currentProps,
            src: media.url,
            alt: altText || media.alt_text || 'Uploaded image',
            width: currentProps.width || '100%',
            height: currentProps.height || 'auto',
            object_fit: currentProps.object_fit || 'cover',
            border_radius: currentProps.border_radius || 'none'
          }
        });
        
        // Clean up
        URL.revokeObjectURL(previewSrc);
        onClose();
      }
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (previewSrc) {
      URL.revokeObjectURL(previewSrc);
    }
    setPreviewSrc(null);
    setSelectedFile(null);
    setAltText(currentProps.alt || '');
    onClose();
  };

  const handleRemoveCurrentImage = () => {
    if (currentProps.src) {
      onUpdate(widgetId, {
        props: {
          ...currentProps,
          src: '',
          alt: ''
        }
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Manage Image</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Current Image Display */}
        {currentProps.src && !selectedFile && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
            <div className="relative">
              <img
                src={currentProps.src}
                alt={currentProps.alt || 'Current image'}
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={handleRemoveCurrentImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Remove current image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentProps.src ? 'Replace with new image:' : 'Choose an image:'}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
            disabled={isSaving}
          />
        </div>

        {/* Preview */}
        {previewSrc && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">New Image Preview:</p>
            <img
              src={previewSrc}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}

        {/* Alt Text Input */}
        {(selectedFile || currentProps.src) && (
          <div className="mb-6">
            <label htmlFor="altText" className="block text-sm font-medium text-gray-700 mb-2">
              Alt Text (for accessibility):
            </label>
            <input
              id="altText"
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSaving}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          
          {selectedFile && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isSaving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Image'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;