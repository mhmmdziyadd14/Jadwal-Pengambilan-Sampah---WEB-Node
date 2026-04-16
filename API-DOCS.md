# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Saat ini, API tidak menggunakan autentikasi. Untuk production, tambahkan JWT atau API Key.

---

## 1️⃣ RUMAH (Pemilik)

### GET - Dapatkan Semua Rumah
```
GET /api/rumah

Response (200 OK):
[
  {
    "id_rumah": 1,
    "nama_pemilik": "Budi Santoso",
    "alamat": "Jl. Merdeka No. 123, Jakarta",
    "nomor_telepon": "081234567890",
    "zona_pengambilan": "Zona A",
    "created_at": "2026-04-15T10:30:00.000Z",
    "updated_at": "2026-04-15T10:30:00.000Z"
  }
]
```

### GET - Dapatkan Rumah by ID
```
GET /api/rumah/:id

Example: GET /api/rumah/1

Response (200 OK):
{
  "id_rumah": 1,
  "nama_pemilik": "Budi Santoso",
  "alamat": "Jl. Merdeka No. 123, Jakarta",
  "nomor_telepon": "081234567890",
  "zona_pengambilan": "Zona A",
  "created_at": "2026-04-15T10:30:00.000Z",
  "updated_at": "2026-04-15T10:30:00.000Z"
}

Response (404 Not Found):
{
  "error": "Rumah tidak ditemukan"
}
```

### POST - Tambah Rumah Baru
```
POST /api/rumah
Content-Type: application/json

Request Body:
{
  "nama_pemilik": "Siti Nurhaliza",
  "alamat": "Jl. Ahmad Yani No. 456, Bandung",
  "nomor_telepon": "082345678901",
  "zona_pengambilan": "Zona B"
}

Response (201 Created):
{
  "id_rumah": 4,
  "nama_pemilik": "Siti Nurhaliza",
  "alamat": "Jl. Ahmad Yani No. 456, Bandung",
  "nomor_telepon": "082345678901",
  "zona_pengambilan": "Zona B"
}
```

### PUT - Update Rumah
```
PUT /api/rumah/:id
Content-Type: application/json

Example: PUT /api/rumah/1

Request Body:
{
  "nama_pemilik": "Budi Santoso Updated",
  "alamat": "Jl. Merdeka No. 123A, Jakarta",
  "nomor_telepon": "081234567890",
  "zona_pengambilan": "Zona A"
}

Response (200 OK):
{
  "message": "Rumah berhasil diupdate"
}
```

### DELETE - Hapus Rumah
```
DELETE /api/rumah/:id

Example: DELETE /api/rumah/1

Response (200 OK):
{
  "message": "Rumah berhasil dihapus"
}

Response (404 Not Found):
{
  "error": "Rumah tidak ditemukan"
}
```

---

## 2️⃣ PETUGAS (Kebersihan)

### GET - Dapatkan Semua Petugas
```
GET /api/petugas

Response (200 OK):
[
  {
    "id_petugas": 1,
    "nama_petugas": "Rinto Harahap",
    "nomor_telepon": "081111111111",
    "zona_wilayah": "Zona A",
    "status": "aktif",
    "created_at": "2026-04-15T10:30:00.000Z",
    "updated_at": "2026-04-15T10:30:00.000Z"
  }
]
```

### POST - Tambah Petugas
```
POST /api/petugas
Content-Type: application/json

Request Body:
{
  "nama_petugas": "Ahmad Wijaya",
  "nomor_telepon": "083456789012",
  "zona_wilayah": "Zona C",
  "status": "aktif"
}

Response (201 Created):
{
  "id_petugas": 4,
  "nama_petugas": "Ahmad Wijaya",
  "nomor_telepon": "083456789012",
  "zona_wilayah": "Zona C",
  "status": "aktif"
}
```

### PUT - Update Petugas
```
PUT /api/petugas/:id
Content-Type: application/json

Example: PUT /api/petugas/1

Request Body:
{
  "nama_petugas": "Rinto Harahap",
  "nomor_telepon": "081111111111",
  "zona_wilayah": "Zona A",
  "status": "nonaktif"
}

Response (200 OK):
{
  "message": "Petugas berhasil diupdate"
}
```

### DELETE - Hapus Petugas
```
DELETE /api/petugas/:id

Example: DELETE /api/petugas/1

Response (200 OK):
{
  "message": "Petugas berhasil dihapus"
}
```

