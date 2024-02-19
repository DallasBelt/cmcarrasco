document.addEventListener('DOMContentLoaded', () => {
  loadMedicsIntoTable();
});

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
}

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

let modalMode = '';

// Button trigger to open modal in create mode
document.querySelector('#new-medic-btn').addEventListener('click', () => {
  modalMode = 'create';
  document.querySelector('#medic-form').reset();
  document.querySelector('#MedicModalLabel').textContent = 'Crear nuevo médico';
  document.querySelector('#submit-medic-data').innerHTML = '<i class="fa-solid fa-user-plus me-1"></i>Crear médico';

  initializeFlatpickr(document.querySelector('.schedule'));
  changeFlatpickrInputsState(document.querySelector('.schedule'));
});

// Button trigger to open modal in edit mode
document.querySelector('#medic-table').addEventListener('click', (e) => {
  modalMode = 'edit';
  document.querySelector('#MedicModalLabel').textContent = 'Editar médico registrado';
  document.querySelector('#submit-medic-data').innerHTML = '<i class="fa-solid fa-floppy-disk me-1"></i>Guardar cambios';

  const targetButton = e.target.closest('button');
  if (targetButton && targetButton.id === 'edit-patient-btn') {
    const medicID = targetButton.getAttribute('data-patient-id');
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

  // Event listener for the specialties group checkboxes states
  const checkboxes = document.querySelectorAll('#specialties-group input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', validateSpecialties);
  });

  // Event listener for the days and shifts groups' checkboxes states
  ['days', 'shifts'].forEach(group => {
    const checkboxes = document.querySelectorAll(`#${group}-group input[type="checkbox"]`);
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        validateSchedules(group);
      });
    });
  });

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

  const morningShiftCheckbox = document.querySelector('#morning-shift-checkbox');
  if (morningShiftCheckbox.checked && !morningShiftCheckbox.disabled) {
    const morningShiftStart = document.querySelector('#morning-shift-start').value;
    const morningShiftEnd = document.querySelector('#morning-shift-end').value;
    if (morningShiftStart && morningShiftEnd) {
      shifts.morning = {
        start: morningShiftStart,
        end: morningShiftEnd
      };
    }
  }

  const afternoonShiftCheckbox = document.querySelector('#afternoon-shift-checkbox');
  if (afternoonShiftCheckbox.checked && !afternoonShiftCheckbox.disabled) {
    const afternoonShiftStart = document.querySelector('#afternoon-shift-start').value;
    const afternoonShiftEnd = document.querySelector('#afternoon-shift-end').value;
    if (afternoonShiftStart && afternoonShiftEnd) {
      shifts.afternoon = {
        start: afternoonShiftStart,
        end: afternoonShiftEnd
      };
    }
  }

  // Create an object for the Medic Shifts based on the Flatpickr inputs
  // const morningShiftStart = document.querySelector('#morning-shift-start').value;
  // const morningShiftEnd = document.querySelector('#morning-shift-end').value;
  // const afternoonShiftStart = document.querySelector('#afternoon-shift-start').value;
  // const afternoonShiftEnd = document.querySelector('#afternoon-shift-end').value;
  // const shifts = {};
  
  // if (morningShiftStart && morningShiftEnd) {
  //   shifts.morning = {
  //     start: morningShiftStart,
  //     end: morningShiftEnd
  //   };
  // }
  
  // if (afternoonShiftStart && afternoonShiftEnd) {
  //   shifts.afternoon = {
  //     start: afternoonShiftStart,
  //     end: afternoonShiftEnd
  //   };
  // }

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

  // const dataChanged = Object.keys(medicData).some(key => medicData[key] !== originalmedicData[key]);

  if (modalMode === 'create') {
    await createMedic(medicData);
  } else if (modalMode === 'edit' && dataChanged) {
    await updateMedic(medicData);
  } else {
    Swal.fire({
      title: '¡No hay cambios que guardar!',
      text: 'Debe realizar cambios antes de guardar la información. ',
      icon: 'warning',
      showConfirmButton: true
    });
  }
});

// Validations

const validatePersonalData = () => {
  let isValid = true;

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    if (!form.checkValidity()) {
      isValid = false;
    }
    form.classList.add('was-validated');
  });

  return isValid;
};

const validateSpecialties = () => {
  const checkboxes = document.querySelectorAll('#specialties-group input[type="checkbox"]');
  const isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

  let specialtiesValidationMessage = document.querySelector('#specialties-validation-message');
  if (!specialtiesValidationMessage) {
    specialtiesValidationMessage = document.createElement('div');
    specialtiesValidationMessage.id = 'specialties-validation-message';
    document.querySelector('#specialties-message-placeholder').insertAdjacentElement('afterbegin', specialtiesValidationMessage);
  }

  const validationPassed = isChecked;
  specialtiesValidationMessage.innerHTML = `<span><i class='fa-solid ${isChecked ? 'fa-check' : 'fa-circle-exclamation'} me-2'></i>${isChecked ? 'Bien, ha seleccionado al menos una opción.' : 'Debe seleccionar al menos una opción'}</span>`;
  specialtiesValidationMessage.classList.remove('valid-feedback', 'invalid-feedback');
  specialtiesValidationMessage.classList.add(isChecked ? 'valid-feedback' : 'invalid-feedback');
  specialtiesValidationMessage.style.display = 'inline';

  return validationPassed;
};

const validateSchedules = (group) => {
  const checkboxes = document.querySelectorAll(`#${group}-group input[type="checkbox"]`);
  const isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

  let validationMessage = document.querySelector(`#${group}-validation-message`);
  if (!validationMessage) {
    validationMessage = document.createElement('div');
    validationMessage.id = `${group}-validation-message`;
    document.querySelector(`#${group}-message-placeholder`).insertAdjacentElement('afterbegin', validationMessage);
  }

  const validationPassed = isChecked;
  validationMessage.innerHTML = `<span><i class='fa-solid ${isChecked ? 'fa-check' : 'fa-circle-exclamation'} me-2'></i>${isChecked ? 'Bien, ha seleccionado al menos una opción.' : 'Debe seleccionar al menos una opción'}</span>`;
  validationMessage.classList.remove('valid-feedback', 'invalid-feedback');
  validationMessage.classList.add(isChecked ? 'valid-feedback' : 'invalid-feedback');
  validationMessage.style.display = 'inline';

  return validationPassed;
};

const validateForm = () => {

  const personalDataValid = validatePersonalData();

  const specialtiesValid = validateSpecialties();

  let schedulesValid = true;
  
  ['days', 'shifts'].forEach(group => {
    if (!validateSchedules(group)) {
      schedulesValid = false;
    }
  });

  return personalDataValid && specialtiesValid && schedulesValid;
};

// Create medic
const createMedic = async (medicData) => {

  try {
    
    const response = await axios.post('http://localhost:3000/medics/create', medicData, {
      withCredentials: true
    });
    
    if (response.status === 200) {
      Swal.fire({
        title: '¡Médico creado de manera exitosa!',    
        text: 'El médico ha sido agregado a la base de datos.',                    
        icon: 'success',
        showConfirmButton: true,
      });
      document.querySelector('#medic-form').reset();
      $('#medic-table').DataTable().destroy();
      document.querySelector('#medic-table-data').innerHTML = '';
      loadMedicsIntoTable();
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