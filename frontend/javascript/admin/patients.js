document.addEventListener('DOMContentLoaded', () => {
  var cedula = "";
  let userID
  
  // Initialize DataTable
  const initDataTable = () => {
    $('#patients-table').DataTable({
      "columnDefs": [
        { "orderable": false, "targets": [7] }
      ],
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-MX.json',
      }
    })
  }

  const loadPatientsIntoTable = () => {
    fetch('http://localhost:3000/patients/list')
      .then(response => response.json())
      .then(data => { 
        if (data) {
          document.querySelector('#patients-table').style.display = 'table'
          const table = document.querySelector('#patients-table-data')
          while (table.firstChild) {
            table.removeChild(table.firstChild)
          }
          const fragment = document.createDocumentFragment()
          data.forEach(item => {
            const userID = item.id_usuario
            const patientID = item.cedula
            const patientFirstName = `${item.primer_nombre} ${item.segundo_nombre}`
            const patientLastName = `${item.primer_apellido} ${item.segundo_apellido}`
            const patientCellPhone = item.telefono_movil
            const patientEmail = item.correo
            const patientAge = calcAge(item.fecha_nacimiento)
            const patientMaritalStatus = item.estado_civil
            const row = document.createElement('tr')
            row.innerHTML = `
              <td>${patientID}</td>
              <td>${patientFirstName}</td>
              <td>${patientLastName}</td>
              <td>${patientCellPhone}</td>
              <td>${patientEmail}</td>
              <td>${patientAge}</td>
              <td>${patientMaritalStatus}</td>
              <td>
                <div>
                  <button type='button' class='btn btn-primary btn-sm' id='edit-btn' data-bs-toggle='modal' data-bs-target='#patient-edit-modal' data-patient-id='${patientID}'>
                    <i class='fa-solid fa-pen-to-square'></i>
                  </button>
                  <button type='button' class='btn btn-primary btn-sm' data-bs-toggle='modal' data-bs-target='#create-appt-modal'>
                    <i class='fa-solid fa-calendar-plus'></i>
                  </button>
                  <button type='button' class='btn btn-danger btn-sm' data-user-id='${userID}'>
                    <i class='fa-solid fa-trash'></i>
                  </button>
                </div>
              </td>
            `
            fragment.appendChild(row)
          })
          table.appendChild(fragment)
          initDataTable()
        } else {
          document.querySelector('.alert').style.display = 'block'
        }
      })
      .catch((error) => {
        console.error('Error en la solicitud de pacientes:', error.message)
        document.querySelector('.alert').style.display = 'block'
      })
  }  
  
  loadPatientsIntoTable()

  const calcAge = dobString => {
    const dob = new Date(dobString)
    const currentDate = new Date()
    const age = currentDate - dob
    const ageMS = new Date(age)
    return Math.abs(ageMS.getUTCFullYear() - 1970)
  }

  const isDuplicatedID = (patientID) => {
    return fetch('http://localhost:3000/paciente/verifyID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cedula: patientID }),
    })
    .then(response => response.json())
    .then(data => data.cedula)
    .catch(error => {
        console.error(error)
        return false
    })
  }

  const isDuplicatedEmail = (patientEmail) => {
    return fetch('http://localhost:3000/paciente/verifyEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo: patientEmail }),
    })
    .then(response => response.json())
    .then(data => data.correo)
    .catch(error => {
        console.error(error);
        return false
    })
  }

  $('#create-new-patient-form').submit((e) => {
    e.preventDefault()
    const patientID = $('#patient-id').val()
    const patientEmail = $('#patient-email').val()
    Promise.all([isDuplicatedID(patientID), isDuplicatedEmail(patientEmail)])
      .then(([registeredID, registeredEmail]) => {
        if (registeredID || registeredEmail) {
          Swal.fire({
            title: 'Error en el registro',
            text: 'La identificación o el email ingresados ya se encuentran registrados.',
            icon: 'error',
            showConfirmButton: true
          });
        } else {
          createNewPatient()
        }
      })
      .catch(error => {
          console.error(error)
      })
  })

  const createNewPatient = () => {
    let patientFirstName = $('#patient-first-name').val()
    let patientMiddleName = $('#patient-middle-name').val()
    let patientLastName1 = $('#patient-last-name-1').val()
    let patientLastName2 = $('#patient-last-name-2').val()
    let patientID = $('#patient-id').val()
    let patientEmail = $('#patient-email').val()
    let patientPhone = $('#patient-phone').val()
    let patientDOB = $('#patient-dob').val()
    let patientMaritalStatus = $("select[name='patient-marital-status'] option:selected").text();
    let patientPassword = $('#patient-id').val()
    let patientAddress = $('#patient-address').val()

    let patientData = {
      primer_nombre: patientFirstName,
      segundo_nombre: patientMiddleName,
      primer_apellido: patientLastName1,
      segundo_apellido: patientLastName2,
      cedula: patientID,
      correo: patientEmail,
      telefono_movil: patientPhone,
      fecha_nacimiento: patientDOB,
      estado_civil: patientMaritalStatus,
      contrasenia: patientPassword,
      direccion: patientAddress
    };

    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientData)
    };

    fetch('http://localhost:3000/paciente/guardar', requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.statusCodeValue !== 200) {
          Swal.fire({
            title: '¡Paciente creado de manera exitosa!',    
            text: data.body,                    
            icon: 'success',
            showConfirmButton: false,
            timer: 3500
          })
          $("form")[0].reset();
          $('#patients-table').DataTable().destroy()
          $('#patients-table-data').empty()
          loadPatientsIntoTable()
        } else {
          mostrarMensajeError('Error en el registro', data.error)
        }
      })
      .catch(error => {
        Swal.fire({
          title: 'Error en el registro',
          text: 'Error: ' + error.error,                        
          icon: 'error',
          showConfirmButton: true
        })
      })
  };

  $('#patients-table-data').on('click', '#edit-patient-btn', function () {
    cedula = $('select[name="estado"] option:selected').text()
    var nombres = $("#inf tbody tr:eq(0) td:eq(1)").text()
    nombres = nombres.split(" ")
    $("#inp-p-nombre").val(nombres[0])
    $("#inp-s-nombre").val(nombres[1])
    var apellidos = $("#inf tbody tr:eq(0) td:eq(0)").text()
    apellidos = apellidos.split(" ")
    $("#inp-p-apellido").val(apellidos[0])
    $("#inp-s-apellido").val(apellidos[1])
    var fecha = $("#inf tbody tr:eq(0) td:eq(2)").text()
    $("#fecha").val(fecha)
    var estado = $("#inf tbody tr:eq(0) td:eq(3)").text()
    $("#inp-estado").val(estado)
    var correo = $("#contacto tbody tr:eq(0) td:eq(0)").text()
    $("#correo").val(correo)
    var tlf_fijo = $("#contacto tbody tr:eq(0) td:eq(1)").text()
    $("#tlf-fijo").val(tlf_fijo)
    var tlf_movil = $("#contacto tbody tr:eq(0) td:eq(2)").text()
    $("#tlf-movil").val(tlf_movil)
  });


  $(".guardar").click(function () {
    $(".modal").css('display', 'none')
    var url_update_paciente = "http://localhost:3000/paciente/actualizar"
    datos = {
      primer_nombre: $("#inp-p-nombre").val(),
      segundo_nombre: $("#inp-s-nombre").val(),
      primer_apellido: $("#inp-p-apellido").val(),
      segundo_apellido: $("#inp-s-apellido").val(),
      correo: $("#correo").val(),
      telefono_movil: $("#tlf-movil").val(),
      telefono_fijo: $("#tlf-fijo").val(),
      fecha_nacimiento: $("#fecha").val() + 'T05:00:00.000Z',
      estado_civil: $("#inp-estado").val(),
      cedula: cedula,
      direccion: $("#inp-direccion").val()
    }
    var requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    };
    fetch(url_update_paciente, requestOptions)
      .then(function (response) {
        responseClone = response.clone();
        return response.json();
      }) // Convertir la respuesta a JSON
      .then(data => {
        if (data.statusCodeValue === 400) {
          Swal.fire({
            title: 'Error en la actualización de los datos',
            text: 'Error: ' + data.body,
            icon: 'error',
            showConfirmButton: false,
            timer: 3500
          })
        }
        else {
          Swal.fire({
            title: 'Actualización exitosa',
            text: data.body,
            icon: 'success',
            showConfirmButton: false,
            timer: 3500
          });
          location.reload();
        }
      })
      .catch(error => {
        console.log(error);
      })
  })

  // Delete patient event trigger
  $("#patients-table-data").on('click', '#del-patient-btn', function () {
    showDeletePatientConfirmationDialog()
  })

  const showDeletePatientConfirmationDialog = () => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar',
      reverseButtons: true,
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        deletePatient();
      }
    });
  }

  const deletePatient = () => {
    let userIDData = {
      id_usuario: userID
    }
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userIDData)
    }
    fetch('http://localhost:3000/usuario/eliminar', requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.statusCodeValue === 400 || data.statusCodeValue === 404) {
          Swal.fire({
            title: 'Error en la eliminación',
            text: 'Error: ' + data.body,
            icon: 'error',
            showConfirmButton: true
          })
        } else {
          Swal.fire({
            title: 'Paciente eliminado correctamente',
            text: data.body,
            icon: 'success',
            showConfirmButton: true
          })
          $('#patients-table').DataTable().destroy()
          $('#patients-table-data').empty()
          loadPatientsIntoTable()
        }
      })
      .catch(error => {
        console.log(error);
      })
  }
});