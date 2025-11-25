import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import API from "../services/api";

const CartContext = createContext();

// Cart Provider
export const CartProvider = ({ children }) => {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) {
        setCartItems([]);
        return;
      }
      try {
        const response = await API.get(`/cart`);
        const data = response.data;
        const cart = data.cart || data;
        if (!mounted) return;
        const items = (cart.items || []).map((it) => {
          const productId = typeof it.product === 'object' && it.product !== null
            ? (it.product._id || it.product.id || String(it.product))
            : (it.product || '');
          
          const itemId = it._id || productId || '';
          
          return {
            id: String(itemId),
            productId: String(productId),
            name: typeof it.product === 'object' && it.product !== null ? it.product.name : '',
            price: typeof it.product === 'object' && it.product !== null ? it.product.price : 0,
            image: typeof it.product === 'object' && it.product !== null
              ? (Array.isArray(it.product.images) ? it.product.images[0] : it.product.image || "")
              : "",
            quantity: it.quantity,
            size: it.size || null,
          };
        });
        setCartItems(items);
      } catch (err) {
        setCartItems([]);
      }
    };
    load();
    return () => (mounted = false);
  }, [user]);

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setCartTotal(total);
  }, [cartItems]);

  const addToCart = async (product, quantity = 1, size = null) => {
    if (!user) throw new Error("Login required");
    const payload = {
      productId: product._id || product.id || product.productId,
      quantity,
    };

    if (size !== undefined && size !== null && size !== "") {
      payload.size = size;
    }

    const response = await API.post(`/cart`, payload);
    const data = response.data;
    const cart = data.cart || data;
    const items = (cart.items || []).map((it) => {
      const productId = typeof it.product === 'object' && it.product !== null
        ? (it.product._id || it.product.id || String(it.product))
        : (it.product || '');
      
      const itemId = it._id || productId || '';
      
      return {
        id: String(itemId),
        productId: String(productId),
        name: typeof it.product === 'object' && it.product !== null ? it.product.name : '',
        price: typeof it.product === 'object' && it.product !== null ? it.product.price : 0,
        image: typeof it.product === 'object' && it.product !== null
          ? (Array.isArray(it.product.images) ? it.product.images[0] : it.product.image || "")
          : "",
        quantity: it.quantity,
        size: it.size || null,
      };
    });
    setCartItems(items);
  };

  const removeFromCart = async (itemId) => {
    if (!user) return;
    await API.delete(`/cart/${itemId}`);
    setCartItems((prev) => prev.filter((i) => String(i.id) !== String(itemId)));
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    const response = await API.put(`/cart/${itemId}`, { quantity });
    const data = response.data;
    const cart = data.cart || data;
    const items = (cart.items || []).map((it) => {
      const productId = typeof it.product === 'object' && it.product !== null
        ? (it.product._id || it.product.id || String(it.product))
        : (it.product || '');
      
      const itemId = it._id || productId || '';
      
      return {
        id: String(itemId),
        productId: String(productId),
        name: typeof it.product === 'object' && it.product !== null ? it.product.name : '',
        price: typeof it.product === 'object' && it.product !== null ? it.product.price : 0,
        image: typeof it.product === 'object' && it.product !== null
          ? (Array.isArray(it.product.images) ? it.product.images[0] : it.product.image || "")
          : "",
        quantity: it.quantity,
        size: it.size || null,
      };
    });
    setCartItems(items);
  };

  const clearCart = async () => {
    if (user) {
      await API.delete(`/cart`);
    }
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount: cartItems.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
