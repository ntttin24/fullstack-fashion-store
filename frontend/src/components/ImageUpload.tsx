'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check limit
    if (images.length + files.length > maxImages) {
      alert(`Bạn chỉ có thể tải lên tối đa ${maxImages} hình ảnh`);
      return;
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      alert('Chỉ chấp nhận file ảnh định dạng: JPG, PNG, WEBP');
      return;
    }

    // Check file size (max 5MB each)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      alert('Mỗi file không được vượt quá 5MB');
      return;
    }

    await uploadFiles(files);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    setUploadProgress(files.map(f => f.name));

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`${API_URL}/upload/images`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload thất bại');
      }

      const data = await response.json();
      const newImages = [...images, ...data.urls];
      onImagesChange(newImages);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi tải lên');
    } finally {
      setUploading(false);
      setUploadProgress([]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Đang tải lên...
            </>
          ) : (
            <>
              <Upload size={18} />
              Chọn file từ máy tính
            </>
          )}
        </button>

        <span className="text-sm text-gray-500">
          {images.length}/{maxImages} ảnh
        </span>
      </div>

      <p className="text-xs text-gray-500">
        💡 Chọn file ảnh từ máy tính (JPG, PNG, WEBP). Tối đa {maxImages} ảnh, mỗi ảnh không quá 5MB.
      </p>

      {/* Upload Progress */}
      {uploading && uploadProgress.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800 mb-2">Đang tải lên:</p>
          <ul className="space-y-1">
            {uploadProgress.map((filename, idx) => (
              <li key={idx} className="text-xs text-blue-600 flex items-center gap-2">
                <Loader2 size={12} className="animate-spin" />
                {filename}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50">
                <Image
                  src={img}
                  alt={`Image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.svg';
                  }}
                />
              </div>
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                title="Xóa ảnh"
              >
                <X size={14} />
              </button>

              {/* Move Buttons */}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      className="flex-1 bg-white/90 hover:bg-white text-gray-700 text-xs py-1 rounded shadow"
                      title="Di chuyển lên"
                    >
                      ←
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      className="flex-1 bg-white/90 hover:bg-white text-gray-700 text-xs py-1 rounded shadow"
                      title="Di chuyển xuống"
                    >
                      →
                    </button>
                  )}
                </div>
              )}

              {/* Main Image Badge */}
              {index === 0 && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow">
                  Ảnh chính
                </span>
              )}

              {/* Image Number */}
              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600 mb-2">Chưa có hình ảnh nào</p>
          <p className="text-sm text-gray-500">
            Click nút &quot;Chọn file từ máy tính&quot; để tải ảnh lên
          </p>
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-500">
          ℹ️ Ảnh đầu tiên sẽ là ảnh đại diện. Bạn có thể sắp xếp lại thứ tự bằng các nút mũi tên.
        </p>
      )}
    </div>
  );
}

