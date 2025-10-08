'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Star, Truck, Shield, Headphones, Sparkles, Watch, Footprints, ChevronLeft, ChevronRight } from 'lucide-react'
import { productsApi } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [accessoriesProducts, setAccessoriesProducts] = useState<Product[]>([])
  const [shoesProducts, setShoesProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Slide data
  const slides = [
    {
      id: 1,
      title: "Thời trang hiện đại",
      subtitle: "cho mọi phong cách",
      description: "Khám phá bộ sưu tập thời trang mới nhất với chất lượng cao và giá cả hợp lý.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Khám phá ngay",
      buttonLink: "/products"
    },
    {
      id: 2,
      title: "Bộ sưu tập nữ",
      subtitle: "quyến rũ và thanh lịch",
      description: "Những thiết kế thời trang nữ đầy quyến rũ, từ váy dạ hội đến trang phục casual.",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Xem bộ sưu tập",
      buttonLink: "/category/ao-nu"
    },
    {
      id: 3,
      title: "Thời trang nam",
      subtitle: "phong cách và lịch lãm",
      description: "Bộ sưu tập nam giới hiện đại, từ công sở đến dạo phố, phù hợp mọi hoàn cảnh.",
      image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Xem bộ sưu tập",
      buttonLink: "/category/ao-nam"
    },
    {
      id: 4,
      title: "Phụ kiện thời trang",
      subtitle: "hoàn thiện phong cách",
      description: "Từ túi xách, đồng hồ đến trang sức, những phụ kiện tinh tế nâng tầm vẻ đẹp.",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Khám phá phụ kiện",
      buttonLink: "/category/phu-kien"
    }
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredData, accessoriesData, shoesData] = await Promise.all([
          productsApi.getAll({ featured: true }),
          productsApi.getAll({ category: 'phu-kien', featured: true }),
          productsApi.getAll({ category: 'giay-dep', featured: true })
        ])
        
        setFeaturedProducts(Array.isArray(featuredData) ? featuredData.slice(0, 6) : [])
        setAccessoriesProducts(Array.isArray(accessoriesData) ? accessoriesData.slice(0, 4) : [])
        setShoesProducts(Array.isArray(shoesData) ? shoesData.slice(0, 4) : [])
      } catch (error) {
        console.error('Error fetching products:', error)
        setFeaturedProducts([])
        setAccessoriesProducts([])
        setShoesProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Auto slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 10000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider - Redesigned */}
      <section className="relative h-[75vh] md:h-[85vh] overflow-hidden">
        {/* Slides */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                index === currentSlide 
                  ? 'translate-x-0' 
                  : index < currentSlide 
                    ? '-translate-x-full' 
                    : 'translate-x-full'
              }`}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${slide.image})`
                }}
              >
                {/* Simple Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
                      <span className="text-white drop-shadow-2xl block mb-2">
                        {slide.title}
                      </span>
                      <span className="block text-2xl sm:text-3xl md:text-4xl font-light text-purple-300">
                        {slide.subtitle}
                      </span>
                    </h1>
                    
                    {/* Description */}
                    <p className="text-base sm:text-lg mb-8 text-gray-100 leading-relaxed max-w-xl drop-shadow-lg">
                      {slide.description}
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href={slide.buttonLink}>
                        <button className="group w-full sm:w-auto bg-white hover:bg-gray-100 text-gray-900 px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:shadow-2xl hover:scale-105 active:scale-95">
                          <span>{slide.buttonText}</span>
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                      <Link href="/about">
                        <button className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:bg-white/20 hover:border-white/50 hover:scale-105 active:scale-95">
                          Tìm hiểu thêm
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modern Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Modern Progress Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="group relative"
            >
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125 w-6' 
                  : 'bg-white/50 hover:bg-white/80'
              }`} />
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products - Redesigned */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sản phẩm nổi bật</h2>
              <p className="text-gray-600 text-sm">Những sản phẩm được yêu thích nhất với chất lượng cao và thiết kế thời thượng</p>
            </div>
            <Link href="/products">
              <button className="group flex items-center gap-2 text-gray-900 hover:text-gray-700 font-semibold transition-colors">
                Xem tất cả
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 mx-auto rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-2xl">
              <div className="text-4xl mb-2">🛍️</div>
              <p className="text-gray-600 text-sm">Chưa có sản phẩm nổi bật</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group scale-95">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles size={16} />
              <span>Ưu đãi đặc biệt</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Giảm giá lên đến 50%
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Khám phá bộ sưu tập mới với mức giá ưu đãi cực kỳ hấp dẫn. Áp dụng cho tất cả sản phẩm thời trang.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/products?sale=true">
                <button className="group bg-white hover:bg-gray-100 text-purple-700 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:shadow-2xl hover:scale-105 active:scale-95">
                  <span>Mua ngay</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-sm">Chỉ còn</span>
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-lg">
                  <span className="text-lg font-bold">7</span>
                  <span className="text-xs">ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shoes Section - Redesigned */}
      <section className="py-16 md:py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-200/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/30">
                <Footprints className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Giày dép cao cấp</h2>
                <p className="text-gray-600 text-sm">Bước đi tự tin với phong cách</p>
              </div>
            </div>
            <Link href="/category/giay-dep">
              <button className="group flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                Xem tất cả
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 mx-auto rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin"></div>
            </div>
          ) : shoesProducts.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-2xl">
              <div className="text-4xl mb-2">👟</div>
              <p className="text-gray-600 text-sm">Chưa có sản phẩm giày dép</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {shoesProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Accessories Section - Redesigned */}
      <section className="py-16 md:py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30">
                <Watch className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Phụ kiện thời trang</h2>
                <p className="text-gray-600 text-sm">Hoàn thiện phong cách của bạn</p>
              </div>
            </div>
            <Link href="/category/phu-kien">
              <button className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Xem tất cả
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 mx-auto rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            </div>
          ) : accessoriesProducts.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl">
              <div className="text-4xl mb-2">⌚</div>
              <p className="text-gray-600 text-sm">Chưa có sản phẩm phụ kiện</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {accessoriesProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features - Redesigned with Balanced Layout */}
      <section className="py-20 md:py-24 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.08),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles size={16} />
              <span>Tại sao chọn chúng tôi</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trải nghiệm mua sắm tuyệt vời
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến cho bạn dịch vụ tốt nhất với chất lượng, uy tín và sự chuyên nghiệp
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden min-h-[280px] flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative flex flex-col items-center text-center flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                  <Truck className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">Miễn phí vận chuyển</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">Áp dụng cho đơn hàng từ 300.000đ</p>
                <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                  <p className="text-blue-600 font-semibold text-sm">Giao hàng 2-3 ngày</p>
                </div>
              </div>
            </div>
            
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden min-h-[280px] flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/15 to-emerald-500/15 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative flex flex-col items-center text-center flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-green-500/30">
                  <Shield className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">Đảm bảo chất lượng</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">Sản phẩm chính hãng 100%</p>
                <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                  <p className="text-green-600 font-semibold text-sm">Đổi trả trong 30 ngày</p>
                </div>
              </div>
            </div>
            
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden min-h-[280px] flex flex-col sm:col-span-2 lg:col-span-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative flex flex-col items-center text-center flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                  <Headphones className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">Hỗ trợ 24/7</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">Đội ngũ tư vấn chuyên nghiệp</p>
                <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                  <p className="text-purple-600 font-semibold text-sm">Luôn sẵn sàng hỗ trợ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Redesigned */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Fashion
                </div>
                <span className="text-xl font-light text-gray-400">Store</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Thời trang hiện đại cho mọi phong cách sống. Chất lượng cao, giá cả hợp lý.
              </p>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-xs text-gray-500">4.8/5 từ 1,234 đánh giá</p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 text-base">Danh mục</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/category/ao-nam" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  Áo Nam
                </Link></li>
                <li><Link href="/category/ao-nu" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  Áo Nữ
                </Link></li>
                <li><Link href="/category/quan-nam" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  Quần Nam
                </Link></li>
                <li><Link href="/category/giay-dep" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  Giày Dép
                </Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 text-base">Hỗ trợ</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="#" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
                  Hướng dẫn mua hàng
                </Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
                  Chính sách đổi trả
                </Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
                  Bảo mật thanh toán
                </Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
                  Liên hệ
                </Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 text-base">Liên hệ</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-lg">📞</span>
                  <div>
                    <p className="text-white font-semibold text-xs">Hotline</p>
                    <p className="text-gray-400 text-xs">1900 1234</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">📧</span>
                  <div>
                    <p className="text-white font-semibold text-xs">Email</p>
                    <p className="text-gray-400 text-xs">info@fashionstore.vn</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">📍</span>
                  <div>
                    <p className="text-white font-semibold text-xs">Địa chỉ</p>
                    <p className="text-gray-400 text-xs">123 Nguyễn Văn A, Q1, TP.HCM</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-xs">
                &copy; 2025 FashionStore. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex items-center gap-4">
                <Link href="#" className="text-gray-500 hover:text-purple-400 transition-colors">
                  <span className="text-xl">📘</span>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-purple-400 transition-colors">
                  <span className="text-xl">📷</span>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-purple-400 transition-colors">
                  <span className="text-xl">🐦</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}