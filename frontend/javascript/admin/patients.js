document.addEventListener('DOMContentLoaded', () => {
  loadPatientsIntoTable();
});

let modalMode = '';

// Submit form handler
document.querySelector('#patient-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const patientData = {
    primer_nombre: document.querySelector('#patient-first-name').value,
    segundo_nombre: document.querySelector('#patient-middle-name').value,
    primer_apellido: document.querySelector('#patient-last-name-1').value,
    segundo_apellido: document.querySelector('#patient-last-name-2').value,
    cedula: document.querySelector('#patient-id').value,
    fecha_nacimiento: document.querySelector('#patient-dob').value,
    estado_civil: document.querySelector("select[name='patient-marital-status']").value,
    direccion: document.querySelector('#patient-address').value,
    correo: document.querySelector('#patient-email').value,
    telefono_movil: document.querySelector('#patient-phone').value
  };

  const dataChanged = Object.keys(patientData).some(key => patientData[key] !== originalPatientData[key]);
  console.log(dataChanged)
  console.log(patientData, originalPatientData)

  if (modalMode === 'create') {
    await createPatient(patientData);
  } else if (modalMode === 'edit' && dataChanged) {
    await updatePatient(patientData);
  } else {
    Swal.fire({
      title: '¡No hay cambios que guardar!',
      text: 'Debe realizar cambios antes de guardar la información. ',
      icon: 'warning',
      showConfirmButton: true
    });
  }
});

// ===== INITIALIZE DATA TABLE =====
const initDataTable = () => {
  $('#patient-table').DataTable({
    "columnDefs": [
      { "orderable": false,
        "targets": [0, 7, 3]
      }
    ],
    order: [[1, 'asc']],
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-MX.json',
    }
  });
}


