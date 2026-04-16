-- Buat Database
CREATE DATABASE IF NOT EXISTS `sampah-db`;
USE `sampah-db`;

-- Tabel Rumah (Data Pemilik)
CREATE TABLE IF NOT EXISTS rumah (
  id_rumah INT PRIMARY KEY AUTO_INCREMENT,
  nama_pemilik VARCHAR(100) NOT NULL,
  alamat VARCHAR(255) NOT NULL,
  nomor_telepon VARCHAR(15),
  zona_pengambilan VARCHAR(50),
  foto_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Petugas Kebersihan
CREATE TABLE IF NOT EXISTS petugas (
  id_petugas INT PRIMARY KEY AUTO_INCREMENT,
  nama_petugas VARCHAR(100) NOT NULL,
  nomor_telepon VARCHAR(15),
  zona_wilayah VARCHAR(50),
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  foto_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Jadwal Pengambilan
CREATE TABLE IF NOT EXISTS jadwal (
  id_jadwal INT PRIMARY KEY AUTO_INCREMENT,
  id_rumah INT NOT NULL,
  id_petugas INT NOT NULL,
  tanggal_pengambilan DATE NOT NULL,
  keterangan VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_rumah) REFERENCES rumah(id_rumah) ON DELETE CASCADE,
  FOREIGN KEY (id_petugas) REFERENCES petugas(id_petugas) ON DELETE CASCADE
);

-- Index untuk performa query
CREATE INDEX idx_jadwal_tanggal ON jadwal(tanggal_pengambilan);
CREATE INDEX idx_jadwal_rumah ON jadwal(id_rumah);
CREATE INDEX idx_jadwal_petugas ON jadwal(id_petugas);
CREATE INDEX idx_rumah_zona ON rumah(zona_pengambilan);
CREATE INDEX idx_petugas_zona ON petugas(zona_wilayah);

-- Sample Data Rumah
INSERT INTO rumah (nama_pemilik, alamat, nomor_telepon, zona_pengambilan) VALUES
('Budi Santoso', 'Jl. Merdeka No. 123, Jakarta', '081234567890', 'Zona A'),
('Siti Nurhaliza', 'Jl. Ahmad Yani No. 456, Bandung', '082345678901', 'Zona B'),
('Ahmad Wijaya', 'Jl. Sudirman No. 789, Surabaya', '083456789012', 'Zona C');

-- Sample Data Petugas
INSERT INTO petugas (nama_petugas, nomor_telepon, zona_wilayah, status) VALUES
('Rinto Harahap', '081111111111', 'Zona A', 'aktif'),
('Bambang Irawan', '082222222222', 'Zona B', 'aktif'),
('Cecep Subagja', '083333333333', 'Zona C', 'aktif');

-- Sample Data Jadwal
INSERT INTO jadwal (id_rumah, id_petugas, tanggal_pengambilan, keterangan) VALUES
(1, 1, '2026-04-15', 'Pengambilan rutin'),
(2, 2, '2026-04-15', 'Pengambilan rutin'),
(3, 3, '2026-04-16', 'Pengambilan rutin');
