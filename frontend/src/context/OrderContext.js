import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import API from "../services/api";
import { useUser } from "./UserContext";

const storage = {
  get(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
    }
  },
};

const normalizeStatus = (status = "Processing") => {
  const normalized = String(status).toLowerCase();
  switch (normalized) {
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "completed":
      return "Completed";
    case "cancelled":
    case "canceled":
      return "Cancelled";
    default:
      return "Processing";
  }
};

const normalizeItem = (item = {}, idx, orderId = null) => {
  const sourceProduct = item.product || {};
  const stableId = item._id || 
    item.id || 
    sourceProduct._id || 
    (orderId ? `order-item-${orderId}-${idx}` : `order-item-${idx}`);
  
  return {
    id: String(stableId),
    name: item.name || sourceProduct.name || "Product",
    price: Number(
      item.price ?? item.unitPrice ?? sourceProduct.price ?? item.totalPrice ?? 0
    ),
    quantity: Number(item.quantity ?? item.qty ?? 1),
    image:
      item.image ||
      item.images?.[0] ||
      sourceProduct.images?.[0] ||
      sourceProduct.image ||
      "",
    product: sourceProduct,
    size: item.size || null,
  };
};

const normalizeOrder = (order = {}) => {
  const stableId = order._id || order.id || order.orderId;
  const id = stableId ? String(stableId) : `order-${order.user?._id || order.user?.id || 'guest'}-${order.createdAt || order.date || 'unknown'}`;
  
  const shippingSource =
    order.shipping ||
    order.shippingAddress || {
      firstName: order.user?.firstName || "Guest",
      lastName: order.user?.lastName || "",
      email: order.user?.email || "customer@nobles.step",
      phone: order.user?.phone || "",
      address: "",
      city: "",
      state: "",
      zip: "",
    };

  const normalized = {
    ...order,
    id,
    _id: order._id || id,
    status: normalizeStatus(order.status),
    createdAt: order.createdAt || order.date || new Date().toISOString(),
    total: Number(
      order.total ?? order.orderTotal ?? order.amount ?? order.subtotal ?? 0
    ),
    shipping: {
      firstName: shippingSource.firstName || shippingSource.first_name || "Guest",
      lastName: shippingSource.lastName || shippingSource.last_name || "",
      email: shippingSource.email || "",
      phone: shippingSource.phone || "",
      address: shippingSource.address || shippingSource.street || "",
      city: shippingSource.city || "",
      state: shippingSource.state || "",
      zip: shippingSource.zip || shippingSource.postalCode || "",
    },
    items: (order.items || order.products || []).map((item, idx) =>
      normalizeItem(item, idx, id)
    ),
  };
  
  return normalized;
};

const seedOrders = () => [];
const matchesOrderId = (order, orderId) =>
  String(order?._id || order?.id) === String(orderId);

const OrderContext = createContext(null);

// Order Provider
export const OrderProvider = ({ children }) => {
  const { user } = useUser();
  const [orders, setOrders] = useState(() => storage.get("orders", []));
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState(() =>
    storage.get("orderHistory", []).map((entry) => normalizeOrder(entry))
  );
  const [orderEvents, setOrderEvents] = useState(() =>
    storage.get("orderEvents", [])
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    storage.set("orders", orders);
  }, [orders]);

  useEffect(() => {
    storage.set("orderHistory", orderHistory);
  }, [orderHistory]);

  useEffect(() => {
    storage.set("orderEvents", orderEvents);
  }, [orderEvents]);

  const seedSampleOrders = useCallback(() => {
    const seeded = seedOrders();
    setOrders(seeded);
    return seeded;
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!user) return [];
    const endpoint = user.isAdmin ? `/orders` : `/orders/myorders`;
    const response = await API.get(endpoint);
    const payload = response.data?.orders ?? response.data;
    const rawOrders = Array.isArray(payload)
      ? payload
      : payload?.orders ?? payload?.order ?? [];
    return rawOrders.map((order) => normalizeOrder(order));
  }, [user]);

  const syncOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setIsHydrated(true);
      return [];
    }

    setIsLoading(true);
    setError(null);
    try {
      const freshOrders = await fetchOrders();
      if (!freshOrders.length) {
        return seedSampleOrders();
      }
      setOrders(freshOrders);
      return freshOrders;
    } catch (err) {
      const fallback = seedSampleOrders();
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to load orders right now."
      );
      return fallback;
    } finally {
      setIsLoading(false);
      setIsHydrated(true);
    }
  }, [fetchOrders, seedSampleOrders, user]);

  useEffect(() => {
    let active = true;
    const hydrate = async () => {
      try {
        await syncOrders();
      } catch (err) {
        if (active) {
          setError(err?.message || "Unable to sync orders");
        }
      }
    };
    hydrate();
    return () => {
      active = false;
    };
  }, [syncOrders]);

  const createOrder = async (orderData) => {
    if (!user) throw new Error("Login required");
    try {
      const response = await API.post(`/orders`, orderData);
      const data = response.data?.order || response.data;
      const normalized = normalizeOrder(data);
      setOrders((prev) => [normalized, ...prev]);
      return normalized;
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Unable to create order"
      );
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const previousOrder = orders.find((order) => matchesOrderId(order, orderId));
      const previousStatus = previousOrder?.status || "Processing";
      
      const response = await API.put(`/orders/${orderId}/status`, { status });
      const data = response.data?.order || response.data;
      const normalized = normalizeOrder({ ...data, status });
      setOrders((prev) =>
        prev.map((order) => (matchesOrderId(order, orderId) ? normalized : order))
      );
      setOrderHistory((prev) =>
        prev.map((order) => (matchesOrderId(order, orderId) ? normalized : order))
      );
      setOrderEvents((history) => {
        return [
          ...history,
          {
            id: `${orderId}-evt-${Date.now()}`,
            orderId,
            from: previousStatus,
            to: normalizeStatus(status),
            timestamp: new Date().toISOString(),
          },
        ];
      });
      return normalized;
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Unable to update order"
      );
      throw err;
    }
  };

  const getOrderById = (orderId) => {
    return (
      orders.find((order) => matchesOrderId(order, orderId)) ||
      orderHistory.find((order) => matchesOrderId(order, orderId)) ||
      null
    );
  };

  const getUserOrders = async () => {
    return syncOrders();
  };

  const completeOrder = (orderId) => {
    const target =
      orders.find((order) => matchesOrderId(order, orderId)) ||
      orderHistory.find((order) => matchesOrderId(order, orderId));
    if (!target) {
      return;
    }
    const finished = {
      ...target,
      status: "Completed",
      completedAt: new Date().toISOString(),
    };
    setOrderHistory((prev) => {
      const others = prev.filter((order) => !matchesOrderId(order, orderId));
      return [...others, finished];
    });
    setOrders((prev) => prev.filter((order) => !matchesOrderId(order, orderId)));
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        orderHistory,
        orderEvents,
        isLoading,
        error,
        isHydrated,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getUserOrders,
        completeOrder,
        syncOrders,
        seedSampleOrders,
        setActiveOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
