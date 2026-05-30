// CONFIG UTAMA URL SINKRONISASI DATABASE GOOGLE SPREADSHEET
const API_URL = "https://script.google.com/macros/s/AKfycbyspHrLwmxL4z8t7QlGhgNJegnR93OxpsRk6azMNJ8G8_BZF0PAyVX5BtzJcg_3cwzRjw/exec";

function callAPI(payload, successCallback) {
  document.getElementById('global-loader').classList.remove('hidden');
  fetch(API_URL, { method: 'POST', mode: 'cors', body: JSON.stringify(payload) })
  .then(res => res.json())
  .then(res => { 
    document.getElementById('global-loader').classList.add('hidden'); 
    successCallback(res); 
  })
  .catch(err => {
    document.getElementById('global-loader').classList.add('hidden');
    console.error("API Connection Error: ", err);
  });
}

// FIX TOTAL CDN DRIVE LINK BYPASS SECURITY CORRUPTION
function bersihLinkDrive(url) {
  if (!url || typeof url !== 'string') return "";
  if (url.includes("drive.google.com")) {
    var fileId = "";
    if (url.includes("id=")) { fileId = url.split("id=")[1].split("&")[0]; } 
    else if (url.includes("/d/")) { fileId = url.split("/d/")[1].split("/")[0]; }
    if (fileId !== "") { return "https://lh3.googleusercontent.com/d/" + fileId; }
  }
  return url;
}
