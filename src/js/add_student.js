document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("studentForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const va = document.getElementById("va").value.trim();
    const nis = document.getElementById("nis").value.trim();
    const nama = document.getElementById("name").value.trim();
    const kelas = document.getElementById("class").value;
    const jurusan = document.getElementById("jurusan").value.trim();
    const status_pembayaran_radio = document.querySelector('input[name="status"]:checked');
    const status_pembayaran = status_pembayaran_radio ? status_pembayaran_radio.value : null;

    if (!nis || !nama || !kelas || !jurusan || !status_pembayaran) {
      Swal.fire({
        title: 'Error!',
        text: 'Semua kolom harus diisi.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    Swal.fire({
      title: 'Proses Menambahkan...',
      text: 'Sedang menambahkan siswa...',
      icon: 'info',
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const studentData = {
      va: va,
      nis: nis,
      nama: nama,
      kelas: kelas,
      jurusan: jurusan,
      status_pembayaran: status_pembayaran,
    };

    fetch("http://localhost:8000/api/siswa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    })
      .then(async (response) => {
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Gagal menambahkan siswa");
          } else {
            const errorText = await response.text();
            throw new Error("Error tidak diketahui: " + errorText.slice(0, 100));
          }
        }

        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          throw new Error("Response bukan JSON");
        }
      })
      .then(() => {
        Swal.fire({
          title: 'Sukses!',
          text: 'Siswa berhasil ditambahkan!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.href = "../../staff.html";
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          title: 'Terjadi Kesalahan',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  });
});

const modeSwitch = document.querySelector('.mode-switch');
if (modeSwitch) {
  modeSwitch.addEventListener('click', function () {
    document.documentElement.classList.toggle('light');
    modeSwitch.classList.toggle('active');
  });
}
