# Hướng dẫn Test Case & Dữ liệu mẫu Swagger UI

Tài liệu này cung cấp danh sách các kịch bản kiểm thử (Test Cases) và **JSON Payload mẫu** cho toàn bộ các API trong dự án để bạn dễ dàng copy-paste và test trực tiếp trên giao diện **Swagger UI**.

---

## 0. Hướng dẫn khởi chạy & Xác thực trên Swagger UI

1. **Khởi chạy server:**
   ```bash
   npm run dev
   ```
2. **Truy cập Swagger UI:**
   Mở trình duyệt tại: `http://localhost:<PORT>/swagger` (Mặc định port cấu hình trong `.env` hoặc `3000` -> `http://localhost:3000/swagger`).
3. **Cách lấy và gắn Token (Authorize):**
   - Tìm đến nhóm **Auth** -> mở API `POST /api/v1/auth/login` -> bấm **Try it out**.
   - Nhập tài khoản Admin mặc định (tạo tự động khi `SHOULD_INIT=true` trong `.env`):
     ```json
     {
       "username": "admin@gmail.com",
       "password": "123456"
     }
     ```
   - Bấm **Execute** -> Copy giá trị `access_token` trong phần Response.
   - Kéo lên đầu trang Swagger UI, bấm nút **Authorize** (biểu tượng ổ khóa 🔒), dán `access_token` vào ô **Value** (không cần gõ chữ `Bearer `) -> bấm **Authorize** -> **Close**.
   - Nhờ cấu hình `persistAuthorization: true`, bạn có thể F5 trang mà không bị mất token.

---

## 1. Module AUTH (`/api/v1/auth`)

### TC-AUTH-01: Đăng nhập (`POST /api/v1/auth/login`)
- **Quyền truy cập:** `@Public()` (Không cần token)
- **Request Body (Admin):**
  ```json
  {
    "username": "admin@gmail.com",
    "password": "123456"
  }
  ```
- **Request Body (User thường):**
  ```json
  {
    "username": "user@gmail.com",
    "password": "123456"
  }
  ```
- **Expected Response (`201 Created`):** Trả về `access_token`, thông tin `user` (`_id`, `name`, `email`, `role`, `permissions`) và tự động set cookie `refresh_token`.
- **Negative Case (Sai mật khẩu / Không tồn tại):** Đổi `password` thành `"wrongpass"` -> Trả về `401 Unauthorized`.

### TC-AUTH-02: Đăng ký tài khoản mới (`POST /api/v1/auth/register`)
- **Quyền truy cập:** `@Public()`
- **Request Body:**
  ```json
  {
    "name": "Nguyen Van Test",
    "email": "nguyenvantest@gmail.com",
    "password": "123456",
    "age": 24,
    "gender": "MALE",
    "address": "Ha Noi, Viet Nam"
  }
  ```
- **Expected Response (`201 Created`):** Trả về `_id` và `createdAt` của tài khoản vừa tạo.
- **Negative Case:** Gửi lại đúng JSON trên lần 2 (trùng email) hoặc bỏ trống `email` -> Trả về `400 Bad Request`.

### TC-AUTH-03: Lấy thông tin tài khoản đang đăng nhập (`GET /api/v1/auth/account`)
- **Quyền truy cập:** Yêu cầu Bearer Token
- **Tham số:** Không có.
- **Expected Response (`200 OK`):** Trả về thông tin chi tiết của user tương ứng với JWT Token.

### TC-AUTH-04: Làm mới Access Token (`GET /api/v1/auth/refresh`)
- **Quyền truy cập:** `@Public()` (Sử dụng cookie `refresh_token` đã được lưu trên trình duyệt sau khi gọi `/login`).
- **Expected Response (`200 OK`):** Trả về `access_token` mới và cập nhật lại cookie `refresh_token`.

### TC-AUTH-05: Đăng xuất (`POST /api/v1/auth/logout`)
- **Quyền truy cập:** Yêu cầu Bearer Token
- **Expected Response (`201 Created`):** Trả về `"ok"`, xóa `refresh_token` trong DB và xóa cookie.

---

