'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, X } from 'lucide-react'
import { Product } from '@/types'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const { addItem } = useCartStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleQuickAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    })
    setShowQuickAdd(false)
    alert('Đã thêm vào giỏ hàng!')
  }

  return (
    <div className="group relative bg-[var(--card)] rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[color:var(--border)]">
      {/* Badge giảm giá */}
      {discountPercent > 0 && (
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded animate-scale-in">
          -{discountPercent}%
        </div>
      )}

      {/* Nút yêu thích */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full transition-colors ${
          isLiked ? 'bg-red-500 text-white' : 'bg-[var(--card)]/80 text-[color:var(--muted)] hover:bg-[var(--card)]'
        }`}
      >
        <Heart size={14} className={`sm:w-4 sm:h-4 ${isLiked ? 'fill-current' : ''}`} />
      </button>

      {/* Hình ảnh sản phẩm */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
          />
        </div>
      </Link>

      {/* Thông tin sản phẩm */}
      <div className="p-3 sm:p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-[var(--foreground)] mb-2 hover:text-blue-500 transition-colors line-clamp-2 text-sm sm:text-base">
            {product.name}
          </h3>
        </Link>

        {/* Đánh giá */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className={`sm:w-3 sm:h-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[color:var(--muted-foreground)]">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Giá */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-base sm:text-lg text-[var(--foreground)]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-[color:var(--muted-foreground)] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Nút thêm vào giỏ */}
        <button 
          onClick={() => setShowQuickAdd(true)}
          className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-2 px-3 sm:px-4 rounded transition-all flex items-center justify-center gap-2 group text-xs sm:text-sm transform-gpu hover:translate-y-[-1px] hover:shadow-md active:translate-y-0 active:scale-[0.98]"
        >
          <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
          <span>Thêm vào giỏ</span>
        </button>

        {/* Modal chọn màu và size */}
        {showQuickAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setShowQuickAdd(false)} />
            <div className="relative bg-[var(--card)] text-[var(--foreground)] border border-[color:var(--border)] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[color:var(--border)]">
                <h3 className="text-lg font-semibold">Chọn màu sắc và kích thước</h3>
                <button
                  onClick={() => setShowQuickAdd(false)}
                  className="p-1 hover:bg-[color:var(--border)]/40 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-6">
                {/* Product Info */}
                <div className="flex gap-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-[var(--foreground)]">{product.name}</h4>
                    <p className="font-semibold text-sm text-[var(--foreground)]">{formatPrice(product.price)}</p>
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <h4 className="font-medium text-sm text-[var(--foreground)] mb-3">Màu sắc</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
                          selectedColor === color
                            ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                            : 'border-[color:var(--border)] hover:border-[color:var(--muted)]'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <h4 className="font-medium text-sm text-[var(--foreground)] mb-3">Kích thước</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 rounded text-xs font-medium border transition-colors ${
                          selectedSize === size
                            ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                            : 'border-[color:var(--border)] hover:border-[color:var(--muted)]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-[color:var(--border)]">
                  <button
                    onClick={() => setShowQuickAdd(false)}
                    className="flex-1 px-4 py-2 border border-[color:var(--border)] rounded hover:bg-[color:var(--border)]/40 transition-colors text-sm"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleQuickAdd}
                    className="flex-1 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded hover:opacity-90 transition-opacity text-sm"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

