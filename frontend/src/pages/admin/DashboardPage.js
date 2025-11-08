import React from 'react';
import AdminLayout from './components/AdminLayout';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { BarChart3, Users, ShoppingBag, DollarSign } from 'lucide-react';

const DashboardPage = () => {
  const { orders, orderHistory } = useOrders();
  const { products } = useProducts();
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

  const allOrders = [...orders, ...orderHistory];
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
  const totalProducts = products.length;
  const totalUsers = registeredUsers.length;
  const totalOrders = allOrders.length;

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-400 to-green-600'
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: BarChart3,
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Total Products',
      value: totalProducts,
      icon: ShoppingBag,
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const recentOrders = allOrders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-gray-900 rounded-2xl p-6 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-black`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-800">
                  <th className="pb-3 text-gray-400 font-medium">Order ID</th>
                  <th className="pb-3 text-gray-400 font-medium">Date</th>
                  <th className="pb-3 text-gray-400 font-medium">Customer</th>
                  <th className="pb-3 text-gray-400 font-medium">Status</th>
                  <th className="pb-3 text-gray-400 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-800">
                    <td className="py-4 text-yellow-400">{order.id}</td>
                    <td className="py-4 text-gray-300">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-gray-300">
                      {order.shipping?.firstName} {order.shipping?.lastName}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          {
                            'Processing': 'bg-yellow-400/10 text-yellow-400',
                            'Shipped': 'bg-blue-400/10 text-blue-400',
                            'Delivered': 'bg-green-400/10 text-green-400',
                            'Cancelled': 'bg-red-400/10 text-red-400'
                          }[order.status] || 'bg-gray-400/10 text-gray-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right text-gray-300">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;