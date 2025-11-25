import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { ALERT_TYPES } from "../modals/AlertModal";
import AlertModal from "../modals/AlertModal";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";
import { useState } from "react";
import { sanitizeHtml, getImageUrl } from "../utils/sanitize";

// Product Card
const ProductCard = ({
  id,
  image = "https://via.placeholder.com/300x300",
  name = "Product Name",
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCartProduct, setPendingCartProduct] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useUser();

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!user) {
      const product = {
        _id: id,
        id,
        image,
        name,
        description,
        price,
        rating,
      };
      setPendingCartProduct(product);
      setShowLoginModal(true);
      return;
    }

    const product = {
      _id: id,
      id, 
      image,
      name,
      description,
      price,
      rating,
    };

    if (onAddToCart) {
      onAddToCart(product);
      return;
    }

    try {
      await addToCart(product, 1);
      setAlertConfig(ALERT_TYPES.ADDED_TO_CART);
      setShowAlert(true);
    } catch (error) {
      setAlertConfig({
        title: "Error",
        message:
          error.message || "Failed to add product to cart. Please try again.",
        type: "error",
      });
      setShowAlert(true);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-black border border-yellow-600 rounded-2xl shadow-lg overflow-hidden hover:shadow-[0_0_25px_rgba(255,215,0,0.4)] transition-all duration-300 w-full max-w-sm mx-auto cursor-pointer"
    >
      <div className="relative group">
        <img
          src={getImageUrl(image)}
          alt={name || "Product image"}
          className="w-full h-64 object-cover group-hover:opacity-90 transition duration-300"
          loading="lazy"
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

      <div className="p-5">
        <h3 className="text-lg font-semibold text-yellow-400 mb-2 line-clamp-2">
          {name}
        </h3>

        <p
          className="text-gray-300 text-sm mb-4 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
        ></p>

        {rating > 0 && (
          <div
            className="flex items-center mb-3"
            aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}
          >
            <div className="flex text-yellow-400" role="img" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) ? "fill-current" : "fill-gray-700"
                  }`}
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-400" aria-hidden="true">
              ({rating.toFixed(1)})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-yellow-400">
            {currency}
            {price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
            aria-label={`Add ${name} to cart`}
          >
            Add to Cart
          </button>
        </div>
        {alertConfig && (
          <AlertModal
            isOpen={showAlert}
            onClose={() => setShowAlert(false)}
            {...alertConfig}
          />
        )}
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingCartProduct(null);
        }}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
        onLogin={async () => {
          setShowLoginModal(false);
          if (pendingCartProduct) {
            try {
              if (onAddToCart) {
                onAddToCart(pendingCartProduct);
              } else {
                await addToCart(pendingCartProduct, 1);
                setAlertConfig(ALERT_TYPES.ADDED_TO_CART);
                setShowAlert(true);
              }
            } catch (error) {
              setAlertConfig({
                title: "Error",
                message:
                  error.message ||
                  "Failed to add product to cart. Please try again.",
                type: "error",
              });
              setShowAlert(true);
            }
            setPendingCartProduct(null);
          }
        }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => {
          setShowRegisterModal(false);
          setPendingCartProduct(null);
        }}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
        onRegister={async () => {
          setShowRegisterModal(false);
          if (pendingCartProduct) {
            try {
              if (onAddToCart) {
                onAddToCart(pendingCartProduct);
              } else {
                await addToCart(pendingCartProduct, 1);
                setAlertConfig(ALERT_TYPES.ADDED_TO_CART);
                setShowAlert(true);
              }
            } catch (error) {
              setAlertConfig({
                title: "Error",
                message:
                  error.message ||
                  "Failed to add product to cart. Please try again.",
                type: "error",
              });
              setShowAlert(true);
            }
            setPendingCartProduct(null);
          }
        }}
      />
    </div>
  );
};

export default ProductCard;
