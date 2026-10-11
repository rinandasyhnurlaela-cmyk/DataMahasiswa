# 🎓 EduGrade Studio — Dashboard Analitik Nilai Mahasiswa

**EduGrade Studio** adalah aplikasi web modern berbasis *Client-Side* untuk manajemen, pengolahan, serta analitik performa nilai mahasiswa secara interaktif dan *real-time*.

Aplikasi ini dikembangkan dengan antarmuka **Landscape Dashboard** bertema *Vibrant Caramel & Copper Brown* yang estetis, terstruktur, serta kaya fitur analitik.

---

## 🌟 Fitur Utama

### 1. 📊 Analisis & Statistik Real-Time (KPI Metrics)
- **Ringkasan Cepat**: Total mahasiswa terdaftar, rata-rata nilai kelas, nilai tertinggi, dan nilai terendah.
- **Tingkat Kelulusan**: Menghitung otomatis persentase kelulusan beserta rasio mahasiswa yang lulus dan belum lulus.
- **Grafik Distribusi Predikat Nilai**: *Progress bar* visual untuk sebaran predikat:
  - **A** (Nilai $\ge 85$)
  - **B** (Nilai $75 - 84$)
  - **C** (Nilai $60 - 74$)
  - **D** (Nilai $< 60$)

### 2. 📋 Tabel Mahasiswa Interaktif & Modern
- **Profil Avatar Dinamis**: Otomatis menghasilkan avatar inisial nama mahasiswa.
- **Visual Score Bar**: Kolom nilai dilengkapi mini progress bar berwarna dinamis sesuai rentang skor.
- **Pencarian Instan (Live Search)**: Filter pencarian nama, NIM, atau program studi secara *real-time*.
- **Filter Multi-Kategori**:
  - Filter kelulusan (*Semua*, *Lulus*, *Belum Lulus*).
  - Filter predikat (*A*, *B*, *C*, *D*).
- **Pengurutan (Sorting)**: Urutkan berdasarkan nilai tertinggi/terendah, abjad nama (A–Z), atau NIM.

### 3. ⚙️ Manajemen Data & Utilitas
- **CRUD Lengkap**: Tambah data, Edit data via modal pop-up, dan Hapus data dengan konfirmasi aman.
- **Penyimpanan Permanen (LocalStorage)**: Data tetap tersimpan rapi di browser meskipun halaman di-refresh atau ditutup.
- **📥 Unduh CSV / Excel**: Ekspor seluruh daftar tabel mahasiswa langsung ke format file `.csv`.
- **✨ Data Contoh (Demo)**: Tombol instan untuk memuat 5 data contoh untuk keperluan presentasi/pengujian.
- **🕒 Jam & Tanggal Real-Time**: Widget waktu aktif dengan format tanggal Indonesia dan penunjuk detik live.

---

## 🗂️ Struktur Berkas

```plaintext
DataMahasiswa/
├── index.html     # Struktur markup layout dashboard & modal
├── style.css      # Styling tema coklat vibrant, layout grid landscape & animasi
├── script.js      # Logika komputasi percabangan, perulangan, DOM & storage
└── README.md      # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini dibuat murni dengan teknologi web standar (*Vanilla Web Tech*), sehingga tidak memerlukan instalasi dependensi tambahan (*zero setup*):

1. **Buka Langsung di Browser**:
   - Cukup klik dua kali (double-click) berkas [index.html](file:///c:/Users/Nanda/Desktop/DataMahasiswa/index.html), atau klik kanan lalu pilih **Open with Google Chrome / Microsoft Edge / Firefox**.
2. **Atau Menggunakan Live Server (VS Code / Antigravity)**:
   - Klik kanan pada [index.html](file:///c:/Users/Nanda/Desktop/DataMahasiswa/index.html) dan pilih **Open with Live Server**.

---

## 💡 Konsep Pemrograman yang Diterapkan

- **Percabangan (`if-else` & `switch`)**: Digunakan untuk penentuan kelulusan ($\ge 60$) serta pengkategorian predikat nilai (A, B, C, D).
- **Perulangan (`for` & `forEach`)**: Digunakan untuk iterasi kalkulasi rata-rata nilai, pencarian min/max, sebaran distribusi, dan perenderan baris tabel.
- **Manipulasi DOM Modern**: Pembuatan elemen tabel secara dinamis, penanganan modal dialog, animasi badge, dan event listener reaktif.
- **Web Storage API**: Integrasi `localStorage` untuk persistensi data pengguna.
- **File API & Blob**: Pembuatan tautan unduhan file CSV secara dinamis di browser.

---

## 🎨 Palet Warna & Tipografi

- **Font**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (Google Fonts)
- **Tema**: *Vibrant Caramel & Copper Brown*
  - Warna Utama: `#b45309`, `#d97706`, `#ea580c`
  - Warna Teks: `#29180c` (Dark Roast), `#6c472b` (Hazel)
  - Latar Halaman: `#fbf6f0` (Warm Creamy Linen)
