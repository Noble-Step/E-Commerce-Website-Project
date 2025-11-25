import React, { useMemo, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { useOrders } from "../../context/OrderContext";
import AlertModal from "../../modals/AlertModal";
import {
  Eye,
  ChevronDown,
  ChevronUp,
  Truck,
  Check,
  X as XIcon,
  RefreshCcw,
} from "lucide-react";

const statusStyles = {
  processing: "bg-yellow-400/10 text-yellow-400",
  shipped: "bg-blue-400/10 text-blue-400",
  delivered: "bg-green-400/10 text-green-400",
  cancelled: "bg-red-400/10 text-red-400",
};

const OrdersListPage = () => {
  const {
    orders,
    orderHistory,
    updateOrderStatus,
    isLoading,
    error,
    syncOrders,
  } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const allOrders = useMemo(
    () =>
      [...orders, ...orderHistory].sort(
        (a, b) =>
          new Date(b.createdAt || b.date || 0) -
          new Date(a.createdAt || a.date || 0)
      ),
    [orders, orderHistory]
  );

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(orderId, newStatus.toLowerCase());
      setAlertConfig({
        type: "success",
        title: "Order Updated",
        message: `Order status has been updated to ${newStatus}.`,
      });
    } catch (err) {
      setAlertConfig({
        type: "error",
        title: "Update Failed",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "We could not update the order. Please try again.",
      });
    } finally {
      setShowAlert(true);
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    return statusStyles[status] || "bg-gray-400/10 text-gray-400";
  };

  const isStatusAllowed = (currentStatus, targetStatus) => {
    const normalizedCurrent = currentStatus.toLowerCase();
    const normalizedTarget = targetStatus.toLowerCase();

    const statusOrder = ["processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(normalizedCurrent);
    const targetIndex = statusOrder.indexOf(normalizedTarget);

    if (normalizedTarget === "cancelled") {
      return normalizedCurrent !== "cancelled";
    }

    return targetIndex === currentIndex + 1;
  };

  const renderItemImage = (imageSrc, itemName) => {
    if (imageSrc) {
      return (
        <img
          src={imageSrc}
          alt={itemName}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      );
    }
    return (
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center text-base sm:text-lg font-semibold flex-shrink-0">
        {itemName.charAt(0).toUpperCase()}
      </div>
    );
  };

  const renderOrdersList = () => {
    if (!allOrders.length) {
      return (
        <div className="bg-gray-900 rounded-xl lg:rounded-2xl p-6 lg:p-10 text-center text-gray-400">
          <p className="text-lg lg:text-xl font-semibold text-white mb-2">
            No orders available
          </p>
          <p className="text-sm mb-6">
            Orders will appear here as soon as shoppers place them. You can also
            seed sample orders from the admin plan helpers.
          </p>
          <button
            onClick={syncOrders}
            className="inline-flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition text-sm lg:text-base"
          >
            <RefreshCcw size={16} />
            Refresh Orders
          </button>
        </div>
      );
    }

    return allOrders.map((order) => {
      const orderId = order.id || order._id;
      const isExpanded = expandedOrder === orderId;
      const shipping = order.shipping || {};
      const user = order.user || {};
      const customerName =
        `${shipping.firstName || user.firstName || user.name || ""} ${
          shipping.lastName || user.lastName || ""
        }`.trim() || (user.email ? user.email.split("@")[0] : "Customer");
      const addressLine = [
        shipping.address,
        shipping.city,
        shipping.state,
        shipping.zip,
      ]
        .filter(Boolean)
        .join(", ");

      return (
        <div
          key={orderId}
          className="bg-gray-900 rounded-xl lg:rounded-2xl overflow-hidden"
        >
          <div className="p-4 lg:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start justify-between border-b border-gray-800">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 lg:gap-3 mb-2 flex-wrap">
                <h3 className="font-semibold text-yellow-400 text-sm lg:text-base truncate">
                  {orderId}
                </h3>
                <span
                  className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status || "Processing"}
                </span>
              </div>
              <p className="text-xs lg:text-sm text-gray-400">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "Date unavailable"}
              </p>
            </div>

            <div className="flex items-center gap-3 lg:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-left sm:text-right">
                <p className="text-xs lg:text-sm text-gray-400">Total Amount</p>
                <p className="font-semibold text-white text-sm lg:text-base">
                  ${Number(order.total || 0).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => setExpandedOrder(isExpanded ? null : orderId)}
                className="p-2 text-gray-400 hover:text-white rounded-lg transition flex-shrink-0"
                aria-expanded={isExpanded}
                aria-controls={`order-${orderId}`}
              >
                {isExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>
          </div>

          {isExpanded && (
            <div
              id={`order-${orderId}`}
              className="p-4 lg:p-6 space-y-4 lg:space-y-6"
            >
              <div>
                <h4 className="font-semibold text-white mb-3 text-sm lg:text-base">
                  Customer Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <Detail label="Name" value={customerName} />
                  <Detail
                    label="Email"
                    value={shipping.email || user.email || "—"}
                  />
                  <Detail
                    label="Phone"
                    value={shipping.phone || user.phone || "—"}
                  />
                  <Detail label="Address" value={addressLine || "—"} />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3 text-sm lg:text-base">
                  Order Items
                </h4>
                <div className="space-y-2 lg:space-y-3">
                  {(order.items || []).map((item, idx) => {
                    const itemName =
                      item.name || item.product?.name || "Product";
                    const itemPrice = Number(
                      item.price || item.unitPrice || item.product?.price || 0
                    );
                    const itemQty = Number(item.quantity || item.qty || 1);
                    const itemImage =
                      item.image ||
                      item.images?.[0] ||
                      item.product?.images?.[0] ||
                      "";

                    return (
                      <div
                        key={`${orderId}-item-${idx}`}
                        className="flex items-center gap-3 lg:gap-4 p-3 bg-black rounded-lg"
                      >
                        {renderItemImage(itemImage, itemName)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm lg:text-base truncate">
                            {itemName}
                          </p>
                          <p className="text-xs lg:text-sm text-gray-400">
                            Quantity: {itemQty} × ${itemPrice.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold text-white text-sm lg:text-base whitespace-nowrap">
                          ${(itemQty * itemPrice).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 lg:pt-6">
                <h4 className="font-semibold text-white mb-3 text-sm lg:text-base">
                  Update Status
                </h4>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 lg:gap-3">
                  {["Processing", "Shipped", "Delivered", "Cancelled"].map(
                    (status) => {
                      const isCurrent = order.status === status.toLowerCase();
                      const isAllowed = isStatusAllowed(
                        order.status || "processing",
                        status
                      );
                      const isDisabled =
                        isCurrent || !isAllowed || updatingOrderId === orderId;

                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(orderId, status)}
                          disabled={isDisabled}
                          title={
                            !isAllowed
                              ? `Cannot transition to ${status} from ${order.status}`
                              : ""
                          }
                          className={`px-3 lg:px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition text-xs lg:text-sm ${
                            isDisabled
                              ? "bg-gray-800 text-gray-400 cursor-not-allowed opacity-50"
                              : {
                                  Processing:
                                    "bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20",
                                  Shipped:
                                    "bg-blue-400/10 text-blue-400 hover:bg-blue-400/20",
                                  Delivered:
                                    "bg-green-400/10 text-green-400 hover:bg-green-400/20",
                                  Cancelled:
                                    "bg-red-400/10 text-red-400 hover:bg-red-400/20",
                                }[status]
                          }`}
                        >
                          {statusIcon(status)}
                          <span className="hidden sm:inline">{status}</span>
                          <span className="sm:hidden">
                            {status.slice(0, 4)}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 lg:gap-4">
          <h1 className="text-xl lg:text-2xl font-bold text-white">Orders</h1>
          <button
            onClick={syncOrders}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-200 hover:text-yellow-400 transition text-sm lg:text-base"
          >
            <RefreshCcw size={18} />
            Refresh
          </button>
        </div>

        {(isLoading || error) && (
          <div
            className={`rounded-xl border p-3 lg:p-4 text-sm lg:text-base ${
              error
                ? "border-red-500/40 bg-red-500/10 text-red-200"
                : "border-yellow-400/30 bg-yellow-400/10 text-yellow-200"
            }`}
          >
            {error || "Syncing latest orders..."}
          </div>
        )}

        <div className="space-y-3 lg:space-y-4">{renderOrdersList()}</div>
      </div>

      {alertConfig && (
        <AlertModal
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          {...alertConfig}
        />
      )}
    </AdminLayout>
  );
};

const statusIcon = (status) => {
  const size = 16;
  switch (status.toLowerCase()) {
    case "processing":
      return <Eye size={size} />;
    case "shipped":
      return <Truck size={size} />;
    case "delivered":
      return <Check size={size} />;
    case "cancelled":
      return <XIcon size={size} />;
    default:
      return <Eye size={size} />;
  }
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs lg:text-sm text-gray-400">{label}</p>
    <p className="text-white text-sm lg:text-base break-words">{value}</p>
  </div>
);

export default OrdersListPage;
