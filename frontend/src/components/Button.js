import React from "react";

/**
 * Button Component
 * Provides reusable button styles for consistency across the app
 */
const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-yellow-400 text-black hover:bg-yellow-500 focus:ring-yellow-400",
    secondary:
      "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-600 border border-gray-700",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 border border-red-600/30",
    ghost:
      "text-yellow-400 hover:bg-gray-800 border border-yellow-500/30 focus:ring-yellow-400",
    outline:
      "border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 focus:ring-yellow-400",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    full: "w-full py-3 text-base",
  };

  const buttonClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={buttonClass} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
