'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Shield, Users, Heart, 
  Star, Globe, Zap, Target, Eye,
  Quote, ChevronLeft, ChevronRight, Mail, Phone, MapPin,
  Instagram, Facebook, Twitter, Youtube, CheckCircle
} from 'lucide-react'

export default function AboutPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [counters, setCounters] = useState({
    customers: 0,
    products: 0,
    satisfaction: 0,
    support: 0
  })

  // Animated counters
  useEffect(() => {
    const targets = { customers: 10000, products: 5000, satisfaction: 99, support: 24 }
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    const animateCounters = () => {
      let step = 0
      const timer = setInterval(() => {
        step++
        const progress = step / steps
        const easeOut = 1 - Math.pow(1 - progress, 3)
        
        setCounters({
          customers: Math.floor(targets.customers * easeOut),
          products: Math.floor(targets.products * easeOut),
          satisfaction: Math.floor(targets.satisfaction * easeOut),
          support: Math.floor(targets.support * easeOut)
        })

        if (step >= steps) {
          clearInterval(timer)
          setCounters(targets)
        }
      }, stepDuration)
    }

    const timer = setTimeout(animateCounters, 500)
    return () => clearTimeout(timer)
  }, [])

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Thị Mai",
      role: "Khách hàng thân thiết",
      content: "FashionStore đã thay đổi hoàn toàn cách tôi mua sắm thời trang. Chất lượng sản phẩm tuyệt vời và dịch vụ khách hàng rất chuyên nghiệp.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 2,
      name: "Trần Văn Nam",
      role: "Doanh nhân",
      content: "Tôi rất ấn tượng với sự đa dạng sản phẩm và tốc độ giao hàng nhanh chóng. FashionStore thực sự hiểu được nhu cầu của khách hàng.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 3,
      name: "Lê Thị Hương",
      role: "Sinh viên",
      content: "Giá cả hợp lý, chất lượng tốt và mẫu mã đẹp. Tôi đã giới thiệu FashionStore cho rất nhiều bạn bè và họ đều rất hài lòng.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              Được tin tưởng bởi hơn 10,000 khách hàng
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent animate-slide-up">
              Về FashionStore
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed animate-slide-up delay-200">
              Chúng tôi không chỉ bán thời trang, chúng tôi tạo ra phong cách sống. 
              Mỗi sản phẩm là một câu chuyện, mỗi khách hàng là một phần của gia đình FashionStore.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-400">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Khám phá bộ sưu tập
              </button>
              <button className="px-8 py-4 border-2 border-white/30 hover:border-white/60 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm">
                Xem video giới thiệu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Sứ mệnh & Tầm nhìn
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi không chỉ bán thời trang, chúng tôi tạo ra những trải nghiệm đáng nhớ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                FashionStore cam kết mang đến những sản phẩm thời trang chất lượng cao, 
                phù hợp với mọi phong cách và ngân sách. Chúng tôi tin rằng mọi người 
                đều xứng đáng có được những sản phẩm đẹp, chất lượng với giá cả hợp lý.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                Chất lượng đảm bảo 100%
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tầm nhìn</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Trở thành thương hiệu thời trang hàng đầu Việt Nam, được tin tưởng bởi 
                hàng triệu khách hàng. Chúng tôi hướng tới việc tạo ra một cộng đồng 
                yêu thích thời trang, nơi mọi người có thể thể hiện cá tính riêng.
              </p>
              <div className="flex items-center text-purple-600 font-semibold">
                <Globe className="w-5 h-5 mr-2" />
                Vươn tầm quốc tế
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Hành trình của chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Từ những ngày đầu khởi nghiệp đến hiện tại, FashionStore đã trải qua một hành trình đầy thú vị
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            
            <div className="space-y-12">
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">2019</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Khởi đầu</h3>
                    <p className="text-gray-600">
                      FashionStore được thành lập với tầm nhìn tạo ra một không gian mua sắm 
                      thời trang trực tuyến đáng tin cậy cho người Việt Nam.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                <div className="w-1/2 pl-8"></div>
              </div>

              <div className="flex items-center">
                <div className="w-1/2 pr-8"></div>
                <div className="w-8 h-8 bg-purple-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                <div className="w-1/2 pl-8">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-2">2021</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Mở rộng</h3>
                    <p className="text-gray-600">
                      Mở rộng danh mục sản phẩm và xây dựng mối quan hệ bền vững với 
                      các nhà cung cấp uy tín trong và ngoài nước.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">2023</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Thành công</h3>
                    <p className="text-gray-600">
                      Đạt được 10,000+ khách hàng hài lòng và trở thành một trong những 
                      thương hiệu thời trang trực tuyến được tin tưởng nhất.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                <div className="w-1/2 pl-8"></div>
              </div>

              <div className="flex items-center">
                <div className="w-1/2 pr-8"></div>
                <div className="w-8 h-8 bg-pink-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                <div className="w-1/2 pl-8">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-2xl font-bold text-pink-600 mb-2">2024</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Tương lai</h3>
                    <p className="text-gray-600">
                      Tiếp tục phát triển và đổi mới, hướng tới việc trở thành thương hiệu 
                      thời trang hàng đầu khu vực Đông Nam Á.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những nguyên tắc và giá trị định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tận tâm</h3>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi luôn đặt khách hàng làm trung tâm, cung cấp dịch vụ tận tình và chu đáo
              </p>
            </div>

            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chất lượng</h3>
              <p className="text-gray-600 leading-relaxed">
                Cam kết mang đến sản phẩm chất lượng cao, bền đẹp và an toàn cho người dùng
              </p>
            </div>

            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cộng đồng</h3>
              <p className="text-gray-600 leading-relaxed">
                Xây dựng cộng đồng yêu thích thời trang, chia sẻ kinh nghiệm và phong cách
              </p>
            </div>

            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Đổi mới</h3>
              <p className="text-gray-600 leading-relaxed">
                Không ngừng cải tiến và đổi mới để mang đến những trải nghiệm tốt nhất
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Thành tựu của chúng tôi
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Những con số ấn tượng phản ánh sự tin tưởng và hài lòng của khách hàng
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl lg:text-5xl font-bold mb-2 text-yellow-300">
                  {counters.customers.toLocaleString()}+
                </div>
                <div className="text-blue-100 font-medium">Khách hàng hài lòng</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl lg:text-5xl font-bold mb-2 text-green-300">
                  {counters.products.toLocaleString()}+
                </div>
                <div className="text-blue-100 font-medium">Sản phẩm đa dạng</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl lg:text-5xl font-bold mb-2 text-pink-300">
                  {counters.satisfaction}%
                </div>
                <div className="text-blue-100 font-medium">Tỷ lệ hài lòng</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl lg:text-5xl font-bold mb-2 text-orange-300">
                  {counters.support}/7
                </div>
                <div className="text-blue-100 font-medium">Hỗ trợ khách hàng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những phản hồi chân thực từ khách hàng là động lực lớn nhất của chúng tôi
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
              <div className="text-center">
                <Quote className="w-12 h-12 text-blue-500 mx-auto mb-6" />
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8 italic">
                  &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                </p>
                
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden relative">
                    <Image 
                      src={testimonials[currentTestimonial].avatar} 
                      alt={testimonials[currentTestimonial].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
                
                <div className="flex justify-center mb-8">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-4">
              <button 
                onClick={prevTestimonial}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextTestimonial}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Đội ngũ của chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những con người tài năng và đam mê thời trang đang làm việc mỗi ngày để phục vụ bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold group-hover:scale-110 transition-transform duration-300">
                  NA
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nguyễn Văn A</h3>
              <p className="text-blue-600 font-semibold mb-4">CEO & Founder</p>
              <p className="text-gray-600 leading-relaxed">
                Với 10 năm kinh nghiệm trong ngành thời trang, anh A dẫn dắt team phát triển 
                những sản phẩm chất lượng nhất.
              </p>
              <div className="flex justify-center mt-4 space-x-3">
                <button className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <Facebook className="w-4 h-4 text-blue-600" />
                </button>
                <button className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors">
                  <Instagram className="w-4 h-4 text-purple-600" />
                </button>
                <button className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <Twitter className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>

            <div className="group text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-red-600 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold group-hover:scale-110 transition-transform duration-300">
                  TB
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trần Thị B</h3>
              <p className="text-pink-600 font-semibold mb-4">Head of Design</p>
              <p className="text-gray-600 leading-relaxed">
                Chuyên gia về xu hướng thời trang, chị B đảm bảo mọi sản phẩm đều theo kịp 
                xu hướng mới nhất.
              </p>
              <div className="flex justify-center mt-4 space-x-3">
                <button className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <Facebook className="w-4 h-4 text-blue-600" />
                </button>
                <button className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors">
                  <Instagram className="w-4 h-4 text-purple-600" />
                </button>
                <button className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <Twitter className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>

            <div className="group text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold group-hover:scale-110 transition-transform duration-300">
                  LC
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lê Văn C</h3>
              <p className="text-green-600 font-semibold mb-4">Customer Success</p>
              <p className="text-gray-600 leading-relaxed">
                Với tinh thần phục vụ tận tình, anh C đảm bảo mọi khách hàng đều có trải nghiệm 
                mua sắm tuyệt vời.
              </p>
              <div className="flex justify-center mt-4 space-x-3">
                <button className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <Facebook className="w-4 h-4 text-blue-600" />
                </button>
                <button className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors">
                  <Instagram className="w-4 h-4 text-purple-600" />
                </button>
                <button className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <Twitter className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc mọi nơi
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Hotline</h3>
                  <p className="text-gray-300 text-lg mb-1">1900 1234</p>
                  <p className="text-gray-400">24/7 hỗ trợ khách hàng</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Email</h3>
                  <p className="text-gray-300 text-lg mb-1">info@fashionstore.vn</p>
                  <p className="text-gray-400">Phản hồi trong 24 giờ</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Địa chỉ</h3>
                  <p className="text-gray-300 text-lg mb-1">123 Nguyễn Văn A, Q1</p>
                  <p className="text-gray-400">TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>

              <div className="pt-8">
                <h3 className="text-xl font-bold mb-4">Theo dõi chúng tôi</h3>
                <div className="flex space-x-4">
                  <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
                    <Facebook className="w-6 h-6" />
                  </button>
                  <button className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-full flex items-center justify-center transition-colors">
                    <Instagram className="w-6 h-6" />
                  </button>
                  <button className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                    <Twitter className="w-6 h-6" />
                  </button>
                  <button className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
                    <Youtube className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Họ tên</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập họ tên của bạn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập email của bạn"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tiêu đề</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tiêu đề tin nhắn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nội dung</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Nhập nội dung tin nhắn của bạn"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Gửi tin nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Sẵn sàng khám phá thế giới thời trang?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Tham gia cùng hàng nghìn khách hàng đã tin tưởng FashionStore
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors">
              Khám phá sản phẩm
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transition-colors">
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

