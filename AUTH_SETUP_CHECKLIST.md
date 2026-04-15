# ✅ Microsoft Authentication Setup Checklist

Panduan checklist step-by-step untuk setup Microsoft Account login.

## 📋 Fase 1: Azure AD Setup

### Di Azure Portal:

- [ ] Buka [Azure Portal](https://portal.azure.com)
- [ ] Cari & buka **Azure Active Directory**
- [ ] Klik **App registrations** → **New registration**
- [ ] Isi:
  - Name: `Inspeksi Lapangan v0`
  - Account type: `Accounts in this organizational directory only`
  - Redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`
- [ ] Klik **Register**
- [ ] Copy & save:
  - **Application (client) ID**
  - **Directory (tenant) ID**

### Create Client Secret:

- [ ] Sidebar → **Certificates & secrets**
- [ ] **+ New client secret**
- [ ] Description: `NextAuth`
- [ ] Expires: `24 months`
- [ ] **Copy value SEKARANG** (tidak bisa copy lagi!)
- [ ] Save securely

### Setup API Permissions:

- [ ] Sidebar → **API permissions**
- [ ] **+ Add a permission**
- [ ] **Microsoft Graph** → **Delegated permissions**
- [ ] Cari & check:
  - `email`
  - `openid`
  - `profile`
  - `User.Read`
- [ ] **Add permissions**
- [ ] **Grant admin consent** (jika perlu)

## 📝 Fase 2: Environment Configuration

Di project root, update `.env.local`:

```bash
# Copy dari Azure AD
MICROSOFT_CLIENT_ID=your-app-client-id
MICROSOFT_CLIENT_SECRET=your-client-secret
MICROSOFT_TENANT_ID=your-tenant-id

# NextAuth Setup
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-dengan-openssl-rand-base64-32
```

### Generate NEXTAUTH_SECRET:

```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32|ForEach-Object{Get-Random -Maximum 256}))
```

- [ ] Set `NEXTAUTH_SECRET` di `.env.local`
- [ ] Set `MICROSOFT_CLIENT_ID`, `CLIENT_SECRET`, `TENANT_ID`
- [ ] Set `NEXTAUTH_URL=http://localhost:3000`

## 🗄️ Fase 3: Database Setup

Di Azure Portal, buka SQL Database → Query Editor:

```sql
-- Run this script untuk add user tracking columns
ALTER TABLE inspeksi_lapangan ADD
  user_id VARCHAR(255),
  user_email VARCHAR(255),
  user_name VARCHAR(255);

CREATE INDEX idx_user_email ON inspeksi_lapangan(user_email);
```

- [ ] Run SQL script di Azure Query Editor
- [ ] Verify columns created dengan:
  ```sql
  SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'inspeksi_lapangan';
  ```

## 🚀 Fase 4: Server Startup

```bash
# Di terminal:
npm run dev
```

- [ ] Dev server running di http://localhost:3000
- [ ] Jangan ada error di console

## ✅ Fase 5: Testing

### Test 1: Login Flow
- [ ] Buka http://localhost:3000
- [ ] Harus redirect ke /login
- [ ] Click "Login dengan Microsoft"
- [ ] Login dengan Microsoft account Adaro
- [ ] Consent screen (first time)
- [ ] Redirect ke home page
- [ ] Header shows user name & email

### Test 2: Logout & Re-login
- [ ] Click **Logout** button
- [ ] Should redirect ke /login
- [ ] Accessing / again should redirect ke /login
- [ ] Login lagi untuk verify

### Test 3: Data Capture
- [ ] Login & isi form inspeksi
- [ ] Upload foto (optional)
- [ ] Submit
- [ ] Verify di Azure SQL:
  ```sql
  SELECT lokasi, user_email, user_name, created_at 
  FROM inspeksi_lapangan 
  ORDER BY created_at DESC;
  ```
- [ ] Verify user_email & user_name terisi

### Test 4: Multiple Submitters
- [ ] Logout
- [ ] Login dengan user Microsoft berbeda (jika ada test account lain)
- [ ] Submit inspeksi
- [ ] Verify user info terisi dengan user baru

## 🐛 Troubleshooting

Jika ada error, check:

- [ ] `.env.local` file exists & has all variables
- [ ] `MICROSOFT_CLIENT_ID`, `CLIENTSECRET`, `TENANT_ID` copied correctly
- [ ] No trailing spaces di environment variables
- [ ] Database columns added dengan SQL script
- [ ] Dev server restarted setelah .env.local update
- [ ] Browser cache cleared (Ctrl+Shift+Del)
- [ ] Check console F12 untuk error messages

## 📚 Documentation

Untuk detail lengkap, baca:
- `AUTH_IMPLEMENTATION.md` - Complete guide
- `MICROSOFT_AUTH_SETUP.md` - Step-by-step setup instructions

## 🎉 Done!

Jika semua checkbox ✅, authentication system sudah ready!

### Next Steps:

1. **Team Training** - Beri tahu team cara login & submit
2. **Testing di Staging** - Test dengan actual Adaro accounts
3. **Production Setup** - Update Azure AD redirect URI & NEXTAUTH_URL untuk production domain
4. **Monitoring** - Setup alerts untuk login failures

---

**Questions?** Check troubleshooting docs atau console error messages.
