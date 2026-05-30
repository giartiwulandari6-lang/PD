var mapInstance = null;

function renderJadwalVisual(data) {
  var tbody = document.getElementById('list-jadwal-render');
  tbody.innerHTML = '';
  
  if(data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 opacity-40">Belum ada data jadwal latihan.</td></tr>';
    return;
  }

  data.forEach(j => {
    var btnMap = j.koordinat ? `<button class="btn btn-xs btn-outline btn-error font-bold" onclick="bukaPetaPopup('${j.koordinat}', '${j.tempat}')">🗺️ Lihat Peta</button>` : '<span class="opacity-30">-</span>';
    tbody.innerHTML += `
      <tr class="text-xs">
        <td><b>${j.tempat}</b></td>
        <td>📅 ${j.hari}<br>⏰ ${j.jam}</td>
        <td>👤 ${j.pic}</td>
        <td><a href="https://wa.me/${j.kontak}" target="_blank" class="link link-success font-semibold">${j.kontak}</a></td>
        <td>${btnMap}</td>
      </tr>`;
  });
}

function bukaPetaPopup(koordinatStr, namaTempat) {
  document.getElementById('modalPeta').showModal();
  var parts = koordinatStr.split(",");
  var lat = parseFloat(parts[0]);
  var lng = parseFloat(parts[1]);

  // Timeout kecil agar render DOM box peta Leaflet pasca modal terbuka tidak corrupt/abu-abu
  setTimeout(function() {
    if (mapInstance) {
      mapInstance.remove();
    }
    mapInstance = L.map('peta-box').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    L.marker([lat, lng]).addTo(mapInstance)
      .bindPopup(`<b>${namaTempat}</b><br>Tempat Latihan Kelatnas Perisai Diri.`)
      .openPopup();
  }, 300);
}

function bukaFormJadwal() { document.getElementById('form-jadwal-block').classList.remove('hidden'); }

function simpanJadwalWeb() {
  var d = {
    rowNum: document.getElementById('jadwal-row-num').value,
    tempat: document.getElementById('jdw-tempat').value,
    hari: document.getElementById('jdw-hari').value,
    jam: document.getElementById('jdw-jam').value,
    pic: document.getElementById('jdw-pic').value,
    kontak: document.getElementById('jdw-kontak').value,
    koordinat: document.getElementById('jdw-koordinat').value
  };
  callAPI({ action: 'simpanJadwal', email: userAktif.email, data: d }, function(msg) {
    alert(msg);
    location.reload();
  });
}