import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import AlertModal, { ALERT_TYPES } from "../../modals/AlertModal";

// Checkout Page
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const validateForm = () => {
    if (step === 1) {
      const required = [
        "email",
        "firstName",
        "lastName",
        "address",
        "city",
        "state",
        "zip",
        "phone",
      ];
      const missing = required.filter((field) => !formData[field]);
      if (missing.length > 0) {
        setError("Please fill in all required fields");
        return false;
      }
    } else {
      if (
        !formData.cardNumber ||
        !formData.cardName ||
        !formData.expiry ||
        !formData.cvv
      ) {
        setError("Please fill in all payment information");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    if (step === 1) {
      setStep(2);
    } else {
      createOrder({
        items: cartItems,
        total: cartTotal,
        shipping: formData,
        payment: {
          cardName: formData.cardName,
          last4: formData.cardNumber.slice(-4),
        },
      });
      clearCart();
      setAlertConfig(ALERT_TYPES.ORDER_SUCCESS);
      setShowAlert(true);
    }
  };

  const shippingCost = 15.0;
  const tax = cartTotal * 0.08; // 8% tax
  const orderTotal = cartTotal + shippingCost + tax;

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  const handleAlertConfirm = () => {
    setShowAlert(false);
    navigate("/orders");
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold uppercase mb-2">
            Checkout
          </h1>
          <button
            onClick={() => navigate("/cart")}
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
            Back to Cart
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div
            className={`flex items-center gap-2 ${
              step >= 1 ? "text-yellow-400" : "text-gray-600"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-yellow-400 text-black" : "bg-gray-800"
              }`}
            >
              1
            </div>
            <span className="text-sm hidden md:inline">Shipping</span>
          </div>
          <div
            className={`h-0.5 w-16 ${
              step >= 2 ? "bg-yellow-400" : "bg-gray-800"
            }`}
          ></div>
          <div
            className={`flex items-center gap-2 ${
              step >= 2 ? "text-yellow-400" : "text-gray-600"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-yellow-400 text-black" : "bg-gray-800"
              }`}
            >
              2
            </div>
            <span className="text-sm hidden md:inline">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-2xl p-6 md:p-8">
              {step === 1 ? (
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Shipping Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 text-gray-400">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2 text-gray-400">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-400">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-400">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                        placeholder="123 Main St"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm mb-2 text-gray-400">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-400">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          placeholder="ST"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-400">
                          ZIP
                        </label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          placeholder="12345"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-400">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Payment Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 text-gray-400">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        maxLength={19}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-400">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                        placeholder="JOHN DOE"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2 text-gray-400">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          maxLength={5}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-400">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          maxLength={3}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          placeholder="123"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex items-start gap-3 p-4 bg-black rounded-lg">
                      <svg
                        className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium">Secure Payment</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Your payment information is encrypted and secure
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-yellow-400">
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
              >
                {step === 1 ? "Continue to Payment" : "Place Order"}
              </button>

              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="w-full mt-3 bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition"
                >
                  Back to Shipping
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Alert Modal */}
      {alertConfig && (
        <AlertModal
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          {...alertConfig}
          onConfirm={handleAlertConfirm}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
