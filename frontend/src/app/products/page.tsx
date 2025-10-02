'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { productsApi, categoriesApi } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { FilterOptions, Product, Category } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'name'
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productsApi.getAll(),
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
  }, [])

  const filteredProducts = useMemo(() => {
    const result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Match by category slug or id
      const matchesCategory = !filters.category || 
        (typeof product.category === 'string' ? product.category === filters.category : product.category.slug === filters.category)
      
      const matchesPrice = (!filters.minPrice || product.price >= filters.minPrice) &&
                          (!filters.maxPrice || product.price <= filters.maxPrice)
      
      return matchesSearch && matchesCategory && matchesPrice
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


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">Tất cả sản phẩm</h1>
        <p className="text-[color:var(--muted-foreground)]">Khám phá bộ sưu tập thời trang đa dạng của chúng tôi</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-[color:var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder-[color:var(--muted-foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--muted-foreground)]" size={20} />
        </div>

        {/* Filter Toggle & Sort */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-[color:var(--border)] text-[var(--foreground)] rounded-lg hover:bg-[color:var(--border)]/40 transition-colors"
          >
            <SlidersHorizontal size={18} />
            Bộ lọc
          </button>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as 'price-asc' | 'price-desc' | 'name' | 'rating' }))}
            className="px-4 py-2 border border-[color:var(--border)] bg-[var(--card)] text-[var(--foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="name">Sắp xếp theo tên</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-[var(--surface)] border border-[color:var(--border)] p-6 rounded-lg space-y-6 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Danh mục
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    category: e.target.value || undefined 
                  }))}
                  className="w-full px-3 py-2 border border-[color:var(--border)] bg-[var(--card)] text-[var(--foreground)] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
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
                    className="w-full px-3 py-2 border border-[color:var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder-[color:var(--muted-foreground)] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      maxPrice: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    className="w-full px-3 py-2 border border-[color:var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder-[color:var(--muted-foreground)] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
                  className="w-full px-4 py-2 border border-[color:var(--border)] text-[var(--foreground)] rounded hover:bg-[color:var(--border)]/40 transition-colors"
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
        <p className="text-[color:var(--muted-foreground)]">
          Hiển thị {filteredProducts.length} trong tổng số {products.length} sản phẩm
        </p>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-[color:var(--muted-foreground)]">Đang tải sản phẩm...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-[color:var(--border)]/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-[color:var(--muted-foreground)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
            Không tìm thấy sản phẩm nào
          </h3>
          <p className="text-[color:var(--muted-foreground)] mb-6">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
          </p>
          <button
            onClick={() => {
              setFilters({ sortBy: 'name' })
              setSearchQuery('')
            }}
            className="bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-2 rounded hover:opacity-90 transition-opacity"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  )
}

