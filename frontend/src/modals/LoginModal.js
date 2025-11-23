import React, { useState, useCallback, useEffect } from "react";
import Modal from "../components/Modal";

import { useUser } from "../context/UserContext";

// Login Modal
const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onLogin }) => {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setErrors({ email: "", password: "" });
      setGeneralError("");
    }
  }, [isOpen]);

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = { email: "", password: "" };
    let hasError = false;

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      hasError = true;
    } else if (!isValidEmail(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
      hasError = true;
    }

    setErrors(newErrors);
    setGeneralError("");

    if (hasError) return;

    setIsLoading(true);

    try {
      const result = await login({
        email: email.trim(),
        password: password.trim(),
      });

      if (result) {
        onLogin?.({ user: result });
        onClose();
      } else {
        throw new Error("Invalid email or password.");
      }
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      if (err.response?.status === 401) {
        setGeneralError(
          "The email or password you entered is incorrect. Please check your credentials and try again."
        );
      } else if (
        errorMessage.includes("network") ||
        errorMessage.includes("connection")
      ) {
        setGeneralError(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else {
        setGeneralError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    onClose();
    setEmail("");
    setPassword("");
    setErrors({ email: "", password: "" });
    setGeneralError("");
  }, [onClose]);

  // Reset fields when switching to Register
  const handleSwitchToRegister = useCallback(() => {
    setEmail("");
    setPassword("");
    setErrors({ email: "", password: "" });
    setGeneralError("");
    onSwitchToRegister && onSwitchToRegister();
  }, [onSwitchToRegister]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="bg-black border-2 border-yellow-400 rounded-2xl shadow-2xl relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Close login modal"
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
        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-yellow-400">
            Login
          </h2>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-yellow-400 mb-2"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  if (value.trim() && !isValidEmail(value.trim())) {
                    setErrors({
                      ...errors,
                      email: "Please enter a valid email address.",
                    });
                  } else {
                    setErrors({ ...errors, email: "" });
                  }
                }}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (value && !isValidEmail(value)) {
                    setErrors({
                      ...errors,
                      email: "Please enter a valid email address.",
                    });
                  }
                }}
                className={`w-full px-4 py-3 bg-gray-900 text-white border rounded-lg focus:outline-none transition ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-700 focus:border-yellow-400"
                }`}
                placeholder="your@email.com"
                disabled={isLoading}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={
                  errors.email ? "login-email-error" : undefined
                }
              />
              {errors.email && (
                <p
                  id="login-email-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-yellow-400 mb-2"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                className={`w-full px-4 py-3 bg-gray-900 text-white border rounded-lg focus:outline-none transition ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-700 focus:border-yellow-400"
                }`}
                placeholder="••••••••"
                disabled={isLoading}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
                }
              />
              {errors.password && (
                <p
                  id="login-password-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* General Error (e.g., invalid credentials) */}
            {generalError && (
              <p
                className="text-red-500 text-sm text-center"
                role="alert"
                aria-live="polite"
              >
                {generalError}
              </p>
            )}

            {/* Remember + Forgot */}
            {/* <div className="flex items-center justify-between text-sm">
              <label htmlFor="login-remember" className="flex items-center text-gray-400">
                <input
                  id="login-remember"
                  type="checkbox"
                  className="mr-2 accent-yellow-400"
                  disabled={isLoading}
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-yellow-400 hover:text-yellow-300 transition"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div> */}

            {/* Login Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Switch to Register */}
          <p className="text-sm text-center mt-6 text-gray-400">
            Don't have an account?{" "}
            <button
              onClick={handleSwitchToRegister}
              className="text-yellow-400 font-medium hover:text-yellow-300 transition"
              disabled={isLoading}
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
