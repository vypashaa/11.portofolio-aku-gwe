// ================= LOGIN =================
function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "pasha" && pass === "567") {
        localStorage.setItem("login", "true");
        window.location = "dashboard.html";
    } else {
        alert("Login gagal!");
    }
}

function logout() {
    localStorage.removeItem("login");
    window.location = "login.html";
}

// ================= SIMPAN DATA (TAMBAH & EDIT) =================
function simpanData() {
    let nama = document.getElementById("nama").value;
    let umur = document.getElementById("umur").value;
    let kelas = document.getElementById("kelas").value;
    let fotoInput = document.getElementById("foto");

    let data = JSON.parse(localStorage.getItem("siswa")) || [];
    let editIndex = localStorage.getItem("editIndex");
    let oldData = JSON.parse(localStorage.getItem("editData"));

    function simpan(fotoFinal) {
        if (editIndex !== null) {
            data[editIndex] = { nama, umur, kelas, foto: fotoFinal };
            localStorage.removeItem("editIndex");
            localStorage.removeItem("editData");
        } else {
            data.push({ nama, umur, kelas, foto: fotoFinal });
        }

        localStorage.setItem("siswa", JSON.stringify(data));
        window.location = "data.html";
    }

    if (fotoInput.files.length > 0) {
        let reader = new FileReader();
        reader.onload = function () {
            simpan(reader.result);
        };
        reader.readAsDataURL(fotoInput.files[0]);
    } else if (oldData) {
        simpan(oldData.foto);
    } else {
        alert("Foto wajib diupload!");
    }
}

// ================= TAMPILKAN DATA =================
function tampilkanData() {
    let data = JSON.parse(localStorage.getItem("siswa")) || [];
    let tabel = document.getElementById("tabelData");
    if (!tabel) return;

    // 🔽 URUTKAN BERDASARKAN UMUR TERBESAR
    data.sort((a, b) => parseInt(b.umur) - parseInt(a.umur));

    tabel.innerHTML = "";

    data.forEach((s, i) => {
        tabel.innerHTML += `
            <tr>
                <td><img src="${s.foto}"></td>
                <td>${s.nama}</td>
                <td>${s.umur}</td>
                <td>${s.kelas}</td>
                <td>
                    <button class="btn-edit" onclick="editData(${i})">Edit</button>
                    <button class="btn-delete" onclick="hapusData(${i})">Hapus</button>
                    <button class="btn-print" onclick="cetakData(${i})">Cetak</button>
                </td>
            </tr>`;
    });
}

// ================= HAPUS =================
function hapusData(index) {
    if (!confirm("Yakin mau hapus data ini?")) return;
    let data = JSON.parse(localStorage.getItem("siswa"));
    data.splice(index, 1);
    localStorage.setItem("siswa", JSON.stringify(data));
    tampilkanData();
}

// ================= EDIT =================
function editData(index) {
    let data = JSON.parse(localStorage.getItem("siswa"));
    localStorage.setItem("editIndex", index);
    localStorage.setItem("editData", JSON.stringify(data[index]));
    window.location = "input.html";
}

// ================= CETAK =================
function cetakData(index) {
    let data = JSON.parse(localStorage.getItem("siswa"))[index];
    let win = window.open("", "", "width=600,height=600");

    win.document.write(`
        <h2>Biodata Siswa</h2>
        <img src="${data.foto}" width="120"><br><br>
        <b>Nama:</b> ${data.nama}<br>
        <b>Umur:</b> ${data.umur}<br>
        <b>Kelas:</b> ${data.kelas}
    `);
    win.print();
}

// ================= AUTO ISI FORM SAAT EDIT =================
window.addEventListener("DOMContentLoaded", () => {
    let editData = localStorage.getItem("editData");
    if (editData && document.getElementById("nama")) {
        let siswa = JSON.parse(editData);
        document.getElementById("nama").value = siswa.nama;
        document.getElementById("umur").value = siswa.umur;
        document.getElementById("kelas").value = siswa.kelas;
    }
});
