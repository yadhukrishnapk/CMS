import React from "react";
import HeadingWidget from "../HeadingWidget";
import RichTextWidget from "../RichTextWidget";
import ButtonWidget from "../ButtonWidget";
import SpacerWidget from "../SpacerWidget";
import DividerWidget from "../DividerWidget";
import ImageWidget from "../ImageWidget";
import WebPageInterfaceWidget from "../WebPageInterfaceWidge";
import WebPageInterfaceWidget2 from "../WebPageInterfaceWidget2";

const WidgetRenderer = ({ widget, isEditable = false, onContentChange, onSelect, onUpdate, editorRef }) => {
  switch (widget.type) {
    case 'webPageInterface':
      return (
        <WebPageInterfaceWidget
          widget={widget}
          isEditable={isEditable}
          onContentChange={onContentChange}
          onSelect={onSelect}
          onUpdate={onUpdate}
          editorRef={editorRef}
        />
      );
    case 'webPageInterface2':
      return (
        <WebPageInterfaceWidget2
          widget={widget}
          isEditable={isEditable}
          onContentChange={onContentChange}
          onSelect={onSelect}
          onUpdate={onUpdate}
          editorRef={editorRef}
        />
      );  
    case 'heading':
      return (
        <HeadingWidget
          widget={widget}
          isEditable={isEditable}
          onContentChange={onContentChange}
          onSelect={onSelect}
          onUpdate={onUpdate}
          editorRef={editorRef}
        />
      );
    case 'richText':
      return (
        <RichTextWidget
          widget={widget}
          isEditable={isEditable}
          onContentChange={onContentChange}
          onSelect={onSelect}
          onUpdate={onUpdate}
          editorRef={editorRef}
        />
      );
    case 'button':
      return (
        <ButtonWidget
          widget={widget}
          isEditable={isEditable}
          onContentChange={onContentChange}
          onSelect={onSelect}
          onUpdate={onUpdate}
          editorRef={editorRef}
        />
      );
    case 'spacer':
      return (
        <SpacerWidget
          widget={widget}
          isEditable={isEditable}
          onContentChange={onContentChange}
          onSelect={onSelect}
          onUpdate={onUpdate}
          editorRef={editorRef}
        />
      );
    case 'divider':
      return (
        <DividerWidget
          widget={widget}
          isEditable={isEditable}
          onContentChange={onContentChange}
          onSelect={onSelect}
          onUpdate={onUpdate}
          editorRef={editorRef}
        />
      );
    case 'image':
      return (
        <ImageWidget
          widget={widget}
          isEditable={isEditable}
          onContentChange={onContentChange}
          onSelect={onSelect}
          onUpdate={onUpdate}
          editorRef={editorRef}
        />
      );
    default:
      return null;
  }
};

export default WidgetRenderer;