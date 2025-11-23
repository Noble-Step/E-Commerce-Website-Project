import React from "react";
import { Link } from "react-router-dom";

/**
 * NavLink Component
 * Reusable navigation link with consistent styling
 */
const NavLink = ({
  to,
  children,
  onClick,
  className = "",
  variant = "default",
}) => {
  const variants = {
    default:
      "flex items-center px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-gray-800 rounded-lg transition-colors",
    admin:
      "flex items-center px-4 py-3 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors font-medium",
  };

  const linkClass = `${variants[variant]} ${className}`;

  return (
    <Link to={to} onClick={onClick} className={linkClass}>
      {children}
    </Link>
  );
};

export default NavLink;
