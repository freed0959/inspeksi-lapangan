# 📋 Inspeksi Lapangan v0

Aplikasi web responsif untuk inspeksi lapangan yang dapat diakses dari berbagai perangkat (HP, tablet, dan laptop). Dibangun dengan teknologi modern Next.js dan Tailwind CSS.

## ✨ Fitur

- ✅ **Responsif** - Bekerja sempurna di semua ukuran layar (mobile, tablet, desktop)
- ✅ **User-Friendly** - Antarmuka yang intuitif dan mudah digunakan
- ✅ **Modern Stack** - Dibangun dengan Next.js 16, React, dan Tailwind CSS
- ✅ **TypeScript** - Tipe yang aman untuk pengembangan yang lebih baik
- ✅ **Dark Mode** - Mendukung mode gelap untuk kenyamanan pengguna
- ✅ **Form Inspeksi** - Formulir lengkap untuk mencatat hasil inspeksi lapangan

## 🛠️ Teknologi yang Digunakan

- **[Next.js](https://nextjs.org/)** - React framework untuk production
- **[React](https://react.dev/)** - UI library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript dengan tipe statis
- **[ESLint](https://eslint.org/)** - JavaScript linter

## 🚀 Memulai

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, atau bun

### Instalasi

```bash
# Navigate ke folder proyek
cd inspeksi-lapangan

# Install dependencies (sudah dilakukan saat setup)
npm install
```

### Menjalankan Development Server

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
```

Buka browser dan kunjungi [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

> **Catatan:** Aplikasi akan auto-reload saat Anda mengedit file.

## 📁 Struktur Proyek

```
inspeksi-lapangan/
├── src/
│   └── app/
│       ├── layout.tsx          # Layout utama aplikasi
│       ├── page.tsx            # Halaman utama dengan form inspeksi
│       ├── globals.css         # Styling global
│       └── favicon.ico         # Icon aplikasi
├── public/                     # Asset statis (images, icons, dll)
├── package.json               # Dependencies dan scripts
├── next.config.ts             # Konfigurasi Next.js
├── tsconfig.json              # Konfigurasi TypeScript
├── tailwind.config.ts         # Konfigurasi Tailwind CSS
└── README.md                  # File ini
```

## 🎨 Komponen Utama

### Landing Page
- Deskripsi aplikasi
- Featured benefits
- Call-to-action button "Mulai Inspeksi"

### Form Inspeksi
Formulir interaktif untuk mengisi data inspeksi dengan field:
- Lokasi Inspeksi
- Tanggal Inspeksi
- Nama Penginspeksi
- Kategori Inspeksi (Infrastruktur, Lingkungan, Keselamatan, Kualitas)
- Deskripsi Temuan

## 📝 Perintah Penting

```bash
# Development
npm run dev          # Jalankan development server

# Production
npm run build        # Build untuk production
npm run start        # Jalankan build production

# Linting
npm run lint         # Check linting errors
```

## 🌐 Responsiveness

Aplikasi ini menggunakan Tailwind CSS breakpoints untuk memastikan responsiveness:

- **Mobile** (`sm`): < 640px
- **Tablet** (`md`): ≥ 768px
- **Laptop** (`lg`): ≥ 1024px

Semua komponen telah dioptimalkan untuk bekerja baik di semua ukuran layar.

## 🚀 Deployment

### Deploy ke Vercel (Rekomendasi)

1. Push kode ke GitHub
2. Buka https://vercel.com/new
3. Import repository inspeksi-lapangan
4. Vercel akan auto-detect Next.js dan configure dengan benar
5. Click "Deploy"

### Deploy Manual ke Cloud Service Lain

```bash
# Build production version
npm run build

# Deploy .next folder ke server Anda
# Pastikan Node.js installed di server
npm run start
```

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Kontribusi

Untuk mengembangkan fitur lebih lanjut:

1. Create branch baru: `git checkout -b feature/nama-fitur`
2. Commit changes: `git commit -m 'Add nama-fitur'`
3. Push ke branch: `git push origin feature/nama-fitur`
4. Open Pull Request

## 📄 Lisensi

Proyek ini open source dan dapat digunakan secara bebas.

---

**Inspeksi Lapangan v0** © 2026. Dibuat dengan ❤️ menggunakan Next.js & Tailwind CSS
