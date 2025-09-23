import React from "react";
import useWidgetLogic from "../../hooks/useWidgetsLogic";
import useCMSStore from "../../store/useCMSStore";

const WebPageInterfaceWidget3 = ({
  widget,
  isEditable,
  onContentChange,
  onSelect,
  onUpdate,
  editorRef,
}) => {
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
      [field]: value,
    };
    onUpdate(widget.id, { props: updatedProps });
    forceSave();
  };

  const {
    title = "E-Commerce Engine",
    description = `Our versatile and robust e-commerce platform supports 
      multi-channel selling, manages product catalogs, and ensures real-time 
      inventory synchronization. It creates a seamless shopping journey that guides 
      customers from discovery to purchase, enhancing satisfaction, increasing conversion 
      rates, and providing consistent support throughout the process.`,
    imageUrl =
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
  } = widget.props;

  return (
    <div
      ref={ref}
      className="relative w-full min-h-[400px] flex flex-col lg:flex-row items-center gap-8 p-6 lg:p-12 bg-white rounded-2xl shadow-md"
    >
      {/* Image Section */}
      <div
        className="flex-1 cursor-pointer"
        onClick={() => isEditable && onSelect(widget.id)}
      >
        <img
          src={imageUrl}
          alt="E-Commerce Preview"
          className="w-full h-full object-cover rounded-xl"
          style={{ maxHeight: "400px" }}
        />
      </div>

      {/* Text Section */}
      <div className="flex-1 space-y-4">
        {/* Title */}
        <h2
          className={`text-3xl lg:text-4xl font-bold text-gray-900 ${
            widget.props.title ? "" : "empty-placeholder"
          }`}
          contentEditable={isEditable}
          suppressContentEditableWarning={true}
          onInput={(e) =>
            handleContentChange(e, "html", () =>
              handleContentUpdate("title", e.target.innerHTML)
            )
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-placeholder="Enter title..."
          style={{ minHeight: "40px" }}
          dangerouslySetInnerHTML={isEditable ? undefined : { __html: title }}
        >
          {isEditable ? title : undefined}
        </h2>

        {/* Description */}
        <p
          className={`text-lg text-gray-600 leading-relaxed ${
            widget.props.description ? "" : "empty-placeholder"
          }`}
          contentEditable={isEditable}
          suppressContentEditableWarning={true}
          onInput={(e) =>
            handleContentChange(e, "html", () =>
              handleContentUpdate("description", e.target.innerHTML)
            )
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-placeholder="Enter description..."
          style={{ minHeight: "80px" }}
          dangerouslySetInnerHTML={
            isEditable ? undefined : { __html: description }
          }
        >
          {isEditable ? description : undefined}
        </p>
      </div>

      {/* Edit Mode Overlay */}
      {isEditable && (
        <div className="absolute top-4 right-4">
          {/* <button
            onClick={() => {
              const stockImages = [
                "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1605902711622-cfb43c44367f?auto=format&fit=crop&w=800&q=80",
              ];
              const newImage =
                stockImages[Math.floor(Math.random() * stockImages.length)];
              handleContentUpdate("imageUrl", newImage);
            }}
            className="px-3 py-1 bg-white bg-opacity-90 text-sm text-gray-700 rounded-lg shadow hover:bg-opacity-100 transition-all"
          >
            🖼 Change Image
          </button> */}
        </div>
      )}
    </div>
  );
};

export default WebPageInterfaceWidget3;
