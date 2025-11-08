import React, { useState } from "react";
import { useOrders } from "../../context/OrderContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../modals/AlertModal";

// Orders Page
const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { orders, orderHistory } = useOrders();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const allOrders = [...orders, ...orderHistory].sort((a, b) => {
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
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 mx-auto text-gray-700 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-400 mb-4">No orders yet</p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
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
                        className="text-yellow-400 hover:text-yellow-300 transition"
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
                      const title = item.title || item.name || item.name;
                      const qty = item.quantity || item.qty || 1;
                      const price =
                        item.price || item.unitPrice || item.totalPrice || 0;
                      const img = item.image || item.images?.[0] || "";
                      return (
                        <div key={idx} className="flex gap-4 items-center">
                          <img
                            src={img}
                            alt={title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{title}</h4>
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
                        className="flex-1 bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
                      >
                        Track Order
                      </button>
                      <button
                        onClick={() => {
                          order.items.forEach((i) => {
                            const product = {
                              id: i.id || i.productId || i.sku || Date.now(),
                              title: i.title || i.name || "Product",
                              price: i.price || i.unitPrice || 0,
                              image: i.image || (i.images && i.images[0]) || "",
                            };
                            const qty = i.quantity || i.qty || 1;
                            for (let t = 0; t < qty; t++) addToCart(product, 1);
                          });
                          navigate("/cart");
                        }}
                        className="flex-1 bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition"
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
