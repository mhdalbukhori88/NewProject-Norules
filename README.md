# NORULES COMMUNITY

Website komunitas full-stack untuk `NORULES COMMUNITY` dengan stack:

- `Next.js 14` App Router
- `TypeScript`
- `Tailwind CSS`
- `MySQL`
- API internal via `Next.js Route Handlers`
- Auth admin via cookie session JWT

## Fitur Utama

- Beranda komunitas dengan tema emas-hitam dan background partikel
- Daftar member, detail profil member, rules, blacklist, dan join wizard
- Form kritik, saran, dan pengaduan
- Panel admin untuk data member, event, tester, blacklist, feedback, dan settings

## Struktur Penting

```text
app/                halaman dan API routes Next.js
components/         komponen UI publik dan admin
lib/                helper database, session, dan upload
public/assets/      logo komunitas
database/           schema MySQL
backend/            folder backend lama, tidak dipakai oleh deploy Vercel untuk Next.js ini
```

## Setup Lokal

1. Install dependency:

```bash
npm install
```

2. Copy environment file:

```bash
copy .env.example .env.local
```

3. Isi `.env.local` sesuai database Anda.

4. Import schema MySQL dari:

```text
database/norules_community.sql
```

5. Jalankan development:

```bash
npm run dev
```

## Deploy ke Vercel

Project ini harus dideploy sebagai **Next.js project biasa**, bukan memakai `experimentalServices`.

Set environment variables berikut di Vercel:

```env
MYSQL_HOST=
MYSQL_PORT=3306
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
JWT_SECRET=
NEXT_PUBLIC_SITE_URL=
BLOB_READ_WRITE_TOKEN=
```

### Kenapa deploy sebelumnya gagal

Konfigurasi `experimentalServices` tidak cocok untuk repo ini karena:

- fitur itu bukan jalur deploy standar untuk project Next.js biasa
- aplikasi ini sudah punya backend internal di `app/api`
- folder `backend/` bukan service terpisah yang dipakai build utama Next.js

### Catatan penting

Project ini sekarang memakai **Vercel Blob** untuk upload saat production jika `BLOB_READ_WRITE_TOKEN` tersedia. Saat lokal tanpa token, upload tetap fallback ke `public/uploads`.
