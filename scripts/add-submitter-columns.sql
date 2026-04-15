-- ===== ALTER TABLE inspeksi_lapangan untuk add submitter info =====
-- Jalankan script ini di Azure SQL Database

-- 1. Tambah kolom untuk user info
ALTER TABLE inspeksi_lapangan ADD
  user_id VARCHAR(255),
  user_email VARCHAR(255),
  user_name VARCHAR(255);

-- 2. Create index untuk user_email
CREATE INDEX idx_user_email ON inspeksi_lapangan(user_email);

-- 3. Verify
SELECT COLUMN_NAME, DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'inspeksi_lapangan'
ORDER BY ORDINAL_POSITION;
