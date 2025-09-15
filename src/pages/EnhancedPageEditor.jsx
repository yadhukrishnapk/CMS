import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  useDroppable
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import useCMSStore from '../store/useCMSStore';
import AdvancedWidgetContainer from '../components/widgets/AdvancedWidgetContainer';
import EnhancedWidgetPalette from '../components/widgets/EnhancedWidgetPalette';
import PropertiesPanel from '../components/widgets/PropertiesPanel';
import FloatingToolbar from '../components/widgets/FloatingToolbar';

const DropZone = ({ onDrop, isActive }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
    data: {
      accepts: ['widget-template'],
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`drop-zone ${isOver ? 'active' : ''} ${isActive ? 'active' : ''}`}
    >
      {isOver ? (
        <div className="text-blue-600 font-medium">
          Drop widget here to add it to your page
        </div>
      ) : (
        <div className="text-gray-500">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Your page is empty
          </h3>
          <p className="text-gray-500">
            Add widgets from the left panel to start building your page
          </p>
        </div>
      )}
    </div>
  );
};

const EnhancedPageEditor = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { 
    pages, 
    widgets, 
    currentPageId, 
    setCurrentPage, 
    reorderWidgets,
    addWidget,
    selectedWidgetId,
    selectWidget
  } = useCMSStore();

  const [activeId, setActiveId] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentPage = pages.find(page => page.id === pageId);

  useEffect(() => {
    if (pageId && currentPageId !== pageId) {
      setCurrentPage(pageId);
    }
  }, [pageId, currentPageId, setCurrentPage]);

  // Click outside to deselect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.widget-container') && !event.target.closest('.properties-panel')) {
        selectWidget(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectWidget]);

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Page not found</h2>
          <button
            onClick={() => navigate('/pages')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Pages
          </button>
        </div>
      </div>
    );
  }

  const pageWidgets = currentPage.widgets.map(id => widgets[id]).filter(Boolean);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    setIsDragOver(true);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setIsDragOver(false);

    if (!over) return;

    // Handle widget template drop
    if (active.data.current?.type === 'widget-template') {
      const widgetType = active.data.current.widgetType;
      addWidget(widgetType, pageId);
      return;
    }

    // Handle widget reordering
    if (active.id !== over.id && active.data.current?.type === 'widget') {
      const oldIndex = currentPage.widgets.indexOf(active.id);
      const newIndex = currentPage.widgets.indexOf(over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(currentPage.widgets, oldIndex, newIndex);
        reorderWidgets(pageId, newOrder);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setIsDragOver(false);
  };

  return (
    <div className="flex h-full bg-gray-50">
      <EnhancedWidgetPalette />
      
      <div className="flex-1 flex flex-col">
        {/* Canvas Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {currentPage.title}
              </h2>
              <p className="text-sm text-gray-500">
                {pageWidgets.length} widget{pageWidgets.length !== 1 ? 's' : ''} • 
                {selectedWidgetId ? ' Widget selected' : ' No selection'}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/pages')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Pages
              </button>
              <button
                onClick={() => navigate(`/preview/${pageId}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <div className="canvas-container min-h-full">
                <div className="page-canvas min-h-full">
                  {pageWidgets.length === 0 ? (
                    <DropZone onDrop={() => {}} isActive={isDragOver} />
                  ) : (
                    <SortableContext
                      items={currentPage.widgets}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="p-6 space-y-4 min-h-full">
                        {pageWidgets.map((widget, index) => (
                          <AdvancedWidgetContainer
                            key={widget.id}
                            widget={widget}
                            isEditing={true}
                            index={index}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  )}
                </div>
              </div>

              <DragOverlay>
                {activeId ? (
                  <div className="bg-white shadow-lg rounded-lg border-2 border-blue-500 p-4 opacity-90">
                    <div className="text-sm font-medium text-blue-600">
                      {activeId.startsWith('widget-') ? 'Adding widget...' : 'Moving widget...'}
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
          
          <PropertiesPanel />
        </div>
      </div>

      <FloatingToolbar pageId={pageId} />
    </div>
  );
};

export default EnhancedPageEditor;
