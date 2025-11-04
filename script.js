// Ambil tugas dari localStorage
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Simpan tugas
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render daftar tugas
function renderTasks() {
  const tbody = document.getElementById("taskList");
  if (!tbody) return;
  const tasks = getTasks();
  tbody.innerHTML = "";

  tasks.forEach((task, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${task.judul}</td>
      <td>${task.deadline}</td>
      <td>${task.selesai ? "<span class='badge bg-success'>Selesai</span>" : "<span class='badge bg-warning text-dark'>Belum</span>"}</td>
      <td>
        <button class="btn btn-sm btn-success me-2" onclick="markDone(${i})">Selesai</button>
        <a href="edit.html?index=${i}" class="btn btn-sm btn-info me-2">Edit</a>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${i})">Hapus</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// Tambah tugas
document.getElementById("taskForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const judul = document.getElementById("judul").value;
  const deadline = document.getElementById("deadline").value;

  const tasks = getTasks();
  tasks.push({ judul, deadline, selesai: false });
  saveTasks(tasks);
  e.target.reset();
  renderTasks();
});

// Hapus semua
document.getElementById("clearBtn")?.addEventListener("click", () => {
  if (confirm("Yakin ingin menghapus semua tugas?")) {
    localStorage.removeItem("tasks");
    renderTasks();
  }
});

// Tandai selesai
function markDone(index) {
  const tasks = getTasks();
  tasks[index].selesai = true;
  saveTasks(tasks);
  renderTasks();
}

// Hapus satu tugas
function deleteTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks();
}

// Edit tugas
document.getElementById("editForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const index = urlParams.get("index");
  const tasks = getTasks();

  tasks[index].judul = document.getElementById("editJudul").value;
  tasks[index].deadline = document.getElementById("editDeadline").value;
  saveTasks(tasks);
  window.location.href = "index.html";
});

// Prefill form edit
if (window.location.pathname.endsWith("edit.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const index = urlParams.get("index");
  const task = getTasks()[index];
  if (task) {
    document.getElementById("editJudul").value = task.judul;
    document.getElementById("editDeadline").value = task.deadline;
  }
}

// Sort berdasarkan tenggat
document.getElementById("sortBtn")?.addEventListener("click", () => {
  const tasks = getTasks();
  tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  saveTasks(tasks);
  renderTasks();
});

// Kirim daftar tugas ke WhatsApp kamu
document.getElementById("sendWA")?.addEventListener("click", () => {
  const tasks = getTasks();
  if (tasks.length === 0) {
    alert("Tidak ada tugas untuk dikirim!");
    return;
  }

  // Ganti dengan nomor WhatsApp kamu (format internasional tanpa tanda +)
  const nomor = "6281282547293"; // contoh: 6281234567890 untuk +62 812-3456-7890

  const pesan = tasks.map((t, i) =>
    `${i + 1}. ${t.judul} (${t.deadline}) - ${t.selesai ? "✅ Selesai" : "⌛ Belum"}`
  ).join("%0A");

  const url = `https://wa.me/${nomor}?text=Hai%20ini%20daftar%20tugas%20saya:%0A%0A${pesan}`;
  window.open(url, "_blank");
});

// Render saat halaman utama dibuka
renderTasks();
