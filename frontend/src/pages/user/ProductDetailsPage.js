import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { ALERT_TYPES } from "../../modals/AlertModal";
import AlertModal from '../../modals/AlertModal';

const ProductDetailsPage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct } = useProducts();
  const { addToCart } = useCart();
  const { user } = useUser();

  const [selectedSize, setSelectedSize] = useState("Medium");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("product-details");
  const [selectedImage, setSelectedImage] = useState("");

  const product = getProduct(Number(id));
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || product.image || "");
    }
  }, [product]);

  console.log("Loaded product:", product);

  if (!product) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-400">Product not found</h2>
          <p className="text-gray-400 mt-2">The product you are looking for does not exist.</p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg"
          >
            Back to shop
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      setAlertConfig(ALERT_TYPES.LOGIN_REQUIRED);
      setShowAlert(true);
      return;
    } else {
      addToCart({ ...product }, quantity);
      setAlertConfig(ALERT_TYPES.ADDED_TO_CART);
      setShowAlert(true);
      return;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen px-4 md:px-10 py-10">
  {/* --- Back Button --- */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/shop")}
          className="text-gray-400 hover:text-yellow-400 transition flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Shop
        </button>
      </div>

  {/* --- Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
  {/* --- Image Gallery (Left) --- */}
        <div className="flex lg:flex-row flex-col gap-4">
          {/* --- Thumbnails --- */}
          <div className="flex lg:flex-col flex-row gap-3 lg:w-24">
            {Array.isArray(product.images) && product.images.length > 0 ? (
              product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === img 
                      ? 'border-yellow-400 ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900' 
                      : 'border-gray-700 hover:border-yellow-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No images available.</p>
            )}
          </div>

          {/* --- Main Image --- */}
          <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden">
            <img
              src={selectedImage || product.images?.[0] || product.image || "/placeholder.png"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

  {/* --- Product Info (Right) --- */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
            {product.title}
          </h1>

          {/* --- Rating --- */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-400">
              {product.rating ? `${product.rating}/5.0` : "No rating yet"}
            </span>
          </div>

          {/* --- Price --- */}
          <div className="text-3xl font-bold">${product.price}</div>
          <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>

          {/* --- Sizes --- */}
          <div>
            <h3 className="text-sm font-medium mb-3">Choose Size</h3>
            <div className="flex gap-3">
              {["Small", "Medium", "Large"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                    selectedSize === size
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* --- Quantity & Add to Cart --- */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-900 rounded-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition rounded-l-full"
              >
                -
              </button>
              <span className="px-6 text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition rounded-r-full"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-yellow-400 text-black py-3 px-8 rounded-full font-semibold hover:bg-yellow-500 transition"
            >
              Add to Cart
            </button>
            {alertConfig && (
              <AlertModal
                isOpen={showAlert}
                onClose={() => setShowAlert(false)}
                type={alertConfig.type}
                message={alertConfig.message}
              />
            )}
          </div>
        </div>
      </div>

  {/* --- Tabs Section --- */}
      <div className="mt-16 border-t border-gray-800">
        <div className="flex gap-8 border-b border-gray-800">
          {["Product Details", "FAQs", "Rating & Reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"))
              }
              className={`py-4 text-sm font-medium transition relative ${
                activeTab ===
                tab.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
              {activeTab ===
                tab.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"></div>
              )}
            </button>
          ))}
        </div>

  {/* --- Tab Content --- */}
        <div className="py-8">
          {activeTab === "product-details" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Information</h3>
              <p className="text-gray-400 text-sm mb-6">
                {product.infoText || "No additional product info available."}
              </p>
              {Array.isArray(product.details) && product.details.length > 0 ? (
                <ul className="space-y-3">
                  {product.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-gray-400"
                    >
                      <span className="text-yellow-400 mt-1">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No product details available.</p>
              )}
            </div>
          )}

          {activeTab === "faqs" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-800 pb-4">
                  <h4 className="font-semibold text-yellow-400 mb-2">What materials are used in these shoes?</h4>
                  <p className="text-gray-400 text-sm">
                    We use premium materials including calfskin leather, suede, patent leather, and other high-quality materials sourced from ethical suppliers.
                  </p>
                </div>
                <div className="border-b border-gray-800 pb-4">
                  <h4 className="font-semibold text-yellow-400 mb-2">Do you offer free shipping?</h4>
                  <p className="text-gray-400 text-sm">
                    Yes! We offer free shipping on orders over $200. Standard shipping is available for all other orders.
                  </p>
                </div>
                <div className="border-b border-gray-800 pb-4">
                  <h4 className="font-semibold text-yellow-400 mb-2">What is your return policy?</h4>
                  <p className="text-gray-400 text-sm">
                    We offer a 30-day return policy. Items must be unworn and in original packaging. Please contact customer support for returns.
                  </p>
                </div>
                <div className="border-b border-gray-800 pb-4">
                  <h4 className="font-semibold text-yellow-400 mb-2">How do I find my correct size?</h4>
                  <p className="text-gray-400 text-sm">
                    Please refer to our size guide available on each product page. We also offer size consultations via chat or email.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Are the products authentic?</h4>
                  <p className="text-gray-400 text-sm">
                    Absolutely! All our products are 100% authentic and sourced directly from authorized dealers. We guarantee authenticity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rating-reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <button
                  onClick={() => {
                    setAlertConfig({ type: 'info', title: 'Review Feature', message: 'Review submission feature is coming soon! Stay tuned.' });
                    setShowAlert(true);
                  }}
                  className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition text-sm font-semibold"
                >
                  Write a Review
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold">
                        JD
                      </div>
                      <span className="font-semibold">John Doe</span>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                      {/* --- Alert Modal --- */}
                      {alertConfig && (
                        <AlertModal
                          isOpen={showAlert}
                          onClose={() => setShowAlert(false)}
                          {...alertConfig}
                          onConfirm={() => {
                            if (alertConfig && alertConfig.title === ALERT_TYPES.LOGIN_REQUIRED.title) {
                              navigate('/login');
                            }
                          }}
                        />
                      )}
                  </div>
                  <p className="text-gray-300 text-sm">Excellent quality! These shoes are comfortable and stylish. Highly recommend!</p>
                  <p className="text-gray-500 text-xs mt-2">Verified Purchase • 2 days ago</p>
                </div>

                <div className="border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        SM
                      </div>
                      <span className="font-semibold">Sarah Miller</span>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">Perfect fit and amazing craftsmanship. Worth every penny!</p>
                  <p className="text-gray-500 text-xs mt-2">Verified Purchase • 1 week ago</p>
                </div>

                <div className="border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        MC
                      </div>
                      <span className="font-semibold">Mike Chen</span>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(4)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                      <svg className="w-4 h-4 fill-gray-700" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">Great shoes, fast shipping. The quality is outstanding for the price.</p>
                  <p className="text-gray-500 text-xs mt-2">Verified Purchase • 2 weeks ago</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
