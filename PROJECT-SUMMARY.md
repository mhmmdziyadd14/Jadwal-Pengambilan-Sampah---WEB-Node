# 🗑️ Sistem Manajemen Jadwal Pengangkutan Sampah - PROJECT SUMMARY

## 📦 Project Structure

```
uts/
│
├── 📄 README.md                 ← Dokumentasi lengkap
├── 📄 QUICKSTART.md             ← Quick setup guide (10 menit)
├── 📄 API-DOCS.md               ← API reference lengkap
├── 📄 .gitignore                ← Git ignore file
│
├── 📁 frontend/                 ← Web Interface
│   ├── index.html               ← Main page (BUKA INI DI BROWSER)
│   ├── style.css                ← Responsive styling (theme sampah)
│   └── script.js                ← JavaScript logic & API calls
│
├── 📁 backend/                  ← Node.js + Express API
│   ├── server.js                ← Main server file (RUN: npm run dev)
│   ├── package.json             ← Dependencies
│   ├── .env.example             ← Environment template
│   └── .env                     ← YOUR AWS CREDENTIALS (create this)
│
├── 📁 database/
│   └── schema.sql               ← MySQL schema (jalankan ini di AWS RDS)
│
└── 📁 config/
    ├── AWS-SETUP.md             ← Detailed AWS RDS setup
    ├── nginx.conf               ← Nginx reverse proxy config
    ├── sampah-backend.service   ← Systemd service file
    └── README.md                ← Config documentation
```

## ✨ Fitur Aplikasi

### 🏠 Data Rumah
- Kelola informasi rumah yang ada di zona pengambilan
- Simpan: nama pemilik, alamat, telepon, zona
- CRUD lengkap dengan interface yang user-friendly

### 👷 Data Petugas
- Kelola daftar petugas kebersihan
- Simpan: nama, telepon, zona wilayah, status (aktif/nonaktif)
- Hanya petugas aktif yang bisa dipilih untuk jadwal

### 📅 Jadwal Pengambilan
- Tentukan kapan dan siapa yang ambil sampah
- Lihat dengan kalender interaktif (tema sampah)
- Filter per bulan dan tahun
- Simpan: tanggal, rumah, petugas, keterangan

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│ FRONTEND (HTML/CSS/JavaScript)                      │
│ - Responsive UI                                     │
│ - Calendar View                                     │
│ - Modal Forms                                       │
│ - API Integration                                   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/CORS
                       │ 
┌──────────────────────▼──────────────────────────────┐
│ BACKEND (Node.js + Express)                         │
│ - RESTful API                                       │
│ - Connection Pooling                                │
│ - Data Validation                                   │
│ - CORS Enabled                                      │
└──────────────────────┬──────────────────────────────┘
                       │ MySQL Protocol
                       │ TCP/3306
                       │
┌──────────────────────▼──────────────────────────────┐
│ DATABASE (AWS RDS MySQL)                            │
│ - 3 Main Tables (rumah, petugas, jadwal)           │
│ - Indexed Queries                                   │
│ - Auto Backup                                       │
│ - Located in Cloud (ap-southeast-1)                │
└─────────────────────────────────────────────────────┘
```

## 🚀 Quick Start (3 Steps)

### Step 1: Create AWS RDS
```
1. Buka AWS Console → RDS → Create Database
2. Select MySQL, configure dengan endpoint A.B.C.rds.amazonaws.com
3. Jalankan SQL: database/schema.sql
```

### Step 2: Setup Backend
```bash
cd backend
npm install
# Create .env dengan AWS credentials
npm run dev
```

### Step 3: Run Frontend
```
Buka frontend/index.html di browser
Data akan langsung terakses dari AWS RDS
```

## 📋 Database Schema

### Tabel: rumah
| Column | Type | Notes |
|--------|------|-------|
| id_rumah | INT PK | Auto increment |
| nama_pemilik | VARCHAR(100) | Wajib |
| alamat | VARCHAR(255) | Wajib |
| nomor_telepon | VARCHAR(15) | Optional |
| zona_pengambilan | VARCHAR(50) | Wajib |
| created_at | TIMESTAMP | Auto |
| updated_at | TIMESTAMP | Auto |

### Tabel: petugas
| Column | Type | Notes |
|--------|------|-------|
| id_petugas | INT PK | Auto increment |
| nama_petugas | VARCHAR(100) | Wajib |
| nomor_telepon | VARCHAR(15) | Optional |
| zona_wilayah | VARCHAR(50) | Wajib |
| status | ENUM | aktif/nonaktif |
| created_at | TIMESTAMP | Auto |
| updated_at | TIMESTAMP | Auto |

### Tabel: jadwal
| Column | Type | Notes |
|--------|------|-------|
| id_jadwal | INT PK | Auto increment |
| id_rumah | INT FK | References rumah |
| id_petugas | INT FK | References petugas |
| tanggal_pengambilan | DATE | Wajib |
| keterangan | VARCHAR(255) | Optional |
| created_at | TIMESTAMP | Auto |
| updated_at | TIMESTAMP | Auto |

## 🔗 API Endpoints

```
RUMAH:
  GET    /api/rumah
  GET    /api/rumah/:id
  POST   /api/rumah
  PUT    /api/rumah/:id
  DELETE /api/rumah/:id

