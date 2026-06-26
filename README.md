# Netflix Clone

Ứng dụng streaming phim clone giao diện Netflix, xây dựng với Next.js App Router. Người dùng có thể đăng ký, chọn profile, xem phim, quản lý danh sách yêu thích; admin có thể quản lý thư viện nội dung và upload media qua Cloudinary.

## Tech Stack

| Lớp               | Công nghệ                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------ |
| Framework         | [Next.js 16](https://nextjs.org/) (App Router), React 19, TypeScript                       |
| Styling           | [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Radix UI) |
| Auth              | [Supabase Auth](https://supabase.com/docs/guides/auth)                                     |
| Database          | PostgreSQL (Supabase) + [Prisma 7](https://www.prisma.io/)                                 |
| Media             | [Cloudinary](https://cloudinary.com/) (upload ảnh/video, signed URL)                       |
| Video player      | [@videojs/react](https://www.npmjs.com/package/@videojs/react) (Video.js v10)              |
| Data fetching     | [TanStack React Query](https://tanstack.com/query)                                         |
| Form & validation | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)                  |
| Animation         | [Motion](https://motion.dev/)                                                              |
| Carousel          | [Embla Carousel](https://www.embla-carousel.com/)                                          |
| HTTP client       | Axios                                                                                      |

## Chức năng User

### Xác thực

- **Đăng ký** (`/register`) — tạo tài khoản qua Supabase, đồng bộ user vào database
- **Đăng nhập** (`/login`) — đăng nhập email/password
- **Quên mật khẩu** (`/forgot-password`) — đang phát triển

### Profile (giống Netflix)

- Mỗi tài khoản có tối đa **5 profile** (tên, avatar)
- Chọn profile đang xem từ header; My List gắn với từng profile
- Quản lý profile tại `/manage-profiles` (tạo, sửa, xóa)

### Trang chủ & khám phá nội dung

- **Hero banner** — phim nổi bật (featured) phát preview video, mute/unmute
- **Các hàng phim** (carousel):
  - Trending Now
  - New on Netflix
  - My List
- **Movie card** — hover preview video, thêm/xóa My List, mở modal thông tin phim
- **Modal thông tin phim** — mô tả, metadata, play, thêm My List

### Xem phim

- Trang `/watch/[publicId]` — player fullscreen với custom controls (play/pause, seek, volume, fullscreen, captions)
- Video Cloudinary dùng **signed URL** (authenticated delivery)
- Thumbnail scrub trên thanh seek (preview frame theo thời gian)

### My List

- Thêm / gỡ phim khỏi danh sách cá nhân theo profile đang chọn
- Hiển thị hàng **My List** trên trang chủ

---

## Chức năng Admin

Chỉ user có `role = "ADMIN"` trong database mới truy cập được `/admin` (kiểm tra ở layout server-side).

### Quản lý thư viện phim

- **Danh sách phim** (`/admin`) — xem toàn bộ title, badge Trending / Featured
- **Thêm phim** — modal nhập title + description, tạo bản ghi rồi chuyển sang trang chỉnh sửa
- **Xóa phim** — xóa trực tiếp từ grid admin
- **Chỉnh sửa phim** (`/admin/movies/[id]`):
  - Title, mô tả, năm phát hành, maturity rating
  - Bật/tắt **Featured** và **Trending**
  - Upload **thumbnail** (ảnh) và **video** qua Cloudinary
  - Preview thumbnail / frame giữa video sau khi upload

### Upload media

- Ảnh: `POST /api/upload/image` → Cloudinary folder `netflix-clone`
- Video: `POST /api/upload/video` → Cloudinary folder `netflix-clone/movies` (type `authenticated`)
- API key Cloudinary cần quyền **Upload (create)**

---

## Cấu trúc thư mục (tóm tắt)

```
app/
  (auth)/          # login, register, forgot-password
  (main)/          # trang chủ, manage-profiles
  admin/           # quản trị phim
  watch/           # xem phim
  api/             # REST API (movies, profiles, my-list, auth, upload)
components/
  movie/           # MovieCard, MoviesRow, form upload
  player/          # Video player + controls
  profile/         # Profile card, form
  modals/          # Movie info, add movie
hooks/             # React Query hooks
validators/        # Zod schemas (auth)
prisma/            # Database schema
lib/               # prisma, supabase, cloudinary, utils
```

## Database Models

- **User** — liên kết Supabase, role (`USER` | `ADMIN`)
- **Profile** — profile con của user
- **Movie** — metadata phim, URL media, Cloudinary ID, featured/trending flags
- **MyList** — quan hệ profile ↔ movie

## Cài đặt & chạy local

### Yêu cầu

- Node.js 20+
- pnpm (khuyến nghị)
- Tài khoản Supabase, Cloudinary
- PostgreSQL (hoặc Supabase Postgres)

### 1. Clone & cài dependency

```bash
pnpm install
```

### 2. Biến môi trường

Tạo file `.env` ở root:

```env
# Database (Supabase Postgres)
DATABASE_URL="postgresql://..."

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="<anon-key>"

# Cloudinary (API key cần quyền Upload)
CLOUDINARY_CLOUD_NAME="<cloud-name>"
CLOUDINARY_API_KEY="<api-key>"
CLOUDINARY_API_SECRET="<api-secret>"
```

> Nếu `CLOUDINARY_API_SECRET` bắt đầu bằng `-`, nên bọc trong dấu ngoặc kép.

### 3. Database

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

### 4. Chạy dev server

```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000).

### 5. Tạo tài khoản Admin

Sau khi đăng ký, cập nhật role trong database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## Scripts

| Lệnh         | Mô tả                   |
| ------------ | ----------------------- |
| `pnpm dev`   | Chạy development server |
| `pnpm build` | Build production        |
| `pnpm start` | Chạy production server  |
| `pnpm lint`  | ESLint                  |

## Ghi chú

- Ảnh Cloudinary được cấu hình trong `next.config.ts` (`res.cloudinary.com`)
- Video authenticated cần signed URL — được tạo server-side khi vào trang watch
- Một số route nav (Series, Films, …) có thể chưa triển khai đầy đủ

## License

## Reference

https://www.youtube.com/watch?v=2M9YCwqLAn4

Private project.
