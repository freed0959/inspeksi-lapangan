# 🔐 Setup Microsoft Account Authentication (Azure AD)

Panduan untuk setup Microsoft account login menggunakan Azure AD.

## 📋 Prerequisites

- Microsoft Azure account dengan admin access
- Akses ke Azure Active Directory (Azure AD)

## 🚀 Langkah Setup

### 1. Register Application di Azure AD

1. Buka [Azure Portal](https://portal.azure.com)
2. Cari **Azure Active Directory** → Buka
3. Di sidebar kiri, klik **App registrations** → **New registration**
4. Isi form:
   - **Name**: Inspeksi Lapangan v0
   - **Supported account types**: Akun di organisasi ini saja (Single tenant - Adaro)
   - **Redirect URI**: 
     - Platform: Web
     - URL: `http://localhost:3000/api/auth/callback/azure-ad`
   - Klik **Register**

### 2. Dapatkan Credentials

Setelah register, Anda akan di halaman App registration. Copy:
- **Application (client) ID** → `MICROSOFT_CLIENT_ID`
- **Directory (tenant) ID** → `MICROSOFT_TENANT_ID`

Untuk **Client Secret**:
1. Di sidebar, klik **Certificates & secrets**
2. Klik **New client secret**
3. Isi:
   - **Description**: NextAuth
   - **Expires**: 24 months
4. Klik **Add**
5. Copy value yang muncul → `MICROSOFT_CLIENT_SECRET`

⚠️ **PENTING**: Copy secret SEKARANG, tidak bisa copy lagi setelah refresh!

### 3. Setup API Permissions

1. Di sidebar, klik **API permissions**
2. Klik **Add a permission**
3. Pilih **Microsoft Graph**
4. Pilih **Delegated permissions**
5. Search & check:
   - `User.Read`
   - `email`
   - `profile`
6. Klik **Add permissions**
7. Klik **Grant admin consent for Adaro**

### 4. Setup Redirect URIs untuk Production

Setelah develop, tambah redirect URI untuk production:
1. Di sidebar, klik **Authentication**
2. Di bagian **Redirect URIs**, klik **Add URI**
3. Tambah:
   - `https://yourdomain.com/api/auth/callback/azure-ad`
4. Klik **Save**

### 5. Update .env.local

Update file `.env.local` di project root dengan credentials:

```env
# Azure SQL Connection (existing)
AZURE_SQL_SERVER=your-server.database.windows.net
AZURE_SQL_DATABASE=storagedb
AZURE_SQL_USER=qhsecomp_user
AZURE_SQL_PASSWORD=your-password

# Microsoft OAuth (NEW)
MICROSOFT_CLIENT_ID=your-client-id
MICROSOFT_CLIENT_SECRET=your-client-secret
MICROSOFT_TENANT_ID=your-tenant-id

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-generate-with: openssl rand -base64 32
```

### 6. Generate NEXTAUTH_SECRET

```bash
# Di terminal, jalankan:
openssl rand -base64 32

# Copy output ke .env.local sebagai NEXTAUTH_SECRET
```

Atau di Windows PowerShell:
```powershell
[Convert]::ToBase64String((1..32|ForEach-Object{Get-Random -Maximum 256}))
```

## ✅ Verification

Setelah setup:

1. **Dev Server Running?**
   ```bash
   npm run dev
   ```

2. **Buka http://localhost:3000**
   - Harus muncul button "Login with Microsoft"

3. **Klik Login**
   - Akan redirect ke Microsoft login
   - Login dengan Microsoft account dari Adaro (@adaro.com atau sesuai domain)

4. **Success?**
   - Setelah login, akan redirect ke home
   - Akan muncul user info di sidebar
   - Button "Logout" muncul

## 🔒 Security Notes

### Development:
- ✅ Menggunakan `http://localhost:3000` (development only)
- ✅ Single tenant (hanya Adaro employees)

### Production:
- [ ] Update NEXTAUTH_URL ke domain production Anda
- [ ] Update Redirect URI di Azure AD
- [ ] Gunakan HTTPS saja
- [ ] Rotate NEXTAUTH_SECRET secara berkala
- [ ] Setup CSRF protection (built-in NextAuth)
- [ ] Setup rate limiting untuk auth endpoint

## 🐛 Troubleshooting

### Error: "Invalid client secret"
**Solution**: Regenerate client secret di Azure AD

### Error: "Redirect URI mismatch"
**Solution**: Pastikan redirect URI di Azure AD match dengan app:
- Dev: `http://localhost:3000/api/auth/callback/azure-ad`
- Prod: `https://yourdomain.com/api/auth/callback/azure-ad`

### Error: "User not in organization"
**Solution**: User harus punya Microsoft account dari domain Adaro. Jika user luar, tambah sebagai guest di Azure AD jika diperlukan.

### Error: "NEXTAUTH_SECRET not set"
**Solution**: Generate dan set `NEXTAUTH_SECRET` di `.env.local`

## 📱 User Flow

```
1. User buka http://localhost:3000
2. Klik "Login with Microsoft"
3. Redirect ke https://login.microsoftonline.com
4. User login dengan Microsoft account Adaro
5. Consent screen (first time)
6. Redirect ke http://localhost:3000/api/auth/callback/azure-ad
7. NextAuth process token
8. Redirect ke dashboard
9. User info tersimpan di session
```

## 📚 Resources

- [Azure AD Documentation](https://docs.microsoft.com/en-us/azure/active-directory/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NextAuth Azure AD Provider](https://next-auth.js.org/providers/azure-ad)
- [MSAL Node Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)

## 🔄 Next Steps

1. ✅ Setup Azure AD Application (sudah dijelaskan di atas)
2. ✅ Update .env.local dengan credentials
3. ✅ Restart dev server
4. ✅ Test login di http://localhost:3000

Jika ada error, check console log dan troubleshooting section di atas!
