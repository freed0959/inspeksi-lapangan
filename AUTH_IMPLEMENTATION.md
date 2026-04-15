# 🔐 Microsoft Account Login - Implementation Guide

Panduan implementasi Microsoft Azure AD authentication untuk Inspeksi Lapangan v0.

## ✨ Features

- ✅ Microsoft Account login (Azure AD single-tenant untuk Adaro)
- ✅ Auto redirect ke login jika not authenticated
- ✅ Session management dengan NextAuth.js
- ✅ User info display di header
- ✅ Logout functionality
- ✅ Track submitter di setiap inspeksi
- ✅ Automatic user email & name capture

## 📋 Setup Steps

### Step 1: Register Application di Azure AD

1. Buka [Azure Portal](https://portal.azure.com)
2. Cari **Azure Active Directory** → Buka
3. Di sidebar, klik **App registrations** → **+ New registration**
4. Isi form:
   - **Name**: `Inspeksi Lapangan v0`
   - **Supported account types**: `Accounts in this organizational directory only (Single tenant)`
   - **Redirect URI**:
     - Platform: `Web`
     - URL: `http://localhost:3000/api/auth/callback/azure-ad`
   - Klik **Register** (bsa ambil note Application ID dan Tenant ID di sini)

### Step 2: Create Client Secret

1. Di halaman App registration, sidebar klik **Certificates & secrets**
2. Klik **+ New client secret**
3. Isi:
   - Description: `NextAuth`
   - Expires: `24 months`
4. Klik **Add**
5. **COPY VALUE SEKARANG** (tidak bisa copy lagi setelah refresh)

### Step 3: Setup API Permissions

1. Sidebar klik **API permissions**
2. Klik **+ Add a permission**
3. Pilih **Microsoft Graph**
4. Pilih **Delegated permissions**
5. Search dan check masing-masing:
   - `User.Read`
   - `email`
   - `profile`
   - `openid`
6. Klik **Add permissions**
7. Klik **Grant admin consent for [organization-name]** (jika admin)

### Step 4: Update .env.local

```bash
# Copy dari Azure AD
MICROSOFT_CLIENT_ID=your-app-client-id
MICROSOFT_CLIENT_SECRET=your-client-secret
MICROSOFT_TENANT_ID=your-tenant-id

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-random-secret
```

Generate NEXTAUTH_SECRET:
```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32|ForEach-Object{Get-Random -Maximum 256}))
```

### Step 5: Run Database Setup Scripts

Di Azure Portal → Query Editor, jalankan:

```sql
-- Tambah user tracking columns
ALTER TABLE inspeksi_lapangan ADD
  user_id VARCHAR(255),
  user_email VARCHAR(255),
  user_name VARCHAR(255);

CREATE INDEX idx_user_email ON inspeksi_lapangan(user_email);
```

### Step 6: Restart Development Server

```bash
npm run dev
```

## 🎯 How It Works

### User Flow:

```
1. User akses http://localhost:3000
2. Middleware check session
3. Jika tidak ada session → redirect ke /login
4. User klik "Login dengan Microsoft"
5. Redirect ke Microsoft login page
6. User login dengan Microsoft account (@adaro.com or tenant domain)
7. Consent screen (first time only)
8. Redirect ke callback URL dengan auth code
9. NextAuth exchange code untuk token
10. Session created & stored
11. Redirect ke home page
12. User dapat access dan submit inspeksi
```

### Data Tracking:

Saat submit inspeksi, system otomatis capture:
- `user_email` - Email address dari Microsoft account
- `user_name` - Display name dari Microsoft account
- Data tersimpan di kolom `user_email` dan `user_name` di table `inspeksi_lapangan`

## 🔒 Security Features

- ✅ Single tenant (hanya Adaro employees)
- ✅ JWT-based session (tidak store password)
- ✅ Secure token exchange (backend-to-backend)
- ✅ CSRF protection (built-in NextAuth)
- ✅ Secure session cookie (HttpOnly, Secure flags)

### Security Checklist untuk Production:

- [ ] Update NEXTAUTH_URL ke domain production
- [ ] Update Redirect URI di Azure AD untuk production domain
- [ ] Use HTTPS saja (tidak http)
- [ ] Rotate NEXTAUTH_SECRET secara berkala
- [ ] Enable additional API scopes jika diperlukan
- [ ] Setup audit logging untuk login attempts
- [ ] Configure IP restrictions di Azure AD jika perlu
- [ ] Enable Conditional Access policies di Azure AD
- [ ] Setup MFA untuk admin accounts

## 📁 Files Modified

### New Files Created:
- `src/auth.config.ts` - NextAuth configuration
- `src/app/api/auth/[...nextauth]/route.ts` - Auth API route
- `src/app/login/page.tsx` - Login page
- `src/providers.tsx` - SessionProvider wrapper
- `src/middleware.ts` - Protected routes middleware
- `MICROSOFT_AUTH_SETUP.md` - Setup instructions
- `scripts/add-submitter-columns.sql` - Database schema update

### Modified Files:
- `src/app/layout.tsx` - Wrapped with SessionProvider
- `src/app/page.tsx` - Added auth handling & user tracking
- `src/app/api/inspeksi/route.ts` - Capture user info
- `.env.local.example` - Added OAuth variables

## 🧪 Testing

### 1. Login Flow Test
```bash
1. npm run dev
2. Buka http://localhost:3000
3. Should redirect ke /login
4. Click "Login dengan Microsoft"
5. Login dengan test account
6. Should redirect ke home page
7. Check header shows user name & email
```

### 2. Data Capture Test
```bash
1. Logged in user submit inspeksi
2. Buka Azure SQL Query Editor
3. Run: SELECT id, lokasi, user_email, user_name FROM inspeksi_lapangan;
4. Verify user_email dan user_name terisi
```

### 3. Logout Test
```bash
1. Click Logout button
2. Should redirect ke /login
3. Accessing / should redirect ke /login
```

## 🐛 Troubleshooting

### Error: "Invalid client secret"
**Solution**: 
- Verify client secret di .env.local match dengan Azure AD
- Regenerate client secret jika lupa

###  Error: "Redirect URI mismatch"
**Solution**:
- Dev: `http://localhost:3000/api/auth/callback/azure-ad`
- Prod: `https://yourdomain.com/api/auth/callback/azure-ad`
- Verify URL exactly match di Azure AD
- Jangan include `?` atau trailing slash

### Error: "NEXTAUTH_SECRET not set"
**Solution**:
- Generate secret: `openssl rand -base64 32`
- Add ke .env.local: `NEXTAUTH_SECRET=generated-value`
- Restart server

### Error: "User not in organization"
**Solution**:
- User harus punya account di domain Adaro
- Jika external user, invite as guest di Azure AD
- Check tenant ID di Azure AD match dengan .env

### Blank page setelah login
**Solution**:
- Clear browser cache & cookies
- Check console untuk errors (F12)
- Verify NEXTAUTH_SECRET set
- Restart dev server

## 📊 Database Schema

### inspeksi_lapangan (updated)
```sql
id (INT, PK)
lokasi (VARCHAR 255)
tanggal (DATETIME)
penginspeksi (VARCHAR 255)
kategori (VARCHAR 50)
deskripsi (VARCHAR MAX)
user_id (VARCHAR 255) -- NEW: Microsoft user ID
user_email (VARCHAR 255) -- NEW: Microsoft user email
user_name (VARCHAR 255) -- NEW: Microsoft user name
created_at (DATETIME)
updated_at (DATETIME)
```

## 🚀 Production Deployment

### Vercel Deployment:

1. **Set Environment Variables** di Vercel project:
   ```
   MICROSOFT_CLIENT_ID=***
   MICROSOFT_CLIENT_SECRET=***
   MICROSOFT_TENANT_ID=***
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=***
   AZURE_SQL_SERVER=***
   AZURE_SQL_DATABASE=***
   AZURE_SQL_USER=***
   AZURE_SQL_PASSWORD=***
   ```

2. **Update Azure AD** redirect URI:
   - Add: `https://yourdomain.com/api/auth/callback/azure-ad`

3. **Update Domain** di Azure AD jika custom domain

### Other Cloud Platforms:

Process similar, just set environment variables sesuai platform (AWS, GCP, Azure App Service, dll).

## 📚 Resources

- [NextAuth.js Docs](https://next-auth.js.org/)
- [NextAuth Azure AD](https://next-auth.js.org/providers/azure-ad)
- [Azure AD Docs](https://docs.microsoft.com/en-us/azure/active-directory/)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Session Tokens](https://next-auth.js.org/architecture/security)

## ✅ Checklist Completion

- [ ] Register app di Azure AD
- [ ] Get Client ID, Secret, Tenant ID
- [ ] Setup API permissions
- [ ] Update .env.local dengan credentials
- [ ] Run database scripts
- [ ] Restart dev server
- [ ] Test login flow
- [ ] Test data capture
- [ ] Test logout
- [ ] Ready untuk production deployment

Selamat! Authentication system sudah siap digunakan! 🎉
