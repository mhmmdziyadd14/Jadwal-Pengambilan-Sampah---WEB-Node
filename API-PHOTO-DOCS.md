# API Documentation - Foto Upload Features

## Overview

Semua endpoint untuk RUMAH dan PETUGAS sekarang support upload foto ke AWS S3.

---

## Rumah (Houses) Endpoints

### 1. POST /api/rumah - Create House with Photo

**Request:**
```
Method: POST
Content-Type: multipart/form-data
```

**Parameters:**
- `nama_pemilik` (string, required) - Nama pemilik rumah
- `alamat` (string, required) - Alamat rumah  
- `nomor_telepon` (string, required) - Nomor telepon pemilik
- `zona_pengambilan` (string, required) - Zona pengambilan (Zona A/B/C)
- `foto` (file, optional) - File foto (max 5MB, format: JPEG, PNG, GIF, WebP)

**Example with cURL:**
```bash
curl -X POST http://localhost:5000/api/rumah \
  -F "nama_pemilik=Budi Santoso" \
  -F "alamat=Jl. Merdeka No. 123, Jakarta" \
  -F "nomor_telepon=081234567890" \
  -F "zona_pengambilan=Zona A" \
  -F "foto=@path/to/photo.jpg"
```

**Response (Success):**
```json
{
  "id_rumah": 1,
  "nama_pemilik": "Budi Santoso",
  "alamat": "Jl. Merdeka No. 123, Jakarta",
  "nomor_telepon": "081234567890",
  "zona_pengambilan": "Zona A",
  "foto_url": "https://sampah-scheduler-photos.s3.ap-southeast-1.amazonaws.com/rumah/uuid-filename.jpg"
}
```

**Status Code:** 201 Created

---

### 2. GET /api/rumah - Get All Houses

**Request:**
```
Method: GET
```

**Response:**
```json
[
  {
    "id_rumah": 1,
    "nama_pemilik": "Budi Santoso",
    "alamat": "Jl. Merdeka No. 123, Jakarta",
    "nomor_telepon": "081234567890",
    "zona_pengambilan": "Zona A",
    "foto_url": "https://sampah-scheduler-photos.s3.ap-southeast-1.amazonaws.com/rumah/uuid-filename.jpg",
    "created_at": "2026-04-15T10:30:00.000Z",
    "updated_at": "2026-04-15T10:30:00.000Z"
  }
]
```

---

### 3. GET /api/rumah/:id - Get House by ID

**Request:**
```
Method: GET
```

**Response:** Single house object (same as GET /api/rumah)

---

### 4. PUT /api/rumah/:id - Update House with Photo

**Request:**
```
Method: PUT
Content-Type: multipart/form-data
```

**Parameters:** Same as POST /api/rumah

**Notes:**
- Jika upload foto baru, foto lama di S3 tidak otomatis dihapus
- Jika tidak upload foto, foto lama tetap disimpan

**Response (Success):**
```json
{
  "message": "Rumah berhasil diupdate"
}
```

**Status Code:** 200 OK

---

### 5. DELETE /api/rumah/:id - Delete House

**Request:**
```
Method: DELETE
```

**Response:**
```json
{
  "message": "Rumah berhasil dihapus"
}
```

---

## Petugas (Officers) Endpoints

### 1. POST /api/petugas - Create Officer with Photo

**Request:**
```
Method: POST
Content-Type: multipart/form-data
```

**Parameters:**
- `nama_petugas` (string, required) - Nama petugas
- `nomor_telepon` (string, required) - Nomor telepon
- `zona_wilayah` (string, required) - Zona wilayah (Zona A/B/C)
- `status` (enum, optional) - Status (aktif/nonaktif), default: aktif
- `foto` (file, optional) - File foto (max 5MB, format: JPEG, PNG, GIF, WebP)

**Example:**
```bash
curl -X POST http://localhost:5000/api/petugas \
  -F "nama_petugas=Rinto Harahap" \
  -F "nomor_telepon=081111111111" \
  -F "zona_wilayah=Zona A" \
  -F "status=aktif" \
  -F "foto=@path/to/photo.jpg"
```

**Response:**
```json
{
  "id_petugas": 1,
  "nama_petugas": "Rinto Harahap",
  "nomor_telepon": "081111111111",
  "zona_wilayah": "Zona A",
  "status": "aktif",
  "foto_url": "https://sampah-scheduler-photos.s3.ap-southeast-1.amazonaws.com/petugas/uuid-filename.jpg"
}
```

---

### 2. GET /api/petugas - Get All Officers

**Response:**
```json
[
  {
    "id_petugas": 1,
    "nama_petugas": "Rinto Harahap",
    "nomor_telepon": "081111111111",
    "zona_wilayah": "Zona A",
    "status": "aktif",
    "foto_url": "https://sampah-scheduler-photos.s3.ap-southeast-1.amazonaws.com/petugas/uuid-filename.jpg",
    "created_at": "2026-04-15T10:30:00.000Z",
    "updated_at": "2026-04-15T10:30:00.000Z"
  }
]
```

---

### 3. PUT /api/petugas/:id - Update Officer with Photo

**Parameters:** Same as POST /api/petugas

**Notes:** Same as rumah update

---

### 4. DELETE /api/petugas/:id - Delete Officer

Same as DELETE rumah

---

## Jadwal (Schedule) Endpoints

Endpoint untuk jadwal tidak berubah, tetap gunakan endpoint original.

---

## Error Handling

### 400 Bad Request
```json
{
  "error": "Hanya file gambar yang diizinkan (JPEG, PNG, GIF, WebP)"
}
```

### 413 Payload Too Large
- File size > 5MB
- Error: "413 Payload Too Large"

### 404 Not Found
```json
{
  "error": "Rumah tidak ditemukan"
}
```

### 500 Internal Server Error
- Database connection failed
- S3 upload failed
- Server error

---

## File Upload Best Practices

1. **Validasi client-side:**
   - Cek file type sebelum upload
   - Cek file size < 5MB

2. **Validasi server-side:**
   - Sudah dilakukan di backend
   - Mime type check
   - Size limit check

3. **Performance:**
   - Gunakan compressed images
   - WebP format recommended (smaller file size)
   - Max resolution: 2000x2000 pixels

---

## Frontend Integration

### JavaScript FormData Example

```javascript
async function uploadRumahWithPhoto(rumahData, photoFile) {
  const formData = new FormData();
  formData.append('nama_pemilik', rumahData.nama_pemilik);
  formData.append('alamat', rumahData.alamat);
  formData.append('nomor_telepon', rumahData.nomor_telepon);
  formData.append('zona_pengambilan', rumahData.zona_pengambilan);
  
  if (photoFile) {
    formData.append('foto', photoFile);
  }

  const response = await fetch('http://localhost:5000/api/rumah', {
    method: 'POST',
    body: formData  // Jangan set Content-Type header
  });

  return response.json();
}
```

---

## Changelog

### v2.0.0 - Photo Upload Feature
- ✅ Added `foto_url` column to rumah table
- ✅ Added `foto_url` column to petugas table
- ✅ Integrated AWS S3 for file storage
- ✅ Added multer middleware for form-data handling
- ✅ Photo preview in frontend tables
- ✅ Fallback to local storage if S3 not configured
