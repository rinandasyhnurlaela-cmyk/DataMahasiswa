// ===== 1. Mengambil elemen dari HTML =====
const form = document.getElementById('formMahasiswa');
const namaInput = document.getElementById('nama');
const nimInput = document.getElementById('nim');
const prodiInput = document.getElementById('prodi');
const nilaiInput = document.getElementById('nilai');
const daftar = document.getElementById('daftarMahasiswa');
const pesan = document.getElementById('pesan');
const jumlah = document.getElementById('jumlah');
const totalDataCount = document.getElementById('totalDataCount');
const tombolReset = document.getElementById('tombolReset');
const btnSampleData = document.getElementById('btnSampleData');
const btnExportCSV = document.getElementById('btnExportCSV');

// Elemen Search & Filter & Sort
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const filterPredikat = document.getElementById('filterPredikat');
const sortData = document.getElementById('sortData');

// Elemen Modal Edit
const modalEdit = document.getElementById('modalEdit');
const formEdit = document.getElementById('formEdit');
const editIndex = document.getElementById('editIndex');
const editNama = document.getElementById('editNama');
const editNim = document.getElementById('editNim');
const editProdi = document.getElementById('editProdi');
const editNilai = document.getElementById('editNilai');
const btnBatalEdit = document.getElementById('btnBatalEdit');
const btnCancelModal = document.getElementById('btnCancelModal');

// Elemen statistik & grafik
const statTotal = document.getElementById('statTotal');
const statRataRata = document.getElementById('statRataRata');
const statTertinggi = document.getElementById('statTertinggi');
const statTerendah = document.getElementById('statTerendah');
const statPersenLulus = document.getElementById('statPersenLulus');
const statDetailLulus = document.getElementById('statDetailLulus');

// Elemen tanggal & jam
const liveDate = document.getElementById('liveDate');
const liveTime = document.getElementById('liveTime');

// Elemen bar distribusi & jumlah predikat
const barA = document.getElementById('barA');
const barB = document.getElementById('barB');
const barC = document.getElementById('barC');
const barD = document.getElementById('barD');
const countA = document.getElementById('countA');
const countB = document.getElementById('countB');
const countC = document.getElementById('countC');
const countD = document.getElementById('countD');

// ===== 2. Logika Jam Real-time =====
function updateDateTime() {
    const now = new Date();
    const opsiTanggal = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };
    if (liveDate) {
        liveDate.textContent = now.toLocaleDateString('id-ID', opsiTanggal);
    }
    if (liveTime) {
        const jam = String(now.getHours()).padStart(2, '0');
        const menit = String(now.getMinutes()).padStart(2, '0');
        const detik = String(now.getSeconds()).padStart(2, '0');
        liveTime.textContent = `${jam}:${menit}:${detik} WIB`;
    }
}
updateDateTime();
setInterval(updateDateTime, 1000);

// Notifikasi pesan dengan timer auto-clear
let pesanTimeout;
function tampilkanPesan(teks, tipe = 'info') {
    if (!pesan) return;
    pesan.textContent = teks;
    clearTimeout(pesanTimeout);
    pesanTimeout = setTimeout(() => {
        pesan.textContent = '';
    }, 4000);
}

// ===== 3. Array Data Mahasiswa & Penyimpanan LocalStorage =====
const STORAGE_KEY = 'edugrade_mahasiswa_data';

function muatDataStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch (e) {
        console.error('Gagal membaca LocalStorage', e);
    }
    return [];
}

function simpanDataStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mahasiswa));
    } catch (e) {
        console.error('Gagal menyimpan LocalStorage', e);
    }
}

const mahasiswa = muatDataStorage();

// Helper Kalkulasi Kelulusan & Predikat
function hitungKelulusanDanPredikat(nilai) {
    const status = nilai >= 60 ? 'Lulus' : 'Belum Lulus';
    let predikat;
    if (nilai >= 85) predikat = 'A';
    else if (nilai >= 75) predikat = 'B';
    else if (nilai >= 60) predikat = 'C';
    else predikat = 'D';

    return { status, predikat };
}

