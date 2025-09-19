import { useNavigate, useParams } from 'react-router-dom';
import useCMSStore from '../../store/useCMSStore';

const Topbar = () => {
  const navigate = useNavigate();
  const { pageId } = useParams();
  const { exportData, importData } = useCMSStore();

  const handleSave = () => {
    // Data is automatically saved via Zustand persist middleware
    alert('Data saved to localStorage!');
  };

  const handlePreview = () => {
    if (pageId) {
      navigate(`/preview/${pageId}`);
    } else {
      alert('Please select a page to preview');
    }
  };

  const handleExport = () => {
    try {
      // Get the current data from localStorage directly
      const storedData = localStorage.getItem('cms-storage');
      
      if (!storedData) {
        alert('No data found in localStorage to export');
        return;
      }

      const parsedData = JSON.parse(storedData);
      
      // Structure the export to match your backend API response format
      const exportResponse = {
        success: true,
        message: "Data exported successfully",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        data: {
          pages: parsedData.state.pages || [],
          widgets: parsedData.state.widgets || {},
          media: parsedData.state.media || [],
          links: parsedData.state.links || [],
          users: parsedData.state.users || [],
          settings: parsedData.state.settings || {}
        },
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_items: parsedData.state.pages?.length || 0,
          items_per_page: 10
        },
        meta: {
          api_version: 'v1',
          request_id: 'req_' + Math.random().toString(36).substr(2, 9),
          response_time: '0ms'
        }
      };

      console.log('Export JSON string preview:');
      console.log(JSON.stringify(exportResponse, null, 2).substring(0, 1000) + '...');
      console.log('===============================');
      
      // Create properly formatted JSON string
      const jsonString = JSON.stringify(exportResponse, null, 2);
      
      // Create and download the file with proper MIME type
      const blob = new Blob([jsonString], {
        type: 'application/json;charset=utf-8',
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cms-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a); // Ensure element is in DOM
      a.click();
      document.body.removeChild(a); // Clean up
      URL.revokeObjectURL(url);
      
      // Show a preview of the widgets data in the alert
      const widgetCount = Object.keys(exportResponse.data.widgets || {}).length;
      const pageCount = (exportResponse.data.pages || []).length;
      const mediaCount = (exportResponse.data.media || []).length;
      const linkCount = (exportResponse.data.links || []).length;
      
      alert(`✅ Data exported successfully as JSON!\n\n📊 Export Summary:\n• Pages: ${pageCount}\n• Widgets: ${widgetCount}\n• Media: ${mediaCount}\n• Links: ${linkCount}\n\n🔍 Check browser console for detailed data inspection\n📁 File saved as: cms-export-${new Date().toISOString().split('T')[0]}.json`);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Error exporting data: ' + error.message);
    }
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
    <div className="bg-white shadow-sm border-b px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {pageId ? 'Page Preview' : 'Contento Dashboard'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Save
          </button>
          
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Export
          </button>
          
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;