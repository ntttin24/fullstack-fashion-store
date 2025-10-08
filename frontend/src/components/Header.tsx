'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingBag, Menu, User, Bell, LogOut, X, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { categoriesApi } from '@/lib/api'
import { Category } from '@/types'
import { useState, useEffect } from 'react'
import NotificationDropdown from './NotificationDropdown'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { getTotalItems, toggleCart, justAdded } = useCartStore()
  const { user, isAuthenticated, logout, initAuth } = useAuthStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
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

  // Scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg dark:bg-gray-900/95' 
          : 'bg-white dark:bg-gray-900'
      }`}>
        {/* Top bar - Hidden when scrolled */}
        <div className={`text-xs py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white transition-all duration-300 ${
          isScrolled ? 'h-0 py-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'
        }`}>
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">🚚 Miễn phí vận chuyển từ 300.000đ</span>
              <span>✨ Giảm đến 50% cho thành viên mới</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span>📞 Hotline: 1900 1234</span>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                    Fashion
                  </div>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                </div>
                <span className="text-xl md:text-2xl font-light text-gray-600 dark:text-gray-400">Store</span>
              </Link>

              {/* Desktop Navigation - Minimalist Design with Smooth Effects */}
              <nav className="hidden lg:flex items-center gap-8">
                <Link href="/" className={`relative pb-1 text-sm font-medium transition-all duration-300 group ${
                  pathname === '/' 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}>
                  Trang chủ
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${
                    pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link href="/products" className={`relative pb-1 text-sm font-medium transition-all duration-300 group ${
                  pathname === '/products' 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}>
                  Sản phẩm
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${
                    pathname === '/products' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                
                {/* Minimalist Dropdown with Animation */}
                <div className="relative group">
                  <button className={`relative pb-1 flex items-center gap-1 text-sm font-medium transition-all duration-300 ${
                    pathname?.startsWith('/category') 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}>
                    Danh mục
                    <ChevronDown size={14} className="transition-all duration-300 group-hover:rotate-180" />
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${
                      pathname?.startsWith('/category') ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 py-2 overflow-hidden">
                      {categories.map((category, index) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.slug}`}
                          className={`block px-4 py-2 text-sm transition-all duration-200 hover:pl-6 ${
                            pathname === `/category/${category.slug}`
                              ? 'text-gray-900 dark:text-white font-medium bg-gray-50 dark:bg-gray-800'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          style={{ 
                            transitionDelay: `${index * 30}ms`
                          }}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Link href="/about" className={`relative pb-1 text-sm font-medium transition-all duration-300 group ${
                  pathname === '/about' 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}>
                  Về chúng tôi
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${
                    pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              </nav>

              {/* Right section */}
              <div className="flex items-center gap-2 md:gap-3">
                {/* Desktop User Menu */}
                <div className="hidden lg:block relative">
                  {mounted && isAuthenticated ? (
                    <div className="relative">
                      <button 
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-medium">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium max-w-24 truncate">{user?.name}</span>
                        <ChevronDown size={16} className={showUserMenu ? 'rotate-180' : ''} />
                      </button>
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-xl overflow-hidden z-50 animate-slide-down">
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                          </div>
                          <div className="py-2">
                            <Link
                              href="/profile"
                              className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              👤 Tài khoản của tôi
                            </Link>
                            <Link
                              href="/orders"
                              className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              📦 Đơn hàng của tôi
                            </Link>
                            {user?.role === 'ADMIN' && (
                              <Link
                                href="/admin"
                                className="block px-4 py-2.5 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => setShowUserMenu(false)}
                              >
                                ⚙️ Quản trị hệ thống
                              </Link>
                            )}
                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
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
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 transform"
                    >
                      Đăng nhập
                    </Link>
                  )}
                </div>

                {/* Notifications */}
                {mounted && isAuthenticated && user && (
                  <NotificationDropdown userId={user.id} />
                )}

                {/* Cart */}
                <button
                  onClick={toggleCart}
                  className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <div className={justAdded ? 'animate-cart-bounce' : ''}>
                    <ShoppingBag size={20} />
                  </div>
                  {mounted && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white dark:bg-gray-900 w-80 h-full overflow-y-auto animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1">
                <Link 
                  href="/" 
                  className={`block px-4 py-3 transition-all duration-200 font-medium hover:pl-6 ${
                    pathname === '/'
                      ? 'text-gray-900 dark:text-white border-l-2 border-gray-900 dark:border-white pl-6'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trang chủ
                </Link>
                <Link 
                  href="/products" 
                  className={`block px-4 py-3 transition-all duration-200 font-medium hover:pl-6 ${
                    pathname === '/products'
                      ? 'text-gray-900 dark:text-white border-l-2 border-gray-900 dark:border-white pl-6'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sản phẩm
                </Link>
                
                <div className="pt-2 pb-2">
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Danh mục</p>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className={`block px-4 py-2.5 transition-all duration-200 hover:pl-6 ${
                        pathname === `/category/${category.slug}`
                          ? 'text-gray-900 dark:text-white border-l-2 border-gray-900 dark:border-white pl-6'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
                
                <Link 
                  href="/about" 
                  className={`block px-4 py-3 transition-all duration-200 font-medium hover:pl-6 ${
                    pathname === '/about'
                      ? 'text-gray-900 dark:text-white border-l-2 border-gray-900 dark:border-white pl-6'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Về chúng tôi
                </Link>
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                {mounted && isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} />
                      <span>Tài khoản của tôi</span>
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingBag size={18} />
                      <span>Đơn hàng của tôi</span>
                    </Link>
                    <Link
                      href="/notifications"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Bell size={18} />
                      <span>Thông báo</span>
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>⚙️ Quản trị hệ thống</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                      <LogOut size={18} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block px-4 py-3 text-center text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 transform font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-3 text-center text-purple-600 dark:text-purple-400 border border-purple-600 dark:border-purple-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

