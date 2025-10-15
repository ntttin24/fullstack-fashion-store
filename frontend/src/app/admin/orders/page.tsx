'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Eye, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  User,
  Package,
  DollarSign,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { API_URL } from '@/lib/api';
import Image from 'next/image';

interface OrderItem {
  id: string;
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
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  total: number;
  status: string;
  shippingAddress?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const statusLabels: { [key: string]: { label: string; color: string; icon: React.ComponentType<{ className?: string }> } } = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800', icon: Package },
  SHIPPED: { label: 'Đã gửi', color: 'bg-purple-100 text-purple-800', icon: Truck },
  DELIVERED: { label: 'Đã giao', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const paymentMethodLabels: { [key: string]: string } = {
  COD: 'Thanh toán khi nhận hàng',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
  CREDIT_CARD: 'Thẻ tín dụng',
  PAYPAL: 'PayPal',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const ordersData = Array.isArray(data) ? data : [];
      setOrders(ordersData);
      calculateStats(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateStats = (ordersData: Order[]) => {
    const stats = {
      total: ordersData.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0,
    };

    ordersData.forEach(order => {
      stats[order.status.toLowerCase() as keyof typeof stats]++;
      if (order.status === 'DELIVERED') {
        stats.totalRevenue += order.total;
      }
    });

    setStats(stats);
  };

  const applyFilters = useCallback(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'ALL') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'TODAY':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
        case 'WEEK':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
        case 'MONTH':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof Order] as string | number;
      let bValue: string | number = b[sortBy as keyof Order] as string | number;

      if (sortBy === 'user') {
        aValue = a.user.name;
        bValue = b.user.name;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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

  const bulkUpdateStatus = async (orderIds: string[], newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const promises = orderIds.map(id => 
        fetch(`${API_URL}/orders/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        })
      );

      await Promise.all(promises);
      await fetchOrders();
      setSelectedOrders([]);
      alert(`Đã cập nhật ${orderIds.length} đơn hàng`);
    } catch (error) {
      console.error('Error bulk updating orders:', error);
      alert('Đã có lỗi xảy ra');
    }
  };

  const exportOrders = () => {
    const csvContent = [
      ['Mã đơn', 'Khách hàng', 'Email', 'Tổng tiền', 'Trạng thái', 'Ngày đặt', 'Phương thức thanh toán'],
      ...filteredOrders.map(order => [
        order.id.slice(0, 8),
        order.user.name,
        order.user.email,
        order.total.toLocaleString('vi-VN'),
        statusLabels[order.status]?.label || order.status,
        new Date(order.createdAt).toLocaleDateString('vi-VN'),
        paymentMethodLabels[order.paymentMethod || ''] || order.paymentMethod || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    const currentPageOrders = getCurrentPageOrders();
    const allSelected = currentPageOrders.every(order => selectedOrders.includes(order.id));
    
    if (allSelected) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(currentPageOrders.map(order => order.id));
    }
  };

  const getCurrentPageOrders = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Tổng số: {stats.total} đơn hàng • Doanh thu: {stats.totalRevenue.toLocaleString('vi-VN')}đ
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={exportOrders}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Xuất Excel</span>
            <span className="sm:hidden">Xuất</span>
          </button>
          <button
            onClick={() => fetchOrders()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            <RefreshCw size={18} />
            <span className="hidden sm:inline">Làm mới</span>
            <span className="sm:hidden">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border">
          <div className="flex items-center gap-2">
            <Package className="text-blue-600" size={16} />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Tổng đơn</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border">
          <div className="flex items-center gap-2">
            <Clock className="text-yellow-600" size={16} />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Chờ xử lý</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border">
          <div className="flex items-center gap-2">
            <Package className="text-blue-600" size={16} />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Đang xử lý</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-blue-600 mt-1">{stats.processing}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border">
          <div className="flex items-center gap-2">
            <Truck className="text-purple-600" size={16} />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Đã gửi</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-purple-600 mt-1">{stats.shipped}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600" size={16} />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Đã giao</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-green-600 mt-1">{stats.delivered}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border">
          <div className="flex items-center gap-2">
            <DollarSign className="text-green-600" size={16} />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Doanh thu</span>
          </div>
          <p className="text-sm sm:text-lg font-bold text-green-600 mt-1">
            {stats.totalRevenue.toLocaleString('vi-VN')}đ
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn, tên khách hàng, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="ALL">Tất cả trạng thái</option>
              {Object.entries(statusLabels).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="ALL">Tất cả thời gian</option>
              <option value="TODAY">Hôm nay</option>
              <option value="WEEK">7 ngày qua</option>
              <option value="MONTH">30 ngày qua</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm sm:text-base"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Bộ lọc</span>
              <span className="sm:hidden">Lọc</span>
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Ngày đặt</option>
                <option value="total">Tổng tiền</option>
                <option value="status">Trạng thái</option>
                <option value="user">Khách hàng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Mới nhất</option>
                <option value="asc">Cũ nhất</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng hiển thị</label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10 đơn/trang</option>
                <option value={25}>25 đơn/trang</option>
                <option value={50}>50 đơn/trang</option>
                <option value={100}>100 đơn/trang</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              Đã chọn {selectedOrders.length} đơn hàng
            </span>
            <div className="flex gap-2">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    bulkUpdateStatus(selectedOrders, e.target.value);
                    e.target.value = '';
                  }
                }}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="">Cập nhật trạng thái</option>
                {Object.entries(statusLabels).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
              <button
                onClick={() => setSelectedOrders([])}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
              >
                Bỏ chọn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={getCurrentPageOrders().length > 0 && getCurrentPageOrders().every(order => selectedOrders.includes(order.id))}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    {orders.length === 0 ? 'Chưa có đơn hàng nào' : 'Không tìm thấy đơn hàng phù hợp'}
                  </td>
                </tr>
              ) : (
                getCurrentPageOrders().map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-mono text-gray-900">
                          #{order.id.slice(0, 8)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.id.slice(8, 16)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User size={16} className="text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.user?.name || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.user?.email || 'N/A'}
                            </div>
                            {order.user?.phone && (
                              <div className="text-xs text-gray-500">
                                {order.user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items?.length || 0} sản phẩm
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} món
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.total.toLocaleString('vi-VN')}đ
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${
                            statusLabels[order.status]?.color ||
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {(() => {
                            const IconComponent = statusLabels[order.status]?.icon || AlertCircle;
                            return <IconComponent className="w-3 h-3" />;
                          })()}
                          {statusLabels[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs text-gray-500">
                          {paymentMethodLabels[order.paymentMethod || ''] || order.paymentMethod || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString('vi-VN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <div className="relative group">
                            <button className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded">
                              <MoreVertical size={16} />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Xem chi tiết
                                </button>
                                <button
                                  onClick={() => {
                                    const newStatus = order.status === 'PENDING' ? 'PROCESSING' : 
                                                    order.status === 'PROCESSING' ? 'SHIPPED' :
                                                    order.status === 'SHIPPED' ? 'DELIVERED' : 'PENDING';
                                    updateOrderStatus(order.id, newStatus);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Cập nhật trạng thái
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {orders.length === 0 ? 'Chưa có đơn hàng nào' : 'Không tìm thấy đơn hàng phù hợp'}
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {getCurrentPageOrders().map((order) => {
                return (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="rounded border-gray-300 mt-1"
                        />
                        <div>
                          <div className="text-sm font-mono font-medium text-gray-900">
                            #{order.id.slice(0, 8)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${
                          statusLabels[order.status]?.color ||
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {(() => {
                          const IconComponent = statusLabels[order.status]?.icon || AlertCircle;
                          return <IconComponent className="w-3 h-3" />;
                        })()}
                        {statusLabels[order.status]?.label || order.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <User size={12} className="text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.user?.name || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.user?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Sản phẩm:</span>
                        <span className="text-gray-900">
                          {order.items?.length || 0} sản phẩm ({order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} món)
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tổng tiền:</span>
                        <span className="font-medium text-gray-900">
                          {order.total.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Thanh toán:</span>
                        <span className="text-gray-900">
                          {paymentMethodLabels[order.paymentMethod || ''] || order.paymentMethod || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            const newStatus = order.status === 'PENDING' ? 'PROCESSING' : 
                                            order.status === 'PROCESSING' ? 'SHIPPED' :
                                            order.status === 'SHIPPED' ? 'DELIVERED' : 'PENDING';
                            updateOrderStatus(order.id, newStatus);
                          }}
                          className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded"
                          title="Cập nhật trạng thái"
                        >
                          <CheckCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị{' '}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{' '}
                    đến{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
                    </span>{' '}
                    trong tổng số{' '}
                    <span className="font-medium">{filteredOrders.length}</span>{' '}
                    kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Chi tiết đơn hàng #{selectedOrder.id.slice(0, 8)}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Đặt ngày {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')} lúc{' '}
                  {new Date(selectedOrder.createdAt).toLocaleTimeString('vi-VN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
              </div>

            <div className="p-6 space-y-6">
              {/* Order Status & Actions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                    <span
                      className={`px-3 py-1 inline-flex items-center gap-2 text-sm font-semibold rounded-full ${
                        statusLabels[selectedOrder.status]?.color ||
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {(() => {
                        const StatusIcon = statusLabels[selectedOrder.status]?.icon || AlertCircle;
                        return <StatusIcon className="w-4 h-4" />;
                      })()}
                      {statusLabels[selectedOrder.status]?.label || selectedOrder.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                <select
                  value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="px-3 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(statusLabels).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User size={18} />
                    Thông tin khách hàng
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Tên:</span>
                      <p className="text-sm text-gray-900">{selectedOrder.user?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <p className="text-sm text-gray-900">{selectedOrder.user?.email || 'N/A'}</p>
                    </div>
                    {selectedOrder.user?.phone && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Số điện thoại:</span>
                        <p className="text-sm text-gray-900">{selectedOrder.user.phone}</p>
                      </div>
                    )}
                    {selectedOrder.user?.address && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Địa chỉ:</span>
                        <p className="text-sm text-gray-900">{selectedOrder.user.address}</p>
                      </div>
                    )}
                  </div>
              </div>

                {/* Order Information */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package size={18} />
                    Thông tin đơn hàng
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Mã đơn hàng:</span>
                      <p className="text-sm font-mono text-gray-900">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Ngày đặt:</span>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Cập nhật cuối:</span>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedOrder.updatedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
              <div>
                      <span className="text-sm font-medium text-gray-600">Phương thức thanh toán:</span>
                      <p className="text-sm text-gray-900">
                        {paymentMethodLabels[selectedOrder.paymentMethod || ''] || selectedOrder.paymentMethod || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Truck size={18} />
                    Địa chỉ giao hàng
                  </h3>
                  <p className="text-sm text-gray-900">{selectedOrder.shippingAddress}</p>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package size={18} />
                  Sản phẩm đã đặt ({selectedOrder.items?.length || 0} sản phẩm)
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        {item.product.images && item.product.images.length > 0 ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>Màu: {item.color}</span>
                          <span>Size: {item.size}</span>
                          <span>Số lượng: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {item.price.toLocaleString('vi-VN')}đ
                        </p>
                        <p className="text-sm text-gray-600">
                          Tổng: {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign size={18} />
                  Tổng kết đơn hàng
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="text-gray-900">
                      {selectedOrder.total.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="text-gray-900">0đ</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Tổng cộng:</span>
                      <span className="font-bold text-lg text-gray-900">
                  {selectedOrder.total.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  const newStatus = selectedOrder.status === 'PENDING' ? 'PROCESSING' : 
                                  selectedOrder.status === 'PROCESSING' ? 'SHIPPED' :
                                  selectedOrder.status === 'SHIPPED' ? 'DELIVERED' : 'PENDING';
                  updateOrderStatus(selectedOrder.id, newStatus);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Cập nhật trạng thái
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}






