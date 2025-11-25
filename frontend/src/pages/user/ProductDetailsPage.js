import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { usePageTitle } from "../../utils/usePageTitle";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { useModal, MODAL_TYPES } from "../../context/ModalContext";
import { ALERT_TYPES } from "../../modals/AlertModal";
import AlertModal from "../../modals/AlertModal";
import { ProductDetailsSkeleton } from "../../components/LoadingSkeleton";
import { sanitizeHtml, getImageUrl } from "../../utils/sanitize";
import API from "../../services/api";

const ProductDetailsPage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, loading } = useProducts();
  const { addToCart } = useCart();
  const { user } = useUser();
  const { openModal } = useModal();

  const product = getProduct(id);
  const productName = product?.name || "Product";

  usePageTitle(product ? productName : "Product Details");

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || product.image || "");
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      const sizes = Array.isArray(product.sizes) ? product.sizes : [];
      if (sizes.length > 0) {
        setSelectedSize((prev) => (sizes.includes(prev) ? prev : sizes[0]));
      } else {
        setSelectedSize((prev) => prev || "");
      }
    }
  }, [product]);

  const productId = useMemo(() => {
    if (product?._id) return String(product._id);
    if (product?.id) return String(product.id);
    if (id && id.length === 24) return String(id);
    return "";
  }, [product, id]);

  const fetchReviews = useCallback(async () => {
    if (!productId) {
      setReviews([]);
      return;
    }
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const { data } = await API.get(`/reviews/product/${productId}`);
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (error) {
      setReviewsError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load reviews right now."
      );
    } finally {
      setReviewsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const getReviewerName = (reviewUser) => {
    if (!reviewUser) return "Anonymous";
    const first = reviewUser.firstName || "";
    const last = reviewUser.lastName || "";
    if (first || last) {
      return `${first} ${last}`.trim();
    }
    return reviewUser.name || "Anonymous";
  };

  const getReviewerInitials = (reviewUser) => {
    const name = getReviewerName(reviewUser);
    const initials = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
    return initials || "U";
  };

  const formatReviewDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Just now";
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const avatarColorClasses = [
    "from-yellow-400 to-yellow-600 text-black",
    "from-blue-400 to-blue-600 text-white",
    "from-purple-400 to-purple-600 text-white",
    "from-pink-400 to-red-500 text-white",
  ];

  const openAlert = (config) => {
    setAlertConfig(config);
    setShowAlert(true);
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-400">
            Product not found
          </h2>
          <p className="text-gray-400 mt-2">
            The product you are looking for does not exist.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg min-h-[44px]"
            aria-label="Go back to shop"
          >
            Back to shop
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      openModal(MODAL_TYPES.LOGIN_MODAL);
      return;
    }

    try {
      await addToCart({ ...product }, quantity, selectedSize);
      openAlert(ALERT_TYPES.ADDED_TO_CART);
    } catch (error) {
      openAlert({
        type: "error",
        title: "Error",
        message:
          error.message || "Failed to add product to cart. Please try again.",
      });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openModal(MODAL_TYPES.LOGIN_MODAL);
      return;
    }

    if (!productId || productId.length !== 24) {
      openAlert({
        type: "error",
        title: "Unable to submit review",
        message:
          "This product cannot be reviewed right now. Please try again later.",
      });
      return;
    }

    if (!rating || reviewTitle.trim().length < 3 || review.trim().length < 10) {
      openAlert({
        type: "error",
        title: "Incomplete review",
        message:
          "Please provide a rating, a title (min 3 characters), and a detailed comment (min 10 characters).",
      });
      return;
    }

    try {
      setSubmittingReview(true);
      await API.post(`/reviews`, {
        productId,
        rating,
        title: reviewTitle.trim(),
        comment: review.trim(),
      });

      setRating(0);
      setReview("");
      setReviewTitle("");
      await fetchReviews();

      openAlert({
        type: "success",
        title: "Review submitted",
        message: "Thanks for sharing your experience!",
      });
    } catch (error) {
      openAlert({
        type: "error",
        title: "Review failed",
        message:
          error.response?.data?.message ||
          "We couldn't submit your review right now. Please try again.",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const displayRating = product.ratings?.average ?? product.rating;

  return (
    <>
      <div className="bg-black text-white min-h-screen px-4 sm:px-6 md:px-10 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-16">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex lg:flex-col flex-row gap-3 lg:w-24 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {Array.isArray(product.images) && product.images.length > 0 ? (
                product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition min-w-[44px] min-h-[44px] ${
                      selectedImage === img
                        ? "border-yellow-400 ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900"
                        : "border-gray-700 hover:border-yellow-400"
                    }`}
                    aria-label={`View ${productName} image ${idx + 1}`}
                    aria-pressed={selectedImage === img}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${productName} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No images available.</p>
              )}
            </div>

            <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden aspect-square lg:aspect-auto">
              <img
                src={
                  getImageUrl(
                    selectedImage || product.images?.[0] || product.image
                  ) || "/placeholder.png"
                }
                alt={productName || "Product image"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide">
              {productName}
            </h1>

            <div
              className="flex items-center gap-2"
              aria-label={`Product rating: ${
                displayRating
                  ? `${displayRating} out of 5 stars`
                  : "No rating yet"
              }`}
            >
              <div
                className="flex text-yellow-400"
                role="img"
                aria-hidden="true"
              >
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-400" aria-hidden="true">
                {displayRating ? `${displayRating}/5.0` : "No rating yet"}
              </span>
            </div>

            <div className="text-3xl font-bold">${product.price}</div>
            <p
              className="text-gray-400 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(product.description),
              }}
            ></p>

            <div>
              <h3 className="text-sm font-medium mb-3">Choose Size</h3>
              <div
                className="flex gap-3 flex-wrap"
                role="radiogroup"
                aria-label="Product size selection"
              >
                {Array.isArray(product.sizes) && product.sizes.length > 0
                  ? product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition min-h-[44px] ${
                          selectedSize === size
                            ? "bg-yellow-400 text-black"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                        role="radio"
                        aria-checked={selectedSize === size}
                        aria-label={`Size ${size}`}
                      >
                        {size}
                      </button>
                    ))
                  :
                    ["Small", "Medium", "Large"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition min-h-[44px] ${
                          selectedSize === size
                            ? "bg-yellow-400 text-black"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                        role="radio"
                        aria-checked={selectedSize === size}
                        aria-label={`Size ${size}`}
                      >
                        {size}
                      </button>
                    ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="flex items-center bg-gray-900 rounded-full"
                role="group"
                aria-label="Product quantity"
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition rounded-l-full min-w-[44px] min-h-[44px]"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span
                  className="px-6 text-sm font-medium"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition rounded-r-full min-w-[44px] min-h-[44px]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-yellow-400 text-black py-3 px-8 rounded-full font-semibold hover:bg-yellow-500 transition min-h-[44px]"
                aria-label={`Add ${productName} to cart`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <section className="mt-10 md:mt-16 border-t border-gray-800">
          <div className="py-8 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Rating & Reviews</h3>
                <p className="text-sm text-gray-400">
                  {reviews.length
                    ? `${reviews.length} review${reviews.length > 1 ? "s" : ""}`
                    : "No reviews yet"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex text-yellow-400" aria-hidden="true">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`w-5 h-5 ${
                        displayRating && index < Math.round(displayRating)
                          ? "fill-current"
                          : "text-gray-700"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-300">
                  {displayRating ? `${displayRating}/5` : "Not rated yet"}
                </span>
              </div>
            </div>

            <form
              onSubmit={handleReviewSubmit}
              className="space-y-4 bg-gray-900/40 p-4 md:p-6 rounded-2xl border border-gray-800"
            >
              <div className="flex flex-col gap-2">
                <h4 className="font-semibold text-yellow-400">
                  Write a Review
                </h4>
                <div
                  className="flex items-center gap-2"
                  role="radiogroup"
                  aria-label="Rating selection"
                >
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      className={`w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center transition ${
                        i < rating
                          ? "bg-yellow-400 text-black"
                          : "text-gray-400 hover:text-white"
                      }`}
                      aria-label={`Rate ${i + 1} star${i !== 0 ? "s" : ""}`}
                      role="radio"
                      aria-checked={i < rating}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="review-title" className="sr-only">
                  Review title
                </label>
                <input
                  id="review-title"
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:outline-none focus:border-yellow-400"
                  placeholder="Give your review a title"
                  aria-label="Review title"
                />
              </div>
              <div>
                <label htmlFor="review-text" className="sr-only">
                  Review text
                </label>
                <textarea
                  id="review-text"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="4"
                  className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:outline-none focus:border-yellow-400"
                  placeholder="Share the details of your experience (min 10 characters)"
                  aria-label="Write your review"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold min-h-[44px] ${
                    submittingReview
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-yellow-400 text-black hover:bg-yellow-500"
                  }`}
                  aria-label="Submit review"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {reviewsLoading && (
                <p className="text-gray-400 text-sm">Loading reviews...</p>
              )}

              {reviewsError && !reviewsLoading && (
                <div className="bg-red-900/20 border border-red-500 rounded-xl p-4 flex flex-col gap-3">
                  <p className="text-red-300 text-sm">{reviewsError}</p>
                  <button
                    onClick={fetchReviews}
                    className="self-start px-4 py-2 text-sm bg-red-500 text-black rounded-lg hover:bg-red-400 min-h-[40px]"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!reviewsLoading && !reviewsError && reviews.length === 0 && (
                <p className="text-gray-500 text-sm">
                  Be the first to review this product.
                </p>
              )}

              {!reviewsLoading &&
                !reviewsError &&
                reviews.map((entry, index) => {
                  const reviewerName = getReviewerName(entry.user);
                  const reviewerInitials = getReviewerInitials(entry.user);
                  const colorClass =
                    avatarColorClasses[index % avatarColorClasses.length];
                  return (
                    <article
                      key={entry._id || `${reviewerName}-${index}`}
                      className="border border-gray-800 rounded-2xl p-4 md:p-6 bg-gray-900/40"
                      aria-label={`Review by ${reviewerName}`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center font-bold`}
                          >
                            {reviewerInitials}
                          </div>
                          <div>
                            <p className="font-semibold">{reviewerName}</p>
                            <p className="text-xs text-gray-500">
                              {entry.isVerifiedPurchase
                                ? "Verified Purchase"
                                : "Customer Review"}{" "}
                              • {formatReviewDate(entry.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-yellow-400">
                          <div className="flex" aria-hidden="true">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < entry.rating
                                    ? "fill-current"
                                    : "text-gray-600"
                                }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-300">
                            {entry.rating}/5
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <h4 className="text-base font-semibold text-white">
                          {entry.title}
                        </h4>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {entry.comment}
                        </p>
                      </div>
                    </article>
                  );
                })}
            </div>
          </div>
        </section>
      </div>

      {alertConfig && (
        <AlertModal
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          {...alertConfig}
        />
      )}
    </>
  );
};

export default ProductDetailsPage;
