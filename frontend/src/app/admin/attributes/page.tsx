'use client';

import { useState, useEffect } from 'react';
import { Palette, Ruler, Plus, Trash2, Edit } from 'lucide-react';
import { useAttributesStore } from '@/store/attributes';

interface Attribute {
  id: string;
  name: string;
}

export default function AdminAttributesPage() {
  const {
    colors,
    sizes,
    addColor,
    updateColor,
    deleteColor,
    addSize,
    updateSize,
    deleteSize,
    initDefaults,
  } = useAttributesStore();

  const [colorInput, setColorInput] = useState('');
  const [editingColor, setEditingColor] = useState<Attribute | null>(null);
  const [showColorModal, setShowColorModal] = useState(false);
  
  const [sizeInput, setSizeInput] = useState('');
  const [editingSize, setEditingSize] = useState<Attribute | null>(null);
  const [showSizeModal, setShowSizeModal] = useState(false);

  useEffect(() => {
    initDefaults();
  }, [initDefaults]);

  // Color Functions
  const handleAddColor = () => {
    if (colorInput.trim()) {
      addColor(colorInput);
      setColorInput('');
    }
  };

  const handleEditColor = (color: Attribute) => {
    setEditingColor(color);
    setColorInput(color.name);
    setShowColorModal(true);
  };

  const handleUpdateColor = () => {
    if (editingColor && colorInput.trim()) {
      updateColor(editingColor.id, colorInput);
      setColorInput('');
      setEditingColor(null);
      setShowColorModal(false);
    }
  };

  const handleDeleteColor = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa màu này?')) {
      deleteColor(id);
    }
  };

  // Size Functions
  const handleAddSize = () => {
    if (sizeInput.trim()) {
      addSize(sizeInput);
      setSizeInput('');
    }
  };

  const handleEditSize = (size: Attribute) => {
    setEditingSize(size);
    setSizeInput(size.name);
    setShowSizeModal(true);
  };

  const handleUpdateSize = () => {
    if (editingSize && sizeInput.trim()) {
      updateSize(editingSize.id, sizeInput);
      setSizeInput('');
      setEditingSize(null);
      setShowSizeModal(false);
    }
  };

  const handleDeleteSize = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa kích cỡ này?')) {
      deleteSize(id);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Thuộc tính</h1>
        <p className="text-gray-600 mt-2">Quản lý màu sắc và kích cỡ sản phẩm</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colors Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Palette className="text-purple-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Màu sắc</h2>
                <p className="text-sm text-gray-500">{colors.length} màu</p>
              </div>
            </div>
          </div>

          {/* Add Color Input */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddColor();
                  }
                }}
                placeholder="Nhập tên màu (vd: Đen, Trắng)"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleAddColor}
                disabled={!colorInput.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus size={18} />
                Thêm
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Nhấn Enter hoặc click &quot;Thêm&quot; để thêm màu mới
            </p>
          </div>

          {/* Colors List */}
          <div className="space-y-2">
            {colors.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Chưa có màu nào</p>
            ) : (
              colors.map((color) => (
                <div
                  key={color.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{color.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditColor(color)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Chỉnh sửa"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteColor(color.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sizes Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Ruler className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Kích cỡ</h2>
                <p className="text-sm text-gray-500">{sizes.length} kích cỡ</p>
              </div>
            </div>
          </div>

          {/* Add Size Input */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSize();
                  }
                }}
                placeholder="Nhập kích cỡ (vd: S, M, L)"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddSize}
                disabled={!sizeInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus size={18} />
                Thêm
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Nhấn Enter hoặc click &quot;Thêm&quot; để thêm kích cỡ mới
            </p>
          </div>

          {/* Sizes List */}
          <div className="space-y-2">
            {sizes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Chưa có kích cỡ nào</p>
            ) : (
              sizes.map((size) => (
                <div
                  key={size.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{size.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditSize(size)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Chỉnh sửa"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSize(size.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Color Modal */}
      {showColorModal && editingColor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa màu sắc</h2>
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleUpdateColor();
                }
              }}
              placeholder="Tên màu"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdateColor}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                Cập nhật
              </button>
              <button
                onClick={() => {
                  setShowColorModal(false);
                  setEditingColor(null);
                  setColorInput('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Size Modal */}
      {showSizeModal && editingSize && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa kích cỡ</h2>
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleUpdateSize();
                }
              }}
              placeholder="Kích cỡ"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdateSize}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Cập nhật
              </button>
              <button
                onClick={() => {
                  setShowSizeModal(false);
                  setEditingSize(null);
                  setSizeInput('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Lưu ý:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Màu sắc và kích cỡ được lưu cục bộ (localStorage)</li>
          <li>• Khi thêm sản phẩm, bạn có thể chọn từ danh sách này</li>
          <li>• Dữ liệu sẽ tự động đồng bộ khi tạo/sửa sản phẩm</li>
        </ul>
      </div>
    </div>
  );
}
