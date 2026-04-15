# 🗄️ Setup Azure SQL Database untuk Inspeksi Lapangan

Panduan lengkap untuk mengintegrasikan aplikasi Next.js dengan Azure SQL Database.

## 📋 Prerequisites

- Akun Microsoft Azure aktif
- Azure SQL Database sudah dibuat
- SQL Server Management Studio atau Query Editor di Azure Portal

## 🚀 Langkah-Langkah Setup

### 1. **Buat Azure SQL Database**

Jika belum punya database:
1. Buka [Azure Portal](https://portal.azure.com)
2. Cari "SQL databases" 
3. Klik "Create"
4. Isi form:
   - **Subscription**: Pilih subscription Anda
   - **Resource Group**: Buat atau pilih yang ada
   - **Database Name**: `inspeksi-lapangan`
   - **Server**: Buat server baru atau gunakan yang ada
   - **Server Admin**: username (catat untuk .env.local)
   - **Password**: password kuat (catat untuk .env.local)
5. Klik "Review + Create" → "Create"

### 2. **Buat Database Table**

1. Buka Azure SQL Database Anda di Portal
2. Klik "Query editor" di sidebar
3. Login dengan SQL Server credentials
4. Copy-paste SQL dari `scripts/setup-database.sql`
5. Klik "Run"

### 3. **Dapatkan Connection String**

1. Di Azure Portal, buka SQL Server Anda (bukan database)
2. Copy nama server dari overview (format: `server-name.database.windows.net`)
3. Database name adalah nama yang Anda buat (e.g., `inspeksi-lapangan`)
4. Username dan password adalah yang Anda setup saat membuat server

### 4. **Setup Environment Variables**

1. Buat file `.env.local` di root project (copy dari `.env.local.example`)
2. Isi dengan credentials Azure SQL Anda:

```env
AZURE_SQL_SERVER=your-server-name.database.windows.net
AZURE_SQL_DATABASE=inspeksi-lapangan
AZURE_SQL_USER=your-admin-username
AZURE_SQL_PASSWORD=your-admin-password
```

**⚠️ PENTING:**
- Jangan share `.env.local` ke git (sudah di .gitignore)
- Jangan commit credentials ke repository public
- Gunakan Strong Password untuk production

### 5. **Test Koneksi**

```bash
# Restart development server
npm run dev
```

1. Buka http://localhost:3000
2. Klik "Mulai Inspeksi"
3. Isi form dengan data test
4. Klik "Simpan Inspeksi"
5. Jika berhasil, akan muncul pesan hijau "Data inspeksi berhasil disimpan"

### 6. **Verify Data di Database**

1. Buka Azure Portal → SQL Database Anda
2. Klik "Query editor"
3. Jalankan query:

```sql
SELECT * FROM inspeksi_lapangan ORDER BY created_at DESC;
```

Anda seharusnya melihat data yang baru disimpan dari aplikasi.

## 🛡️ Security Best Practices

### Untuk Development:
- Gunakan strong password
- Update `.env.local` secara berkala
- Monitor usage di Azure Portal

### Untuk Production:
1. **Jangan commit credentials** → Gunakan Azure Key Vault atau GitHub Secrets
2. **Gunakan SQL User yang restricted** → buat user baru hanya untuk aplikasi, bukan admin
3. **Enable Firewall Rules** → restrict akses ke IP aplikasi saja
4. **Use Connection Pooling** → sudah di-handle oleh `mssql` package
5. **Encrypt Passwords** → gunakan Azure Key Vault

### Setup SQL User untuk Production:

```sql
-- Login as SQL Server Admin
CREATE LOGIN app_user WITH PASSWORD = 'StrongPassword123!';

-- Create DB user
CREATE USER app_user FOR LOGIN app_user;

-- Grant permissions (minimal)
GRANT SELECT, INSERT, UPDATE ON inspeksi_lapangan TO app_user;
```

## 🔧 Troubleshooting

### Error: "Cannot connect to server"
- Pastikan credentials di `.env.local` benar
- Check firewall rules di Azure (allow client IP)
- Restart dev server

### Error: "Login failed for user"
- Verify username + password
- Check bahwa user punya permission untuk database
- Format server harus: `server-name.database.windows.net`

### Error: "Table does not exist"
- Jalankan SQL script dari `scripts/setup-database.sql`
- Verify query berhasil di Azure Query Editor

### Timeout/Slow Connection
- Check Azure SQL pricing tier (perlu resources lebih besar)
- Monitor Performance di Azure Portal
- Optimize queries jika diperlukan

## 📊 Monitor Database Usage

Di Azure Portal SQL Database:
- **Metrics** → Check CPU, DTU usage
- **Query Performance Insight** → Analyze slow queries
- **Alerts** → Setup alerts untuk high CPU/DTU

## 🔄 Next Steps

Setelah setup berhasil, Anda bisa:

1. **Add More Features**:
   - List/View semua inspeksi
   - Edit/Delete data
   - Export ke Excel
   - Dashboard analytics

2. **Improve Security**:
   - Tambah authentication/login
   - Role-based access control
   - Audit logging

3. **Deploy to Production**:
   - Setup CI/CD pipeline
   - Deploy ke Azure App Service atau Vercel
   - Use environment variables dari CI/CD

## 📚 Resources

- [Azure SQL Database Documentation](https://docs.microsoft.com/en-us/azure/azure-sql/)
- [mssql npm package](https://github.com/tediousjs/node-mssql)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Azure Security Best Practices](https://docs.microsoft.com/en-us/azure/security/)
