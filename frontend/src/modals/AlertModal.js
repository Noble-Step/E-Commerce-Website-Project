import React from "react";
import Modal from "../components/Modal";

// Alert Modal
const AlertModal = ({
  isOpen,
  onClose,
  type = "info",
  title,
  message,
  onConfirm,
  showCancel = false,
}) => {
  const alertTypes = {
    success: {
      icon: (
        <svg
          className="w-16 h-16 text-green-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "bg-green-900/20",
      borderColor: "border-green-400",
      titleColor: "text-green-400",
      buttonColor: "bg-green-400 hover:bg-green-500",
    },
    error: {
      icon: (
        <svg
          className="w-16 h-16 text-red-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "bg-red-900/20",
      borderColor: "border-red-400",
      titleColor: "text-red-400",
      buttonColor: "bg-red-400 hover:bg-red-500",
    },
    warning: {
      icon: (
        <svg
          className="w-16 h-16 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "bg-yellow-900/20",
      borderColor: "border-yellow-400",
      titleColor: "text-yellow-400",
      buttonColor: "bg-yellow-400 hover:bg-yellow-500 text-black",
    },
    info: {
      icon: (
        <svg
          className="w-16 h-16 text-blue-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-400",
      titleColor: "text-blue-400",
      buttonColor: "bg-blue-400 hover:bg-blue-500",
    },
    confirm: {
      icon: (
        <svg
          className="w-16 h-16 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "bg-yellow-900/20",
      borderColor: "border-yellow-400",
      titleColor: "text-yellow-400",
      buttonColor: "bg-yellow-400 hover:bg-yellow-500 text-black",
    },
  };

  const config = alertTypes[type] || alertTypes.info;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className={`bg-black border-2 ${config.borderColor} rounded-2xl shadow-2xl relative animate-fadeIn max-w-md w-full`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div
            className={`${config.bgColor} rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center`}
          >
            {config.icon}
          </div>

          {/* Title */}
          <h2 className={`text-2xl font-bold mb-4 ${config.titleColor}`}>
            {title}
          </h2>

          {/* Message */}
          <p className="text-gray-300 mb-8 leading-relaxed">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            {showCancel && (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`px-6 py-3 rounded-lg font-semibold transition ${config.buttonColor}`}
            >
              {showCancel ? "Confirm" : "OK"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const ALERT_TYPES = {
  // Authentication Alerts
  LOGIN_REQUIRED: {
    type: "warning",
    title: "Login Required",
    message:
      "You need to be logged in to perform this action. Please log in or create an account to continue.",
  },
  LOGIN_SUCCESS: {
    type: "success",
    title: "Login Successful",
    message: "Welcome back! You have successfully logged in to your account.",
  },
  LOGOUT_SUCCESS: {
    type: "success",
    title: "Logged Out",
    message: "You have been successfully logged out. See you again soon!",
  },
  REGISTRATION_SUCCESS: {
    type: "success",
    title: "Account Created",
    message:
      "Your account has been successfully created. Please log in to continue.",
  },

  // Cart Alerts
  ADDED_TO_CART: {
    type: "success",
    title: "Added to Cart",
    message: "The item has been successfully added to your shopping cart.",
  },
  REMOVED_FROM_CART: {
    type: "info",
    title: "Item Removed",
    message: "The item has been removed from your cart.",
  },
  CART_UPDATED: {
    type: "success",
    title: "Cart Updated",
    message: "Your cart has been successfully updated.",
  },
  EMPTY_CART: {
    type: "warning",
    title: "Empty Cart",
    message:
      "Your cart is empty. Please add some items before proceeding to checkout.",
  },

  // Checkout Alerts
  ORDER_SUCCESS: {
    type: "success",
    title: "Order Placed Successfully",
    message:
      "Thank you for your purchase! Your order has been placed and you will receive a confirmation email shortly.",
  },
  ORDER_FAILED: {
    type: "error",
    title: "Order Failed",
    message:
      "We couldn't process your order. Please check your payment information and try again.",
  },
  PAYMENT_PROCESSING: {
    type: "info",
    title: "Processing Payment",
    message:
      "Please wait while we process your payment. Do not close this window.",
  },

  // Error Alerts
  NETWORK_ERROR: {
    type: "error",
    title: "Network Error",
    message:
      "Unable to connect to the server. Please check your internet connection and try again.",
  },
  SOMETHING_WRONG: {
    type: "error",
    title: "Something Went Wrong",
    message:
      "An unexpected error occurred. Please try again later or contact support if the problem persists.",
  },
  INVALID_INPUT: {
    type: "error",
    title: "Invalid Input",
    message:
      "Please check your input and make sure all required fields are filled correctly.",
  },

  // Confirmation Alerts
  DELETE_CONFIRM: {
    type: "confirm",
    title: "Confirm Delete",
    message:
      "Are you sure you want to delete this item? This action cannot be undone.",
    showCancel: true,
  },
  CLEAR_CART_CONFIRM: {
    type: "confirm",
    title: "Clear Cart",
    message: "Are you sure you want to remove all items from your cart?",
    showCancel: true,
  },
  LOGOUT_CONFIRM: {
    type: "confirm",
    title: "Confirm Logout",
    message: "Are you sure you want to log out of your account?",
    showCancel: true,
  },

  // Product Alerts
  OUT_OF_STOCK: {
    type: "warning",
    title: "Out of Stock",
    message:
      "Sorry, this item is currently out of stock. Please check back later or choose a different product.",
  },
  LOW_STOCK: {
    type: "warning",
    title: "Low Stock",
    message: "Only a few items left in stock! Order soon to avoid missing out.",
  },

  // Profile Alerts
  PROFILE_UPDATED: {
    type: "success",
    title: "Profile Updated",
    message: "Your profile information has been successfully updated.",
  },
  PASSWORD_CHANGED: {
    type: "success",
    title: "Password Changed",
    message:
      "Your password has been successfully changed. Please use your new password for future logins.",
  },
};

export default AlertModal;
