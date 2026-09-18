document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    Swal.fire('Error', 'ID tidak ditemukan di URL.', 'error');
    return;
  }

  // Ambil data tagihan berdasarkan ID
  fetch(`http://localhost:8000/api/tagihan-siswa-id/${id}`)
    .then(res => {
      if (!res.ok) throw new Error('Gagal mengambil data tagihan');
      return res.json();
    })
    .then(data => {
      document.getElementById('nama_siswa').value = data.siswa?.nama || '-';
      document.getElementById('nis').value = data.siswa?.nis || '-';
      document.getElementById('kelas').value = data.siswa?.kelas || '-';
      document.getElementById('jenis_tagihan').value = data.jenis_tagihan?.nama_tagihan || '-';
      document.getElementById('status').value = data.status || '';
      document.getElementById('siswa_id').value = data.siswa?.id || '';
      document.getElementById('jenis_tagihan_id').value = data.jenis_tagihan?.id || '';

      if (data.tanggal_tagihan) {
        const date = new Date(data.tanggal_tagihan);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        document.getElementById('tanggal_tagihan').value = `${yyyy}-${mm}-${dd}`;
      }
    })
    .catch(err => {
      console.error(err);
      Swal.fire('Gagal', 'Gagal memuat data tagihan.', 'error');
    });

  // Submit form untuk update data tagihan
  document.getElementById('editTagihanForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
      siswa_id: document.getElementById('siswa_id').value,
      jenis_tagihan_id: document.getElementById('jenis_tagihan_id').value,
      status: document.getElementById('status').value,
      tanggal_tagihan: document.getElementById('tanggal_tagihan').value,
    };

    Swal.fire({
      title: 'Memperbarui Data...',
      html: 'Mohon tunggu sebentar.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    fetch(`http://localhost:8000/api/tagihan-siswa-id/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Gagal memperbarui data tagihan');
        return res.json();
      })
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: response.message || 'Data tagihan berhasil diperbarui'
        }).then(() => {
          window.location.href = 'billing.html';
        });
      })
      .catch(error => {
        console.error('Fetch error:', error);
        Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan data.', 'error');
      });
  });
});
