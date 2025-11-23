import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogIn, UserPlus } from "lucide-react";
import { ALERT_TYPES } from "../modals/AlertModal";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import { useModal, MODAL_TYPES } from "../context/ModalContext";
import Button from "./Button";
import NavLink from "./NavLink";
import Breadcrumbs from "./Breadcrumbs";
import logo from "../assets/logo.jpg";

const Header = () => {
  const { user, logout } = useUser();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openModal } = useModal();
  const navigate = useNavigate();

  const handleCartClick = () => {
    if (!user) {
      openModal(MODAL_TYPES.LOGIN_MODAL);
      return;
    }
    navigate("/cart");
  };

  return (
    <div className="bg-black sticky top-0 z-50">
      <header className="bg-black border-b border-yellow-500 relative z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4 gap-2 sm:gap-4">
            {/* Logo and Brand - Always visible */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                <img src={logo} alt="Noble Step" className="w-full h-full object-contain" />
              </div> 
              <span className="text-base sm:text-xl font-semibold text-yellow-400 whitespace-nowrap">
                Noble Step
              </span>
            </Link>

            {/* Desktop Navigation Bar (lg and above) */}
            <nav className="hidden lg:flex items-center gap-2 xl:gap-4" aria-label="Main navigation">
              <NavLink to="/" className="whitespace-nowrap text-sm xl:text-base">
                Home
              </NavLink>
              <NavLink to="/shop" className="whitespace-nowrap text-sm xl:text-base">
                Products
              </NavLink>
              <NavLink to="/orders" className="whitespace-nowrap text-sm xl:text-base">
                Orders
              </NavLink>
              <NavLink to="/about" className="whitespace-nowrap text-sm xl:text-base">
                About
              </NavLink>
              <NavLink to="/contact" className="whitespace-nowrap text-sm xl:text-base">
                Contact
              </NavLink>
              {user?.isAdmin && (
                <NavLink to="/admin" variant="admin" className="whitespace-nowrap text-sm xl:text-base">
                  Admin Dashboard
                </NavLink>
              )}
            </nav>

            {/* Right Side Actions - Compact on mobile */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Login/Register or Profile Button */}
              {user ? (
                <button
                  onClick={() => navigate("/profile")}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  aria-label="Profile"
                  title="Profile"
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </button>
              ) : (
                <>
                  {/* Show Login icon on small screens, text on larger */}
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => openModal(MODAL_TYPES.LOGIN_MODAL)}
                    className="hidden md:flex items-center justify-center gap-2 px-3 py-1.5 text-sm"
                    aria-label="Open login modal"
                  >
                    <LogIn className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden lg:inline">Login</span>
                  </Button>
                  <button
                    onClick={() => openModal(MODAL_TYPES.LOGIN_MODAL)}
                    className="md:hidden p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                    aria-label="Login"
                  >
                    <LogIn className="w-5 h-5 text-yellow-400" />
                  </button>
                  
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => openModal(MODAL_TYPES.REGISTER_MODAL)}
                    className="hidden sm:flex items-center justify-center gap-2 px-3 py-1.5 text-sm whitespace-nowrap"
                    aria-label="Open registration modal"
                  >
                    <span className="hidden lg:inline">Register</span>
                    <span className="lg:hidden">Sign Up</span>
                  </Button>
                </>
              )}

              {/* Cart Button */}
              <button
                onClick={handleCartClick}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-800 transition-colors relative"
                aria-label={`Shopping cart${
                  cartItems.length > 0
                    ? `, ${cartItems.length} item${cartItems.length !== 1 ? "s" : ""}`
                    : ", empty"
                }`}
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" aria-hidden="true" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItems.length > 99 ? "99+" : cartItems.length}
                  </span>
                )}
              </button>

              {/* Burger Menu Button (Mobile and Tablet) */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 rounded-lg transition-colors hover:bg-gray-800"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        <Breadcrumbs />
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-40 transition-opacity lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar Menu */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-[85vw] sm:w-80 bg-black z-50 transform transition-transform duration-300 ease-in-out border-l border-yellow-500/20 lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-yellow-500/20">
          <h2 className="text-lg sm:text-xl font-semibold text-yellow-400">Menu</h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
          </button>
        </div>

        <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }} aria-label="Main navigation">
          {user?.isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              variant="admin"
            >
              Admin Dashboard
            </NavLink>
          )}
          <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/profile" onClick={() => setIsMenuOpen(false)}>
            Profile
          </NavLink>
          <NavLink to="/shop" onClick={() => setIsMenuOpen(false)}>
            Products
          </NavLink>
          <NavLink to="/orders" onClick={() => setIsMenuOpen(false)}>
            Orders
          </NavLink>
          <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
            Contact
          </NavLink>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-yellow-500/20 bg-black">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-yellow-400 text-sm sm:text-base truncate">
                      {user.name || "User"}
                    </p>
                    {user.isAdmin && (
                      <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full whitespace-nowrap">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">
                    {user.email || "user@example.com"}
                  </p>
                </div>
              </div>
              <Button
                variant="danger"
                size="full"
                onClick={() => {
                  openModal(MODAL_TYPES.ALERT_MODAL, {
                    ...ALERT_TYPES.LOGOUT_CONFIRM,
                    onConfirm: () => {
                      logout();
                      navigate("/");
                    },
                  });
                }}
                className="text-sm sm:text-base"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="full"
                onClick={() => {
                  openModal(MODAL_TYPES.LOGIN_MODAL);
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 text-sm sm:text-base"
                aria-label="Open login modal"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Login
              </Button>
              <Button
                variant="primary"
                size="full"
                onClick={() => {
                  openModal(MODAL_TYPES.REGISTER_MODAL);
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 text-sm sm:text-base"
                aria-label="Open registration modal"
              >
                <UserPlus className="w-4 h-4" aria-hidden="true" />
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;