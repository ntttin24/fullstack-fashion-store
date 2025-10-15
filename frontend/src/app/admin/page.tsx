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
  const [chartFilter, setChartFilter] = useState<'7days' | '30days' | '3months' | '6months' | '1year'>('7days');

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

      const { revenueData, previousPeriodRevenue, totalRevenueForPeriod, averageOrderValue } = calculateRevenueData(safeOrders, chartFilter, now);

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
  }, [chartFilter]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const exportChartData = () => {
    const csvContent = [
      ['Thời gian', 'Doanh thu (VNĐ)', 'Số đơn hàng'],
      ...stats.revenueData.map(item => [
        item.label,
        item.revenue.toString(),
        item.orders.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `doanh-thu-${chartFilter}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {/* Enhanced Revenue Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Chart Header */}
        <div className="flex flex-col space-y-4 mb-6">
          {/* Title and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Biểu đồ doanh thu
                </h2>
                <p className="text-sm text-gray-500">
                  Theo dõi xu hướng doanh thu theo thời gian
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 mt-3 sm:mt-0">
              <button
                onClick={refreshData}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Làm mới</span>
              </button>
              <button
                onClick={exportChartData}
                disabled={stats.revenueData.length === 0}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Xuất CSV</span>
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Tổng doanh thu</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {stats.totalRevenueForPeriod.toLocaleString('vi-VN')}đ
              </p>
            </div>
            
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-sm text-gray-600">So với kỳ trước</span>
              </div>
              <p className={`text-lg font-bold mt-1 ${
                stats.totalRevenueForPeriod >= stats.previousPeriodRevenue 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {stats.previousPeriodRevenue > 0 
                  ? `${((stats.totalRevenueForPeriod - stats.previousPeriodRevenue) / stats.previousPeriodRevenue * 100).toFixed(1)}%`
                  : 'N/A'
                }
              </p>
            </div>
            
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <DollarSign className="w-3 h-3 text-purple-500" />
                <span className="text-sm text-gray-600">Giá trị TB/đơn</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {Math.round(stats.averageOrderValue).toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>
          
          {/* Time Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: '7days', label: '7 ngày' },
              { key: '30days', label: '30 ngày' },
              { key: '3months', label: '3 tháng' },
              { key: '6months', label: '6 tháng' },
              { key: '1year', label: '1 năm' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setChartFilter(filter.key as typeof chartFilter)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  chartFilter === filter.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center h-80 text-gray-500">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Đang tải dữ liệu biểu đồ...</p>
              </div>
            </div>
          ) : stats.revenueData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Không có dữ liệu doanh thu</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Revolutionary Revenue Chart */}
              <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm overflow-hidden">
                {/* Modern Chart Header */}
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Doanh Thu Theo Thời Gian</h3>
                          <p className="text-blue-100 text-sm">Phân tích xu hướng kinh doanh</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {stats.totalRevenueForPeriod.toLocaleString('vi-VN')}đ
                        </div>
                        <div className="text-blue-100 text-sm">Tổng doanh thu</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Statistics Bar */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.revenueData.reduce((sum, item) => sum + item.orders, 0)}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Tổng đơn hàng</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(stats.averageOrderValue).toLocaleString('vi-VN')}đ
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Giá trị TB/đơn</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.max(...stats.revenueData.map(d => d.revenue)).toLocaleString('vi-VN')}đ
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Ngày cao nhất</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {stats.revenueData.filter(d => d.revenue > 0).length}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Ngày có doanh thu</div>
                    </div>
                  </div>
                </div>

                {/* Revolutionary Chart Area */}
                <div className="p-6">
                  <div className="relative">
                    {/* Chart Container */}
                    <div className="relative h-96 bg-gradient-to-t from-gray-50/50 to-transparent rounded-xl p-4 overflow-hidden">
                      {/* Scroll Hint */}
                      <div className="absolute top-2 right-2 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-500 font-medium shadow-sm">
                        ← Kéo để xem thêm →
                      </div>
                      {/* Animated Background Grid */}
                      <div className="absolute inset-0">
                        {Array.from({ length: 6 }, (_, i) => (
                          <div 
                            key={i} 
                            className="absolute w-full border-t border-gray-200/50"
                            style={{ top: `${i * 20}%` }}
                          ></div>
                        ))}
                        {Array.from({ length: 8 }, (_, i) => (
                          <div 
                            key={i} 
                            className="absolute h-full border-l border-gray-200/30"
                            style={{ left: `${i * 12.5}%` }}
                          ></div>
                        ))}
                      </div>

                      {/* Y-Axis with Better Formatting */}
                      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 pr-4 font-medium">
                        {(() => {
                          const maxRevenue = Math.max(...stats.revenueData.map(d => d.revenue));
                          const steps = 5;
                          const stepValue = maxRevenue / steps;
                          return Array.from({ length: steps + 1 }, (_, i) => (
                            <div key={i} className="text-right bg-white/80 px-2 py-1 rounded">
                              {((steps - i) * stepValue / 1000000).toFixed(1)}M
                            </div>
                          ));
                        })()}
                      </div>
                      
                      {/* Revolutionary Chart Bars */}
                      <div 
                        className="flex items-end h-full gap-3 ml-16 overflow-x-auto overflow-y-hidden pb-4" 
                        style={{ 
                          minWidth: 'max-content',
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#d1d5db #f3f4f6',
                          WebkitOverflowScrolling: 'touch',
                          scrollBehavior: 'smooth',
                          paddingLeft: '8px',
                          paddingRight: '8px'
                        }}
                      >
                        {stats.revenueData.map((item, index) => {
                          const maxRevenue = Math.max(...stats.revenueData.map(d => d.revenue));
                          const barHeight = maxRevenue > 0 && item.revenue > 0 
                            ? Math.max(40, (item.revenue / maxRevenue) * 320)
                            : 8;
                          
                          // Dynamic color based on performance
                          const performance = maxRevenue > 0 ? (item.revenue / maxRevenue) : 0;
                          let barColor = 'from-gray-300 to-gray-400';
                          if (performance > 0.8) barColor = 'from-green-500 to-emerald-400';
                          else if (performance > 0.6) barColor = 'from-blue-500 to-cyan-400';
                          else if (performance > 0.4) barColor = 'from-yellow-500 to-orange-400';
                          else if (performance > 0.2) barColor = 'from-orange-500 to-red-400';
                          else if (performance > 0) barColor = 'from-red-500 to-pink-400';
                          
                          return (
                            <div key={index} className="flex flex-col items-center group relative" style={{ minWidth: '80px', flexShrink: 0 }}>
                              {/* Enhanced Tooltip */}
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -top-24 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-2xl px-4 py-3 pointer-events-none z-30 whitespace-nowrap shadow-2xl border border-white/20">
                                <div className="font-bold text-lg text-center">{item.revenue.toLocaleString('vi-VN')}đ</div>
                                <div className="text-gray-300 text-center">{item.orders} đơn hàng</div>
                                <div className="text-gray-400 text-xs text-center mt-1">{item.label}</div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-6 border-transparent border-t-gray-900/95"></div>
                              </div>
                              
                              {/* Performance Badge */}
                              {item.revenue > 0 && performance > 0.7 && (
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                                  🔥 TOP
                                </div>
                              )}
                              
                              {/* Value Above Bar */}
                              {item.revenue > 0 && (
                                <div className="text-sm font-bold text-gray-800 mb-2 bg-white/80 px-2 py-1 rounded-lg shadow-sm">
                                  {item.revenue >= 1000000 
                                    ? `${(item.revenue / 1000000).toFixed(1)}M`
                                    : item.revenue >= 1000
                                    ? `${(item.revenue / 1000).toFixed(0)}K`
                                    : item.revenue.toLocaleString('vi-VN')
                                  }
                                </div>
                              )}
                              
                              {/* Revolutionary Bar with Animation */}
                              <div 
                                className={`w-full rounded-t-2xl transition-all duration-1000 cursor-pointer shadow-lg hover:shadow-2xl transform hover:-translate-y-1 bg-gradient-to-t ${barColor} hover:scale-105 relative overflow-hidden`}
                                style={{ 
                                  height: `${barHeight}px`,
                                  minHeight: item.revenue > 0 ? '40px' : '8px'
                                }}
                              >
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
                                
                                {/* Performance Indicator */}
                                {item.revenue > 0 && (
                                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
                                )}
                              </div>
                              
                              {/* Enhanced Date Label */}
                              <div className="mt-3 text-sm text-gray-700 text-center font-bold bg-white/60 px-2 py-1 rounded-lg">
                                {item.label}
                              </div>
                              
                              {/* Order Count with Icon */}
                              <div className="flex items-center gap-1 text-xs text-gray-500 text-center mt-1">
                                <ShoppingCart className="w-3 h-3" />
                                {item.orders}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Scroll Indicators */}
                      <div className="absolute left-16 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      </div>
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    {/* Enhanced Legend */}
                    <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                      <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gradient-to-t from-green-500 to-emerald-400 rounded"></div>
                          <span className="font-medium">Xuất sắc (80%+)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gradient-to-t from-blue-500 to-cyan-400 rounded"></div>
                          <span className="font-medium">Tốt (60-80%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gradient-to-t from-yellow-500 to-orange-400 rounded"></div>
                          <span className="font-medium">Trung bình (40-60%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gradient-to-t from-orange-500 to-red-400 rounded"></div>
                          <span className="font-medium">Thấp (20-40%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gradient-to-t from-red-500 to-pink-400 rounded"></div>
                          <span className="font-medium">Rất thấp (&lt;20%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Summary Table */}
              <div className="block sm:hidden mt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Chi tiết doanh thu</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {stats.revenueData.slice(-7).map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {item.revenue.toLocaleString('vi-VN')}đ
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.orders} đơn
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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