## 2. Module COMPANIES (`/api/v1/companies`)

### TC-COMP-01: Tạo mới công ty (`POST /api/v1/companies`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Request Body:**
  ```json
  {
    "name": "Viettel Group",
    "address": "Lot D26 Cau Giay New Urban Area, Yen Hoa Ward, Cau Giay District, Hanoi",
    "description": "Tập đoàn Công nghiệp - Viễn thông Quân đội Viettel",
    "logo": "viettel-logo.png"
  }
  ```
- **Expected Response (`201 Created`):** Trả về thông tin công ty vừa tạo kèm `_id`. *(Lưu lại `_id` này để dùng cho các test case sau)*.

### TC-COMP-02: Lấy danh sách công ty có phân trang (`GET /api/v1/companies`)
- **Quyền truy cập:** `@Public()`
- **Query Params:**
  - `current`: `1`
  - `pageSize`: `10`
  - `qs` *(tùy chọn)*: `name=/FPT/i` hoặc để trống
- **Expected Response (`200 OK`):** Trả về `meta` (`current`, `pageSize`, `pages`, `total`) và mảng `result`.

### TC-COMP-03: Xem chi tiết công ty theo ID (`GET /api/v1/companies/{id}`)
- **Quyền truy cập:** `@Public()`
- **Path Param:** `id` = `<_id lấy từ TC-COMP-01 hoặc TC-COMP-02>`
- **Expected Response (`200 OK`):** Trả về chi tiết công ty.

### TC-COMP-04: Cập nhật thông tin công ty (`PATCH /api/v1/companies/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id công ty>`
- **Request Body:**
  ```json
  {
    "name": "Viettel Group (Updated)",
    "address": "Ha Noi, Viet Nam",
    "description": "Cập nhật mô tả tập đoàn Viettel",
    "logo": "viettel-new.png"
  }
  ```
- **Expected Response (`200 OK`):** Trả về kết quả update từ MongoDB (`modifiedCount: 1`).

### TC-COMP-05: Xóa mềm công ty (`DELETE /api/v1/companies/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id công ty>`
- **Expected Response (`200 OK`):** Đánh dấu `isDeleted: true` (`deleted: 1`).

---

## 3. Module USERS (`/api/v1/users`)

> **Lưu ý:** Trước khi tạo User mới, hãy lấy `_id` của 1 **Role** (từ `GET /api/v1/roles`) và `_id` của 1 **Company** (từ `GET /api/v1/companies`) để điền vào payload.

### TC-USER-01: Tạo mới người dùng bởi Admin (`POST /api/v1/users`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Request Body:**
  ```json
  {
    "name": "Tran Van HR",
    "email": "hr.fpt@gmail.com",
    "password": "123456",
    "age": 28,
    "gender": "FEMALE",
    "address": "Cau Giay, Ha Noi",
    "role": "65f1a2b3c4d5e6f7a8b9c0d1",
    "company": {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d2",
      "name": "FPT Software"
    }
  }
  ```
  *(Thay `role` và `company._id` bằng ObjectId thực tế trong DB của bạn, đủ 24 ký tự hex)*.
- **Expected Response (`201 Created`):** Trả về `_id` và `createdAt`.

### TC-USER-02: Lấy danh sách người dùng phân trang (`GET /api/v1/users`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Query Params:**
  - `current`: `1`
  - `pageSize`: `10`
- **Expected Response (`200 OK`):** Trả về danh sách user (đã ẩn trường `password`).

### TC-USER-03: Xem thông tin user theo ID (`GET /api/v1/users/{id}`)
- **Quyền truy cập:** `@Public()`
- **Path Param:** `id` = `<_id của user>`
- **Expected Response (`200 OK`):** Trả về thông tin user kèm thông tin `role` được populate.

### TC-USER-04: Cập nhật người dùng (`PATCH /api/v1/users/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của user>`
- **Request Body** *(Không cho phép cập nhật `email` và `password` qua API này)*:
  ```json
  {
    "name": "Tran Van HR (Senior)",
    "age": 29,
    "gender": "FEMALE",
    "address": "Da Nang, Viet Nam"
  }
  ```
