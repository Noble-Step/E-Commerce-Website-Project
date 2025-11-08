import React, { createContext, useContext, useState, useEffect } from "react";
import mockProducts from "../data/products";

const ProductContext = createContext();

// Product Provider
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const raw = localStorage.getItem("products");
      if (raw) return JSON.parse(raw);
    } catch (err) {}
    return [];
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 1000],
    rating: 0,
    search: "",
  });

  useEffect(() => {
    try {
      if (!products || products.length === 0) {
        const data = mockProducts || [];
        setProducts(data);
        const uniqueCategories = [
          ...new Set(data.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
      } else {
        const uniqueCategories = [
          ...new Set(products.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("products", JSON.stringify(products));
    } catch (err) {}
  }, [products]);

  const getProduct = (id) => {
    return products.find((product) => product.id === id);
  };

  const getFilteredProducts = () => {
    return products.filter((product) => {
      const matchesCategory =
        !filters.category || product.category === filters.category;
      const matchesPrice =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];
      const matchesRating = product.rating >= filters.rating;
      const matchesSearch =
        product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      return matchesCategory && matchesPrice && matchesRating && matchesSearch;
    });
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const addProduct = (product) => {
    const newProduct = { ...product, id: product.id || Date.now() };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, ...product } : p))
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        filters,
        getProduct,
        getFilteredProducts,
        updateFilters,
        addProduct,
        updateProduct,
        deleteProduct,
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