// ===== 4. Event: Tambah Data Mahasiswa =====
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nama = namaInput.value.trim();
    const nim = nimInput.value.trim();
    const prodi = prodiInput.value.trim();
    const nilai = Number(nilaiInput.value);

    if (!nama || !nim || !prodi || nilaiInput.value === '') {
        tampilkanPesan('Semua kolom wajib diisi.');
        return;
    }

    if (nilai < 0 || nilai > 100) {
        tampilkanPesan('Nilai harus berada di rentang 0 sampai 100.');
        return;
    }

    // Cek duplikasi NIM
    const cekNim = mahasiswa.find(m => m.nim === nim);
    if (cekNim) {
        tampilkanPesan(`Peringatan: NIM ${nim} sudah terdaftar (${cekNim.nama}).`);
        return;
    }

    const { status, predikat } = hitungKelulusanDanPredikat(nilai);

    mahasiswa.push({ nama, nim, prodi, nilai, predikat, status });
    simpanDataStorage();
    tampilkanMahasiswa();
    tampilkanPesan(`Data mahasiswa "${nama}" berhasil ditambahkan.`);
    form.reset();
    namaInput.focus();
});

// ===== 5. Statistik & Analisis =====
function perbaruiStatistik() {
    const total = mahasiswa.length;
    statTotal.textContent = total;
    if (totalDataCount) totalDataCount.textContent = total;

    if (total === 0) {
        statRataRata.textContent = '0.0';
        statTertinggi.textContent = '-';
        statTerendah.textContent = '-';
        statPersenLulus.textContent = '0%';
        statDetailLulus.textContent = '(0 Lulus / 0 Belum)';

        [barA, barB, barC, barD].forEach(bar => bar.style.width = '0%');
        countA.textContent = '0 mhs (0%)';
        countB.textContent = '0 mhs (0%)';
        countC.textContent = '0 mhs (0%)';
        countD.textContent = '0 mhs (0%)';
        return;
    }

    let totalNilai = 0;
    let tertinggi = mahasiswa[0].nilai;
    let terendah = mahasiswa[0].nilai;
    let lulusCount = 0;

    let aCount = 0, bCount = 0, cCount = 0, dCount = 0;

    for (let i = 0; i < total; i++) {
        const n = mahasiswa[i].nilai;
        totalNilai += n;

        if (n > tertinggi) tertinggi = n;
        if (n < terendah) terendah = n;

        if (mahasiswa[i].status === 'Lulus') lulusCount++;

        switch (mahasiswa[i].predikat) {
            case 'A': aCount++; break;
            case 'B': bCount++; break;
            case 'C': cCount++; break;
            case 'D': dCount++; break;
        }
    }

    const rataRata = (totalNilai / total).toFixed(1);
    const belumLulusCount = total - lulusCount;
    const persenLulus = Math.round((lulusCount / total) * 100);

    statRataRata.textContent = rataRata;
    statTertinggi.textContent = tertinggi;
    statTerendah.textContent = terendah;
    statPersenLulus.textContent = `${persenLulus}%`;
    statDetailLulus.textContent = `(${lulusCount} Lulus / ${belumLulusCount} Belum)`;

    const persenA = Math.round((aCount / total) * 100);
    const persenB = Math.round((bCount / total) * 100);
    const persenC = Math.round((cCount / total) * 100);
    const persenD = Math.round((dCount / total) * 100);

    barA.style.width = `${persenA}%`;
    barB.style.width = `${persenB}%`;
    barC.style.width = `${persenC}%`;
    barD.style.width = `${persenD}%`;

    countA.textContent = `${aCount} mhs (${persenA}%)`;
    countB.textContent = `${bCount} mhs (${persenB}%)`;
    countC.textContent = `${cCount} mhs (${persenC}%)`;
    countD.textContent = `${dCount} mhs (${persenD}%)`;
}

