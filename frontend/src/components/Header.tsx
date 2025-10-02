'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Menu, User, Heart, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { categoriesApi } from '@/lib/api'
import { Category } from '@/types'
import { useState, useEffect } from 'react'

export default function Header() {
  const router = useRouter()
  const { getTotalItems, toggleCart } = useCartStore()
  const { user, isAuthenticated, logout, initAuth } = useAuthStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScroll, setLastScroll] = useState(0)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const totalItems = getTotalItems()

  useEffect(() => {
    setMounted(true)
    initAuth()
    
    // Fetch categories from backend
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll()
        setCategories(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      }
    }
    
    fetchCategories()
  }, [initAuth])

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    router.push('/')
  }

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY || 0
      if (current > 80 && current > lastScroll) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }
      setLastScroll(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScroll])

  return (
    <header className={`bg-[var(--surface)] shadow-sm sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[color:rgb(255_255_255_/_.6)] dark:supports-[backdrop-filter]:bg-[color:rgb(17_17_17_/_.6)] transition-transform duration-300 ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      {/* Top bar */}
      <div className="text-sm py-2 bg-[color:#dcfce7] text-[color:#166534] dark:bg-[color:#064e3b] dark:text-[color:#a7f3d0]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          Miễn phí vận chuyển từ 300.000đ, Mua ngay để nhận voucher
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-bold text-[var(--foreground)] flex-shrink-0 mr-4 transition-colors">
            FashionStore
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-shrink-0">
            <Link href="/" className="nav-link text-[color:var(--muted)] hover:text-[var(--foreground)] whitespace-nowrap">
              Trang chủ
            </Link>
            <Link href="/products" className="nav-link text-[color:var(--muted)] hover:text-[var(--foreground)] whitespace-nowrap">
              Sản phẩm
            </Link>
            <div className="relative group">
              <button className="text-[color:var(--muted)] hover:text-[var(--foreground)] transition-colors whitespace-nowrap">
                Danh mục
              </button>
              {/* Dropdown menu */}
              <div className="absolute top-full left-0 mt-2 w-48 bg-[var(--surface)] border border-[color:var(--border)] shadow-lg rounded-lg opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-200 z-50 animate-slide-down">
                <div className="py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2 text-[color:var(--muted)] hover:bg-[color:var(--border)]/30 hover:text-[var(--foreground)] transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/about" className="nav-link text-[color:var(--muted)] hover:text-[var(--foreground)] whitespace-nowrap">
              Về chúng tôi
            </Link>
          </nav>


          {/* Right section */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-[color:var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Desktop icons */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              {mounted && isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-[color:var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <User size={20} />
                    <span className="text-sm">{user?.name}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-[var(--surface)] border border-[color:var(--border)] shadow-lg rounded-lg z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-[color:var(--border)]">
                          <p className="text-sm font-medium text-[var(--foreground)]">{user?.name}</p>
                          <p className="text-xs text-[color:var(--muted)]">{user?.email}</p>
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-[color:var(--muted)] hover:bg-[color:var(--border)]/30 hover:text-[var(--foreground)]"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Tài khoản của tôi
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-[color:var(--muted)] hover:bg-[color:var(--border)]/30 hover:text-[var(--foreground)]"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Đơn hàng
                        </Link>
                        {user?.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-blue-600 hover:bg-[color:var(--border)]/30"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Quản trị
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[color:var(--border)]/30 flex items-center space-x-2"
                        >
                          <LogOut size={16} />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="p-2 text-[color:var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  <User size={20} />
                </Link>
              )}
              <button className="p-2 text-[color:var(--muted)] hover:text-[var(--foreground)] transition-colors">
                <Heart size={20} />
              </button>
              <button
                onClick={toggleCart}
                className="relative p-2 text-[color:var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <ShoppingBag size={20} />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile/Tablet cart icon */}
            <button
              onClick={toggleCart}
              className="lg:hidden relative p-2 text-[color:var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <ShoppingBag size={20} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[var(--surface)] border-t border-[color:var(--border)] animate-slide-down">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            <Link 
              href="/" 
              className="block text-[color:var(--muted)] hover:text-[var(--foreground)] py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link 
              href="/products" 
              className="block text-[color:var(--muted)] hover:text-[var(--foreground)] py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sản phẩm
            </Link>
            <div className="space-y-2">
              <p className="font-medium text-[var(--foreground)] py-2">Danh mục</p>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="block pl-4 text-[color:var(--muted)] hover:text-[var(--foreground)] py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <Link 
              href="/about" 
              className="block text-[color:var(--muted)] hover:text-[var(--foreground)] py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Về chúng tôi
            </Link>
            <div className="pt-4 border-t space-y-2">
              {mounted && isAuthenticated ? (
                <>
                  <div className="py-2">
                    <p className="text-sm font-medium text-[var(--foreground)]">{user?.name}</p>
                    <p className="text-xs text-[color:var(--muted)]">{user?.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 text-[color:var(--muted)] hover:text-[var(--foreground)] py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Tài khoản của tôi</span>
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center space-x-2 text-[color:var(--muted)] hover:text-[var(--foreground)] py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBag size={18} />
                    <span>Đơn hàng</span>
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2 text-blue-600 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>⚙️ Quản trị</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 text-red-600 py-2"
                  >
                    <LogOut size={18} />
                    <span>Đăng xuất</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 text-[color:var(--muted)] hover:text-[var(--foreground)] py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Đăng nhập</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-2 text-[color:var(--muted)] hover:text-[var(--foreground)] py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>📝 Đăng ký</span>
                  </Link>
                </>
              )}
              <button className="flex items-center space-x-2 text-[color:var(--muted)] hover:text-[var(--foreground)] py-2 transition-colors">
                <Heart size={18} />
                <span>Yêu thích</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