---

## 3️⃣ JADWAL (Pengambilan)

### GET - Dapatkan Semua Jadwal
```
GET /api/jadwal

Response (200 OK):
[
  {
    "id_jadwal": 1,
    "id_rumah": 1,
    "id_petugas": 1,
    "tanggal_pengambilan": "2026-04-15",
    "keterangan": "Pengambilan rutin",
    "nama_pemilik": "Budi Santoso",
    "alamat": "Jl. Merdeka No. 123, Jakarta",
    "nama_petugas": "Rinto Harahap",
    "created_at": "2026-04-15T10:30:00.000Z",
    "updated_at": "2026-04-15T10:30:00.000Z"
  }
]
```

### GET - Dapatkan Jadwal by Bulan
```
GET /api/jadwal/bulan/:tahun/:bulan

Example: GET /api/jadwal/bulan/2026/4

Response (200 OK):
[
  {
    "id_jadwal": 1,
    "id_rumah": 1,
    "id_petugas": 1,
    "tanggal_pengambilan": "2026-04-15",
    "keterangan": "Pengambilan rutin",
    "nama_pemilik": "Budi Santoso",
    "alamat": "Jl. Merdeka No. 123, Jakarta",
    "nama_petugas": "Rinto Harahap",
    "created_at": "2026-04-15T10:30:00.000Z",
    "updated_at": "2026-04-15T10:30:00.000Z"
  }
]
```

### POST - Tambah Jadwal
```
POST /api/jadwal
Content-Type: application/json

Request Body:
{
  "id_rumah": 2,
  "id_petugas": 2,
  "tanggal_pengambilan": "2026-04-16",
  "keterangan": "Pengambilan rutin"
}

Response (201 Created):
{
  "id_jadwal": 4,
  "id_rumah": 2,
  "id_petugas": 2,
  "tanggal_pengambilan": "2026-04-16",
  "keterangan": "Pengambilan rutin"
}
```

### PUT - Update Jadwal
```
PUT /api/jadwal/:id
Content-Type: application/json

Example: PUT /api/jadwal/1

Request Body:
{
  "id_rumah": 1,
  "id_petugas": 2,
  "tanggal_pengambilan": "2026-04-17",
  "keterangan": "Pengambilan rutin (diubah)"
}

Response (200 OK):
{
  "message": "Jadwal berhasil diupdate"
}
```

### DELETE - Hapus Jadwal
```
DELETE /api/jadwal/:id

Example: DELETE /api/jadwal/1

Response (200 OK):
{
  "message": "Jadwal berhasil dihapus"
}
```

---

## 4️⃣ HEALTH CHECK

### GET - Server Status
```
GET /api/health

Response (200 OK):
{
  "status": "Backend berjalan dengan baik"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Required field missing"
}
```

### 404 Not Found
```json
{
  "error": "Resource tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "error": "Database connection failed"
}
```

---

## Contoh Request dengan cURL

### Tambah Rumah
```bash
curl -X POST http://localhost:5000/api/rumah \
  -H "Content-Type: application/json" \
  -d '{
    "nama_pemilik": "Rina Suryanto",
    "alamat": "Jl. Gatot Subroto, Surabaya",
    "nomor_telepon": "085555555555",
    "zona_pengambilan": "Zona B"
  }'
```

### Dapatkan Semua Rumah
```bash
curl http://localhost:5000/api/rumah
```

### Update Rumah
```bash
curl -X PUT http://localhost:5000/api/rumah/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nama_pemilik": "Budi Santoso",
    "alamat": "Jl. Merdeka No. 123 A, Jakarta",
    "nomor_telepon": "081234567890",
    "zona_pengambilan": "Zona A"
  }'
```

### Hapus Rumah
```bash
curl -X DELETE http://localhost:5000/api/rumah/1
```

### Get Jadwal Bulan April 2026
```bash
curl http://localhost:5000/api/jadwal/bulan/2026/4
```

---

## Rate Limiting (Future Enhancement)

Belum diimplementasikan. Untuk production, tambahkan:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Pagination (Future Enhancement)

Untuk dataset besar, tambahkan pagination:
```
GET /api/rumah?page=1&limit=10
```

---

**Documentation Version:** 1.0
**Last Updated:** April 2026
