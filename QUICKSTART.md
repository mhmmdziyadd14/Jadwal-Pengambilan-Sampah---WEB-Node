# Quick Start Guide

## ⚡ Setup Cepat (10 menit)

### Tahap 1: AWS RDS Setup (5 menit)
```
1. Buka https://console.aws.amazon.com
2. Search "RDS" → Databases → Create Database
3. Select MySQL
4. Configuration:
   - Instance: db.t3.micro (free tier)
   - Username: admin
   - Password: SampauDB2026! (pilih password kuat)
5. Create → Tunggu 5-10 menit
```

### Tahap 2: Database Setup
Setelah RDS ready, catat **Endpoint** (misal: `sampah-db-01.abc123.ap-southeast-1.rds.amazonaws.com`)

```bash
# Connect ke MySQL dan jalankan SQL
mysql -h sampah-db-01.abc123.ap-southeast-1.rds.amazonaws.com -u admin -p

# Paste isi file: database/schema.sql
```

### Tahap 3: Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "DB_HOST=sampah-db-01.abc123.ap-southeast-1.rds.amazonaws.com" > .env
echo "DB_USER=admin" >> .env
echo "DB_PASSWORD=SampauDB2026!" >> .env
echo "DB_NAME=sampah-db" >> .env
echo "DB_PORT=3306" >> .env
echo "PORT=5000" >> .env

# Run server
npm run dev
```

### Tahap 4: Frontend
```
1. Buka folder `frontend/`
2. Open `index.html` dengan browser
3. Atau gunakan Live Server di VS Code
```

## 🔧 File Structure

```
uts/
├── frontend/
│   ├── index.html          ← Buka ini di browser
│   ├── style.css
│   └── script.js
├── backend/
│   ├── server.js           ← Node.js backend
│   ├── package.json
│   └── .env               ← Config AWS
├── database/
│   └── schema.sql         ← Database schema
├── config/
│   └── AWS-SETUP.md
└── README.md
```

## 📝 Form Input Examples

### Tambah Rumah
```
Nama Pemilik: Budi Santoso
Alamat: Jl. Merdeka No. 123, Jakarta
Telepon: 081234567890
Zona: Zona A
```

### Tambah Petugas
```
Nama: Rinto Harahap
Telepon: 081111111111
Zona Wilayah: Zona A
Status: Aktif
```

### Tambah Jadwal
```
Rumah: Budi Santoso - Jl. Merdeka No. 123, Jakarta
Petugas: Rinto Harahap
Tanggal: 2026-04-15
Keterangan: Pengambilan rutin
```

## ✅ Checklist

- [ ] AWS Account created
- [ ] RDS MySQL instance running
- [ ] Endpoint noted
- [ ] Database schema executed
- [ ] .env file configured
- [ ] npm install completed
- [ ] Backend running (http://localhost:5000)
- [ ] Frontend accessible
- [ ] CRUD operations working

## 🆘 Emergency Fixes

**Jika database tidak connect:**
```bash
# Test connection
mysql -h your-endpoint.rds.amazonaws.com -u admin -p

# Check .env file
cat .env

# Verify endpoint dari AWS console
```

**Jika port 5000 sudah dipakai:**
```bash
# Change port di .env
PORT=3001

# Restart backend
npm run dev
```

**Jika frontend tidak load data:**
```
1. Open DevTools (F12)
2. Check Console untuk errors
3. Check Network tab untuk API calls
4. Pastikan backend running
```

## 📞 Support

Untuk error lebih detail, check:
- Backend console output
- Browser DevTools (F12)
- AWS RDS Event Logs
- MySQL error logs

---

**Start Building! 🚀**
