-- ===== DEBUG SCRIPT =====
-- Jalankan script ini dengan SQL Server ADMIN account

-- 1. Check apakah user sudah ada
SELECT name, type_desc 
FROM sys.database_principals 
WHERE name = 'qhsecomp_user';

-- 2. Check apakah login sudah ada
SELECT name, type_desc 
FROM sys.server_principals 
WHERE name = 'qhsecomp_user';

-- 3. Check table inspeksi_lapangan
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'inspeksi_lapangan';

-- 4. Check user permissions
EXEC sp_helprolemember;
