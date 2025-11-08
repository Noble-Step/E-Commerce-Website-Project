import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogIn, UserPlus } from "lucide-react";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";
import AlertModal, { ALERT_TYPES } from "../modals/AlertModal";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";

// Header
const Header = () => {
  const { user, logout, login } = useUser();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);
  const navigate = useNavigate();

  const handleCartClick = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    navigate("/cart");
  };

  useEffect(() => {
    if (showLogin || showRegister) {
      setIsMenuOpen(false);
    }
  }, [showLogin, showRegister]);

  return (
    <div className="bg-black">
      <header className="bg-black border-b border-yellow-500 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Website Name */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-semibold text-yellow-400">
                Noble Step
              </span>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Login/Register or Profile Button */}
              {user ? (
                <button
                  onClick={() => navigate("/profile")}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  aria-label="Profile"
                >
                  <User className="w-6 h-6 text-yellow-400" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-yellow-400 hover:bg-gray-800 rounded-lg transition-colors border border-yellow-500/30"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </button>

                  <button
                    onClick={() => setShowRegister(true)}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-medium hover:from-yellow-500 hover:to-yellow-700 rounded-lg transition-all border border-yellow-500/30"
                  >
                    Register
                  </button>
                </>
              )}

              <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToRegister={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
                onLogin={(data) => {
                  login(data.user);
                  setShowLogin(false);
                }}
              />

              <RegisterModal
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
                onSwitchToLogin={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
                onRegister={(data) => {
                  login(data.user);
                  setShowRegister(false);
                }}
              />

              {/* Cart Button - Now a button, not a Link */}
              <button
                onClick={handleCartClick}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingCart className="w-6 h-6 text-yellow-400" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItems.length > 99 ? "99+" : cartItems.length}
                  </span>
                )}
              </button>

              {/* Burger Menu Button */}
              <button
                onClick={() =>
                  !showLogin && !showRegister && setIsMenuOpen(!isMenuOpen)
                }
                className={`p-2 rounded-lg transition-colors ${
                  showLogin || showRegister
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-800"
                }`}
                aria-label="Toggle menu"
                disabled={showLogin || showRegister}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Menu className="w-6 h-6 text-yellow-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Modal (used for logout confirmation, etc.) */}
      {alertConfig && (
        <AlertModal
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          {...alertConfig}
          onConfirm={() => {
            logout();
            setShowAlert(false);
            navigate("/");
          }}
        />
      )}

      {/* Overlay */}
      {isMenuOpen && !showLogin && !showRegister && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-40 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-black ${
          showLogin || showRegister ? "z-40" : "z-50"
        } transform transition-transform duration-300 ease-in-out border-l border-yellow-500/20 ${
          isMenuOpen && !showLogin && !showRegister
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-yellow-500/20">
          <h2 className="text-xl font-semibold text-yellow-400">Menu</h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-yellow-400" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {user?.isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-4 py-3 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors font-medium"
            >
              Admin Dashboard
            </Link>
          )}
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            Home
          </Link>
          <Link
            to="/profile"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            Profile
          </Link>
          <Link
            to="/shop"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            Products
          </Link>
          <Link
            to="/orders"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            Orders
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-yellow-500/20">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-yellow-400">
                      {user.name || "User"}
                    </p>
                    {user.isAdmin && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    {user.email || "user@example.com"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAlertConfig(ALERT_TYPES.LOGOUT_CONFIRM);
                  setShowAlert(true);
                }}
                className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-950/30 rounded-lg transition-colors border border-red-500/30"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => setShowLogin(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-yellow-400 hover:bg-gray-800 rounded-lg transition-colors border border-yellow-500/30"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-medium hover:from-yellow-500 hover:to-yellow-700 rounded-lg transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