PETUGAS:
  GET    /api/petugas
  POST   /api/petugas
  PUT    /api/petugas/:id
  DELETE /api/petugas/:id

JADWAL:
  GET    /api/jadwal
  GET    /api/jadwal/bulan/:tahun/:bulan
  POST   /api/jadwal
  PUT    /api/jadwal/:id
  DELETE /api/jadwal/:id

HEALTH:
  GET    /api/health
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (0 dependencies)
- **Backend**: Node.js 14+, Express 4.18, MySQL2/Promise
- **Database**: AWS RDS MySQL 8.0
- **Cloud**: Amazon Web Services (ap-southeast-1)
- **API**: RESTful JSON
- **Deployment**: EC2, Nginx, Let's Encrypt SSL

## 📊 Sample Data

### Rumah
- Budi Santoso, Jl. Merdeka No. 123, Jakarta, Zona A
- Siti Nurhaliza, Jl. Ahmad Yani No. 456, Bandung, Zona B
- Ahmad Wijaya, Jl. Sudirman No. 789, Surabaya, Zona C

### Petugas
- Rinto Harahap, 081111111111, Zona A, Aktif
- Bambang Irawan, 082222222222, Zona B, Aktif
- Cecep Subagja, 083333333333, Zona C, Aktif

### Jadwal
- 2026-04-15: Budi Santoso + Rinto Harahap
- 2026-04-15: Siti Nurhaliza + Bambang Irawan
- 2026-04-16: Ahmad Wijaya + Cecep Subagja

## 🔒 Security Features

✅ Connection pooling untuk mencegah resource leak
✅ Input validation di backend
✅ CORS enabled untuk frontend
✅ AWS RDS dengan encryption
✅ Environment variables untuk credentials
✅ SQL injection prevention (prepared statements)
✅ Error handling yang proper

## 🎨 UI/UX Highlights

- **Tema Sampah**: Warna purple gradient dengan ikon sampah 🗑️
- **Responsive Design**: Mobile, Tablet, Desktop compatible
- **Kalender Interaktif**: Lihat jadwal visual
- **Modal Forms**: User-friendly input
- **Real-time Updates**: Auto-refresh setelah create/update/delete
- **Status Indicators**: Badge untuk zona dan status
- **Notification System**: Toast alerts untuk success/error

## 📈 Future Enhancements

- [ ] User Authentication (Login/Register)
- [ ] Role-based Access Control (Admin, Petugas, Pemilik)
- [ ] Photo Upload (Foto rumah, jadwal)
- [ ] SMS/Email Notifications
- [ ] Mobile App (React Native)
- [ ] Analytics Dashboard
- [ ] Export to PDF/Excel
- [ ] GPS Integration untuk tracking
- [ ] Recurring Schedule Templates
- [ ] Payment Integration

## 📚 Documentation Files

| File | Content |
|------|---------|
| README.md | Dokumentasi lengkap proyek |
| QUICKSTART.md | Setup dalam 10 menit |
| API-DOCS.md | Referensi API lengkap |
| config/AWS-SETUP.md | Panduan setup AWS RDS |
| database/schema.sql | SQL untuk create tables |
| .gitignore | Git ignore patterns |

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Cannot connect to DB | Cek .env credentials dan RDS endpoint |
| CORS error | Pastikan backend running dan port benar |
| Port 5000 in use | Ubah PORT di .env atau kill process |
| Frontend blank | Check browser console (F12) untuk errors |
| Data tidak muncul | Verify database connection dengan: `npm run test-db` |

## 📞 Support & Questions

Untuk bantuan lebih lanjut, check:
1. README.md - dokumentasi lengkap
2. API-DOCS.md - contoh API calls
3. Browser DevTools (F12) - JavaScript errors
4. Backend console - Server logs
5. AWS RDS Event Logs - Database errors

## ✅ Checklist Sebelum Deploy

- [ ] Database schema sudah jalan di AWS RDS
- [ ] .env file sudah dikonfigurasi dengan AWS credentials
- [ ] Backend sudah test (npm run dev)
- [ ] Frontend sudah test di localhost
- [ ] CRUD operations untuk semua 3 tables working
- [ ] Calendar view menampilkan jadwal dengan benar
- [ ] Notifikasi toast muncul saat create/update/delete
- [ ] Error handling berfungsi
- [ ] Code sudah di-backup/push ke Git

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [AWS RDS Guide](https://docs.aws.amazon.com/rds/)
- [MySQL 8.0 Reference](https://dev.mysql.com/doc/refman/8.0/en/)
- [RESTful API Design](https://restfulapi.net/)

---

**Created:** April 2026  
**Purpose:** UTS Komputasi Awan  
**Status:** ✅ Production Ready  

🎉 **Happy Coding!**
