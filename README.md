## FashionStore – E-commerce thời trang (Fullstack)

Demo: [fashion-store-fay9.vercel.app](https://fashion-store-fay9.vercel.app)

### 🚀 Tính năng
**Frontend:**
- Dark mode theo hệ thống, tối ưu mobile
- Animation mượt: header cuộn ẩn/hiện, underline nav, dropdown scale, CTA hover/active, cart slide/fade
- Danh mục, tìm kiếm, lọc, sắp xếp client-side
- Trang chi tiết sản phẩm, modal quick add (màu/size)
- Giỏ hàng với Zustand: thêm/xóa/sửa số lượng, tổng tiền, xóa tất cả

**Backend (Fullstack):**
- ✅ REST API hoàn chỉnh với NestJS
- ✅ Authentication & Authorization (JWT + Passport)
- ✅ CRUD cho Products, Categories, Orders, Users
- ✅ Upload ảnh với Cloudinary
- ✅ Role-based access control (USER/ADMIN)
- ✅ Prisma ORM + PostgreSQL

### 🛠️ Tech Stack

**Frontend:**
- Next.js 15 (App Router), React 19, TypeScript 5
- Tailwind CSS v4, Zustand, Lucide React
- Deploy: Vercel

**Backend:**
- NestJS, TypeScript
- PostgreSQL + Prisma ORM
- JWT + Passport.js (authentication)
- Cloudinary (image upload)
- Deploy: Railway/Render

### 📦 Cài đặt & chạy

**Cài đặt tất cả:**
```bash
git clone https://github.com/ntttin24/fullstack-fashion-store.git
cd fashion-store
npm run install:all
```

**Chạy cả Frontend + Backend:**
```bash
npm run dev
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`

**Chạy riêng lẻ:**
```bash
# Chỉ frontend
npm run dev:frontend

# Chỉ backend
npm run dev:backend
```

**Setup Database (chỉ cần chạy 1 lần):**
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run seed              # Import data mẫu
```

**📚 Chi tiết:**
- [backend/README.md](./backend/README.md) - API documentation đầy đủ
- [backend/SETUP_GUIDE.md](./backend/SETUP_GUIDE.md) - Hướng dẫn setup database
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Kết nối frontend-backend

### 📁 Cấu trúc Project

```
fashion-store/
├── frontend/             # Frontend Next.js
│   ├── src/
│   │   ├── app/         # App Router
│   │   ├── components/  # React components
│   │   ├── lib/         # Utilities, API client
│   │   ├── store/       # Zustand store
│   │   └── types/       # TypeScript types
│   ├── public/          # Static assets
│   ├── package.json     # Frontend dependencies
│   └── next.config.ts   # Next.js config
│
├── backend/             # Backend NestJS API
│   ├── src/
│   │   ├── auth/       # Authentication module
│   │   ├── products/   # Products CRUD
│   │   ├── categories/ # Categories CRUD
│   │   ├── orders/     # Orders management
│   │   ├── users/      # Users management
│   │   ├── upload/     # Cloudinary upload
│   │   └── prisma/     # Database service
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json     # Backend dependencies
│
├── package.json         # Root package.json (monorepo)
└── README.md           # Project documentation
```

### 🎨 Tùy biến giao diện
- Biến màu trong `frontend/src/app/globals.css`:
  - `--primary`, `--background`, `--foreground`, `--surface`, `--card`, `--border`, `--muted(-foreground)`
- Hỗ trợ `prefers-reduced-motion` và các animation utilities: `animate-fade-in`, `animate-slide-down`, `animate-slide-in-right`, `animate-scale-in`

### 🧰 Scripts

**Root (Monorepo):**
- `npm run dev` – chạy cả frontend + backend
- `npm run build` – build cả frontend + backend
- `npm run install:all` – cài đặt dependencies cho tất cả
- `npm run clean` – xóa node_modules và build files

**Frontend:**
- `npm run dev:frontend` – chạy frontend dev server
- `npm run build:frontend` – build frontend production
- `npm run start:frontend` – chạy frontend production

**Backend:**
- `npm run dev:backend` – chạy backend dev server
- `npm run build:backend` – build backend production
- `npm run start:backend` – chạy backend production

### 🔐 Credentials mặc định

Sau khi chạy `npm run seed` trong backend:

```
Email: admin@fashionstore.com
Password: admin123
Role: ADMIN
```

### 📝 Ghi chú
- **Frontend:** Hiện đang dùng mock data, có thể kết nối với backend API
- **Backend:** API server hoàn chỉnh, sẵn sàng production
- **Database:** Cần setup PostgreSQL (local hoặc cloud: Supabase/Neon)
- **Upload:** Cần config Cloudinary credentials

### 📄 License
MIT