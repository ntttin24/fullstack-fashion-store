'use client'

import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'
import { productsApi, categoriesApi } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { FilterOptions, Product, Category } from '@/types'
import Link from 'next/link'

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
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesPrice = (!filters.minPrice || product.price >= filters.minPrice) &&
                          (!filters.maxPrice || product.price <= filters.maxPrice)
      
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
  }, [products, searchQuery, filters])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy danh mục</h1>
          <p className="text-gray-600 mb-6">Danh mục bạn tìm kiếm không tồn tại</p>
          <Link href="/products" className="bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-2 rounded transition-all transform-gpu hover:translate-y-[-1px] hover:shadow-lg active:translate-y-0 active:scale-[0.98]">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{category.name}</h1>
        <p className="text-gray-600">Khám phá bộ sưu tập {category.name.toLowerCase()} đa dạng</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder={`Tìm kiếm trong ${category.name.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Filter Toggle & Sort */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal size={18} />
            Bộ lọc
          </button>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as 'price-asc' | 'price-desc' | 'name' | 'rating' }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sắp xếp theo tên</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoảng giá
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={filters.minPrice || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      minPrice: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      maxPrice: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({ sortBy: 'name' })
                    setSearchQuery('')
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          Hiển thị {filteredProducts.length} sản phẩm trong danh mục {category.name}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có sản phẩm nào trong danh mục này
          </h3>
          <p className="text-gray-500 mb-6">
            Thử tìm kiếm với từ khóa khác hoặc xem danh mục khác
          </p>
          <Link href="/products" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors">
            Xem tất cả sản phẩm
          </Link>
        </div>
      )}
    </div>
  )
}

