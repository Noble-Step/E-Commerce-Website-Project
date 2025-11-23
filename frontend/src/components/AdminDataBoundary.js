import React from "react";
import { useUser } from "../context/UserContext";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";

const AdminDataBoundary = ({ children }) => {
  const { registryHydrated } = useUser();
  const {
    isHydrated: productsHydrated,
    loading: productsLoading,
    error: productsError,
    syncProducts,
  } = useProducts();
  const {
    isHydrated: ordersHydrated,
    isLoading: ordersLoading,
    error: ordersError,
    syncOrders,
  } = useOrders();

  const isHydrated =
    registryHydrated && productsHydrated && ordersHydrated;
  const isSyncing = productsLoading || ordersLoading;
  const retrySync = () => {
    syncProducts();
    syncOrders();
  };

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center text-white bg-black/40 rounded-2xl border border-yellow-400/10 p-8">
        <div>
          <p className="text-xl font-semibold text-yellow-400">
            Preparing admin data
          </p>
          <p className="text-sm text-gray-400 mt-2 max-w-md">
            We&apos;re syncing products, orders, and users so the dashboard
            shows the latest data.
          </p>
        </div>
        {(productsError || ordersError) && (
          <p className="text-sm text-red-400">
            {productsError || ordersError}
          </p>
        )}
        <button
          onClick={retrySync}
          disabled={isSyncing}
          className={`px-6 py-3 rounded-full font-semibold transition ${
            isSyncing
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-yellow-400 text-black hover:bg-yellow-500"
          }`}
        >
          {isSyncing ? "Syncing..." : "Retry sync"}
        </button>
      </div>
    );
  }

  return children;
};

export default AdminDataBoundary;

