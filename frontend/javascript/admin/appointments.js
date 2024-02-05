document.addEventListener('DOMContentLoaded', () => {
  let dataPatientID;
  let dataMedicID;
  let dataMedicSpecialty;
  let medicSchedule;
  let dataApptID;
  let dataApptComments;

  const initDataTable = () => {
    $('#appts-table').DataTable({
      "columnDefs": [
        { "orderable": false, "targets": [2, 3, 6, 7] }
      ],
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-MX.json',
      }
    });
  };

  const loadApptsIntoTable = async () => {
    try {
      const response = await axios.get('http://localhost:3000/appointments/listAppointments', {
        withCredentials: true
      });
      const data = response.data;
      if (data) {
        document.querySelector('#appts-table').style.display = 'table';
          const table = document.querySelector('#appts-table-data');
          while (table.firstChild) {
            table.removeChild(table.firstChild)
          }
          const fragment = document.createDocumentFragment();
          data.forEach(item => {
            const medicID = item.id_medico;
            const patientID = item.id_paciente;
            const apptID = item.id_cita_medica;
            const apptDate = item.fecha.split('T');
            const apptStartTime = `${item.hora_inicio}:00`;
            const apptEndTime = `${item.hora_fin}:00`;
            const medicSpecialty = item.especialidad;
            const patientFullName = `${item.primer_nombre} ${item.segundo_nombre} ${item.primer_apellido} ${item.segundo_apellido}`;
            const apptComments = item.observacion;
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${apptID}</td>
              <td>${apptDate[0]}</td>
              <td>${apptStartTime}</td>
              <td>${apptEndTime}</td>
              <td>${medicSpecialty}</td>
              <td>${patientFullName}</td>
              <td>${apptComments}</td>
              <td>
                <div>
                  <button type='button' class='btn btn-primary' id='edit-btn' data-bs-toggle='modal' data-bs-target='#appt-edit-modal' data-appt-id='${apptID}' data-appt-comments='${apptComments}' data-patient-id='${patientID}' data-medic-id='${medicID}' data-medic-specialty='${medicSpecialty}' >
                    <i class='fa-solid fa-pen-to-square'></i>
                  </button>
                  <button type='button' class='btn btn-danger' id='del-appt-btn'>
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
      console.error('Error en la solicitud de citas médicas:', error);
      document.querySelector('.alert').style.display = 'block';
    }
  };
  
  loadApptsIntoTable();

  $('#create-appt-btn').click(function() {
    fetch('http://localhost:3000/paciente/listar')
      .then(response => response.json())
      .then(data => {
        $('#create-appt-modal').modal('hide')
        if (data.length === 0) {
          Swal.fire({
            title: '¡No existen pacientes en la base de datos!',
            text: 'Primero cree un paciente',
            icon: 'error',
            showConfirmButton: true
          })
        } else {
          $('#create-appt-modal').modal('show')
        }
      })
      .catch(error => {
        console.error(error);
      });
  })

  // Get medic schedule function
  function obtenerHorariosMedico(horarioDisponible) {
    let horarios = [];
    for (let i = 0; i < horarioDisponible.length; i++) {
      if (horarioDisponible[i].enable) {
        horarios.push(horarioDisponible[i].hora);
      }
    }
    return horarios;
  }

  function buildPostRequestOptions(data) {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  }

  // Load the schedule of the medic from the Appointments table in order to edit the appointment in the modal
  $('#appts-table-data').on('click', '#edit-appt-btn', function () {
    dataMedicID = $(this).data('medic-id')
    dataMedicSpecialty = $(this).data('medic-specialty')
    dataPatientID = $(this).data('patient-id')
    dataApptID = $(this).data('appt-id')
    dataApptComments = $(this).data('appt-comments')
    fetch('http://localhost:3000/medic/get_medics')
      .then(response => response.json())
      .then(data => {
        let selectedMedicID = dataMedicID
        const findMedicByID = item => item.id_medico === selectedMedicID
        const selectedMedicArray = data.find(findMedicByID)
        medicSchedule = JSON.parse(selectedMedicArray.horarios)

      })
      .catch(error => {
        console.error('Fetch error: ', error)
      })
  })

  // Loads medic schedule when date is changed
  $('#appt-edit-date').change(function () {
    $('#appt-edit-hour').empty()
    let selectedApptDate = $(this).val()
    let appDateData = {
      apptDate: selectedApptDate
    }

    let requestPostOptionsApptDate = buildPostRequestOptions(appDateData) 

    $('#appt-edit-hour').prop('disabled', false)

    fetch('http://localhost:3000/appointment/listar_fechas', requestPostOptionsApptDate)
      .then(response => response.json())

      .then(data => {
        let str;
        let miArray = obtenerHorariosMedico(medicSchedule)
        function obtenerElementosUnicos(array) {
          const elementosUnicos = [];
          const elementosRepetidos = [];
          for (let i = 0; i < array.length; i++) {
            const elemento = array[i];
            if (elementosUnicos.includes(elemento)) {
              elementosRepetidos.push(elemento)
            } else {
              elementosUnicos.push(elemento)
            }
          }
          const elementosNoRepetidos = elementosUnicos.filter(elemento => !elementosRepetidos.includes(elemento))
          return elementosNoRepetidos;
        }
        data.forEach(item => {
          const fecha = item;
          let vsplit = fecha.split(' ')
          str = vsplit[1]
          str = str.substring(0, str.length - 3)
          miArray = miArray.concat(str)
        });
        const elementosNoRepetidos = obtenerElementosUnicos(miArray);
        elementosNoRepetidos.forEach(function (elementosNoRepetidos, indice) {
          const opthoras = $('<option>', {
            value: indice,
            text: elementosNoRepetidos
          })
          $('#appt-edit-hour').append(opthoras);
        })

      })
      .catch(error => {
        console.error(error)
      })
  })

  // Add 1 hour function
  function sumarUnaHora(cadenaHora) {
    const partesHora = cadenaHora.split(':'); // Divide la cadena en horas y minutos
    let horas = parseInt(partesHora[0], 10);
    let minutos = parseInt(partesHora[1], 10);
    // Suma una hora
    horas += 1;
    // Verifica si las horas superan las 23
    if (horas > 23) {
      // Vuelve a las 00 horas
      horas = 0;
    }
    // Formatea las horas y minutos en una cadena en formato de 24 horas
    const horaResultante = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    return horaResultante;
  }

  // Save appointment function
  $("#appt-edit-save").click(function () {
    let apptHour = $('select[name="appt-edit-hour"] option:selected').text();
    let ff_inicio = $('#appt-edit-date').val();
    let f_inicio = $('#appt-edit-date').val() + 'T' + apptHour + ':00';
    const horaOriginal = apptHour;
    const horaSumada = sumarUnaHora(horaOriginal);
    let f_fin = ff_inicio + 'T' + horaSumada + ':00';
    
    let apptDetailsData = {
      id_cita_medica: dataApptID,
      fecha_inicio: f_inicio,
      fecha_fin: f_fin,
      estado: "Confirmada",
      paciente: {
        id_paciente: dataPatientID
      },
      medico: {
        id_medico: dataMedicID
      },
      especialidad: dataMedicSpecialty,
      observacion: dataApptComments
    }

    let buildPostRequestOptionsApptDetails = buildPostRequestOptions(apptDetailsData)

    fetch('http://localhost:3000/appointment/actualizar', buildPostRequestOptionsApptDetails)
      .then(response => response.json())
  
      .then(data => {
        if (data.statusCodeValue === 400 || data.statusCodeValue === 404) {
          Swal.fire({
            title: 'No se pudo actualizar!',
            text: 'Error: ' + data.body,
            icon: 'error',
            showConfirmButton: false,
            timer: 2500
          })
        } else {
          Swal.fire({
            title: 'Cita modificada correctamente',
            text: data.body,
            icon: 'success',
            showConfirmButton: false,
            timer: 2500
          })
          $('#appt-edit-modal').modal('toggle')
          loadApptsIntoTable();
        }
      })
      .catch(error => {
        console.log(error);
      });
  });

  // Delete appointment event trigger
  $("#appts-table-data").on('click', '#del-appt-btn', function () {
    showDeleteApptConfirmationDialog();
  });

  // Confirmation dialog to delete appointment
  function showDeleteApptConfirmationDialog() {
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
        deleteAppt();
      }
    });
  }

  // Delete appointment function
  function deleteAppt() {
    let apptIDData = {
      id_cita_medica: dataApptID
    }
    
    let buildPostRequestOptionsApptID = buildPostRequestOptions(apptIDData)
    fetch('http://localhost:3000/appointment/eliminar', buildPostRequestOptionsApptID)
      .then(response => response.json())
      .then(data => {
        if (data.statusCodeValue === 400 || data.statusCodeValue === 404) {
          Swal.fire({
            title: 'Error en la eliminación',
            text: 'Error: ' + data.body,
            icon: 'error',
            showConfirmButton: true,
          })
        } else {
          Swal.fire({
            title: 'Cita eliminada correctamente',
            text: data.body,
            icon: 'success',
            showConfirmButton: true,
          })
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
})