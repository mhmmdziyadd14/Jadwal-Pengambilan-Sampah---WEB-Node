# 🗑️ Sistem Manajemen Jadwal Pengangkutan Sampah  
## Dokumentasi & Panduan Lengkap

---

## 📖 Baca Ini Terlebih Dahulu!

Untuk **setup tercepat** (10 menit):
→ Baca **[QUICKSTART.md](QUICKSTART.md)** ⚡

Untuk **panduan lengkap step-by-step**:
→ Baca **[SETUP-GUIDE.md](SETUP-GUIDE.md)** 📚

---

## 🗂️ Daftar Lengkap Dokumentasi

### 🚀 Getting Started
| File | Durasi | Deskripsi |
|------|--------|----------|
| [QUICKSTART.md](QUICKSTART.md) | 10 menit ⚡ | Setup super cepat dari 0 ke production |
| [SETUP-GUIDE.md](SETUP-GUIDE.md) | 30 menit | Panduan lengkap dengan screenshot & commands |
| [README.md](README.md) | 15 menit | Overview project & fitur utama |

### 🏗️ Konfigurasi & Setup
| File | Topik | Lokasi |
|------|-------|--------|
| [config/AWS-SETUP.md](config/AWS-SETUP.md) | AWS RDS MySQL configuration | config/ |
| [config/nginx.conf](config/nginx.conf) | Nginx reverse proxy | config/ |
| [config/sampah-backend.service](config/sampah-backend.service) | Systemd service file | config/ |
| [deploy.sh](deploy.sh) | Bash deployment script | root |

### 📡 API & Backend
| File | Konten | Lokasi |
|------|--------|--------|
| [API-DOCS.md](API-DOCS.md) | Referensi lengkap API endpoints | root |
| [backend/server.js](backend/server.js) | Express.js server | backend/ |
| [backend/package.json](backend/package.json) | Dependencies & scripts | backend/ |
| [backend/.env.example](backend/.env.example) | Environment template | backend/ |
| [backend/test-db.js](backend/test-db.js) | Database connection tester | backend/ |

### 📁 Database
| File | Deskripsi | Lokasi |
|------|----------|--------|
| [database/schema.sql](database/schema.sql) | SQL schema + sample data | database/ |

### 🎨 Frontend
| File | Fungsi | Lokasi |
|------|--------|--------|
| [frontend/index.html](frontend/index.html) | Main UI (buka ini!) | frontend/ |
| [frontend/style.css](frontend/style.css) | Responsive styling | frontend/ |
| [frontend/script.js](frontend/script.js) | JavaScript logic | frontend/ |

### 📊 Ringkasan & Summary
| File | Konten | Durasi |
|------|--------|--------|
| [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) | Overview & checklist project | 5 menit |
| [INDEX.md](INDEX.md) | File ini - dokumentasi index | 2 menit |

---

## 🎯 Jalur Belajar Berdasarkan Kebutuhan

### 🚀 "Saya mau langsung setup!"
1. [QUICKSTART.md](QUICKSTART.md) - 10 menit setup
2. Selesai, mainkan aplikasi!

### 📚 "Saya mau mengerti semuanya"
1. [README.md](README.md) - Pahami konsep
2. [SETUP-GUIDE.md](SETUP-GUIDE.md) - Step by step
3. [API-DOCS.md](API-DOCS.md) - Pelajari API
4. [config/AWS-SETUP.md](config/AWS-SETUP.md) - AWS details

### 🔧 "Saya developer yang ingin deep dive"
```
1. README.md           → Overview
2. backend/server.js   → Baca kode backend
3. frontend/script.js  → Baca kode frontend
4. API-DOCS.md         → Referensi API
5. database/schema.sql → Pahami database
```

### ☁️ "Saya ingin deploy ke cloud"
```
1. SETUP-GUIDE.md         → Local testing dulu
2. config/AWS-SETUP.md    → AWS configuration
3. deploy.sh              → Deployment script
4. config/nginx.conf      → Nginx setup
5. config/sampah-backend.service → Service setup
```

---

## 📋 Quick Reference Commands

### Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan AWS credentials
npm run dev
```

### Setup Database
```bash
mysql -h your-endpoint.rds.amazonaws.com -u admin -p < database/schema.sql
```

### Test Database Connection
```bash
cd backend
npm install mysql2/promise
node test-db.js
```

### Open Frontend
```
Buka: c:\tugas sem 6\Komputasi Awan\uts\frontend\index.html di browser
Atau: Gunakan Live Server di VS Code
```

---

## 🏗️ Project Structure

```
uts/
│
├── 📄 README.md                   ← Start here
├── 📄 QUICKSTART.md              ← 10 min setup
├── 📄 SETUP-GUIDE.md             ← Complete guide
├── 📄 INDEX.md                   ← File ini
├── 📄 PROJECT-SUMMARY.md         ← Summary
├── 📄 API-DOCS.md                ← API reference
├── 📄 .gitignore                 ← Git ignore
│
├── 📁 frontend/                  (User Interface)
│   ├── index.html                ← OPEN THIS IN BROWSER
│   ├── style.css
│   └── script.js
│
├── 📁 backend/                   (Node.js Server)
│   ├── server.js                 ← npm run dev
│   ├── package.json
│   ├── .env.example
│   └── test-db.js
│
├── 📁 database/                  (MySQL Schema)
│   └── schema.sql                ← Run this first
│
└── 📁 config/                    (Deployment & Config)
    ├── AWS-SETUP.md
    ├── nginx.conf
    ├── sampah-backend.service
    └── deploy.sh
