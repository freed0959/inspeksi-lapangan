# 🎯 Panduan Setup untuk PEMULA - Tanpa Coding!

Panduan ini dibuat untuk orang yang **tidak punya background coding** dan ingin setup Inspeksi Lapangan v0.

## 📚 Konten: Gampang Banget!

Ikuti langkah-langkah di bawah dengan teliti, jangan lompat-lompat.

---

## 🔐 BAGIAN 1: Setup Microsoft Login (Biar Aplikasi Kenal Anda)

Tujuan: Aplikasi bisa tahu siapa Anda lewat Microsoft account.

### Langkah 1: Buka Azure Portal

1. Buka browser (Chrome, Edge, atau Safari)
2. Ketik di address bar: `https://portal.azure.com`
3. Tekan Enter
4. Login dengan akun Microsoft yang punya access ke Adaro

**💡 Tip**: Gunakan akun Microsoft yang sama dengan email Adaro Anda (@adaro.com)

---

### Langkah 2: Cari App Registration Page

Setelah login, Anda akan lihat halaman dengan banyak pilihan.

1. Di bagian atas, ada kotak pencarian (search box)
2. Klik kotak tersebut dan ketik: `app registration`
3. Dari hasil pencarian, klik **"App registrations"**

**Gambar Konsep:**
```
[Top of page]
┌─────────────────────────────────────────────┐
│  🔍 Ketik "app registration" di sini       │
└─────────────────────────────────────────────┘

[Hasil Pencarian]
• App registrations ← KLIK INI
• App registrations (old)
• Azure Active Directory
```

---

### Langkah 3: Buat App Baru

1. Di halaman App registrations, klik tombol biru **"+ New registration"** (di bagian atas)
2. Halaman form akan muncul. Isi form seperti ini:

#### Form yang Perlu Diisi:

**Name / Nama Aplikasi:**
```
Inspeksi Lapangan v0
```
(Simpelnya, ini adalah nama aplikasi Anda)

**Supported account types / Tipe Akun yang Diizinkan:**
Pilih option:
```
Accounts in this organizational directory only (Single tenant)
```
(Ini artinya: hanya orang dalam organisasi Adaro yang bisa login)

**Redirect URI / Alamat Balik:**
Pilih "Web" dari dropdown, terus isi:
```
http://localhost:3000/api/auth/callback/azure-ad
```

**Gambar Konsep Form:**
```
┌────────────────────────────────────────────────┐
│ 📝 Register an application                      │
├────────────────────────────────────────────────┤
│                                                 │
│ Name:                                           │
│ ┌──────────────────────────────────────────┐  │
│ │ Inspeksi Lapangan v0                     │  │
│ └──────────────────────────────────────────┘  │
│                                                 │
│ Supported account types:                        │
│ ○ Multiple organizational directories (...)     │
│ ○ Accounts in any organizational directory      │
│ ● Accounts in this organizational directory ✓  │
│                                                 │
│ Redirect URI:                                   │
│ [Web dropdown ▼]                               │
│ ┌──────────────────────────────────────────┐  │
│ │http://localhost:3000/api/auth/callback...│  │
│ └──────────────────────────────────────────┘  │
│                                                 │
│           [Register] ← KLIK SINI                │
└────────────────────────────────────────────────┘
```

3. Klik tombol **"Register"** (biru)
4. Tunggu sebentar...

---

### Langkah 4: Catat 2 Nomor Penting (Jangan Lupa!)

Setelah register, Anda akan lihat halaman dengan informasi. **CATAT 2 NOMOR INI di notepad:**

**Nomor 1: Application (client) ID**
```
Cari di sebelah kanan atas, ada text yang sama dengan:
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

Contoh: a1b2c3d4-e5f6-7890-abcd-ef1234567890

📝 TULIS NOMOR INI DI NOTEPAD
```

**Nomor 2: Directory (tenant) ID**
```
Di bawah Application ID, ada Directory (tenant) ID
Bentuknya sama, contoh: 12345678-abcd-efgh-ijkl-mnopqrstuvwx

📝 TULIS NOMOR INI DI NOTEPAD JUGA
```

---

### Langkah 5: Buat Password Rahasia (Client Secret)

1. Di sebelah kiri halaman, ada menu. Cari dan klik: **"Certificates & secrets"**
2. Klik tombol biru: **"+ New client secret"**
3. Form akan muncul, isi:
   - **Description**: `NextAuth` (atau apaaja)
   - **Expires**: `24 months` (pilih dari dropdown)
4. Klik **"Add"**

**PENTING:** Halaman akan menampilkan password/secret. **COPY SEKARANG!**

