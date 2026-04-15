-- SQL Script untuk membuat tabel inspeksi_lapangan di Azure SQL Database
-- Jalankan script ini di Azure SQL Database Anda

CREATE TABLE inspeksi_lapangan (
  id INT PRIMARY KEY IDENTITY(1,1),
  lokasi VARCHAR(255) NOT NULL,
  tanggal DATETIME NOT NULL,
  penginspeksi VARCHAR(255) NOT NULL,
  kategori VARCHAR(50) NOT NULL,
  deskripsi VARCHAR(MAX),
  created_at DATETIME NOT NULL DEFAULT GETDATE(),
  updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

-- Create index untuk query yang lebih cepat
CREATE INDEX idx_tanggal ON inspeksi_lapangan(tanggal);
CREATE INDEX idx_kategori ON inspeksi_lapangan(kategori);
CREATE INDEX idx_penginspeksi ON inspeksi_lapangan(penginspeksi);

-- (Optional) Trigger untuk auto-update updated_at
CREATE TRIGGER tr_inspeksi_updated
ON inspeksi_lapangan
AFTER UPDATE
AS
BEGIN
  UPDATE inspeksi_lapangan
  SET updated_at = GETDATE()
  WHERE id IN (SELECT id FROM inserted);
END;
