import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useCMSStore from "../store/useCMSStore";
import FormattingPanel from "../assets/FormattingPanel";
import WidgetBlock from "../components/widgets/WidgetRenderer/WidgetBlock";
import PageInsights from "../assets/PageInsights";

const Preview = () => {
  const {
    widgets,
    pages,
    currentPageId,
    updateWidget,
    initializeDemoData,
    deleteWidget,
    addWidget,
    selectWidget,
  } = useCMSStore();
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);
  const [isFormattingPanelVisible, setIsFormattingPanelVisible] =
    useState(true);

  // Get current location to determine if we're in preview mode
  const location = useLocation();
  const isPreviewMode = location.pathname.startsWith("/preview/");

  // Initialize demo data on mount
  useEffect(() => {
    initializeDemoData();
  }, [initializeDemoData]);

  const currentPage =
    pages.find((page) => page.id === currentPageId) || pages[0];
  const pageWidgets = currentPage
    ? currentPage.widgets.map((widgetId) => widgets[widgetId]).filter(Boolean)
    : [];

  const handleWidgetContentChange = (widgetId, newContent) => {
    // Don't allow content changes in preview mode
    if (isPreviewMode) return;

    const widget = widgets[widgetId];
    if (widget) {
      if (widget.type === "richText") {
        updateWidget(widgetId, {
          props: { ...widget.props, content: newContent },
        });
      } else if (widget.type === "heading") {
        updateWidget(widgetId, {
          props: { ...widget.props, text: newContent },
        });
      }
    }
  };

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl border border-white/20">
        <div className="px-6 py-4 flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div> */}
            <div>
              <h1 className="text-lg font-bold text-gray-900">Contento</h1>
              <p className="text-xs text-gray-500">
                {isPreviewMode ? "Preview Mode" : "Live Preview"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Only show formatting panel toggle in editor mode */}
            {!isPreviewMode && (
              <button
                onClick={() =>
                  setIsFormattingPanelVisible(!isFormattingPanelVisible)
                }
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors duration-200"
              >
                {isFormattingPanelVisible ? "Hide" : "Show"} Tools
              </button>
            )}
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full border ${
                  isPreviewMode
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200"
                    : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200"
                }`}
              >
                {isPreviewMode ? "Preview" : currentPage.status}
              </span>
              {!isPreviewMode && (
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  title="Auto-save active"
                ></div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-12 bg-red-100">
        <div className="max-w-6xl mx-auto flex gap-8 px-4 ">
          {/* Main Content Area */}
          <main
            className={`${
              !isPreviewMode && isFormattingPanelVisible
                ? "flex-1"
                : "w-full max-w-4xl mx-auto"
            } transition-all duration-300`}
          >
            <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden -ml-48">
              {/* Page Header */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentPage.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>By {currentPage.author.name}</span>
                  <span>•</span>
                  <span>
                    Updated{" "}
                    {new Date(currentPage.updated_at).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs">
                    /{currentPage.slug}
                  </span>
                  {isPreviewMode && (
                    <>
                      <span>•</span>
                      <span className="text-blue-600 font-medium">
                        Read-only Preview
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div
                ref={editorRef}
                className={`px-8 py-12 lg:px-16 lg:py-16 min-h-[800px] max-h-[calc(100vh-200px)] overflow-y-auto transition-all duration-300 ${
                  !isPreviewMode ? "focus-within:bg-blue-50/20" : ""
                }`}
              >
                {pageWidgets.length > 0 ? (
                  <div className="max-w-4xl mx-auto">
                    {pageWidgets.map((widget, index) => (
                      <WidgetBlock
                        key={widget.id}
                        widget={widget}
                        index={index}
                        currentPageId={currentPageId}
                        isEditable={!isPreviewMode}
                        onContentChange={handleWidgetContentChange}
                        addWidget={addWidget}
                        deleteWidget={deleteWidget}
                        onSelect={selectWidget}
                        onUpdate={updateWidget}
                        editorRef={editorRef}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 max-w-2xl mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {isPreviewMode
                        ? "No Content Available"
                        : "Ready to Create"}
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                      {isPreviewMode
                        ? "This page doesn't have any content yet."
                        : "Start building your page by adding content widgets."}
                    </p>
                    {!isPreviewMode && (
                      <button
                        onClick={() => addWidget("richText", currentPageId)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        Add Your First Widget
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Floating Formatting Panel - only show in editor mode */}
          {!isPreviewMode && isFormattingPanelVisible && (
            <aside className="w-80 sticky top-28 h-fit -mr-48">
              <FormattingPanel savedRangeRef={savedRangeRef} editorRef={editorRef} />
              <PageInsights pageWidgets={pageWidgets} currentPage={currentPage} />
            </aside>
          )}
        </div>
      </div>

      {/* Floating Save Indicator - only show in editor mode */}
      {!isPreviewMode && (
        <div className="fixed bottom-6 right-6 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl px-6 py-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
            <span className="text-sm font-medium text-gray-700">
              Auto-saved
            </span>
            <span className="text-xs text-gray-500">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
