'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Package, Save } from 'lucide-react'
import Link from 'next/link'
import { productsApi, categoriesApi } from '@/lib/api'
import { Product, ProductVariant } from '@/types'
import ImageUpload from '@/components/ImageUpload'

interface Category {
  id: string
  name: string
}

const DEFAULT_COLORS = [
  'Đen', 'Trắng', 'Xám', 'Navy', 'Xanh đậm', 'Xanh nhạt',
  'Đỏ', 'Đỏ đô', 'Hồng', 'Hồng pastel', 'Xanh mint', 'Be',
  'Nâu', 'Nâu đậm', 'Kem', 'Nude', 'Ghi'
]

const DEFAULT_SIZES = [
  'S', 'M', 'L', 'XL', 'XXL',
  '26', '27', '28', '29', '30', '31', '32', '33',
  '35', '36', '37', '38', '39', '40', '41', '42', '43',
  'One Size', 'Free Size'
]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    featured: false,
    images: [] as string[],
  })
  
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [newVariant, setNewVariant] = useState({
    color: DEFAULT_COLORS[0],
    size: DEFAULT_SIZES[0],
    stock: 10
  })
  
  const [error, setError] = useState('')

  const fetchProduct = useCallback(async () => {
    try {
      const data = await productsApi.getById(productId) as Product
      setProduct(data)
      
      const categoryId = typeof data.category === 'string' ? data.category : data.category?.id
      
      setFormData({
        name: data.name,
        slug: data.slug || '',
        description: data.description,
        price: data.price.toString(),
        originalPrice: data.originalPrice?.toString() || '',
        categoryId: categoryId || '',
        featured: data.featured || false,
        images: data.images || [],
      })
      
      setVariants(data.variants || [])
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Không thể tải sản phẩm')
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchProduct()
    fetchCategories()
  }, [productId, fetchProduct])

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll() as Category[]
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleImagesChange = (images: string[]) => {
    setFormData({
      ...formData,
      images,
    })
  }

  const handleAddVariant = async () => {
    // Check if variant already exists
    const exists = variants.some(
      v => v.color === newVariant.color && v.size === newVariant.size
    )
    
    if (exists) {
      alert('Variant này đã tồn tại!')
      return
    }

    try {
      const created = await productsApi.addVariant(productId, newVariant) as ProductVariant
      setVariants([...variants, created])
    } catch (error) {
      console.error('Error adding variant:', error)
      alert('Thêm variant thất bại')
    }
  }

  const handleRemoveVariant = async (variantId: string, color: string, size: string) => {
    if (!confirm('Bạn có chắc muốn xóa variant này?')) return

    try {
      await productsApi.deleteVariant(productId, color, size)
      setVariants(variants.filter(v => v.id !== variantId))
    } catch (error) {
      console.error('Error deleting variant:', error)
      alert('Xóa variant thất bại')
    }
  }

  const handleUpdateVariantStock = async (color: string, size: string, stock: number) => {
    try {
      await productsApi.updateVariantStock(productId, color, size, stock)
      // Update local state
      setVariants(variants.map(v => 
        v.color === color && v.size === size ? { ...v, stock } : v
      ))
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Cập nhật stock thất bại')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      // Validate
      if (!formData.name || !formData.slug || !formData.categoryId) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc')
      }

      if (formData.images.length === 0) {
        throw new Error('Vui lòng thêm ít nhất 1 hình ảnh')
      }

      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
        categoryId: formData.categoryId,
        featured: formData.featured,
        images: formData.images,
      }

      await productsApi.update(productId, productData)
      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  const getTotalStock = () => {
    return variants.reduce((sum, v) => sum + v.stock, 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Không tìm thấy sản phẩm</p>
        <Link href="/admin/products" className="text-blue-600 hover:underline mt-4 inline-block">
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Quay lại
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Thông tin cơ bản
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá bán <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="1000"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá gốc
              </label>
              <input
                type="number"
                name="originalPrice"
                min="0"
                step="1000"
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                required
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
              Sản phẩm nổi bật
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Hình ảnh <span className="text-red-500">*</span>
          </h2>

          <ImageUpload
            images={formData.images}
            onImagesChange={handleImagesChange}
            maxImages={10}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Save size={20} />
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <Link
            href="/admin/products"
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 text-center font-medium"
          >
            Hủy
          </Link>
        </div>
      </form>

      {/* Variants Management */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Quản lý biến thể
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Tổng: {variants.length} variants • {getTotalStock()} sản phẩm
            </p>
          </div>
        </div>

        {/* Add Variant Form */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Màu sắc
              </label>
              <select
                value={newVariant.color}
                onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {DEFAULT_COLORS.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select
                value={newVariant.size}
                onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DEFAULT_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tồn kho
              </label>
              <input
                type="number"
                min="0"
                value={newVariant.stock}
                onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddVariant}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus size={20} />
                Thêm
              </button>
            </div>
          </div>
        </div>

        {/* Variants List */}
        {variants.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Màu sắc</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {variants.map((variant, index) => (
                  <tr key={variant.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                        {variant.color}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {variant.size}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => handleUpdateVariantStock(variant.color, variant.size, parseInt(e.target.value) || 0)}
                        className="w-24 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(variant.id, variant.color, variant.size)}
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <Package size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">Chưa có variant nào. Thêm variant ở trên.</p>
          </div>
        )}
      </div>
    </div>
  )
}
