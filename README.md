<div align="center">

# 🎓 SIFKA
### Sistem Informasi Fasilitas Kampus

> *Temukan, pantau, dan laporkan fasilitas kampus dalam satu platform.*

![Version](https://img.shields.io/badge/versi-1.0.0-4f7cff?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite)
![Laravel](https://img.shields.io/badge/Laravel-API-ff2d20?style=for-the-badge&logo=laravel)

</div>

---

## ✨ Tentang Proyek

**SIFKA** adalah aplikasi web yang dirancang untuk memudahkan civitas kampus dalam mengakses informasi fasilitas, gedung, dan melaporkan kerusakan atau masalah yang ditemukan di lingkungan kampus.

---

## 🚀 Fitur Utama

### 👤 Portal User
| Fitur | Deskripsi |
|-------|-----------|
| 🏠 Beranda | Dashboard personal dengan statistik & laporan terbaru |
| 🗺️ Fasilitas | Jelajahi semua fasilitas kampus dengan filter kategori |
| 🏢 Gedung | Lihat daftar gedung beserta fasilitas di dalamnya |
| 📝 Buat Laporan | Kirim laporan kerusakan lengkap dengan foto & lokasi GPS |
| 📋 Laporan Saya | Pantau status laporan yang sudah dikirimkan |

### 🔐 Portal Admin
| Fitur | Deskripsi |
|-------|-----------|
| 📊 Dashboard | Statistik & grafik kondisi fasilitas kampus |
| 🏢 Manajemen Gedung | Kelola data gedung kampus |
| 🏷️ Manajemen Kategori | Atur kategori fasilitas |
| 🗺️ Manajemen Fasilitas | Kelola semua fasilitas kampus |
| 📋 Manajemen Laporan | Tinjau & perbarui status laporan masuk |

---

## 🛠️ Teknologi

```
Frontend          Backend
─────────────     ─────────────
⚡ Vite 8         🔴 Laravel
⚛️ React 19       🔑 Sanctum Auth
🎨 Framer Motion  🗄️ REST API
🔀 React Router
📦 Zustand
📊 Recharts
```

---

## ⚙️ Cara Menjalankan

### Prasyarat
- Node.js versi 18 ke atas
- Backend Laravel sudah berjalan di `http://127.0.0.1:8000`

### Langkah Instalasi

**1. Clone repositori**
```bash
git clone https://github.com/ramjitampan/SIFKA---Sistem-Informasi-Fasilitas-Kampus.git
cd SIFKA---Sistem-Informasi-Fasilitas-Kampus
```

**2. Install dependensi**
```bash
npm install
```

**3. Jalankan aplikasi**
```bash
npm run dev
```

**4. Buka di browser**
```
http://localhost:5173
```

---

## 📁 Struktur Proyek

```
sifka/
├── 📁 public/
├── 📁 src/
│   ├── 📁 api/              # Konfigurasi & service API
│   ├── 📁 components/
│   │   ├── 📁 layout/       # AdminLayout, UserLayout
│   │   └── 📁 ui/           # Komponen reusable
│   ├── 📁 pages/
│   │   ├── 📁 admin/        # Halaman khusus admin
│   │   ├── 📁 auth/         # Login & Register
│   │   └── 📁 user/         # Halaman khusus user
│   ├── 📁 store/            # State management (Zustand)
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## 🔐 Hak Akses

```
Role     Akses
──────   ──────────────────────────────────────────
admin    Dashboard, CRUD gedung/fasilitas/kategori,
         kelola & update status semua laporan
user     Lihat fasilitas & gedung,
         buat & hapus laporan sendiri
```

---

## 📡 API Endpoint

Base URL: `http://127.0.0.1:8000/api`

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/login` | Login pengguna |
| POST | `/register` | Registrasi pengguna |
| GET | `/buildings` | Daftar gedung |
| GET | `/facilities` | Daftar fasilitas |
| GET | `/categories` | Daftar kategori |
| GET | `/reports` | Daftar laporan |
| POST | `/reports` | Kirim laporan baru |

---

## 👨‍💻 Developer

<div align="center">

Dibuat dengan ❤️ untuk membangun kampus yang lebih baik

**SIFKA** — *Semester 6 · Client Service*

</div>
