document.addEventListener('DOMContentLoaded', () => {
  let userID
  let originalPatientData = {}
  
  // ===== INITIALIZE DATA TABLE =====
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


  // ===== RESET MODAL FIELDS WHEN EDITION MODE CLOSES =====
  const resetCreateEditPatientModal = () => {
    document.querySelector('#create-edit-patient-modal').addEventListener('hidden.bs.modal', () => {
      document.querySelector('#createPatientModalLabel').textContent = 'Crear nuevo paciente'
      document.querySelector('#create-edit-patient-modal form').reset()
    })
  }

  // Calling the reset modal function
  resetCreateEditPatientModal()


  // ===== LOAD PATIENT(S) INTO THE TABLE =====

  // Fetches the request to the server
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
                  <button type='button' class='btn btn-primary btn-sm' id='edit-btn' data-bs-toggle='modal' data-bs-target='#create-edit-patient-modal' data-patient-id='${patientID}'>
                    <i class='fa-solid fa-pen-to-square'></i>
                  </button>
                  <button type='button' class='btn btn-primary btn-sm' id='new-appt-btn' data-bs-toggle='modal' data-bs-target='#create-appt-modal'>
                    <i class='fa-solid fa-calendar-plus'></i>
                  </button>
                  <button type='button' class='btn btn-danger btn-sm' id='del-pt-btn' data-user-id='${userID}'>
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
  
  // Calls the function to show the patients in the table when the page loads
  loadPatientsIntoTable()


  // ===== CALCULATE THE AGE OF A PATIENT BASED ON THEIR DOB =====
  const calcAge = dobString => {
    const dob = new Date(dobString)
    const currentDate = new Date()
    const age = currentDate - dob
    const ageMS = new Date(age)
    return Math.abs(ageMS.getUTCFullYear() - 1970)
  }


  // ===== EDIT AND UPDATE PATIENT =====

  // Button trigger to open modal in edit mode and get the data from the attribute
  document.querySelector('#patients-table').addEventListener('click', (e) => {
    const targetButton = e.target.closest('button')
    if (targetButton && targetButton.id === 'edit-btn') {
      const patientID = targetButton.getAttribute('data-patient-id')
      fillPatientDataInModal(patientID)
    }
  })
  
  // Fetch data based on patient ID to populate the fields
  const fillPatientDataInModal = (patientID) => {
    fetch('http://localhost:3000/patients/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cedula: patientID }),
    })
    .then(response => response.json())
    .then(data => {
      document.querySelector('#createPatientModalLabel').textContent = 'Editar paciente registrado'
      document.querySelector('#patient-id').value = data.cedula
      document.querySelector('#patient-first-name').value = data.primer_nombre
      document.querySelector('#patient-middle-name').value = data.segundo_nombre
      document.querySelector('#patient-last-name-1').value = data.primer_apellido
      document.querySelector('#patient-last-name-2').value = data.segundo_apellido
      const patientDOB = new Date(data.fecha_nacimiento).toISOString().split('T')[0]
      document.querySelector('#patient-dob').value = patientDOB
      document.querySelector("select[name='patient-marital-status']").value = data.estado_civil
      document.querySelector('#patient-address').value = data.direccion
      document.querySelector('#patient-email').value = data.correo
      document.querySelector('#patient-phone').value = data.telefono_movil

      // Save loaded data for later comparison
      originalPatientData = {
        cedula: data.cedula,
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido,
        fecha_nacimiento: data.fecha_nacimiento,
        estado_civil: data.estado_civil,
        direccion: data.direccion,
        correo: data.correo,
        telefono_movil: data.telefono_movil,
        id_usuario: data.id_usuario
      }
    })
    .catch(error => {
      console.error('Error al obtener datos del paciente:', error.message)
    })
  }

  /*const handleEditFormSubmit = async (e) => {
    e.preventDefault()
    
    const updatedData = {}
    // Objeto para guardar los datos actualizados
    // const updatedData = {
    //   id_usuario: originalPatientData.id_usuario,
    //   cedula: document.querySelector('#patient-id').value,
    //   primer_nombre: document.querySelector('#patient-first-name').value,
    //   segundo_nombre: document.querySelector('#patient-middle-name').value,
    //   primer_apellido: document.querySelector('#patient-last-name-1').value,
    //   segundo_apellido: document.querySelector('#patient-last-name-2').value,
    //   fecha_nacimiento: document.querySelector('#patient-dob').value,
    //   estado_civil: document.querySelector("select[name='patient-marital-status']").value,
    //   direccion: document.querySelector('#patient-address').value,
    //   correo: document.querySelector('#patient-email').value,
    //   telefono_movil: document.querySelector('#patient-phone').value
    // }
  
    // Función para comparar y agregar al objeto updatedData si hay cambios
    const compareAndUpdate = (field, originalValue, newValue) => {
      if (originalValue !== newValue) {
        updatedData[field] = newValue
      }
    }
  
    // Comparar cada campo y agregar a updatedData si ha cambiado
    compareAndUpdate('cedula', originalPatientData.cedula, document.getElementById('patient-id').value)
    compareAndUpdate('primer_nombre', originalPatientData.primer_nombre, document.querySelector('#patient-first-name').value)
    compareAndUpdate('segundo_nombre', originalPatientData.segundo_nombre, document.querySelector('#patient-middle-name').value)
    compareAndUpdate('primer_apellido', originalPatientData.primer_apellido, document.querySelector('#patient-last-name-1').value)
    compareAndUpdate('segundo_apellido', originalPatientData.segundo_apellido, document.querySelector('#patient-last-name-2').value)
    compareAndUpdate('fecha_nacimiento', originalPatientData.fecha_nacimiento, document.querySelector('#patient-dob').value)
    compareAndUpdate('estado_civil', originalPatientData.estado_civil, document.querySelector("select[name='patient-marital-status']").value)
    compareAndUpdate('direccion', originalPatientData.direccion, document.querySelector('#patient-address').value)
    compareAndUpdate('correo', originalPatientData.correo, document.getElementById('patient-email').value);
    compareAndUpdate('telefono_movil', originalPatientData.telefono_movil, document.querySelector('#patient-phone').value)
  
    let checksToPerform = []
    let isDuplicated = false
  
    if ('cedula' in updatedData) {
      checksToPerform.push(isDuplicatedID(updatedData.cedula))
    }
    if ('correo' in updatedData) {
      checksToPerform.push(isDuplicatedEmail(updatedData.correo))
    }
  
    try {
      const results = await Promise.all(checksToPerform)
      isDuplicated = results.some(result => result)
  
      if (!isDuplicated) {
        if (Object.keys(updatedData).length > 0) {
          updatePatientData(updatedData); // Actualizar solo si hay cambios
        } else {
          console.log('No hay cambios para actualizar');
          Swal.fire({
            title: 'No hay cambios para actualizar',    
            text: 'No se registraron modificaciones en los datos del paciente.',                    
            icon: 'warning',
            showConfirmButton: false,
            timer: 3500
          })
        }
      } else {
        // Manejar la situación de duplicados
      }
    } catch (error) {
      console.error('Error en la verificación de duplicados:', error);
      // Manejar error
    }
  }*/

  // Function that analize the changes inside the form in edit mode
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    // Objeto inicialmente vacío para guardar solo los datos actualizados
    const updatedData = {}

    // Función para comparar y agregar al objeto updatedData si hay cambios
    const compareAndUpdate = (field, originalValue, newValue) => {
      if (originalValue !== newValue) {
        updatedData[field] = newValue
      }
    }

    // Comparar cada campo y agregar a updatedData si ha cambiado
    compareAndUpdate('cedula', originalPatientData.cedula, document.getElementById('patient-id').value)
    compareAndUpdate('primer_nombre', originalPatientData.primer_nombre, document.querySelector('#patient-first-name').value)
    compareAndUpdate('segundo_nombre', originalPatientData.segundo_nombre, document.querySelector('#patient-middle-name').value)
    compareAndUpdate('primer_apellido', originalPatientData.primer_apellido, document.querySelector('#patient-last-name-1').value)
    compareAndUpdate('segundo_apellido', originalPatientData.segundo_apellido, document.querySelector('#patient-last-name-2').value)
    compareAndUpdate('fecha_nacimiento', originalPatientData.fecha_nacimiento, document.querySelector('#patient-dob').value)
    compareAndUpdate('estado_civil', originalPatientData.estado_civil, document.querySelector("select[name='patient-marital-status']").value)
    compareAndUpdate('direccion', originalPatientData.direccion, document.querySelector('#patient-address').value)
    compareAndUpdate('correo', originalPatientData.correo, document.getElementById('patient-email').value)
    compareAndUpdate('telefono_movil', originalPatientData.telefono_movil, document.querySelector('#patient-phone').value)

    // Comprobar si hay cambios
    const hasChanges = Object.keys(updatedData).length > 0;

    if (hasChanges) {
      // Incluir id_usuario en los datos actualizados
      updatedData['id_usuario'] = originalPatientData.id_usuario

      let checksToPerform = []

      // Verificar duplicados solo si 'cedula' o 'correo' han cambiado
      if ('cedula' in updatedData) {
        checksToPerform.push(isDuplicatedID(updatedData.cedula))
      }
      if ('correo' in updatedData) {
        checksToPerform.push(isDuplicatedEmail(updatedData.correo))
      }

      try {
        const results = await Promise.all(checksToPerform)
        const isDuplicated = results.some(result => result)

        if (!isDuplicated) {
          // Realizar la actualización si no hay duplicados
          updatePatientData(updatedData)
          .then(response => {
            if (response.ok) {
              // Muestra un mensaje de éxito
              Swal.fire({
                title: '¡Actualización exitosa!',
                text: 'Los datos del paciente han sido actualizados correctamente.',
                icon: 'success',
                showConfirmButton: false,
                timer: 3500
              });
            } else {
              // Muestra un mensaje de error
              Swal.fire({
                title: 'Error en la actualización',
                text: 'No se pudo actualizar los datos del paciente.',
                icon: 'error',
                showConfirmButton: true
              })
            }
          }).catch(updateError => {
            // Aquí puedes manejar errores que ocurran durante la actualización
            console.error('Error al actualizar los datos:', updateError);
            Swal.fire({
              title: '¡Error en la actualización!',
              text: 'No se pudo actualizar los datos del paciente.',
              icon: 'error',
              showConfirmButton: true
            })
          })
        } else {
          // Manejar la situación de duplicados aquí
          Swal.fire({
            title: 'Datos Duplicados',
            text: 'El número de cédula o correo electrónico ya está registrado.',
            icon: 'warning',
            showConfirmButton: true
          })
        }
      } catch (error) {
        // Manejar errores aquí
        console.error('Error durante la comprobación de duplicados:', error);
        Swal.fire({
          title: '¡Error en la verificación!',
          text: 'Hubo un problema al verificar los datos.',
          icon: 'error',
          showConfirmButton: true
        })
      }

    } else {
      // Si no hay cambios, muestra un mensaje informativo
      Swal.fire({
        title: 'Sin Cambios',
        text: 'No se detectaron modificaciones en los datos.',
        icon: 'info',
        showConfirmButton: true
      })
    }
  }

  // Handles the submission of the patient form. This function is triggered when the form
  // for creating or editing a patient is submitted.
  const updatePatientData = (updatedData) => {
    console.log('Enviando datos:', updatedData)
    return fetch('http://localhost:3000/patients/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`)
        }
        return response.json();
    })
    .then(data => {
        // Aquí manejas la respuesta exitosa
        console.log('Actualización exitosa:', data)
        Swal.fire({
          title: '¡Actualización exitosa!',    
          text: 'Los datos del paciente fueron modificados correctamente.',                    
          icon: 'success',
          showConfirmButton: false,
          timer: 3500
        })
    })
    .catch(error => {
        // Aquí manejas cualquier error que ocurra durante la solicitud
        console.error('Error al actualizar los datos:', error)
        Swal.fire({
          title: '¡Actualización fallida!',    
          text: 'No se modificaron los datos del paciente.',                    
          icon: 'error',
          showConfirmButton: false,
          timer: 3500
        })
    });
  }

  // Event handler when submitting the form in edit mode
  const createEditPatient = document.querySelector('#create-edit-patient-form')
  if (createEditPatient) {
    createEditPatient.addEventListener('submit', handleEditFormSubmit)
  }

  // Check if the ID value is already in the DB
  const isDuplicatedID = (patientID) => {
    return fetch('http://localhost:3000/patients/verifyID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cedula: patientID }),
    })
    .then(response => response.json())
    .then(data => data.registeredID)
    .catch(error => {
      console.error(error)
      throw new Error('Error al verificar la identificación')
    })
  }
  
  // Check if the email value is already in the DB
  const isDuplicatedEmail = (patientEmail) => {
    return fetch('http://localhost:3000/patients/verifyEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo: patientEmail }),
    })
    .then(response => response.json())
    .then(data => data.registeredEmail)
    .catch(error => {
      console.error(error)
      throw new Error('Error al verificar el correo electrónico')
    })
  }

  // Handle the submition of the form
  // $('#create-new-patient-form').submit((e) => {
  //   e.preventDefault()
  //   const patientID = $('#patient-id').val()
  //   const patientEmail = $('#patient-email').val()
  //   Promise.all([isDuplicatedID(patientID), isDuplicatedEmail(patientEmail)])
  //     .then(([registeredID, registeredEmail]) => {
  //       if (registeredID || registeredEmail) {
  //         Swal.fire({
  //           title: 'Error en el registro',
  //           text: 'La identificación o el email ingresados ya se encuentran registrados.',
  //           icon: 'error',
  //           showConfirmButton: true
  //         });
  //       } else {
  //         createNewPatient()
  //       }
  //     })
  //     .catch(error => {
  //         console.error(error)
  //     })
  // })

  /*// Write the new patient data into the DB
  const createNewPatient = () => {
    let patientData = {
      primer_nombre: document.querySelector('#patient-first-name').value,
      segundo_nombre: document.querySelector('#patient-middle-name').value,
      primer_apellido: document.querySelector('#patient-last-name-1').value,
      segundo_apellido: document.querySelector('#patient-last-name-2').value,
      cedula: document.querySelector('#patient-id').value,
      correo: document.querySelector('#patient-email').value,
      telefono_movil: document.querySelector('#patient-phone').value,
      fecha_nacimiento: document.querySelector('#patient-dob').value,
      estado_civil: document.querySelector("select[name='patient-marital-status'] option:checked").textContent,
      contrasenia: document.querySelector('#patient-id').value,
      direccion: document.querySelector('#patient-address').value
    }

    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientData)
    };

    fetch('http://localhost:3000/patients/save', requestOptions)
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
          document.querySelector('form')[0].reset()
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
  }*/


  // ===== DELETE PATIENT =====

  // Delete patient event trigger
  document.querySelector('#patients-table').addEventListener('click', (e) => {
    const targetButton = e.target.closest('button')
    if (targetButton && targetButton.id === 'del-pt-btn') {
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
          deletePatient()
        }
      })
    }
  })

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
        console.log(error)
      })
  }
})