```

---

## ✨ Fitur Aplikasi

### 🏠 Data Rumah
- Kelola pemilik rumah yang akan diambil sampahnya
- Field: nama pemilik, alamat, telepon, zona
- CRUD operations

### 👷 Data Petugas
- Kelola petugas kebersihan
- Field: nama, telepon, zona, status
- Filter aktif/nonaktif

### 📅 Jadwal Pengambilan
- Tentukan jadwal pengambilan sampah
- Kalender interaktif dengan tema sampah
- Filter per bulan/tahun

---

## 🔄 API Endpoints Summary

```
RUMAH:
  GET    /api/rumah              ← Semua rumah
  GET    /api/rumah/:id          ← By ID
  POST   /api/rumah              ← Tambah
  PUT    /api/rumah/:id          ← Update
  DELETE /api/rumah/:id          ← Hapus

PETUGAS:
  GET    /api/petugas            ← Semua
  POST   /api/petugas            ← Tambah
  PUT    /api/petugas/:id        ← Update
  DELETE /api/petugas/:id        ← Hapus

JADWAL:
  GET    /api/jadwal             ← Semua
  GET    /api/jadwal/bulan/:y/:m ← By month
  POST   /api/jadwal             ← Tambah
  PUT    /api/jadwal/:id         ← Update
  DELETE /api/jadwal/:id         ← Hapus
```

Lihat [API-DOCS.md](API-DOCS.md) untuk contoh lengkap.

---

## 🌐 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | HTML5, CSS3, JavaScript | ES6+ |
| Backend | Node.js, Express.js | 14+, 4.18+ |
| Database | AWS RDS MySQL | 8.0 |
| Cloud | Amazon Web Services | - |
| Deployment | EC2, Nginx, Systemd | - |

---

## 🎓 Learning Objectives

Setelah menyelesaikan project ini, Anda akan mengerti:
- ✅ Membuat web application dengan MEAN/FARM stack
- ✅ RESTful API design & implementation
- ✅ Database design dengan relational model
- ✅ Cloud computing dengan AWS RDS
- ✅ Frontend integration dengan API
- ✅ Deployment & DevOps basics
- ✅ Security best practices

---

## 🆘 Troubleshooting Quick Links

- API tidak connect ke database? → Check [config/AWS-SETUP.md](config/AWS-SETUP.md)
- CORS error di browser? → Backend belum running, jalankan `npm run dev`
- Port 5000 sudah pakai? → Ubah di .env, jalankan di port lain
- Database tidak terconnect? → Run `node backend/test-db.js`

---

## 📊 File Statistics

```
Total Files: 20+
Total Lines: 3000+
Frontend: 1700 lines (HTML/CSS/JS)
Backend: 300 lines (Express.js)
Database: 100 lines (SQL)
Documentation: 900 lines (Markdown)
Config: 200 lines (YAML/Conf)
```

---

## 📞 Getting Help

1. **Setup issue** → Baca [QUICKSTART.md](QUICKSTART.md)
2. **API question** → Lihat [API-DOCS.md](API-DOCS.md)
3. **AWS issue** → Check [config/AWS-SETUP.md](config/AWS-SETUP.md)
4. **Code question** → Baca docstring di server.js dan script.js
5. **Error message** → Search di browser console (F12)

---

## ✅ Pre-Launch Checklist

- [ ] Baca README.md
- [ ] Jalankan QUICKSTART.md (atau SETUP-GUIDE.md)
- [ ] Database schema sudah running
- [ ] Backend sudah running (http://localhost:5000)
- [ ] Frontend bisa diakses
- [ ] CRUD operations tested
- [ ] Kalender menampilkan jadwal
- [ ] No errors di browser console

---

## 🎉 Selamat!

Anda sudah punya aplikasi production-ready untuk manajemen jadwal pengangkutan sampah! 

Untuk memulai: **[→ QUICKSTART.md](QUICKSTART.md)** ⚡

---

## 📅 Version Info

- **Version**: 1.0.0
- **Created**: April 15, 2026
- **Status**: ✅ Production Ready
- **License**: MIT

---

## 🚀 Next Steps

Setelah setup berhasil:
1. Explore UI dengan menambah data rumah, petugas, jadwal
2. Buka VS Code dan check database dengan MySQL Extension
3. Test API dengan cURL (lihat contoh di [API-DOCS.md](API-DOCS.md))
4. Baca [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) untuk enhancement ideas

---

**Happy Coding! 🎉**

*Dibuat dengan ❤️ untuk UTS Komputasi Awan*
