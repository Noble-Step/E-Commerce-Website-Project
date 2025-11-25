import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import {
  LogOut,
  LayoutDashboard,
  Users,
  ShoppingBag,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { ALERT_TYPES } from "../../../modals/AlertModal";
import { useModal } from "../../../context/ModalContext";
import { MODAL_TYPES } from "../../../context/ModalContext";
import logo from "../../../assets/logo.jpg";

const AdminLayout = ({ children }) => {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/products", icon: ShoppingBag, label: "Products" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/orders", icon: FileText, label: "Orders" },
  ];

  const handleLogout = () => {
    openModal(MODAL_TYPES.ALERT_MODAL, {
      ...ALERT_TYPES.LOGOUT_CONFIRM,
      onConfirm: () => {
        logout();
        navigate("/");
      },
    });
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  if (!user?.isAdmin) return null;

  return (
    <div className="min-h-screen bg-black">
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-black border-b border-yellow-600/20 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-yellow-400">
              Noble Step
            </span>
          </div>

          <button
            onClick={toggleSidebar}
            className="p-2 text-yellow-400 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-40"
          style={{ top: "56px" }}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <div className="flex pt-14 lg:pt-0 min-h-screen">
        <aside
          className={`
            fixed lg:static
            top-14 lg:top-0
            left-0
            bottom-0
            w-64
            bg-black
            border-r border-yellow-600/20
            z-40
            transform transition-transform duration-300 ease-in-out
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          <div className="hidden lg:flex items-center gap-3 p-6 border-b border-yellow-600/20">
            <span className="text-xl font-semibold text-yellow-400">Admin</span>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/admin" &&
                  location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-yellow-500/10 text-yellow-400 border-l-4 border-yellow-400"
                        : "text-gray-400 hover:bg-gray-800 hover:text-yellow-400"
                    }
                  `}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => {
                closeSidebar();
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
