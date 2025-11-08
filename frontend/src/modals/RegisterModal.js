import React, { useState } from "react";
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
      onSwitchToLogin();
    } catch (err) {
      setErrors({
        ...errors,
        email:
          err.message === "Email already exists"
            ? "This email is already registered"
            : "",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-black border-2 border-yellow-400 rounded-2xl shadow-2xl relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
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
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">
            Register
          </h2>

          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  First Name
                </label>
                <input
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
                />
                {errors.fName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  Last Name
                </label>
                <input
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
                />
                {errors.lName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-yellow-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`w-full px-4 py-3 bg-gray-900 text-white border rounded-lg focus:outline-none transition ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-700 focus:border-yellow-400"
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-yellow-400 mb-2">
                Password
              </label>
              <input
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
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-yellow-400 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: "" });
                }}
                className={`w-full px-4 py-3 bg-gray-900 text-white border rounded-lg focus:outline-none transition ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-700 focus:border-yellow-400"
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Create Account Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
            >
              Create Account
            </button>
          </div>

          {/* Switch to Login */}
          <p className="text-sm text-center mt-6 text-gray-400">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
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
