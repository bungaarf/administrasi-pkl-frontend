document.addEventListener('DOMContentLoaded', () => {
  fetchJenisTagihan();

  const searchInput = document.getElementById('searchJenisTagihan');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase();
      const filtered = jenisTagihanData.filter(item =>
        (item.kelas + '').toLowerCase().includes(keyword) ||
        (item.nama_tagihan + '').toLowerCase().includes(keyword)
      );
      renderJenisTagihan(filtered);
    });
  }

  const modeSwitch = document.querySelector('.mode-switch');
  if (modeSwitch) {
    modeSwitch.addEventListener('click', function () {
      document.documentElement.classList.toggle('light');
      modeSwitch.classList.toggle('active');
    });
  }

  const addBtn = document.getElementById('addJenisTagihan');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      window.location.href = 'add_jenistagihan.html';
    });
  }
});

let jenisTagihanData = [];

function fetchJenisTagihan() {
  fetch('http://localhost:8000/api/jenis-tagihan')
    .then(response => {
      if (!response.ok) {
        throw new Error('Gagal mengambil data jenis tagihan');
      }
      return response.json();
    })
    .then(data => {
      jenisTagihanData = data;
      renderJenisTagihan(jenisTagihanData);
    })
    .catch(error => {
      console.error('Terjadi kesalahan:', error);
    });
}

function renderJenisTagihan(data) {
  const container = document.getElementById('jenisTagihanTable');
  container.querySelectorAll('.products-row:not(.header)').forEach(el => el.remove());

  if (data.length === 0) {
    const row = document.createElement('div');
    row.classList.add('products-row');
    row.innerHTML = `<div class="products-cell" colspan="5">Data tidak ditemukan</div>`;
    container.appendChild(row);
    return;
  }

  data.forEach((item, index) => {
    const row = document.createElement('div');
    row.classList.add('products-row');

    row.innerHTML = `
      <div class="products-cell number">${index + 1}</div>
      <div class="products-cell number">${item.id}</div>
      <div class="products-cell">Kelas ${item.kelas}</div>
      <div class="products-cell">${item.nama_tagihan}</div>
      <div class="products-cell">
        <button class="edit-btn" onclick="editjenisTagihan(${item.id})">Edit</button>
        <button class="delete-btn" onclick="hapusjenisTagihan(${item.id})">Delete</button>
      </div>
    `;

    container.appendChild(row);
  });
}

function formatRupiah(angka) {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

window.editjenisTagihan = function (id) {
  window.location.href = `edit_jenistagihan.html?id=${id}`;
};

window.hapusjenisTagihan = async function (id) {
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
      const response = await fetch(`http://localhost:8000/api/jenis-tagihan-id/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: data.message || 'Jenis tagihan berhasil dihapus!',
          timer: 2000,
          showConfirmButton: false
        });
        fetchJenisTagihan();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal menghapus jenis tagihan.'
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
