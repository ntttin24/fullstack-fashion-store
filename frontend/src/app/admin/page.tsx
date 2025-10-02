'use client';

import { useEffect, useState } from 'react';
import { 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalUsers: number;
  revenue: number;
}

interface Order {
  id: string;
  user: {
    name: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  stock: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all data in parallel
      const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const products: Product[] = await productsRes.json();
      const categories = await categoriesRes.json();
      const orders: Order[] = await ordersRes.json();
      const users = await usersRes.json();

      // Calculate revenue from orders
      const revenue = Array.isArray(orders) 
        ? orders.reduce((sum: number, order: Order) => sum + (order.total || 0), 0)
        : 0;

      setStats({
        totalProducts: Array.isArray(products) ? products.length : 0,
        totalCategories: Array.isArray(categories) ? categories.length : 0,
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        totalUsers: Array.isArray(users) ? users.length : 0,
        revenue,
      });

      // Get recent orders (last 5)
      if (Array.isArray(orders)) {
        const sorted = [...orders].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentOrders(sorted.slice(0, 5));

        // Count orders by status
        const statusCount: Record<string, number> = {};
        orders.forEach((order) => {
          statusCount[order.status] = (statusCount[order.status] || 0) + 1;
        });
        setOrdersByStatus(statusCount);
      }

      // Get low stock products
      if (Array.isArray(products)) {
        const lowStock = products
          .filter((p) => p.stock < 10)
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 5);
        setLowStockProducts(lowStock);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Sản phẩm',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Danh mục',
      value: stats.totalCategories,
      icon: FolderTree,
      color: 'bg-green-500',
    },
    {
      title: 'Đơn hàng',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-yellow-500',
    },
    {
      title: 'Người dùng',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Doanh thu',
      value: `${stats.revenue.toLocaleString('vi-VN')}đ`,
      icon: TrendingUp,
      color: 'bg-red-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Tổng quan hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Đơn hàng gần đây
            </h2>
            <Link 
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Chưa có đơn hàng nào
              </p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {order.user?.name || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">
                      {order.total.toLocaleString('vi-VN')}đ
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status === 'PENDING' ? 'Chờ xử lý' :
                       order.status === 'DELIVERED' ? 'Đã giao' :
                       order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Trạng thái đơn hàng
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <Clock className="text-yellow-600 mr-2" size={18} />
                <span className="text-gray-600">Chờ xử lý</span>
              </div>
              <span className="font-semibold text-gray-900">
                {ordersByStatus['PENDING'] || 0}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <Package className="text-blue-600 mr-2" size={18} />
                <span className="text-gray-600">Đang xử lý</span>
              </div>
              <span className="font-semibold text-gray-900">
                {ordersByStatus['PROCESSING'] || 0}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <TrendingUp className="text-purple-600 mr-2" size={18} />
                <span className="text-gray-600">Đã gửi</span>
              </div>
              <span className="font-semibold text-gray-900">
                {ordersByStatus['SHIPPED'] || 0}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <CheckCircle2 className="text-green-600 mr-2" size={18} />
                <span className="text-gray-600">Đã giao</span>
              </div>
              <span className="font-semibold text-gray-900">
                {ordersByStatus['DELIVERED'] || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Sản phẩm sắp hết hàng
            </h2>
            <Link 
              href="/admin/products"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Xem tất cả
            </Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              Tất cả sản phẩm đều còn đủ hàng
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm mb-1">
                        {product.name}
                      </p>
                      <div className="flex items-center">
                        {product.stock === 0 ? (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-semibold">
                            Hết hàng
                          </span>
                        ) : product.stock < 5 ? (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-semibold">
                            Còn {product.stock}
                          </span>
                        ) : (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                            Còn {product.stock}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link 
                      href={`/admin/products/${product.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Cập nhật
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



