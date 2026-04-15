# ❓ FAQ - Pertanyaan yang Sering Diajukan

## 🤔 Umum

### Q1: Aplikasi ini apa sih?
**A:** Aplikasi untuk mencatat inspeksi lapangan. Anda bisa:
- Login dengan Microsoft/email Adaro
- Input data inspeksi (lokasi, kategori, deskripsi)
- Upload foto dari kamera
- Semua data tersimpan di database Adaro

---

### Q2: Apakah saya perlu install apa-apa yang rumit?
**A:** Tidak! Aplikasi sudah siap. Anda hanya perlu:
1. Setup 3 nomor dari Azure AD (copy-paste)
2. Jalankan command `npm run dev`
3. Buka browser

---

### Q3: Apakah ini bisa diakses dari HP?
**A:** Ya! Jika di network yang sama dengan PC:
1. Buka CMD, ketik: `ipconfig`
2. Cari "IPv4 Address", contoh: `192.168.1.100`
3. Di HP, buka: `http://192.168.1.100:3000`

Tapi untuk production, aplikasi perlu di-deploy ke cloud (Azure).

---

### Q4: Apakah ini free?
**A:** Untuk testing/development: Ya, gratis!

Untuk production (pakai terus):
- Azure SQL: ~$5-50/bulan (depends on usage)
- Azure App Service: ~$10-100/bulan

---

## 🔐 Authentication (Login)

### Q5: Kenapa harus login?
**A:** Agar sistem tahu siapa yang submit inspeksi:
- Setiap form otomatis capture email penginspeksi
- Manager bisa lihat siapa submit kapan
- Lebih professional & tertrack

---

### Q6: Apa yang terjadi kalau login gagal?
**A:** Kemungkinan:
1. **Email bukan @adaro.com** → Hanya Adaro yang bisa login
2. **MICROSOFT_CLIENT_ID salah** → Check `.env.local`
3. **Network error** → Check internet connection
4. **Azure AD tidak enable** → Check app registration settings

---

### Q7: Saya lupa logout, bagaimana?
**A:** Tidak apa-apa, ada beberapa cara:
1. **Logout dari aplikasi** → Klik tombol Logout (sebelah email Anda)
2. **Clear browser cookies** → Private browsing window
3. **Restart browser** → Close semua tab, buka baru
4. **Timeout otomatis** → Setelah 30 hari tidak login

---

## 💾 Database

### Q8: Data saya disimpan di mana?
**A:** Di **Azure SQL Database** Adaro. Data tidak hilang dan bisa di-backup.

---

### Q9: Bisa lihat data lama?
**A:** Untuk sekarang, belum ada fitur "View All Data". Tapi bisa:
1. Login ke Azure Portal
2. Buka SQL Query Editor
3. Run query: `SELECT * FROM inspeksi_lapangan`

Dalam update ke depan, ada dashboard untuk lihat semua data.

---

### Q10: Apakah fotoku aman?
**A:** Ya! Foto tidak di-upload ke cloud publik, tapi disimpan:
- Encrypted dalam database Adaro yang aman
- Only accessible dengan login Microsoft
- Tidak bisa di-access dari browser langsung

---

## 📸 Photo Upload

### Q11: Berapa foto maksimal per inspeksi?
**A:** Unlimited (bisa 1, 2, 10, atau 100 foto)

---

### Q12: Bisa upload foto dari file existing?
**A:** Ya! File upload juga support:
1. "Pilih dari kamera" untuk foto baru
2. "Upload file" untuk foto yang sudah ada
3. Bisa mix keduanya dalam satu form

---

### Q13: Ukuran foto terbatas?
**A:** Idealnya <5MB per foto. Browser modern support 100MB+, tapi:
- Upload lebih lama
- Database semakin penuh
- Network lebih lambat

Untuk production, bisa compress otomatis pakai JavaScript.

---

## 🏗️ Setup & Installation

### Q14: Berapa lama setup?
**A:** 
- Beginner (ikuti SETUP_PEMULA.md): ~30 menit
- Experienced (ikuti SETUP_CEPAT.md): ~15 menit

---

### Q15: Bisakah setup lewat HP?
**A:** Tidak recommended. Setup perlu:
1. Buka Azure Portal (best di desktop)
2. Edit `.env.local` file (need text editor)
3. Run command di terminal (need command prompt)

Jauh lebih mudah di laptop/desktop Windows/Mac.

---

### Q16: Apa itu `.env.local`?
**A:** File konfigurasi yang berisi "secret" Anda (seperti password):
```
MICROSOFT_CLIENT_ID = ID aplikasi (secret)
MICROSOFT_CLIENT_SECRET = Password aplikasi (super secret!)
MICROSOFT_TENANT_ID = ID organisasi Adaro
NEXTAUTH_SECRET = Encryption key
```

**JANGAN di-share atau upload ke GitHub!**

---

### Q17: Saya error, dimana lihat error details?
**A:** Beberapa cara:

**Di Browser (Console):**
1. Buka aplikasi
2. Tekan F12 (buka Developer Tools)
3. Klik tab "Console"
4. Lihat pesan error merah

