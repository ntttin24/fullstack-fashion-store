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
      description: "Khám phá bộ sưu tập thời trang mới nhất với chất lượng cao và giá cả hợp lý. Từ trang phục công sở đến street style, chúng tôi có tất cả.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Khám phá ngay",
      buttonLink: "/products"
    },
    {
      id: 2,
      title: "Bộ sưu tập nữ",
      subtitle: "quyến rũ và thanh lịch",
      description: "Những thiết kế thời trang nữ đầy quyến rũ, từ váy dạ hội sang trọng đến trang phục casual năng động.",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Xem bộ sưu tập nữ",
      buttonLink: "/category/ao-nu"
    },
    {
      id: 3,
      title: "Phụ kiện thời trang",
      subtitle: "hoàn thiện phong cách",
      description: "Từ túi xách, đồng hồ đến trang sức, những phụ kiện tinh tế sẽ nâng tầm vẻ đẹp của bạn.",
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
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <section className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
        {/* Slides */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 w-full">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                      <Sparkles className="text-yellow-400" size={20} />
                      <span className="text-white font-medium text-sm">Xu hướng 2025</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
                      {slide.title}
                      <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-200">
                        {slide.subtitle}
                      </span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl mb-8 text-gray-200 leading-relaxed">
                      {slide.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href={slide.buttonLink}>
                        <button className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-base transform-gpu hover:translate-y-[-2px] hover:shadow-2xl active:translate-y-0 active:scale-[0.98]">
                          {slide.buttonText}
                          <ArrowRight size={20} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Cam kết mang đến trải nghiệm mua sắm tốt nhất với dịch vụ chuyên nghiệp</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Truck className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Miễn phí vận chuyển</h3>
              <p className="text-gray-600 leading-relaxed">Giao hàng miễn phí cho đơn từ 500.000đ trên toàn quốc</p>
            </div>
            
            <div className="group text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Đảm bảo chất lượng</h3>
              <p className="text-gray-600 leading-relaxed">Cam kết 100% chất lượng sản phẩm chính hãng</p>
            </div>
            
            <div className="group text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Headphones className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Hỗ trợ 24/7</h3>
              <p className="text-gray-600 leading-relaxed">Tư vấn và hỗ trợ khách hàng mọi lúc mọi nơi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
              <Sparkles className="text-purple-600" size={20} />
              <span className="text-purple-700 font-medium text-sm">Sản phẩm nổi bật</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Xu hướng thời trang</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Những sản phẩm được yêu thích nhất với chất lượng cao và thiết kế thời thượng
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Chưa có sản phẩm nổi bật</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-12">
            <Link href="/products">
              <button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg inline-flex items-center justify-center gap-2 text-sm sm:text-base transition-all transform-gpu hover:translate-y-[-1px] hover:shadow-lg active:translate-y-0 active:scale-[0.98]">
                Xem tất cả sản phẩm
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Accessories Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Watch className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Phụ kiện thời trang</h2>
                <p className="text-gray-600">Hoàn thiện phong cách của bạn</p>
              </div>
            </div>
            <Link href="/category/phu-kien">
              <button className="hidden sm:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Xem tất cả
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            </div>
          ) : accessoriesProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Chưa có sản phẩm phụ kiện</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {accessoriesProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link href="/category/phu-kien">
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center justify-center gap-2 text-sm transition-all transform-gpu hover:translate-y-[-1px] hover:shadow-lg active:translate-y-0 active:scale-[0.98]">
                Xem tất cả phụ kiện
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Shoes Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Footprints className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Giày dép cao cấp</h2>
                <p className="text-gray-600">Bước đi tự tin với phong cách</p>
              </div>
            </div>
            <Link href="/category/giay-dep">
              <button className="hidden sm:flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors">
                Xem tất cả
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            </div>
          ) : shoesProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Chưa có sản phẩm giày dép</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {shoesProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link href="/category/giay-dep">
              <button className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg inline-flex items-center justify-center gap-2 text-sm transition-all transform-gpu hover:translate-y-[-1px] hover:shadow-lg active:translate-y-0 active:scale-[0.98]">
                Xem tất cả giày dép
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-gray-100 text-gray-800">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full mb-4">
            <Sparkles className="text-gray-600" size={16} />
            <span className="text-gray-700 font-medium text-xs">Ưu đãi đặc biệt</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-3">
            Đăng ký nhận tin mới
          </h2>
          <p className="text-sm text-gray-600 mb-6 max-w-lg mx-auto">
            Nhận thông tin về sản phẩm mới, ưu đãi đặc biệt và xu hướng thời trang mới nhất
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 placeholder-gray-500 text-sm"
              />
              <button className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-all hover:bg-gray-700 text-sm">
                Đăng ký ngay
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Chúng tôi cam kết không spam. Bạn có thể hủy đăng ký bất cứ lúc nào.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FashionStore</h3>
              <p className="text-gray-400 mb-4">
                Thời trang hiện đại cho mọi phong cách sống
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-400">4.8/5 (1,234 đánh giá)</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Danh mục</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/category/ao-nam" className="hover:text-white transition-colors">Áo Nam</Link></li>
                <li><Link href="/category/ao-nu" className="hover:text-white transition-colors">Áo Nữ</Link></li>
                <li><Link href="/category/quan-nam" className="hover:text-white transition-colors">Quần Nam</Link></li>
                <li><Link href="/category/giay-dep" className="hover:text-white transition-colors">Giày Dép</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Hướng dẫn mua hàng</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Chính sách đổi trả</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Bảo mật thanh toán</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Liên hệ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 1900 1234</li>
                <li>📧 info@fashionstore.vn</li>
                <li>📍 123 Nguyễn Văn A, Q1, TP.HCM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FashionStore. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}