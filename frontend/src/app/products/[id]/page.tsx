'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Truck, 
  Shield, 
  RotateCcw, 
  ChevronRight,
  Check,
  AlertCircle,
  Share2,
  Package,
  Award,
  Clock,
  Zap,
  ChevronLeft,
  Play,
  Pause,
  Sparkles,
  X,
  Eye
} from 'lucide-react'
import { productsApi } from '@/lib/api'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import ProductReviews from '@/components/ProductReviews'
import MiniToast from '@/components/MiniToast'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping' | 'reviews'>('description')
  const [currentStock, setCurrentStock] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [cartError, setCartError] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const [isImageAutoPlay, setIsImageAutoPlay] = useState(false)
  const [imageAutoPlayInterval, setImageAutoPlayInterval] = useState<NodeJS.Timeout | null>(null)

  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  // Get unique colors and sizes from variants
  const availableColors = product?.variants 
    ? Array.from(new Set(product.variants.map(v => v.color)))
    : []
  const availableSizes = product?.variants 
    ? Array.from(new Set(product.variants.map(v => v.size)))
    : []

  // Auto-play images
  useEffect(() => {
    if (isImageAutoPlay && product?.images && product.images.length > 1) {
      const interval = setInterval(() => {
        setSelectedImageIndex(prev => 
          prev === product.images.length - 1 ? 0 : prev + 1
        )
      }, 3000)
      setImageAutoPlayInterval(interval)
      return () => clearInterval(interval)
    } else if (imageAutoPlayInterval) {
      clearInterval(imageAutoPlayInterval)
      setImageAutoPlayInterval(null)
    }
  }, [isImageAutoPlay, product?.images, imageAutoPlayInterval])

  // Get current variant and stock
  useEffect(() => {
    if (product && selectedColor && selectedSize) {
      const variant = product.variants?.find(
        v => v.color === selectedColor && v.size === selectedSize
      )
      setCurrentStock(variant?.stock || 0)
      if (variant && quantity > variant.stock) {
        setQuantity(Math.max(1, variant.stock))
      }
    }
  }, [product, selectedColor, selectedSize, quantity])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productsApi.getById(productId) as Product
        setProduct(data)
        
        // Set default selections from variants
        if (data.variants && data.variants.length > 0) {
          const colors = Array.from(new Set(data.variants.map(v => v.color)))
          const sizes = Array.from(new Set(data.variants.map(v => v.size)))
          if (colors.length > 0) setSelectedColor(colors[0])
          if (sizes.length > 0) setSelectedSize(sizes[0])
        }
        
        // Fetch related products
        const categorySlug = typeof data.category === 'string' ? data.category : data.category?.slug
        if (categorySlug) {
          const allProducts = await productsApi.getAll({ category: categorySlug })
          const related = Array.isArray(allProducts) 
            ? allProducts.filter(p => p.id !== productId).slice(0, 4)
            : []
          setRelatedProducts(related)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const discountPercent = product?.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = useCallback(async () => {
    setCartError('')
    
    if (!selectedSize || !selectedColor) {
      setCartError('Vui lòng chọn size và màu sắc')
      return
    }

    if (currentStock < quantity) {
      setCartError(`Chỉ còn ${currentStock} sản phẩm trong kho`)
      return
    }

    if (currentStock === 0) {
      setCartError('Sản phẩm này đã hết hàng')
      return
    }

    setIsAddingToCart(true)
    
    try {
      await addItem({
        productId: product!.id,
        name: product!.name,
        price: product!.price,
        image: product!.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity
      }, isAuthenticated)
      
      setCartError('')
      
    } catch (error) {
      console.error('Error adding to cart:', error)
      setCartError('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.')
    } finally {
      setIsAddingToCart(false)
    }
  }, [selectedSize, selectedColor, currentStock, quantity, product, addItem, isAuthenticated])

  const handleBuyNow = async () => {
    await handleAddToCart()
    if (!cartError) {
      setTimeout(() => {
        router.push('/checkout')
      }, 500)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex flex-col items-center gap-6">
              <div className="relative">
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-solid border-purple-200 border-t-purple-600" />
                <div className="absolute inset-0 h-20 w-20 animate-ping rounded-full border-4 border-purple-400 opacity-20" />
              </div>
              <div className="space-y-3">
                <p className="text-2xl font-bold text-gray-900">Đang tải sản phẩm...</p>
                <p className="text-gray-500">Vui lòng đợi trong giây lát</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto px-4 text-center"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-16 h-16 text-red-600" />
              </div>
              <div className="absolute inset-0 animate-ping">
                <div className="w-32 h-32 bg-red-200 rounded-full opacity-20 mx-auto" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Không tìm thấy sản phẩm</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
            <Link href="/products">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-1 font-bold flex items-center gap-3 mx-auto">
                <ArrowLeft size={20} />
                Quay lại danh sách sản phẩm
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  const categoryName = typeof product.category === 'string' 
    ? product.category 
    : product.category?.name || 'Sản phẩm'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <MiniToast />
      
      {/* Enhanced Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <Link href="/" className="text-gray-600 hover:text-purple-600 transition-colors font-medium flex items-center gap-2">
                <ArrowLeft size={16} />
                Trang chủ
              </Link>
              <ChevronRight size={16} className="text-gray-300" />
              <Link href="/products" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Sản phẩm
              </Link>
              <ChevronRight size={16} className="text-gray-300" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold truncate max-w-xs">
                {product.name}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-all transform hover:scale-110"
                title="Chia sẻ"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                  isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Yêu thích"
              >
                <Heart size={18} className={isLiked ? 'fill-current' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Main Product Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden mb-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 lg:p-8">
            {/* Enhanced Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 group shadow-lg">
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 cursor-zoom-in"
                  onClick={() => setShowImageModal(true)}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Image Controls */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  {discountPercent > 0 && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 text-sm font-bold rounded-full shadow-xl animate-pulse">
                      <span className="text-xs">GIẢM</span> {discountPercent}%
                    </div>
                  )}
                  <button
                    onClick={() => setIsImageAutoPlay(!isImageAutoPlay)}
                    className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all"
                    title={isImageAutoPlay ? 'Tắt tự động phát' : 'Bật tự động phát'}
                  >
                    {isImageAutoPlay ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                </div>

                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Zoom indicator */}
                <div className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-all">
                  <Eye size={16} />
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-3 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-purple-600 shadow-lg ring-4 ring-purple-200 scale-105' 
                        : 'border-gray-200 hover:border-purple-300 shadow-md'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 to-transparent" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Enhanced Product Info */}
            <div className="space-y-4">
              {/* Category Badge */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 text-sm rounded-full font-semibold border border-purple-100"
              >
                <Award className="w-3 h-3" />
                {categoryName}
              </motion.div>

              {/* Product Title & Rating */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-base font-semibold text-gray-700">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {product.reviewCount} đánh giá
                  </span>
                </div>
              </motion.div>

              {/* Enhanced Price */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 p-4 rounded-2xl border border-purple-100"
              >
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <Zap size={12} />
                        Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                      </span>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Size Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-gray-900">Kích thước</h3>
                  <button className="text-xs text-blue-600 hover:underline font-medium">
                    📏 Hướng dẫn
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const variantsForSize = product.variants?.filter(v => v.size === size && v.color === selectedColor) || []
                    const hasStock = variantsForSize.some(v => v.stock > 0)
                    return (
                      <motion.button
                        key={size}
                        whileHover={{ scale: hasStock ? 1.05 : 1 }}
                        whileTap={{ scale: hasStock ? 0.95 : 1 }}
                        onClick={() => hasStock && setSelectedSize(size)}
                        disabled={!hasStock}
                        className={`px-4 py-2 border-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedSize === size
                            ? 'border-black bg-black text-white shadow-md'
                            : hasStock
                              ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                              : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {size}
                        {!hasStock && <span className="ml-2 text-xs">(Hết)</span>}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>

              {/* Color Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-base font-semibold text-gray-900 mb-2">Màu sắc</h3>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => {
                    const variantsForColor = product.variants?.filter(v => v.color === color && v.size === selectedSize) || []
                    const hasStock = variantsForColor.some(v => v.stock > 0)
                    return (
                      <motion.button
                        key={color}
                        whileHover={{ scale: hasStock ? 1.05 : 1 }}
                        whileTap={{ scale: hasStock ? 0.95 : 1 }}
                        onClick={() => hasStock && setSelectedColor(color)}
                        disabled={!hasStock}
                        className={`px-4 py-2 border-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedColor === color
                            ? 'border-black bg-black text-white shadow-md'
                            : hasStock
                              ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                              : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {color}
                        {!hasStock && <span className="ml-2 text-xs">(Hết)</span>}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>

              {/* Quantity */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-base font-semibold text-gray-900 mb-2">Số lượng</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 font-semibold text-base border-x-2 border-gray-300 min-w-[50px] text-center bg-gray-50">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      disabled={quantity >= currentStock}
                      className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {selectedColor && selectedSize && (
                    <div className={`text-xs px-3 py-1 rounded-full ${currentStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {currentStock > 0 ? (
                        <span className="flex items-center gap-1">
                          <Package size={12} />
                          Còn <span className="font-semibold">{currentStock}</span>
                        </span>
                      ) : (
                        <span className="font-semibold">Hết hàng</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {cartError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle size={18} />
                      <span className="font-medium">{cartError}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3 pt-4"
              >
                <button
                  onClick={handleBuyNow}
                  disabled={isAddingToCart}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-base shadow-md transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <ShoppingCart size={18} className={isAddingToCart ? "animate-spin" : "animate-bounce"} />
                  {isAddingToCart ? 'Đang xử lý...' : 'Mua ngay'}
                </button>
                
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-base shadow-md transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Plus size={18} className={isAddingToCart ? "animate-spin" : ""} />
                  {isAddingToCart ? 'Đang thêm...' : `Thêm vào giỏ - ${formatPrice(product.price * quantity)}`}
                </button>
              </motion.div>

              {/* Enhanced Features */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100"
              >
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Truck className="text-blue-600" size={16} />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Giao hàng nhanh</p>
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-1">
                    <Clock size={10} />
                    2-3 ngày
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="text-green-600" size={16} />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Bảo hành</p>
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-1">
                    <Award size={10} />
                    12 tháng
                  </p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                    <RotateCcw className="text-purple-600" size={16} />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Đổi trả</p>
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-1">
                    <Check size={10} />
                    7 ngày
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Tabs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden mb-6 border border-white/50"
        >
          {/* Tab Headers */}
          <div className="border-b border-gray-100 flex overflow-x-auto">
            {[
              { id: 'description', label: 'Mô tả sản phẩm', icon: Package },
              { id: 'specs', label: 'Thông số', icon: Award },
              { id: 'shipping', label: 'Vận chuyển', icon: Truck },
              { id: 'reviews', label: 'Đánh giá', icon: Star }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'description' | 'shipping' | 'reviews')}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="prose max-w-none"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Package size={20} className="text-purple-600" />
                    Chi tiết sản phẩm
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                    {product.description}
                  </p>
                </motion.div>
              )}
              
              {activeTab === 'specs' && (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Award size={20} className="text-purple-600" />
                    Thông số kỹ thuật
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-gray-100 rounded-xl p-4 bg-gray-50">
                      <p className="text-sm text-gray-600 mb-2">Danh mục</p>
                      <p className="text-base font-bold">{categoryName}</p>
                    </div>
                    <div className="border-2 border-gray-100 rounded-xl p-4 bg-gray-50">
                      <p className="text-sm text-gray-600 mb-2">Kích thước có sẵn</p>
                      <p className="text-base font-bold">{availableSizes.join(', ')}</p>
                    </div>
                    <div className="border-2 border-gray-100 rounded-xl p-4 bg-gray-50">
                      <p className="text-sm text-gray-600 mb-2">Màu sắc</p>
                      <p className="text-base font-bold">{availableColors.join(', ')}</p>
                    </div>
                    <div className="border-2 border-gray-100 rounded-xl p-4 bg-gray-50">
                      <p className="text-sm text-gray-600 mb-2">Đánh giá trung bình</p>
                      <p className="text-base font-bold flex items-center gap-2">
                        {product.rating.toFixed(1)} / 5.0 
                        <Star size={16} className="text-yellow-400 fill-current" />
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Truck size={20} className="text-blue-600" />
                      Chính sách giao hàng
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <Check size={18} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>Giao hàng toàn quốc trong 2-3 ngày làm việc</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check size={18} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>Miễn phí giao hàng cho đơn hàng trên 500.000đ</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check size={18} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>Kiểm tra hàng trước khi thanh toán</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <RotateCcw size={20} className="text-purple-600" />
                      Chính sách đổi trả
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <Check size={18} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>Đổi trả miễn phí trong 7 ngày</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check size={18} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>Sản phẩm còn nguyên tem mác, chưa qua sử dụng</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check size={18} className="text-green-600 mt-1 flex-shrink-0" />
                        <span>Hoàn tiền 100% nếu sản phẩm lỗi</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <ProductReviews productId={productId} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Sparkles size={24} className="text-purple-600" />
                Sản phẩm liên quan
              </h2>
              <Link 
                href="/products" 
                className="text-sm text-blue-600 hover:underline font-bold flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-all"
              >
                Xem tất cả
                <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"

              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                width={800}
                height={800}
                className="object-contain max-h-[90vh] rounded-2xl"
              />
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}