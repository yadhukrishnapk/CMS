import React from "react";
import useWidgetLogic from "../../hooks/useWidgetsLogic";
import useCMSStore from "../../store/useCMSStore";

const WebPageInterfaceWidget = ({ widget, isEditable, onContentChange, onSelect, onUpdate, editorRef }) => {
  const { ref, handleContentChange, handleFocus, handleBlur } = useWidgetLogic({
    widget,
    isEditable,
    onContentChange,
    onSelect,
    editorRef,
  });
  const { forceSave } = useCMSStore();

  const handleContentUpdate = (field, value) => {
    if (!isEditable) return;
    
    const updatedProps = {
      ...widget.props,
      [field]: value
    };
    
    onUpdate(widget.id, { props: updatedProps });
    // Force save to localStorage immediately
    forceSave();
  };

  const {
    title = "Add magic to your components",
    subtitle = "DESIGN SYSTEM",
    description = "With little changes you can turn your React design system into visually editable content blocks your marketing will love.",
    primaryButtonText = "Learn more",
    secondaryButtonText = "Sign up",
    primaryButtonColor = "#EC4899",
    secondaryButtonColor = "#EC4899",
    backgroundGradient = "linear-gradient(135deg, #FDF2F8 0%, #FFFFFF 50%, #F3E8FF 100%)",
    imageUrl = "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  } = widget.props;

  return (
    <div 
      ref={ref}
      className="relative w-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: backgroundGradient }}
    >
      <div className="flex flex-col lg:flex-row items-center h-full">
        {/* Content Section */}
        <div className="flex-1 p-8 lg:p-16 space-y-6">
          {/* Subtitle */}
          <div
            className={`text-sm font-semibold text-green-600 tracking-wider uppercase ${widget.props.subtitle ? '' : 'empty-placeholder'}`}
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
            onInput={(e) => handleContentChange(e, 'html', () => handleContentUpdate('subtitle', e.target.innerHTML))}
            onFocus={handleFocus}
            onBlur={handleBlur}
            data-placeholder="Enter subtitle..."
            style={{ minHeight: '20px' }}
            dangerouslySetInnerHTML={isEditable ? undefined : { __html: subtitle }}
          >
            {isEditable ? subtitle : undefined}
          </div>

          {/* Main Title */}
          <h1
            className={`text-4xl lg:text-6xl font-bold text-gray-900 leading-tight ${widget.props.title ? '' : 'empty-placeholder'}`}
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
            onInput={(e) => handleContentChange(e, 'html', () => handleContentUpdate('title', e.target.innerHTML))}
            onFocus={handleFocus}
            onBlur={handleBlur}
            data-placeholder="Enter title..."
            style={{ minHeight: '60px' }}
            dangerouslySetInnerHTML={isEditable ? undefined : { __html: title }}
          >
            {isEditable ? title : undefined}
          </h1>

          {/* Description */}
          <p
            className={`text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl ${widget.props.description ? '' : 'empty-placeholder'}`}
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
            onInput={(e) => handleContentChange(e, 'html', () => handleContentUpdate('description', e.target.innerHTML))}
            onFocus={handleFocus}
            onBlur={handleBlur}
            data-placeholder="Enter description..."
            style={{ minHeight: '50px' }}
            dangerouslySetInnerHTML={isEditable ? undefined : { __html: description }}
          >
            {isEditable ? description : undefined}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              className="px-8 py-4 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: primaryButtonColor }}
              onClick={() => isEditable && console.log('Primary button clicked')}
            >
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning={true}
                onInput={(e) => handleContentChange(e, 'html', () => handleContentUpdate('primaryButtonText', e.target.innerHTML))}
                className={`outline-none ${widget.props.primaryButtonText ? '' : 'empty-placeholder'}`}
                data-placeholder="Enter button text..."
              >
                {isEditable ? primaryButtonText : primaryButtonText}
              </span>
            </button>
            
            <button
              className="px-8 py-4 bg-transparent border-2 font-semibold rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105"
              style={{ 
                borderColor: secondaryButtonColor,
                color: secondaryButtonColor
              }}
              onClick={() => isEditable && console.log('Secondary button clicked')}
            >
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning={true}
                onInput={(e) => handleContentChange(e, 'html', () => handleContentUpdate('secondaryButtonText', e.target.innerHTML))}
                className={`outline-none ${widget.props.secondaryButtonText ? '' : 'empty-placeholder'}`}
                data-placeholder="Enter button text..."
              >
                {isEditable ? secondaryButtonText : secondaryButtonText}
              </span>
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex-1 h-full min-h-[400px] lg:min-h-[500px]">
          <div className="relative h-full w-full">
            <img
              src={imageUrl}
              alt="Design interface preview"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center' }}
            />
            {isEditable && (
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => {
                    const newUrl = prompt('Enter image URL:', imageUrl);
                    if (newUrl) {
                      handleContentUpdate('imageUrl', newUrl);
                    }
                  }}
                  className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Change Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Mode Overlay */}
      {isEditable && (
        <div className="absolute top-4 right-4 space-y-2">
          <button
            onClick={() => {
              const colors = ['#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
              const newColor = colors[Math.floor(Math.random() * colors.length)];
              handleContentUpdate('primaryButtonColor', newColor);
              handleContentUpdate('secondaryButtonColor', newColor);
            }}
            className="px-3 py-1 bg-white bg-opacity-90 text-sm text-gray-700 rounded-lg shadow hover:bg-opacity-100 transition-all"
          >
            🎨 Change Colors
          </button>
          
          <button
            onClick={() => {
              const gradients = [
                "linear-gradient(135deg, #FDF2F8 0%, #FFFFFF 50%, #F3E8FF 100%)",
                "linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 50%, #ECFDF5 100%)",
                "linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 50%, #FEF3C7 100%)",
                "linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 50%, #FECACA 100%)"
              ];
              const newGradient = gradients[Math.floor(Math.random() * gradients.length)];
              handleContentUpdate('backgroundGradient', newGradient);
            }}
            className="px-3 py-1 bg-white bg-opacity-90 text-sm text-gray-700 rounded-lg shadow hover:bg-opacity-100 transition-all block"
          >
            🌈 Change Background
          </button>
        </div>
      )}
    </div>
  );
};

export default WebPageInterfaceWidget;