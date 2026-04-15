# 📋 Quick Reference - Setup dalam 5 Menit (Versi Cepat)

Jika Anda sudah agak paham, ikuti checklist ini:

## ✅ Checklist Setup

### Fase 1: Azure AD (5 menit)

- [ ] Login ke `portal.azure.com`
- [ ] Cari & buka **"App registrations"**
- [ ] Klik **"+ New registration"**
  - [ ] Name: `Inspeksi Lapangan v0`
  - [ ] Type: `Accounts in this organizational directory only`
  - [ ] Redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`
- [ ] **CATAT 2 NOMOR INI:**
  - [ ] Application (client) ID → `MICROSOFT_CLIENT_ID`
  - [ ] Directory (tenant) ID → `MICROSOFT_TENANT_ID`
- [ ] Buka **"Certificates & secrets"**
  - [ ] Klik **"+ New client secret"**
  - [ ] **COPY VALUE sekarang!** → `MICROSOFT_CLIENT_SECRET`

**⏱️ 5 menit selesai**

---

### Fase 2: Environment File (3 menit)

- [ ] Buka folder `D:\sample\inspeksi-lapangan`
- [ ] Buat/edit file `.env.local`
- [ ] Isi dengan:

```
MICROSOFT_CLIENT_ID=<paste 3 nomor dari Azure AD>
MICROSOFT_CLIENT_SECRET=<password rahasia>
MICROSOFT_TENANT_ID=<tenant ID>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate dengan perintah di bawah>
```

- [ ] Generate NEXTAUTH_SECRET:
  - **Windows**: Buka PowerShell, paste:
    ```powershell
    [Convert]::ToBase64String((1..32|ForEach-Object{Get-Random -Maximum 256}))
    ```
  - **Mac**: Buka Terminal, paste:
    ```bash
    openssl rand -base64 32
    ```
- [ ] Copy hasil → paste ke NEXTAUTH_SECRET
- [ ] Save file (Ctrl+S)

**⏱️ 3 menit selesai**

---

### Fase 3: Database (2 menit)

- [ ] Buka Azure Portal → SQL Database Anda
- [ ] Buka **"Query editor (preview)"**
- [ ] Login dengan SQL admin credentials
- [ ] Paste & run:

```sql
ALTER TABLE inspeksi_lapangan ADD
  user_id VARCHAR(255),
  user_email VARCHAR(255),
  user_name VARCHAR(255);

CREATE INDEX idx_user_email ON inspeksi_lapangan(user_email);
```

- [ ] Tunggu sampai "Queries completed successfully"

**⏱️ 2 menit selesai**

---

### Fase 4: Jalankan (3 menit)

- [ ] Buka Command Prompt
- [ ] Ketik & run:
  ```
  cd D:\sample\inspeksi-lapangan
  npm run dev
  ```
- [ ] Tunggu sampai muncul:
  ```
  ✓ Ready in X.Xs
  - Local: http://localhost:3000
  ```
- [ ] Buka browser → `http://localhost:3000`

**⏱️ 3 menit selesai**

---

### Fase 5: Test (2 menit)

- [ ] Halaman login muncul dengan tombol "Login dengan Microsoft"
- [ ] Klik tombol → login dengan email @adaro.com
- [ ] Terlihat nama & email di bagian atas kanan
- [ ] Isi form & submit → ada pesan "Berhasil"
- [ ] Check database → ada data baru dengan email Anda

**⏱️ 2 menit selesai**

---

## ⏱️ TOTAL: 15 MENIT SELESAI! 🎉

---

## 🔧 Common Issues & Quick Fixes

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `ENOENT: no such file (.env.local)` | File `.env.local` tidak ada | Buat file baru, isi ulang |
| `Redirect URI mismatch` | URI di Azure AD berbeda | Cek Azure AD authentication settings |
| `Login failed untuk user` | SQL credentials salah | Check `.env.local` SQL credentials |
| `Cannot GET /` | App tidak running | Jalankan `npm run dev` lagi |
| `Error: ECONNREFUSED` | Database tidak connect | Check Azure SQL is online & firewall |

---

## 📱 Shortcut Commands

```powershell
# Navigate ke folder
cd D:\sample\inspeksi-lapangan

# Install dependencies (jika belum)
npm install next-auth@beta

# Run development server
npm run dev

# Stop server
Ctrl + C

# Open local app
start http://localhost:3000
```

---

## 🆘 Need Help?

| Level | File | Keterangan |
|-------|------|-----------|
| 🟢 Beginner | `SETUP_PEMULA.md` | Panduan step-by-step dengan screenshot |
| 🟡 Intermediate | `AUTH_SETUP_CHECKLIST.md` | Checklist & quick reference |
| 🔴 Advanced | `AUTH_IMPLEMENTATION.md` | Technical details, debugging, best practices |

---

## ✨ Yang Terjadi Setelah Login:

1. **Sistem kenal siapa Anda** (via Microsoft email)
2. **Nama & email muncul di halaman** (dari Microsoft profile)
3. **Form Inspeksi siap diisi** (lokasi, tanggal, kategori, foto)
4. **Data disimpan dengan email Anda** (untuk tracking siapa yang submit)
5. **Foto disimpan di database** (bisa diakses nanti)
6. **Logout tersedia** (untuk security)

---

**Ready? Let's go! 🚀**
