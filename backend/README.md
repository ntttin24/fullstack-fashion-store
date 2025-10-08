# Fashion Store Backend

Backend API cho ứng dụng Fashion Store được xây dựng với NestJS và Prisma.

## Cài đặt

```bash
npm install
```

## Cấu hình Database

1. Tạo file `.env` từ `.env.example`
2. Cấu hình DATABASE_URL
3. Chạy migrations:

```bash
npm run prisma:migrate
npm run prisma:generate
```

## Chạy ứng dụng

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run start:prod
```

## Deploy lên Railway

1. Kết nối repository này với Railway
2. Railway sẽ tự động detect và deploy backend
3. Cấu hình environment variables trong Railway dashboard

## API Endpoints

- Auth: `/auth/*`
- Products: `/products/*`
- Categories: `/categories/*`
- Orders: `/orders/*`
- Users: `/users/*`
- Upload: `/upload/*`