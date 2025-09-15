import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCMSStore from '../../store/useCMSStore';

const FloatingToolbar = ({ pageId }) => {
  const navigate = useNavigate();
  const { 
    selectedWidgetId, 
    widgets, 
    deleteWidget, 
    duplicateWidget,
    exportData,
    importData 
  } = useCMSStore();

  const selectedWidget = selectedWidgetId ? widgets[selectedWidgetId] : null;

  const handleDelete = () => {
    if (selectedWidget && confirm('Delete this widget?')) {
      deleteWidget(selectedWidgetId);
    }
  };

  const handleDuplicate = () => {
    if (selectedWidget && pageId) {
      duplicateWidget(selectedWidgetId, pageId);
    }
  };

  const handlePreview = () => {
    if (pageId) {
      navigate(`/preview/${pageId}`);
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cms-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            importData(data);
            alert('Data imported successfully!');
          } catch (error) {
            alert('Error importing data: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="floating-toolbar">
      {/* Widget Actions */}
      {selectedWidget && (
        <>
          <button
            onClick={handleDuplicate}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            title="Duplicate widget"
          >
            📋
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="Delete widget"
          >
            🗑️
          </button>
        </>
      )}

      {/* Divider */}
      <div className="w-px bg-gray-300 mx-1"></div>

      {/* Page Actions */}
      <button
        onClick={handlePreview}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        title="Preview page"
      >
        👁️
      </button>
      
      <button
        onClick={handleExport}
        className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        title="Export data"
      >
        📤
      </button>
      
      <button
        onClick={handleImport}
        className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        title="Import data"
      >
        📥
      </button>
    </div>
  );
};

export default FloatingToolbar;
