'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  TrendingUp, 
  X, 
  Filter, 
  ChevronDown,
  Star,
  ShoppingBag,
  Zap,
  Award,
  Flame,
  ArrowUpDown
} from 'lucide-react'
import { productsApi, categoriesApi } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { FilterOptions, Product, Category } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'name'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          productsApi.getAll({
            search: debouncedSearch || undefined,
            category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
            minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
            maxPrice: priceRange[1] < 10000000 ? priceRange[1] : undefined,
            sortBy: filters.sortBy
          }),
          categoriesApi.getAll()
        ])
        setProducts(Array.isArray(productsData) ? productsData : [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setProducts([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [debouncedSearch, priceRange, filters.sortBy, selectedCategories])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Additional client-side filtering if needed
    if (selectedCategories.length > 1) {
      result = result.filter(product => {
        const categorySlug = typeof product.category === 'string' 
          ? product.category 
          : product.category?.slug
        return selectedCategories.includes(categorySlug || '')
      })
    }

    return result
  }, [products, selectedCategories])

  const handleCategoryToggle = useCallback((categorySlug: string) => {
    setSelectedCategories(prev => 
      prev.includes(categorySlug)
        ? prev.filter(c => c !== categorySlug)
        : [...prev, categorySlug]
    )
  }, [])

  const clearAllFilters = useCallback(() => {
    setFilters({ sortBy: 'name' })
    setSearchQuery('')
    setSelectedCategories([])
    setPriceRange([0, 10000000])
  }, [])

  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat('vi-VN', {
  //     style: 'currency',
  //     currency: 'VND'
  //   }).format(price)
  // }

  const sortOptions = [
    { value: 'name', label: '📝 Tên A-Z', icon: ArrowUpDown },
    { value: 'price-asc', label: '💰 Giá thấp nhất', icon: TrendingUp },
    { value: 'price-desc', label: '💎 Giá cao nhất', icon: TrendingUp },
    { value: 'rating', label: '⭐ Đánh giá cao', icon: Star },
  ]

  const quickFilters = [
    { label: 'Nổi bật', icon: Flame, action: () => {/* Filter featured */} },
    { label: 'Bán chạy', icon: TrendingUp, action: () => {/* Filter best sellers */} },
    { label: 'Mới nhất', icon: Sparkles, action: () => {/* Filter newest */} },
    { label: 'Giảm giá', icon: Zap, action: () => {/* Filter on sale */} },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-md rounded-full text-sm font-semibold mb-4 border border-white/20">
              <Sparkles size={18} className="animate-pulse text-yellow-300" />
              <span className="text-white">Bộ Sưu Tập Thời Trang 2024</span>
              <Award size={18} className="text-yellow-300" />
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              <span className="text-white">Khám Phá</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-white">
                Phong Cách
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Thời trang hiện đại, chất lượng cao với hàng ngàn sản phẩm độc đáo được tuyển chọn kỹ lưỡng
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {quickFilters.map((filter, index) => (
                <motion.button
                  key={filter.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  onClick={filter.action}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 group"
                >
                  <filter.icon size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{filter.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-3 mb-4 sticky top-2 z-30"
        >
          <div className="space-y-3">
            {/* Main Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50/80 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:bg-white transition-all border border-transparent focus:border-purple-200 text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    showFilters
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Filter size={14} />
                  <span className="hidden sm:inline text-sm">Bộ lọc</span>
                  {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000000) && (
                    <span className="px-1.5 py-0.5 bg-white/30 rounded-full text-xs font-bold">
                      {[...selectedCategories, priceRange[0] > 0 ? 'min' : '', priceRange[1] < 10000000 ? 'max' : ''].filter(Boolean).length}
                    </span>
                  )}
                  <ChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

              </div>

              {/* Sort Dropdown */}
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as 'name' | 'price-asc' | 'price-desc' | 'rating' }))}
                className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all border border-transparent focus:border-purple-200 font-medium cursor-pointer hover:bg-gray-100 text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Compact Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-xl rounded-lg shadow-md border border-white/50 p-3 mb-4 overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center gap-1.5">
                    <SlidersHorizontal size={16} className="text-purple-600" />
                    Bộ lọc
                  </h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-red-50"
                  >
                    <X size={12} />
                    Xóa tất cả
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Compact Category Filter */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <ShoppingBag size={12} className="text-purple-600" />
                      Danh mục
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryToggle(category.slug)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-300 ${
                            selectedCategories.includes(category.slug)
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Compact Price Range */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <TrendingUp size={12} className="text-green-600" />
                      Khoảng giá
                    </label>
                    <div className="space-y-1.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="number"
                          placeholder="Từ"
                          value={priceRange[0] || ''}
                          onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                          className="w-full px-2.5 py-1.5 text-xs bg-gray-50 text-gray-900 placeholder-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500/30 focus:bg-white transition-all border border-transparent focus:border-purple-200"
                        />
                        <input
                          type="number"
                          placeholder="Đến"
                          value={priceRange[1] === 10000000 ? '' : priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000000])}
                          className="w-full px-2.5 py-1.5 text-xs bg-gray-50 text-gray-900 placeholder-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500/30 focus:bg-white transition-all border border-transparent focus:border-purple-200"
                        />
                      </div>
                      
                      {/* Compact Quick Price Filters */}
                      <div className="flex flex-wrap gap-1">
                        {[
                          { label: '<500K', min: 0, max: 500000 },
                          { label: '500K-1M', min: 500000, max: 1000000 },
                          { label: '1M-2M', min: 1000000, max: 2000000 },
                          { label: '>2M', min: 2000000, max: 10000000 }
                        ].map((range, idx) => (
                          <button
                            key={idx}
                            onClick={() => setPriceRange([range.min, range.max])}
                            className={`px-1.5 py-1 text-xs font-medium rounded-md transition-all duration-300 ${
                              priceRange[0] === range.min && priceRange[1] === range.max
                                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-2 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-600">
                Hiển thị <span className="font-semibold text-purple-600">{filteredProducts.length}</span> trong tổng số <span className="font-medium">{products.length}</span> sản phẩm
              </p>
              {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000000 || searchQuery) && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Filter size={12} />
                  Đã áp dụng bộ lọc
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex flex-col items-center gap-6"
            >
              <div className="relative">
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-solid border-purple-200 border-t-purple-600" />
                <div className="absolute inset-0 h-20 w-20 animate-ping rounded-full border-4 border-purple-400 opacity-20" />
              </div>
              <div className="space-y-3 text-center">
                <p className="text-2xl font-bold text-gray-900">Đang tải sản phẩm...</p>
                <p className="text-gray-500">Vui lòng đợi trong giây lát</p>
              </div>
            </motion.div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="transform-gpu"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="max-w-lg mx-auto">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
                  <Search size={48} className="text-purple-600" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <X size={60} className="text-red-500 animate-pulse" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                Rất tiếc, chúng tôi không tìm thấy sản phẩm phù hợp với tiêu chí của bạn. Hãy thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl transform hover:-translate-y-1 transition-all font-bold text-lg"
                >
                  Xóa tất cả bộ lọc
                </button>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all font-bold text-lg"
                >
                  Xóa tìm kiếm
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}