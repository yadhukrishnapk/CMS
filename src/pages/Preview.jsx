import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCMSStore from '../store/useCMSStore';
import AdvancedWidgetContainer from '../components/widgets/AdvancedWidgetContainer';

const Preview = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { pages, widgets } = useCMSStore();

  const currentPage = pages.find(page => page.id === pageId);

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-screen">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{currentPage.title}</h1>
            <p className="text-sm text-gray-500">Preview Mode</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/editor/${pageId}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Page
            </button>
            <button
              onClick={() => navigate('/pages')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Pages
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {pageWidgets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                This page is empty
              </h3>
              <p className="text-gray-500">
                Add some widgets to make this page more interesting
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {pageWidgets.map((widget) => (
                <AdvancedWidgetContainer
                  key={widget.id}
                  widget={widget}
                  isEditing={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
