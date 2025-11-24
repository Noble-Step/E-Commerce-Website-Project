import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePageTitle } from "../../utils/usePageTitle";
import { getImageUrl } from "../../utils/sanitize";
import API from "../../services/api";
import { ProductCardSkeleton } from "../../components/LoadingSkeleton";
import shoeImage from "../../assets/shoe.png";
import loafers from "../../assets/loafers.png";
import derby from "../../assets/derby.png";
import oxford from "../../assets/oxford.png";
import heels from "../../assets/heels.png";

// Home Page
export default function Home() {
  usePageTitle("Home");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newsletterError, setNewsletterError] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loadingTopRated, setLoadingTopRated] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    const fetchTopRated = async () => {
      setLoadingTopRated(true);
      try {
        const response = await API.get("/products?sortBy=rating&limit=3");
        setTopRatedProducts(response.data.products || response.data || []);
      } catch (error) {
        console.error("Failed to fetch top-rated products:", error);
        setTopRatedProducts([]);
      } finally {
        setLoadingTopRated(false);
      }
    };
    fetchTopRated();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await API.get("/reviews/recent?limit=3");
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setNewsletterError("");

    if (!email.trim()) {
      setNewsletterError(
        "Please enter your email address to subscribe to our newsletter"
      );
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setNewsletterError(
        "Please enter a valid email address (e.g., yourname@example.com)"
      );
      return;
    }

    console.log("Newsletter subscription:", email);
    setNewsletterSuccess(true);
    setEmail("");

    setTimeout(() => {
      setNewsletterSuccess(false);
    }, 5000);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400">
            ★
          </span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="text-gray-500">
            ☆
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-400">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  const renderReviewStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < rating ? "text-yellow-400" : "text-gray-500"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-black text-white flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 md:px-10 lg:px-20 py-10 md:py-20 flex-1">
        {/* Left side */}
        <div className="max-w-xl space-y-4 md:space-y-6 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            FIND SHOES THAT MATCHES YOUR STYLE
          </h1>
          <p className="text-sm sm:text-base text-gray-400 px-4 md:px-0">
            Browse through our diverse range of meticulously crafted footwear,
            from elegant dress shoes to high-performance athletic wear, designed
            to elevate your every step.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full hover:bg-yellow-400 transition text-sm sm:text-base"
          >
            Shop Now
          </Link>

          <div className="flex justify-between border-t border-gray-700 pt-4 md:pt-6 mt-6 md:mt-8 px-4 md:px-0">
            <div className="text-center">
              <p className="text-lg sm:text-xl font-semibold text-yellow-500">
                200+
              </p>
              <p className="text-xs sm:text-sm text-gray-400">
                International Brands
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-semibold text-yellow-500">
                2,000+
              </p>
              <p className="text-xs sm:text-sm text-gray-400">
                High-Quality Products
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-semibold text-yellow-500">
                30,000+
              </p>
              <p className="text-xs sm:text-sm text-gray-400">
                Happy Customers
              </p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="relative mt-4 md:mt-0 w-full md:w-auto flex justify-center">
          <img
            src={shoeImage}
            alt="Elegant premium shoe showcasing Noble Step's quality craftsmanship"
            className="w-[280px] sm:w-[350px] md:w-[450px] rounded-3xl"
            loading="eager"
          />
          <span className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-yellow-500 text-black text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">
            Elegant
          </span>
        </div>
      </main>

      {/* Top Selling Section */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-20 py-10 md:py-16 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 md:mb-10 text-yellow-500">
          TOP SELLING
        </h2>

        {loadingTopRated ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[...Array(3)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : topRatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {topRatedProducts.slice(0, 3).map((product) => {
              const productId = product._id || product.id;
              const productName = product.name || "Product";
              const mainImage =
                Array.isArray(product.images) && product.images.length > 0
                  ? product.images[0]
                  : product.image || "";
              const displayRating =
                product.ratings?.average ?? product.rating ?? 0;
              const productPrice = product.price || 0;

              return (
                <div
                  key={productId}
                  onClick={() => navigate(`/product/${productId}`)}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500 transition cursor-pointer"
                >
                  <img
                    src={getImageUrl(mainImage)}
                    alt={productName}
                    className="w-full h-60 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4 text-left">
                    <h3 className="font-medium line-clamp-2">{productName}</h3>
                    <div className="text-yellow-400 text-sm mt-1">
                      {renderStars(displayRating)}
                    </div>
                    <p className="mt-2 font-semibold text-yellow-500">
                      ${productPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">
              No top-rated products available at the moment.
            </p>
          </div>
        )}
      </section>

      {/* Customer Testimonials */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-20 pb-10 md:pb-20 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 md:mb-10 text-yellow-500">
          OUR HAPPY CUSTOMERS
        </h2>

        {reviewsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="h-20 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {reviews.map((review) => {
              const reviewerName = review.user
                ? `${review.user.firstName || ""} ${
                    review.user.lastName || ""
                  }`.trim() || "Anonymous"
                : "Anonymous";
              const reviewDate = review.createdAt
                ? new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "";
              const reviewRating = review.rating || 0;
              const reviewComment = review.comment || review.title || "";

              return (
                <div
                  key={review._id || review.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-left"
                >
                  <div className="text-yellow-400 text-lg mb-2">
                    {renderReviewStars(reviewRating)}
                  </div>
                  <p className="italic text-gray-300 mb-4 line-clamp-4">
                    "{reviewComment}"
                  </p>
                  <div className="mt-4">
                    <p className="font-semibold text-yellow-500">
                      {reviewerName}
                    </p>
                    {reviewDate && (
                      <p className="text-sm text-gray-500 mt-1">{reviewDate}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">
              No customer reviews available at the moment.
            </p>
          </div>
        )}
      </section>

      {/* Browse Section */}
      <section className="flex flex-col items-center py-8 md:py-12 px-4 sm:px-6 md:px-20">
        <h2 className="w-full text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide bg-gradient-to-r from-gray-200 to-gray-400 text-transparent bg-clip-text uppercase mb-6 md:mb-8 border border-gray-600 rounded-full px-4 sm:px-6 md:px-8 py-2 md:py-3 text-center">
          Browse by Shoe Styles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
          {/* Loafers */}
          <div
            onClick={() => navigate("/shop?category=Loafers")}
            className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
          >
            <img
              src={loafers}
              alt="Browse loafers collection"
              className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
            <div className="absolute bottom-4 left-4 text-lg font-semibold text-yellow-400 bg-black/50 px-2 py-1 rounded">
              Loafers
            </div>
          </div>

          {/* Derby */}
          <div
            onClick={() => navigate("/shop?category=Derby")}
            className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
          >
            <img
              src={derby}
              alt="Browse derby shoes collection"
              className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
            <div className="absolute bottom-4 left-4 text-lg font-semibold text-yellow-400 bg-black/50 px-2 py-1 rounded">
              Derby
            </div>
          </div>

          {/* Oxford */}
          <div
            onClick={() => navigate("/shop?category=Oxford")}
            className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
          >
            <img
              src={oxford}
              alt="Browse oxford shoes collection"
              className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
            <div className="absolute bottom-4 left-4 text-lg font-semibold text-yellow-400 bg-black/50 px-2 py-1 rounded">
              Oxford
            </div>
          </div>

          {/* Heels */}
          <div
            onClick={() => navigate("/shop?category=Heels")}
            className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
          >
            <img
              src={heels}
              alt="Browse heels collection"
              className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
            <div className="absolute bottom-4 left-4 text-lg font-semibold text-yellow-400 bg-black/50 px-2 py-1 rounded">
              Heels
            </div>
          </div>
        </div>
      </section>

      {/* Brand Banner Section */}
      <section className="bg-[#d4af37] py-3 md:py-4 flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 text-black font-medium tracking-wide text-xs sm:text-sm md:text-base px-4">
        {/* <span
          onClick={() => navigate("/shop?brand=versace")}
          className="hover:underline cursor-pointer"
        >
          VERSACE
        </span>
        <span
          onClick={() => navigate("/shop?brand=zara")}
          className="hover:underline cursor-pointer"
        >
          ZARA
        </span>
        <span
          onClick={() => navigate("/shop?brand=gucci")}
          className="hover:underline cursor-pointer"
        >
          GUCCI
        </span>
        <span
          onClick={() => navigate("/shop?brand=prada")}
          className="hover:underline cursor-pointer"
        >
          PRADA
        </span>
        <span
          onClick={() => navigate("/shop?brand=calvin-klein")}
          className="hover:underline cursor-pointer"
        >
          Calvin Klein
        </span> */}
      </section>

      {/* Newsletter Section */}
      <section className="bg-black text-white flex justify-center py-8 md:py-12 px-4">
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-10 bg-[#111] rounded-2xl shadow-md p-6 md:p-8 w-full max-w-4xl">
          <div className="flex items-center justify-center text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-semibold">
              STAY UP TO DATE ABOUT OUR LATEST OFFERS
            </h2>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col gap-4 w-full md:w-auto"
            aria-label="Newsletter subscription form"
          >
            <div className="relative">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address for newsletter subscription
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setNewsletterError("");
                  setNewsletterSuccess(false);
                }}
                placeholder="Enter your email address"
                className={`px-4 py-3 rounded-full w-full text-black outline-none focus:ring-2 ${
                  newsletterError
                    ? "focus:ring-red-500 border-2 border-red-500"
                    : "focus:ring-[#d4af37]"
                }`}
                aria-invalid={newsletterError ? "true" : "false"}
                aria-describedby={
                  newsletterError
                    ? "newsletter-error"
                    : newsletterSuccess
                    ? "newsletter-success"
                    : undefined
                }
              />
              {newsletterError && (
                <p
                  id="newsletter-error"
                  className="text-red-400 text-xs mt-1 ml-2"
                  role="alert"
                >
                  {newsletterError}
                </p>
              )}
              {newsletterSuccess && (
                <p
                  id="newsletter-success"
                  className="text-green-400 text-xs mt-1 ml-2"
                  role="status"
                  aria-live="polite"
                >
                  Successfully subscribed! Thank you.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-white text-black font-medium rounded-full px-6 py-3 hover:bg-[#d4af37] hover:text-white transition-all duration-200"
            >
              Subscribe to Newsletter
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
