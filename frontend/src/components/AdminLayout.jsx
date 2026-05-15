import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LayoutDashboard, Home as HomeIcon, Image as ImageIcon, Tags, Gift, MessageSquare, Settings, LogOut, Building2, ShoppingBag, Info } from 'lucide-react';

const AdminLayout = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = admin?.role === 'vendor' ? [
    { name: 'My Products', path: '/admin/items', icon: <ShoppingBag size={20} /> },
  ] : [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Items (Products)', path: '/admin/items', icon: <ShoppingBag size={20} /> },
    { name: 'Home Page', path: '/admin/home', icon: <HomeIcon size={20} /> },
    { name: 'About Us', path: '/admin/about', icon: <Info size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Tags size={20} /> },
    { name: 'Gallery', path: '/admin/gallery', icon: <ImageIcon size={20} /> },
    { name: 'Offers', path: '/admin/offers', icon: <Gift size={20} /> },
    { name: 'Vendors', path: '/admin/vendors', icon: <Building2 size={20} /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-primary text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-black tracking-tighter uppercase">Sujal<span className="text-accent">Panel</span></h2>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 hover:bg-gray-700 transition-colors ${
                    location.pathname === item.path ? 'bg-gray-800 border-l-4 border-accent' : ''
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors rounded"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;
