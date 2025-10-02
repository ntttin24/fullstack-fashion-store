'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Order {
  id: string;
  user: {
    name: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
  items: {
    quantity: number;
  }[];
}

const statusLabels: { [key: string]: { label: string; color: string } } = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
  SHIPPED: { label: 'Đã gửi', color: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchOrders();
        if (selectedOrder?.id === orderId) {
          const updated = await response.json();
          setSelectedOrder(updated);
        }
      } else {
        alert('Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Đã có lỗi xảy ra');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-600 mt-2">Tổng số: {orders.length} đơn hàng</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số SP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Chưa có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {order.user?.name || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.user?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.total.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.items?.length || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusLabels[order.status]?.color ||
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {statusLabels[order.status]?.label || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Chi tiết đơn hàng #{selectedOrder.id.slice(0, 8)}
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Thông tin khách hàng
                </h3>
                <p className="text-sm">
                  <span className="font-medium">Tên:</span>{' '}
                  {selectedOrder.user?.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{' '}
                  {selectedOrder.user?.email}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Trạng thái đơn hàng
                </h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    updateOrderStatus(selectedOrder.id, e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(statusLabels).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Tổng tiền
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedOrder.total.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}






