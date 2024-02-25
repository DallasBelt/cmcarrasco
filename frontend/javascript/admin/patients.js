document.addEventListener('DOMContentLoaded', () => {
  loadPatientsIntoTable();
});

let modalMode = '';
let originalPatientData = {};

// Initialize DataTables
DataTable.intlOrder('es', {
  sensitivity: 'base'
});

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

// Calculate the age of the patient based on their DOB
const calcAge = patientDOB => {
  const dob = new Date(patientDOB);
  const currentDate = new Date();
  const ageInMilliseconds = currentDate - dob;
  const age = new Date(ageInMilliseconds);
  return Math.abs(age.getUTCFullYear() - 1970);
}

// Load the patients' data into the DataTable
const loadPatientsIntoTable = async () => {
  try {
    const response = await axios.get('http://localhost:3000/patients/read', {
      withCredentials: true
    });
    const data = response.data;
    if (Object.keys(data).length > 0) {
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

// Submit form handler
document.querySelector('#patient-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

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
  
// Request data based on patient ID to populate the fields
const fillModal = async (patientID) => {
  try {
    const response = await axios.post('http://localhost:3000/patients/readById', {cedula: patientID }, {
      withCredentials: true
    });
    const data = response.data;

    document.querySelector('#patient-header').innerHTML = `&nbsp; ${data.primer_nombre} ${data.segundo_nombre} ${data.primer_apellido} ${data.segundo_apellido}`
  
    document.querySelector('#patient-first-name').value = data.primer_nombre;
    document.querySelector('#patient-middle-name').value = data.segundo_nombre;
    document.querySelector('#patient-last-name-1').value = data.primer_apellido;
    document.querySelector('#patient-last-name-2').value = data.segundo_apellido;
    document.querySelector('#patient-id').value = data.cedula;
    const patientDOB = data.fecha_nacimiento.split('T')[0];
    document.querySelector('#patient-dob').value = patientDOB;
    document.querySelector("select[name='patient-marital-status']").value = data.estado_civil;
    document.querySelector('#patient-address').value = data.direccion;
    document.querySelector('#patient-email').value = data.correo;
    document.querySelector('#patient-phone').value = data.telefono_movil;

    // Save loaded data for later comparison
    originalPatientData = {
      primer_nombre: data.primer_nombre,
      segundo_nombre: data.segundo_nombre,
      primer_apellido: data.primer_apellido,
      segundo_apellido: data.segundo_apellido,
      cedula: data.cedula,
      fecha_nacimiento: data.fecha_nacimiento.split('T')[0],
      estado_civil: data.estado_civil,
      direccion: data.direccion,
      correo: data.correo,
      telefono_movil: data.telefono_movil,
      id_usuario: data.id_usuario
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
      $('#patient-table').DataTable().destroy();
      $('#patient-table-data').innerHTML = '';
      loadPatientsIntoTable();
      fillModal(patientData.cedula)
      Swal.fire({
        title: '¡Paciente actualizado de manera exitosa!',
        text: 'Los datos del paciente han sido actualizados en la base de datos.',
        icon: 'success',
        showConfirmButton: true,
      });
    } else {
      Swal.fire({
        title: '¡Error en la actualización del paciente!',
        text: 'Hubo un problema al intentar actualizar el paciente.',
        icon: 'error',
        showConfirmButton: true
      });
    }
  } catch (error) {
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
  modalMode = 'create';
  document.querySelector('#patient-form').reset();
  document.querySelector('#patient-form').classList.remove('was-validated');
  document.querySelector('#PatientModalLabel').textContent = 'Crear nuevo paciente';
  document.querySelector('#submit-patient-data').innerHTML = '<i class="fa-solid fa-user-plus me-1"></i>Crear paciente';
});

// Button trigger to open modal in edit mode and get the data from the attribute
document.querySelector('#patient-table').addEventListener('click', (e) => {
  modalMode = 'edit';
  document.querySelector('#patient-form').reset();
  document.querySelector('#patient-form').classList.remove('was-validated');
  document.querySelector('#PatientModalLabel').textContent = 'Editar paciente:'
  document.querySelector('#submit-patient-data').innerHTML = '<i class="fa-solid fa-floppy-disk me-1"></i>Guardar cambios';
  
  const targetButton = e.target.closest('button');
  if (targetButton && targetButton.id === 'edit-patient-btn') {
    const patientID = targetButton.getAttribute('data-patient-id');
    fillModal(patientID);
  }
});

const validateForm = () => {
  const forms = document.querySelectorAll('.needs-validation');

  for (const form of forms) {
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      Swal.fire({
        title: '¡Error de validación!',    
        text: 'Debe llenar correctamente todos los campos',                    
        icon: 'error',
        showConfirmButton: true,
      });
      return false;
    }
  }

  return true;
};

// Create patient
const createPatient = async (patientData) => {
  try {
    const response = await axios.post('http://localhost:3000/patients/create', patientData, {
      withCredentials: true
    });
    
    if (response.status === 200) {
      document.querySelector('#patient-form').reset();
      $('#patient-table').DataTable().destroy();
      document.querySelector('#patient-table-data').innerHTML = '';
      loadPatientsIntoTable();

      Swal.fire({
        title: '¡Paciente creado de manera exitosa!',    
        text: 'El paciente ha sido agregado a la base de datos.',                    
        icon: 'success',
        showConfirmButton: true,
      });
    } else {
      Swal.fire({
        title: '¡Error en la creación del paciente!',    
        text: 'Hubo un problema al intentar crear el paciente.',                    
        icon: 'error',
        showConfirmButton: true
      });
    }
  } catch (error) {
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

// Button trigger to open deletion confirmation and get the data from the attribute
document.querySelector('#patient-table').addEventListener('click', (e) => {
  const targetButton = e.target.closest('button');
  if (targetButton && targetButton.id === 'del-patient-btn') {
    const userID = targetButton.getAttribute('data-user-id');
    Swal.fire({
      title: '¿Seguro desea eliminar el paciente?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar',
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        deletePatient(userID);
      }
    });
  }
});

// Delete request to the server
const deletePatient = async (userID) => {
  try {
    const response = await axios.delete('http://localhost:3000/patients/delete', {
      data: { id_usuario: userID },
      withCredentials: true
    });

    if (response.status === 400 || response.status === 404) {
      Swal.fire({
        title: 'Error en la eliminación',
        text: 'Error: ' + response.data.message,
        icon: 'error',
        showConfirmButton: true
      });
    } else {
      $('#patient-table').DataTable().destroy();
      document.querySelector('#patient-table-data').innerHTML = '';
      loadPatientsIntoTable();

      Swal.fire({
        title: 'Paciente eliminado correctamente',
        text: response.data.message,
        icon: 'success',
        showConfirmButton: true
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Error en la eliminación',
      text: 'Error: ' + error.message,
      icon: 'error',
      showConfirmButton: true
    });
  }
};