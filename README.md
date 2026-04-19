<<<<<<< HEAD
# NORULES COMMUNITY

Website komunitas full-stack untuk `NORULES COMMUNITY` dengan stack:

- `Next.js 14` App Router
- `TypeScript`
- `Tailwind CSS`
- `MySQL`
- API internal via `Next.js Route Handlers`
- Auth admin via cookie session JWT
- Upload file lokal ke `public/uploads`

## Fitur Utama

- Beranda komunitas dengan tema emas-hitam dan background partikel
- Daftar member, detail profil member, rules, blacklist, dan join wizard 5 langkah
- QR code tester WhatsApp dengan download PNG
- Form kritik, saran, dan pengaduan
- Panel admin dengan CRUD:
  - Members
  - Events
  - Tester Officers
  - Blacklist
  - Feedback
  - Recruitment Status
  - Password Admin
- Upload foto member dan banner event

## Struktur Penting

```text
app/                halaman dan API routes Next.js
components/         komponen UI publik dan admin
lib/                helper database, data, session, upload
public/assets/      logo komunitas
public/uploads/     hasil upload runtime
database/           schema MySQL
```

## Setup Lokal

1. Install dependency:

```bash
npm install
```

2. Copy file env:

```bash
copy .env.example .env
```

3. Isi `.env`:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=norules_community
JWT_SECRET=ganti-dengan-secret-yang-panjang-dan-acak
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Import schema MySQL dari:

```text
database/norules_community.sql
```

5. Jalankan development:

```bash
npm run dev
```

6. Buka:

```text
http://localhost:3000
```

## Login Admin

Default seed admin dari SQL:

- Username: `admin`
- Password: `admin123`

Setelah login pertama, segera ganti password dari panel `Settings`.

## Login Member

Member sekarang bisa login memakai:

- `nickname`
- `password member`

Password member dibuat saat registrasi, dan bisa di-reset oleh admin dari panel `Members`.

## Migrasi Database Lama

Kalau database Anda sudah terlanjur ada, jangan import ulang seluruh schema. Jalankan file migrasi ini di MySQL Workbench:

```text
database/migrations/2026-04-16-member-auth-and-settings.sql
```

Migrasi ini menambahkan:

- kolom `member_password_hash`
- unique index untuk `nickname`
- tabel `settings`
- tabel `admins`
- seed awal admin dan recruitment status

Jika MySQL Anda tidak mendukung `ADD COLUMN IF NOT EXISTS` atau `CREATE INDEX IF NOT EXISTS`, jalankan versi manual berikut:

```sql
USE norules_community;

ALTER TABLE members ADD COLUMN member_password_hash varchar(255) NULL AFTER photo_url;
ALTER TABLE members ADD UNIQUE INDEX uq_members_nickname (nickname);

CREATE TABLE IF NOT EXISTS settings (
  `key` varchar(120) PRIMARY KEY,
  `value` text NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
  id char(36) PRIMARY KEY DEFAULT (UUID()),
  username varchar(80) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL
);
```

## Upload File

Upload file saat ini disimpan ke:

```text
public/uploads/members
public/uploads/events
```

Ini cocok untuk VPS atau hosting Node.js dengan storage persisten. Jika nanti Anda ingin deploy ke platform serverless, sebaiknya kita pindahkan upload ke object storage seperti S3, Cloudinary, atau Supabase Storage.

## Deploy Hosting

Paling cocok untuk kebutuhan Anda:

1. VPS Node.js + MySQL
2. cPanel Node.js hosting yang mendukung Next.js
3. Ubuntu server + Nginx + PM2

### Langkah deploy umum

1. Upload project ke server.
2. Install Node.js 18+ atau 20+.
3. Buat database MySQL.
4. Jika database baru:
   import `database/norules_community.sql`.
5. Jika database lama:
   jalankan `database/migrations/2026-04-16-member-auth-and-settings.sql`.
6. Isi file `.env` produksi.
7. Jalankan:

```bash
npm install
npm run build
npm run start
```

8. Reverse proxy dengan Nginx ke port app Anda.

### Contoh `.env` production

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=nama_user_db
MYSQL_PASSWORD=password_db_anda
MYSQL_DATABASE=norules_community
JWT_SECRET=ganti-dengan-random-secret-minimal-32-karakter
NEXT_PUBLIC_SITE_URL=https://domain-anda.com
NODE_ENV=production
```

### Checklist sebelum go-live

1. Pastikan `JWT_SECRET` production sudah diisi dan berbeda dari lokal.
2. Pastikan database MySQL bisa diakses dari server app.
3. Pastikan folder `public/uploads/members` dan `public/uploads/events` bisa ditulis proses Node.js.
4. Pastikan domain sudah memakai `HTTPS`.
5. Login admin berhasil di production.
6. Login member berhasil di production.
7. Coba registrasi member baru.
8. Coba upload banner event dan foto member.
9. Coba ganti nickname member dari akun member.
10. Coba logout admin dan logout member.

### Catatan penting produksi

- Gunakan `HTTPS` untuk fitur webcam / face scan.
- Gunakan folder upload yang punya izin tulis.
- Cookie session sudah otomatis `secure` saat `NODE_ENV=production`.
- Backup folder `public/uploads` dan database secara rutin.
- Jika hosting Anda bersifat serverless, upload lokal ke `public/uploads` tidak disarankan.

## Verifikasi

Perintah berikut sudah lolos di workspace ini:

```bash
npm run build
npm run lint
```
=======
# Project-Komunitas-NORULESCOMMUNITY
>>>>>>> 218a563ef21070b93660f59b5c36c9940346c36e
