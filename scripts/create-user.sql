-- ===== FIX SCRIPT =====
-- Jalankan dengan SQL Server ADMIN account di Azure Portal Query Editor

-- OPSI 1: Jika login sudah ada di server level
-- Gunakan script ini:

-- 1. Create database user dari existing login
CREATE USER [qhsecomp_user] FOR LOGIN [qhsecomp_user];

-- 2. Grant permissions untuk database
ALTER ROLE db_datawriter ADD MEMBER [qhsecomp_user];
ALTER ROLE db_datareader ADD MEMBER [qhsecomp_user];

-- 3. Grant execute permission untuk stored procedures (jika ada)
GRANT EXECUTE TO [qhsecomp_user];

-- Test connection
SELECT USER_NAME();

-- ===================================

-- OPSI 2: Jika login TIDAK ada, create baru
-- Uncomment dan jalankan jika opsi 1 tidak berhasil

/*
-- A. Buat login di server level (MASTER database)
-- NOTE: Jalankan ini di MASTER database, bukan di storagedb
-- CREATE LOGIN [qhsecomp_user] WITH PASSWORD = 'Qhse1234@';

-- B. Kemudian buat user di database (storagedb)
-- Jalankan di database storagedb:
CREATE USER [qhsecomp_user] FOR LOGIN [qhsecomp_user];
ALTER ROLE db_datawriter ADD MEMBER [qhsecomp_user];
ALTER ROLE db_datareader ADD MEMBER [qhsecomp_user];
GRANT EXECUTE TO [qhsecomp_user];
*/

-- ===================================

-- VERIFY setelah running script di atas
SELECT name, type_desc FROM sys.database_principals WHERE name = 'qhsecomp_user';
