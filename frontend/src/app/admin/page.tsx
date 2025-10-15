'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Download,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  pendingOrders: number;
  lowStockCount: number;
  recentOrders: Array<{
    id: string;
    user: { name: string };
    total: number;
    status: string;
    createdAt: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    price: number;
  }>;
  revenueData: Array<{
    label: string;
    revenue: number;
    date: string;
    orders: number;
  }>;
  previousPeriodRevenue: number;
  totalRevenueForPeriod: number;
  averageOrderValue: number;
}


export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    dailyRevenue: 0,
    monthlyRevenue: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    recentOrders: [],
    lowStockProducts: [],
    revenueData: [],
    previousPeriodRevenue: 0,
    totalRevenueForPeriod: 0,
    averageOrderValue: 0
  });
  const [loading, setLoading] = useState(true);

  // Memoize fetcher to satisfy hook deps
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const products = await productsRes.json();
      const orders = await ordersRes.json();
      const users = await usersRes.json();

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      type OrderForStats = { createdAt: string; total?: number; status?: string; user?: { name?: string } };
      type ProductForStats = { id: string; name: string; stock: number; price: number };

      const safeOrders: OrderForStats[] = Array.isArray(orders) ? orders : [];
      const safeProducts: ProductForStats[] = Array.isArray(products) ? products : [];

      const dailyRevenue = safeOrders
        .filter(order => new Date(order.createdAt) >= startOfDay)
        .reduce((sum: number, order: OrderForStats) => sum + (order.total || 0), 0);

      const monthlyRevenue = safeOrders
        .filter(order => new Date(order.createdAt) >= startOfMonth)
        .reduce((sum: number, order: OrderForStats) => sum + (order.total || 0), 0);

      const pendingOrders = safeOrders.filter(order => order.status === 'PENDING').length;

      const lowStockProducts = safeProducts
        .filter(p => p.stock < 10)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5);

      const lowStockCount = safeProducts.filter(p => p.stock < 10).length;

      const recentOrders = safeOrders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5) as DashboardStats['recentOrders'];

      const { revenueData, previousPeriodRevenue, totalRevenueForPeriod, averageOrderValue } = calculateRevenueData(safeOrders, '7days', now);

      setStats({
        totalProducts: safeProducts.length,
        totalOrders: safeOrders.length,
        totalUsers: Array.isArray(users) ? users.length : 0,
        dailyRevenue,
        monthlyRevenue,
        pendingOrders,
        lowStockCount,
        recentOrders,
        lowStockProducts,
        revenueData,
        previousPeriodRevenue,
        totalRevenueForPeriod,
        averageOrderValue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);


  const refreshData = () => {
    setLoading(true);
    fetchStats();
  };

  const calculateRevenueData = (orders: Array<{ createdAt: string; total?: number }>, filter: string, now: Date) => {
    if (!Array.isArray(orders)) {
      return {
        revenueData: [],
        previousPeriodRevenue: 0,
        totalRevenueForPeriod: 0,
        averageOrderValue: 0
      };
    }

    const revenueData = [];
    let periods = 0;
    let periodType = '';
    let dateFormat: Intl.DateTimeFormatOptions = {};

    // Configure periods and format based on filter
    switch (filter) {
      case '7days':
        periods = 7;
        periodType = 'days';
        dateFormat = { weekday: 'short', day: '2-digit' };
        break;
      case '30days':
        periods = 30;
        periodType = 'days';
        dateFormat = { day: '2-digit', month: 'short' };
        break;
      case '3months':
        periods = 12; // 12 weeks
        periodType = 'weeks';
        dateFormat = { day: '2-digit', month: 'short' };
        break;
      case '6months':
        periods = 6;
        periodType = 'months';
        dateFormat = { month: 'short', year: 'numeric' };
        break;
      case '1year':
        periods = 12;
        periodType = 'months';
        dateFormat = { month: 'short', year: 'numeric' };
        break;
      default:
        periods = 7;
        periodType = 'days';
        dateFormat = { weekday: 'short', day: '2-digit' };
    }

    // Generate revenue data for current period
    for (let i = periods - 1; i >= 0; i--) {
      let periodStart: Date;
      let periodEnd: Date;
      let label: string;

      if (periodType === 'days') {
        periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodEnd.getDate() + 1);
        label = periodStart.toLocaleDateString('vi-VN', dateFormat);
      } else if (periodType === 'weeks') {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7));
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week
        periodStart = weekStart;
        periodEnd = new Date(weekStart);
        periodEnd.setDate(periodEnd.getDate() + 7);
        label = `${periodStart.getDate()}/${periodStart.getMonth() + 1}`;
      } else { // months
        periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        periodEnd = new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, 1);
        label = periodStart.toLocaleDateString('vi-VN', dateFormat);
      }

      const periodOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= periodStart && orderDate < periodEnd;
      });

      const revenue = periodOrders.reduce((sum: number, order: { total?: number }) => sum + (order.total || 0), 0);
      const orderCount = periodOrders.length;

      revenueData.push({
        label,
        revenue,
        date: periodStart.toISOString(),
        orders: orderCount
      });
    }

    // Calculate previous period for comparison
    const currentPeriodStart = new Date(revenueData[0]?.date || now);
    const currentPeriodEnd = new Date(now);
    let previousPeriodStart: Date;
    let previousPeriodEnd: Date;

    if (periodType === 'days') {
      const daysDiff = Math.ceil((currentPeriodEnd.getTime() - currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
      previousPeriodEnd = new Date(currentPeriodStart);
      previousPeriodStart = new Date(previousPeriodEnd);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - daysDiff);
    } else if (periodType === 'weeks') {
      previousPeriodEnd = new Date(currentPeriodStart);
      previousPeriodStart = new Date(previousPeriodEnd);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - (periods * 7));
    } else { // months
      previousPeriodEnd = new Date(currentPeriodStart);
      previousPeriodStart = new Date(previousPeriodEnd);
      previousPeriodStart.setMonth(previousPeriodStart.getMonth() - periods);
    }

    const previousPeriodOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= previousPeriodStart && orderDate < previousPeriodEnd;
    });

    const previousPeriodRevenue = previousPeriodOrders.reduce((sum: number, order: { total?: number }) => sum + (order.total || 0), 0);
    const totalRevenueForPeriod = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrdersForPeriod = revenueData.reduce((sum, item) => sum + item.orders, 0);
    const averageOrderValue = totalOrdersForPeriod > 0 ? totalRevenueForPeriod / totalOrdersForPeriod : 0;

    return {
      revenueData,
      previousPeriodRevenue,
      totalRevenueForPeriod,
      averageOrderValue
    };
  };


  const statCards = [
    {
      title: 'Tổng sản phẩm',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Tổng đơn hàng',
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
      title: 'Doanh thu ngày',
      value: `${stats.dailyRevenue.toLocaleString('vi-VN')}đ`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Doanh thu tháng',
      value: `${stats.monthlyRevenue.toLocaleString('vi-VN')}đ`,
      icon: TrendingUp,
      color: 'bg-emerald-500',
    },
  ];

  const alertCards = [
    {
      title: 'Đơn hàng chờ xử lý',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-orange-500',
      link: '/admin/orders',
    },
    {
      title: 'Sản phẩm sắp hết hàng',
      value: stats.lowStockCount,
      icon: AlertTriangle,
      color: 'bg-red-500',
      link: '/admin/products',
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tổng quan hệ thống</p>
        </div>
        <div className="text-sm text-gray-500">
          Cập nhật: {new Date().toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${card.color} p-2 rounded-lg`}>
                  <Icon className="text-white" size={20} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {card.title}
              </h3>
              <p className="text-xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alertCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.link}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 block"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`${card.color} p-2 rounded-lg`}>
                    <Icon className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-gray-700 font-medium text-sm">
                      {card.title}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
                <ArrowUpRight className="text-gray-400" size={16} />
              </div>
            </Link>
          );
        })}
      </div>



      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Đơn hàng gần đây</h2>
            <Link 
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              Xem tất cả
              <ArrowUpRight size={14} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Chưa có đơn hàng nào
              </p>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
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

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Sản phẩm sắp hết hàng</h2>
            <Link 
              href="/admin/products"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              Quản lý
              <ArrowUpRight size={14} className="ml-1" />
            </Link>
          </div>
          {stats.lowStockProducts.length === 0 ? (
            <div className="text-center py-4">
              <CheckCircle2 className="text-green-500 mx-auto mb-2" size={24} />
              <p className="text-gray-500 text-sm">Tất cả sản phẩm đều còn đủ hàng</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {product.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {product.stock === 0 ? (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-semibold">
                          Hết hàng
                        </span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                          Còn {product.stock}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {product.price.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                  <Link 
                    href={`/admin/products/${product.id}`}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    Cập nhật
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



