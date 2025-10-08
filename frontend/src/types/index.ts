export interface ProductVariant {
  id: string
  productId: string
  color: string
  size: string
  stock: number
  sku?: string
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  category: string | { id: string; name: string; slug: string }
  images: string[]
  featured?: boolean
  rating: number
  reviewCount: number
  slug?: string
  categoryId?: string
  variants?: ProductVariant[]
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface FilterOptions {
  category?: string
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'rating'
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'ORDER' | 'SYSTEM' | 'PROMOTION'
  isRead: boolean
  orderId?: string
  createdAt: string
  updatedAt: string
}
