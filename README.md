# Fashion Store - Fullstack E-commerce

Ứng dụng thương mại điện tử thời trang fullstack với Next.js và NestJS.

## 🚀 Deploy
- https://fullstack-fashion-store-frontend.vercel.app/

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router), React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Passport.js
- **File Upload**: Cloudinary
- **Language**: TypeScript

## 📋 Yêu cầu hệ thống

- Node.js 18+ và npm
- PostgreSQL (hoặc sử dụng cloud database như Supabase/Neon)
- Git

## 🚀 Hướng dẫn cài đặt

### Bước 1: Clone repository

```bash
git clone https://github.com/yourusername/fullstack-fashion-store.git
cd fullstack-fashion-store
```

### Bước 2: Cài đặt dependencies

Cài đặt cho cả frontend và backend:

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

### Bước 3: Setup Backend

#### 3.1. Tạo file `.env` trong thư mục `backend`

```bash
cd backend
cp env.example .env
```

#### 3.2. Cấu hình các biến môi trường trong `backend/.env`

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fashion_store"

# JWT
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"

# Cloudinary (để upload ảnh)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App
PORT=3001
NODE_ENV="development"

# Google OAuth (Optional - để đăng nhập bằng Google)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

**Lưu ý:**
- Đổi `DATABASE_URL` thành connection string của PostgreSQL database của bạn
- Tạo JWT_SECRET ngẫu nhiên (có thể dùng: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- Đăng ký tài khoản Cloudinary miễn phí tại https://cloudinary.com để lấy credentials

#### 3.3. Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Chạy migrations để tạo tables
npx prisma migrate dev

# Import dữ liệu mẫu (products, categories, admin user)
npm run seed
```

### Bước 4: Setup Frontend

#### 4.1. Tạo file `.env.local` trong thư mục `frontend`

```bash
cd ../frontend
cp env.local.example .env.local
```

#### 4.2. Cấu hình biến môi trường trong `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Bước 5: Chạy ứng dụng

Từ thư mục root của project:

```bash
# Chạy cả frontend và backend
npm run dev
```

Hoặc chạy riêng lẻ:

```bash
# Terminal 1 - Chạy backend
cd backend
npm run start:dev

# Terminal 2 - Chạy frontend
cd frontend
npm run dev
```

Ứng dụng sẽ chạy tại:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🔑 Tài khoản mặc định

Sau khi chạy seed, bạn có thể đăng nhập với tài khoản admin:

```
Email: admin@fashionstore.com
Password: admin123
```

## 📁 Cấu trúc thư mục

```
fullstack-fashion-store/
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities & API client
│   │   ├── store/        # Zustand stores
│   │   └── types/        # TypeScript types
│   └── public/           # Static files
│
├── backend/              # NestJS application
│   ├── src/
│   │   ├── auth/        # Authentication
│   │   ├── products/    # Products management
│   │   ├── categories/  # Categories management
│   │   ├── orders/      # Orders management
│   │   ├── users/       # Users management
│   │   ├── cart/        # Shopping cart
│   │   ├── notifications/ # Notifications
│   │   └── upload/      # File upload
│   └── prisma/
│       ├── schema.prisma # Database schema
│       └── seed.ts      # Seed data
│
└── package.json         # Root scripts
```

## ✨ Tính năng chính

### Người dùng
- ✅ Xem danh sách sản phẩm với phân trang
- ✅ Tìm kiếm và lọc sản phẩm
- ✅ Xem chi tiết sản phẩm, biến thể (màu, size)
- ✅ Thêm vào giỏ hàng
- ✅ Đặt hàng và theo dõi đơn hàng
- ✅ Đăng ký, đăng nhập (email/password hoặc Google)
- ✅ Quản lý profile
- ✅ Đánh giá sản phẩm

### Admin
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục (CRUD)
- ✅ Quản lý đơn hàng
- ✅ Quản lý người dùng
- ✅ Upload ảnh sản phẩm

## 🎨 Dark Mode

Ứng dụng tự động theo hệ thống và hỗ trợ dark mode mượt mà.

## 📝 Scripts hữu ích

### Root (Monorepo)
```bash
npm run dev              # Chạy cả frontend + backend
npm run build            # Build production
npm run clean            # Xóa node_modules và build files
```

### Backend
```bash
npm run start:dev        # Dev mode với hot reload
npm run build            # Build production
npm run start:prod       # Chạy production
npm run prisma:studio    # Mở Prisma Studio (GUI database)
npm run seed             # Import dữ liệu mẫu
```

### Frontend
```bash
npm run dev              # Dev mode
npm run build            # Build production
npm run start            # Chạy production build
npm run lint             # Check linting
```

## 🐛 Troubleshooting

### Database connection error
- Kiểm tra PostgreSQL đang chạy
- Xác nhận `DATABASE_URL` trong `.env` đúng
- Thử connect với tool như pgAdmin hoặc TablePlus

### Module not found
```bash
# Xóa node_modules và cài lại
npm run clean
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Port already in use
```bash
# Thay đổi PORT trong backend/.env
PORT=3002

# Hoặc kill process đang dùng port
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Prisma migration issues
```bash
cd backend
npx prisma migrate reset  # Reset database
npx prisma migrate dev    # Chạy lại migrations
npm run seed              # Import lại data
```

## 📧 Contact

Nếu có vấn đề gì, hãy tạo issue trên GitHub.
