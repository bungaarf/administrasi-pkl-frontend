document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("tagihanForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const kelas = document.getElementById("kelas").value;
    const nama_tagihan = document.getElementById("nama_tagihan").value.trim();
    const nominal = document.getElementById("nominal").value.trim();

    if (!kelas || !nama_tagihan || !nominal) {
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
      text: 'Sedang menyimpan data tagihan...',
      icon: 'info',
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const tagihanData = {
      kelas: parseInt(kelas),
      nama_tagihan: nama_tagihan,
      nominal: parseFloat(nominal),
    };

    fetch("http://localhost:8000/api/jenis-tagihan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tagihanData),
    })
      .then(async (response) => {
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Gagal menambahkan jenis tagihan");
          } else {
            const errorText = await response.text();
            throw new Error("Error tidak diketahui: " + errorText.slice(0, 100));
          }
        }

        return response.json();
      })
      .then(() => {
        Swal.fire({
          title: 'Sukses!',
          text: 'Jenis tagihan berhasil ditambahkan!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.href = "jenis_tagihan.html";
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
