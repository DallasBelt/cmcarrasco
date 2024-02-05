document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('form').addEventListener('submit', handleLoginRequest);
});

const handleLoginRequest = async (e) => {
  e.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      correo: email,
      contrasenia: password
    }, {
      withCredentials: true // This includes the cookies 
    });

    handleLoginResponse(response.data.user);
  } catch (error) {
      console.error(error);
      handleLoginError(error.response.status);
  }
};

const handleLoginResponse = (data) => {

  switch (data.role_id) {
    case 1:
      window.location.href = 'admin/index.html';
      break;
    case 2:
      window.location.href = 'medic/index.html';
      break;
    case 3:
      window.location.href = 'secretary/index.html';
      break;
    case 4:
      window.location.href = 'patient/index.html';
      break;
    default:
      Swal.fire({
        title: 'Error!',
        text: 'Rol de usuario no reconocido.',
        icon: 'error',
      });
  }
};

const handleLoginError = (error) => {
  if (error === 401) {
    Swal.fire({
      title: 'Credenciales incorrectas!',
      text: 'Por favor, verifique su correo y/o contraseña.',
      icon: 'error',
    });
  } else if (error === 404) {
    Swal.fire({
      title: 'Recurso no encontrado!',
      text: 'La página solicitada no existe.',
      icon: 'error',
    });
  } else {
    Swal.fire({
      title: 'Error en la solicitud!',
      text: 'Hubo un problema al procesar la solicitud.',
      icon: 'error',
    });
  }
};