document.addEventListener('DOMContentLoaded', () => {
  loadMedicsIntoTable();
});

let modalMode = '';
let originalMedicData = {};
let formSubmitted = false;

// Initialize DataTable
DataTable.intlOrder('es', {
  sensitivity: 'base'
});

const initDataTable = () => {
  $('#medic-table').DataTable({
    "columnDefs": [
      { "orderable": false,
        "targets": [0, 3, 8]
      }
    ],
    order: [[1, 'asc']],
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-MX.json',
    }
  });
};

// Calculate the age of the medic based on their DOB
const calcAge = medicDOB => {
  const dob = new Date(medicDOB)
  const currentDate = new Date()
  const ageInMilliseconds = currentDate - dob
  const age = new Date(ageInMilliseconds);
  return Math.abs(age.getUTCFullYear() - 1970);
};

// Load the medics' data into the DataTable
const loadMedicsIntoTable = async () => {
  try {
    const response = await axios.get('http://localhost:3000/medics/read', {
      withCredentials: true
    });
    const data = response.data;
    if (Object.keys(data).length > 0) {
      document.querySelector('#medic-table').style.display = 'table';
      const table = document.querySelector('#medic-table-data');
      while (table.firstChild) {
        table.removeChild(table.firstChild);
      }
      const fragment = document.createDocumentFragment();

      data.forEach (item => {
        const userID = item.id_usuario;
        const medicID = item.cedula;
        const medicFirstNames = `${item.primer_nombre} ${item.segundo_nombre}`;
        const medicLastNames = `${item.primer_apellido} ${item.segundo_apellido}`;
        const medicPhone = item.telefono_movil;
        const medicEmail = item.correo;
        const medicSpecialty = Object.keys(item.especialidad).join(', ');
        const medicAge = calcAge(item.fecha_nacimiento);
        const medicMaritalStatus = item.estado_civil;

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${medicID}</td>
          <td>${medicLastNames}</td>
          <td>${medicFirstNames}</td>
          <td>${medicPhone}</td>
          <td>${medicEmail}</td>
          <td>${medicSpecialty}</td>
          <td>${medicAge}</td>
          <td>${medicMaritalStatus}</td>
          <td>
            <div>
              <button type='button' class='btn btn-primary btn-sm' id='edit-medic-btn' data-bs-toggle='modal' data-bs-target='#medic-modal' data-medic-id='${medicID}'>
                <i class='fa-solid fa-pen-to-square'></i>
              </button>
              <button type='button' class='btn btn-danger btn-sm' id='del-medic-btn' data-user-id='${userID}'>
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
      console.error('Error while trying to read the data:', error.message);
      document.querySelector('.alert').style.display = 'block';
    }
};

const resetModal = () => {
  document.querySelector('#medic-form').reset();
  document.querySelector('#medic-form').classList.remove('was-validated');
  document.querySelector('#medic-header').innerHTML = '';
  
  const inputs = document.querySelectorAll('#shifts-group input[type="text"]');
  inputs.forEach(input => {
    input.disabled = true;
  });
};

const resetFeedbackMessages = () => {
  document.querySelector('#specialties-placeholder').innerHTML = '';
  document.querySelector('#days-placeholder').innerHTML = '';
  document.querySelector('#shifts-placeholder').innerHTML = '';
};

// Button trigger to open modal in create mode
document.querySelector('#new-medic-btn').addEventListener('click', () => {
  modalMode = 'create';
  formSubmitted = false;
  document.querySelector('#MedicModalLabel').textContent = 'Crear nuevo médico';
  document.querySelector('#submit-medic-data').innerHTML = '<i class="fa-solid fa-user-plus me-1"></i>Crear médico';

  resetModal();
  resetFeedbackMessages();
  initializeFlatpickr();
  changeFlatpickrInputsState();
});

// Button trigger to open modal in edit mode
document.querySelector('#medic-table').addEventListener('click', (e) => {
  modalMode = 'edit';
  formSubmitted = false;
  document.querySelector('#MedicModalLabel').textContent = 'Editar médico:';
  document.querySelector('#submit-medic-data').innerHTML = '<i class="fa-solid fa-floppy-disk me-1"></i>Guardar cambios';

  resetModal();
  resetFeedbackMessages();
  initializeFlatpickr();
  changeFlatpickrInputsState();

  const targetButton = e.target.closest('button');
  if (targetButton && targetButton.id === 'edit-medic-btn') {
    const medicID = targetButton.getAttribute('data-medic-id');
    fillModal(medicID);
  }
});

const initializeFlatpickr = () => {
  flatpickr('#morning-shift-start', {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    defaultDate: '08:00',
    minTime: '08:00',
    maxTime: '12:30',
    minuteIncrement: 30,
    onClose: function(selectedDates, dateStr, instance) {
      const endDatePicker = document.querySelector('#morning-shift-end')._flatpickr;
      if (endDatePicker.selectedDates.length > 0) {
        const selectedStartDate = new Date(selectedDates[0]);
        const selectedEndDate = new Date(endDatePicker.selectedDates[0]);
        if (selectedEndDate <= selectedStartDate) {
          endDatePicker.setDate(selectedStartDate.setMinutes(selectedStartDate.getMinutes() + 30));
        }
        endDatePicker.set('minTime', selectedStartDate.setMinutes(selectedStartDate.getMinutes() + 30));
      }
    }
  });

  flatpickr('#morning-shift-end', {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    defaultDate: '13:00',
    minTime: '08:30',
    maxTime: '13:00',
    minuteIncrement: 30,
    onClose: function(selectedDates, dateStr, instance) {
      const startDatePicker = document.querySelector('#morning-shift-start')._flatpickr;
      if (startDatePicker.selectedDates.length > 0) {
        const selectedEndDate = new Date(selectedDates[0]);
        const selectedStartDate = new Date(startDatePicker.selectedDates[0]);
        if (selectedEndDate <= selectedStartDate) {
          startDatePicker.setDate(selectedEndDate.setMinutes(selectedEndDate.getMinutes() - 30));
        }
        startDatePicker.set('maxTime', selectedEndDate.setMinutes(selectedEndDate.getMinutes() - 30));
      }
    }
  });

  flatpickr('#afternoon-shift-start', {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    defaultDate: '14:00',
    minTime: '14:00',
    maxTime: '18:30',
    minuteIncrement: 30,
    onClose: function(selectedDates, dateStr, instance) {
      const endDatePicker = document.querySelector('#afternoon-shift-end')._flatpickr;
      if (endDatePicker.selectedDates.length > 0) {
        const selectedStartDate = new Date(selectedDates[0]);
        const selectedEndDate = new Date(endDatePicker.selectedDates[0]);
        if (selectedEndDate <= selectedStartDate) {
          endDatePicker.setDate(selectedStartDate.setMinutes(selectedStartDate.getMinutes() + 30));
        }
        endDatePicker.set('minTime', selectedStartDate.setMinutes(selectedStartDate.getMinutes() + 30));
      }
    }
  });

  flatpickr('#afternoon-shift-end', {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    defaultDate: '19:00',
    minTime: '14:30',
    maxTime: '19:00',
    minuteIncrement: 30,
    onClose: function(selectedDates, dateStr, instance) {
      const startDatePicker = document.querySelector('#afternoon-shift-start')._flatpickr;
      if (startDatePicker.selectedDates.length > 0) {
        const selectedEndDate = new Date(selectedDates[0]);
        const selectedStartDate = new Date(startDatePicker.selectedDates[0]);
        if (selectedEndDate <= selectedStartDate) {
          startDatePicker.setDate(selectedEndDate.setMinutes(selectedEndDate.getMinutes() - 30));
        }
        startDatePicker.set('maxTime', selectedEndDate.setMinutes(selectedEndDate.getMinutes() - 30));
      }
    }
  });
};

const changeFlatpickrInputsState = () => {
  const morningCheckbox = document.querySelector('#morning-checkbox');
  const afternoonCheckbox = document.querySelector('#afternoon-checkbox');

  const morningInputs = [
    document.querySelector('#morning-shift-start'),
    document.querySelector('#morning-shift-end')
  ];
  
  const afternoonInputs = [
    document.querySelector('#afternoon-shift-start'),
    document.querySelector('#afternoon-shift-end')
  ];

  // Enable or disable the Flatpickr inputs based on the checkbox button state
  const toggleInputs = (checkbox, inputs) => {
    inputs.forEach(input => {
      input.disabled = !checkbox.checked;
    });
  };

  morningCheckbox.addEventListener('click', () => {
    toggleInputs(morningCheckbox, morningInputs);
  });

  afternoonCheckbox.addEventListener('click', () => {
    toggleInputs(afternoonCheckbox, afternoonInputs);
  });
};

// Submit form handler
document.querySelector('#medic-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  formSubmitted = true;

  if (!validateForm()) {
    return;
  }

  // Create an object for the Medic Specialties based on the selected checkboxes
  const specialties = document.querySelectorAll("input[name='medic-specialties']:checked");
  const selectedSpecialties = {};

  specialties.forEach((checked) => {
    selectedSpecialties[checked.value] = true;
  });

  // Create an object for the Medic Schedule based on the selected checkboxes
  const schedule = document.querySelectorAll("input[name='medic-schedule']:checked");
  const selectedDays = {};

  schedule.forEach((checked) => {
    selectedDays[checked.value] = true;
  });

  // Create an object for the Medic Shifts based on the Flatpickr inputs
  const shifts = {};

  // Check if the morning shift checkbox is checked
  if (document.getElementById('morning-checkbox').checked) {
    const morningShiftStart = document.querySelector('#morning-shift-start').value;
    const morningShiftEnd = document.querySelector('#morning-shift-end').value;

    if (morningShiftStart && morningShiftEnd) {
      shifts.morning = {
        start: morningShiftStart,
        end: morningShiftEnd
      };
    }
  }

  // Check if the afternoon shift checkbox is checked
  if (document.getElementById('afternoon-checkbox').checked) {
    const afternoonShiftStart = document.querySelector('#afternoon-shift-start').value;
    const afternoonShiftEnd = document.querySelector('#afternoon-shift-end').value;

    if (afternoonShiftStart && afternoonShiftEnd) {
      shifts.afternoon = {
        start: afternoonShiftStart,
        end: afternoonShiftEnd
      };
    }
  }

  // Define de medicData object
  const medicData = {
    primer_nombre: document.querySelector('#medic-first-name').value,
    segundo_nombre: document.querySelector('#medic-middle-name').value,
    primer_apellido: document.querySelector('#medic-last-name-1').value,
    segundo_apellido: document.querySelector('#medic-last-name-2').value,
    cedula: document.querySelector('#medic-id').value,
    fecha_nacimiento: document.querySelector('#medic-dob').value,
    estado_civil: document.querySelector("select[name='medic-marital-status']").value,
    direccion: document.querySelector('#medic-address').value,
    correo: document.querySelector('#medic-email').value,
    telefono_movil: document.querySelector('#medic-phone').value,
    especialidad: selectedSpecialties,
    schedule: selectedDays,
    shifts: shifts
  };

  const medicDataWithoutID = _.omit(medicData, 'id_usuario');
  const originalMedicDataWithoutID = _.omit(originalMedicData, 'id_usuario');

  const areObjectsEqual = _.isEqual(medicDataWithoutID, originalMedicDataWithoutID);

  if (modalMode === 'create') {
    await createMedic(medicData);
  } else if (modalMode === 'edit' && !areObjectsEqual) {
    await updateMedic(medicData);
  } else {
    resetFeedbackMessages();
    formSubmitted = false;
    Swal.fire({
      title: '¡No hay cambios que guardar!',
      text: 'Debe realizar cambios antes de guardar la información. ',
      icon: 'warning',
      showConfirmButton: true
    });
  }
});

// Request data based on medic ID to populate the fields
const fillModal = async (medicID) => {
  try {
    const response = await axios.post('http://localhost:3000/medics/readById', {cedula: medicID }, {
      withCredentials: true
    });
    const data = response.data;

    document.querySelector('#medic-header').innerHTML = `&nbsp; ${data.primer_nombre} ${data.segundo_nombre} ${data.primer_apellido} ${data.segundo_apellido}`
  
    document.querySelector('#medic-first-name').value = data.primer_nombre;
    document.querySelector('#medic-middle-name').value = data.segundo_nombre;
    document.querySelector('#medic-last-name-1').value = data.primer_apellido;
    document.querySelector('#medic-last-name-2').value = data.segundo_apellido;
    document.querySelector('#medic-id').value = data.cedula;
    const medicDOB = data.fecha_nacimiento.split('T')[0];
    document.querySelector('#medic-dob').value = medicDOB;
    document.querySelector("select[name='medic-marital-status']").value = data.estado_civil;
    document.querySelector('#medic-address').value = data.direccion;
    document.querySelector('#medic-email').value = data.correo;
    document.querySelector('#medic-phone').value = data.telefono_movil;

    Object.entries(data.especialidad).forEach(([specialty, checked]) => {
      const checkbox = document.querySelector(`#${specialty}`);
      if (checkbox) {
        checkbox.checked = checked;
      }
    });

    Object.entries(data.schedule).forEach(([day, checked]) => {
      const checkbox = document.querySelector(`#${day}`);
      if (checkbox) {
        checkbox.checked = checked;
      }
    });

    Object.keys(data.shifts).forEach(shift => {
      const shiftCheckbox = document.querySelector(`#${shift}-checkbox`);
      const startTimeInput = document.querySelector(`#${shift}-shift-start`);
      const endTimeInput = document.querySelector(`#${shift}-shift-end`);
  
      if (shiftCheckbox && startTimeInput && endTimeInput) {
        shiftCheckbox.checked = true;
        startTimeInput.disabled = false;
        endTimeInput.disabled = false;
  
        flatpickr(startTimeInput, {
          enableTime: true,
          noCalendar: true,
          dateFormat: "H:i",
          defaultDate: data.shifts[shift].start
        });
  
        flatpickr(endTimeInput, {
          enableTime: true,
          noCalendar: true,
          dateFormat: "H:i",
          defaultDate: data.shifts[shift].end
        });
      }
    });

    // Save loaded data for later comparison
    originalMedicData = {
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
      especialidad: data.especialidad,
      schedule: data.schedule,
      shifts: data.shifts,
      id_usuario: data.id_usuario
    }

  } catch(error) {
      console.error('Error:', error.message);
  }
};

// Validations
const validateForm = () => {
  const personalDataValid = validatePersonalData();
  const specialtiesValid = validateCheckboxes('#specialties-group', '#specialties-placeholder');
  const daysValid = validateCheckboxes('#days-group', '#days-placeholder');
  const shiftsValid = validateCheckboxes('#shifts-group', '#shifts-placeholder');

  if (!personalDataValid || !specialtiesValid || !daysValid || !shiftsValid) {
    Swal.fire({
      title: '¡Error de validación!',    
      text: 'Debe llenar correctamente todos los campos',                    
      icon: 'error',
      showConfirmButton: true,
    });
    return false;
  }
 
  return true;
};

const validatePersonalData = () => {
  const forms = document.querySelectorAll('.needs-validation');

  for (const form of forms) {
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return false;
    }
  }

  return true;
};

const validateCheckboxes = (groupSelector, placeholderSelector) => {
  const checkboxes = document.querySelectorAll(`${groupSelector} input[type='checkbox']`);
  const isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
  const placeholder = document.querySelector(placeholderSelector);

  if (!isChecked) {
    placeholder.innerHTML = `<span class='text-danger'><i class='fa-solid fa-circle-exclamation me-2'></i>Debe seleccionar al menos una opción</span>`;
    return false;
  } else {
    placeholder.innerHTML = `<span class='text-success'><i class='fa-solid fa-check me-2'></i>Bien, ha seleccionado al menos una opción</span>`;
    return true;
  }
};

const updateValidationMessages = () => {
  validateCheckboxes('#specialties-group', '#specialties-placeholder');
  validateCheckboxes('#days-group', '#days-placeholder');
  validateCheckboxes('#shifts-group', '#shifts-placeholder');
};

// Checkboxes state change listener
document.addEventListener('change', (event) => {
  if (!formSubmitted) {
    return;
  }

  const target = event.target;
  if (target.matches('#specialties-group input[type="checkbox"]') ||
    target.matches('#days-group input[type="checkbox"]') ||
    target.matches('#shifts-group input[type="checkbox"]')) {
    updateValidationMessages();
  }
});

// Create medic
const createMedic = async (medicData) => {

  try {
    
    const response = await axios.post('http://localhost:3000/medics/create', medicData, {
      withCredentials: true
    });
    
    if (response.status === 200) {
      resetModal();
      resetFeedbackMessages();
      initializeFlatpickr();
      $('#medic-table').DataTable().destroy();
      document.querySelector('#medic-table-data').innerHTML = '';
      loadMedicsIntoTable();
      Swal.fire({
        title: '¡Médico creado de manera exitosa!',    
        text: 'El médico ha sido agregado a la base de datos.',                    
        icon: 'success',
        showConfirmButton: true,
      });
    } else {
      Swal.fire({
        title: '¡Error en la creación del médico!',    
        text: 'Hubo un problema al intentar crear el médico.',                    
        icon: 'error',
        showConfirmButton: true
      });
    }
  } catch (error) {
    console.error('Request error:', error.message);
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

// Update medic
const updateMedic = async (medicData) => {
  medicData.id_usuario = originalMedicData.id_usuario;
  medicData.changedEmail = medicData.correo !== originalMedicData.correo;

  try {
    const response = await axios.patch('http://localhost:3000/medics/update', medicData, {
      withCredentials: true
    });

    if (response.status === 200) {
      resetFeedbackMessages();
      fillModal(medicData.cedula)
      $('#medic-table').DataTable().destroy();
      $('#medic-table-data').innerHTML = '';
      loadMedicsIntoTable();
      Swal.fire({
        title: 'Médico actualizado de manera exitosa!',
        text: 'La base de datos ha sido actualizada.',
        icon: 'success',
        showConfirmButton: true,
      });
    } else {
      Swal.fire({
        title: '¡Error en la actualización del médico!',
        text: 'Hubo un problema en el proceso.',
        icon: 'error',
        showConfirmButton: true
      });
    }
  } catch (error) {
    Swal.fire({
      title: '¡Error en la solicitud!',
      text: 'Hubo un problema en la solicitud.',
      icon: 'error',
      showConfirmButton: true
    });
  }
};

// Button trigger to open deletion confirmation and get the data from the attribute
document.querySelector('#medic-table').addEventListener('click', (e) => {
  const targetButton = e.target.closest('button');
  if (targetButton && targetButton.id === 'del-medic-btn') {
    const userID = targetButton.getAttribute('data-user-id');
    Swal.fire({
      title: '¿Seguro desea eliminar el médico?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar',
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMedic(userID);
      }
    });
  }
});

// Delete medic
const deleteMedic = async (userID) => {
  try {
    const response = await axios.delete('http://localhost:3000/medics/delete', {
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
      $('#medic-table').DataTable().destroy();
      document.querySelector('#medic-table-data').innerHTML = '';
      loadMedicsIntoTable();

      Swal.fire({
        title: 'Médico eliminado correctamente',
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