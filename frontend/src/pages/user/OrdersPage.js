import React, { useState } from "react";
import { useOrders } from "../../context/OrderContext";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../utils/usePageTitle";
import { getImageUrl } from "../../utils/sanitize";
import AlertModal from "../../modals/AlertModal";

// Orders Page
const OrdersPage = () => {
  usePageTitle("My Orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { orders, orderHistory } = useOrders();
  const { addToCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  // Filter orders to only show the current user's orders
  const currentUserId = user?._id || user?.id;
  const filteredOrders = [...orders, ...orderHistory].filter((order) => {
    if (!currentUserId) return false;
    const orderUserId =
      order.user?._id ||
      order.user?.id ||
      (typeof order.user === "string" ? order.user : null);
    return String(orderUserId) === String(currentUserId);
  });

  const allOrders = filteredOrders.sort((a, b) => {
    const ta = new Date(a.createdAt || a.date || 0).getTime();
    const tb = new Date(b.createdAt || b.date || 0).getTime();
    return tb - ta;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-400";
      case "In Transit":
        return "text-blue-400";
      case "Processing":
        return "text-yellow-400";
      case "Cancelled":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-400/10";
      case "In Transit":
        return "bg-blue-400/10";
      case "Processing":
        return "bg-yellow-400/10";
      case "Cancelled":
        return "bg-red-400/10";
      default:
        return "bg-gray-400/10";
    }
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  return (
    <div className="bg-black text-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold uppercase mb-2">
            My Orders
          </h1>
          <button
            onClick={() => navigate("/profile")}
            className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Profile
          </button>
        </div>

        {allOrders.length === 0 ? (
          <div className="text-center py-16" role="status" aria-live="polite">
            <svg
              className="w-24 h-24 mx-auto text-gray-700 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-400 mb-2">
              You haven't placed any orders yet.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Browse our collection and find your perfect pair of shoes to get
              started!
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition min-h-[44px]"
              aria-label="Go to shop to start shopping"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {allOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-900 rounded-2xl overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-800">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{order.id}</h3>
                      <p className="text-sm text-gray-400">{order.date}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBg(
                          order.status
                        )} ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                      <button
                        onClick={() =>
                          setSelectedOrder(
                            selectedOrder === order.id ? null : order.id
                          )
                        }
                        className="text-yellow-400 hover:text-yellow-300 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={
                          selectedOrder === order.id
                            ? "Collapse order details"
                            : "Expand order details"
                        }
                        aria-expanded={selectedOrder === order.id}
                      >
                        {selectedOrder === order.id ? (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items - Collapsible */}
                {selectedOrder === order.id && (
                  <div className="p-6 space-y-4">
                    {order.items.map((item, idx) => {
                      const name = item.name || item.product?.name || "Product";
                      const qty = item.quantity || item.qty || 1;
                      const price =
                        item.price || item.unitPrice || item.totalPrice || 0;
                      const img =
                        item.image ||
                        item.images?.[0] ||
                        item.product?.images?.[0] ||
                        "";
                      return (
                        <div key={idx} className="flex gap-4 items-center">
                          <img
                            src={getImageUrl(img)}
                            alt={name || "Product image"}
                            className="w-20 h-20 object-cover rounded-lg"
                            loading="lazy"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{name}</h4>
                            <p className="text-sm text-gray-400">
                              Quantity: {qty}
                            </p>
                          </div>
                          <p className="font-bold">
                            ${(price * qty).toFixed(2)}
                          </p>
                        </div>
                      );
                    })}

                    <div className="border-t border-gray-800 pt-4 mt-4 flex justify-between items-center">
                      <span className="text-gray-400">Total</span>
                      <span className="text-2xl font-bold text-yellow-400">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => {
                          setAlertConfig({
                            type: "info",
                            title: "Order Tracking",
                            message:
                              "Order tracking feature will be available soon. Please contact support for tracking information.",
                          });
                          setShowAlert(true);
                        }}
                        className="flex-1 bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-500 transition min-h-[44px]"
                        aria-label={`Track order ${order.id}`}
                      >
                        Track Order
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            // Process all items sequentially to avoid race conditions
                            for (const i of order.items) {
                              const product = {
                                _id: i.id || i.productId || i.sku || Date.now(),
                                id: i.id || i.productId || i.sku || Date.now(),
                                name: i.name || i.product?.name || "Product",
                                price: i.price || i.unitPrice || 0,
                                image:
                                  i.image ||
                                  (i.images && i.images[0]) ||
                                  i.product?.images?.[0] ||
                                  "",
                              };
                              const qty = i.quantity || i.qty || 1;
                              for (let t = 0; t < qty; t++) {
                                await addToCart(product, 1);
                              }
                            }
                            navigate("/cart");
                          } catch (error) {
                            console.error(
                              "Failed to add products to cart:",
                              error
                            );
                            // Error handling can be added here (e.g., show error toast)
                            // Still navigate to cart to show partial results
                            navigate("/cart");
                          }
                        }}
                        className="flex-1 bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition min-h-[44px]"
                        aria-label={`Order again: ${order.id}`}
                      >
                        Order Again
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Summary when Collapsed */}
                {selectedOrder !== order.id && (
                  <div className="p-6 pt-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </p>
                      <p className="font-bold text-yellow-400">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      {/* Alert Modal */}
      {alertConfig && (
        <AlertModal
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          {...alertConfig}
        />
      )}
    </div>
  );
};

export default OrdersPage;
