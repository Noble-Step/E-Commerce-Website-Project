import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { usePageTitle } from "../../utils/usePageTitle";
import { getImageUrl } from "../../utils/sanitize";
import AlertModal, { ALERT_TYPES } from "../../modals/AlertModal";
import { CartItemSkeleton } from "../../components/LoadingSkeleton";

// Cart Page
const CartPage = () => {
  usePageTitle("Shopping Cart");
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = subtotal * 0.1; // 10% discount
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="bg-black text-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold uppercase mb-2">
            Your Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-gray-400 mb-4">Your cart is empty</p>
            <p className="text-gray-500 text-sm mb-6">
              Add items to your cart to get started with your shopping.
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const itemName = item.name || item.product?.name || "Product";
                const itemImage =
                  item.image ||
                  item.images?.[0] ||
                  item.product?.images?.[0] ||
                  "";
                return (
                  <div
                    key={item.id}
                    className="bg-gray-900 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6"
                  >
                    <img
                      src={getImageUrl(itemImage)}
                      alt={itemName || "Product image"}
                      className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-xl"
                      loading="lazy"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {itemName}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Size: {item.size} | Color: {item.color}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center bg-black rounded-full"
                          role="group"
                          aria-label={`Quantity for ${itemName}`}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white min-w-[44px] min-h-[44px]"
                            aria-label={`Decrease quantity of ${itemName}`}
                          >
                            -
                          </button>
                          <span
                            className="px-4 text-sm"
                            aria-live="polite"
                            aria-atomic="true"
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white min-w-[44px] min-h-[44px]"
                            aria-label={`Increase quantity of ${itemName}`}
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold">
                            ${item.price * item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              removeFromCart(item.id);
                              setAlertConfig(ALERT_TYPES.REMOVED_FROM_CART);
                              setShowAlert(true);
                            }}
                            className="text-red-500 hover:text-red-400 p-2 min-w-[44px] min-h-[44px]"
                            aria-label={`Remove ${itemName} from cart`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Discount (10%)</span>
                    <span className="text-green-400">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery Fee</span>
                    <span className="text-white">
                      ${deliveryFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-700 pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-yellow-400">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-500 transition min-h-[44px]"
                  aria-label={`Proceed to checkout with ${
                    cartItems.length
                  } item${cartItems.length !== 1 ? "s" : ""}`}
                >
                  Proceed to Checkout
                </button>

                <div className="mt-4 p-4 bg-black rounded-lg flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xs text-gray-400">
                    Free shipping on orders over $200
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
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

export default CartPage;
