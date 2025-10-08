'use client'

import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  Search, 
  Filter, 
  ChevronDown,
  ArrowLeft,
  Sparkles,
  X,
  TrendingUp
} from 'lucide-react'
import { productsApi, categoriesApi } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { FilterOptions, Product, Category } from '@/types'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.slug as string
  
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'name'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])

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
        const [categoryData, productsData] = await Promise.all([
          categoriesApi.getBySlug(categorySlug),
          productsApi.getAll({ category: categorySlug })
        ])
        setCategory(categoryData as Category)
        setProducts(Array.isArray(productsData) ? productsData : [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setCategory(null)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categorySlug])

  const filteredProducts = useMemo(() => {
    const result = products.filter(product => {
      const matchesSearch = debouncedSearch === '' || 
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      
      return matchesSearch && matchesPrice
    })

    // Sắp xếp
    if (filters.sortBy) {
      result.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            return a.price - b.price
          case 'price-desc':
            return b.price - a.price
          case 'rating':
            return b.rating - a.rating
          case 'name':
          default:
            return a.name.localeCompare(b.name)
        }
      })
    }

    return result
  }, [products, debouncedSearch, filters, priceRange])

  const sortOptions = [
    { value: 'name', label: 'Tên A-Z' },
    { value: 'price-asc', label: 'Giá: Thấp → Cao' },
    { value: 'price-desc', label: 'Giá: Cao → Thấp' },
    { value: 'rating', label: 'Đánh giá cao nhất' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-32">
            <motion.div 
              className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p 
              className="mt-6 text-gray-600 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Đang tải danh mục...
            </motion.p>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div 
            className="text-center py-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <X size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Không tìm thấy danh mục</h1>
            <p className="text-gray-600 mb-8 text-lg">Danh mục bạn tìm kiếm không tồn tại</p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all transform hover:scale-105"
            >
              <ArrowLeft size={20} />
              Xem tất cả sản phẩm
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Hero Section */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <motion.div 
            className="flex items-center gap-2 text-white/80 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft size={16} />
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">{category.name}</span>
          </motion.div>

          {/* Category Title */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-4">
              {category.name}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Khám phá bộ sưu tập {category.name.toLowerCase()} đa dạng với chất lượng cao và thiết kế hiện đại
            </p>
            <div className="flex items-center justify-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Sparkles size={20} />
                <span className="font-semibold">{products.length} sản phẩm</span>
              </div>
              <div className="w-1 h-1 bg-white/50 rounded-full"></div>
              <div className="flex items-center gap-2">
                <TrendingUp size={20} />
                <span className="font-semibold">Chất lượng cao</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Search & Filter Bar */}
        <motion.div 
          className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-3 mb-8 sticky top-2 z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={`Tìm kiếm trong ${category.name.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex items-center gap-3">
              {/* Filter Button */}
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-white/80 border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter size={16} />
                <span className="font-medium">Bộ lọc</span>
              </motion.button>


              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as 'name' | 'rating' | 'price-asc' | 'price-desc' }))}
                  className="appearance-none bg-white/80 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          </div>

          {/* Enhanced Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-white/50 rounded-xl p-6 border border-white/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Khoảng giá
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Từ"
                        value={priceRange[0] || ''}
                        onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                      />
                      <input
                        type="number"
                        placeholder="Đến"
                        value={priceRange[1] || ''}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000000])}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                      />
                    </div>
                  </div>

                  {/* Quick Price Filters */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Lọc nhanh
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Dưới 500k', range: [0, 500000] },
                        { label: '500k - 1M', range: [500000, 1000000] },
                        { label: '1M - 2M', range: [1000000, 2000000] },
                        { label: 'Trên 2M', range: [2000000, 10000000] }
                      ].map((filter) => (
                        <button
                          key={filter.label}
                          onClick={() => setPriceRange(filter.range as [number, number])}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            priceRange[0] === filter.range[0] && priceRange[1] === filter.range[1]
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/80 text-gray-700 hover:bg-purple-50'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setFilters({ sortBy: 'name' })
                      setSearchQuery('')
                      setPriceRange([0, 10000000])
                    }}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-2 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-600">
                Hiển thị <span className="font-semibold text-purple-600">{filteredProducts.length}</span> trong tổng số <span className="font-medium">{products.length}</span> sản phẩm
              </p>
              {(searchQuery || priceRange[0] > 0 || priceRange[1] < 10000000) && (
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
              className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p 
              className="mt-6 text-gray-600 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Đang tải sản phẩm...
            </motion.p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy sản phẩm nào
            </h3>
            <p className="text-gray-500 mb-8 text-lg max-w-md mx-auto">
              Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc để xem thêm sản phẩm
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSearchQuery('')
                  setPriceRange([0, 10000000])
                  setFilters({ sortBy: 'name' })
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              >
                Xóa bộ lọc
              </button>
              <Link 
                href="/products" 
                className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all transform hover:scale-105"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}