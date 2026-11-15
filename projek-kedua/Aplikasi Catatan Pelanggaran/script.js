const namaSiswa = [
"ADAM DEMAS SAKTI AL MAHASIN", "ADAM MAULANA", "AHMAD FADIL MUBARROK", "AIDIL AKMAL FAWAIZ",
"AKHTAR FAUZAN EL FADILA SETYANTOKO", "ALDEN AL FIRDAUS", "ALFIAN RAFA ILHAMSYAH",
"ALVIN RISA ZIDNA FAQIH", "ALVIO NUR CAMIDYA PUTRI", "ALYA FATIHA HAS PUTRI",
"AMELIANA ALCHALIFI", "AMRUL ABDILAH OKTARIVA ASHEQA", "ANNISAH ICE MASHUROH",
"ARFEN SEPTIANO RAMADHAN", "ARFIAN ADHI ROSDIANA", "ARLETTA PUTRI HERLIANA",
"ARSHALAN BAGUS HARTANTO", "ARYA RAMADHANI", "ARYASATYA WIJAYAKUSUMA",
"ATHAYA QOIS QURUNUL BAHRI", "BAGAS FERNANDO PANJI PRATAMA", "BINTANG CAHYA GEMILANG",
, "BRILLIAN VIOLA MASTUVY", "CALISTA ASTAGINA ARFIANTYAS","CIKA HAYU ATILAINDA",
"CINTA WIDYA SEPTA RAMADHANI", "CLARINTA GLADIS ABRINZA", "CLARISA SAFANA PRAYEKTI",
"DAFFA MANGGALA PUTRA", "DELVYO PASHA ADHITYARA", "DESHINTA DWI RISMAWATI",
"DEWI RANI HANIFAH", "DIAN PRASETYA", "DIKA VIDI PRATAMA", "DIMAS RESTU ISLAMI",
"DISKA SEPTYA WARDANA", "ELSHINTA ARTHASARI GINOVA", "ERIKA TRI RAHMAWAT"
];

const pelanggaranList = {
    "Berkata Tidak Sopan": 2,
    "Membuang Sampah Sembarangan": 2,
    "Tidak Masuk Tanpa Keterangan": 2,
    "Terlambat": 5,
    "Membawa Makeup/Rokok/Vape": 5,
    "Bermain HP Pada Jam Pelajaran": 5,
    "Berkelahi": 10,
    "Atribut Tidak Lengkap": 10,
    "Bolos Pada Jam Pelajaran": 15,
    "Tidak Mengikuti Upacara": 15,
    "Bolos Keluar Sekolah": 30,
    "Membawa Sajam": 40,
    "Membawa Minuman Keras/Obat": 50,
    "Hamil Di luar Nikah": 50
};

let dataSiswa = JSON.parse(localStorage.getItem("dataSiswa")) || {};

function save() {
    localStorage.setItem("dataSiswa", JSON.stringify(dataSiswa));
}

window.onload = () => {
    const list = document.getElementById("namaList");
    namaSiswa.forEach(n => {
        const opt = document.createElement("option");
        opt.value = n;
        list.appendChild(opt);
    });

    const pelSelect = document.getElementById("pelanggaranSelect");
    Object.keys(pelanggaranList).forEach(p => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = `${p} (${pelanggaranList[p]} poin)`;
        pelSelect.appendChild(opt);
    });

    updateRekap();
};

function tambahPelanggaran() {
    const nama = document.getElementById("namaInput").value.trim();
    const pelanggaran = document.getElementById("pelanggaranSelect").value;

    if (!namaSiswa.includes(nama)) return alert("Nama siswa tidak ada dalam daftar!");
    if (!pelanggaran) return alert("Pilih pelanggaran terlebih dahulu!");

    if (!dataSiswa[nama]) dataSiswa[nama] = [];

    const waktu = new Date();
    const w = `${waktu.getDate()}/${waktu.getMonth()+1}/${waktu.getFullYear()} - ${waktu.getHours()}:${waktu.getMinutes()}`;

    dataSiswa[nama].push({ nama, pelanggaran, poin: pelanggaranList[pelanggaran], waktu: w });

    save();
    tampilkanCatatan(nama);
    updateRekap();
}

function tampilkanCatatan(nama) {
    const tabel = document.getElementById("tabelPelanggaran");
    tabel.innerHTML = "";

    if (!dataSiswa[nama]) return;

    dataSiswa[nama].forEach(item => {
        const row = `<tr>
            <td>${item.nama}</td>
            <td>${item.pelanggaran}</td>
            <td>${item.poin}</td>
            <td>${item.waktu}</td>
        </tr>`;
        tabel.innerHTML += row;
    });
}

document.getElementById("namaInput").addEventListener("input", () => {
    const nama = document.getElementById("namaInput").value.trim();
    tampilkanCatatan(nama);
});

function kategoriSanksi(total) {
    if (total >= 50) return { level: "Sangat Berat", ket: "Pengembalian siswa kepada orang tua / dikeluarkan." };
    if (total >= 40) return { level: "Berat", ket: "Skorsing dan perjanjian tertulis." };
    if (total >= 30) return { level: "Sedang", ket: "Teguran tertulis & pembinaan khusus." };
    if (total >= 10) return { level: "Ringan", ket: "Teguran lisan & pemanggilan orang tua." };
    return { level: "-", ket: "-" };
}

function updateRekap() {
    const rekap = document.getElementById("rekapTabel");
    rekap.innerHTML = "";

    namaSiswa.forEach(nama => {
        const total = dataSiswa[nama] ? dataSiswa[nama].reduce((a,b) => a + b.poin, 0) : 0;
        const s = kategoriSanksi(total);

        rekap.innerHTML += `
            <tr>
                <td>${nama}</td>
                <td>${total}</td>
                <td>${s.level}</td>
                <td>${s.ket}</td>
            </tr>
        `;
    });
} 

function hapusData() {
    const nama = document.getElementById("namaInput").value.trim();
    if (!namaSiswa.includes(nama)) return alert("Pilih nama siswa valid untuk menghapus!");

    if (confirm(`Hapus semua catatan untuk ${nama}?`)) {
        delete dataSiswa[nama];
        save();
        document.getElementById("tabelPelanggaran").innerHTML = "";
        updateRekap();
    }
}
