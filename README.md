# Desa Dlemer - Village Profile & Marketplace CMS

Portal resmi profil desa dan marketplace produk unggulan **Desa Dlemer**, Kecamatan Kwanyar, Kabupaten Bangkalan, Madura, Jawa Timur.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Firebase Firestore
- **Auth:** Firebase Google Sign-In
- **Deployment:** Vercel (recommended)

## Fitur

- 🏠 **Landing Page** — Hero, tentang desa, statistik, potensi unggulan, preview produk
- 🛒 **Marketplace** — Katalog produk warga dengan filter kategori & order via WhatsApp
- 🔐 **Admin Dashboard** — Kelola profil desa, visi misi, demografi, potensi unggulan, dan produk
- 📱 **Responsive** — Mobile-first design

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd cms-and-village-platform
npm install
```

### 2. Firebase Configuration

Buat file `.env.local` di root project (lihat `.env.local.example`):

```env
# Firebase Web SDK (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin SDK (Server)
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=...
```

### 3. Firestore Setup

1. Buat database Firestore di Firebase Console 
2. Enable Cloud Firestore API di Google Cloud Console

### 4. Seed Database

```
http://localhost:3000/api/seed?uid=YOUR_GOOGLE_UID
```

### 5. Run

```bash
npm run dev
```

## Arsitektur

```
app/
├── page.tsx              # Homepage (ISR, revalidate 1h)
├── products/page.tsx     # Marketplace (client-side)
├── login/page.tsx        # Google Sign-In
├── admin/page.tsx        # Dashboard (client-side auth)
├── api/
│   ├── village-profile/  # GET/PUT profil desa
│   ├── products/         # CRUD produk
│   └── seed/             # Dev-only database seeder
components/
├── navbar.tsx            # Navbar publik
├── footer.tsx            # Footer publik
├── admin/                # Komponen admin dashboard
│   ├── village-profile-form.tsx
│   ├── product-management.tsx
│   ├── product-form.tsx
│   └── product-list.tsx
lib/
├── types.ts              # TypeScript interfaces
├── firebase/
│   ├── config.ts         # Client SDK init
│   ├── admin.ts          # Admin SDK init (lazy)
│   ├── utils.ts          # Firestore utilities
│   ├── verify-admin.ts   # Token verification
│   └── mock-data.ts      # Fallback data Desa Dlemer
hooks/
└── useAuth.ts            # React auth hook
```

## Firestore Collections

| Collection | Document | Deskripsi |
|---|---|---|
| `village_profile` | `main-village` | Data profil desa |
| `products` | auto-id | Katalog produk |
| `admin_users` | user UID | Daftar admin |
