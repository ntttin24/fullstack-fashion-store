'use client'

import { useState } from 'react'
import { Plus, Trash2, Package, Palette } from 'lucide-react'

// interface Attribute {
//   id: string
//   name: string
//   type: 'COLOR' | 'SIZE'
// }

export default function AdminAttributesPage() {
  const [colors, setColors] = useState<string[]>([
    'Đen', 'Trắng', 'Xám', 'Navy', 'Xanh đậm', 'Xanh nhạt', 
    'Đỏ', 'Đỏ đô', 'Hồng', 'Hồng pastel', 'Xanh mint', 'Be', 
    'Nâu', 'Nâu đậm', 'Kem', 'Nude', 'Ghi'
  ])
  const [sizes, setSizes] = useState<string[]>([
    'S', 'M', 'L', 'XL', 'XXL',
    '26', '27', '28', '29', '30', '31', '32', '33',
    '35', '36', '37', '38', '39', '40', '41', '42', '43',
    'One Size', 'Free Size'
  ])
  
  const [newColor, setNewColor] = useState('')
  const [newSize, setNewSize] = useState('')
  const [activeTab, setActiveTab] = useState<'colors' | 'sizes'>('colors')

  const handleAddColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()])
      setNewColor('')
    }
  }

  const handleAddSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()])
      setNewSize('')
    }
  }

  const handleRemoveColor = (color: string) => {
    if (confirm(`Bạn có chắc muốn xóa màu "${color}"?`)) {
      setColors(colors.filter(c => c !== color))
    }
  }

  const handleRemoveSize = (size: string) => {
    if (confirm(`Bạn có chắc muốn xóa size "${size}"?`)) {
      setSizes(sizes.filter(s => s !== size))
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý Thuộc Tính</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Quản lý màu sắc và kích cỡ cho sản phẩm
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b flex flex-col sm:flex-row">
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-colors relative text-sm sm:text-base ${
              activeTab === 'colors'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Palette size={18} />
            <span className="hidden sm:inline">Màu sắc</span>
            <span className="sm:hidden">Màu</span>
            <span className="ml-1">({colors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sizes')}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-colors relative text-sm sm:text-base ${
              activeTab === 'sizes'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package size={18} />
            <span className="hidden sm:inline">Kích cỡ</span>
            <span className="sm:hidden">Size</span>
            <span className="ml-1">({sizes.length})</span>
          </button>
        </div>

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Thêm màu sắc mới</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddColor()}
                  placeholder="Nhập tên màu (VD: Xanh dương)"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                />
                <button
                  onClick={handleAddColor}
                  disabled={!newColor.trim()}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Thêm màu</span>
                  <span className="sm:hidden">Thêm</span>
                </button>
              </div>
            </div>

            <div className="border-t pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Danh sách màu sắc ({colors.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {colors.map((color) => (
                  <div
                    key={color}
                    className="group relative bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{color}</span>
                      <button
                        onClick={() => handleRemoveColor(color)}
                        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity flex-shrink-0 ml-2"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {colors.length === 0 && (
                <p className="text-center text-gray-500 py-8 text-sm sm:text-base">
                  Chưa có màu sắc nào. Thêm màu mới ở trên.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Sizes Tab */}
        {activeTab === 'sizes' && (
          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Thêm kích cỡ mới</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSize()}
                  placeholder="Nhập kích cỡ (VD: XL, 42, Free Size)"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <button
                  onClick={handleAddSize}
                  disabled={!newSize.trim()}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Thêm size</span>
                  <span className="sm:hidden">Thêm</span>
                </button>
              </div>
            </div>

            <div className="border-t pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Danh sách kích cỡ ({sizes.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {sizes.map((size) => (
                  <div
                    key={size}
                    className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-bold text-gray-900 text-base sm:text-lg">{size}</span>
                      <button
                        onClick={() => handleRemoveSize(size)}
                        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity text-sm"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {sizes.length === 0 && (
                <p className="text-center text-gray-500 py-8 text-sm sm:text-base">
                  Chưa có kích cỡ nào. Thêm size mới ở trên.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Lưu ý
        </h3>
        <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
          <li>• Màu sắc và kích cỡ này sẽ được sử dụng khi tạo/sửa sản phẩm</li>
          <li>• Mỗi sản phẩm có thể có nhiều biến thể (màu × size) với tồn kho riêng</li>
          <li>• Xóa thuộc tính sẽ không ảnh hưởng đến sản phẩm đã tạo</li>
        </ul>
      </div>
    </div>
  )
}
