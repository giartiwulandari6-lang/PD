// ====================================================================
// MODUL NEWS ENGINE (BERITA, INFORMASI, DRAFT SYSTEM & READ MORE)
// ====================================================================

function renderBeritaVisual(data) {
  var container = document.getElementById('list-berita-render');
  container.innerHTML = '';
  
  if (data.length === 0) {
    container.innerHTML = '<p class="text-center py-10 opacity-40 text-xs col-span-2">Belum ada berita atau pengumuman saat ini.</p>';
    return;
  }

  var isAdmin = (userAktif && userAktif.role.includes("Admin"));

  data.forEach(b => {
    var imgClean = bersihLinkDrive(b.foto);
    // Perbaikan total logic rendering image CDN Drive
    var imgHtml = imgClean ? `<img src="${imgClean}" class="w-full h-48 object-cover bg-base-300" onerror="this.src='https://via.placeholder.com/400x200?text=Gambar+Tidak+Tersedia'">` : '';
    
    // Fitur Kontrol Teks "Lihat Selengkapnya"
    var txtIsi = b.isi.length > 140 ? 
      `<span class="short-text">${b.isi.substring(0, 140)}...</span>
       <span class="full-text hidden whitespace-pre-line">${b.isi}</span>
       <button class="btn btn-link btn-xs p-0 text-error block font-bold mt-1" onclick="toggleReadMoreText(this)">lihat selengkapnya</button>` 
      : `<span class="whitespace-pre-line">${b.isi}</span>`;

    // Penanda Status Draft & Publisher
    var badgeDraft = b.status === "Draft" ? `<div class="badge badge-warning text-[10px] font-bold">DRAFT</div>` : '';
    
    // Tombol Akses Khusus Admin (Bisa Edit & Hapus Berita Draft/Publish)
    var adminControlHtml = isAdmin ? `
      <div class="card-actions justify-end border-t pt-2 mt-2 gap-1">
        <button class="btn btn-xs btn-outline btn-neutral" onclick="editBeritaByRow(${b.rowNum})">📝 Edit Berita</button>
        <button class="btn btn-xs btn-error text-white" onclick="hapusBeritaByRow(${b.rowNum})">✕ Hapus</button>
      </div>` : '';

    container.innerHTML += `
      <div class="card bg-base-100 border border-base-300 overflow-hidden shadow-sm hover:shadow-md transition">
        ${imgHtml}
        <div class="card-body p-4 justify-between">
          <div class="space-y-2">
            <h2 class="card-title text-sm font-bold text-gray-800">
              ${b.judul} ${badgeDraft}
              <div class="badge badge-error text-white text-[10px]">${b.kategori}</div>
            </h2>
            <div class="text-[10px] opacity-60 flex justify-between border-b pb-1">
              <span>📅 ${b.tanggal}</span>
              <span>✍️ Oleh: <b class="text-error">${b.publisher}</b></span>
            </div>
            <div class="text-xs text-gray-600 leading-relaxed mt-1">${txtIsi}</div>
          </div>
          ${adminControlHtml}
        </div>
      </div>`;
  });
}

// Fungsi ekspansi teks berita
function toggleReadMoreText(btn) {
  var parent = btn.parentElement;
  var shortSpan = parent.querySelector('.short-text');
  var fullSpan = parent.querySelector('.full-text');
  if (shortSpan.classList.contains('hidden')) {
    shortSpan.classList.remove('hidden');
    fullSpan.classList.add('hidden');
    btn.innerText = "lihat selengkapnya";
  } else {
    shortSpan.classList.add('hidden');
    fullSpan.classList.remove('hidden');
    btn.innerText = "sembunyikan";
  }
}

// Membuka form bersih untuk berita baru
function bukaFormBerita() {
  document.getElementById('form-berita-block').classList.remove('hidden');
  document.getElementById('berita-row-num').value = "";
  document.getElementById('berita-judul').value = "";
  document.getElementById('berita-isi').value = "";
  document.getElementById('berita-kat').value = "Pengumuman";
  document.getElementById('berita-status').value = "Publish";
  document.getElementById('berita-foto-url').value = "";
  document.getElementById('berita-judul').focus();
}

// Trigger edit berita (Menarik data baris ke form input secara presisi)
function editBeritaByRow(rowNum) {
  var item = rawDataStorage.berita.find(x => x.rowNum == rowNum);
  if (item) {
    document.getElementById('form-berita-block').classList.remove('hidden');
    document.getElementById('berita-row-num').value = item.rowNum;
    document.getElementById('berita-judul').value = item.judul;
    document.getElementById('berita-isi').value = item.isi;
    document.getElementById('berita-kat').value = item.kategori;
    document.getElementById('berita-status').value = item.status;
    document.getElementById('berita-foto-url').value = item.foto || "";
    // Scroll otomatis ke area form agar admin nyaman mengedit
    document.getElementById('form-berita-block').scrollIntoView({ behavior: 'smooth' });
  }
}

// Kirim data transaksi simpan/perbarui berita ke database
function simpanBeritaWeb() {
  var d = {
    rowNum: document.getElementById('berita-row-num').value,
    judul: document.getElementById('berita-judul').value,
    isi: document.getElementById('berita-isi').value,
    kategori: document.getElementById('berita-kat').value,
    status: document.getElementById('berita-status').value,
    foto: document.getElementById('berita-foto-url').value,
    publisher: userAktif ? userAktif.nama : "Admin"
  };
  
  if (!d.judul || !d.isi) {
    alert("Judul dan isi berita wajib diisi!");
    return;
  }

  callAPI({ action: 'simpanBerita', email: userAktif.email, data: d }, function(msg) {
    alert(msg);
    document.getElementById('form-berita-block').classList.add('hidden');
    // Membaca ulang proteksi data agar list ter-refresh real-time
    loadDataTerproteksi();
  });
}

// Fungsi hapus berita khusus admin
function hapusBeritaByRow(rowNum) {
  if (confirm("Apakah Anda yakin ingin menghapus berita ini secara permanen dari database?")) {
    callAPI({ action: 'deleteRow', email: userAktif.email, sheetName: 'Berita', rowNum: rowNum }, function(msg) {
      alert(msg);
      loadDataTerproteksi();
    });
  }
}
