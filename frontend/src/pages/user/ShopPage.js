import React, { useState } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";
import ProductCard from "../../components/ProductCard";
import LoginModal from "../../modals/LoginModal";

// Shop Page
const ShopPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCartProduct, setPendingCartProduct] = useState(null);

  const handleAddToCart = (product) => {
    if (!user) {
      setShowLoginModal(true);
      setPendingCartProduct(product);
      return;
    }
    addToCart(product, 1);
  };
  const [priceRange, setPriceRange] = useState([40, 180]);
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedHeelTypes, setSelectedHeelTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedWidths, setSelectedWidths] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const [openSections, setOpenSections] = useState({
    priceRating: true,
    demographics: false,
    visualFit: false,
  });

  const { products } = useProducts();

  const ratings = ["5★ Stars", "4+ Stars"];
  const genders = ["Men's", "Women's", "Unisex"];
  const ageGroups = ["Adults", "Teens"];
  const categories = [
    "Loafers",
    "Derby",
    "Oxford",
    "Monk Strap",
    "Heels",
    "Pumps",
    "Ballet Flats",
  ];
  const occasions = [
    "Formal",
    "Business Casual",
    "Evening",
    "Wedding",
    "Cocktail",
  ];
  const brands = [
    "Gucci",
    "Prada",
    "Louis Vuitton",
    "Chanel",
    "Christian Louboutin",
    "Jimmy Choo",
    "Salvatore Ferragamo",
    "Versace",
    "Dior",
    "Valentino Garavani",
  ];
  const materials = [
    "Calfskin Leather",
    "Suede",
    "Patent Leather",
    "Exotic Hide",
    "Silk",
    "Velvet",
  ];
  const colors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#ffffff" },
    { name: "Brown", hex: "#8b4513" },
    { name: "Beige", hex: "#d4c4b0" },
    { name: "Tan", hex: "#d2b48c" },
  ];
  const heelTypes = ["Stiletto", "Block", "Kitten", "Wedge", "Flat"];
  const sizes = ["XS", "S", "M", "L", "XL"];
  const widths = ["Standard", "Narrow", "Wide"];

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleOccasionToggle = (occasion) => {
    setSelectedOccasions((prev) =>
      prev.includes(occasion)
        ? prev.filter((o) => o !== occasion)
        : [...prev, occasion]
    );
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleMaterialToggle = (material) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleHeelTypeToggle = (heelType) => {
    setSelectedHeelTypes((prev) =>
      prev.includes(heelType)
        ? prev.filter((h) => h !== heelType)
        : [...prev, heelType]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleWidthToggle = (width) => {
    setSelectedWidths((prev) =>
      prev.includes(width) ? prev.filter((w) => w !== width) : [...prev, width]
    );
  };

  const clearFilters = () => {
    setPriceRange([40, 180]);
    setSelectedRating("");
    setSelectedGender("");
    setSelectedAgeGroup("");
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setSelectedBrands([]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setSelectedHeelTypes([]);
    setSelectedSizes([]);
    setSelectedWidths([]);
    setSearchTerm("");
    setBrandSearch("");
  };

  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesRating =
      !selectedRating ||
      (selectedRating === "5★ Stars"
        ? product.rating === 5
        : product.rating >= 4);
    const matchesGender = !selectedGender || product.gender === selectedGender;
    const matchesAgeGroup =
      !selectedAgeGroup || product.ageGroup === selectedAgeGroup;
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const matchesOccasion =
      selectedOccasions.length === 0 ||
      selectedOccasions.includes(product.occasion);
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesMaterial =
      selectedMaterials.length === 0 ||
      selectedMaterials.includes(product.material);
    const matchesColor =
      selectedColors.length === 0 || selectedColors.includes(product.color);
    const matchesHeelType =
      selectedHeelTypes.length === 0 ||
      selectedHeelTypes.includes(product.heelType);
    const matchesSize =
      selectedSizes.length === 0 || selectedSizes.includes(product.size);
    const matchesWidth =
      selectedWidths.length === 0 || selectedWidths.includes(product.width);

    return (
      matchesSearch &&
      matchesPrice &&
      matchesRating &&
      matchesGender &&
      matchesAgeGroup &&
      matchesCategory &&
      matchesOccasion &&
      matchesBrand &&
      matchesMaterial &&
      matchesColor &&
      matchesHeelType &&
      matchesSize &&
      matchesWidth
    );
  });

  const suggestions = products
    .filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5);

  const filteredBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="bg-black text-white flex flex-col min-h-screen">
      <main className="min-h-screen bg-black text-white flex gap-10 px-10 py-12">
        {/* --- Filters Sidebar --- */}
        <aside className="w-80 bg-[#0f0f0f] border border-yellow-700 rounded-2xl p-6 flex flex-col gap-6 h-fit sticky top-12 overflow-y-auto max-h-[calc(100vh-6rem)]">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-yellow-400">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-yellow-400 transition flex items-center gap-1"
            >
              <X size={16} />
              Clear All
            </button>
          </div>

          {/* --- Price & Rating --- */}
          <div className="border-t border-yellow-700 pt-4">
            <button
              onClick={() => toggleSection("priceRating")}
              className="flex justify-between items-center w-full mb-3"
            >
              <h3 className="font-medium text-yellow-400">I. Price & Rating</h3>
              {openSections.priceRating ? (
                <ChevronUp size={18} className="text-yellow-400" />
              ) : (
                <ChevronDown size={18} className="text-yellow-400" />
              )}
            </button>

            {openSections.priceRating && (
              <div className="flex flex-col gap-4">
                {/* --- Price Range --- */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Price Range
                  </h4>
                  <div className="px-2">
                    <input
                      type="range"
                      min="40"
                      max="180"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full accent-yellow-500"
                    />
                    <input
                      type="range"
                      min="40"
                      max="180"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full accent-yellow-500 mt-2"
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span className="text-yellow-400 font-semibold">
                        ${priceRange[0]} Min
                      </span>
                      <span className="text-yellow-400 font-semibold">
                        ${priceRange[1]} Max
                      </span>
                    </div>
                  </div>
                </div>

                {/* --- Rating --- */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </h4>
                  <div className="flex flex-col gap-2">
                    {ratings.map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="rating"
                          checked={selectedRating === rating}
                          onChange={() => setSelectedRating(rating)}
                          className="w-4 h-4 accent-yellow-500 cursor-pointer"
                        />
                        <span>{rating}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- Product Type & Demographics --- */}
          <div className="border-t border-yellow-700 pt-4">
            <button
              onClick={() => toggleSection("demographics")}
              className="flex justify-between items-center w-full mb-3"
            >
              <h3 className="font-medium text-yellow-400">
                II. Product Type & Demographics
              </h3>
              {openSections.demographics ? (
                <ChevronUp size={18} className="text-yellow-400" />
              ) : (
                <ChevronDown size={18} className="text-yellow-400" />
              )}
            </button>

            {openSections.demographics && (
              <div className="flex flex-col gap-4">
                {/* --- Gender --- */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Gender
                  </h4>
                  <div className="flex flex-col gap-2">
                    {genders.map((gender) => (
                      <label
                        key={gender}
                        className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="gender"
                          checked={selectedGender === gender}
                          onChange={() => setSelectedGender(gender)}
                          className="w-4 h-4 accent-yellow-500 cursor-pointer"
                        />
                        <span>{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* --- Age Group --- */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Age Group
                  </h4>
                  <div className="flex flex-col gap-2">
                    {ageGroups.map((age) => (
                      <label
                        key={age}
                        className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="ageGroup"
                          checked={selectedAgeGroup === age}
                          onChange={() => setSelectedAgeGroup(age)}
                          className="w-4 h-4 accent-yellow-500 cursor-pointer"
                        />
                        <span>{age}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* --- Category --- */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Category
                  </h4>
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

                {/* --- Occasion --- */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Occasion
                  </h4>
                  <div className="flex flex-col gap-2">
                    {occasions.map((occasion) => (
                      <label
                        key={occasion}
                        className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedOccasions.includes(occasion)}
                          onChange={() => handleOccasionToggle(occasion)}
                          className="w-4 h-4 accent-yellow-500 cursor-pointer"
                        />
                        <span>{occasion}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* --- Brand --- */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Brand
                  </h4>
                  <input
                    type="text"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    placeholder="Search brands..."
                    className="w-full bg-black text-white placeholder-gray-500 border border-yellow-700 rounded px-3 py-1 text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                  <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
                    {filteredBrands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          className="w-4 h-4 accent-yellow-500 cursor-pointer"
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- Visual & Fit --- */}
          <div className="border-t border-yellow-700 pt-4">
            <button
              onClick={() => toggleSection("visualFit")}
              className="flex justify-between items-center w-full mb-3"
            >
              <h3 className="font-medium text-yellow-400">III. Visual & Fit</h3>
              {openSections.visualFit ? (
                <ChevronUp size={18} className="text-yellow-400" />
              ) : (
                <ChevronDown size={18} className="text-yellow-400" />
              )}
            </button>

            {openSections.visualFit && (
              <div className="flex flex-col gap-4">
                {/* --- Material --- */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Material
                  </h4>
                  <div className="flex flex-col gap-2">
                    {materials.map((material) => (
                      <label
                        key={material}
                        className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(material)}
                          onChange={() => handleMaterialToggle(material)}
                          className="w-4 h-4 accent-yellow-500 cursor-pointer"
                        />
                        <span className="text-xs">{material}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* --- Color --- */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Color
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => handleColorToggle(color.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColors.includes(color.name)
                            ? "border-yellow-400 ring-2 ring-yellow-400 ring-offset-2 ring-offset-[#0f0f0f]"
                            : "border-gray-700 hover:border-yellow-400"
                        } ${color.name === "White" ? "border-gray-400" : ""}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* --- Heel Type --- */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Heel Type
                  </h4>
                  <div className="flex flex-col gap-2">
                    {heelTypes.map((heelType) => (
                      <label
                        key={heelType}
                        className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedHeelTypes.includes(heelType)}
                          onChange={() => handleHeelTypeToggle(heelType)}
                          className="w-4 h-4 accent-yellow-500 cursor-pointer"
                        />
                        <span>{heelType}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* --- Size (US) --- */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Size (US)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`border text-sm px-3 py-1 rounded-full transition-all ${
                          selectedSizes.includes(size)
                            ? "bg-yellow-500 text-black border-yellow-500"
                            : "border-yellow-700 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* --- Width --- */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Width
                  </h4>
                  <div className="flex flex-col gap-2">
                    {widths.map((width) => (
                      <label
                        key={width}
                        className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="width"
                          checked={selectedWidths.includes(width)}
                          onChange={() => handleWidthToggle(width)}
                          className="w-4 h-4 accent-yellow-500 cursor-pointer"
                        />
                        <span>{width}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* --- Products Section --- */}
        <section className="flex-1 flex flex-col gap-8 relative">
          {/* --- Search Bar --- */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <input
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
                    setSearchTerm(selected.title);
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
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400"
                size={20}
              />

              {/* --- Suggestions Dropdown --- */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute mt-2 w-full bg-[#0f0f0f] border border-yellow-700 rounded-xl shadow-lg max-h-48 overflow-y-auto z-20">
                  {suggestions.map((item, index) => (
                    <li
                      key={item.id}
                      onClick={() => {
                        setSearchTerm(item.title);
                        setShowSuggestions(false);
                        setSelectedSuggestionIndex(-1);
                      }}
                      className={`px-4 py-2 cursor-pointer text-gray-300 transition-all ${
                        index === selectedSuggestionIndex
                          ? "bg-yellow-500 text-black"
                          : "hover:bg-yellow-500 hover:text-black"
                      }`}
                    >
                      {item.title}
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

            <div className="text-gray-400 text-sm">
              Showing{" "}
              <span className="text-yellow-400 font-semibold">
                {filteredProducts.length}
              </span>{" "}
              products
            </div>
          </div>

          {/* --- Product Grid --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="cursor-pointer">
                  <ProductCard
                    id={product.id}
                    image={product.image}
                    title={product.title}
                    price={product.price}
                    rating={product.rating}
                    description={product.description}
                    onAddToCart={() => handleAddToCart(product)}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg mb-2">No products found</p>
                <button
                  onClick={clearFilters}
                  className="text-yellow-400 hover:text-yellow-300 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* --- Login Modal --- */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingCartProduct(null);
        }}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          if (pendingCartProduct) {
            addToCart(pendingCartProduct, 1);
            setPendingCartProduct(null);
          }
        }}
      />
    </div>
  );
};

export default ShopPage;
