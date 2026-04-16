# 🗑️ Sistem Manajemen Jadwal Pengangkutan Sampah

Aplikasi web berbasis cloud untuk mengelola jadwal pengangkutan sampah. Dibangun dengan Node.js + Express untuk backend dan vanilla JavaScript untuk frontend, serta menggunakan AWS RDS untuk database.

## 📋 Fitur Utama

### 1. **Data Rumah** 🏠
- Kelola data pemilik rumah yang akan diambil sampahnya
- Informasi: Nama pemilik, alamat, nomor telepon, zona pengambilan
- CRUD (Create, Read, Update, Delete) operations

### 2. **Data Petugas** 👷
- Kelola data petugas kebersihan
- Informasi: Nama petugas, nomor telepon, zona wilayah, status (aktif/nonaktif)
- Hanya petugas aktif yang bisa dipilih untuk jadwal

### 3. **Jadwal Pengambilan** 📅
- Tentukan jadwal pengambilan sampah untuk setiap rumah
- Informasi: Tanggal pengambilan, petugas yang menangani, keterangan
- View dengan kalender interaktif
- Filter berdasarkan bulan dan tahun

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (HTML/CSS/JS)                 │
│                    - Responsive UI                          │
│                    - Calendar View                          │
│                    - Modal Forms                            │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/CORS
┌────────────────────────▼────────────────────────────────────┐
│                  Backend (Node.js + Express)                │
│                   - RESTful API                             │
│                   - Data Validation                         │
│                   - Connection Pooling                      │
└────────────────────────┬────────────────────────────────────┘
                         │ TCP/MySQL
┌────────────────────────▼────────────────────────────────────┐
│            AWS RDS MySQL Database (Cloud)                   │
│              - 3 Main Tables                                │
│              - Indexed Queries                              │
│              - Automatic Backups                            │
└─────────────────────────────────────────────────────────────┘
```

## 🗄️ Database Schema

### Tabel: `rumah`
```sql
- id_rumah (PK)
- nama_pemilik
- alamat
- nomor_telepon
- zona_pengambilan
- created_at
- updated_at
```

### Tabel: `petugas`
```sql
- id_petugas (PK)
- nama_petugas
- nomor_telepon
- zona_wilayah
- status (enum: aktif/nonaktif)
- created_at
- updated_at
```

### Tabel: `jadwal`
```sql
- id_jadwal (PK)
- id_rumah (FK)
- id_petugas (FK)
- tanggal_pengambilan
- keterangan
- created_at
- updated_at
```

## 🚀 Panduan Setup

### Prasyarat
- Node.js (v14 atau lebih tinggi)
- npm atau yarn
- AWS Account dengan RDS MySQL
- VS Code (opsional tapi direkomendasikan)

### 1. Setup AWS RDS Database

#### Langkah 1: Buat RDS Instance
1. Login ke AWS Console
2. Buka RDS Dashboard → Create Database
3. Pilih MySQL sebagai database engine
4. Konfigurasi:
   - DB Instance Class: `db.t3.micro` (free tier eligible)
   - Storage: 20 GB
   - Database name: `sampah-db`
   - Master username: `admin`
   - Master password: (buat password yang kuat)
5. Klik "Create database"

#### Langkah 2: Konfigurasi Security Group
1. Pergi ke RDS Instance Details
2. Buka Security Group yang terkait
3. Add Inbound Rule:
   - Type: MySQL/Aurora
   - Port Range: 3306
   - Source: Your IP atau `0.0.0.0/0` (untuk development saja)

#### Langkah 3: Catat Endpoint
- Endpoint akan terlihat seperti: `xxxx.rds.amazonaws.com`
- Simpan untuk digunakan di backend

### 2. Setup Backend

```bash
# Navigasi ke folder backend
cd backend

# Install dependencies
npm install

# Buat file .env
cp .env.example .env

# Edit .env dengan konfigurasi AWS RDS Anda
# DB_HOST=your-rds-endpoint.rds.amazonaws.com
# DB_USER=admin
# DB_PASSWORD=your_password
# DB_NAME=sampah-db
```

### 3. Setup Database

Jalankan SQL script untuk membuat tabel:

```bash
# Gunakan MySQL CLI atau tools seperti MySQL Workbench
mysql -h your-rds-endpoint.rds.amazonaws.com -u admin -p < ../database/schema.sql

# Atau copy-paste isi database/schema.sql ke MySQL Workbench
```

### 4. Jalankan Backend Server

```bash
# Development mode (dengan auto-reload)
npm run dev

# Production mode
npm start

