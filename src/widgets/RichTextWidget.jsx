import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextWidget = ({ widget, isEditing, onUpdate }) => {
  const [content, setContent] = useState(widget.props.content || '');

  const handleChange = (value) => {
    setContent(value);
    if (onUpdate) {
      onUpdate({ content: value });
    }
  };

  if (isEditing) {
    return (
      <div className="w-full">
        <ReactQuill
          value={content}
          onChange={handleChange}
          theme="snow"
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'image'],
              ['clean']
            ],
          }}
        />
      </div>
    );
  }

  return (
    <div 
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextWidget;
