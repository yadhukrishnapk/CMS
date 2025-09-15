import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useCMSStore from '../../store/useCMSStore';
import RichTextWidget from '../../widgets/RichTextWidget';
import ImageWidget from '../../widgets/ImageWidget';
import ButtonWidget from '../../widgets/ButtonWidget';

const WidgetContainer = ({ widget, isEditing = true }) => {
  const { selectedWidgetId, selectWidget, deleteWidget, updateWidget } = useCMSStore();
  const isSelected = selectedWidgetId === widget.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSelect = () => {
    selectWidget(widget.id);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this widget?')) {
      deleteWidget(widget.id);
    }
  };

  const handleUpdate = (updates) => {
    updateWidget(widget.id, { props: { ...widget.props, ...updates } });
  };

  const renderWidget = () => {
    switch (widget.type) {
      case 'richText':
        return <RichTextWidget widget={widget} isEditing={isEditing} onUpdate={handleUpdate} />;
      case 'image':
        return <ImageWidget widget={widget} isEditing={isEditing} onUpdate={handleUpdate} />;
      case 'button':
        return <ButtonWidget widget={widget} isEditing={isEditing} onUpdate={handleUpdate} />;
      default:
        return <div className="p-4 text-gray-500">Unknown widget type: {widget.type}</div>;
    }
  };

  if (!isEditing) {
    return (
      <div className="w-full">
        {renderWidget()}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`widget-container relative p-2 cursor-pointer ${
        isSelected ? 'selected' : ''
      }`}
      onClick={handleSelect}
      {...attributes}
      {...listeners}
    >
      <div className="widget-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          title="Delete widget"
        >
          🗑️
        </button>
      </div>
      
      {renderWidget()}
    </div>
  );
};

export default WidgetContainer;
