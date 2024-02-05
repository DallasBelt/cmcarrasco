document.addEventListener('DOMContentLoaded', () => {
  displayUsername();
});

const displayUsername = async () => {
  try {
    const response = await axios.get('http://localhost:3000/session/displayUsername', {
      withCredentials: true
    });
    document.querySelector('#username-display').textContent = response.data.nombre_usuario;
  } catch (error) {
    document.querySelector('#username-display').textContent = 'Administrador'
    console.error('Error al obtener información del usuario:', error);
  }
};