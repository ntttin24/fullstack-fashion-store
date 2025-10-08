'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
    product: {
      name: string;
      images: string[];
    };
  }>;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-600">
          Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : order ? (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-6 pb-6 border-b">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Thông tin đơn hàng</h2>
                <p className="text-gray-600">Mã đơn hàng: <span className="font-mono font-semibold">{order.id}</span></p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  {order.status === 'PENDING' ? 'Chờ xử lý' : order.status}
                </span>
              </div>
            </div>
            <p className="text-gray-600">
              Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-4">Sản phẩm đã đặt:</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.color} / {item.size}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.price.toLocaleString('vi-VN')}₫ x {item.quantity}
                    </p>
                  </div>
                  <div className="font-semibold">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between text-xl font-bold">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{order.total.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Không tìm thấy thông tin đơn hàng</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/orders"
          className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Package size={20} className="mr-2" />
          Xem đơn hàng của tôi
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tiếp tục mua sắm
          <ArrowRight size={20} className="ml-2" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}


