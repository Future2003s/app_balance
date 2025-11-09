# Quản Lý Chi Tiêu

Ứng dụng quản lý chi tiêu được xây dựng với Next.js 15, Tailwind CSS, TypeScript và MongoDB.

## ✨ Tính Năng

- 📊 Dashboard với thống kê chi tiêu
- 💰 Quản lý chi tiêu (CRUD)
- 📁 Quản lý danh mục
- 💳 Quản lý phương thức thanh toán
- 📈 Tổng hợp và phân tích chi tiêu
- 🔐 Xác thực người dùng (Đăng ký/Đăng nhập)
- 📱 Responsive design (Mobile, Tablet, Desktop)
- 🌐 Giao diện tiếng Việt
- ⚡ Tối ưu hiệu suất (Progressive Rendering, Code Splitting)

## 🚀 Bắt Đầu

### Yêu Cầu

- Node.js 18+ 
- npm hoặc yarn
- MongoDB Atlas (hoặc MongoDB local)

### Cài Đặt

1. Clone repository:
```bash
git clone <repository-url>
cd quan-ly-chi-tieu
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Application
MONGODB_DB_NAME=quan-ly-chi-tieu
JWT_SECRET=your-secret-key-at-least-32-characters
```

4. Chạy development server:
```bash
npm run dev
```

5. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt

## 📦 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build ứng dụng cho production
- `npm start` - Chạy production server
- `npm run lint` - Chạy ESLint

## 🏗️ Cấu Trúc Dự Án

```
.
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API Routes
│   │   ├── expenses/      # Trang chi tiêu
│   │   ├── categories/    # Trang danh mục
│   │   └── ...
│   ├── components/       # React Components
│   ├── lib/              # Utilities & Config
│   ├── models/           # MongoDB Models
│   ├── services/         # API Services
│   └── hooks/            # Custom Hooks
├── docs/                 # Tài liệu
├── public/               # Static files
└── ...
```

## 🚢 Deploy Lên Vercel

Xem hướng dẫn chi tiết tại [docs/DEPLOY_VERCEL.md](./docs/DEPLOY_VERCEL.md)

### Tóm Tắt Nhanh:

1. Push code lên GitHub
2. Đăng nhập [Vercel](https://vercel.com)
3. Import repository
4. Cấu hình Environment Variables:
   - `MONGODB_URI`
   - `MONGODB_DB_NAME`
   - `JWT_SECRET`
5. Deploy!

## 📚 Tài Liệu

- [Phân Tích Nghiệp Vụ](./docs/ANALISIS_NEGOCIO.md)
- [Thiết Kế Hệ Thống](./docs/DISENO_SISTEMA.md)
- [Cấu Hình MongoDB](./docs/MONGODB_SETUP.md)
- [Cấu Hình Environment](./docs/CONFIGURACION_ENV.md)
- [Hướng Dẫn Deploy](./docs/DEPLOY_VERCEL.md)

## 🛠️ Công Nghệ

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT
- **Icons**: Lucide React

## 📝 License

MIT

