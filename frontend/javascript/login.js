// $(document).ready(function () {

//   //Evento submit. Se ejecuta cuando se emvía el formulario
//   $('form').submit(function (e) {
//     e.preventDefault();

//     //Obtener valores de los inputs
//     let email = document.getElementById('email').value;
//     let password = document.getElementById('password').value;
  
//     //Armando el objeto datos           
//     var userData = {
//       correo: email,
//       contrasenia: password
//     };

//     // Configurar la petición
//     var requestOptions = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json' // Especificar que estamos enviando JSON
//       },
//       body: JSON.stringify(userData) // Convertir el objeto 'datos' a formato JSON
//     };

//     // Realizar la petición fetch
//     fetch('http://localhost:3000/login/login', requestOptions)
//       .then(function (response) {
//         responseClone = response.clone();
//         if (response.status === 401 || response.status === 404) {
//           Swal.fire({
//             title: 'Credenciales incorrectas!',
//             text: 'Por favor, verifique su correo y/o contraseña.',
//             icon: 'error',
//           })
//         }
//         return response.json(); // Convertir la respuesta a JSON                      
//       })
//       .then(data => {
//         const username = data.nombre_usuario;
//         const userID = data.id_usuario;
//         const roleID = data.role_id;
//         let _username = sessionStorage.setItem('usuario', username);
//         let _userID = sessionStorage.setItem('id_usuario', userID);
//         let _roleID = sessionStorage.setItem('role_id', roleID);
//         if (sessionStorage.getItem('role_id') === '1') {
//           window.location.href = 'admin/index.html'
//         } else if (sessionStorage.getItem('role_id') === '2') {
//           window.location.href = 'medico/inicio.html'
//         } else if (sessionStorage.getItem('role_id') === '3') {
//           window.location.href = 'secretaria/inicio.html'
//         } else if (sessionStorage.getItem('role_id') === '4') {
//           window.location.href = 'paciente/inicio.html'
//         }
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//   });
// });

document.addEventListener('DOMContentLoaded', () => {

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userData = {
      correo: email,
      contrasenia: password
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    }

    fetch('http://localhost:3000/login/login', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json();
      })
      .then(data => {
        const username = data.nombre_usuario
        const userID = data.id_usuario
        const roleID = data.role_id
        sessionStorage.setItem('usuario', username)
        sessionStorage.setItem('id_usuario', userID)
        sessionStorage.setItem('role_id', roleID)

        switch (sessionStorage.getItem('role_id')) {
          case '1':
            window.location.href = 'admin/index.html'
            break;
          case '2':
            window.location.href = 'medico/inicio.html'
            break;
          case '3':
            window.location.href = 'secretaria/inicio.html'
            break;
          case '4':
            window.location.href = 'paciente/inicio.html'
            break;
        }
      })
      .catch(error => {
        console.error('Error:', error)

        if (error.message.includes('401')) {
          Swal.fire({
            title: 'Credenciales incorrectas!',
            text: 'Por favor, verifique su correo y/o contraseña.',
            icon: 'error',
          })
        } else if (error.message.includes('404')) {
          Swal.fire({
            title: 'Recurso no encontrado!',
            text: 'La página solicitada no existe.',
            icon: 'error',
          })
        } else {
          Swal.fire({
            title: 'Error en la solicitud!',
            text: 'Hubo un problema al procesar la solicitud.',
            icon: 'error',
          })
        }
      })
  })
})
