'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, ShoppingBag, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  product: {
    id: string;
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  shippingAddress?: string;
  paymentMethod?: string;
  items: OrderItem[];
}

const orderStatusMap = {
  PENDING: { label: 'Chờ xác nhận', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
  PROCESSING: { label: 'Đang xử lý', icon: Package, color: 'text-blue-600 bg-blue-50' },
  SHIPPED: { label: 'Đang giao', icon: Truck, color: 'text-purple-600 bg-purple-50' },
  DELIVERED: { label: 'Đã giao', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  CANCELLED: { label: 'Đã hủy', icon: XCircle, color: 'text-red-600 bg-red-50' },
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getAll() as Order[];
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFilteredOrders = () => {
    if (filter === 'ALL') return orders;
    return orders.filter(order => order.status === filter);
  };

  const filteredOrders = getFilteredOrders();

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
        <p className="text-gray-600">Quản lý và theo dõi đơn hàng của bạn</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-2 p-4 border-b">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả ({orders.length})
          </button>
          {Object.entries(orderStatusMap).map(([status, { label }]) => {
            const count = orders.filter(o => o.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h2>
          <p className="text-gray-600 mb-6">
            {filter === 'ALL' 
              ? 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!'
              : `Không có đơn hàng nào ở trạng thái "${orderStatusMap[filter as keyof typeof orderStatusMap]?.label}"`
            }
          </p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusInfo = orderStatusMap[order.status as keyof typeof orderStatusMap];
            const StatusIcon = statusInfo?.icon || Package;

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo?.color}`}>
                        <StatusIcon size={16} />
                        <span className="text-sm font-medium">{statusInfo?.label}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Mã đơn: <span className="font-mono font-semibold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                          {item.product.images[0] && (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.color} / {item.size} × {item.quantity}
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Tổng tiền</p>
                      <p className="text-xl font-bold text-blue-600">{formatPrice(order.total)}</p>
                    </div>
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Xem chi tiết
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


