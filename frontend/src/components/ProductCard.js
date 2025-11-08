import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { ALERT_TYPES } from "../modals/AlertModal";
import AlertModal from "../modals/AlertModal";
import { useState } from "react";

// Product Card
const ProductCard = ({
  id,
  image = "https://via.placeholder.com/300x300",
  title = "Product Name",
  description = "Product description goes here",
  price = 0,
  currency = "$",
  rating = 0,
  badge,
  discount,
  onAddToCart,
  onClick,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useUser();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const product = {
      id: id || Date.now(),
      image,
      title,
      description,
      price,
      rating,
    };

    if (!user) {
      setAlertConfig(ALERT_TYPES.LOGIN_REQUIRED);
      setShowAlert(true);
      return;
    }

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1);
    }
    setAlertConfig(ALERT_TYPES.ADDED_TO_CART);
    setShowAlert(true);
  };

  return (
    <div
      onClick={onClick}
      className="bg-black border border-yellow-600 rounded-2xl shadow-lg overflow-hidden hover:shadow-[0_0_25px_rgba(255,215,0,0.4)] transition-all duration-300 max-w-sm cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative group">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover group-hover:opacity-90 transition duration-300"
        />
        {badge && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-yellow-400 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{description}</p>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) ? "fill-current" : "fill-gray-700"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-400">
              ({rating.toFixed(1)})
            </span>
          </div>
        )}

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-yellow-400">
            {currency}
            {price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
        {/* Alert Modal */}
        {alertConfig && (
          <AlertModal
            isOpen={showAlert}
            onClose={() => setShowAlert(false)}
            {...alertConfig}
            onConfirm={() => {
              if (
                alertConfig &&
                alertConfig.title === ALERT_TYPES.LOGIN_REQUIRED.title
              ) {
                navigate("/login");
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
