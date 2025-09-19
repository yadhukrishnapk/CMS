import React from "react";
import ImageUploadModal from "../../assets/ImageUploadModal";
import useWidgetLogic from "../../hooks/useWidgetsLogic";

const ImageWidget = ({ widget, isEditable, onContentChange, onSelect, onUpdate, editorRef }) => {
  const { ref, isModalOpen, setIsModalOpen } = useWidgetLogic({
    widget,
    isEditable,
    onContentChange,
    onSelect,
    editorRef,
  });

  const hasImage = widget.props.src && widget.props.src.trim() !== '';

  // Fixed dimensions for the image container
  const FIXED_WIDTH = '100%'; // Full width of the parent container
  const FIXED_HEIGHT = '400px'; // Fixed height for consistency

  return (
    <>
      <div 
        ref={ref}
        className={`mb-8 relative ${isEditable ? 'cursor-pointer' : ''}`} 
        onClick={(e) => {
          if (isEditable) {
            e.preventDefault();
            setIsModalOpen(true);
            onSelect?.(widget.id);
          }
        }}
      >
        {hasImage ? (
          <div className="relative flex items-center justify-center w-full" style={{ height: FIXED_HEIGHT }}>
            <img
              src={widget.props.src}
              alt={widget.props.alt || 'Image'}
              className="shadow-lg"
              style={{
                width: FIXED_WIDTH,
                height: FIXED_HEIGHT,
                objectFit: widget.props.object_fit || 'cover', // Use cover to fill, maintain aspect ratio
                borderRadius: widget.props.border_radius === 'full' ? '9999px' : 
                            widget.props.border_radius === 'lg' ? '1rem' : 
                            widget.props.border_radius === 'sm' ? '0.5rem' : '0',
              }}
            />
            {isEditable && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                <span className="text-white text-sm font-medium bg-gray-800/80 px-3 py-1 rounded">
                  Click to replace image
                </span>
              </div>
            )}
          </div>
        ) : isEditable ? (
          <div 
            className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
            style={{ height: FIXED_HEIGHT }}
          >
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Click to add an image</p>
            </div>
          </div>
        ) : (
          <div 
            className="w-full bg-gray-100 rounded-lg flex items-center justify-center"
            style={{ height: FIXED_HEIGHT }}
          >
            <span className="text-gray-400 text-sm">No image available</span>
          </div>
        )}
      </div>
      
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        widgetId={widget.id}
        currentProps={widget.props}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default ImageWidget;