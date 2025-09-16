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
    <div className="bg-white shadow-sm border-b px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {pageId ? 'Page Preview' : 'CMS Dashboard'}
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
            onClick={handlePreview}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Preview
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
