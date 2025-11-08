import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { LogOut, LayoutDashboard, Users, ShoppingBag, FileText } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: ShoppingBag, label: 'Products' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/orders', icon: FileText, label: 'Orders' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user?.isAdmin) return null;

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-yellow-600/20">
        <div className="flex items-center gap-3 p-6 border-b border-yellow-600/20">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xl">N</span>
          </div>
          <span className="text-xl font-semibold text-yellow-400">Admin</span>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                location.pathname === item.path
                  ? "flex items-center gap-3 px-4 py-3 rounded-lg bg-yellow-400/10 text-yellow-400"
                  : "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-yellow-400"
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;