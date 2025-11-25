import React, { useState, useCallback } from "react";
import Modal from "../components/Modal";

import { useUser } from "../context/UserContext";

// Register Modal
const RegisterModal = ({ isOpen, onClose, onSwitchToLogin, onRegister }) => {
  const { register } = useUser();
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleClose = useCallback(() => {
    onClose();
    setFName("");
    setLName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({
      fName: "",
      lName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {
      fName: "",
      lName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let hasError = false;

    if (!fName.trim()) {
      newErrors.fName = "First name is required.";
      hasError = true;
    }

    if (!lName.trim()) {
      newErrors.lName = "Last name is required.";
      hasError = true;
    }

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
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      hasError = true;
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
      hasError = true;
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number.";
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const userObj = {
      id: Date.now(),
      firstName: fName.trim(),
      lastName: lName.trim(),
      email: email.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      await register({ ...userObj, password });
      onRegister?.({ user: userObj });
      handleClose();
      onSwitchToLogin();
    } catch (err) {
      const errorMessage = err.message || "";
      
      const validationErrors = err.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        const fieldErrors = {};
        validationErrors.forEach((error) => {
          const field = error.field;
          if (field === "firstName") {
            fieldErrors.fName = error.message;
          } else if (field === "lastName") {
            fieldErrors.lName = error.message;
          } else if (field === "email") {
            fieldErrors.email = error.message;
          } else if (field === "password") {
            fieldErrors.password = error.message;
          }
        });
        
        if (Object.keys(fieldErrors).length > 0) {
          setErrors({ ...errors, ...fieldErrors });
          return;
        }
      }
      
      if (errorMessage.includes("email") || errorMessage.includes("exists") || errorMessage.includes("registered")) {
        setErrors({
          ...errors,
          email: "This email address is already registered. Please use a different email or try logging in instead.",
        });
      } else if (errorMessage.includes("network") || errorMessage.includes("connection")) {
        setErrors({
          ...errors,
          email: "Unable to connect to the server. Please check your internet connection and try again.",
        });
      } else {
        setErrors({
          ...errors,
          email: errorMessage || "Registration failed. Please try again or contact support if the problem persists.",
        });
      }
    }
  };

  const handleSwitchToLogin = useCallback(() => {
    setFName("");
    setLName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({
      fName: "",
      lName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    onSwitchToLogin && onSwitchToLogin();
  }, [onSwitchToLogin]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="bg-black border-2 border-yellow-400 rounded-2xl shadow-2xl relative animate-fadeIn">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Close register modal"
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

        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-yellow-400">
            Register
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="register-fname" className="block text-sm font-medium text-yellow-400 mb-2">
                  First Name
                </label>
                <input
                  id="register-fname"
                  type="text"
                  value={fName}
                  onChange={(e) => {
                    setFName(e.target.value);
                    if (errors.fName) setErrors({ ...errors, fName: "" });
                  }}
                  className={`w-full px-4 py-3 bg-gray-900 text-white border rounded-lg focus:outline-none transition ${
                    errors.fName
                      ? "border-red-500"
                      : "border-gray-700 focus:border-yellow-400"
                  }`}
                  placeholder="John"
                  aria-invalid={errors.fName ? "true" : "false"}
                  aria-describedby={errors.fName ? "register-fname-error" : undefined}
                />
                {errors.fName && (
                  <p id="register-fname-error" className="text-red-500 text-sm mt-1" role="alert">{errors.fName}</p>
                )}
              </div>

              <div>
                <label htmlFor="register-lname" className="block text-sm font-medium text-yellow-400 mb-2">
                  Last Name
                </label>
                <input
                  id="register-lname"
                  type="text"
                  value={lName}
                  onChange={(e) => {
                    setLName(e.target.value);
                    if (errors.lName) setErrors({ ...errors, lName: "" });
                  }}
                  className={`w-full px-4 py-3 bg-gray-900 text-white border rounded-lg focus:outline-none transition ${
                    errors.lName
                      ? "border-red-500"
                      : "border-gray-700 focus:border-yellow-400"
                  }`}
                  placeholder="Doe"
                  aria-invalid={errors.lName ? "true" : "false"}
                  aria-describedby={errors.lName ? "register-lname-error" : undefined}
                />
                {errors.lName && (
                  <p id="register-lname-error" className="text-red-500 text-sm mt-1" role="alert">{errors.lName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-yellow-400 mb-2">
                Email
              </label>
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                    if (value.trim() && !isValidEmail(value.trim())) {
                      setErrors({ ...errors, email: "Please enter a valid email address." });
                    } else {
                      setErrors({ ...errors, email: "" });
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    if (value && !isValidEmail(value)) {
                      setErrors({ ...errors, email: "Please enter a valid email address." });
                    }
                  }}
                  className={`w-full px-4 py-3 bg-gray-900 text-white border rounded-lg focus:outline-none transition ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-700 focus:border-yellow-400"
                  }`}
                  placeholder="your@email.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "register-email-error" : undefined}
                />
              {errors.email && (
                <p id="register-email-error" className="text-red-500 text-sm mt-1" role="alert">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-yellow-400 mb-2">
                Password
              </label>
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);
                    if (value && value.length < 6) {
                      setErrors({ ...errors, password: "Password must be at least 6 characters." });
                    } else {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value && value.length < 6) {
                      setErrors({ ...errors, password: "Password must be at least 6 characters." });
                    }
                  }}
                  className={`w-full px-4 py-3 bg-gray-900 text-white border rounded-lg focus:outline-none transition ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-700 focus:border-yellow-400"
                  }`}
                  placeholder="••••••••"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "register-password-error" : undefined}
                />
              {errors.password && (
                <p id="register-password-error" className="text-red-500 text-sm mt-1" role="alert">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="block text-sm font-medium text-yellow-400 mb-2">
                Confirm Password
              </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setConfirmPassword(value);
                    if (value && password && value !== password) {
                      setErrors({ ...errors, confirmPassword: "Passwords do not match." });
                    } else {
                      setErrors({ ...errors, confirmPassword: "" });
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value && password && value !== password) {
                      setErrors({ ...errors, confirmPassword: "Passwords do not match." });
                    }
                  }}
                  className={`w-full px-4 py-3 bg-gray-900 text-white border rounded-lg focus:outline-none transition ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-700 focus:border-yellow-400"
                  }`}
                  placeholder="••••••••"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={errors.confirmPassword ? "register-confirm-password-error" : undefined}
                />
              {errors.confirmPassword && (
                <p id="register-confirm-password-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
            >
              Create Account
            </button>
          </div>

          <p className="text-sm text-center mt-6 text-gray-400">
            Already have an account?{" "}
            <button
              onClick={handleSwitchToLogin}
              className="text-yellow-400 font-medium hover:text-yellow-300 transition"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};
export default RegisterModal;
