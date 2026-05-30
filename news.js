function renderBeritaVisual(data) {
  var container = document.getElementById('list-berita-render');
  container.innerHTML = '';
  var isAdmin = (userAktif && userAktif.role.includes("Admin"));

  data.forEach(b => {
    var imgClean = bersihLinkDrive(b.foto);
    var imgHtml = imgClean ? `<img src="${imgClean}" class="w-full h-48 object-cover">` : '';
    
    // Fitur Read More / Lihat Selengkapnya Dikembalikan Sempurna
    var txtIsi = b.isi.length > 140 ? 
      `<span class="short-text">${b.isi.substring(0, 140)}...</span>
       <span class="full-text hidden">${b.isi}</span>
       <button class="btn btn-link btn-xs p-0 text-error block font-bold" onclick="toggleReadMoreText(this)">lihat selengkapnya</button>` 
      : b.isi;

    var badgeDraft = b.status === "Draft" ? `<div class="badge badge-warning text-[10px]">DRAFT</div>` : '';
    
    container.innerHTML += `
      <div class="card bg-base-100 border overflow-hidden shadow-md">
        ${imgHtml}
        <div class="card-body p-4">
          <h2 class="card-title text-sm font-bold">
            ${b.judul} ${badgeDraft}
            <div class="badge badge-error text-white text-[10px]">${b.kategori}</div>
          </h2>
          <div class="text-[11px] opacity-50 flex justify-between">
            <span>📅 ${b.tanggal}</span>
            <span>✍️ Oleh: <b>${b.publisher}</b></span>
          </div>
          <div class="text-xs text-gray-600 mt-2">${txtIsi}</div>
        </div>
      </div>`;
  });
}

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

function bukaFormBerita() {
  document.getElementById('form-berita-block').classList.remove('hidden');
  document.getElementById('berita-row-num').value = "";
}

function simpanBeritaWeb() {
  var d = {
    rowNum: document.getElementById('berita-row-num').value,
    judul: document.getElementById('berita-judul').value,
    isi: document.getElementById('berita-isi').value,
    kategori: document.getElementById('berita-kat').value,
    status: document.getElementById('berita-status').value,
    foto: document.getElementById('berita-foto-url').value,
    publisher: userAktif ? userAktif.nama : "Admin" // Otomatis mengisi siapa yang publish
  };
  callAPI({ action: 'simpanBerita', email: userAktif.email, data: d }, function(msg) {
    alert(msg);
    document.getElementById('form-berita-block').classList.add('hidden');
    location.reload();
  });
}