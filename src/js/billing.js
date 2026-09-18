document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("tagihanSiswaTable");
  const searchInput = document.getElementById("searchTagihan");
  const filterStatus = document.getElementById("filterStatus"); // Ambil elemen dropdown status

  async function fetchTagihanSiswa() {
    try {
      const response = await fetch("http://localhost:8000/api/tagihan-siswa");
      if (!response.ok) throw new Error("Gagal mengambil data tagihan siswa");
      const data = await response.json();
      return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
      return [];
    }
  }

  function renderTable(data) {
    const rows = table.querySelectorAll(".products-row:not(.header)");
    rows.forEach(row => row.remove());

    if (data.length === 0) {
      const noDataRow = document.createElement("div");
      noDataRow.className = "products-row";
      noDataRow.innerHTML = `<div class="products-cell" style="text-align:center" colspan="8">Data tidak ditemukan</div>`;
      table.appendChild(noDataRow);
      return;
    }

    data.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "products-row";

      const tanggalTagihan = item.tanggal_tagihan
        ? new Date(item.tanggal_tagihan).toLocaleDateString("id-ID")
        : "-";

      row.innerHTML = `
        <div class="products-cell number">${index + 1}</div>
        <div class="products-cell">${item.siswa?.nama || "-"}</div>
        <div class="products-cell">${item.siswa?.nis || "-"}</div>
        <div class="products-cell">${item.siswa?.kelas || "-"}</div>
        <div class="products-cell">${item.jenis_tagihan?.nama_tagihan || "-"}</div>
        <div class="products-cell">${item.status}</div>
        <div class="products-cell">${tanggalTagihan}</div>
        <div class="products-cell">
          <button class="edit-btn" onclick="editTagihan(${item.id})">Edit</button>
          <button class="delete-btn" onclick="hapusTagihan(${item.id})">Hapus</button>
        </div>
      `;

      table.appendChild(row);
    });
  }

  // Fungsi filter data berdasarkan keyword dan status filter
  function filterData(data, keyword, statusFilter) {
    keyword = keyword.toLowerCase();

    return data.filter(item => {
      const matchesKeyword =
        (item.siswa?.nama.toLowerCase().includes(keyword)) ||
        (item.siswa?.kelas.toLowerCase().includes(keyword)) ||
        (item.status.toLowerCase().includes(keyword));

      const matchesStatus = statusFilter === "" || item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesKeyword && matchesStatus;
    });
  }

  window.editTagihan = function (id) {
    window.location.href = `edit_tagihan.html?id=${id}`;
  };

  const modeSwitch = document.querySelector('.mode-switch');
  if (modeSwitch) {
    modeSwitch.addEventListener('click', function () {
      document.documentElement.classList.toggle('light');
      modeSwitch.classList.toggle('active');
    });
  }

  window.hapusTagihan = async function (id) {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: "Jenis tagihan ini akan dihapus secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Menghapus...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const response = await fetch(`http://localhost:8000/api/tagihan-siswa-id/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const data = await response.json();
          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: data.message || 'Tagihan berhasil dihapus!',
            timer: 2000,
            showConfirmButton: false
          });
          loadData();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Gagal menghapus tagihan.'
          });
        }
      } catch (error) {
        console.error('Error deleting tagihan:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Terjadi kesalahan saat menghapus tagihan.'
        });
      }
    }
  };

  let tagihanSiswaData = [];

  async function loadData() {
    tagihanSiswaData = await fetchTagihanSiswa();
    const keyword = searchInput.value || "";
    const statusFilter = filterStatus.value || "";
    const filtered = filterData(tagihanSiswaData, keyword, statusFilter);
    renderTable(filtered);
  }

  // Event listener search input
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value;
    const statusFilter = filterStatus.value;
    const filtered = filterData(tagihanSiswaData, keyword, statusFilter);
    renderTable(filtered);
  });

  // Event listener filter status dropdown
  filterStatus.addEventListener("change", () => {
    const keyword = searchInput.value;
    const statusFilter = filterStatus.value;
    const filtered = filterData(tagihanSiswaData, keyword, statusFilter);
    renderTable(filtered);
  });

  document.getElementById("addTagihanBtn").addEventListener("click", () => {
    window.location.href = "add_billing.html";
  });

  loadData();
});
