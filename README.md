# 🦷 Lucky Dental - Hệ Thống Quản Lý Nha Khoa Tích Hợp AI

Hệ thống quản lý nha khoa **Lucky Dental** full-stack hoàn chỉnh được xây dựng trên nền tảng **FastAPI (Python)**, **SQLite (SQLAlchemy ORM)** và **React (Vite + Tailwind CSS)**, kết hợp với mô hình trợ lý **AI Dental Assistant**.

---

## 🚀 1. Công Nghệ Sử Dụng

### Backend
- **Python 3.11**
- **FastAPI** (RESTful API & Swagger Documentation)
- **SQLAlchemy ORM** & **SQLite Database**
- **Pydantic v2** & **Passlib (pbkdf2_sha256)**
- **JWT (JSON Web Token)** Authentication & RBAC Authorization

### Frontend
- **React 18** & **Vite**
- **Tailwind CSS** (Clean Modern Dental Aesthetic)
- **Lucide React** Icons
- **Recharts** (Biểu đồ doanh thu & lượt khám)
- **Axios** (API Client with Interceptors)

### AI Service Module (`backend/app/ai/`)
- Thiết kế dạng Provider Pattern độc lập (`AIService`)
- Tích hợp sẵn Fallback Smart Engine cho Demo/Offline
- Sẵn sàng chuyển đổi sang **Google Gemini**, **OpenAI**, **Ollama**, hoặc **Local LLM** thông qua biến môi trường.

---

## 📁 2. Cấu Trúc Dự Án

```text
duannhakhoademowebapp/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI Application Entry
│   │   ├── database/
│   │   │   └── session.py           # SQLite Session & Base configuration
│   │   ├── models/
│   │   │   └── models.py            # SQLAlchemy Database Models
│   │   ├── schemas/
│   │   │   └── schemas.py           # Pydantic Input/Output Schemas
│   │   ├── auth/
│   │   │   ├── security.py          # Password Hashing
│   │   │   └── jwt.py               # JWT Tokens & Access Control (RBAC)
│   │   ├── ai/
│   │   │   ├── ai_service.py        # AI Provider Layer
│   │   │   └── prompts.py           # System Prompts & Medical Disclaimers
│   │   └── routers/
│   │       ├── auth.py              # Login & Session
│   │       ├── patients.py          # Patient Management
│   │       ├── doctors.py           # Doctor Management
│   │       ├── chairs.py            # Dental Chair Management
│   │       ├── schedules.py         # Working Schedules
│   │       ├── appointments.py      # Appointments & Booking
│   │       ├── services.py          # Dental Services Catalog
│   │       ├── treatment_plans.py   # Multi-stage Treatment Plans
│   │       ├── treatment_records.py # Clinical Records Log
│   │       ├── treatment_images.py  # Clinical Images
│   │       ├── invoices.py          # Multi-item Billing
│   │       ├── payments.py          # Payment Recording
│   │       ├── follow_ups.py        # Follow-up Schedules
│   │       ├── statistics.py        # Analytics & KPIs
│   │       └── ai.py                # AI Endpoints
│   ├── requirements.txt
│   └── seed.py                      # Database Seeder
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth State Context
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx      # Admin Navigation Sidebar (16 Items)
│   │   │   └── PatientLayout.jsx    # Patient Navigation Sidebar (12 Items)
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Landing Page
│   │   │   ├── LoginPage.jsx        # Dual-Role Login Page
│   │   │   ├── admin/               # Admin Management Modules
│   │   │   └── patient/             # Patient Self-Service Portal
│   │   ├── services/
│   │   │   └── api.js               # Axios Client
│   │   ├── App.jsx                  # React Router Routes
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## 🛠️ 3. Hướng Dẫn Cài Đặt & Chạy Local

### Bước 1: Khởi tạo Backend (Python FastAPI)

1. Mở Terminal tại thư mục `backend`:
   ```bash
   cd backend
   ```

2. Cài đặt các thư viện Python:
   ```bash
   pip install -r requirements.txt
   ```

3. Khởi tạo và Nạp dữ liệu Seed mẫu vào SQLite Database (`dental_clinic.db`):
   ```bash
   python seed.py
   ```

4. Chạy Backend Dev Server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   - REST API running at: `http://localhost:8000`
   - Swagger OpenAPI Docs: `http://localhost:8000/docs`

---

### Bước 2: Khởi tạo Frontend (React + Vite)

1. Mở Terminal tại thư mục `frontend`:
   ```bash
   cd frontend
   ```

2. Cài đặt các gói phụ thuộc npm:
   ```bash
   npm install
   ```

3. Chạy Frontend Dev Server:
   ```bash
   npm run dev
   ```
   - Web App running at: `http://localhost:5173`

---

## 🔑 4. Tài Khoản Kiểm Thử Demo

> **Lưu ý quan trọng**: Giao diện đăng nhập cung cấp tab selector `[ ADMIN ]` và `[ PATIENT ]` để chuyển đổi chế độ đăng nhập. Hệ thống **KHÔNG tự động điền hay tự động đăng nhập** mặc định. Người dùng cần nhập tài khoản để truy cập đúng hồ sơ cá nhân của mình.

### 🔴 Tài Khoản ADMIN (Quản trị viên toàn hệ thống)
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `ADMIN`

### 🔵 Tài Khoản PATIENT (Bệnh nhân độc lập)
1. **Bệnh nhân 1 (Nguyễn Văn An)**
   - **Username**: `patient01`
   - **Password**: `patient123`
   - **Role**: `PATIENT` (ID: 1)

2. **Bệnh nhân 2 (Trần Thị Bích)**
   - **Username**: `patient02`
   - **Password**: `patient123`
   - **Role**: `PATIENT` (ID: 2)

3. **Bệnh nhân 3 (Lê Hoàng Cường)**
   - **Username**: `patient03`
   - **Password**: `patient123`
   - **Role**: `PATIENT` (ID: 3)

---

## 🤖 5. Hướng Dẫn Tích Hợp AI Thật (Gemini / OpenAI / Ollama)

AI Service được thiết kế theo lớp trừu tượng tại file:
`backend/app/ai/ai_service.py`

Để kích hoạt **Gemini API** thật:
1. Đặt biến môi trường trong hệ thống hoặc file `.env`:
   ```bash
   export GEMINI_API_KEY="your_gemini_api_key_here"
   ```
2. Re-start backend FastAPI. `AIService` sẽ tự động chuyển từ Mock Engine sang gọi Gemini API trực tiếp.

---

## 🔐 6. Phân Quyền & Bảo Mật An Toàn

- **Strict Access Isolation**: Quyền truy cập được kiểm tra nghiêm ngặt tại **Backend API** (Python JWT Dependency).
- Bệnh nhân `patient01` **không bao giờ** có thể xem hoặc truy vấn dữ liệu bệnh án, hóa đơn của `patient02` (API trả về HTTP 403 Forbidden nếu cố tình truy cập trái phép).
- Mật khẩu được mã hóa an toàn bằng PBKDF2/SHA256.
