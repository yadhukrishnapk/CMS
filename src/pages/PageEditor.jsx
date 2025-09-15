import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import useCMSStore from '../store/useCMSStore';
import WidgetContainer from '../components/widgets/WidgetContainer';
import WidgetPalette from '../components/widgets/WidgetPalette';
import PropertiesPanel from '../components/widgets/PropertiesPanel';

const PageEditor = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { 
    pages, 
    widgets, 
    currentPageId, 
    setCurrentPage, 
    reorderWidgets 
  } = useCMSStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = currentPage.widgets.indexOf(active.id);
      const newIndex = currentPage.widgets.indexOf(over.id);
      
      const newOrder = arrayMove(currentPage.widgets, oldIndex, newIndex);
      reorderWidgets(pageId, newOrder);
    }
  };

  return (
    <div className="flex h-full">
      <WidgetPalette />
      
      <div className="flex-1 flex">
        <div className="flex-1 p-6 hey">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {currentPage.title}
            </h2>
            <p className="text-sm text-gray-500">
              Drag widgets from the left panel to add them to your page
            </p>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="min-h-96 bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
              {pageWidgets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Your page is empty
                  </h3>
                  <p className="text-gray-500">
                    Add widgets from the left panel to start building your page
                  </p>
                </div>
              ) : (
                <SortableContext
                  items={currentPage.widgets}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {pageWidgets.map((widget) => (
                      <WidgetContainer
                        key={widget.id}
                        widget={widget}
                        isEditing={true}
                      />
                    ))}
                  </div>
                </SortableContext>
              )}
            </div>
          </DndContext>
        </div>
        
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default PageEditor;