```
┌──────────────────────────────────────────────┐
│ Client secrets                                │
├──────────────────────────────────────────────┤
│ VALUE                    EXPIRE DATE          │
│ xxxxxxxxxxxxxxxxxxxx     6/14/2028            │
│ ↑ COPY INI SEKARANG                          │
└──────────────────────────────────────────────┘
```

**📝 TULIS NOMOR INI DI NOTEPAD (Secret Value)**

---

### Langkah 6: Set Permissions (Opsional, Tapi Penting)

1. Di sidebar kiri, klik: **"API permissions"**
2. Klik biru: **"+ Add a permission"**
3. Pilih: **"Microsoft Graph"**
4. Pilih: **"Delegated permissions"**
5. Di search box, cari dan **CENTANG** yang ini:
   - ☑ `email`
   - ☑ `openid`
   - ☑ `profile`
   - ☑ `User.Read`

6. Klik **"Add permissions"**
7. Jika ada tombol **"Grant admin consent"**, klik itu

**Selesai bagian Azure AD!** ✅

---

## 💾 BAGIAN 2: Setup File Konfigurasi

Tujuan: Beri tahu aplikasi lokal Anda 3 nomor rahasia yang sudah dicatat.

### Langkah 1: Buka Folder Aplikasi

1. Buka **File Explorer** (folder icon di taskbar)
2. Navigasi ke folder: `D:\sample\inspeksi-lapangan`
3. Di dalam folder itu, cari file bernama: `.env.local`

**Catatan:** File ini mungkin hidden (tersembunyi). Jika tidak terlihat:
- Klik menu **View** di top
- Cari **"Hidden items"** atau **"Show hidden files"**
- Centang ✓

Jika file `.env.local` **tidak ada**, buat file baru:
1. Right-click di folder kosong
2. Pilih **"New"** → **"Text Document"**
3. Beri nama: `.env.local`
4. (Jika diminta "Are you sure?", klik Yes)

### Langkah 2: Buka File dengan Notepad/Editor

1. Right-click file `.env.local`
2. Pilih **"Open with"** → **"Notepad"** (atau editor lain)

### Langkah 3: Isi File dengan 3 Nomor Anda

Copy-paste text di bawah ke file `.env.local`:

```
MICROSOFT_CLIENT_ID=xxx-xxx-xxx
MICROSOFT_CLIENT_SECRET=xxx-xxx-xxx
MICROSOFT_TENANT_ID=xxx-xxx-xxx
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generated-secret-here
```

**⚠️ GANTI `xxx-xxx-xxx` dengan nomor yang udah Anda catat!**

Contoh asli:
```
MICROSOFT_CLIENT_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
MICROSOFT_CLIENT_SECRET=abc.def.ghi.jkl.mnopqrstuvwxyz
MICROSOFT_TENANT_ID=12345678-abcd-efgh-ijkl-mnopqrstuvwx
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dJqKdBJjDlKqJdKjqpKDjDJdjDdkdJqlKDj9Dj==
```

### Langkah 4: Generate NEXTAUTH_SECRET

Untuk `NEXTAUTH_SECRET`, lakukan ini:

#### Di Windows:

1. Tekan **Windows Key + R**
2. Ketik: `powershell`
3. Tekan Enter (PowerShell window akan terbuka)
4. Copy-paste command ini:
```powershell
[Convert]::ToBase64String((1..32|ForEach-Object{Get-Random -Maximum 256}))
```
5. Tekan Enter
6. Copy hasil output yang muncul
7. Paste ke NEXTAUTH_SECRET di file `.env.local`

#### Di Mac/Linux:

1. Buka Terminal
2. Paste command ini:
```bash
openssl rand -base64 32
```
3. Tekan Enter
4. Copy hasil dan paste ke NEXTAUTH_SECRET

### Langkah 5: Simpan File

1. Tekan **Ctrl + S** (save)
2. Close editor

**File .env.local sudah selesai!** ✅

---

## 🗄️ BAGIAN 3: Setup Database

Tujuan: Beri tahu database untuk track siapa yang submit inspeksi.

### Langkah 1: Buka Azure SQL Query Editor

1. Buka browser → Portal Azure
2. Di search box, cari: `SQL databases`
3. Klik database Anda (contoh: `storagedb`)
4. Di sidebar kiri, klik: **"Query editor (preview)"**
5. Login jika diminta dengan username/password admin SQL

### Langkah 2: Jalankan Script Database

Di halaman Query Editor, delete text yang ada, terus copy-paste script ini:

```sql
ALTER TABLE inspeksi_lapangan ADD
  user_id VARCHAR(255),
  user_email VARCHAR(255),
  user_name VARCHAR(255);

CREATE INDEX idx_user_email ON inspeksi_lapangan(user_email);
```

