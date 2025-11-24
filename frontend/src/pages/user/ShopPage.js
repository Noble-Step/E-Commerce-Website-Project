import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePageTitle } from "../../utils/usePageTitle";
import { useUser } from "../../context/UserContext";
import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";
import ProductCard from "../../components/ProductCard";
import LoginModal from "../../modals/LoginModal";
import { ProductCardSkeleton } from "../../components/LoadingSkeleton";
import Pagination from "../../components/Pagination";

// Shop Page
const ShopPage = () => {
  usePageTitle("Shop");
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCartProduct, setPendingCartProduct] = useState(null);

  const handleAddToCart = async (product) => {
    if (!user) {
      setShowLoginModal(true);
      setPendingCartProduct(product);
      return;
    }
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      // Error handling can be added here (e.g., show error toast)
    }
  };
  const [priceRange, setPriceRange] = useState([40, 1000]);
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { products, loading } = useProducts();

  const ratings = ["5★ Stars", "4+ Stars"];
  const categories = [
    "Loafers",
    "Derby",
    "Oxford",
    "Monk Strap",
    "Heels",
    "Pumps",
    "Ballet Flats",
  ];
  const sizes = ["XS", "S", "M", "L", "XL"];

  // Sync searchTerm with URL search param
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch !== null && urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams, searchTerm]);

  // Sync category from URL parameter
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      // Find matching category case-insensitively
      const matchingCategory = categories.find(
        (cat) => cat.trim().toLowerCase() === urlCategory.trim().toLowerCase()
      );
      if (matchingCategory) {
        // Only update if the category from URL is not already selected
        setSelectedCategories((prev) => {
          if (!prev.includes(matchingCategory)) {
            return [matchingCategory];
          }
          return prev;
        });
      }
    }
  }, [searchParams]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleRatingToggle = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setPriceRange([40, 1000]);
    setSelectedRating("");
    setSelectedRatings([]);
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSearchTerm("");
  };

  const filteredProducts = (products || []).filter((product) => {
    const normalizedName = (product.name || "").toLowerCase();
    const matchesSearch = normalizedName.includes(searchTerm.toLowerCase());

    // Price filter with null check
    const productPrice = product.price ?? 0;
    const matchesPrice =
      productPrice >= priceRange[0] && productPrice <= priceRange[1];

    // Rating filter - use ratings.average if available, fallback to rating
    const productRating = product.ratings?.average ?? product.rating ?? 0;
    const matchesRating =
      selectedRatings.length === 0 ||
      selectedRatings.some((sr) =>
        sr === "5★ Stars" ? productRating === 5 : productRating >= 4
      );

    // Category filter with case-insensitive comparison and trim whitespace
    const productCategory = product.category ? product.category.trim() : "";
    const matchesCategory =
      selectedCategories.length === 0 ||
      (productCategory &&
        selectedCategories.some(
          (selectedCat) =>
            selectedCat.trim().toLowerCase() === productCategory.toLowerCase()
        ));

    // Size filter with null check - handle both single size and sizes array
    const productSizes = product.sizes || (product.size ? [product.size] : []);
    const matchesSize =
      selectedSizes.length === 0 ||
      (Array.isArray(productSizes)
        ? productSizes.some((size) => selectedSizes.includes(size))
        : selectedSizes.includes(product.size));

    return (
      matchesSearch &&
      matchesPrice &&
      matchesRating &&
      matchesCategory &&
      matchesSize
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    priceRange,
    selectedRating,
    selectedCategories,
    selectedSizes,
  ]);

  const suggestions = products
    .filter((product) =>
      (product.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5);

  // Add state for mobile filter drawer
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-black text-white flex flex-col min-h-screen">
      <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row gap-6 md:gap-10 px-4 sm:px-6 md:px-10 py-8 md:py-12">
        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-yellow-400 text-black px-4 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-500 transition flex items-center gap-2"
          aria-label="Toggle filters"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
        </button>

        {/* Mobile Filter Overlay */}
        {isFilterOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-75 z-50"
            onClick={() => setIsFilterOpen(false)}
          />
        )}

        {/* Filters Sidebar - all filters shown together, no categories */}
        <aside
          className={`${
            isFilterOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          } fixed lg:sticky top-0 left-0 h-full lg:h-fit w-80 bg-[#0f0f0f] border border-yellow-700 rounded-0 lg:rounded-2xl p-6 flex flex-col gap-6 z-50 lg:z-auto overflow-y-auto max-h-screen lg:max-h-[calc(100vh-6rem)] transition-transform duration-300 ease-in-out`}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-yellow-400">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-yellow-400 transition flex items-center gap-1 min-h-[44px] px-2"
              aria-label="Clear all filters"
            >
              <X size={16} aria-hidden="true" />
              Clear All
            </button>
          </div>

          {/* --- Price Range (as input fields) --- */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Price Range
            </h4>
            <div className="flex justify-between items-center px-2">
              <label className="flex flex-col items-start text-s text-gray-400">
                Min
                <input
                  type="number"
                  min="40"
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => {
                    const min = Math.max(
                      40,
                      Math.min(Number(e.target.value), priceRange[1])
                    );
                    setPriceRange([min, priceRange[1]]);
                  }}
                  className="w-30 bg-[#0f0f0f] border border-yellow-600 rounded px-2 py-1 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label="Minimum price"
                />
              </label>
              <span className="text-yellow-400 font-bold">-</span>
              <label className="flex flex-col items-start text-s text-gray-400">
                Max
                <input
                  type="number"
                  min={priceRange[0]}
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const max = Math.min(
                      1000,
                      Math.max(Number(e.target.value), priceRange[0])
                    );
                    setPriceRange([priceRange[0], max]);
                  }}
                  className="w-30 bg-[#0f0f0f] border border-yellow-600 rounded px-2 py-1 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label="Maximum price"
                />
              </label>
            </div>
          </div>

          {/* --- Rating --- */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Rating</h4>
            <div className="flex flex-row gap-6">
                {ratings.map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name={`rating-${rating}`}
                      checked={selectedRatings.includes(rating)}
                      onChange={() => handleRatingToggle(rating)}
                      className="w-4 h-4 accent-yellow-500 cursor-pointer"
                    />
                    <span>{rating}</span>
                  </label>
                ))}
              </div>
          </div>

          {/* --- Category --- */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Category</h4>
            <div className="flex flex-col gap-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="w-4 h-4 accent-yellow-500 cursor-pointer"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* --- Size --- */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Size (US)
            </h4>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`border text-sm px-3 py-2 rounded-full transition-all min-h-[44px] min-w-[44px] ${
                    selectedSizes.includes(size)
                      ? "bg-yellow-500 text-black border-yellow-500"
                      : "border-yellow-700 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                  }`}
                  aria-label={`Filter by size ${size}`}
                  aria-pressed={selectedSizes.includes(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Section */}
        <section className="flex-1 flex flex-col gap-6 md:gap-8 relative">
          {/* Search Bar - make it responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
            <div className="relative w-full sm:max-w-md">
              <label htmlFor="shop-search" className="sr-only">
                Search for products
              </label>
              <input
                id="shop-search"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                  setSelectedSuggestionIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (!showSuggestions || suggestions.length === 0) return;

                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedSuggestionIndex((prev) =>
                      prev < suggestions.length - 1 ? prev + 1 : prev
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedSuggestionIndex((prev) =>
                      prev > 0 ? prev - 1 : -1
                    );
                  } else if (
                    e.key === "Enter" &&
                    selectedSuggestionIndex >= 0
                  ) {
                    e.preventDefault();
                    const selected = suggestions[selectedSuggestionIndex];
                    setSearchTerm(selected.name || "");
                    setShowSuggestions(false);
                    setSelectedSuggestionIndex(-1);
                  } else if (e.key === "Escape") {
                    setShowSuggestions(false);
                    setSelectedSuggestionIndex(-1);
                  }
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                placeholder="Search for shoes..."
                className="w-full bg-[#0f0f0f] text-white placeholder-gray-400 border border-yellow-600 rounded-full px-5 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 shadow-[0_0_10px_rgba(250,204,21,0.2)]"
                aria-expanded={showSuggestions}
                aria-autocomplete="list"
                aria-controls="search-suggestions"
                aria-activedescendant={
                  selectedSuggestionIndex >= 0
                    ? `suggestion-${selectedSuggestionIndex}`
                    : undefined
                }
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400"
                size={20}
                aria-hidden="true"
              />

              {/* --- Suggestions Dropdown --- */}
              {showSuggestions && suggestions.length > 0 && (
                <ul
                  id="search-suggestions"
                  className="absolute mt-2 w-full bg-[#0f0f0f] border border-yellow-700 rounded-xl shadow-lg max-h-48 overflow-y-auto z-20"
                  role="listbox"
                  aria-label="Search suggestions"
                >
                  {suggestions.map((item, index) => (
                    <li
                      key={item.id}
                      id={`suggestion-${index}`}
                      onClick={() => {
                        setSearchTerm(item.name || "");
                        setShowSuggestions(false);
                        setSelectedSuggestionIndex(-1);
                      }}
                      className={`px-4 py-2 cursor-pointer text-gray-300 transition-all min-h-[44px] flex items-center ${
                        index === selectedSuggestionIndex
                          ? "bg-yellow-500 text-black"
                          : "hover:bg-yellow-500 hover:text-black"
                      }`}
                      role="option"
                      aria-selected={index === selectedSuggestionIndex}
                    >
                      {item.name || ""}
                    </li>
                  ))}
                </ul>
              )}

              {/* --- No Results --- */}
              {showSuggestions && suggestions.length === 0 && searchTerm && (
                <p className="absolute mt-2 w-full bg-[#0f0f0f] border border-yellow-700 rounded-xl px-4 py-2 text-gray-400 text-sm">
                  No matches found.
                </p>
              )}
            </div>

            <div
              className="text-gray-300 text-sm w-full sm:w-auto text-left sm:text-right"
              aria-live="polite"
              aria-atomic="true"
            >
              Showing{" "}
              <span className="text-yellow-400 font-semibold">
                {filteredProducts.length}
              </span>{" "}
              product{filteredProducts.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {loading ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </>
            ) : filteredProducts.length > 0 ? (
              paginatedProducts.map((product) => {
                const productId = product._id || product.id;
                const productName = product.name || "Product";
                const mainImage = Array.isArray(product.images)
                  ? product.images[0]
                  : product.image;
                const displayRating =
                  product.ratings?.average ?? product.rating;

                return (
                  <div key={productId} className="cursor-pointer">
                    <ProductCard
                      id={productId}
                      image={mainImage}
                      name={productName}
                      price={product.price}
                      rating={displayRating}
                      description={product.description}
                      onAddToCart={() => handleAddToCart(product)}
                      onClick={() => navigate(`/product/${productId}`)}
                    />
                  </div>
                );
              })
            ) : (
              <div
                className="col-span-full text-center py-12"
                role="status"
                aria-live="polite"
              >
                <p className="text-gray-400 text-lg mb-2">No products found</p>
                <p className="text-gray-500 text-sm mb-4">
                  Try adjusting your filters or search terms to find what you're
                  looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-yellow-400 hover:text-yellow-300 underline min-h-[44px] px-4"
                  aria-label="Clear all filters and show all products"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredProducts.length}
            />
          )}
        </section>
      </main>

      {/* --- Login Modal --- */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingCartProduct(null);
        }}
        onLoginSuccess={async () => {
          setShowLoginModal(false);
          if (pendingCartProduct) {
            try {
              await addToCart(pendingCartProduct, 1);
            } catch (error) {
              console.error(
                "Failed to add product to cart after login:",
                error
              );
              // Error handling can be added here (e.g., show error toast)
            }
            setPendingCartProduct(null);
          }
        }}
      />
    </div>
  );
};

export default ShopPage;
