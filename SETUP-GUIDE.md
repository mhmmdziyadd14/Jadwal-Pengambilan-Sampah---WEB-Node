# 📖 Panduan Lengkap: Membuat Aplikasi Sampah Scheduler di AWS Cloud

## 🎯 Tujuan

Membuat aplikasi web untuk manajemen jadwal pengangkutan sampah dengan:
- ✅ Data Rumah (pemilik sampah)
- ✅ Data Petugas (pengambil sampah)
- ✅ Jadwal Pengambilan (kalender interaktif)
- ✅ Database di AWS RDS (accessible dari VS Code)

---

## 📋 Daftar Lengkap File yang Sudah Dibuat

### 📁 Frontend (User Interface)
```
frontend/
├── index.html        [445 lines]  - Main UI dengan 3 tab
├── style.css         [700 lines]  - Responsive design (tema sampah)
└── script.js         [580 lines]  - API calls & logic
```

### 📁 Backend (Server & API)
```
backend/
├── server.js         [300 lines]  - Express server dengan 15 API endpoints
├── package.json      -            - Dependencies
├── .env.example      -            - Template environment variables
└── test-db.js        [70 lines]   - Test database connection
```

### 📁 Database
```
database/
└── schema.sql        [100 lines]  - SQL untuk create tables + sample data
```

### 📁 Konfigurasi & Deployment
```
config/
├── AWS-SETUP.md               - Panduan setup AWS RDS lengkap
├── sampah-backend.service     - Systemd service file
├── nginx.conf                 - Reverse proxy configuration
└── README.md                  - Explanations

Lainnya:
├── deploy.sh                  - Bash script untuk deployment
├── .gitignore                 - Git ignore patterns
├── README.md                  - Dokumentasi utama
├── QUICKSTART.md              - Setup 10 menit
├── API-DOCS.md                - Referensi API lengkap
└── PROJECT-SUMMARY.md         - Ringkasan project ini
```

---

## 🏗️ Arsitektur Lengkap

```
┌────────────────────────────────────────────────────────────────────┐
│                         BROWSER (Client)                           │
│  frontend/index.html                                              │
│  - Kalender interaktif dengan tema sampah 🗑️                     │
│  - 3 Tab: Rumah | Petugas | Jadwal                               │
│  - Modal form untuk CRUD                                          │
│  - Toast notifications                                            │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                    HTTP/CORS
                    Port 5000
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                      │
│  backend/server.js                                               │
│                                                                   │
│  Routes:                                                          │
│  ├── GET/POST/PUT/DELETE /api/rumah       [5 endpoints]         │
│  ├── GET/POST/PUT/DELETE /api/petugas     [4 endpoints]         │
│  ├── GET/POST/PUT/DELETE /api/jadwal      [5 endpoints]         │
│  ├── GET /api/jadwal/bulan/:tahun/:bulan  [1 endpoint]         │
│  └── GET /api/health                      [1 endpoint]         │
│                                                                   │
│  Features:                                                        │
│  - Connection pooling (10 connections)                            │
│  - Error handling & validation                                    │
│  - CORS enabled                                                   │
│  - JSON request/response                                          │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                    MySQL Protocol
                    TCP Port 3306
                    AWS RDS Connection
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│              AWS RDS MySQL Database (Cloud)                       │
│  Instance: db.t3.micro (Free Tier)                               │
│  Region: ap-southeast-1                                          │
│  Database: sampah-db                                             │
│                                                                   │
│  Tables:                                                          │
│  ├── rumah              [5 columns]                              │
│  │   ├── id_rumah (PK)                                           │
│  │   ├── nama_pemilik                                            │
│  │   ├── alamat                                                  │
│  │   ├── nomor_telepon                                           │
│  │   └── zona_pengambilan                                        │
│  │                                                                │
│  ├── petugas            [5 columns]                              │
│  │   ├── id_petugas (PK)                                         │
│  │   ├── nama_petugas                                            │
│  │   ├── nomor_telepon                                           │
│  │   ├── zona_wilayah                                            │
│  │   └── status (enum)                                           │
│  │                                                                │
│  └── jadwal             [6 columns]                              │
│      ├── id_jadwal (PK)                                          │
│      ├── id_rumah (FK)                                           │
│      ├── id_petugas (FK)                                         │
│      ├── tanggal_pengambilan                                     │
│      ├── keterangan                                              │
│      └── timestamps                                              │
│                                                                   │
│  Features:                                                        │
│  - Indexed columns untuk cepat                                    │
│  - Foreign key relationships                                      │
│  - Auto timestamps                                                │
│  - Free tier eligible                                             │
│  - Automatic backups                                              │
│  - 20GB storage                                                   │
└────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Step-by-Step Setup Guide

### STEP 1: Siapkan AWS RDS (15 menit)

#### 1a. Create AWS Account
- Login ke https://console.aws.amazon.com
- Verifikasi email

#### 1b. Navigate to RDS
```
Services → RDS → Databases → Create Database
```

#### 1c. Configure MySQL Instance
```
Engine: MySQL 8.0.latest
Instance Class: db.t3.micro
Storage: 20 GB
Master Username: admin
Master Password: SampahDB2026! (atau pilih sendiri)
```

#### 1d. Network Settings
```
VPC: Default VPC
Public Accessibility: Yes (untuk development)
Security Group: Create New
Inbound Rule:
  - Type: MySQL/Aurora
  - Port: 3306
  - Source: 0.0.0.0/0 (HANYA UNTUK DEV!)
