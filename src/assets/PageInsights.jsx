import React from "react";

const PageInsights = ({ pageWidgets, currentPage }) => {
  return (
    <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-xl">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        Page Insights
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <span className="text-gray-600 font-medium">Content Blocks</span>
          <span className="text-blue-600 font-bold text-lg">{pageWidgets.length}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <span className="text-gray-600 font-medium">Status</span>
          <span className="text-green-600 font-bold capitalize">{currentPage.status}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <span className="text-gray-600 font-medium">Author</span>
          <span className="text-purple-600 font-bold">{currentPage.author.name}</span>
        </div>
      </div>
    </div>
  );
};

export default PageInsights;