**Di Command Prompt:**
1. Lihat terminal dimana `npm run dev` running
2. Ada "Error" messages berwarna merah

**Di File:**
1. Check `.env.local` semua field terisi
2. Check Azure AD app registration settings

---

## 🚀 Production & Deployment

### Q18: Bagaimana deploy ke production?
**A:** Untuk sekarang development aja. Jika mau production:

**Opsi 1: Azure App Service** (recommended)
1. Build aplikasi
2. Upload ke Azure
3. Bisa diakses dari mana saja

**Opsi 2: Server sendiri**
1. Setup server Windows/Linux
2. Install Node.js
3. Run aplikasi

---

### Q19: Aplikasi bisa offline?
**A:** Tidak. Aplikasi butuh:
- Internet connection (untuk login Microsoft)
- Connection ke Azure SQL database
- Tanpa internet = tidak bisa pakai

---

### Q20: Apakah ada backup otomatis?
**A:** Ya! Azure SQL backup:
- **Daily backup** (keep 7 days)
- **Weekly backup** (keep 4 weeks)
- **Automatic restore** jika database corrupted

---

## 🔧 Troubleshooting

### Q21: `npm is not recognized`
**A:** Node.js tidak ter-install. Solusi:
1. Download Node.js dari nodejs.org
2. Install dengan default settings
3. Restart Command Prompt
4. Try `npm -v` (should show version)

---

### Q22: `ENOENT: no such file or directory, open '.env.local'`
**A:** File `.env.local` tidak ada. Buat baru:
1. Buka folder `D:\sample\inspeksi-lapangan`
2. Right-click → New → Text Document
3. Rename ke `.env.local`
4. Edit dengan Notepad, paste config kami

---

### Q23: `TypeError: Cannot read properties of undefined (reading 'user')`
**A:** Session tidak ada (belum login). Aplikasi should auto-redirect ke `/login`. Jika tidak:
1. Clear browser cookies
2. Try login again
3. Check NEXTAUTH_SECRET di `.env.local`

---

### Q24: `Error: connect ECONNREFUSED 127.0.0.1:3000`
**A:** Aplikasi tidak running. Jalankan:
```
npm run dev
```

---

### Q25: Halaman blank atau loading forever
**A:** Ada beberapa kemungkinan:
1. **Browser cache** → Tekan Ctrl+Shift+R (hard refresh)
2. **Port 3000 sudah dipakai** → Close aplikasi lain atau change port:
   ```
   npm run dev -- -p 3001
   ```
3. **Network error** → Check internet connection

---

## 🎯 Best Practices

### Q26: Apa yang harus saya lakukan kalau ada error?
**A:** Ikuti urutan ini:

1. **Read error message** - Apa katanya? (Google if unclear)
2. **Check internet** - Bisa ping google.com?
3. **Check database** - Bisa login ke Azure SQL?
4. **Check credentials** - Semua di `.env.local` benar?
5. **Restart app** - Ctrl+C, terus `npm run dev` lagi
6. **Clear cache** - Browser Ctrl+Shift+R
7. **Ask for help** - Email atau call support

---

### Q27: Bagaimana prevent data loss?
**A:** 

**Automatic (Azure handle):**
- Daily backup (included di Azure SQL)
- Disaster recovery (99.99% uptime)

**Manual (Anda):**
- Export data ke Excel regularly
- Backup database snapshot monthly
- Monitor storage usage

---

### Q28: Bagaimana password change?
**A:** Password dihandle oleh Microsoft/Azure AD. Untuk change:
1. Go to outlook.microsoft.com (change Microsoft password)
2. Atau di device settings → Account → Security

Aplikasi otomatis update.

---

### Q29: Multiple user bisa login?
**A:** Ya! Banyak people di Adaro bisa login:
1. Setiap orang login dengan email Adaro mereka
2. Setiap submission capture email penginspeksi
3. Data tidak tercampur (separate records)

**NOT recommended:** Multiple user pakai 1 laptop jika ada privacy concern.

---

### Q30: Apa kuda-kuda selanjutnya?
**A:** Jika setup selesai, next steps:

**Phase 1 (sekarang):** ✅ Login & Submit Inspeksi

**Phase 2 (rencana):** 📊 Dashboard untuk view all data
- Lihat semua inspeksi yang sudah submit
- Filter by lokasi, tanggal, user
- Export to Excel

**Phase 3 (future):** 🏭 Advanced Features
- Workflow approval (submit → review → approve)
- Photo annotation (mark unsafe area in photo)
- Offline mode (cache for later sync)
- Mobile app (iOS/Android)

---

## 📞 Need More Help?

**Quick resources:**
- `SETUP_PEMULA.md` - Step by step guide (recommended untuk beginner)
- `SETUP_CEPAT.md` - Quick checklist untuk yang agak paham
- `AUTH_IMPLEMENTATION.md` - Technical deep dive

**When stuck:**
1. Read SETUP_PEMULA.md section yang relevan
2. Check TROUBLESHOOTING section di guide
3. Screenshot error → email support
4. Check https://nextauth.js.org (NextAuth docs)

---

**Still stuck? Emai dengan screenshot error + apa yang Anda coba!** 💪
