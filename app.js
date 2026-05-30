var currentTab = "berita";
var rawDataStorage = { berita: [], jadwal: [], materi: [], absensi: [], ukt: [], anggota: [] };

window.onload = function() {
  cekSesiLokalSistem(); // Memulihkan status login secara otomatis jika ada di localStorage
  initLoadPublicModuleData();
};

function initLoadPublicModuleData() {
  var roleUser = userAktif ? userAktif.role : "Public";
  // Tarik berita publik
  callAPI({ action: 'getBerita', role: roleUser }, function(dataBerita) {
    rawDataStorage.berita = dataBerita;
    renderBeritaVisual(dataBerita);
    
    // Tarik jadwal latihan publik secara bersamaan
    callAPI({ action: 'getJadwal' }, function(dataJadwal) {
      rawDataStorage.jadwal = dataJadwal;
      renderJadwalVisual(dataJadwal);
      gantiTab('berita');
    });
  });
}

function loadDataTerproteksi() {
  if(!userAktif) return;
  callAPI({ action: 'fetchProtectedData', email: userAktif.email, role: userAktif.role }, function(res) {
    rawDataStorage.berita = res.berita || [];
    rawDataStorage.jadwal = res.jadwal || [];
    rawDataStorage.materi = res.materi || [];
    rawDataStorage.absensi = res.absensi || [];
    rawDataStorage.ukt = res.ukt || [];
    if(userAktif.role.includes("Admin")) { rawDataStorage.anggota = res.anggota || []; }
    prosesEngineData();
  });
}

function gantiTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll('#main-menu-tabs button').forEach(b => b.classList.remove('active', 'font-bold'));
  document.querySelectorAll('.tab-view').forEach(view => view.classList.add('hidden'));
  if(document.getElementById('menu-' + tabName)) document.getElementById('menu-' + tabName).classList.add('active', 'font-bold');
  if(document.getElementById('view-' + tabName)) document.getElementById('view-' + tabName).classList.remove('hidden');
  prosesEngineData();
}

function prosesEngineData() {
  var targetData = rawDataStorage[currentTab] || [];
  if (currentTab === 'berita') { renderBeritaVisual(targetData); }
  else if (currentTab === 'jadwal') { renderJadwalVisual(targetData); }
}

function bukaModalAuth() { document.getElementById('modalAuth').showModal(); }