// Loads the table and the data
const loadPatientsIntoTable = async () => {
  try {
    const response = await axios.get('http://localhost:3000/patients/read', {
      withCredentials: true
    });
    const data = response.data;

    if (data) {
      document.querySelector('#patient-table').style.display = 'table';
      const table = document.querySelector('#patient-table-data');
      while (table.firstChild) {
          table.removeChild(table.firstChild);
      }
      const fragment = document.createDocumentFragment();

      data.forEach(item => {
        const userID = item.id_usuario;
        const patientID = item.cedula;
        const patientFirstName = `${item.primer_nombre} ${item.segundo_nombre}`;
        const patientLastName = `${item.primer_apellido} ${item.segundo_apellido}`;
        const patientCellPhone = item.telefono_movil;
        const patientEmail = item.correo;
        const patientAge = calcAge(item.fecha_nacimiento);
        const patientMaritalStatus = item.estado_civil;
        
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${patientID}</td>
          <td>${patientLastName}</td>
          <td>${patientFirstName}</td>
          <td>${patientCellPhone}</td>
          <td>${patientEmail}</td>
          <td>${patientAge}</td>
          <td>${patientMaritalStatus}</td>
          <td>
            <div>
              <button type='button' class='btn btn-primary btn-sm' id='edit-patient-btn' data-bs-toggle='modal' data-bs-target='#patient-modal' data-patient-id='${patientID}'>
                  <i class='fa-solid fa-pen-to-square'></i>
              </button>
              <button type='button' class='btn btn-primary btn-sm' id='new-appt-btn' data-bs-toggle='modal' data-bs-target='#create-appt-modal'>
                  <i class='fa-solid fa-calendar-plus'></i>
              </button>
              <button type='button' class='btn btn-danger btn-sm' id='del-patient-btn' data-user-id='${userID}'>
                  <i class='fa-solid fa-trash'></i>
              </button>
            </div>
          </td>
        `;
        fragment.appendChild(row);
      });

        table.appendChild(fragment);
        initDataTable();
      } else {
        document.querySelector('.alert').style.display = 'block';
      }
  } catch (error) {
      console.error('Error en la solicitud de pacientes:', error.message);
      document.querySelector('.alert').style.display = 'block';
  }
};
  
// Calculate the age based on DOB
const calcAge = dobString => {
  const dob = new Date(dobString)
  const currentDate = new Date()
  const age = currentDate - dob
  const ageMS = new Date(age)
  return Math.abs(ageMS.getUTCFullYear() - 1970)
}

// Request data based on patient ID to populate the fields
let originalPatientData = {};
const fillModal = async (patientID) => {
  try {
    const response = await axios.post('http://localhost:3000/patients/readById', {cedula: patientID }, {
      withCredentials: true
    });
    const data = response.data;
  
    document.querySelector('#patient-id').value = data.cedula;
    document.querySelector('#patient-first-name').value = data.primer_nombre;
    document.querySelector('#patient-middle-name').value = data.segundo_nombre;
    document.querySelector('#patient-last-name-1').value = data.primer_apellido;
    document.querySelector('#patient-last-name-2').value = data.segundo_apellido;
    const patientDOB = new Date(data.fecha_nacimiento).toISOString().split('T')[0];
    document.querySelector('#patient-dob').value = patientDOB;
    document.querySelector("select[name='patient-marital-status']").value = data.estado_civil;
    document.querySelector('#patient-address').value = data.direccion;
    document.querySelector('#patient-email').value = data.correo;
    document.querySelector('#patient-phone').value = data.telefono_movil;

    // Save loaded data for later comparison
    originalPatientData = {
      cedula: data.cedula,
      primer_nombre: data.primer_nombre,
      segundo_nombre: data.segundo_nombre,
      primer_apellido: data.primer_apellido,
      segundo_apellido: data.segundo_apellido,
      fecha_nacimiento: new Date(data.fecha_nacimiento),
      estado_civil: data.estado_civil,
      direccion: data.direccion,
      correo: data.correo,
      telefono_movil: data.telefono_movil,
      id_usuario: data.id_usuario
    }
    
    if (originalPatientData.fecha_nacimiento instanceof Date) {
      originalPatientData.fecha_nacimiento = originalPatientData.fecha_nacimiento.toISOString().split('T')[0];
    }
    
  } catch(error) {
      console.error('Error al obtener datos del paciente:', error.message);
  }
};

const updatePatient = async (patientData) => {
  patientData.id_usuario = originalPatientData.id_usuario;
  patientData.changedEmail = patientData.correo !== originalPatientData.correo;
  try {
    const response = await axios.patch('http://localhost:3000/patients/update', patientData, {
      withCredentials: true
    });

    if (response.status === 200) {
      console.log('¡Paciente actualizado de manera exitosa!');
      Swal.fire({
        title: '¡Paciente actualizado de manera exitosa!',
        text: 'Los datos del paciente han sido actualizados en la base de datos.',
        icon: 'success',
        showConfirmButton: true,
      });
      // document.querySelector('#pt-form').reset();
      $('#patient-table').DataTable().destroy();
      $('#patient-table-data').empty();
      loadPatientsIntoTable();
    } else {
      console.error('¡Error en la actualización del paciente!');
      Swal.fire({
        title: '¡Error en la actualización del paciente!',
        text: 'Hubo un problema al intentar actualizar el paciente.',
        icon: 'error',
        showConfirmButton: true
      });
    }
  } catch (error) {
    console.error('Error en la solicitud:', error.message);
    Swal.fire({
      title: '¡Error en la solicitud!',
      text: 'Hubo un problema con la solicitud de actualización.',
      icon: 'error',
      showConfirmButton: true
    });
  }
};

// Button trigger to open modal in create mode
document.querySelector('#new-patient-btn').addEventListener('click', () => {
  handleModal();
});

// Button trigger to open modal in edit mode and get the data from the attribute
document.querySelector('#patient-table').addEventListener('click', (e) => {
  const targetButton = e.target.closest('button');
  if (targetButton && targetButton.id === 'edit-btn') {
    const patientID = targetButton.getAttribute('data-patient-id');
    handleModal(patientID);
  }
});

// Clear modal fields when closing create mode
const clearModal = () => {
  document.querySelector('#patient-modal').addEventListener('hidden.bs.modal', () => {
    document.querySelector('#PtModalLabel').textContent = 'Crear nuevo paciente';
    document.querySelector('#patient-modal form').reset();
  });
}

const handleModal = (patientID = null) => {
  if (patientID) {
    modalMode = 'edit';
    fillModal(patientID);
    document.querySelector('#PtModalLabel').textContent = 'Editar paciente registrado';
    document.querySelector('#new-save-btn').innerHTML = '<i class="fa-solid fa-floppy-disk me-1"></i>Guardar cambios';
  } else {
    modalMode = 'create';
    clearModal();
    document.querySelector('#PtModalLabel').textContent = 'Registrar nuevo paciente';
    document.querySelector('#new-save-btn').innerHTML = '<i class="fa-solid fa-user-plus me-1"></i>Crear paciente';
  }
};


// CREATE PATIENT FUNCTION
const createPatient = async (patientData) => {

  try {
    const response = await axios.post('http://localhost:3000/patients/create', patientData, {
      withCredentials: true
    });
    
    if (response.status === 200) {
      console.log('¡Paciente creado de manera exitosa!');
      Swal.fire({
        title: '¡Paciente creado de manera exitosa!',    
        text: 'El paciente ha sido agregado a la base de datos.',                    
        icon: 'success',
        showConfirmButton: true,
      });
      document.querySelector('#patient-form').reset();
      $('#patient-table').DataTable().destroy();
      $('#patient-table-data').empty();
      loadPatientsIntoTable();
    } else {
      console.error('¡Error en la creación del paciente!');
      Swal.fire({
        title: '¡Error en la creación del paciente!',    
        text: 'Hubo un problema al intentar crear el paciente.',                    
        icon: 'error',
        showConfirmButton: true
      });
    }
  } catch (error) {
    console.error('Error en la solicitud:', error.message);
    if (error.response && error.response.status === 400) {
      Swal.fire({
        title: '¡Error!',
        text: 'Cédula o correo ya registrado.',
        icon: 'error',
        showConfirmButton: true
      });
    } else {
      Swal.fire({
        title: '¡Error en la solicitud!',    
        text: 'Hubo un problema con la solicitud.',                    
        icon: 'error',
        showConfirmButton: true
      });
    }
  }
};

// ===== DELETE PATIENT =====

// Delete patient event trigger
document.querySelector('#patient-table').addEventListener('click', (e) => {
  const targetButton = e.target.closest('button')
  if (targetButton && targetButton.id === 'del-patient-btn') {
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
  let userIdData = {
    id_usuario: userId
  }
  let requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userIdData)
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
        $('#patient-table').DataTable().destroy()
        $('#patient-table-data').empty()
        loadPatientsIntoTable()
      }
    })
    .catch(error => {
      console.log(error)
    })
}