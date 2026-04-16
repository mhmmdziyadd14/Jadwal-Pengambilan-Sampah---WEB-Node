const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const mysql = require('mysql2/promise');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-southeast-1'
});

// Multer configuration untuk temporary storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan (JPEG, PNG, GIF, WebP)'));
    }
  }
});

// Helper function untuk upload ke S3
const uploadToS3 = async (file, folder) => {
  if (!file) return null;
  if (!process.env.AWS_BUCKET_NAME) {
    console.warn('AWS_BUCKET_NAME tidak dikonfigurasi, menggunakan local path');
    return `/uploads/${folder}/${uuidv4()}-${file.originalname}`;
  }

  const fileName = `${folder}/${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return null;
  }
};

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection().then(connection => {
  console.log('✓ Terhubung ke Database AWS RDS');
  connection.release();
}).catch(err => {
  console.error('✗ Gagal terhubung ke Database:', err.message);
});

// ==================== ROUTES - RUMAH ====================
// GET semua rumah
app.get('/api/rumah', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM rumah ORDER BY id_rumah DESC');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET rumah by ID
app.get('/api/rumah/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM rumah WHERE id_rumah = ?', [req.params.id]);
    connection.release();
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Rumah tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST tambah rumah
app.post('/api/rumah', upload.single('foto'), async (req, res) => {
  try {
    const { nama_pemilik, alamat, nomor_telepon, zona_pengambilan } = req.body;
    let foto_url = null;

    // Upload foto ke S3 jika ada
    if (req.file) {
      foto_url = await uploadToS3(req.file, 'rumah');
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO rumah (nama_pemilik, alamat, nomor_telepon, zona_pengambilan, foto_url, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [nama_pemilik, alamat, nomor_telepon, zona_pengambilan, foto_url]
    );
    connection.release();
    res.status(201).json({ 
      id_rumah: result.insertId, 
      nama_pemilik, 
      alamat, 
      nomor_telepon, 
      zona_pengambilan,
      foto_url
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update rumah
app.put('/api/rumah/:id', upload.single('foto'), async (req, res) => {
  try {
    const { nama_pemilik, alamat, nomor_telepon, zona_pengambilan } = req.body;
    let foto_url = req.body.foto_url; // Keep existing foto if not uploading new one

    // Upload foto baru ke S3 jika ada
    if (req.file) {
      foto_url = await uploadToS3(req.file, 'rumah');
    }

    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE rumah SET nama_pemilik = ?, alamat = ?, nomor_telepon = ?, zona_pengambilan = ?, foto_url = ?, updated_at = NOW() WHERE id_rumah = ?',
      [nama_pemilik, alamat, nomor_telepon, zona_pengambilan, foto_url, req.params.id]
    );
    connection.release();
    res.json({ message: 'Rumah berhasil diupdate' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE rumah
app.delete('/api/rumah/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM rumah WHERE id_rumah = ?', [req.params.id]);
    connection.release();
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Rumah tidak ditemukan' });
    }
    res.json({ message: 'Rumah berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROUTES - PETUGAS ====================
// GET semua petugas
app.get('/api/petugas', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM petugas ORDER BY id_petugas DESC');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST tambah petugas
app.post('/api/petugas', upload.single('foto'), async (req, res) => {
  try {
    const { nama_petugas, nomor_telepon, zona_wilayah, status } = req.body;
    let foto_url = null;

    // Upload foto ke S3 jika ada
    if (req.file) {
      foto_url = await uploadToS3(req.file, 'petugas');
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO petugas (nama_petugas, nomor_telepon, zona_wilayah, status, foto_url, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [nama_petugas, nomor_telepon, zona_wilayah, status || 'aktif', foto_url]
    );
    connection.release();
    res.status(201).json({ 
      id_petugas: result.insertId, 
      nama_petugas, 
      nomor_telepon, 
      zona_wilayah,
      status: status || 'aktif',
      foto_url
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update petugas
app.put('/api/petugas/:id', upload.single('foto'), async (req, res) => {
  try {
    const { nama_petugas, nomor_telepon, zona_wilayah, status } = req.body;
    let foto_url = req.body.foto_url; // Keep existing foto if not uploading new one

    // Upload foto baru ke S3 jika ada
    if (req.file) {
      foto_url = await uploadToS3(req.file, 'petugas');
    }

    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE petugas SET nama_petugas = ?, nomor_telepon = ?, zona_wilayah = ?, status = ?, foto_url = ?, updated_at = NOW() WHERE id_petugas = ?',
      [nama_petugas, nomor_telepon, zona_wilayah, status, foto_url, req.params.id]
    );
    connection.release();
    res.json({ message: 'Petugas berhasil diupdate' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE petugas
app.delete('/api/petugas/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM petugas WHERE id_petugas = ?', [req.params.id]);
    connection.release();
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Petugas tidak ditemukan' });
    }
    res.json({ message: 'Petugas berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROUTES - JADWAL ====================
// GET semua jadwal
app.get('/api/jadwal', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT j.*, r.nama_pemilik, r.alamat, p.nama_petugas 
      FROM jadwal j
      LEFT JOIN rumah r ON j.id_rumah = r.id_rumah
      LEFT JOIN petugas p ON j.id_petugas = p.id_petugas
      ORDER BY j.tanggal_pengambilan DESC
    `);
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET jadwal by bulan
app.get('/api/jadwal/bulan/:tahun/:bulan', async (req, res) => {
  try {
    const { tahun, bulan } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT j.*, r.nama_pemilik, r.alamat, p.nama_petugas 
      FROM jadwal j
      LEFT JOIN rumah r ON j.id_rumah = r.id_rumah
      LEFT JOIN petugas p ON j.id_petugas = p.id_petugas
      WHERE YEAR(j.tanggal_pengambilan) = ? AND MONTH(j.tanggal_pengambilan) = ?
      ORDER BY j.tanggal_pengambilan ASC
    `, [tahun, bulan]);
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST tambah jadwal
app.post('/api/jadwal', async (req, res) => {
  try {
    const { id_rumah, id_petugas, tanggal_pengambilan, keterangan } = req.body;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO jadwal (id_rumah, id_petugas, tanggal_pengambilan, keterangan, created_at) VALUES (?, ?, ?, ?, NOW())',
      [id_rumah, id_petugas, tanggal_pengambilan, keterangan || '']
    );
    connection.release();
    res.status(201).json({ 
      id_jadwal: result.insertId, 
      id_rumah, 
      id_petugas, 
      tanggal_pengambilan,
      keterangan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update jadwal
app.put('/api/jadwal/:id', async (req, res) => {
  try {
    const { id_rumah, id_petugas, tanggal_pengambilan, keterangan } = req.body;
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE jadwal SET id_rumah = ?, id_petugas = ?, tanggal_pengambilan = ?, keterangan = ?, updated_at = NOW() WHERE id_jadwal = ?',
      [id_rumah, id_petugas, tanggal_pengambilan, keterangan, req.params.id]
    );
    connection.release();
    res.json({ message: 'Jadwal berhasil diupdate' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE jadwal
app.delete('/api/jadwal/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM jadwal WHERE id_jadwal = ?', [req.params.id]);
    connection.release();
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    }
    res.json({ message: 'Jadwal berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend berjalan dengan baik' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
