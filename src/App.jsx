import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PagesList from './pages/PagesList';
import EnhancedPageEditor from './pages/EnhancedPageEditor';
import MediaLibrary from './pages/MediaLibrary';
import LinkManager from './pages/LinkManager';
import Preview from './pages/Preview';
import useCMSStore from './store/useCMSStore';

function App() {
  const { initializeDemoData } = useCMSStore();

  useEffect(() => {
    // Initialize demo data if no data exists
    initializeDemoData();
  }, [initializeDemoData]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PagesList />} />
            <Route path="pages" element={<PagesList />} />
            <Route path="editor/:pageId" element={<EnhancedPageEditor />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="links" element={<LinkManager />} />
          </Route>
          <Route path="/preview/:pageId" element={<Preview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
