import React, { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

// Order Provider
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem("orders");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  });
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("orderHistory");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  });
  const [orderEvents, setOrderEvents] = useState(() => {
    try {
      const raw = localStorage.getItem("orderEvents");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch (err) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
    } catch (err) {}
  }, [orderHistory]);

  useEffect(() => {
    try {
      localStorage.setItem("orderEvents", JSON.stringify(orderEvents));
    } catch (err) {}
  }, [orderEvents]);

  const createOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      status: orderData.status || "Processing",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) => {
      return prev.map((order) => {
        if (order.id === orderId) {
          const previous = order.status;
          const updated = {
            ...order,
            status,
            updatedAt: new Date().toISOString(),
          };
          setOrderEvents((h) => [
            ...h,
            {
              id: `${orderId}-evt-${Date.now()}`,
              orderId,
              from: previous,
              to: status,
              timestamp: new Date().toISOString(),
            },
          ]);
          return updated;
        }
        return order;
      });
    });
  };

  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  const getUserOrders = (userId) => {
    return orders.filter((order) => order.userId === userId);
  };

  const completeOrder = (orderId) => {
    const completedOrder = orders.find((order) => order.id === orderId);
    if (completedOrder) {
      const finished = {
        ...completedOrder,
        status: "Completed",
        completedAt: new Date().toISOString(),
      };
      setOrderHistory((prev) => [...prev, finished]);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } else {
      setOrderHistory((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "Completed" } : o))
      );
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        orderHistory,
        orderEvents,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getUserOrders,
        completeOrder,
        setActiveOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Order Hook
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
