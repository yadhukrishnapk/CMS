import React from "react";
import useWidgetLogic from "../../hooks/useWidgetsLogic";
import useCMSStore from "../../store/useCMSStore";

const WebPageInterfaceWidget2 = ({
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
    title = "Design. Build. Market.",
    description = "It's in Webandcrafts' DNA to transform your brand into its best digital self. We are driven by a customer centric approach in creating engaging, interactive and immersive experiences that deliver only the best.",
    primaryButtonText = "Our expertise",
    primaryButtonColor = "#00A3E0",
    backgroundGradient = "linear-gradient(90deg, #000000 0%, #1E3A8A 100%)",
  } = widget.props;

  return (
    <div
      ref={ref}
      className="relative w-full min-h-[300px] overflow-hidden"
      style={{
        background: backgroundGradient,
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {/* Content Section */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Title */}
        <h1
          className={`text-4xl lg:text-6xl font-bold leading-tight ${
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
          style={{ minHeight: "60px", color: "#00A3E0" }}
          dangerouslySetInnerHTML={isEditable ? undefined : { __html: title }}
        >
          {isEditable ? title : undefined}
        </h1>

        {/* Description */}
        <p
          className={`text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto ${
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
          style={{ minHeight: "50px", color: "#FFFFFF" }}
          dangerouslySetInnerHTML={
            isEditable ? undefined : { __html: description }
          }
        >
          {isEditable ? description : undefined}
        </p>

        {/* Button */}
        <div className="pt-6">
          <button
            className="px-6 py-3 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105"
            style={{
              backgroundColor: primaryButtonColor,
              border: "1px solid #FFFFFF",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => isEditable && console.log("Primary button clicked")}
          >
            <span
              contentEditable={isEditable}
              suppressContentEditableWarning={true}
              onInput={(e) =>
                handleContentChange(e, "html", () =>
                  handleContentUpdate("primaryButtonText", e.target.innerHTML)
                )
              }
              className={`outline-none ${
                widget.props.primaryButtonText ? "" : "empty-placeholder"
              }`}
              data-placeholder="Enter button text..."
            >
              {isEditable ? primaryButtonText : primaryButtonText}
            </span>
          </button>
        </div>
      </div>

      {/* Edit Mode Overlay */}
      {isEditable && (
        <div className="absolute top-4 right-4 space-y-2">
          <button
            onClick={() => {
              const colors = ["#00A3E0", "#00C4B4", "#F97316", "#9333EA"];
              const newColor =
                colors[Math.floor(Math.random() * colors.length)];
              handleContentUpdate("primaryButtonColor", newColor);
            }}
            className="px-3 py-1 bg-white bg-opacity-90 text-sm text-gray-700 rounded-lg shadow hover:bg-opacity-100 transition-all"
          >
            🎨 Change Colors
          </button>

          <button
            onClick={() => {
              const gradients = [
                "linear-gradient(90deg, #000000 0%, #1E3A8A 100%)",
                "linear-gradient(90deg, #1E1E1E 0%, #4B5EAA 100%)",
                "linear-gradient(90deg, #0A0A0A 0%, #2A4DA2 100%)",
              ];
              const newGradient =
                gradients[Math.floor(Math.random() * gradients.length)];
              handleContentUpdate("backgroundGradient", newGradient);
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

export default WebPageInterfaceWidget2;