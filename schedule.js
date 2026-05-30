// ====================================================================
// MODUL JADWAL ENGINE (TEMPAT LATIHAN, HUBUNGKAN WA & GOOGLE MAPS LINK)
// ====================================================================
var mapInstance = null;

function renderJadwalVisual(data) {
  var tbody = document.getElementById('list-jadwal-render');
  tbody.innerHTML = '';
  
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 opacity-40 text-xs">Belum ada data jadwal latihan publik.</td></tr>';
    return;
  }

  data.forEach(j => {
    // 1. SMART LOGIC GOOGLE MAPS: Prioritaskan koordinat, jika kosong gunakan nama tempat untuk search query
    var gmapsUrl = j.koordinat ? 
      `https://www.google.com/maps/search/?api=1&query=${j.koordinat}` : 
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(j.tempat + ' Perisai Diri')}`;

    // 2. SMART LOGIC WHATSAPP CLEANER: Ubah otomatis format "085xxx" atau "+62" menjadi standar murni internasional "6285xxx"
    var nomorBersih = j.kontak.replace(/[^0-9]/g, '');
    if (nomorBersih.startsWith('0')) {
      nomorBersih = '62' + nomorBersih.substr(1);
    }

    var btnMapInline = j.koordinat ? 
      `<button class="btn btn-xs btn-outline btn-error font-bold" onclick="bukaPetaPopup('${j.koordinat}', '${j.tempat}')">🗺️ Lihat Peta</button>` : 
      '<span class="opacity-30 text-[10px] italic">No Koordinat</span>';

    tbody.innerHTML += `
      <tr class="text-xs hover:bg-base-200 transition">
        <td>
          <a href="${gmapsUrl}" target="_blank" class="link link-hover text-error font-bold block" title="Cari di Google Maps">
            🏢 ${j.tempat}
          </a>
        </td>
        <td>📅 ${j.hari}<br><span class="opacity-60">⏰ ${j.jam}</span></td>
        <td>
          <a href="https://wa.me/${nomorBersih}" target="_blank" class="link link-hover text-neutral font-semibold flex items-center gap-1" title="Hubungi Pelatih via WhatsApp">
            🥋 ${j.pic}
          </a>
        </td>
        <td>
          <a href="https://wa.me/${nomorBersih}" target="_blank" class="link link-success font-bold">
            ${j.kontak}
          </a>
        </td>
        <td>${btnMapInline}</td>
      </tr>`;
  });
}

// Handler penampilan jendela peta interaktif Leaflet Map (Popup)
function bukaPetaPopup(koordinatStr, namaTempat) {
  document.getElementById('modalPeta').showModal();
  var parts = koordinatStr.split(",");
  var lat = parseFloat(parts[0]);
  var lng = parseFloat(parts[1]);

  setTimeout(function() {
    if (mapInstance) {
      mapInstance.remove();
    }
    mapInstance = L.map('peta-box').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(mapInstance);

    L.marker([lat, lng]).addTo(mapInstance)
      .bindPopup(`<b>${namaTempat}</b><br>Tempat Latihan Kelatnas Perisai Diri.`)
      .openPopup();
  }, 300);
}

function bukaFormJadwal() { 
  document.getElementById('form-jadwal-block').classList.remove('hidden'); 
  document.getElementById('jadwal-row-num').value = "";
  document.getElementById('jdw-tempat').value = "";
  document.getElementById('jdw-hari').value = "";
  document.getElementById('jdw-jam').value = "";
  document.getElementById('jdw-pic').value = "";
  document.getElementById('jdw-kontak').value = "";
  document.getElementById('jdw-koordinat').value = "";
}

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
  
  if (!d.tempat || !d.pic || !d.kontak) {
    alert("Mohon lengkapi Nama Tempat, Pelatih (PIC), dan Nomor Kontak!");
    return;
  }

  callAPI({ action: 'simpanJadwal', email: userAktif.email, data: d }, function(msg) {
    alert(msg);
    document.getElementById('form-jadwal-block').classList.add('hidden');
    loadDataTerproteksi();
  });
}
