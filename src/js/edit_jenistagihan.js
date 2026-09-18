document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    Swal.fire('Error', 'ID tidak ditemukan di URL.', 'error');
    return;
  }

  // Fetch data berdasarkan ID
  fetch(`http://localhost:8000/api/jenis-tagihan-id/${id}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('kelas').value = data.kelas;
      document.getElementById('nama_tagihan').value = data.nama_tagihan;
      document.getElementById('nominal').value = data.nominal;
    })
    .catch(err => {
      console.error(err);
      Swal.fire('Gagal', 'Gagal memuat data tagihan.', 'error');
    });

  // Submit form untuk update
  document.getElementById('editForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
      kelas: document.getElementById('kelas').value,
      nama_tagihan: document.getElementById('nama_tagihan').value,
      nominal: document.getElementById('nominal').value
    };

    // Tampilkan loading SweetAlert
    Swal.fire({
      title: 'Memperbarui Data...',
      html: 'Mohon tunggu sebentar.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    fetch(`http://localhost:8000/api/jenis-tagihan-id/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: response.message || 'Data Jenis Tagihan berhasil diperbarui'
        }).then(() => {
          window.location.href = 'jenis_tagihan.html';
        });
      })
      .catch(error => {
        console.error(error);
        Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan data.', 'error');
      });
  });
});