```

#### 1e. Catat Endpoint
Setelah create (~10 menit), catat:
```
Endpoint: sampah-db-01.abc123xyz.ap-southeast-1.rds.amazonaws.com
Username: admin
Password: SampahDB2026!
Database: sampah-db (belum ada, akan dibuat)
```

---

### STEP 2: Setup Database Schema (5 menit)

Jalankan SQL dari `database/schema.sql`:

#### Method A: MySQL Workbench
```
1. Download MySQL Workbench
2. File → New Query Tab
3. Database → New Connection
   Host: sampah-db-01.abc..rds.amazonaws.com
   Username: admin
   Password: SampahDB2026!
4. Copy-paste isi database/schema.sql
5. Execute (Ctrl+Shift+Enter)
```

#### Method B: MySQL CLI
```bash
# Dari terminal
mysql -h sampah-db-01.abc..rds.amazonaws.com \
      -u admin \
      -p < database/schema.sql
# Masukkan password saat diminta
```

#### Method C: AWS Console
```
1. RDS → Databases → Query Editor
2. Paste isi schema.sql
3. Execute
```

---

### STEP 3: Setup Backend (5 menit)

```bash
# Buka terminal di folder backend
cd backend

# Install dependencies
npm install

# Create .env file dengan 2 cara:

# Cara 1: Manual create file
# Buka backend/.env, isi:
DB_HOST=sampah-db-01.abc..rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=SampahDB2026!
DB_NAME=sampah-db
DB_PORT=3306
PORT=5000
NODE_ENV=development

# Cara 2: Copy dari template
cp .env.example .env
# Edit .env dengan endpoint yang benar

# Test database connection
npm install mysql2/promise
node test-db.js

# Expected output:
# ✅ Connection successful!
# 📊 Database Information:
# ...
# ✅ All tests passed!

# Jalankan server
npm run dev

# Expected output:
# ✓ Terhubung ke Database AWS RDS
# 🚀 Server berjalan di http://localhost:5000
```

---

### STEP 4: Run Frontend (2 menit)

#### Option A: Direct File Open
```
1. Buka c:\tugas sem 6\Komputasi Awan\uts\frontend\index.html di browser
2. Seharusnya muncul UI dengan 3 tab
```

#### Option B: Live Server (VS Code)
```
1. Install extension: Live Server
2. Klik kanan pada index.html → "Open with Live Server"
3. Browser auto-open di http://localhost:5500
```

#### Option C: HTTP Server
```bash
cd frontend
python -m http.server 8000
# Buka http://localhost:8000/index.html
```

---

### STEP 5: Test CRUD Operations

Setelah frontend terbuka:

#### ✅ Test Rumah
1. Klik tab "🏠 Data Rumah"
2. Klik "+ Tambah Rumah"
3. Isi form:
   - Nama: Rina Suryanto
   - Alamat: Jl. Gatot Subroto, Surabaya
   - Telepon: 085555555555
   - Zona: Zona B
4. Klik "Simpan"
5. Seharusnya ada toast notification "Data rumah berhasil ditambahkan"
6. Data muncul di tabel

#### ✅ Test Petugas
1. Tab "👷 Data Petugas"
2. Tambah petugas baru
3. Form data sama seperti rumah

#### ✅ Test Jadwal
1. Tab "📅 Jadwal Pengambilan"
2. Klik "+ Tambah Jadwal"
3. Pilih Rumah, Petugas, Tanggal
4. Klik "Simpan"
5. Kalender menampilkan jadwal!

---

## 🔗 Akses Database dari VS Code

### Method 1: MySQL Extension (Recommended)

```
1. Install extension: "MySQL" (Jun Han)
   - Buka Sidebar → Extensions
   - Cari "mysql"
   - Install

