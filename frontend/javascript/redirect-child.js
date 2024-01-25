var usuario = sessionStorage.getItem("usuario");
$(document).ready(function () {
  document.getElementById('username-display').innerHTML += usuario;
  if (usuario === null) {
    window.location.href = '../login.html';
  }
});