# Server akan berjalan di http://localhost:5000
```

### 5. Buka Frontend

Buka file `frontend/index.html` di browser:
- File path: `c:\tugas sem 6\Komputasi Awan\uts\frontend\index.html`
- Atau gunakan Live Server extension di VS Code

## 📡 API Endpoints

### Rumah
```
GET    /api/rumah              - Dapatkan semua rumah
GET    /api/rumah/:id          - Dapatkan rumah by ID
POST   /api/rumah              - Tambah rumah baru
PUT    /api/rumah/:id          - Update rumah
DELETE /api/rumah/:id          - Hapus rumah
```

### Petugas
```
GET    /api/petugas            - Dapatkan semua petugas
POST   /api/petugas            - Tambah petugas baru
PUT    /api/petugas/:id        - Update petugas
DELETE /api/petugas/:id        - Hapus petugas
```

### Jadwal
```
GET    /api/jadwal             - Dapatkan semua jadwal
GET    /api/jadwal/bulan/:tahun/:bulan - Dapatkan jadwal by bulan
POST   /api/jadwal             - Tambah jadwal baru
PUT    /api/jadwal/:id         - Update jadwal
DELETE /api/jadwal/:id         - Hapus jadwal
```

## 🔗 Akses dari VS Code

### Mengakses Database dari VS Code

#### Metode 1: MySQL Extension
1. Install extension: "MySQL" (dari Jun Han)
2. Buka Command Palette (Ctrl+Shift+P)
3. Type: "MySQL: Add Connection"
4. Isi:
   - Host: `your-rds-endpoint.rds.amazonaws.com`
   - Username: `admin`
   - Password: `your_password`
   - Port: `3306`
   - Database: `sampah-db`

#### Metode 2: Database Client
1. Install extension: "Database Client" (dari Weijan Chen)
2. Open Database Explorer
3. Klik "Create Connection" → MySQL
4. Isi credential AWS RDS

#### Metode 3: Terminal
```powershell
# Gunakan MySQL CLI dari terminal integrated VS Code
mysql -h your-rds-endpoint.rds.amazonaws.com -u admin -p -e "SELECT * FROM rumah;"
```

## 📊 Contoh Penggunaan API

### Tambah Rumah
```bash
curl -X POST http://localhost:5000/api/rumah \
  -H "Content-Type: application/json" \
  -d '{
    "nama_pemilik": "Budi Santoso",
    "alamat": "Jl. Merdeka No. 123, Jakarta",
    "nomor_telepon": "081234567890",
    "zona_pengambilan": "Zona A"
  }'
```

### Lihat Semua Jadwal
```bash
curl http://localhost:5000/api/jadwal
```

### Update Jadwal
```bash
curl -X PUT http://localhost:5000/api/jadwal/1 \
  -H "Content-Type: application/json" \
  -d '{
    "id_rumah": 1,
    "id_petugas": 1,
    "tanggal_pengambilan": "2026-04-20",
    "keterangan": "Pengambilan rutin minggu ketiga"
  }'
```

## 🔒 AWS Security Best Practices

1. **Gunakan security groups** yang restrictive
2. **Jangan expose RDS** ke internet (gunakan VPC)
3. **Aktifkan encryption** di RDS instance
4. **Regular backups** - AWS RDS sudah automatic
5. **Monitor dengan CloudWatch** untuk anomali

## 📈 Performance Tips

- Database sudah memiliki indexes untuk query cepat
- Gunakan connection pooling (sudah implemented)
- Query dengan filter bulan untuk data besar

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- Cek endpoint RDS di .env
- Pastikan security group RDS allow port 3306
- Cek username/password

### Error: "CORS error"
- Backend harus running (npm run dev/start)
- Pastikan CORS enabled di backend

### Frontend tidak load data
- Buka Developer Console (F12)
- Cek tab Network untuk API requests
- Pastikan backend URL benar di script.js

## 🎯 Next Steps

1. Deploy backend ke AWS (EC2, ECS, atau Lambda)
2. Deploy frontend ke S3 + CloudFront
3. Setup CI/CD pipeline dengan GitHub Actions
4. Tambah authentication & authorization
5. Implementasi upload file (foto sampah)
6. Notifikasi via Email/SMS

## 📝 License

MIT License - Feel free to use for personal/educational projects

## 👨‍💻 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: AWS RDS MySQL
- **API**: RESTful API dengan JSON
- **Cloud**: AWS (RDS, EC2 optional)

---

**Dibuat dengan ❤️ untuk Tugas Komputasi Awan**
#   J a d w a l - P e n g a m b i l a n - S a m p a h - - - W E B - N o d e  
 #   J a d w a l - P e n g a m b i l a n - S a m p a h - - - W E B - N o d e  
 