- **Expected Response (`200 OK`):** Cập nhật thành công (`modifiedCount: 1`).

### TC-USER-05: Xóa mềm người dùng (`DELETE /api/v1/users/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của user vừa tạo>`
- **Expected Response (`200 OK`):** Xóa mềm thành công. *(Lưu ý: Nếu truyền ID của tài khoản `admin@gmail.com` sẽ bị chặn không cho xóa)*.

---

## 4. Module JOBS (`/api/v1/jobs`)

### TC-JOB-01: Tạo mới công việc tuyển dụng (`POST /api/v1/jobs`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Request Body:**
  ```json
  {
    "name": "Fullstack Developer (NodeJS / ReactJS)",
    "skills": ["NodeJS", "NestJS", "ReactJS", "TypeScript", "MongoDB"],
    "company": {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d2",
      "name": "FPT Software",
      "logo": "fpt.png"
    },
    "location": "HANOI",
    "salary": 2500,
    "quantity": 3,
    "level": "SENIOR",
    "description": "Tham gia phát triển hệ thống Microservices với NestJS và React.",
    "startDate": "2026-11-01T00:00:00.000Z",
    "endDate": "2026-12-31T23:59:59.000Z",
    "isActive": true
  }
  ```
- **Expected Response (`201 Created`):** Trả về `_id` và `createdAt` của Job vừa tạo.

### TC-JOB-02: Lấy danh sách Job phân trang (`GET /api/v1/jobs`)
- **Quyền truy cập:** `@Public()`
- **Query Params:**
  - `current`: `1`
  - `pageSize`: `10`
- **Expected Response (`200 OK`):** Trả về `meta` và danh sách `result`.

### TC-JOB-03: Xem chi tiết Job theo ID (`GET /api/v1/jobs/{id}`)
- **Quyền truy cập:** `@Public()`
- **Path Param:** `id` = `<_id của job>`
- **Expected Response (`200 OK`):** Trả về thông tin chi tiết của Job.

### TC-JOB-04: Cập nhật Job (`PATCH /api/v1/jobs/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của job>`
- **Request Body:**
  ```json
  {
    "salary": 3000,
    "quantity": 5,
    "level": "LEADER",
    "isActive": true
  }
  ```
- **Expected Response (`200 OK`):** Trả về kết quả update thành công.

### TC-JOB-05: Xóa mềm Job (`DELETE /api/v1/jobs/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của job>`
- **Expected Response (`200 OK`):** Đánh dấu xóa mềm thành công.

---

## 5. Module FILES (`/api/v1/files`)

> **Lưu ý trên Swagger UI:** Endpoint `/api/v1/files/upload` sử dụng `FileInterceptor('fileUpload')`. Để chọn file trực tiếp trên Swagger UI (nếu chưa gắn `@ApiConsumes('multipart/form-data')`), bạn có thể dùng Postman/ThunderClient hoặc gắn thêm decorator `@ApiConsumes` vào `FilesController`.

### TC-FILE-01: Upload file CV / Ảnh (`POST /api/v1/files/upload`)
- **Quyền truy cập:** Yêu cầu Bearer Token (`@SkipCheckPermission()` - mọi user đã đăng nhập đều gọi được)
- **Headers *(Tùy chọn)*:**
  - `folder_type`: `resume` (hoặc `company`, `avatar`... sẽ lưu vào `public/images/<folder_type>`)
- **Body (`multipart/form-data`):**
  - Key: `fileUpload`
  - Value: Chọn file có định dạng `.jpg`, `.jpeg`, `.png`, `.gif`, `.pdf`, `.doc`, `.docx` và dung lượng `< 5MB`.
- **Expected Response (`201 Created`):**
  ```json
  {
    "statusCode": 201,
    "message": "Upload Single File",
    "data": {
      "fileName": "my-cv-1730467200000.pdf"
    }
  }
  ```
- **Negative Case:** Upload file `.exe` hoặc `.txt` -> Trả về `422 Unprocessable Entity` (`"Invalid file type"`).

---

## 6. Module RESUMES (`/api/v1/resumes`)

