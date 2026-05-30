// CONFIG UTAMA URL SINKRONISASI DATABASE GOOGLE SPREADSHEET
const API_URL = "https://script.google.com/macros/s/AKfycbxiJj42qSL8X3Ydg1ZGbztgR8qFCiROC3CX_ISPmM8D2NroHJpkCvIRKSLffX6gjNEkIA/exec";

function callAPI(payload, successCallback) {
  document.getElementById('global-loader').classList.remove('hidden');
  fetch(API_URL, { method: 'POST', mode: 'cors', body: JSON.stringify(payload) })
  .then(res => res.json())
  .then(res => { 
    document.getElementById('global-loader').classList.add('hidden'); 
    
    // Deteksi jika server Apps Script mengirimkan sinyal kegagalan internal struktur sheet
    if (res && res.sukses === false && res.error) {
      alert("🚨 Kendala Server Database: " + res.error);
      return;
    }
    successCallback(res); 
  })
  .catch(err => {
    document.getElementById('global-loader').classList.add('hidden');
    alert("❌ Gagal terhubung ke server database. Periksa koneksi internet atau setelan deployment Google Apps Script Anda.");
    console.error("API Connection Error: ", err);
  });
}

// CONVERTER FIX PROXY DRIVE AGAR FOTO DI TAB BERITA DAN IJAZAH MUNCUL HD
function bersihLinkDrive(url) {
  if (!url || typeof url !== 'string') return "";
  // Mengubah tautan drive share biasa menjadi format direct stream data murni bypass CORS
  if (url.includes("drive.google.com")) {
    var fileId = "";
    if (url.includes("id=")) { fileId = url.split("id=")[1].split("&")[0]; } 
    else if (url.includes("/d/")) { fileId = url.split("/d/")[1].split("/")[0]; }
    if (fileId !== "") { return "https://lh3.googleusercontent.com/d/" + fileId; }
  }
  return url;
}
