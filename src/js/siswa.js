document.addEventListener("DOMContentLoaded", function () {
  const filterButton = document.querySelector(".jsFilter");
  if (filterButton) {
    filterButton.addEventListener("click", function () {
      document.querySelector(".filter-menu").classList.toggle("active");
    });
  }

  const gridViewButton = document.querySelector(".grid");
  const listViewButton = document.querySelector(".list");
  const productsAreaWrapper = document.querySelector(".products-area-wrapper");

  if (gridViewButton && listViewButton && productsAreaWrapper) {
    gridViewButton.addEventListener("click", function () {
      listViewButton.classList.remove("active");
      gridViewButton.classList.add("active");
      productsAreaWrapper.classList.add("gridView");
      productsAreaWrapper.classList.remove("tableView");
    });

    listViewButton.addEventListener("click", function () {
      listViewButton.classList.add("active");
      gridViewButton.classList.remove("active");
      productsAreaWrapper.classList.remove("gridView");
      productsAreaWrapper.classList.add("tableView");
    });
  }

  const modeSwitch = document.querySelector(".mode-switch");
  if (modeSwitch) {
    modeSwitch.addEventListener("click", function () {
      document.documentElement.classList.toggle("light");
      modeSwitch.classList.toggle("active");
    });
  }

  const apiUrl = "http://localhost:8000/api/siswa";
  const studentsTable = document.querySelector("#studentsTable");
  const addStudentButton = document.querySelector("#addStudentButton");

  let studentData = []; // Untuk menyimpan data asli siswa

  // Fetch students data from the API
  async function fetchStudents() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      studentData = data;
      renderStudents(studentData);
    } catch (error) {
      console.error(error);
    }
  }

  // Render students in the table
  function renderStudents(students) {
    studentsTable.innerHTML = "";

    const headerRow = document.createElement("div");
    headerRow.classList.add("products-row", "header");
    headerRow.innerHTML = `
      <div class="products-cell number">No</div>
      <div class="products-cell number">ID</div>
      <div class="products-cell nis">NIS</div>
      <div class="products-cell number">VA</div>
      <div class="products-cell name">Nama Lengkap</div>
      <div class="products-cell class">Kelas</div>
      <div class="products-cell jurusan">Jurusan</div>
      <div class="products-cell actions">Actions</div>
    `;
    studentsTable.appendChild(headerRow);

    if (students.length === 0) {
      const noDataRow = document.createElement("div");
      noDataRow.classList.add("products-row");
      noDataRow.innerHTML = `
        <div class="products-cell" style="text-align: center;" colspan="7">
          Data tidak ditemukan
        </div>`;
      studentsTable.appendChild(noDataRow);
      return;
    }

    students.forEach((student, index) => {
      const row = document.createElement("div");
      row.classList.add("products-row");
      row.innerHTML = `
        <div class="products-cell number">${index + 1}</div>
        <div class="products-cell number">${student.id}</div>
        <div class="products-cell nis">${student.nis}</div>
        <div class="products-cell number">${student.va}</div>
        <div class="products-cell name">${student.nama}</div>
        <div class="products-cell class">${student.kelas}</div>
        <div class="products-cell jurusan">${student.jurusan}</div>
        <div class="products-cell actions">
          <button class="edit-btn" onclick="editStudent(${student.id})">Edit</button>
          <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
        </div>
      `;
      studentsTable.appendChild(row);
    });
  }

  // Filter siswa berdasarkan input pencarian
  function filterData(students, keyword) {
    keyword = keyword.toLowerCase();
    return students.filter((student) => {
      return (
        student.nama.toLowerCase().includes(keyword) ||
        student.nis.toLowerCase().includes(keyword) ||
        student.kelas.toLowerCase().includes(keyword) ||
        student.jurusan.toLowerCase().includes(keyword)
      );
    });
  }

  // Event listener untuk input search
  const searchInput = document.getElementById("searchStudent");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const filtered = filterData(studentData, e.target.value);
      renderStudents(filtered);
    });
  }

  // Tombol tambah siswa
  addStudentButton.addEventListener("click", function () {
    window.location.href = "add_student.html";
  });

  // Fungsi edit siswa
  window.editStudent = function (id) {
    window.location.href = `edit_student.html?id=${id}`;
  };

  // Fungsi hapus siswa
  window.deleteStudent = async function (id) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data siswa akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Menghapus...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await fetch(`http://localhost:8000/api/siswa-id/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Data siswa berhasil dihapus!",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchStudents(); // Refresh data
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Gagal menghapus data siswa.",
          });
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Terjadi kesalahan saat menghapus data.",
        });
      }
    }
  };

  // Initial load
  fetchStudents();
});
