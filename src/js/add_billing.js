document.addEventListener("DOMContentLoaded", function () {
  // Set tanggal_tagihan ke hari ini
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("tanggal_tagihan").value = today;

  const form = document.getElementById("billingForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const siswa_id = document.getElementById("siswa_id").value;
    const jenis_tagihan_id = document.getElementById("jenis_tagihan_id").value;
    const tanggal_tagihan = document.getElementById("tanggal_tagihan").value;
    const status = document.getElementById("status").value;

    if (!siswa_id || !jenis_tagihan_id || !tanggal_tagihan || !status) {
      Swal.fire({
        title: "Error!",
        text: "Semua kolom harus diisi.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    Swal.fire({
      title: "Memproses...",
      text: "Sedang menyimpan data tagihan siswa...",
      icon: "info",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const billingData = {
      siswa_id: parseInt(siswa_id),
      jenis_tagihan_id: parseInt(jenis_tagihan_id),
      tanggal_tagihan,
      status,
    };

    fetch("http://localhost:8000/api/tagihan-siswa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(billingData),
    })
      .then(async (response) => {
        const text = await response.text(); // ambil respons mentah
        console.log("Raw Response:", text);

        if (!response.ok) {
          throw new Error("Gagal menambahkan tagihan siswa. Respon: " + text);
        }

        // jika JSON valid, parse
        return JSON.parse(text);
      })

      .then(() => {
        Swal.fire({
          title: "Sukses!",
          text: "Tagihan siswa berhasil ditambahkan!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "billing.html";
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          title: "Terjadi Kesalahan",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  });

  const modeSwitch = document.querySelector(".mode-switch");
  if (modeSwitch) {
    modeSwitch.addEventListener("click", function () {
      document.documentElement.classList.toggle("light");
      modeSwitch.classList.toggle("active");
    });
  }
});
