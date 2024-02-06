document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#logout').addEventListener('click', handleLogoutRequest);
});

const handleLogoutRequest = async () => {
  try {
    await axios.post('http://localhost:3000/session/logout', {}, {
      withCredentials: true
    });
    window.location.href = '../login.html';
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};