Terus klik tombol **"Run"** (biru, di atas)

**Tunggu sampai selesai...** Jika tidak ada error (merah), berarti **berhasil!** ✅

---

## 🚀 BAGIAN 4: Jalankan Aplikasi

### Langkah 1: Buka Command Prompt

1. Tekan **Windows Key + R**
2. Ketik: `cmd`
3. Tekan Enter

### Langkah 2: Navigasi ke Folder

Di Command Prompt yang terbuka, ketik:
```
cd D:\sample\inspeksi-lapangan
```
Tekan Enter

### Langkah 3: Jalankan Aplikasi

Ketik:
```
npm run dev
```
Tekan Enter

**Tunggu sampai muncul text seperti ini:**
```
✓ Ready in 2.5s
- Local:         http://localhost:3000
- Network:       http://192.168.x.x:3000
```

Jika sudah muncul, berarti **aplikasi sudah berjalan!** ✅

### Langkah 4: Buka di Browser

1. Buka browser (Chrome, Edge, Safari)
2. Ketik di address bar: `http://localhost:3000`
3. Tekan Enter

---

## 🧪 BAGIAN 5: Testing - Pastikan Semuanya Jalan

### Test 1: Login Page Muncul

Anda seharusnya lihat halaman dengan:
- Judul: "🏭 Inspeksi Lapangan v0"
- Tombol biru: "Login dengan Microsoft"

**Jika ini muncul = BERHASIL!** ✅

### Test 2: Coba Login

1. Klik tombol "Login dengan Microsoft"
2. Browser akan buka halaman Microsoft login
3. Login dengan email Adaro Anda (@adaro.com)
4. Mungkin akan diminta "Consent" (izin akses), klik "Accept"
5. Browser akan balik ke aplikasi
6. Anda akan lihat halaman utama dengan **nama & email Anda di bagian atas kanan**

**Jika ini berhasil = SEMPURNA!** ✅ 

### Test 3: Coba Submit Inspeksi

1. Klik tombol "Mulai Inspeksi"
2. Isi form dengan data dummy (asal aja):
   - Lokasi: "Lokasi Test"
   - Tanggal: Hari ini
   - Nama Penginspeksi: Nama Anda (seharusnya sudah terisi otomatis)
   - Kategori: Pilih apaaja
   - Deskripsi: "Test"
3. Optional: Upload foto (bisa skip)
4. Klik "Simpan Inspeksi"
5. Tunggu...

**Jika muncul pesan hijau "Data inspeksi berhasil disimpan!" = BERHASIL!** ✅

---

## 🎉 SELESAI!

Jika semua test berhasil, aplikasi Anda sudah **fully functional**!

---

## ❓ Jika Ada Error/Masalah

### Error: "Login failed" atau "ENOENT"

**Kemungkinan:** File `.env.local` salah atau tidak ada.

**Solusi:**
1. Check apakah file `.env.local` ada di folder aplikasi
2. Check apakah field MICROSOFT_CLIENT_ID, SECRET, TENANT_ID terisi dengan nomor yang benar
3. Delete file `.env.local`
4. Buat file baru dan isi ulang dengan hati-hati
5. Restart aplikasi (Ctrl+C di command prompt, terus `npm run dev` lagi)

---

### Error: "Redirect URI mismatch"

**Kemungkinan:** Redirect URI di Azure AD tidak match.

**Solusi:**
1. Buka Azure Portal
2. Cari app registration Anda
3. Sidebar kiri, klik "Authentication"
4. Cek apakah ada: `http://localhost:3000/api/auth/callback/azure-ad`
5. Jika tidak ada, tambahkan
6. Restart aplikasi

---

### Error: "Cannot connect to database"

**Kemungkinan:** Azure SQL credentials di `.env.local` salah.

**Solusi:**
1. Check file `.env.local` di bawah:
   ```
   AZURE_SQL_SERVER
   AZURE_SQL_DATABASE
   AZURE_SQL_USER
   AZURE_SQL_PASSWORD
   ```
2. Pastikan semuanya benar sesuai Azure SQL Anda
3. Test koneksi SQL di Azure Portal Query Editor
4. Restart aplikasi

---

## 📞 Butuh Bantuan?

Jika masih bingung:
1. Check error message yang muncul (screenshot bisa membantu)
2. Baca file dokumentasi:
   - `AUTH_IMPLEMENTATION.md` (untuk yang lebih technical)
   - `AUTH_SETUP_CHECKLIST.md` (untuk checklist)
   - `AZURE_SQL_SETUP.md` (untuk SQL)

---

**Good luck! 🚀 Aplikasi Anda sekarang ready untuk dipake!**
