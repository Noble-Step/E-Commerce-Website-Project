import React, { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import { useOrders } from '../../context/OrderContext';
import AlertModal from '../../modals/AlertModal';
import { Eye, ChevronDown, ChevronUp, Truck, Check, X as XIcon } from 'lucide-react';

const OrdersPage = () => {
  const { orders, orderHistory, updateOrderStatus } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  const allOrders = [...orders, ...orderHistory].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    setAlertConfig({
      type: 'success',
      title: 'Order Updated',
      message: `Order status has been updated to ${newStatus}`
    });
    setShowAlert(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Processing': return 'bg-yellow-400/10 text-yellow-400';
      case 'Shipped': return 'bg-blue-400/10 text-blue-400';
      case 'Delivered': return 'bg-green-400/10 text-green-400';
      case 'Cancelled': return 'bg-red-400/10 text-red-400';
      default: return 'bg-gray-400/10 text-gray-400';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Orders</h1>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {allOrders.map((order) => (
            <div key={order.id} className="bg-gray-900 rounded-2xl overflow-hidden">
              {/* Order Header */}
              <div className="p-6 flex flex-wrap gap-4 items-start justify-between border-b border-gray-800">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-yellow-400">{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Total Amount</p>
                    <p className="font-semibold text-white">${order.total.toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="p-2 text-gray-400 hover:text-white rounded-lg transition"
                  >
                    {expandedOrder === order.id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Order Details (Expandable) */}
              {expandedOrder === order.id && (
                <div className="p-6 space-y-6">
                  {/* Customer Details */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Customer Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Name</p>
                        <p className="text-white">{order.shipping.firstName} {order.shipping.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white">{order.shipping.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="text-white">{order.shipping.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Address</p>
                        <p className="text-white">
                          {order.shipping.address}, {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-black rounded-lg">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-white">{item.title}</p>
                            <p className="text-sm text-gray-400">
                              Quantity: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold text-white">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="border-t border-gray-800 pt-6">
                    <h4 className="font-semibold text-white mb-3">Update Status</h4>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'Processing')}
                        disabled={order.status === 'Processing'}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                          order.status === 'Processing'
                            ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                            : 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20'
                        }`}
                      >
                        <Eye size={18} />
                        Processing
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'Shipped')}
                        disabled={order.status === 'Shipped'}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                          order.status === 'Shipped'
                            ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-400/10 text-blue-400 hover:bg-blue-400/20'
                        }`}
                      >
                        <Truck size={18} />
                        Shipped
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                        disabled={order.status === 'Delivered'}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                          order.status === 'Delivered'
                            ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                            : 'bg-green-400/10 text-green-400 hover:bg-green-400/20'
                        }`}
                      >
                        <Check size={18} />
                        Delivered
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
                        disabled={order.status === 'Cancelled'}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                          order.status === 'Cancelled'
                            ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                            : 'bg-red-400/10 text-red-400 hover:bg-red-400/20'
                        }`}
                      >
                        <XIcon size={18} />
                        Cancelled
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Alert Modal */}
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

export default OrdersPage;