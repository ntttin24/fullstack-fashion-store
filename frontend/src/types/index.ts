export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  category: string | { id: string; name: string; slug: string }
  sizes: string[]
  colors: string[]
  images: string[]
  featured?: boolean
  rating: number
  reviewCount: number
  slug?: string
  stock?: number
  categoryId?: string
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
