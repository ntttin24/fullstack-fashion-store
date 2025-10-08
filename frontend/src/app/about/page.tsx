'use client'

import { useState, useEffect } from 'react'
import { 
  Store, Sparkles, Award, 
  Package, ShieldCheck, Truck, HeartHandshake,
  Mail, Phone, MapPin, Clock, Users, Target,
  Zap, Globe, Heart, Star, Quote, CheckCircle,
  Calendar, Rocket, ChevronRight, Instagram, 
  Facebook, Twitter, Youtube, ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [countersStarted, setCountersStarted] = useState(false)

  // Counter animation effect
  useEffect(() => {
    const handleScroll = () => {
      const statsSection = document.getElementById('stats-section')
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setCountersStarted(true)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  const testimonials = [
    {
      name: "Nguyễn Thị Lan",
      role: "Khách hàng thân thiết",
      content: "Mình đã mua sắm tại FashionStore được 2 năm. Chất lượng sản phẩm luôn đảm bảo, giá cả hợp lý và dịch vụ chăm sóc khách hàng rất tốt. Mình rất hài lòng!",
      rating: 5,
      image: "👩‍💼"
    },
    {
      name: "Trần Văn Minh",
      role: "Khách hàng mới",
      content: "Lần đầu mua hàng online mà mình rất ấn tượng. Giao hàng nhanh, đóng gói cẩn thận, sản phẩm đúng như mô tả. Sẽ ủng hộ shop lâu dài!",
      rating: 5,
      image: "👨‍💻"
    },
    {
      name: "Lê Thị Hương",
      role: "Fashion Blogger",
      content: "FashionStore là một trong những shop thời trang online uy tín nhất mà mình từng mua. Họ luôn cập nhật xu hướng mới nhất và có nhiều mẫu mã đẹp.",
      rating: 5,
      image: "👩‍🎨"
    }
  ]

  const team = [
    {
      name: "Nguyễn Văn A",
      role: "CEO & Founder",
      description: "15+ năm kinh nghiệm trong ngành thời trang",
      icon: "👨‍💼",
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Trần Thị B",
      role: "Creative Director",
      description: "Chuyên gia về xu hướng thời trang quốc tế",
      icon: "👩‍🎨",
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Lê Văn C",
      role: "Operations Manager",
      description: "Đảm bảo chất lượng và giao hàng đúng hẹn",
      icon: "👨‍💻",
      color: "from-green-500 to-green-600"
    },
    {
      name: "Phạm Thị D",
      role: "Customer Success",
      description: "Chăm sóc khách hàng tận tình 24/7",
      icon: "👩‍💼",
      color: "from-pink-500 to-pink-600"
    }
  ]

  const timeline = [
    {
      year: "2019",
      title: "Khởi Đầu",
      description: "FashionStore được thành lập với sứ mệnh mang thời trang đến gần hơn với mọi người"
    },
    {
      year: "2020",
      title: "Mở Rộng",
      description: "Ra mắt hơn 1000 sản phẩm mới và đạt 5000 khách hàng tin tưởng"
    },
    {
      year: "2022",
      title: "Phát Triển",
      description: "Mở rộng hệ thống kho hàng và đội ngũ, phục vụ toàn quốc"
    },
    {
      year: "2024",
      title: "Tương Lai",
      description: "Hướng tới thị trường quốc tế với dịch vụ xuất khẩu"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 py-20 md:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-medium mb-8 hover:bg-white/20 transition-all">
              <Store className="w-5 h-5 mr-2" />
              FashionStore - Thương hiệu thời trang hàng đầu
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Phong Cách Là <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dấu Ấn Riêng
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
              Chúng tôi không chỉ bán quần áo - chúng tôi giúp bạn khám phá và thể hiện 
              phong cách độc đáo của riêng mình. Mỗi sản phẩm đều được tuyển chọn kỹ lưỡng 
              để mang đến trải nghiệm thời trang tuyệt vời nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Khám phá ngay
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#story"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
              >
                Câu chuyện của chúng tôi
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section - Animated */}
      <section id="stats-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "15000", suffix: "+", label: "Khách hàng", icon: Users, color: "blue" },
              { number: "8000", suffix: "+", label: "Sản phẩm", icon: Package, color: "purple" },
              { number: "99", suffix: "%", label: "Hài lòng", icon: Heart, color: "pink" },
              { number: "50", suffix: "+", label: "Thành phố", icon: Globe, color: "green" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                </div>
                <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-700 bg-clip-text text-transparent mb-2`}>
                  {countersStarted ? stat.number : "0"}{stat.suffix}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section - Enhanced */}
      <section id="story" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Câu chuyện của chúng tôi
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Hành Trình Tạo Nên <span className="text-blue-600">Sự Khác Biệt</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  🎯 Năm 2019, với niềm đam mê thời trang và mong muốn mang đến cho khách hàng 
                  những sản phẩm chất lượng với giá cả hợp lý, FashionStore đã ra đời.
                </p>
                <p className="text-lg">
                  💎 Chúng tôi tin rằng mỗi người đều xứng đáng có được những bộ trang phục 
                  giúp họ tự tin thể hiện bản thân. Không chỉ đơn thuần là bán hàng, chúng tôi 
                  mong muốn trở thành người bạn đồng hành trong hành trình tìm kiếm phong cách riêng.
                </p>
                <p className="text-lg">
                  🚀 Từ một cửa hàng nhỏ, giờ đây FashionStore đã phục vụ hơn 15,000 khách hàng 
                  trên khắp Việt Nam với đội ngũ chuyên nghiệp và tận tâm. Chúng tôi tự hào 
                  là thương hiệu được tin tưởng và yêu thích.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                {[
                  { icon: CheckCircle, text: "100% chính hãng" },
                  { icon: Truck, text: "Giao hàng toàn quốc" },
                  { icon: ShieldCheck, text: "Bảo hành uy tín" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                    <item.icon className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <div className="space-y-10">
                    <div className="relative">
                      <div className="absolute -left-2 -top-2 w-12 h-12 bg-white/20 rounded-full"></div>
                      <div className="text-5xl font-bold mb-2">15,000+</div>
                      <div className="text-lg text-blue-100">Khách hàng tin tưởng</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-2 -top-2 w-12 h-12 bg-white/20 rounded-full"></div>
                      <div className="text-5xl font-bold mb-2">8,000+</div>
                      <div className="text-lg text-purple-100">Sản phẩm đa dạng</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-2 -top-2 w-12 h-12 bg-white/20 rounded-full"></div>
                      <div className="text-5xl font-bold mb-2">99%</div>
                      <div className="text-lg text-pink-100">Tỷ lệ hài lòng</div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-400 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section - New */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
              <Calendar className="w-4 h-4 mr-2" />
              Hành trình phát triển
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Dấu Mốc <span className="text-purple-600">Quan Trọng</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Từ những bước đi đầu tiên đến hiện tại, mỗi giai đoạn đều ghi dấu sự phát triển vững chắc
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                      <div className={`inline-block px-4 py-2 bg-gradient-to-r ${
                        index === 0 ? 'from-blue-500 to-blue-600' :
                        index === 1 ? 'from-purple-500 to-purple-600' :
                        index === 2 ? 'from-pink-500 to-pink-600' :
                        'from-green-500 to-green-600'
                      } text-white rounded-full text-sm font-bold mb-4`}>
                        {item.year}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Empty Space */}
                  <div className="hidden md:block w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <Target className="w-4 h-4 mr-2" />
              Định hướng phát triển
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sứ Mệnh & <span className="text-purple-600">Tầm Nhìn</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những giá trị cốt lõi định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Sứ Mệnh</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Mang đến cho mỗi khách hàng những sản phẩm thời trang chất lượng cao với giá cả hợp lý. 
                  Chúng tôi cam kết đồng hành cùng bạn trong việc khám phá và xây dựng phong cách riêng, 
                  nâng cao sự tự tin và thể hiện cá tính độc đáo.
                </p>
                <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                  Tìm hiểu thêm <ChevronRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Tầm Nhìn</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Trở thành thương hiệu thời trang hàng đầu Việt Nam và khu vực, được khách hàng 
                  tin tưởng và lựa chọn hàng đầu. Xây dựng một cộng đồng yêu thời trang, 
                  nơi mọi người có thể tự do thể hiện phong cách và chia sẻ đam mê.
                </p>
                <div className="mt-6 flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                  Tìm hiểu thêm <ChevronRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 rounded-full text-sm font-semibold mb-6">
              <Award className="w-4 h-4 mr-2" />
              Giá trị cốt lõi
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Những Giá Trị <span className="text-blue-600">Chúng Tôi Theo Đuổi</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Các nguyên tắc cốt lõi định hình văn hóa và hoạt động của FashionStore
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Chất Lượng",
                description: "Cam kết sản phẩm chính hãng, kiểm định kỹ lưỡng trước khi đến tay khách hàng",
                color: "blue",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: HeartHandshake,
                title: "Tận Tâm",
                description: "Phục vụ khách hàng với sự nhiệt tình, chuyên nghiệp và luôn lắng nghe",
                color: "green",
                gradient: "from-green-500 to-green-600"
              },
              {
                icon: Award,
                title: "Uy Tín",
                description: "Xây dựng niềm tin thông qua sự minh bạch, trung thực trong mọi hoạt động",
                color: "purple",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                icon: Zap,
                title: "Đổi Mới",
                description: "Không ngừng cải tiến, cập nhật xu hướng và công nghệ mới nhất",
                color: "orange",
                gradient: "from-orange-500 to-orange-600"
              }
            ].map((value, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${value.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{value.title}</h3>
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - New */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <Users className="w-4 h-4 mr-2" />
              Đội ngũ chuyên nghiệp
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Gặp Gỡ <span className="text-blue-600">Đội Ngũ</span> Của Chúng Tôi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những con người tài năng và đam mê đứng sau thành công của FashionStore
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center text-5xl group-hover:scale-110 transition-transform shadow-lg`}>
                    {member.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className={`text-sm font-semibold bg-gradient-to-r ${member.color} bg-clip-text text-transparent mb-3`}>
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - New */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold mb-6">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Đánh giá từ khách hàng
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Khách Hàng <span className="text-yellow-600">Nói Gì</span> Về Chúng Tôi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hàng nghìn đánh giá 5 sao từ những khách hàng hài lòng
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 shadow-xl">
              <Quote className="absolute top-8 left-8 w-12 h-12 text-blue-200" />
              <div className="text-center">
                <div className="text-6xl mb-6">{testimonials[activeTestimonial].image}</div>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-xl text-gray-700 leading-relaxed mb-6 italic">
                  &ldquo;{testimonials[activeTestimonial].content}&rdquo;
                </p>
                <h4 className="text-2xl font-bold text-gray-900 mb-1">
                  {testimonials[activeTestimonial].name}
                </h4>
                <p className="text-gray-600">{testimonials[activeTestimonial].role}</p>
              </div>
              <Quote className="absolute bottom-8 right-8 w-12 h-12 text-purple-200 rotate-180" />
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute top-20 right-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-1/2 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Lợi ích vượt trội
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tại Sao Hơn 15,000 Khách Hàng<br />Chọn FashionStore?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Những lý do thuyết phục để bạn tin tưởng và mua sắm tại chúng tôi
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Package,
                title: "Sản Phẩm Đa Dạng",
                description: "Hơn 8,000 mẫu mã từ cơ bản đến cao cấp, phù hợp với mọi phong cách và lứa tuổi"
              },
              {
                icon: ShieldCheck,
                title: "100% Chính Hãng",
                description: "Cam kết hàng chính hãng, kiểm tra kỹ lưỡng trước khi giao đến tay khách hàng"
              },
              {
                icon: Truck,
                title: "Giao Hàng Nhanh",
                description: "Giao hàng toàn quốc, nội thành trong vòng 24h, miễn phí với đơn từ 500k"
              },
              {
                icon: Award,
                title: "Giá Tốt Nhất",
                description: "Cam kết giá tốt nhất thị trường với nhiều chương trình ưu đãi hấp dẫn"
              },
              {
                icon: HeartHandshake,
                title: "Hỗ Trợ 24/7",
                description: "Đội ngũ tư vấn chuyên nghiệp, nhiệt tình, sẵn sàng hỗ trợ mọi lúc mọi nơi"
              },
              {
                icon: Sparkles,
                title: "Đổi Trả Linh Hoạt",
                description: "Chính sách đổi trả dễ dàng trong vòng 7 ngày nếu không hài lòng"
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <feature.icon className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-blue-100 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <Mail className="w-4 h-4 mr-2" />
              Liên hệ với chúng tôi
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Hãy <span className="text-blue-600">Kết Nối</span> Với Chúng Tôi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc, mọi nơi
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                {
                  icon: Phone,
                  title: "Hotline",
                  content: "1900 1234",
                  subtitle: "Hỗ trợ 24/7 - Miễn phí cuộc gọi",
                  color: "blue",
                  gradient: "from-blue-500 to-blue-600"
                },
                {
                  icon: Mail,
                  title: "Email",
                  content: "info@fashionstore.vn",
                  subtitle: "Phản hồi trong vòng 24h",
                  color: "green",
                  gradient: "from-green-500 to-green-600"
                },
                {
                  icon: MapPin,
                  title: "Địa chỉ",
                  content: "123 Nguyễn Văn A, Quận 1",
                  subtitle: "TP. Hồ Chí Minh, Việt Nam",
                  color: "purple",
                  gradient: "from-purple-500 to-purple-600"
                },
                {
                  icon: Clock,
                  title: "Giờ làm việc",
                  content: "Thứ 2 - Chủ nhật",
                  subtitle: "8:00 sáng - 10:00 tối",
                  color: "orange",
                  gradient: "from-orange-500 to-orange-600"
                }
              ].map((item, index) => (
                <div key={index} className="group flex items-start space-x-4 bg-white rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-100">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-base text-gray-700 font-semibold mb-1">{item.content}</p>
                    <p className="text-sm text-gray-500">{item.subtitle}</p>
                  </div>
                </div>
              ))}

              {/* Social Links */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Theo dõi chúng tôi</h3>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, color: "from-blue-500 to-blue-600" },
                    { icon: Instagram, color: "from-pink-500 to-purple-600" },
                    { icon: Twitter, color: "from-blue-400 to-blue-500" },
                    { icon: Youtube, color: "from-red-500 to-red-600" }
                  ].map((social, i) => (
                    <button key={i} className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg`}>
                      <social.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Gửi Tin Nhắn</h3>
              <p className="text-gray-600 mb-8">Điền thông tin và chúng tôi sẽ phản hồi sớm nhất</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="Nhập email của bạn"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nội dung *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-sm"
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center"
                >
                  Gửi tin nhắn ngay
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 text-center text-white overflow-hidden shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -mt-20 -ml-20"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full -mb-20 -mr-20"></div>
            
            <div className="relative">
              <Sparkles className="w-16 h-16 mx-auto mb-6 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Sẵn Sàng Khám Phá Phong Cách<br />Của Riêng Bạn?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Hơn 8,000 sản phẩm thời trang đang chờ đón bạn. Bắt đầu hành trình ngay hôm nay!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center px-10 py-4 bg-white text-blue-600 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Khám phá bộ sưu tập
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#story"
                  className="inline-flex items-center justify-center px-10 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                >
                  Tìm hiểu thêm
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

