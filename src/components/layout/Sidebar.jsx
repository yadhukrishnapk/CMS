import { NavLink } from 'react-router-dom';
import useCMSStore from '../../store/useCMSStore';

const Sidebar = () => {
  const { pages } = useCMSStore();

  const navItems = [
    { path: '/pages', label: 'Pages', icon: '📄' },
    { path: '/media', label: 'Media', icon: '🖼️' },
    { path: '/links', label: 'Links', icon: '🔗' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">Contento</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className="text-sm text-gray-500">
          <p>Pages: {pages.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