// Ambil 2 huruf inisial nama untuk avatar
function dapatkanInisial(nama) {
    if (!nama) return 'MH';
    const bagian = nama.trim().split(/\s+/);
    if (bagian.length >= 2) {
        return (bagian[0][0] + bagian[1][0]).toUpperCase();
    }
    return bagian[0].substring(0, 2).toUpperCase();
}

// Warna gradient untuk score mini progress bar
function dapatkanWarnaScore(nilai) {
    if (nilai >= 85) return 'linear-gradient(90deg, #22c55e, #16a34a)';
    if (nilai >= 75) return 'linear-gradient(90deg, #38bdf8, #0284c7)';
    if (nilai >= 60) return 'linear-gradient(90deg, #fbbf24, #d97706)';
    return 'linear-gradient(90deg, #f87171, #dc2626)';
}

// ===== 6. Render Tabel dengan Filter & Sorting Pintar =====
function tampilkanMahasiswa() {
    daftar.innerHTML = '';
    perbaruiStatistik();

    // 1. Filter Pencarian
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const statusVal = filterStatus ? filterStatus.value : 'all';
    const predikatVal = filterPredikat ? filterPredikat.value : 'all';
    const sortVal = sortData ? sortData.value : 'default';

    // Buat salinan berindeks asli untuk kebutuhan Edit & Hapus
    let dataTerfilter = mahasiswa.map((item, originalIndex) => ({
        ...item,
        originalIndex
    }));

    if (query) {
        dataTerfilter = dataTerfilter.filter(m =>
            m.nama.toLowerCase().includes(query) ||
            m.nim.toLowerCase().includes(query) ||
            m.prodi.toLowerCase().includes(query)
        );
    }

    if (statusVal !== 'all') {
        dataTerfilter = dataTerfilter.filter(m => m.status === statusVal);
    }

    if (predikatVal !== 'all') {
        dataTerfilter = dataTerfilter.filter(m => m.predikat === predikatVal);
    }

    // 2. Sorting Data
    if (sortVal === 'nilai-desc') {
        dataTerfilter.sort((a, b) => b.nilai - a.nilai);
    } else if (sortVal === 'nilai-asc') {
        dataTerfilter.sort((a, b) => a.nilai - b.nilai);
    } else if (sortVal === 'nama-asc') {
        dataTerfilter.sort((a, b) => a.nama.localeCompare(b.nama));
    } else if (sortVal === 'nim-asc') {
        dataTerfilter.sort((a, b) => a.nim.localeCompare(b.nim));
    }

    jumlah.textContent = dataTerfilter.length;

    // Tampilan jika data kosong
    if (dataTerfilter.length === 0) {
        const barisKosong = document.createElement('tr');
        const kolomKosong = document.createElement('td');
        kolomKosong.colSpan = 8;
        kolomKosong.className = 'kosong';
        kolomKosong.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">${mahasiswa.length === 0 ? '📂' : '🔍'}</span>
                <strong>${mahasiswa.length === 0 ? 'Belum ada data mahasiswa.' : 'Tidak ditemukan mahasiswa yang sesuai.'}</strong>
                <small>${mahasiswa.length === 0 ? 'Silakan tambahkan data melalui form atau klik "✨ Data Contoh".' : 'Coba ubah kata kunci pencarian atau filter Anda.'}</small>
            </div>
        `;
        barisKosong.appendChild(kolomKosong);
        daftar.appendChild(barisKosong);
        return;
    }

    // Perulangan membangun baris tabel modern
    dataTerfilter.forEach((m, no) => {
        const baris = document.createElement('tr');

        // Kolom 1: No
        const colNo = document.createElement('td');
        colNo.style.textAlign = 'center';
        colNo.style.fontWeight = '700';
        colNo.style.color = '#9c7a60';
        colNo.textContent = no + 1;
        baris.appendChild(colNo);

        // Kolom 2: Mahasiswa (Avatar + Nama)
        const colNama = document.createElement('td');
        colNama.innerHTML = `
            <div class="student-profile">
                <div class="student-avatar">${dapatkanInisial(m.nama)}</div>
                <div class="student-name">${m.nama}</div>
            </div>
        `;
        baris.appendChild(colNama);

        // Kolom 3: NIM Badge
        const colNim = document.createElement('td');
        colNim.innerHTML = `<span class="badge-nim">${m.nim}</span>`;
        baris.appendChild(colNim);

        // Kolom 4: Program Studi
        const colProdi = document.createElement('td');
        colProdi.innerHTML = `<span class="tag-prodi">${m.prodi}</span>`;
        baris.appendChild(colProdi);

        // Kolom 5: Nilai + Mini Progress Bar
        const colNilai = document.createElement('td');
        colNilai.innerHTML = `
            <div class="score-cell">
                <div class="score-num">${m.nilai} <small style="color:#9c7a60; font-size:11px;">/ 100</small></div>
                <div class="score-bar-bg">
                    <div class="score-bar-fill" style="width: ${m.nilai}%; background: ${dapatkanWarnaScore(m.nilai)};"></div>
                </div>
            </div>
        `;
        baris.appendChild(colNilai);

        // Kolom 6: Predikat
        const colPredikat = document.createElement('td');
        colPredikat.style.textAlign = 'center';
        const predikatClass = `grade-${m.predikat.toLowerCase()}`;
        colPredikat.innerHTML = `<span class="grade-badge ${predikatClass}">${m.predikat}</span>`;
        baris.appendChild(colPredikat);

        // Kolom 7: Kelulusan Pill
        const colStatus = document.createElement('td');
        colStatus.style.textAlign = 'center';
        const isLulus = m.status === 'Lulus';
        colStatus.innerHTML = `
            <span class="status-pill ${isLulus ? 'lulus' : 'belum'}">
                ${isLulus ? '✓' : '✗'} ${m.status}
            </span>
        `;
        baris.appendChild(colStatus);

        // Kolom 8: Tindakan (Edit & Hapus)
        const colAksi = document.createElement('td');
        colAksi.style.textAlign = 'center';

        const btnEdit = document.createElement('button');
        btnEdit.type = 'button';
        btnEdit.className = 'btn-action-edit';
        btnEdit.textContent = '✏️ Edit';
        btnEdit.title = 'Edit data ini';
        btnEdit.addEventListener('click', () => bukaModalEdit(m.originalIndex));

        const btnHapus = document.createElement('button');
        btnHapus.type = 'button';
        btnHapus.className = 'btn-action-delete';
        btnHapus.textContent = '🗑️ Hapus';
        btnHapus.title = 'Hapus data ini';
        btnHapus.addEventListener('click', () => {
            if (confirm(`Yakin ingin menghapus data ${m.nama}?`)) {
                mahasiswa.splice(m.originalIndex, 1);
                simpanDataStorage();
                tampilkanMahasiswa();
                tampilkanPesan(`Data "${m.nama}" telah dihapus.`);
            }
        });

        const actionWrap = document.createElement('div');
        actionWrap.className = 'action-buttons';
        actionWrap.appendChild(btnEdit);
        actionWrap.appendChild(btnHapus);

        colAksi.appendChild(actionWrap);
        baris.appendChild(colAksi);

        daftar.appendChild(baris);
    });
}

// ===== 7. Modal Edit Logic =====
function bukaModalEdit(index) {
    const m = mahasiswa[index];
    if (!m) return;
    editIndex.value = index;
    editNama.value = m.nama;
    editNim.value = m.nim;
    editProdi.value = m.prodi;
    editNilai.value = m.nilai;

    modalEdit.classList.add('active');
    editNama.focus();
}

function tutupModalEdit() {
    modalEdit.classList.remove('active');
    formEdit.reset();
}

btnBatalEdit.addEventListener('click', tutupModalEdit);
btnCancelModal.addEventListener('click', tutupModalEdit);
modalEdit.addEventListener('click', function(e) {
    if (e.target === modalEdit) tutupModalEdit();
});

formEdit.addEventListener('submit', function (e) {
    e.preventDefault();
    const idx = Number(editIndex.value);
    const nama = editNama.value.trim();
    const nim = editNim.value.trim();
    const prodi = editProdi.value.trim();
    const nilai = Number(editNilai.value);

    if (!nama || !nim || !prodi || editNilai.value === '') {
        alert('Semua kolom edit wajib diisi!');
        return;
    }

    if (nilai < 0 || nilai > 100) {
        alert('Nilai harus 0-100!');
        return;
    }

    const { status, predikat } = hitungKelulusanDanPredikat(nilai);

    mahasiswa[idx] = { nama, nim, prodi, nilai, predikat, status };
    simpanDataStorage();
    tutupModalEdit();
    tampilkanMahasiswa();
    tampilkanPesan(`Data "${nama}" berhasil diperbarui.`);
});

// ===== 8. Fitur Filter & Search Listener =====
if (searchInput) searchInput.addEventListener('input', tampilkanMahasiswa);
if (filterStatus) filterStatus.addEventListener('change', tampilkanMahasiswa);
if (filterPredikat) filterPredikat.addEventListener('change', tampilkanMahasiswa);
if (sortData) sortData.addEventListener('change', tampilkanMahasiswa);

// ===== 9. Muat Contoh Data Demo (Untuk Presentasi) =====
if (btnSampleData) {
    btnSampleData.addEventListener('click', function () {
        const dataContoh = [
            { nama: "Muhammad Fadhil", nim: "231001", prodi: "Teknik Informatika", nilai: 92, predikat: "A", status: "Lulus" },
            { nama: "Aisyah Putri", nim: "231002", prodi: "Sistem Informasi", nilai: 88, predikat: "A", status: "Lulus" },
            { nama: "Budi Santoso", nim: "231003", prodi: "Teknik Komputer", nilai: 78, predikat: "B", status: "Lulus" },
            { nama: "Citra Lestari", nim: "231004", prodi: "Teknik Informatika", nilai: 64, predikat: "C", status: "Lulus" },
            { nama: "Dian Pratama", nim: "231005", prodi: "Sains Data", nilai: 52, predikat: "D", status: "Belum Lulus" }
        ];

        // Tambahkan tanpa menduplikasi NIM
        let ditambah = 0;
        dataContoh.forEach(item => {
            if (!mahasiswa.some(m => m.nim === item.nim)) {
                mahasiswa.push(item);
                ditambah++;
            }
        });

        simpanDataStorage();
        tampilkanMahasiswa();
        tampilkanPesan(`${ditambah} data contoh berhasil dimuat.`);
    });
}

// ===== 10. Fitur Ekspor ke CSV / Excel =====
if (btnExportCSV) {
    btnExportCSV.addEventListener('click', function () {
        if (mahasiswa.length === 0) {
            alert('Tidak ada data untuk diekspor!');
            return;
        }

        let csvContent = 'No,Nama Mahasiswa,NIM,Program Studi,Nilai,Predikat,Status Kelulusan\n';
        mahasiswa.forEach((m, i) => {
            const namaClean = `"${m.nama.replace(/"/g, '""')}"`;
            const prodiClean = `"${m.prodi.replace(/"/g, '""')}"`;
            csvContent += `${i + 1},${namaClean},'${m.nim},${prodiClean},${m.nilai},${m.predikat},${m.status}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Data_Mahasiswa_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        tampilkanPesan('File CSV berhasil diunduh.');
    });
}

// ===== 11. Tombol Reset =====
tombolReset.addEventListener('click', function () {
    if (mahasiswa.length === 0) return;
    if (confirm('Apakah Anda yakin ingin mengosongkan seluruh daftar data mahasiswa?')) {
        mahasiswa.length = 0;
        simpanDataStorage();
        tampilkanMahasiswa();
        tampilkanPesan('Seluruh daftar berhasil direset.');
    }
});

// Tampilkan kondisi awal
tampilkanMahasiswa();