var userAktif = null;

function simpanSesiLogin(dataUser) {
  localStorage.setItem('session_pd_user', JSON.stringify(dataUser));
  terapkanSesiUI(dataUser);
}

function cekSesiLokalSistem() {
  var dataLokal = localStorage.getItem('session_pd_user');
  if (dataLokal) {
    userAktif = JSON.parse(dataLokal);
    terapkanSesiUI(userAktif);
    loadDataTerproteksi();
  }
}

function terapkanSesiUI(user) {
  userAktif = user;
  document.getElementById('btn-show-auth').classList.add('hidden');
  document.getElementById('user-profile-badge').classList.remove('hidden');
  document.getElementById('protected-menus').classList.remove('hidden');
  document.getElementById('user-menu-name').innerText = user.nama;
  document.getElementById('user-menu-role').innerText = user.role;
  if (user.foto) document.getElementById('user-avatar-img').src = bersihLinkDrive(user.foto);
  
  if (user.role.includes("Admin")) {
    document.getElementById('menu-anggota').classList.remove('hidden');
    document.querySelectorAll('.opsi-admin').forEach(el => el.classList.remove('hidden'));
  }
}

function submitLogin() {
  var email = document.getElementById('log-email').value;
  var pass = document.getElementById('log-pass').value;
  callAPI({ action: 'login', email: email, pass: pass }, function(res) {
    if (res.sukses) {
      document.getElementById('modalAuth').close();
      simpanSesiLogin(res);
    } else {
      alert(res.pesan);
    }
  });
}

function logoutApp() {
  localStorage.removeItem('session_pd_user');
  location.reload();
}