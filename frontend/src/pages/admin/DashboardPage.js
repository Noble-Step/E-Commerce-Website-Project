import React from "react";
import AdminLayout from "./components/AdminLayout";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";
import { useUser } from "../../context/UserContext";
import { BarChart3, Users, ShoppingBag, DollarSign } from "lucide-react";

const statusBadge = {
  processing: "bg-yellow-400/10 text-yellow-400",
  shipped: "bg-blue-400/10 text-blue-400",
  delivered: "bg-green-400/10 text-green-400",
  cancelled: "bg-red-400/10 text-red-400",
};

const DashboardPage = () => {
  const { orders, orderHistory } = useOrders();
  const { products } = useProducts();
  const { registeredUsers } = useUser();

  const allOrders = [...orders, ...orderHistory];
  const totalRevenue = allOrders
    .filter((order) => order.status?.toLowerCase() !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totalProducts = products.length;
  const totalUsers = registeredUsers.length;
  const totalOrders = allOrders.length;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "from-green-400 to-green-600",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: BarChart3,
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: ShoppingBag,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "from-purple-400 to-purple-600",
    },
  ];

  const recentOrders = [...allOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.date || 0) -
        new Date(a.createdAt || a.date || 0)
    )
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={stat.title}
              className="bg-gray-900 rounded-xl lg:rounded-2xl p-4 lg:p-6 flex items-center gap-3 lg:gap-4"
              aria-live="polite"
            >
              <div
                className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-black flex-shrink-0`}
              >
                <stat.icon size={20} className="lg:w-6 lg:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs lg:text-sm text-gray-400">{stat.title}</p>
                <p className="text-xl lg:text-2xl font-bold text-white truncate">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-900 rounded-xl lg:rounded-2xl p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-lg lg:text-xl font-semibold text-white">
              Recent Orders
            </h2>
            <span className="text-xs lg:text-sm text-gray-500">
              Showing {recentOrders.length} of {totalOrders} orders
            </span>
          </div>
          {recentOrders.length === 0 ? (
            <div className="py-12 lg:py-16 text-center text-gray-400">
              <p className="text-base lg:text-lg font-semibold text-white mb-2">
                No orders yet
              </p>
              <p className="text-sm text-gray-500">
                Orders will appear here as soon as customers complete checkout.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 lg:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-800">
                      <th className="pb-3 px-4 lg:px-0 text-gray-400 font-medium text-xs lg:text-sm">
                        Order ID
                      </th>
                      <th className="pb-3 px-2 text-gray-400 font-medium text-xs lg:text-sm hidden sm:table-cell">
                        Date
                      </th>
                      <th className="pb-3 px-2 text-gray-400 font-medium text-xs lg:text-sm">
                        Customer
                      </th>
                      <th className="pb-3 px-2 text-gray-400 font-medium text-xs lg:text-sm">
                        Status
                      </th>
                      <th className="pb-3 px-4 lg:px-2 text-gray-400 font-medium text-right text-xs lg:text-sm">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => {
                      const orderId = order.id || order._id;
                      const customerName =
                        `${order.shipping?.firstName || ""} ${
                          order.shipping?.lastName || ""
                        }`.trim() || "Customer";
                      const badge =
                        statusBadge[order.status] ||
                        "bg-gray-400/10 text-gray-400";
                      return (
                        <tr key={orderId} className="border-b border-gray-800">
                          <td className="py-3 lg:py-4 px-4 lg:px-0 text-yellow-400 text-xs lg:text-sm truncate max-w-[100px] lg:max-w-none">
                            {orderId}
                          </td>
                          <td className="py-3 lg:py-4 px-2 text-gray-300 text-xs lg:text-sm hidden sm:table-cell">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="py-3 lg:py-4 px-2 text-gray-300 text-xs lg:text-sm truncate max-w-[120px]">
                            {customerName}
                          </td>
                          <td className="py-3 lg:py-4 px-2">
                            <span
                              className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${badge}`}
                            >
                              {order.status || "Processing"}
                            </span>
                          </td>
                          <td className="py-3 lg:py-4 px-4 lg:px-2 text-right text-gray-300 text-xs lg:text-sm whitespace-nowrap">
                            ${Number(order.total || 0).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
