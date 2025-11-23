import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import API from "../services/api";

const storageKey = "productsCache";
const ProductContext = createContext(null);

const loadProductsFromStorage = () => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    // ignore
  }
  return [];
};

const persistProducts = (items) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(items));
  } catch (err) {
    // ignore
  }
};

// Product Provider
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => loadProductsFromStorage());
  const [categories, setCategories] = useState(() =>
    [...new Set(loadProductsFromStorage().map((p) => p.category))].filter(
      Boolean
    )
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 1000],
    rating: 0,
    search: "",
  });

  const productsRef = useRef(products);
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    persistProducts(products);
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];
    setCategories(uniqueCategories);
  }, [products]);

  const seedSampleProducts = useCallback(() => {
    setProducts([]);
    return [];
  }, []);

  const fetchProducts = useCallback(async () => {
    const response = await API.get(`/products`);
    const data = response.data;
    const items = data.products || data;
    return Array.isArray(items) ? items : [];
  }, []);

  const syncProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await fetchProducts();
      if (!fetched.length) {
        return seedSampleProducts();
      }
      setProducts(fetched);
      return fetched;
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Unable to load products"
      );
      if (productsRef.current?.length) {
        return productsRef.current;
      }
      return seedSampleProducts();
    } finally {
      setLoading(false);
      setIsHydrated(true);
    }
  }, [fetchProducts, seedSampleProducts]);

  useEffect(() => {
    syncProducts();
  }, [syncProducts]);

  const getProduct = (id) => {
    return products.find(
      (product) => String(product._id || product.id) === String(id)
    );
  };

  const getFilteredProducts = () => {
    return products.filter((product) => {
      const matchesCategory =
        !filters.category || product.category === filters.category;
      const matchesPrice =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];
      const matchesRating =
        (product.ratings?.average ?? product.rating ?? 0) >= filters.rating;
      const matchesSearch =
        (product.name || "")
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        (product.description || "")
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      return matchesCategory && matchesPrice && matchesRating && matchesSearch;
    });
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const addProduct = async (product) => {
    const response = await API.post(`/products`, product);
    const data = response.data;
    const created = data.product || data;
    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const updateProduct = async (productId, updates) => {
    const response = await API.put(`/products/${productId}`, updates);
    const data = response.data;
    const updated = data.product || data;
    setProducts((prev) =>
      prev.map((p) =>
        String(p._id || p.id) === String(productId) ? updated : p
      )
    );
    return updated;
  };

  const deleteProduct = async (productId) => {
    await API.delete(`/products/${productId}`);
    setProducts((prev) =>
      prev.filter((p) => String(p._id || p.id) !== String(productId))
    );
    return true;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        isHydrated,
        filters,
        getProduct,
        getFilteredProducts,
        updateFilters,
        addProduct,
        updateProduct,
        deleteProduct,
        syncProducts,
        seedSampleProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Product Hook
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
