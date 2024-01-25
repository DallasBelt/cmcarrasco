app = angular.module('app', []);
controller = app.controller("controller", function ($scope) {

  $scope.especialidades = [];
  $scope.horariosDisponibles = [
    { hora: "08:00", enable: true },
    { hora: "09:00", enable: true },
    { hora: "10:00", enable: true },
    { hora: "11:00", enable: true },
    { hora: "12:00", enable: true },
    { hora: "13:00", enable: true },
    { hora: "14:00", enable: true },
    { hora: "15:00", enable: true },
    { hora: "16:00", enable: true },
    { hora: "17:00", enable: true },
    { hora: "18:00", enable: true },
    { hora: "19:00", enable: true }
  ]
  $(document).ready(function () {
  });

  $scope.reiniciarHora = () => {
    for (let i = 0; i < $scope.horariosDisponibles.length; i++) {
      $scope.horariosDisponible[i].enable = true;
    }
  }

  $("#inp-fnac").blur(function () {
    var fecha_na_str = $("#inp-fnac").val();
    var fecha_na = new Date(fecha_na_str);
    var fechaActual = new Date();

    // Obtener los componentes de la fecha
    var anio = fechaActual.getFullYear();
    var mes = ('0' + (fechaActual.getMonth() + 1)).slice(-2); // Agrega un cero al principio si es necesario
    var dia = ('0' + fechaActual.getDate()).slice(-2); // Agrega un cero al principio si es necesario

    // Formatear la fecha como una cadena en el formato deseado
    var fechaFormateada = anio + '-' + mes + '-' + dia;

    if (fecha_na_str === fechaFormateada) {
      // Si las fechas son iguales, mostrar un mensaje de alerta
      alert("La fecha de nacimiento no puede ser igual a la fecha actual.");

      // Limpiar el campo de fecha de nacimiento
      $("#inp-fnac").val('');
    } else if (fecha_na > fechaActual) {
      alert("La fecha de nacimiento no puede ser mayor a la fecha actual.");
      $("#inp-fnac").val(''); // Limpiar el campo de fecha de nacimiento
    }
  });

  $("#inp-send").click(function () {

    var v_cedula = $("#inp-ced").val();
    var p_apellido = $("#inp-ape").val();
    var s_apellido = $("#inp-s-ape").val();
    var p_nombre = $("#inp-nom").val();
    var s_nombre = $("#inp-s-nom").val();
    var fecha_na = $("#inp-fnac").val();
    var estado_c = $('select[name="estado"] option:selected').text();
    var v_correo = $("#inp-correo").val();
    var tlmovil = $("#inp-tl").val();
    var tlfijo = $("#inp-tlc").val();
    var contra = $("#inp-ced").val();
    var direccion = $("#inp-direccion").val()
    var v_especialidad = "";
    for (let i = 0; i < $scope.especialidades.length; i++) {
      v_especialidad += $scope.especialidades[i];

      // Agrega punto y coma solo si no es el último elemento
      if (i < $scope.especialidades.length - 1) {
        v_especialidad += ";";
      }
    }

    var datos = {
      primer_nombre: p_nombre,
      segundo_nombre: s_nombre,
      primer_apellido: p_apellido,
      segundo_apellido: s_apellido,
      cedula: v_cedula,
      correo: v_correo,
      telefono_movil: tlmovil,
      telefono_fijo: tlfijo,
      fecha_nacimiento: fecha_na,
      estado_civil: estado_c,
      contrasenia: contra,
      especialidad: v_especialidad,
      direccion: direccion,
      horarios: JSON.stringify($scope.horariosDisponibles)
    };
    var url = "http://localhost:3000/medico/guardar";

    var requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Especificar que estamos enviando JSON
      },
      body: JSON.stringify(datos) // Convertir el objeto 'datos' a formato JSON
    };

    if ($(".dt-form .input-container input").val() === "") {
      Swal.fire({
        title: 'Error en el registro',
        text: 'Complete todos los campos',
        icon: 'error',
        showConfirmButton: false,
        timer: 3500
      })
    } else {
      fetch(url, requestOptions)
        .then(function (response) {
          responseClone = response.clone();
          return response.json();
        }) // Convertir la respuesta a JSON
        .then(data => {
          if (data.statusCodeValue === 400) {
            Swal.fire({
              title: 'Error en el registro',
              text: 'Error: ' + data.body,
              icon: 'error',
              showConfirmButton: false,
              timer: 3500
            })
          } else {
            Swal.fire({
              title: 'Completado',
              text: data.body,
              icon: 'success',
              showConfirmButton: false,
              timer: 3500
            })
            $(".dt-form .input-container input").val("");
            $scope.$apply(function () {
              $scope.especialidades = [];
              $scope.reiniciarHora();
            });

          }
        })
        .catch(error => {
          Swal.fire({
            title: 'Error en el registro',
            text: 'Error: ' + error,
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          })
        });
    }
  });


  $scope.agregarEspecialidad = () => {

    if ($("#inp-especialidad").val() === '') {
      alert("Por favor ingrese al menos una especialidad.");
      return;
    }

    let yaExiste = false;
    for (let i = 0; i < $scope.especialidades.length; i++) {
      if ($("#inp-especialidad").val() === $scope.especialidades[i]) {
        yaExiste = true;
      }
    }

    if (!yaExiste) {
      $scope.especialidades.push($("#inp-especialidad").val());
      console.log($scope.especialidades);
      $("#inp-especialidad").val('');
    } else {
      alert("La especilidad ingresada ya existe.");
    }
  }

  $scope.eliminarEspecialidad = (indice) => {

    $scope.especialidades.splice(indice, 1);

  };

});