> **Lưu ý:** Cần lấy `_id` thực tế của 1 **Company** và 1 **Job** từ bước trước để điền vào `companyId` và `jobId`.

### TC-RES-01: Nộp CV ứng tuyển (`POST /api/v1/resumes`)
- **Quyền truy cập:** Yêu cầu Bearer Token (`@SkipCheckPermission()`)
- **Request Body:**
  ```json
  {
    "url": "my-cv-1730467200000.pdf",
    "companyId": "65f1a2b3c4d5e6f7a8b9c0d2",
    "jobId": "65f1a2b3c4d5e6f7a8b9c0d3"
  }
  ```
- **Expected Response (`201 Created`):** Trả về `_id` và `createdAt` của hồ sơ ứng tuyển (trạng thái mặc định: `PENDING`, tự động lưu `history`).

### TC-RES-02: Lấy danh sách CV của chính User đang đăng nhập (`POST /api/v1/resumes/by-user`)
- **Quyền truy cập:** Yêu cầu Bearer Token (`@SkipCheckPermission()`)
- **Request Body:** Không có.
- **Expected Response (`201 Created`):** Trả về danh sách các CV mà user hiện tại đã nộp.

### TC-RES-03: Lấy toàn bộ danh sách CV có phân trang (`GET /api/v1/resumes`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Query Params:**
  - `current`: `1`
  - `pageSize`: `10`
- **Expected Response (`200 OK`):** Trả về danh sách CV kèm phân trang.

### TC-RES-04: Xem chi tiết 1 CV theo ID (`GET /api/v1/resumes/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của resume>`
- **Expected Response (`200 OK`):** Trả về chi tiết CV (bao gồm lịch sử `history`).

### TC-RES-05: Cập nhật trạng thái duyệt CV (`PATCH /api/v1/resumes/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của resume>`
- **Request Body:**
  ```json
  {
    "status": "APPROVED"
  }
  ```
  *(Các giá trị trạng thái thường dùng: `PENDING`, `REVIEWING`, `APPROVED`, `REJECTED`)*
- **Expected Response (`200 OK`):** Cập nhật `status` và tự động đẩy thêm 1 bản ghi mới vào mảng `history`.

### TC-RES-06: Xóa mềm CV (`DELETE /api/v1/resumes/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của resume>`
- **Expected Response (`200 OK`):** Xóa mềm thành công.

---

## 7. Module PERMISSIONS (`/api/v1/permissions`)

### TC-PERM-01: Tạo mới quyền hạn (`POST /api/v1/permissions`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Request Body:**
  ```json
  {
    "name": "Export statistics report",
    "apiPath": "/api/v1/reports/export",
    "method": "GET",
    "module": "REPORTS"
  }
  ```
- **Expected Response (`201 Created`):** Trả về `_id` và `createdAt`.
- **Negative Case:** Gửi lại đúng `apiPath` và `method` đã tồn tại -> Báo lỗi `400 Bad Request` (trùng lặp permission).

### TC-PERM-02: Lấy danh sách Permissions phân trang (`GET /api/v1/permissions`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Query Params:** `current` = `1`, `pageSize` = `10`
- **Expected Response (`200 OK`):** Trả về danh sách quyền hạn.

### TC-PERM-03: Xem chi tiết Permission (`GET /api/v1/permissions/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của permission>`

### TC-PERM-04: Cập nhật Permission (`PATCH /api/v1/permissions/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của permission>`
- **Request Body:**
  ```json
  {
    "name": "Export statistics report (Updated)",
    "apiPath": "/api/v1/reports/export",
    "method": "POST",
    "module": "REPORTS"
  }
  ```

### TC-PERM-05: Xóa mềm Permission (`DELETE /api/v1/permissions/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của permission>`

---

## 8. Module ROLES (`/api/v1/roles`)

### TC-ROLE-01: Tạo mới Role (`POST /api/v1/roles`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Request Body:** *(Thay các phần tử trong mảng `permissions` bằng `_id` lấy từ `GET /api/v1/permissions`)*
  ```json
  {
    "name": "HR_MANAGER",
    "description": "Nhân sự tuyển dụng công ty",
    "isActive": true,
    "permissions": [
      "65f1a2b3c4d5e6f7a8b9c0d1",
      "65f1a2b3c4d5e6f7a8b9c0d2"
    ]
  }
  ```
