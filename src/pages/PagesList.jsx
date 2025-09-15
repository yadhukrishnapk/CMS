import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCMSStore from '../store/useCMSStore';

const PagesList = () => {
  const navigate = useNavigate();
  const { pages, createPage, deletePage, updatePage } = useCMSStore();
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreatePage = () => {
    const pageId = createPage();
    navigate(`/editor/${pageId}`);
  };

  const handleEditPage = (page) => {
    setEditingId(page.id);
    setEditTitle(page.title);
  };

  const handleSaveEdit = (pageId) => {
    updatePage(pageId, { title: editTitle });
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDeletePage = (pageId) => {
    if (confirm('Are you sure you want to delete this page?')) {
      deletePage(pageId);
    }
  };

  const handleOpenEditor = (pageId) => {
    navigate(`/editor/${pageId}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pages</h1>
        <button
          onClick={handleCreatePage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Page
        </button>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No pages yet</h3>
          <p className="text-gray-500 mb-6">Create your first page to get started</p>
          <button
            onClick={handleCreatePage}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Page
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div key={page.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                {editingId === page.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 text-lg font-semibold text-gray-800 border border-gray-300 rounded px-2 py-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(page.id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                ) : (
                  <h3 className="text-lg font-semibold text-gray-800">{page.title}</h3>
                )}
                
                <div className="flex space-x-1">
                  {editingId === page.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(page.id)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Save"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditPage(page)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Edit title"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete page"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">Slug: /{page.slug}</p>
              <p className="text-sm text-gray-500 mb-4">Widgets: {page.widgets.length}</p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenEditor(page.id)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/preview/${page.id}`)}
                  className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PagesList;
