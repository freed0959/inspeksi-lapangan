-- ===== ALTER TABLE untuk Photos =====
-- Jalankan script ini di Azure SQL Database

-- 1. Buat table untuk photos
CREATE TABLE inspeksi_fotos (
  id INT PRIMARY KEY IDENTITY(1,1),
  inspeksi_id INT NOT NULL,
  foto_data VARBINARY(MAX) NOT NULL,
  foto_nama VARCHAR(255) NOT NULL,
  foto_tipe VARCHAR(50) NOT NULL,
  foto_ukuran INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT GETDATE(),
  FOREIGN KEY (inspeksi_id) REFERENCES inspeksi_lapangan(id) ON DELETE CASCADE
);

-- 2. Create index
CREATE INDEX idx_inspeksi_id ON inspeksi_fotos(inspeksi_id);

-- 3. Verify
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME IN ('inspeksi_lapangan', 'inspeksi_fotos');
