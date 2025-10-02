# 🚂 Hướng dẫn Deploy Backend lên Railway

## 📋 Tổng quan

Dự án này là monorepo với cả frontend và backend, nhưng Railway sẽ **CHỈ deploy backend**.

## 🔧 Cấu hình Files

### 1. **railway.json** (Root)
```json
{
  "build": {
    "builder": "NIXPACKS",
    "nixpacksConfigPath": "nixpacks.toml"
  },
  "deploy": {
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2. **nixpacks.toml** (Root)
```toml
[phases.setup]
nixPkgs = ["nodejs_18", "npm-9_x"]

[phases.install]
cmds = [
  "cd backend",
  "npm ci --production=false"
]

[phases.build]
cmds = [
  "cd backend",
  "npm run build"
]

[start]
cmd = "cd backend && npm run start:prod"
```

### 3. **.railwayignore** (Root)
```
# Ignore frontend (only deploy backend)
frontend/
```

## 🚀 Bước Deploy

### Bước 1: Push code lên GitHub
```bash
git add .
git commit -m "Configure Railway for backend only"
git push origin main
```

### Bước 2: Tạo Project trên Railway
1. Đăng nhập [railway.app](https://railway.app)
2. Click **"New Project"**
3. Chọn **"Deploy from GitHub repo"**
4. Chọn repository của bạn
5. Railway sẽ tự động detect cấu hình

### Bước 3: Thêm PostgreSQL Database
1. Trong project, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway sẽ tự động tạo `DATABASE_URL`
3. Không cần làm gì thêm!

### Bước 4: Cấu hình Environment Variables
Vào **Variables** tab và thêm:

```bash
# Server
NODE_ENV=production

# JWT (QUAN TRỌNG: Đổi thành chuỗi bí mật của bạn)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_xyz123
JWT_EXPIRATION=7d

# Frontend URL (cho CORS)
FRONTEND_URL=https://your-frontend-domain.com

# Cloudinary (nếu dùng upload images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Lưu ý:** `DATABASE_URL` và `PORT` được Railway tự động cung cấp.

### Bước 5: Deploy
1. Railway sẽ tự động deploy
2. Kiểm tra logs trong **Deployments** tab
3. Sau khi deploy thành công, copy URL của backend

## ✅ Kiểm tra Deploy thành công

Sau khi deploy, bạn sẽ thấy:

```
✓ Build completed
✓ Starting application
📦 Database connected
🚀 Backend server is running on port XXXX
```

## 🔍 Test API

```bash
# Test health check
curl https://your-backend-url.railway.app/

# Test API endpoint
curl https://your-backend-url.railway.app/categories
```

## ❌ Xử lý lỗi

### Lỗi: "EADDRINUSE: address already in use"
- **Nguyên nhân:** Railway đang chạy cả frontend và backend
- **Giải pháp:** Đảm bảo có file `nixpacks.toml` và `.railwayignore` ở root

### Lỗi: "Cannot find module"
- **Nguyên nhân:** Thiếu dependencies
- **Giải pháp:** Kiểm tra `backend/package.json` đã đầy đủ

### Lỗi: "Database connection failed"
- **Nguyên nhân:** `DATABASE_URL` không đúng
- **Giải pháp:** Kiểm tra PostgreSQL đã được thêm vào project

### Lỗi: "Build failed"
- **Giải pháp:** Kiểm tra logs và đảm bảo code build thành công local

## 📊 Monitoring

- **Logs:** Railway Dashboard → Deployments → View Logs
- **Metrics:** Railway Dashboard → Metrics
- **Database:** Railway Dashboard → PostgreSQL → Connect

## 🔄 Update Code

Mỗi khi push code mới lên GitHub, Railway sẽ tự động:
1. Detect changes
2. Rebuild backend
3. Deploy version mới
4. Rollback nếu có lỗi

## 💡 Tips

1. **Free Tier:** Railway cung cấp $5 credit/tháng miễn phí
2. **Domain:** Có thể thêm custom domain trong Settings
3. **Logs:** Luôn kiểm tra logs khi có lỗi
4. **Environment:** Test kỹ local trước khi deploy

## 📝 Checklist trước khi Deploy

- [ ] Push code lên GitHub
- [ ] Tạo Railway project
- [ ] Thêm PostgreSQL database
- [ ] Cấu hình environment variables
- [ ] Đổi `JWT_SECRET` thành chuỗi bí mật mạnh
- [ ] Deploy và kiểm tra logs
- [ ] Test API endpoints
- [ ] Cập nhật frontend với backend URL mới

---

Chúc bạn deploy thành công! 🎉