- **Expected Response (`201 Created`):** Trả về `_id` và `createdAt`.

### TC-ROLE-02: Lấy danh sách Role phân trang (`GET /api/v1/roles`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Query Params:** `current` = `1`, `pageSize` = `10`

### TC-ROLE-03: Xem chi tiết Role theo ID (`GET /api/v1/roles/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của role>`
- **Expected Response (`200 OK`):** Trả về chi tiết Role kèm mảng `permissions` đã được populate chi tiết (`_id`, `apiPath`, `name`, `method`, `module`).

### TC-ROLE-04: Cập nhật Role (`PATCH /api/v1/roles/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của role>`
- **Request Body:**
  ```json
  {
    "name": "HR_MANAGER",
    "description": "Quản lý tuyển dụng cấp cao",
    "isActive": true,
    "permissions": []
  }
  ```

### TC-ROLE-05: Xóa mềm Role (`DELETE /api/v1/roles/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của role vừa tạo>`
- **Lưu ý:** Hệ thống chặn không cho xóa Role mặc định có tên là `ADMIN`.

---

## 9. Module SUBSCRIBERS (`/api/v1/subscribers`)

### TC-SUB-01: Đăng ký nhận thông báo việc làm theo kỹ năng (`POST /api/v1/subscribers`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Request Body:**
  ```json
  {
    "name": "Le Van Dev",
    "email": "levandev@gmail.com",
    "skills": ["React", "NestJS", "TypeScript"]
  }
  ```
- **Expected Response (`201 Created`):** Trả về `_id` và `createdAt`.

### TC-SUB-02: Cập nhật (Upsert) kỹ năng nhận việc của User đang đăng nhập (`PATCH /api/v1/subscribers`)
- **Quyền truy cập:** Yêu cầu Bearer Token (`@SkipCheckPermission()`)
- **Request Body:**
  ```json
  {
    "name": "I am Admin",
    "email": "admin@gmail.com",
    "skills": ["Node.js", "NestJS", "MongoDB"]
  }
  ```
- **Expected Response (`200 OK`):** Tự động cập nhật theo email của user đang đăng nhập (nếu chưa có bản ghi sẽ tự tạo mới nhờ `upsert: true`).

### TC-SUB-03: Lấy danh sách kỹ năng đã đăng ký của User hiện tại (`POST /api/v1/subscribers/skills`)
- **Quyền truy cập:** Yêu cầu Bearer Token (`@SkipCheckPermission()`)
- **Request Body:** Không có.
- **Expected Response (`201 Created`):** Trả về danh sách `skills` của user hiện tại.

### TC-SUB-04: Lấy danh sách Subscribers phân trang (`GET /api/v1/subscribers`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Query Params:** `current` = `1`, `pageSize` = `10`

### TC-SUB-05: Xem chi tiết Subscriber theo ID (`GET /api/v1/subscribers/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của subscriber>`

### TC-SUB-06: Xóa mềm Subscriber (`DELETE /api/v1/subscribers/{id}`)
- **Quyền truy cập:** Yêu cầu Bearer Token (Admin)
- **Path Param:** `id` = `<_id của subscriber>`

---

## 10. Module MAIL (`/api/v1/mail`)

### TC-MAIL-01: Gửi email gợi ý việc làm thử nghiệm (`GET /api/v1/mail`)
- **Quyền truy cập:** `@Public()`
- **Điều kiện tiên quyết:**
  1. Trong `.env` đã cấu hình `EMAIL_HOST`, `EMAIL_AUTH_USER`, `EMAIL_AUTH_PASS`.
  2. Trong bảng `Subscribers` có người đăng ký kỹ năng (ví dụ: `"React"` hoặc `"NestJS"`) trùng với kỹ năng của các công việc trong bảng `Jobs`.
- **Expected Response (`200 OK`):** Hệ thống quét danh sách Subscribers, tìm các Jobs khớp `skills` và gửi email template `new-job.hbs` tới địa chỉ email đăng ký.
