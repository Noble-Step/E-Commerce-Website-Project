import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getBreadcrumbName = (path) => {
    const nameMap = {
      home: "Home",
      shop: "Shop",
      product: "Product Detail",
      cart: "Shopping Cart",
      checkout: "Checkout",
      orders: "My Orders",
      profile: "My Profile",
      about: "About Us",
      contact: "Contact Us",
      admin: "Admin",
    };
    return nameMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  let breadcrumbItems = pathnames.filter((name, index) => {
    if (pathnames[0] === "product" && index === 1) {
      return false;
    }
    return !name.match(/^\d+$/);
  });

  if (pathnames[0] === "product" && pathnames.length > 1) {
    if (!breadcrumbItems.includes("shop")) {
      breadcrumbItems = ["shop", ...breadcrumbItems];
    }
  }

  if (pathnames[0] === "checkout") {
    if (!breadcrumbItems.includes("cart")) {
      breadcrumbItems = ["cart", ...breadcrumbItems];
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol
        className="flex items-center gap-2 text-sm text-gray-400 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        role="list"
      >
        <li>
          <Link
            to="/"
            className="hover:text-yellow-400 transition-colors flex items-center min-h-[44px] min-w-[44px] px-2 gap-2"
            aria-label="Home"
          >
            <Home className="w-4 h-4 text-yellow-400" aria-hidden="true" />
            <span className="text-yellow-400">Home</span>
          </Link>
        </li>
        {breadcrumbItems.map((name, index) => {
          let routeTo;
          if (name === "shop" && pathnames[0] === "product") {
            routeTo = "/shop";
          } else if (name === "cart" && pathnames[0] === "checkout") {
            routeTo = "/cart";
          } else {
            routeTo = `/${breadcrumbItems.slice(0, index + 1).join("/")}`;
          }
          
          const isLast = index === breadcrumbItems.length - 1;
          const displayName = getBreadcrumbName(name);

          return (
            <li key={`${routeTo}-${index}`} className="flex items-center gap-2">
              <ChevronRight
                className="w-4 h-4 text-gray-600"
                aria-hidden="true"
              />
              {isLast ? (
                <span
                  className="text-yellow-400 font-medium"
                  aria-current="page"
                >
                  {displayName}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="hover:text-yellow-400 transition-colors min-h-[44px] flex items-center"
                >
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
