import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ModalProvider, useModal, MODAL_TYPES } from "./context/ModalContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext";
import { UserProvider } from "./context/UserContext";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import AdminDataBoundary from "./components/AdminDataBoundary";
import Breadcrumbs from "./components/Breadcrumbs";
import ScrollToTop from "./components/ScrollToTop";

// Modals
import LoginModal from "./modals/LoginModal";
import RegisterModal from "./modals/RegisterModal";
import AlertModal from "./modals/AlertModal";

// Pages - User
const HomePage = lazy(() => import("./pages/user/HomePage"));
const AboutPage = lazy(() => import("./pages/user/AboutPage"));
const ContactPage = lazy(() => import("./pages/user/ContactPage"));
const ShopPage = lazy(() => import("./pages/user/ShopPage"));
const ProductDetailsPage = lazy(() => import("./pages/user/ProductDetailsPage"));
const CartPage = lazy(() => import("./pages/user/CartPage"));
const CheckoutPage = lazy(() => import("./pages/user/CheckoutPage"));
const OrdersPage = lazy(() => import("./pages/user/OrdersPage"));
const ProfilePage = lazy(() => import("./pages/user/ProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Pages - Admin
const AdminDashboard = lazy(() => import("./pages/admin/DashboardPage"));
const AdminProducts = lazy(() => import("./pages/admin/ProductsPage"));
const AdminUsers = lazy(() => import("./pages/admin/UsersPage"));
const AdminOrders = lazy(() => import("./pages/admin/OrdersListPage"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="bg-black text-white min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

// ModalRoot Component
function ModalRoot() {
  const { isOpen, modalType, closeModal, openModal, modalProps } = useModal();

  const handleSwitchToRegister = () => openModal(MODAL_TYPES.REGISTER_MODAL);
  const handleSwitchToLogin = () => openModal(MODAL_TYPES.LOGIN_MODAL);

  const handleLogin = (data) => {
    if (data?.user) {
    }
  };

  return (
    <>
      <LoginModal
        isOpen={isOpen && modalType === MODAL_TYPES.LOGIN_MODAL}
        onClose={closeModal}
        onSwitchToRegister={handleSwitchToRegister}
        onLogin={handleLogin}
      />
      <RegisterModal
        isOpen={isOpen && modalType === MODAL_TYPES.REGISTER_MODAL}
        onClose={closeModal}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <AlertModal
        isOpen={isOpen && modalType === MODAL_TYPES.ALERT_MODAL}
        onClose={closeModal}
        {...modalProps}
      />
    </>
  );
}

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <ModalProvider>
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-yellow-400 focus:text-black focus:font-semibold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Skip to main content
                </a>
                <ScrollToTop />
                <Header />
                <ModalRoot />
                <main id="main-content">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/product/:id" element={<ProductDetailsPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/profile" element={<ProfilePage />} />

                      <Route
                        path="/admin"
                        element={
                          <AdminRoute>
                            <AdminDataBoundary>
                              <AdminDashboard />
                            </AdminDataBoundary>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/products"
                        element={
                          <AdminRoute>
                            <AdminDataBoundary>
                              <AdminProducts />
                            </AdminDataBoundary>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/users"
                        element={
                          <AdminRoute>
                            <AdminDataBoundary>
                              <AdminUsers />
                            </AdminDataBoundary>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/orders"
                        element={
                          <AdminRoute>
                            <AdminDataBoundary>
                              <AdminOrders />
                            </AdminDataBoundary>
                          </AdminRoute>
                        }
                      />

                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </ModalProvider>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
