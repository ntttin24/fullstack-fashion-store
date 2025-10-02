'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
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
    slug: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress?: string;
  paymentMethod?: string;
  items: OrderItem[];
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const orderStatusMap = {
  PENDING: { label: 'Chờ xác nhận', icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  PROCESSING: { label: 'Đang xử lý', icon: Package, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  SHIPPED: { label: 'Đang giao', icon: Truck, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  DELIVERED: { label: 'Đã giao', icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
  CANCELLED: { label: 'Đã hủy', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
};

const paymentMethodMap: { [key: string]: string } = {
  COD: 'Thanh toán khi nhận hàng (COD)',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
  CREDIT_CARD: 'Thẻ tín dụng',
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { isAuthenticated } = useAuthStore();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getById(orderId) as Order;
      setOrder(data);
    } catch (err: unknown) {
      console.error('Error fetching order:', err);
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin đơn hàng';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchOrder();
  }, [isAuthenticated, router, fetchOrder]);

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

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-gray-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy đơn hàng</h1>
          <p className="text-gray-600 mb-6">{error || 'Đơn hàng không tồn tại hoặc bạn không có quyền truy cập'}</p>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = orderStatusMap[order.status as keyof typeof orderStatusMap];
  const StatusIcon = statusInfo?.icon || Package;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Quay lại danh sách đơn hàng
      </Link>

      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Chi tiết đơn hàng</h1>
            <p className="text-gray-600">
              Mã đơn: <span className="font-mono font-semibold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</span>
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusInfo?.color}`}>
            <StatusIcon size={20} />
            <span className="font-semibold">{statusInfo?.label}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-gray-600">Ngày đặt hàng</p>
            <p className="font-medium">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
            <p className="font-medium">{formatDate(order.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Sản phẩm đã đặt</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
              <Link href={`/products/${item.productId}`} className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden hover:opacity-75 transition-opacity relative">
                  {item.product.images[0] && (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.productId}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                  <span>Màu sắc: <span className="font-medium">{item.color}</span></span>
                  <span>Kích thước: <span className="font-medium">{item.size}</span></span>
                  <span>Số lượng: <span className="font-medium">×{item.quantity}</span></span>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Đơn giá: </span>
                  <span className="font-semibold text-gray-900">{formatPrice(item.price)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Total */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Tổng cộng</span>
            <span className="text-2xl font-bold text-blue-600">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={20} className="text-gray-600" />
            <h2 className="text-lg font-bold">Địa chỉ giao hàng</h2>
          </div>
          <div className="space-y-2">
            <p className="font-medium">{order.user.name}</p>
            <p className="text-gray-600">{order.user.email}</p>
            {order.shippingAddress ? (
              <p className="text-gray-700 leading-relaxed">{order.shippingAddress}</p>
            ) : (
              <p className="text-gray-400 italic">Chưa có thông tin</p>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={20} className="text-gray-600" />
            <h2 className="text-lg font-bold">Phương thức thanh toán</h2>
          </div>
          <p className="text-gray-700">
            {order.paymentMethod 
              ? paymentMethodMap[order.paymentMethod] || order.paymentMethod
              : 'Chưa có thông tin'
            }
          </p>
        </div>
      </div>
    </div>
  );
}