2. Buka Command Palette (Ctrl+Shift+P)
   - Type "MySQL: Add Connection"
   - Konfigurasi:
     Driver: MySQL
     Host: sampah-db-01.abc..rds.amazonaws.com
     Port: 3306
     Username: admin
     Password: SampahDB2026!
     Database: sampah-db
   - Save connection

3. Di sidebar muncul Database Explorer
   - Expand connection
   - Lihat tables dan data
   - Bisa run queries langsung

4. Contoh query di VS Code:
   SELECT * FROM rumah;
   UPDATE jadwal SET keterangan = 'New' WHERE id_jadwal = 1;
```

### Method 2: Database Client

```
1. Install: "Database Client" (Weijan Chen)
2. Open Database Explorer
3. "+ Connect to Database"
4. Type: MySQL
5. Fill connection details
```

### Method 3: Integrated Terminal

```bash
# Langsung dari terminal VS Code (integrated):
mysql -h sampah-db-01.abc..rds.amazonaws.com -u admin -p

# Queries:
USE sampah-db;
SELECT * FROM rumah;
SELECT * FROM petugas;
SELECT * FROM jadwal;
```

---

## 📊 API Testing (cURL Commands)

### Test di Terminal/PowerShell

```bash
# GET semua rumah
curl http://localhost:5000/api/rumah

# POST tambah rumah
curl -X POST http://localhost:5000/api/rumah \
  -H "Content-Type: application/json" \
  -d '{
    "nama_pemilik": "Test User",
    "alamat": "Jl. Test",
    "nomor_telepon": "0812345",
    "zona_pengambilan": "Zona A"
  }'

# GET jadwal bulan tertentu
curl http://localhost:5000/api/jadwal/bulan/2026/4

# DELETE
curl -X DELETE http://localhost:5000/api/rumah/1
```

---

## 🎨 UI Features

### 🌈 Theme Sampah
- **Warna**: Purple gradient (#667eea → #764ba2)
- **Icon**: 🗑️ Sampah
- **Cards**: Gradient, shadows, hover effects

### 📱 Responsive
- Desktop: Full layout
- Tablet: Adjusted grid
- Mobile: Stack layout

### 🎯 Interaktivity
- **Kalender**: Bulan sebelum/sesudah
- **Modal**: Smooth fade-in
- **Notifikasi**: Toast 3 detik
- **Konfirmasi**: Delete confirmation

---

## 🔒 Security Checklist

- [x] .env file di .gitignore (credentials aman)
- [x] Connection pooling (prevent connection leak)
- [x] Prepared statements (prevent SQL injection)
- [x] Input validation di backend
- [x] CORS configured
- [x] Error handling (no sensitive info exposed)
- [x] RDS encryption ready
- [x] Automatic backups enabled

---

## 🚨 Troubleshooting

| Problem | Solusi |
|---------|--------|
| "Cannot GET /" | Frontend error, check console (F12) |
| "connect ECONNREFUSED" | Backend tidak running, jalankan `npm run dev` |
| "ER_ACCESS_DENIED_FOR_USER" | Check .env credentials di RDS instance |
| "CORS error" | Backend belum running atau URL berbeda |
| "ETIMEDOUT" | RDS security group tidak allow port 3306 |
| Port 5000 sudah pakai | Ubah PORT di .env |

---

## 📈 Next Steps / Enhancements

- [ ] User authentication (login/password)
- [ ] Role-based access (admin, petugas, pemilik)
- [ ] Photo upload ke S3
- [ ] Email/SMS notifications
- [ ] GPS tracking untuk petugas
- [ ] Mobile app (React Native)
- [ ] Export PDF/Excel
- [ ] Advanced reporting
- [ ] API rate limiting
- [ ] Caching dengan Redis

---

## 📚 Resource Links

- 🔗 [AWS RDS Docs](https://docs.aws.amazon.com/rds/)
- 🔗 [Express.js Guide](https://expressjs.com/)
- 🔗 [MySQL 8.0 Reference](https://dev.mysql.com/doc/refman/8.0/en/)
- 🔗 [RESTful API Design](https://restfulapi.net/)

---

## ✅ Completion Checklist

- [x] Project structure created
- [x] Frontend (HTML/CSS/JS) done
- [x] Backend (Express.js) done
- [x] Database schema created
- [x] AWS RDS setup guide written
- [x] API documentation complete
- [x] CRUD operations functional
- [x] Responsive design implemented
- [x] Error handling added
- [x] Sample data provided
- [x] Deployment configs ready

---

**🎉 Project Siap Digunakan!**

Untuk memulai:
1. Ikuti QUICKSTART.md (10 menit)
2. Atau ikuti panduan lengkap di README.md

Semoga berhasil! 🚀

---

**Last Updated:** April 15, 2026
