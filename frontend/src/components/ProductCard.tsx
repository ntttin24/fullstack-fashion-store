'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, X, Zap, Award } from 'lucide-react'
import { Product } from '@/types'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { scrollToTop } from '@/hooks/useScrollToTop'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  // Get unique colors and sizes from variants
  const availableColors = product.variants 
    ? Array.from(new Set(product.variants.map(v => v.color)))
    : []
  const availableSizes = product.variants 
    ? Array.from(new Set(product.variants.map(v => v.size)))
    : []

  const [isLiked, setIsLiked] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || '')
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || '')
  const [isHovered, setIsHovered] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  // Auto-cycle images on hover
  useEffect(() => {
    if (isHovered && product.images && product.images.length > 1) {
      const interval = setInterval(() => {
        setImageIndex(prev => (prev + 1) % product.images.length)
      }, 1500)
      return () => clearInterval(interval)
    } else {
      setImageIndex(0)
    }
  }, [isHovered, product.images])

  // Allow scrolling even when modal is open
  // Removed body scroll prevention to allow scrolling

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0
  
  // Safe defaults
  const productImage = product.images?.[imageIndex] || '/images/placeholder.svg'
  const productRating = product.rating || 0
  const productReviewCount = product.reviewCount || 0

  const handleQuickAdd = async () => {
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: productImage,
        size: selectedSize,
        color: selectedColor,
        quantity: 1
      }, isAuthenticated)
      setShowQuickAdd(false)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'trắng': '#ffffff',
      'đen': '#000000',
      'đỏ': '#ef4444',
      'xanh': '#3b82f6',
      'vàng': '#fbbf24',
      'xanh lá': '#10b981',
      'tím': '#8b5cf6',
      'hồng': '#ec4899',
      'cam': '#f97316',
      'nâu': '#a3a3a3'
    }
    return colorMap[color.toLowerCase()] || '#9ca3af'
  }

  return (
    <motion.div 
      className="group relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50 hover:border-purple-200 transform-gpu w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Compact Badges */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 flex flex-col gap-1 sm:gap-1.5">
        {discountPercent > 0 && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-md sm:rounded-lg shadow-md flex items-center gap-0.5 sm:gap-1"
          >
            <Zap size={8} className="sm:w-[10px] sm:h-[10px]" />
            -{discountPercent}%
          </motion.div>
        )}
        {product.featured && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-md sm:rounded-lg shadow-md flex items-center gap-0.5 sm:gap-1"
          >
            <Award size={8} className="sm:w-[10px] sm:h-[10px]" />
            HOT
          </motion.div>
        )}
      </div>

      {/* Enhanced Wishlist Button */}
      <motion.button
        onClick={() => setIsLiked(!isLiked)}
        className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-20 p-2 sm:p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${
          isLiked 
            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white scale-110' 
            : 'bg-white/90 text-gray-600 hover:bg-white hover:scale-110'
        }`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart size={14} className={`sm:w-4 sm:h-4 ${isLiked ? 'fill-current' : ''}`} />
      </motion.button>

      {/* Enhanced Product Image */}
      <Link 
        href={`/products/${product.id}`}
        onClick={scrollToTop}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          <Image
            src={productImage}
            alt={product.name || 'Product'}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110 will-change-transform"
          />
          
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          

          {/* Image Indicators */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === imageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Enhanced Product Info */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <Link 
          href={`/products/${product.id}`}
          onClick={scrollToTop}
        >
          <h3 className="font-semibold text-gray-900 mb-1 sm:mb-1.5 hover:text-purple-600 transition-colors line-clamp-2 text-xs sm:text-sm min-h-[2rem] sm:min-h-[2.5rem] leading-4 sm:leading-5">
            {product.name}
          </h3>
        </Link>

        {/* Enhanced Rating */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className={`transition-colors sm:w-3 sm:h-3 ${
                  i < Math.floor(productRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 fill-current'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs text-gray-600 font-semibold">
            {productRating.toFixed(1)}
          </span>
          <span className="text-[9px] sm:text-xs text-gray-400 bg-gray-100 px-1 sm:px-1.5 py-0.5 rounded-full">
            ({productReviewCount})
          </span>
        </div>

        {/* Enhanced Price */}
        <div className="flex items-baseline gap-1.5 sm:gap-2 pt-1">
          <span className="font-bold text-sm sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Enhanced Color Preview */}
        {availableColors.length > 0 && (
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium">Màu:</span>
            <div className="flex gap-0.5 sm:gap-1">
              {availableColors.slice(0, 3).map((color, idx) => (
                <motion.div
                  key={idx}
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: getColorStyle(color) }}
                  title={color}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
              {availableColors.length > 3 && (
                <span className="text-[9px] sm:text-xs text-gray-500 font-semibold bg-gray-100 px-1 sm:px-1.5 py-0.5 rounded-full">
                  +{availableColors.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Add to Cart Button */}
        <motion.button 
          onClick={() => setShowQuickAdd(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg group/btn"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingCart size={14} className="sm:w-4 sm:h-4 group-hover/btn:animate-bounce" />
          <span className="hidden sm:inline">Thêm vào giỏ</span>
          <span className="sm:hidden">Thêm</span>
        </motion.button>
      </div>

      {/* Enhanced Quick Add Modal */}
      <AnimatePresence mode="wait">
        {showQuickAdd && (
          <motion.div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1]
            }}
            onClick={() => setShowQuickAdd(false)}
          >
            <motion.div 
              className="relative bg-white rounded-xl sm:rounded-2xl max-w-sm w-full mx-2 sm:mx-4 my-4 shadow-xl border border-gray-200 z-[10000]"
              initial={{ 
                scale: 0.8, 
                opacity: 0, 
                y: 30,
                rotateX: -15
              }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                rotateX: 0
              }}
              exit={{ 
                scale: 0.8, 
                opacity: 0, 
                y: 30,
                rotateX: 15,
                transition: {
                  duration: 0.25,
                  ease: [0.4, 0.0, 1, 1]
                }
              }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 400,
                duration: 0.4
              }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Enhanced Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                  <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px] text-purple-600" />
                  <span className="hidden sm:inline">Tùy chọn sản phẩm</span>
                  <span className="sm:hidden">Tùy chọn</span>
                </h3>
                <motion.button
                  onClick={() => setShowQuickAdd(false)}
                  className="p-1 sm:p-1.5 hover:bg-white/80 rounded-full transition-all"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} className="sm:w-[18px] sm:h-[18px] text-gray-600" />
                </motion.button>
              </div>

              {/* Enhanced Content */}
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {/* Product Info */}
                <motion.div 
                  className="flex gap-2 sm:gap-3 bg-gradient-to-r from-gray-50 to-gray-100 p-2 sm:p-3 rounded-lg sm:rounded-xl"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ 
                    delay: 0.1,
                    duration: 0.3,
                    ease: [0.4, 0.0, 0.2, 1]
                  }}
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden border border-white shadow-md">
                    <Image
                      src={productImage}
                      alt={product.name || 'Product'}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-gray-900 mb-1 line-clamp-2">{product.name || 'Sản phẩm'}</h4>
                    <p className="font-bold text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {formatPrice(product.price || 0)}
                    </p>
                  </div>
                </motion.div>

                {/* Enhanced Color Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ 
                    delay: 0.2,
                    duration: 0.3,
                    ease: [0.4, 0.0, 0.2, 1]
                  }}
                >
                  <h4 className="font-semibold text-xs sm:text-sm text-gray-900 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-1.5">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
                    Chọn màu sắc
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {availableColors.map((color) => (
                      <motion.button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold border-2 transition-all ${
                          selectedColor === color
                            ? 'border-purple-600 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                        }`}
                        whileHover={{ scale: selectedColor === color ? 1.02 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {color}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Enhanced Size Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ 
                    delay: 0.3,
                    duration: 0.3,
                    ease: [0.4, 0.0, 0.2, 1]
                  }}
                >
                  <h4 className="font-semibold text-xs sm:text-sm text-gray-900 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-1.5">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600"></div>
                    Chọn kích thước
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
                    {availableSizes.map((size) => (
                      <motion.button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold border-2 transition-all ${
                          selectedSize === size
                            ? 'border-pink-600 bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-pink-300'
                        }`}
                        whileHover={{ scale: selectedSize === size ? 1.02 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Enhanced Action Buttons */}
                <motion.div 
                  className="flex gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-gray-100"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ 
                    delay: 0.4,
                    duration: 0.3,
                    ease: [0.4, 0.0, 0.2, 1]
                  }}
                >
                  <motion.button
                    onClick={() => setShowQuickAdd(false)}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold text-xs sm:text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    onClick={handleQuickAdd}
                    className="flex-2 flex-grow px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCart size={12} className="sm:w-[14px] sm:h-[14px]" />
                    <span className="hidden sm:inline">Thêm vào giỏ</span>
                    <span className="sm:hidden">Thêm</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}