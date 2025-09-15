import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import useCMSStore from '../../store/useCMSStore';

const DraggableWidget = ({ type, label, icon, description }) => {
  const { addWidget, currentPageId } = useCMSStore();
  const [isDragging, setIsDragging] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isDndDragging,
  } = useDraggable({
    id: `widget-${type}`,
    data: {
      type: 'widget-template',
      widgetType: type,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleClick = () => {
    if (currentPageId) {
      addWidget(type, currentPageId);
    } else {
      alert('Please select a page first');
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`widget-template p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300 ${
        isDndDragging ? 'opacity-50 scale-95' : ''
      } ${isDragging ? 'shadow-lg border-blue-400' : ''}`}
      onClick={handleClick}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-center space-x-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-medium text-gray-800">{label}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      
      <div className="text-xs text-gray-400">
        Click to add or drag to canvas
      </div>
    </div>
  );
};

const EnhancedWidgetPalette = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const widgetTypes = [
    { 
      type: 'richText', 
      label: 'Rich Text', 
      icon: '📝', 
      description: 'Add formatted text content',
      category: 'content'
    },
    { 
      type: 'image', 
      label: 'Image', 
      icon: '��️', 
      description: 'Display images with controls',
      category: 'media'
    },
    { 
      type: 'button', 
      label: 'Button', 
      icon: '🔘', 
      description: 'Interactive call-to-action button',
      category: 'interactive'
    },
    { 
      type: 'heading', 
      label: 'Heading', 
      icon: '📋', 
      description: 'Page titles and headings',
      category: 'content'
    },
    { 
      type: 'spacer', 
      label: 'Spacer', 
      icon: '⬜', 
      description: 'Add vertical spacing',
      category: 'layout'
    },
    { 
      type: 'divider', 
      label: 'Divider', 
      icon: '➖', 
      description: 'Visual content separator',
      category: 'layout'
    },
  ];

  const categories = [
    { id: 'all', label: 'All Widgets', icon: '📦' },
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'media', label: 'Media', icon: '🖼️' },
    { id: 'interactive', label: 'Interactive', icon: '🔘' },
    { id: 'layout', label: 'Layout', icon: '��' },
  ];

  const filteredWidgets = widgetTypes.filter(widget => {
    const matchesSearch = widget.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Widgets</h3>
        
        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search widgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute left-2 top-2.5 text-gray-400">🔍</span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.icon} {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Widget List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredWidgets.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-gray-500 text-sm">No widgets found</p>
            </div>
          ) : (
            filteredWidgets.map((widget) => (
              <DraggableWidget
                key={widget.type}
                type={widget.type}
                label={widget.label}
                icon={widget.icon}
                description={widget.description}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <p>💡 Tip: Drag widgets to reorder them</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWidgetPalette;
