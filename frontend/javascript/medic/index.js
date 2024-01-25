appInicioMedico = angular.module('appInicioMedico', []);
controller = appInicioMedico.controller("controllerInicioMedico", function ($scope) {

    $scope.datosCita = [];
    $scope.id_cita_medica = 0;
    var urlCitasDia = "http://localhost:3000/cita_medica/citas_por_medico_diaActual"
    var url_hclinica = "http://localhost:3000/historia_clinica/guardar";
    var id_usuario = sessionStorage.getItem("id_usuario");
    datos = {
        id_usuario: id_usuario
    }
    var unidadesDeMedidas = {umestatura: ["CM", "M"], umfrecuenciarespiratoria: ["R X M",], umpeso: ["G", "KG", "L"],
        umpesoarterial: ["PA", "Newton", "PSI", "ATM"], umpulso:["LPM"], umtemperatura: ["°F", "°C"]}

    var selectsId = ["umestatura", "umfrecuenciarespiratoria", "umpeso", "umpesoarterial", "umpulso", "umtemperatura"];

    selectsId.forEach(selectId => {
        unidadesDeMedidas[selectId].forEach(item => {
            $('#' + selectId).append(
                '<option> '+item+' </option>'
            );
        });
    });

    $("#exFisico input").on("input", function() {
        // Obtener el valor actual del input
        var valor = $(this).val();

        // Reemplazar cualquier caracter que no sea un número o un punto con una cadena vacía
        var valorNumerico = valor.replace(/[^\d.]/g, '');

        // Garantizar que solo haya un punto decimal permitido
        valorNumerico = valorNumerico.replace(/\.(?=.*\.)/g, '');

        // Actualizar el valor del input solo con números
        $(this).val(valorNumerico);
    });

    // citas del dia de hoy
    var requestOptionsDiaActual = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Especificar que estamos enviando JSON
        },
        body: JSON.stringify(datos) // Convertir el objeto 'datos' a formato JSON
    };

    fetch(urlCitasDia, requestOptionsDiaActual)
        .then(function (response) {
            responseClone = response.clone();
            return response.json();
        }) // Convertir la respuesta a JSON
        .then(data => {
            console.log(data);
            var fecha;
            var horaI;
            var horaF;
            var paciente;
            $scope.datosCita = [];
            data.forEach(item => {
                // Accede a los valores de 'item' y realiza operaciones
                var fechaValidator = new Date(item.fecha); // Muestra cada elemento del array JSON
                fecha = item.fecha;
                if (fechaValidator.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)) {
                    horaI = item.hora_inicio + ':00';
                    horaF = item.hora_fin + ':00';
                    paciente = item.primer_nombre + ' ' + item.primer_apellido;
                    fecha = fecha.split('T');
                    $scope.$apply(() => {
                        $scope.datosCita.push(item);
                    });
                }
                console.log($scope.datosCita);
            });
        })
        .catch(error => {
            console.log(error);
        });

    $scope.atenderCita = (cita) => {
        console.log(cita);
        const estado = cita.estado;

        if(estado === 'Atendida') {
            Swal.fire({
                title: 'Avertencia',
                text: 'La cita ya fue antedida.',
                icon: 'warning',
                showConfirmButton: false,
                timer: 3500
            })
            return;
        }

        $("#datosHC").css({"display":"block"});
        $("#citasDiaActual").css({"display": "none"});
        $("#botonesHC").css({"display": "block"});
        $("#tituloIC").css({"display": "none"});
        $("#info").css({"display": "block"});
        $(".dt-form input, textarea").prop('disabled', false);
        $(".cancelarBtn, .submitBtn").prop('disabled', false);
        const fecha = cita.fecha;
        const horaInicio = cita.hora_inicio + ':00';
        const horaFin = cita.hora_fin + ':00';
        const paciente = cita.primer_nombre + ' ' + cita.primer_apellido;
        $scope.id_cita_medica = cita.id_cita_medica;
        $("#tituloAtencion").append("ATENDIENDO CITA # " + $scope.id_cita_medica);
        $("#datosCita").append("Paciente: " + paciente, ", Fecha: " + fecha.split('T')[0], ", Hora inicio: " + horaInicio + ", Hora fin: " + horaFin);
    }

    $scope.cancelarCita = () => {
        $("#tituloAtencion").text("");
        $("#datosCita").text("");

        for (let i = 1; i <= 18; i++) {
            const inputId = 'input' + i;
            const input = $('.' + inputId);

            input.val('');
        }

        $("#datosHC").css({"display":"none"});
        $("#citasDiaActual").css({"display": "flex"})
        $("#botonesHC").css({"display": "none"});
        $("#tituloIC").css({"display": "block"});
        $("#info").css({"display": "none"});
    };

    $(".submitBtn").click(function(){
        var camposIncompletos = 0;
        for (let i = 1; i <= 18; i++) {
            const inputId = 'input' + i;
            const input = $('.' + inputId);

            input.val() === '' ? camposIncompletos++ : input.val();
        }

        if(camposIncompletos > 0) {
            Swal.fire({
                title: 'Error en el registro',
                text: 'Complete todos los campos',
                icon: 'error',
                showConfirmButton: false,
                timer: 3500
            })
            return;
        }

        //Datos clinicos
        var mot_consulta = $("#inp-motivo-consulta").val();
        var fechaActual = new Date();
        var num_historia = fechaActual.toISOString().slice(0, 10) + "_" + $scope.id_cita_medica;
        var evolucion = $("#inp-evolucion").val();
        var diagn = $("#inp-diagnostico").val();
        //Antecedentes clinicos
        var antc_alergico = $("#inp-antecedente-alergico").val();
        var antc_familiar = $("#inp-antecedente-familiar").val();
        var antc_personal = $("#inp-antecedente-personal").val();
        var antc_quirurgico = $("#inp-antecedente-quirurgico").val();
        //Examen fisico
        var estatura = $("#inp-estatura").val() + "_"+ $("#umestatura").val();
        var frec_respiratoria = $("#inp-frec-respiratoria").val() + "_"+ $("#umfrecuenciarespiratoria").val();
        var peso = $("#inp-peso").val() + "_"+ $("#umpeso").val();
        var presion_arterial = $("#presion-arterial").val() + "_"+ $("#umpesoarterial").val();
        var pulso = $("#inp-pulso").val() + "_"+ $("#umpulso").val();
        var temp = $("#inp-temperatura").val() + "_"+ $("#umtemperatura").val();
        var tip_sangui = $("#inp-tipo-sanguineo").val();
        //Tratamiento
        var tratamiento = $("#inp-tratamiento").val();
        var duracion = $("#inp-duracion").val();
        var medicacion = $("#inp-medicacion").val();

        datos_hclinica = {
            diagnostico: diagn,
            evolucion: evolucion,
            motivo_consulta: mot_consulta,
            numero_historia: num_historia,
            cita_medica: {
                id_cita_medica: $scope.id_cita_medica
            },
            tratamiento:{
                duracion: duracion,
                indicaciones: tratamiento,
                medicacion: medicacion
            },
            antecedente:{
                antecedente_alergico: antc_alergico,
                antecedente_familiar: antc_familiar,
                antecedente_personal: antc_personal,
                antecedente_quirurgico: antc_quirurgico
            },
            examen_fisico:{
                estatura: estatura,
                frecuencia_respiratoria: frec_respiratoria,
                peso: peso,
                presion_arterial: presion_arterial,
                pulso: pulso,
                temperatura: temp,
                tipo_sanguineo: tip_sangui
            }
        }

        var requestOptionsHC = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Especificar que estamos enviando JSON
            },
            body: JSON.stringify(datos_hclinica) // Convertir el objeto 'datos' a formato JSON
        };


        fetch(url_hclinica, requestOptionsHC)
            .then(function(response){
                responseClone = response.clone();
                return response.json();
            }) // Convertir la respuesta a JSON
            .then(data => {
                if(data.statusCodeValue===400 || data.statusCodeValue===404){
                    Swal.fire({
                        title: 'Error en el registro',
                        text: 'Error: ' + data.body,
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 3500
                    })
                }else{
                    Swal.fire({
                        title: 'Datos registrados correctamente',
                        text: data.body,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 3500
                    })
                    setInterval(function(){
                        location.reload();
                    }, 3000);

                }
            })
            .catch(error => {
                console.log(error);
            });
    });

});