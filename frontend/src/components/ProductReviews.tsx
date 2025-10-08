'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { reviewsApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  orderId: string;
  user: {
    id: string;
    name: string;
  };
}

interface DeliveredOrder {
  id: string;
  createdAt: Date;
  hasReview: boolean;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [canReview, setCanReview] = useState(false);
  const [reviewRestrictionReason, setReviewRestrictionReason] = useState('');
  const [deliveredOrders, setDeliveredOrders] = useState<DeliveredOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reviewsApi.getByProduct(productId) as Review[];
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const checkCanReview = useCallback(async () => {
    // Don't check if user is not authenticated
    if (!isAuthenticated) {
      setCanReview(false);
      setReviewRestrictionReason('Vui lòng đăng nhập để đánh giá sản phẩm');
      return;
    }

    try {
      const result = await reviewsApi.canReview(productId) as { canReview: boolean; deliveredOrders?: DeliveredOrder[]; reason?: string };
      setCanReview(result.canReview);
      
      if (result.deliveredOrders && result.deliveredOrders.length > 0) {
        setDeliveredOrders(result.deliveredOrders);
        // Auto-select first order that hasn't been reviewed
        const firstUnreviewed = result.deliveredOrders.find(order => !order.hasReview);
        if (firstUnreviewed) {
          setSelectedOrderId(firstUnreviewed.id);
        } else {
          // If all reviewed, select the first one for potential editing
          setSelectedOrderId(result.deliveredOrders[0].id);
        }
      }
      
      if (result.reason) {
        setReviewRestrictionReason(result.reason);
      }
    } catch (err: unknown) {
      console.error('Error checking review permission:', err);
      setCanReview(false);
      
      // Handle specific error cases
      const error = err as { status?: number; message?: string };
      if (error.status === 401 || error.message?.includes('Unauthorized') || error.message?.includes('401') || error.message?.includes('User not found')) {
        setReviewRestrictionReason('Vui lòng đăng nhập để đánh giá sản phẩm');
      } else {
        setReviewRestrictionReason('Không thể kiểm tra quyền đánh giá');
      }
    }
  }, [productId, isAuthenticated]);

  useEffect(() => {
    fetchReviews();
    checkCanReview();
  }, [fetchReviews, checkCanReview]);


  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Vui lòng đăng nhập để đánh giá sản phẩm');
      return;
    }

    if (!selectedOrderId) {
      setError('Vui lòng chọn đơn hàng để đánh giá');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const selectedOrder = deliveredOrders.find(o => o.id === selectedOrderId);
      
      await reviewsApi.create(productId, {
        orderId: selectedOrderId,
        ...reviewForm,
      });
      
      if (selectedOrder?.hasReview) {
        setSuccess('Đánh giá của bạn đã được cập nhật thành công!');
      } else {
        setSuccess('Đánh giá của bạn đã được gửi thành công!');
      }
      
      // Reset form
      setReviewForm({ rating: 5, comment: '' });
      setEditingReview(null);
      
      // Refresh reviews list and orders
      await fetchReviews();
      await checkCanReview();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      return;
    }

    try {
      await reviewsApi.delete(productId, reviewId);
      setSuccess('Đã xóa đánh giá');
      setEditingReview(null);
      setReviewForm({ rating: 5, comment: '' });
      await fetchReviews();
      await checkCanReview();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể xóa đánh giá';
      setError(errorMessage);
    }
  };

  const handleEditReview = (review: Review) => {
    setSelectedOrderId(review.orderId);
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      comment: review.comment || '',
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setReviewForm({ rating: 5, comment: '' });
    // Auto-select first unreviewed order
    const firstUnreviewed = deliveredOrders.find(order => !order.hasReview);
    if (firstUnreviewed) {
      setSelectedOrderId(firstUnreviewed.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={() => interactive && onChange && onChange(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              size={interactive ? 24 : 18}
              className={`${
                star <= rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Review Statistics */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>
        
        {reviews.length > 0 ? (
          <div className="mb-6">
            <p className="text-gray-600">
              {reviews.length} đánh giá cho sản phẩm này
            </p>
          </div>
        ) : (
          <p className="text-gray-600 mb-6">Chưa có đánh giá nào</p>
        )}
      </div>

      {/* Write Review Form */}
      {isAuthenticated ? (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingReview ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá'}
          </h3>
          
          {!canReview && reviewRestrictionReason && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
              <span className="text-lg">ℹ️</span>
              <div>
                <p className="font-medium">Không thể đánh giá</p>
                <p className="text-sm mt-1">{reviewRestrictionReason}</p>
              </div>
            </div>
          )}

          {editingReview && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4 flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <span className="text-lg">✏️</span>
                <div>
                  <p className="font-medium">Chỉnh sửa đánh giá</p>
                  <p className="text-sm mt-1">Đơn hàng: #{editingReview.orderId.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={handleCancelEdit}
                className="text-sm underline hover:no-underline"
              >
                Hủy
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Order Selection */}
            {canReview && deliveredOrders.length > 0 && !editingReview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn đơn hàng
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {deliveredOrders.map((order) => (
                    <option key={order.id} value={order.id}>
                      Đơn #{order.id.slice(0, 8).toUpperCase()} - {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      {order.hasReview ? ' (Đã đánh giá)' : ' (Chưa đánh giá)'}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Bạn có {deliveredOrders.filter(o => !o.hasReview).length} đơn hàng chưa đánh giá
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đánh giá của bạn
              </label>
              {renderStars(reviewForm.rating, canReview, (rating) =>
                setReviewForm({ ...reviewForm, rating })
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhận xét (tùy chọn)
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                disabled={!canReview}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder={canReview ? "Chia sẻ trải nghiệm của bạn về sản phẩm này..." : "Bạn cần mua và nhận hàng để đánh giá"}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !canReview || !selectedOrderId}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {submitting 
                ? (editingReview ? 'Đang cập nhật...' : 'Đang gửi...') 
                : (editingReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá')
              }
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600 mb-4">Đăng nhập để viết đánh giá</p>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Đăng nhập
          </a>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2 text-gray-600">Đang tải đánh giá...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold">{review.user.name}</p>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                    <span className="mx-2">•</span>
                    Đơn hàng: #{review.orderId.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                
                {user && user.id === review.user.id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                      title="Chỉnh sửa"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Xóa đánh giá"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
                
                {user && user.role === 'ADMIN' && user.id !== review.user.id && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Xóa đánh giá (Admin)"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              {review.comment && (
                <p className="text-gray-700 mt-2">{review.comment}</p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
          </div>
        )}
      </div>
    </div>
  );
}

