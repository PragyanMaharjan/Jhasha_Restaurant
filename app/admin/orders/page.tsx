'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import AdminSidebar from '@/components/AdminSidebar';
import { toast } from 'react-toastify';

interface OrderItem {
  foodId: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  items?: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryZipCode?: string;
  phoneNumber?: string;
  notes?: string;
  createdAt: string;
}

export default function AdminOrders() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, user, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get('/orders/admin/all');
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await API.put(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });
      fetchOrders();
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card bg-white overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Order Status</th>
                  <th className="p-3 text-left">Payment</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">{order._id.slice(-6)}</td>
                    <td className="p-3">
                      <div>
                        <p className="font-semibold">{order.userId?.name}</p>
                        <p className="text-sm text-gray-600">{order.userId?.email}</p>
                      </div>
                    </td>
                    <td className="p-3">Rs.{order.totalAmount.toFixed(2)}</td>
                    <td className="p-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded capitalize"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : order.paymentStatus === 'failed'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold">{selectedOrder._id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold">
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="border-t pt-4">
                    <h3 className="font-bold text-lg mb-2">Customer Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold">{selectedOrder.userId?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold">{selectedOrder.userId?.email}</p>
                      </div>
                      {selectedOrder.phoneNumber && (
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-semibold">{selectedOrder.phoneNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {selectedOrder.deliveryAddress && (
                    <div className="border-t pt-4">
                      <h3 className="font-bold text-lg mb-2">Delivery Address</h3>
                      <p>{selectedOrder.deliveryAddress}</p>
                      <p>
                        {selectedOrder.deliveryCity}
                        {selectedOrder.deliveryZipCode && `, ${selectedOrder.deliveryZipCode}`}
                      </p>
                    </div>
                  )}

                  {/* Order Items */}
                  {selectedOrder.items && selectedOrder.items.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="font-bold text-lg mb-2">Order Items</h3>
                      <div className="space-y-2">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                            <div>
                              <p className="font-semibold">{item.foodId?.name}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">
                              Rs.{((item.foodId?.price || 0) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Status */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order Status</p>
                        <p className="font-semibold capitalize">
                          {selectedOrder.orderStatus.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <p className="font-semibold capitalize">{selectedOrder.paymentStatus}</p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <div className="border-t pt-4">
                      <h3 className="font-bold text-lg mb-2">Notes</h3>
                      <p className="text-gray-700">{selectedOrder.notes}</p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total Amount</span>
                      <span>Rs.{selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
