# AWS S3 Setup Guide untuk Upload Foto

## Fitur Foto Upload

Sistem Manajemen Sampah sekarang dilengkapi dengan fitur upload foto untuk:
- 📸 Foto Rumah/Pemilik
- 📸 Foto Petugas Kebersihan

Foto disimpan di AWS S3 bucket untuk dapat diakses dari mana saja.

---

## Prerequisites

- AWS Account aktif
- AWS CLI terinstall (opsional)
- AWS Access Key ID
- AWS Secret Access Key

---

## Step 1: Buat S3 Bucket di AWS Console

```
1. Buka https://console.aws.amazon.com/s3
2. Klik "Create Bucket"
3. Konfigurasi:
   - Bucket name: sampah-scheduler-photos (atau nama unik lainnya)
   - Region: ap-southeast-1 (sesuaikan dengan region Anda)
   - Block Public Access: Uncheck "Block all public access"
     (Agar foto bisa diakses public)
4. Klik "Create Bucket"
```

---

## Step 2: Konfigurasi Permission Bucket

```
1. Pilih bucket yang baru dibuat
2. Buka tab "Permissions"
3. Scroll ke "Bucket Policy" dan Edit
4. Paste policy berikut:

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sampah-scheduler-photos/*"
    }
  ]
}

5. Klik "Save changes"
6. Buka tab "CORS"
7. Edit CORS Configuration, paste:

[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3000
  }
]

8. Klik "Save changes"
```

---

## Step 3: Create IAM User untuk S3 Access

```
1. Buka https://console.aws.amazon.com/iam
2. Pilih "Users" → "Create User"
3. Username: sampah-scheduler-app
4. Klik "Next" → "Attach policies directly"
5. Search dan pilih: AmazonS3FullAccess
6. Klik "Create User"
7. Pilih user yang baru dibuat
8. Tab "Security credentials" → "Create access key"
9. Pilih "Application running outside AWS"
10. Catat:
    - Access Key ID
    - Secret Access Key (hanya ditampilkan sekali!)
```

---

## Step 4: Update .env Backend

Edit file `backend/.env` dengan credentials dari Step 3:

```env
# Existing configs...
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sampah-db
DB_PORT=3306
PORT=5000
NODE_ENV=development

# AWS Configuration
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=AKIA*************  # dari Step 3
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY  # dari Step 3

# AWS S3 Configuration
AWS_BUCKET_NAME=sampah-scheduler-photos  # nama bucket dari Step 1
```

---

## Step 5: Update Database Schema

Jalankan SQL query untuk add kolom `foto_url`:

```sql
-- Untuk tabel rumah
ALTER TABLE rumah ADD COLUMN foto_url VARCHAR(500) AFTER zona_pengambilan;

-- Untuk tabel petugas
ALTER TABLE petugas ADD COLUMN foto_url VARCHAR(500) AFTER status;
```

Atau gunakan file `database/schema.sql` yang sudah diupdate.

---

## Step 6: Test Upload Foto

### Via Frontend

1. Buka aplikasi di browser
2. Tab "Data Rumah" atau "Data Petugas"
3. Klik "+ Tambah Rumah" atau "+ Tambah Petugas"
4. Isi form dan upload foto di field "📸 Upload Foto"
5. Klik "Simpan"
6. Foto akan ter-upload ke S3 dan namenya muncul di tabel

### Via API (curl)

```bash
# Upload foto saat tambah rumah
curl -X POST http://localhost:5000/api/rumah \
  -F "nama_pemilik=Budi" \
  -F "alamat=Jl. Merdeka 123" \
  -F "nomor_telepon=081234567890" \
  -F "zona_pengambilan=Zona A" \
  -F "foto=@/path/to/photo.jpg"

# Response:
{
  "id_rumah": 1,
  "nama_pemilik": "Budi",
  "alamat": "Jl. Merdeka 123",
  "nomor_telepon": "081234567890",
  "zona_pengambilan": "Zona A",
  "foto_url": "https://sampah-scheduler-photos.s3.ap-southeast-1.amazonaws.com/rumah/uuid-photo.jpg"
}
```

---

## Troubleshooting

### Error: "Access Denied" saat upload

**Solusi:**
1. Cek AWS_ACCESS_KEY_ID dan AWS_SECRET_ACCESS_KEY di .env
2. Pastikan IAM user punya AmazonS3FullAccess policy
3. Pastikan region di .env sesuai dengan bucket region

### Foto tidak tampil di tabel

**Solusi:**
1. Cek foto_url di database (`SELECT * FROM rumah`)
2. Pastikan URL bisa diakses di browser
3. Cek CORS settings bucket sudah dikonfigurasi

### Error: "Bucket not found"

**Solusi:**
1. Cek AWS_BUCKET_NAME di .env sudah benar
2. Pastikan bucket sudah dibuat di region yang benar
3. Cek IAM user punya akses ke bucket tersebut

---

## Fallback: Upload Local (Tanpa S3)

Jika tidak punya AWS account, sistem bisa fallback ke local storage:

```env
# Kosongkan AWS_BUCKET_NAME saja
AWS_BUCKET_NAME=

# Foto akan disimpan di: backend/uploads/rumah/ atau backend/uploads/petugas/
```

Tapi cara ini hanya cocok untuk development, bukan production.

---

## File Extensions & Limits

**Format yang diizinkan:**
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ GIF (.gif)
- ✅ WebP (.webp)

**Size Limit:** 5MB per file

---

## Dokumentasi Lengkap

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS IAM Documentation](https://docs.aws.amazon.com/iam/)
- [Multer Documentation](https://expressjs.com/en/resources/middleware/multer.html)
