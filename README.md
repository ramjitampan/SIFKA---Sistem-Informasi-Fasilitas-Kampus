<div align="center">

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="90"/>

# ✨ SIFKA

Documentation could be found here: [https://ramjitampan.github.io/SIFKA---Sistem-Informasi-Fasilitas-Kampus/](https://ramjitampan.github.io/SIFKA---Sistem-Informasi-Fasilitas-Kampus/)

## Sistem Informasi Fasilitas Kampus

### *Smart Campus Facility Management Platform*

<p align="center">
Satu platform modern untuk memantau, mengelola, dan melaporkan fasilitas kampus secara real-time.
</p>

<br/>

![Version](https://img.shields.io/badge/Version-1.0.0-5D5FEF?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)
![Laravel](https://img.shields.io/badge/Laravel-API-FF2D20?style=for-the-badge&logo=laravel)
![License](https://img.shields.io/badge/License-Educational-blue?style=for-the-badge)

</div>

---

# 📖 Tentang Project

**SIFKA (Sistem Informasi Fasilitas Kampus)** adalah platform berbasis web yang dirancang untuk membantu civitas akademika dalam:

- 🏢 Mengakses informasi fasilitas kampus
- 📍 Mengetahui lokasi gedung & fasilitas
- 📝 Melaporkan kerusakan fasilitas
- 📊 Memantau status laporan secara transparan
- ⚡ Mempermudah pengelolaan fasilitas oleh admin kampus

Project ini dibuat untuk meningkatkan efisiensi pengelolaan sarana kampus melalui sistem digital yang modern dan interaktif.

---

# 🚀 Fitur Utama

## 👨‍🎓 User Features

| Feature | Deskripsi |
|----------|------------|
| 🏠 Dashboard | Menampilkan statistik dan aktivitas terbaru |
| 🗺️ Jelajahi Fasilitas | Melihat fasilitas kampus berdasarkan kategori |
| 🏢 Data Gedung | Informasi detail gedung dan fasilitas |
| 📸 Laporan Kerusakan | Upload laporan dengan foto & lokasi GPS |
| 📋 Riwayat Laporan | Melihat progres dan status laporan |

---

## 🛠️ Admin Features

| Feature | Deskripsi |
|----------|------------|
| 📊 Dashboard Analytics | Statistik kondisi fasilitas kampus |
| 🏢 Manajemen Gedung | CRUD data gedung |
| 🏷️ Manajemen Kategori | Pengelolaan kategori fasilitas |
| 🗺️ Manajemen Fasilitas | Kelola fasilitas kampus |
| 📋 Manajemen Laporan | Validasi & update status laporan |

---

# 🧩 Tech Stack

<div align="center">

| Frontend | Backend |
|-----------|----------|
| ⚛️ React 19 | 🔴 Laravel |
| ⚡ Vite 8 | 🔑 Sanctum Authentication |
| 🎨 Framer Motion | 🌐 REST API |
| 🧭 React Router | 🗄️ Database Integration |
| 📦 Zustand | 🔐 API Security |
| 📊 Recharts | 📡 JSON Response |

</div>

---

# ⚙️ Installation Guide

## 📌 Requirements

Sebelum menjalankan project, pastikan sudah menginstall:

- Node.js v18+
- NPM / Yarn
- Backend Laravel API aktif
- Git

---

## 🔧 Clone Repository

```bash
git clone https://github.com/ramjitampan/SIFKA---Sistem-Informasi-Fasilitas-Kampus.git
````

Masuk ke folder project:

```bash
cd SIFKA---Sistem-Informasi-Fasilitas-Kampus
```

---

## 📦 Install Dependencies

```bash
npm install
```

---

## ▶️ Run Development Server

```bash
npm run dev
```

---

## 🌐 Open Browser

```bash
http://localhost:5173
```

---

# 📁 Project Structure

```bash
sifka/
│
├── 📁 public/
├── 📁 src/
│   ├── 📁 api/
│   │   └── API configuration & services
│   │
│   ├── 📁 components/
│   │   ├── 📁 layout/
│   │   └── 📁 ui/
│   │
│   ├── 📁 pages/
│   │   ├── 📁 admin/
│   │   ├── 📁 auth/
│   │   └── 📁 user/
│   │
│   ├── 📁 store/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
├── index.html
└── .gitignore
```

---

# 🔐 Access Control

| Role       | Permissions                        |
| ---------- | ---------------------------------- |
| 👑 Admin   | Full management access             |
| 👨‍🎓 User | Access facilities & create reports |

---

# 📡 API Endpoint

```bash
Base URL:
http://127.0.0.1:8000/api
```

| Method | Endpoint      | Description       |
| ------ | ------------- | ----------------- |
| POST   | `/login`      | Login account     |
| POST   | `/register`   | Register account  |
| GET    | `/buildings`  | Get building data |
| GET    | `/facilities` | Get facilities    |
| GET    | `/categories` | Get categories    |
| GET    | `/reports`    | Get reports       |
| POST   | `/reports`    | Create new report |

---

# 👨‍💻 Development Team

<div align="center">

## Frontend Developer

### Ramzy Junfaris Hamonangan

💻 UI/UX • Frontend Architecture • React Developer

---

## Backend Developer

### Afif Irham Nobel

🗄️ Backend System • REST API • Database Management

</div>

---

# 🎯 Project Goals

* Digitalisasi fasilitas kampus
* Mempermudah pelaporan kerusakan
* Transparansi pengelolaan fasilitas
* Sistem monitoring modern berbasis web

---

# 📸 Preview

> Tambahkan screenshot project di sini nanti ✨

```bash
/assets/preview-dashboard.png
/assets/preview-report.png
```

---

# ❤️ Credits

<div align="center">

### Dibuat untuk matakuliah Client Service

## ✨ SIFKA — Semester 6 Project

</div>
