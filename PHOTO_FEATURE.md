# 📸 Fitur Upload Foto - Panduan Lengkap

## Overview

Aplikasi Inspeksi Lapangan v0 sekarang memiliki fitur upload foto yang lengkap dengan:
- ✅ Multiple photo upload (bisa upload lebih dari 1 foto)
- ✅ Camera capture support (untuk mobile)
- ✅ Photo preview sebelum submit
- ✅ Foto disimpan ke Azure SQL Database
- ✅ API endpoint untuk retrieve foto

## 🚀 Setup Database

### 1. Jalankan SQL Script

Buka Azure Portal → Query Editor di database Anda dan jalankan:

```sql
-- Buat table untuk fotos
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

-- Create index untuk query lebih cepat
CREATE INDEX idx_inspeksi_id ON inspeksi_fotos(inspeksi_id);

-- Verify
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME IN ('inspeksi_lapangan', 'inspeksi_fotos');
```

Atau jalankan file yang sudah disiapkan:
```bash
# File: scripts/create-photos-table.sql
# Copy-paste isi file ke Azure Query Editor
```

## 📱 Cara Menggunakan di Aplikasi

### 1. **Buka Form Inspeksi**
   - Klik tombol "Mulai Inspeksi" di home page

### 2. **Isi Data Inspeksi**
   - Lokasi, Tanggal, Nama Penginspeksi, Kategori, Deskripsi

### 3. **Upload Foto**
   - **Di Mobile**: Klik input foto → "Ambil Foto" akan buka kamera
   - **Di Desktop**: Klik input foto → Pilih file dari komputer
   - **Multiple Fotos**: Anda bisa select multiple files sekaligus

### 4. **Preview Foto**
   - Foto yang dipilih akan muncul di bawah input
   - Hover over foto untuk lihat tombol ❌ untuk hapus
   - Total jumlah foto ditampilkan

### 5. **Submit**
   - Klik "Simpan Inspeksi" untuk save data + semua foto ke database

## 🔧 API Endpoints

### POST /api/inspeksi
**Kirim data inspeksi + multiple fotos**

Request:
```javascript
const formData = new FormData();
formData.append('lokasi', 'Lokasi A');
formData.append('tanggal', '2026-04-14');
formData.append('penginspeksi', 'John Doe');
formData.append('kategori', 'infrastruktur');
formData.append('deskripsi', 'Deskripsi...');
formData.append('fotos', file1); // File object
formData.append('fotos', file2); // File object
formData.append('fotos', file3); // Multiple files

const response = await fetch('/api/inspeksi', {
  method: 'POST',
  body: formData
});

const data = await response.json();
// Response:
// {
//   "message": "Data inspeksi dan foto berhasil disimpan",
//   "inspeksiId": 1,
//   "fotosInserted": 3
// }
```

### GET /api/inspeksi
**Fetch semua inspeksi dengan jumlah foto**

Response:
```javascript
[
  {
    "id": 1,
    "lokasi": "Lokasi A",
    "tanggal": "2026-04-14T10:00:00.000Z",
    "penginspeksi": "John Doe",
    "kategori": "infrastruktur",
    "deskripsi": "Deskripsi...",
    "created_at": "2026-04-14T10:00:00.000Z",
    "total_fotos": 3
  }
]
```

### GET /api/fotos/[fotoId]
**Download/View foto by ID**

```javascript
// URL:
// /api/fotos/1

// Response: Binary image data dengan header:
// Content-Type: image/jpeg
// Content-Disposition: inline; filename="photo.jpg"
```

## 📊 Database Schema

### inspeksi_lapangan (existing)
```sql
id (INT, PK, IDENTITY)
lokasi (VARCHAR 255)
tanggal (DATETIME)
penginspeksi (VARCHAR 255)
kategori (VARCHAR 50)
deskripsi (VARCHAR MAX)
created_at (DATETIME)
updated_at (DATETIME)
```

### inspeksi_fotos (NEW)
```sql
id (INT, PK, IDENTITY)
inspeksi_id (INT, FK) → references inspeksi_lapangan(id)
foto_data (VARBINARY MAX) → Binary image data
foto_nama (VARCHAR 255) → Filename
foto_tipe (VARCHAR 50) → MIME type (e.g., image/jpeg)
foto_ukuran (INT) → File size in bytes
created_at (DATETIME)
```

## 💾 Limits & Considerations

### Current Implementation:
- **Max file size per photo**: ~2GB (SQL VARBINARY MAX limit, tapi praktis terbatas)
- **Total fotos per inspeksi**: Unlimited
- **Photo format**: Semua image format yang supported browser
- **Storage location**: Azure SQL Database
- **Retrieval**: Via API `/api/fotos/[fotoId]`

### Recommendations untuk Production:

1. **Implementasi Image Size Limit**
   - Max 10MB per file (untuk performa)
   - Max 5 fotos per inspeksi (untuk UX)

2. **Gunakan Azure Blob Storage** (RECOMMENDED)
   - Lebih scalable untuk file besar
   - Lebih murah untuk storage
   - Lebih cepat untuk streaming
   - Setup: Lihat `AZURE_STORAGE_SETUP.md`

3. **Add Image Compression**
   - Compress sebelum upload
   - Reduce database size
   - Faster transfers

4. **Add Image Validation**
   - Check file type
   - Check image dimensions
   - Scan for malware

## 🔒 Security Notes

### Current:
- ✅ File validation di client
- ✅ API validation di server
- ✅ Binary data stored safely in DB

### Recommendations:
- [ ] Add file size validation di API
- [ ] Add file type validation (whitelist allowed types)
- [ ] Implement virus scanning untuk production
- [ ] Add rate limiting untuk API
- [ ] Encrypt sensitive images di database
- [ ] Implement backup strategy untuk fotos

## 📱 Mobile Optimization

### Camera Features:
- **Capture**: `capture="environment"` untuk belakang kamera
- **Accept**: `accept="image/*"` untuk semua format gambar
- **Multiple**: `multiple` attribute untuk select banyak foto

### Progressive Enhancement:
- Fallback ke file upload jika kamera tidak available
- Works on both Android & iOS

## 🐛 Troubleshooting

### Problem: "Table does not exist"
**Solution**: Jalankan SQL script `create-photos-table.sql` di Azure Query Editor

### Problem: Foto tidak upload
**Solution**: 
1. Check console errors (F12)
2. Check server logs (npm run dev output)
3. Verify foto size tidak terlalu besar
4. Check SQL user permissions

### Problem: Timeout saat upload foto besar
**Solution**:
1. Reduce image size
2. Compress image sebelum upload
3. Upgrade azure SQL tier untuk lebih resources
4. Implement chunked upload (advanced)

## 📚 Next Steps

1. **Add Photo Gallery View**
   - Display all photos untuk satu inspeksi
   - Gallery lightbox/carousel

2. **Add Photo Editing**
   - Crop, rotate, filter sebelum upload
   - Add annotations/markers

3. **Migrate to Blob Storage**
   - Better scalability
   - Cheaper storage costs
   - Better CDN support

4. **Add Analytics**
   - Track upload performance
   - Monitor storage usage

## 📖 Additional Resources

- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [File Input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)
- [Azure SQL VARBINARY](https://docs.microsoft.com/en-us/sql/t-sql/data-types/binary-and-varbinary-transact-sql)
- [Next.js File Upload](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#consuming-request-payload)
