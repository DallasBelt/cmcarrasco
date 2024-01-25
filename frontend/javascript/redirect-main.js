$(document).ready(function () {
  let usuario = sessionStorage.getItem('usuario');
  document.getElementById('username-display').innerHTML += usuario;
  if (usuario === null) {
    window.location.href = 'login.html';
  }
});