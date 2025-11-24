import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet, Building2, Banknote } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { useOrders } from "../../context/OrderContext";
import { usePageTitle } from "../../utils/usePageTitle";
import AlertModal, { ALERT_TYPES } from "../../modals/AlertModal";

// Checkout Page
const CheckoutPage = () => {
  usePageTitle("Checkout");
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useUser();
  const { createOrder } = useOrders();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, failed
  const [paymentMethod, setPaymentMethod] = useState("card"); // card, digitalWallet, bankTransfer, cashOnDelivery
  const [selectedPaymentTab, setSelectedPaymentTab] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    // Card fields
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    // Digital wallet fields
    walletType: "",
    walletEmail: "",
    // Bank transfer fields
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    transactionId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear errors when user starts typing
    if (error) {
      setError("");
    }
    if (validationErrors.length) {
      setValidationErrors([]);
    }
    // Real-time validation for email
    if (name === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      setError("Please enter a valid email address");
    }
    // Real-time validation for ZIP
    if (name === "zip" && value && !/^\d+$/.test(value)) {
      setError("Please enter a valid ZIP code (numbers only)");
    }
  };

  useEffect(() => {
    // Do not auto-redirect to cart while a success modal is open
    if (cartItems.length === 0 && !showAlert) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      email: prev.email || user.email || "",
      firstName: prev.firstName || user.firstName || "",
      lastName: prev.lastName || user.lastName || "",
      address: prev.address || user.address?.street || "",
      city: prev.city || user.address?.city || "",
      state: prev.state || user.address?.state || "",
      zip: prev.zip || user.address?.zip || "",
      phone: prev.phone || user.phone || "",
    }));
  }, [user]);

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
        const fieldNames = {
          email: "Email address",
          firstName: "First name",
          lastName: "Last name",
          address: "Street address",
          city: "City",
          state: "State",
          zip: "ZIP code",
          phone: "Phone number",
        };
        const missingFields = missing.map((f) => fieldNames[f] || f).join(", ");
        setError(
          `Please fill in the following required fields: ${missingFields}`
        );
        return false;
      }
      // Validate email format
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        setError("Please enter a valid email address");
        return false;
      }
      // Validate ZIP code format (basic)
      if (formData.zip && !/^\d+$/.test(formData.zip)) {
        setError("Please enter a valid ZIP code (numbers only)");
        return false;
      }
    } else {
      // Validate based on selected payment method
      const missing = [];

      if (paymentMethod === "card") {
        if (!formData.cardNumber) missing.push("card number");
        if (!formData.cardName) missing.push("cardholder name");
        if (!formData.expiry) missing.push("expiry date");
        if (!formData.cvv) missing.push("CVV");

        // Validate card number format (basic)
        if (
          formData.cardNumber &&
          formData.cardNumber.replace(/\s+/g, "").length < 13
        ) {
          setError("Please enter a valid card number");
          return false;
        }

        // Validate expiry format (MM/YY)
        if (formData.expiry && !/^\d{2}\/\d{2}$/.test(formData.expiry)) {
          setError("Please enter expiry date in MM/YY format");
          return false;
        }

        // Validate CVV format (3-4 digits)
        if (formData.cvv && !/^\d{3,4}$/.test(formData.cvv)) {
          setError("Please enter a valid CVV (3-4 digits)");
          return false;
        }
      } else if (paymentMethod === "digitalWallet") {
        if (!formData.walletType) missing.push("wallet type");
        if (!formData.walletEmail) missing.push("email address");

        // Validate email format
        if (
          formData.walletEmail &&
          !/\S+@\S+\.\S+/.test(formData.walletEmail)
        ) {
          setError("Please enter a valid email address");
          return false;
        }
      } else if (paymentMethod === "bankTransfer") {
        if (!formData.bankName) missing.push("bank name");
        if (!formData.accountNumber) missing.push("account number");
        if (!formData.routingNumber) missing.push("routing number");

        // Validate routing number format (9 digits)
        if (formData.routingNumber && !/^\d{9}$/.test(formData.routingNumber)) {
          setError("Routing number must be exactly 9 digits");
          return false;
        }
      }
      // Cash on Delivery: no validation needed

      if (missing.length > 0) {
        setError(
          `Please fill in the following payment fields: ${missing.join(", ")}`
        );
        return false;
      }
    }
    setError("");
    setValidationErrors([]);
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    if (step === 1) {
      setStep(2);
    } else {
      // Set payment processing state
      setPaymentStatus("processing");
      setError("");
      setValidationErrors([]);

      try {
        // Prepare shipping address
        const shippingAddress = {
          street: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip: formData.zip.trim(),
          country: (user?.address?.country || "USA").trim(),
        };

        const shipping = {
          email: formData.email.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip: formData.zip.trim(),
          phone: formData.phone.trim(),
        };

        // Prepare payment details based on selected payment method
        let paymentDetails = {};

        if (paymentMethod === "card") {
          paymentDetails = {
            method: "card",
            cardNumber: formData.cardNumber.replace(/\s+/g, ""),
            cvv: formData.cvv,
            expiry: formData.expiry,
            cardName: formData.cardName,
          };
        } else if (paymentMethod === "digitalWallet") {
          paymentDetails = {
            method: "digitalWallet",
            walletType: formData.walletType,
            walletEmail: formData.walletEmail.trim(),
          };
        } else if (paymentMethod === "bankTransfer") {
          paymentDetails = {
            method: "bankTransfer",
            bankName: formData.bankName.trim(),
            accountNumber: formData.accountNumber.trim(),
            routingNumber: formData.routingNumber.trim(),
            transactionId: formData.transactionId.trim() || undefined,
          };
        } else if (paymentMethod === "cashOnDelivery") {
          paymentDetails = {
            method: "cashOnDelivery",
          };
        }

        // Create order with payment simulation
        const order = await createOrder({
          items: cartItems,
          total: orderTotal,
          shippingAddress,
          paymentDetails,
          shipping,
        });

        // Payment successful - show success modal first, clear cart after user confirms
        setPaymentStatus("success");
        setAlertConfig(ALERT_TYPES.ORDER_SUCCESS);
        setShowAlert(true);
      } catch (err) {
        // Payment failed or order creation failed
        setPaymentStatus("failed");
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Payment processing failed. Please try again.";
        setError(errorMessage);
        setValidationErrors(err.response?.data?.errors || []);
      }
    }
  };

  const shippingCost = 15.0;
  const tax = cartTotal * 0.08; // 8% tax
  const orderTotal = cartTotal + shippingCost + tax;

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  const handleAlertConfirm = async () => {
    // Clear cart now that the user has seen the success modal
    try {
      await clearCart();
    } catch (err) {
      // ignore errors clearing cart
    }
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
        </div>

        {/* Progress Steps */}
        <nav aria-label="Checkout progress" className="mb-8">
          <ol className="flex items-center justify-center gap-4" role="list">
            <li
              className={`flex items-center gap-2 ${
                step >= 1 ? "text-yellow-400" : "text-gray-600"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center min-w-[44px] min-h-[44px] ${
                  step >= 1 ? "bg-yellow-400 text-black" : "bg-gray-800"
                }`}
                aria-current={step === 1 ? "step" : undefined}
              >
                <span className="sr-only">Step</span>
                <span aria-hidden="true">1</span>
              </div>
              <span className="text-sm hidden md:inline">Shipping</span>
            </li>
            <li
              className={`h-0.5 w-16 ${
                step >= 2 ? "bg-yellow-400" : "bg-gray-800"
              }`}
              aria-hidden="true"
            ></li>
            <li
              className={`flex items-center gap-2 ${
                step >= 2 ? "text-yellow-400" : "text-gray-600"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center min-w-[44px] min-h-[44px] ${
                  step >= 2 ? "bg-yellow-400 text-black" : "bg-gray-800"
                }`}
                aria-current={step === 2 ? "step" : undefined}
              >
                <span className="sr-only">Step</span>
                <span aria-hidden="true">2</span>
              </div>
              <span className="text-sm hidden md:inline">Payment</span>
            </li>
          </ol>
        </nav>

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
                      <label
                        htmlFor="checkout-email"
                        className="block text-sm mb-2 text-gray-400"
                      >
                        Email
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                        placeholder="your@email.com"
                        aria-required="true"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="checkout-firstname"
                          className="block text-sm mb-2 text-gray-400"
                        >
                          First Name
                        </label>
                        <input
                          id="checkout-firstname"
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          placeholder="John"
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="checkout-lastname"
                          className="block text-sm mb-2 text-gray-400"
                        >
                          Last Name
                        </label>
                        <input
                          id="checkout-lastname"
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          placeholder="Doe"
                          aria-required="true"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="checkout-address"
                        className="block text-sm mb-2 text-gray-400"
                      >
                        Address
                      </label>
                      <input
                        id="checkout-address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                        placeholder="123 Main St"
                        aria-required="true"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="checkout-city"
                          className="block text-sm mb-2 text-gray-400"
                        >
                          City
                        </label>
                        <input
                          id="checkout-city"
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          placeholder="City"
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="checkout-state"
                          className="block text-sm mb-2 text-gray-400"
                        >
                          State
                        </label>
                        <input
                          id="checkout-state"
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          placeholder="ST"
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="checkout-zip"
                          className="block text-sm mb-2 text-gray-400"
                        >
                          ZIP
                        </label>
                        <input
                          id="checkout-zip"
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          placeholder="12345"
                          aria-required="true"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="checkout-phone"
                        className="block text-sm mb-2 text-gray-400"
                      >
                        Phone Number
                      </label>
                      <input
                        id="checkout-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                        placeholder="+1 (555) 000-0000"
                        aria-required="true"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Payment Information
                  </h2>

                  {/* Payment Method Tabs */}
                  <div
                    className="mb-6"
                    role="tablist"
                    aria-label="Payment methods"
                  >
                    <div className="flex flex-wrap gap-2 border-b border-gray-700">
                      <button
                        role="tab"
                        aria-selected={selectedPaymentTab === 0}
                        aria-controls="payment-tabpanel-0"
                        id="payment-tab-0"
                        onClick={() => {
                          setSelectedPaymentTab(0);
                          setPaymentMethod("card");
                          setError("");
                        }}
                        className={`flex items-center gap-2 px-4 py-3 min-h-[44px] font-medium transition-colors border-b-2 ${
                          selectedPaymentTab === 0
                            ? "border-yellow-400 text-yellow-400"
                            : "border-transparent text-gray-400 hover:text-yellow-400"
                        }`}
                      >
                        <CreditCard className="w-5 h-5" aria-hidden="true" />
                        <span className="hidden sm:inline">
                          Credit/Debit Card
                        </span>
                        <span className="sm:hidden">Card</span>
                      </button>
                      <button
                        role="tab"
                        aria-selected={selectedPaymentTab === 1}
                        aria-controls="payment-tabpanel-1"
                        id="payment-tab-1"
                        onClick={() => {
                          setSelectedPaymentTab(1);
                          setPaymentMethod("digitalWallet");
                          setError("");
                        }}
                        className={`flex items-center gap-2 px-4 py-3 min-h-[44px] font-medium transition-colors border-b-2 ${
                          selectedPaymentTab === 1
                            ? "border-yellow-400 text-yellow-400"
                            : "border-transparent text-gray-400 hover:text-yellow-400"
                        }`}
                      >
                        <Wallet className="w-5 h-5" aria-hidden="true" />
                        <span className="hidden sm:inline">
                          Digital Wallets
                        </span>
                        <span className="sm:hidden">Wallets</span>
                      </button>
                      <button
                        role="tab"
                        aria-selected={selectedPaymentTab === 2}
                        aria-controls="payment-tabpanel-2"
                        id="payment-tab-2"
                        onClick={() => {
                          setSelectedPaymentTab(2);
                          setPaymentMethod("bankTransfer");
                          setError("");
                        }}
                        className={`flex items-center gap-2 px-4 py-3 min-h-[44px] font-medium transition-colors border-b-2 ${
                          selectedPaymentTab === 2
                            ? "border-yellow-400 text-yellow-400"
                            : "border-transparent text-gray-400 hover:text-yellow-400"
                        }`}
                      >
                        <Building2 className="w-5 h-5" aria-hidden="true" />
                        <span className="hidden sm:inline">Bank Transfer</span>
                        <span className="sm:hidden">Bank</span>
                      </button>
                      <button
                        role="tab"
                        aria-selected={selectedPaymentTab === 3}
                        aria-controls="payment-tabpanel-3"
                        id="payment-tab-3"
                        onClick={() => {
                          setSelectedPaymentTab(3);
                          setPaymentMethod("cashOnDelivery");
                          setError("");
                        }}
                        className={`flex items-center gap-2 px-4 py-3 min-h-[44px] font-medium transition-colors border-b-2 ${
                          selectedPaymentTab === 3
                            ? "border-yellow-400 text-yellow-400"
                            : "border-transparent text-gray-400 hover:text-yellow-400"
                        }`}
                      >
                        <Banknote className="w-5 h-5" aria-hidden="true" />
                        <span className="hidden sm:inline">
                          Cash on Delivery
                        </span>
                        <span className="sm:hidden">COD</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Forms */}
                  <div className="space-y-4">
                    {/* Tab 1: Credit/Debit Card */}
                    {selectedPaymentTab === 0 && (
                      <div
                        role="tabpanel"
                        id="payment-tabpanel-0"
                        aria-labelledby="payment-tab-0"
                      >
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="checkout-cardnumber"
                              className="block text-sm mb-2 text-gray-400"
                            >
                              Card Number
                            </label>
                            <input
                              id="checkout-cardnumber"
                              type="text"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              maxLength={19}
                              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                              placeholder="1234 5678 9012 3456"
                              aria-required="true"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="checkout-cardname"
                              className="block text-sm mb-2 text-gray-400"
                            >
                              Cardholder Name
                            </label>
                            <input
                              id="checkout-cardname"
                              type="text"
                              name="cardName"
                              value={formData.cardName}
                              onChange={handleInputChange}
                              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                              placeholder="JOHN DOE"
                              aria-required="true"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="checkout-expiry"
                                className="block text-sm mb-2 text-gray-400"
                              >
                                Expiry Date
                              </label>
                              <input
                                id="checkout-expiry"
                                type="text"
                                name="expiry"
                                value={formData.expiry}
                                onChange={handleInputChange}
                                maxLength={5}
                                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                                placeholder="MM/YY"
                                aria-required="true"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="checkout-cvv"
                                className="block text-sm mb-2 text-gray-400"
                              >
                                CVV
                              </label>
                              <input
                                id="checkout-cvv"
                                type="text"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                maxLength={3}
                                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                                placeholder="123"
                                aria-required="true"
                              />
                            </div>
                          </div>

                          <div className="mt-6 flex items-start gap-3 p-4 bg-black rounded-lg">
                            <svg
                              className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div>
                              <p className="text-sm font-medium">
                                Secure Payment
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Your payment information is encrypted and secure
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Digital Wallets */}
                    {selectedPaymentTab === 1 && (
                      <div
                        role="tabpanel"
                        id="payment-tabpanel-1"
                        aria-labelledby="payment-tab-1"
                      >
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="checkout-wallet-type"
                              className="block text-sm mb-2 text-gray-400"
                            >
                              Wallet Type
                            </label>
                            <select
                              id="checkout-wallet-type"
                              name="walletType"
                              value={formData.walletType}
                              onChange={handleInputChange}
                              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                              aria-required="true"
                            >
                              <option value="">Select wallet</option>
                              <option value="paypal">PayPal</option>
                              <option value="googlepay">Google Pay</option>
                              <option value="applepay">Apple Pay</option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="checkout-wallet-email"
                              className="block text-sm mb-2 text-gray-400"
                            >
                              Email Address
                            </label>
                            <input
                              id="checkout-wallet-email"
                              type="email"
                              name="walletEmail"
                              value={formData.walletEmail}
                              onChange={handleInputChange}
                              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                              placeholder="your@email.com"
                              aria-required="true"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab 3: Bank Transfer */}
                    {selectedPaymentTab === 2 && (
                      <div
                        role="tabpanel"
                        id="payment-tabpanel-2"
                        aria-labelledby="payment-tab-2"
                      >
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="checkout-bank-name"
                              className="block text-sm mb-2 text-gray-400"
                            >
                              Bank Name
                            </label>
                            <input
                              id="checkout-bank-name"
                              type="text"
                              name="bankName"
                              value={formData.bankName}
                              onChange={handleInputChange}
                              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                              placeholder="Bank Name"
                              aria-required="true"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="checkout-account-number"
                              className="block text-sm mb-2 text-gray-400"
                            >
                              Account Number
                            </label>
                            <input
                              id="checkout-account-number"
                              type="text"
                              name="accountNumber"
                              value={formData.accountNumber}
                              onChange={handleInputChange}
                              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                              placeholder="Account Number"
                              aria-required="true"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="checkout-routing-number"
                              className="block text-sm mb-2 text-gray-400"
                            >
                              Routing Number
                            </label>
                            <input
                              id="checkout-routing-number"
                              type="text"
                              name="routingNumber"
                              value={formData.routingNumber}
                              onChange={handleInputChange}
                              maxLength={9}
                              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                              placeholder="9-digit routing number"
                              aria-required="true"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="checkout-transaction-id"
                              className="block text-sm mb-2 text-gray-400"
                            >
                              Transaction ID (Optional)
                            </label>
                            <input
                              id="checkout-transaction-id"
                              type="text"
                              name="transactionId"
                              value={formData.transactionId}
                              onChange={handleInputChange}
                              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                              placeholder="Transaction ID if available"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab 4: Cash on Delivery */}
                    {selectedPaymentTab === 3 && (
                      <div
                        role="tabpanel"
                        id="payment-tabpanel-3"
                        aria-labelledby="payment-tab-3"
                      >
                        <div className="p-6 bg-black rounded-lg border border-yellow-500/20">
                          <div className="flex items-start gap-3">
                            <Banknote
                              className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <div>
                              <p className="text-lg font-semibold text-yellow-400 mb-2">
                                Cash on Delivery
                              </p>
                              <p className="text-sm text-gray-400 mb-4">
                                Payment will be collected upon delivery. Please
                                have the exact amount ready.
                              </p>
                              <p className="text-xl font-bold text-yellow-400">
                                Total: ${orderTotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
                <div
                  className="mb-4 p-3 bg-red-900 text-red-200 rounded-lg text-sm space-y-2"
                  role="alert"
                  aria-live="polite"
                >
                  <p>{error}</p>
                  {validationErrors.length > 0 && (
                    <ul className="list-disc list-inside text-red-100/90 space-y-1">
                      {validationErrors.map((validationError) => (
                        <li
                          key={`${validationError.field}-${validationError.message}`}
                        >
                          {validationError.message}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {paymentStatus === "processing" && (
                <div
                  className="mb-4 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg"
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                    <p className="text-yellow-400 text-sm font-medium">
                      Processing payment...
                    </p>
                  </div>
                </div>
              )}

              {paymentStatus === "success" && (
                <div
                  className="mb-4 p-4 bg-green-900/30 border border-green-700 rounded-lg"
                  role="alert"
                  aria-live="polite"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-green-400 text-sm font-medium">
                      Payment successful! Redirecting...
                    </p>
                  </div>
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
                disabled={paymentStatus === "processing"}
                className="w-full bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-500 transition min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                aria-label={
                  step === 1 ? "Continue to payment step" : "Place order"
                }
              >
                {paymentStatus === "processing" ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    <span>Processing...</span>
                  </>
                ) : step === 1 ? (
                  "Continue to Payment"
                ) : (
                  "Place Order"
                )}
              </button>

              {step === 2 && paymentStatus !== "processing" && (
                <button
                  onClick={() => {
                    setStep(1);
                    setPaymentStatus("idle");
                    setError("");
                  }}
                  className="w-full mt-3 bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition min-h-[44px]"
                  aria-label="Go back to shipping information"
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
