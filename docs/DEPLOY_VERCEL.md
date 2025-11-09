# Hướng Dẫn Deploy Ứng Dụng Lên Vercel

Hướng dẫn chi tiết để deploy ứng dụng Quản Lý Chi Tiêu lên Vercel.

## Yêu Cầu

- Tài khoản GitHub/GitLab/Bitbucket
- Tài khoản Vercel (miễn phí)
- MongoDB Atlas (hoặc MongoDB URI)
- Dự án đã được push lên Git repository

## Bước 1: Chuẩn Bị Repository

1. Đảm bảo dự án đã được commit và push lên Git:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

2. Kiểm tra `.gitignore` đã bao gồm:
   - `.env*.local`
   - `node_modules/`
   - `.next/`
   - `.vercel/`

## Bước 2: Tạo Tài Khoản Vercel

1. Truy cập [vercel.com](https://vercel.com)
2. Đăng ký/Đăng nhập bằng GitHub (khuyến nghị)
3. Xác nhận email nếu cần

## Bước 3: Deploy Dự Án

### Cách 1: Deploy Từ Dashboard Vercel (Khuyến Nghị)

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import repository từ GitHub:
   - Chọn repository của bạn
   - Click **"Import"**
4. Cấu hình dự án:
   - **Framework Preset**: Next.js (tự động phát hiện)
   - **Root Directory**: `./` (mặc định)
   - **Build Command**: `npm run build` (mặc định)
   - **Output Directory**: `.next` (mặc định)
   - **Install Command**: `npm install` (mặc định)

### Cách 2: Deploy Từ CLI

1. Cài đặt Vercel CLI:

```bash
npm i -g vercel
```

2. Đăng nhập:

```bash
vercel login
```

3. Deploy:

```bash
vercel
```

4. Làm theo hướng dẫn:
   - Chọn scope (personal hoặc team)
   - Link với project hiện có hoặc tạo mới
   - Xác nhận settings

## Bước 4: Cấu Hình Biến Môi Trường

### Trong Vercel Dashboard:

1. Vào project → **Settings** → **Environment Variables**
2. Thêm các biến sau:

| Tên Biến          | Giá Trị                                    | Môi Trường                       |
| ----------------- | ------------------------------------------ | -------------------------------- |
| `MONGODB_URI`     | `mongodb+srv://...`                        | Production, Preview, Development |
| `MONGODB_DB_NAME` | Tên database của bạn                       | Production, Preview, Development |
| `JWT_SECRET`      | Chuỗi bí mật ngẫu nhiên (ít nhất 32 ký tự) | Production, Preview, Development |

### Tạo JWT_SECRET:

```bash
# Trên Linux/Mac
openssl rand -base64 32

# Hoặc sử dụng online generator
# https://generate-secret.vercel.app/32
```

**Lưu ý**:

- `MONGODB_URI` phải được URL-encoded (ví dụ: `@` thành `%40`)
- Chọn tất cả môi trường (Production, Preview, Development)
- Click **"Save"** sau mỗi biến

### Ví Dụ Cấu Hình:

```
MONGODB_URI=mongodb+srv://username:password%40@cluster.mongodb.net/?appName=Application
MONGODB_DB_NAME=quan-ly-chi-tieu
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
```

## Bước 5: Kiểm Tra Build

1. Sau khi cấu hình biến môi trường, Vercel sẽ tự động trigger một build mới
2. Hoặc bạn có thể:

   - Vào **Deployments** tab
   - Click **"Redeploy"** → **"Use existing Build Cache"** hoặc **"Redeploy"**

3. Kiểm tra logs:
   - Click vào deployment
   - Xem **"Build Logs"** để đảm bảo không có lỗi

## Bước 6: Kiểm Tra Ứng Dụng

1. Sau khi deploy thành công, bạn sẽ nhận được URL:

   - Production: `https://your-project.vercel.app`
   - Preview: `https://your-project-git-branch.vercel.app`

2. Truy cập URL và kiểm tra:
   - Trang đăng ký/đăng nhập hoạt động
   - Kết nối MongoDB thành công
   - Các chức năng CRUD hoạt động

## Bước 7: Cấu Hình Domain Tùy Chỉnh (Tùy Chọn)

1. Vào **Settings** → **Domains**
2. Thêm domain của bạn
3. Làm theo hướng dẫn để cấu hình DNS

## Troubleshooting

### Lỗi Build

**Lỗi**: `Module not found` hoặc `Cannot find module`

- **Giải pháp**: Kiểm tra `package.json` có đầy đủ dependencies

**Lỗi**: `MONGODB_URI is not defined`

- **Giải pháp**:
  - Kiểm tra biến môi trường đã được thêm chưa
  - Đảm bảo chọn đúng môi trường (Production, Preview, Development)
  - Redeploy sau khi thêm biến

**Lỗi**: `Mongoose connection error`

- **Giải pháp**:
  - Kiểm tra MongoDB URI đúng format
  - Kiểm tra IP whitelist trong MongoDB Atlas (thêm `0.0.0.0/0` để cho phép tất cả)
  - Kiểm tra username/password đã URL-encoded

### Lỗi Runtime

**Lỗi**: `Authentication failed`

- **Giải pháp**: Kiểm tra `JWT_SECRET` đã được cấu hình

**Lỗi**: `Cannot connect to MongoDB`

- **Giải pháp**:
  - Kiểm tra Network Access trong MongoDB Atlas
  - Thêm IP của Vercel (hoặc `0.0.0.0/0` cho development)

## Tự Động Deploy

Vercel tự động deploy khi:

- Push code lên branch `main` → Production
- Push code lên branch khác → Preview
- Tạo Pull Request → Preview

## Cập Nhật Ứng Dụng

1. Commit và push code mới:

```bash
git add .
git commit -m "Update features"
git push origin main
```

2. Vercel tự động build và deploy

## Monitoring

- **Analytics**: Vào **Analytics** tab để xem metrics
- **Logs**: Vào **Deployments** → Click deployment → **"Functions"** tab để xem logs
- **Speed Insights**: Tự động bật trong Vercel

## Best Practices

1. **Không commit `.env.local`**: Đã được thêm vào `.gitignore`
2. **Sử dụng Environment Variables**: Luôn dùng biến môi trường cho secrets
3. **Test trước khi deploy**: Chạy `npm run build` locally trước
4. **Monitor logs**: Kiểm tra logs sau mỗi deploy
5. **Backup database**: Đảm bảo có backup MongoDB

## Hỗ Trợ

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/)
