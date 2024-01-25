$(document).ready(function () {
  var cedula = "";
  let userID

  // Initialize DataTable
  const initDataTable = () => {
    $('#patients-table').DataTable({
      "columnDefs": [
        { "orderable": false, "targets": [8] }
      ],
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-MX.json',
      }
    })
  }
  
  const calcAge = dobString => {
    const dob = new Date(dobString)
    const currentDate = new Date()
    const age = currentDate - dob
    const ageMS = new Date(age);
    return Math.abs(ageMS.getUTCFullYear() - 1970);
  }

  const loadMedicsIntoTable = () => {
    fetch('http://localhost:3000/medic/get_medics')
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          $('#medics-table').css('display', 'table')
          $('#medics-table').DataTable().destroy()
          $('#medics-table-data').empty()
          const fragment = document.createDocumentFragment()
          data.forEach (item => {
            userID = item.id_usuario
            const medicID = item.cedula
            const medicFirstNames = `${item.primer_nombre} ${item.segundo_nombre}`
            const medicLastNames = `${item.primer_apellido} ${item.segundo_apellido}`
            const medicPhone = item.telefono_movil
            const medicEmail = item.correo
            const medicSpecialty = item.especialidad
            const medicAge = calcAge(item.fecha_nacimiento)
            const medicMaritalStatus = item.estado_civil
            const row = $(
              `<tr>
                <td>${medicID}</td>
                <td>${medicFirstNames}</td>
                <td>${medicLastNames}</td>
                <td>${medicPhone}</td>
                <td>${medicEmail}</td>
                <td>${medicSpecialty}</td>
                <td>${medicAge}</td>
                <td>${medicMaritalStatus}</td>
                <td>
                  <div class='medic-option-buttons'>
                    <button type='button' class='btn btn-primary' id='edit-medic-btn' data-bs-toggle='modal' data-bs-target='#medic-edit-modal'>
                      <i class='fa-solid fa-pen-to-square'></i>
                    </button>
                    <button type='button' class='btn btn-danger' id='del-medic-btn' data-user-id='${userID}'>
                      <i class='fa-solid fa-trash'></i>
                    </button>
                  </div></td>
              </tr>`
            )
            fragment.appendChild(row[0])
          })
          $('#medics-table-data').append(fragment);
          initDataTable()
        } else {
          $('.alert').css('display', 'block')
        }
      })

      .catch(error => {
        console.error(error);
      });
  }

  loadMedicsIntoTable()

   $(".cont-update .editar").click(function () {
    $(".modal").css('display', 'block');
    $(".modal").css('display', 'flex');

    //cedula
    cedula = $('select[name="medicos"] option:selected').text();

    //nombres
    var nombres = $("#inf-per tbody tr:eq(0) td:eq(1)").text();
    nombres = nombres.split(" ");
    $("#inp-p-nombre").val(nombres[0]);
    $("#inp-s-nombre").val(nombres[1]);

    //apellidos
    var apellidos = $("#inf-per tbody tr:eq(0) td:eq(0)").text();
    apellidos = apellidos.split(" ");
    $("#inp-p-apellido").val(apellidos[0]);
    $("#inp-s-apellido").val(apellidos[1]);

    //fecha
    var fecha = $("#inf-per tbody tr:eq(0) td:eq(2)").text();
    fecha = fecha.split("T")[0];
    $("#fecha").val(fecha);

    //estado civil
    var estado = $("#inf-per tbody tr:eq(0) td:eq(3)").text();
    $("#inp-estado").val(estado);

    //correo
    var correo = $("#inf-cont tbody tr:eq(0) td:eq(0)").text();
    $("#correo").val(correo);

    //telefono fijo
    var tlf_fijo = $("#inf-cont tbody tr:eq(0) td:eq(1)").text();
    $("#tlf-fijo").val(tlf_fijo);

    //telefono movil
    var tlf_movil = $("#inf-cont tbody tr:eq(0) td:eq(2)").text();
    $("#tlf-movil").val(tlf_movil);

  });

  $(".guardar").click(function () {
    $(".modal").css('display', 'none');
    var v_especialidad = "";
    for (let i = 0; i < $scope.especialidadesEditar.length; i++) {
      v_especialidad += $scope.especialidadesEditar[i];

      // Agrega punto y coma solo si no es el último elemento
      if (i < $scope.especialidadesEditar.length - 1) {
        v_especialidad += ";";
      }
    }
    datos = {
      primer_nombre: $("#inp-p-nombre").val(),
      segundo_nombre: $("#inp-s-nombre").val(),
      primer_apellido: $("#inp-p-apellido").val(),
      segundo_apellido: $("#inp-s-apellido").val(),
      fecha_nacimiento: $("#fecha").val() + 'T05:00:00.000Z',
      estado_civil: $("#inp-estado").val(),
      correo: $("#correo").val(),
      telefono_fijo: $("#tlf-fijo").val(),
      telefono_movil: $("#tlf-movil").val(),
      especialidad: v_especialidad,
      horarios: JSON.stringify($scope.horariosDispEditar),
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
    fetch('http://localhost:3000/medic/actualizar', requestOptions)
      .then(function (response) {
        responseClone = response.clone();
        return response.json();
      })
      .then(data => {
        if (data.statusCodeValue === 400) {
          Swal.fire({
            title: 'Error en la actualización de los datos',
            text: 'Error: ' + data.body,
            icon: 'error',
            showConfirmButton: false,
            timer: 3500
          })
        } else {
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

  // Delete medic event trigger
  $("#medics-table-data").on('click', '#del-medic-btn', function () {
    showDeleteMedicConfirmationDialog()
  })

  const showDeleteMedicConfirmationDialog = () => {
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
        deleteMedic()
      }
    })
  }

  const deleteMedic = () => {
    userIDData = {
      id_usuario: userID
    }
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userIDData)
    };
    fetch('http://localhost:3000/usuario/eliminar', requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.statusCodeValue === 400 || data.statusCodeValue === 404) {
          Swal.fire({
            title: 'Error en la eliminación',
            text: 'Error: ' + data.body,
            icon: 'error',
            showConfirmButton: false,
            timer: 3500
          })
        } else {
          Swal.fire({
            title: 'Médico eliminado correctamente',
            text: data.body,
            icon: 'success',
            showConfirmButton: false,
            timer: 3500
          })
          $('#medics-table').DataTable().destroy()
          $('#medics-table-data').empty()
          loadMedicsIntoTable()
        }
      })
      .catch(error => {
        console.log(error);
      })
  }
})