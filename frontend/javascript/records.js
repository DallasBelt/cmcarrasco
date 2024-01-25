$(document).ready(function(){
    var id_usuario = sessionStorage.getItem("id_usuario");
    var url = "http://localhost:3000/historia_clinica/listar_por_medico";
    var id_antecedente;
    var id_examen_fisico;
    var id_tratamiento;
    var opt;
    var nombC;
    var myselect = $("#inp-numero-c").val();
    var all_data = [];

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

    datos = {
        id_medico: id_usuario
    }
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Especificar que estamos enviando JSON
        },
        body: JSON.stringify(datos) // Convertir el objeto 'datos' a formato JSON
    };
    fetch(url, requestOptions)
    .then(function(response){
        responseClone = response.clone();
        return response.json();
    }) // Convertir la respuesta a JSON
    .then(data => {           
        let contador = 1;  
        const valoresUnicos = new Set();
        
        data.forEach(item => {
            // Accede a los valores de 'item' y realiza operaciones
            const cedula = item.cedula;
            
            // Agregar la cedula al conjunto para eliminar duplicados
            valoresUnicos.add(cedula);
        });

        $('#inp-paciente-c').empty();

        valoresUnicos.forEach(cedula => {            
            // Accede a los valores de 'item' y realiza operaciones
            const options = $('<option>', {
                value: contador,
                text: cedula
            });
            $('#inp-paciente-c').append(options);
            contador++;
        });           
    })
    .catch(error => {
        console.log(error);
    });



    $("#inp-obt").click(function(){
        $("#inp-numero-c").val("");
        $("#inp-numero-c").text("");
        $("#inp-numero-c").prop('disabled', false);
        $("#inp-numero-c").css({"cursor":"pointer"});
        fetch(url, requestOptions)
        .then(function(response){
            responseClone = response.clone();
            return response.json();
        }) // Convertir la respuesta a JSON
        .then(data => {      
            opt = $('select[name="paciente"] option:selected').text();     
            nombC = data.find(function(elemento) {
                return elemento.cedula === opt;
            });        
            $("#nomc").html(nombC.primer_nombre + ' ' + nombC.primer_apellido + ' ' + nombC.segundo_apellido);                        
            var contador=1;
            const pacientes = data.filter(item => item.cedula === opt);            
            $('#inp-numero-c').empty();
            if (pacientes.length > 0) {                
                pacientes.forEach(paciente => {                    
                    const option = $('<option>', {
                      value: contador,
                      text: paciente.numero_historia
                    });
                    $('#inp-numero-c').append(option);
                    contador++;
                    all_data.push(paciente);
                });                
            }        
            var select = $('#inp-numero-c');
            var options = select.find('option');
            if(options.length  > 0){
                // Selecciona el primer <option> dentro del <select>
                var primer_option = $('#inp-numero-c option:first').prop('selected', true);
                const d_hc = all_data.find(function(elemento){
                    return elemento.numero_historia === primer_option.text();
                });
                $("#inp-motivo-consulta").val(d_hc.motivo_consulta);
                $("#inp-evolucion").val(d_hc.evolucion);
                $("#inp-numero-historia").val(d_hc.numero_historia);
                $("#inp-diagnostico").val(d_hc.diagnostico);
                $("#inp-ant-alergico").val(d_hc.antecedente_alergico);
                $("#inp-ant-familiar").val(d_hc.antecedente_familiar);
                $("#inp-ant-personal").val(d_hc.antecedente_personal);
                $("#inp-ant-quirurgico").val(d_hc.antecedente_quirurgico);
                $("#inp-estatura").val(d_hc.estatura);
                $("#inp-frec-resp").val(d_hc.frecuencia_respiratoria);
                $("#inp-peso").val(d_hc.peso);
                $("#inp-pre-arterial").val(d_hc.presion_arterial);
                $("#inp-pulso").val(d_hc.pulso);
                $("#inp-temp").val(d_hc.temperatura);
                $("#inp-tip-sang").val(d_hc.tipo_sanguineo);
                $("#inp-duracion").val(d_hc.duracion);
                $("#inp-indicacion").val(d_hc.indicaciones);
                $("#inp-medicacion").val(d_hc.medicacion);
                $("#cod-ant").data("cod-antecedente", d_hc.id_antecedente);
                id_antecedente = $("#cod-ant").data("cod-antecedente");
                $("#cod-ex-fisico").data("cod-examen-fisico", d_hc.id_examen_fisico);
                id_examen_fisico = $("#cod-ex-fisico").data("cod-examen-fisico");
                $("#cod-tratamiento").data("cod-tratamiento", d_hc.id_tratamiento);
                id_tratamiento = $("#cod-tratamiento").data("cod-tratamiento");
            }    
        })
        .catch(error => {
            console.log(error);
        });
    });
    
    $('#inp-numero-c').change(function() {
        $(".dt-form .input-container input + textarea").val("");
        $("#cod-ant").data("cod-antecedente", "");
        $("#cod-ant").data("cod-examen-fisico", "");
        const selectedIndex = $(this).prop('selectedIndex');
        const selectedPatient = all_data[selectedIndex];
        var opt_hc = $('select[name="numero"] option:selected').text();
        const d_hc = all_data.find(function(elemento) {
            return elemento.numero_historia === opt_hc;
        });    
        $("#inp-motivo-consulta").val(d_hc.motivo_consulta);        
        $("#inp-evolucion").val(d_hc.evolucion);
        $("#inp-numero-historia").val(d_hc.numero_historia);
        $("#inp-diagnostico").val(d_hc.diagnostico);
        $("#inp-ant-alergico").val(d_hc.antecedente_alergico);
        $("#inp-ant-familiar").val(d_hc.antecedente_familiar);
        $("#inp-ant-personal").val(d_hc.antecedente_personal);
        $("#inp-ant-quirurgico").val(d_hc.antecedente_quirurgico);

        $("#inp-estatura").val(d_hc.estatura.split("_")[0]);
        $("#umestatura").val(d_hc.estatura.split("_")[1]);
        $("#inp-frec-resp").val(d_hc.frecuencia_respiratoria.split("_")[0]);
        $("#umfrecuenciarespiratoria").val(d_hc.frecuencia_respiratoria.split("_")[1]);
        $("#inp-peso").val(d_hc.peso.split("_")[0]);
        $("#umpeso").val(d_hc.peso.split("_")[1]);
        $("#inp-pre-arterial").val(d_hc.presion_arterial.split("_")[0]);
        $("#umpesoarterial").val(d_hc.presion_arterial.split("_")[1]);
        $("#inp-pulso").val(d_hc.pulso.split("_")[0]);
        $("#umpulso").val(d_hc.pulso.split("_")[1]);
        $("#inp-temp").val(d_hc.temperatura.split("_")[0]);
        $("#umtemperatura").val(d_hc.temperatura.split("_")[1]);

        $("#inp-tip-sang").val(d_hc.tipo_sanguineo);
        $("#inp-duracion").val(d_hc.duracion);
        $("#inp-indicacion").val(d_hc.indicaciones);
        $("#inp-medicacion").val(d_hc.medicacion);
        $("#cod-ant").data("cod-antecedente", d_hc.id_antecedente);
        id_antecedente = $("#cod-ant").data("cod-antecedente");
        $("#cod-ex-fisico").data("cod-examen-fisico", d_hc.id_examen_fisico);
        id_examen_fisico = $("#cod-ex-fisico").data("cod-examen-fisico");
        $("#cod-tratamiento").data("cod-tratamiento", d_hc.id_tratamiento);
        id_tratamiento = $("#cod-tratamiento").data("cod-tratamiento");
    });




    //Update antecedentes
    var url_antecedente = "http://localhost:3000/historia_clinica/actualizar_antecedente";    
    $(".editar-antecedentes").click(function(){
        $(".dt-form #inp-ant-alergico, #inp-ant-familiar, #inp-ant-personal, #inp-ant-quirurgico").prop('disabled', false);
        $(".cont-guardar").css('display','block');
        $(".cont-guardar").css('display','flex');
    });

    $(".cancelar").click(function(){
        $(".cont-guardar").css('display','none');
        $(".dt-form #inp-ant-alergico, #inp-ant-familiar, #inp-ant-personal, #inp-ant-quirurgico").prop('disabled', true);
    });

    $(".guardar").click(function(){
        var ant_alergico = $("#inp-ant-alergico").val();
        var ant_familiar = $("#inp-ant-familiar").val();
        var ant_personal = $("#inp-ant-personal").val();
        var ant_quirurgico = $("#inp-ant-quirurgico").val();
        if(ant_alergico === "" || ant_familiar === "" || ant_personal === "" || ant_quirurgico === ""){
            Swal.fire({
                title: 'Error al actualizar',
                text: 'No se permiten campos vacíos',
                icon: 'error',
                showConfirmButton: false,
                timer: 3500
            })
        }else{
            var datosAntecedente = {
                antecedente_alergico: ant_alergico,
                antecedente_familiar: ant_familiar,
                antecedente_personal: ant_personal,
                antecedente_quirurgico: ant_quirurgico,
                id_antecedente: id_antecedente             
            };
            var requestOptionsAntecedente = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json' // Especificar que estamos enviando JSON
                },
                body: JSON.stringify(datosAntecedente) // Convertir el objeto 'datos' a formato JSON
            };
            fetch(url_antecedente, requestOptionsAntecedente)
            .then(function(response){
                responseClone = response.clone();
                return response.json();
            }) // Convertir la respuesta a JSON
            .then(data => {     
                if(data.statusCodeValue===400){
                    Swal.fire({
                        title: 'Error en la actualización de los datos',
                        text: 'Error: ' + data.body,                        
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 3500
                    })
                }
                else{
                    Swal.fire({
                        title: 'Actualización exitosa',    
                        text: data.body,                    
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 3500
                    })            
                }  
            })
            .catch(error => {
                console.log(error);
            });
        }
    });


    //Update examen
    var url_examen = "http://localhost:3000/historia_clinica/actualizar_examen_fisico";
    $(".editar-examen").click(function(){
        $(".dt-form #inp-estatura, #inp-frec-resp, #inp-peso, #inp-pre-arterial, #inp-pulso, #inp-temp, #inp-tip-sang").prop('disabled', false);
        $("#umestatura, #umfrecuenciarespiratoria, #umpeso, #umpesoarterial, #umpulso, #umtemperatura").prop('disabled', false);
        $(".cont-guardar-examen").css('display','block');
        $(".cont-guardar-examen").css('display','flex');
    });

    $(".cancelar-examen").click(function(){
        $(".cont-guardar-examen").css('display','none');
        $(".dt-form #inp-estatura, #inp-frec-resp, #inp-peso, #inp-pre-arterial, #inp-pulso, #inp-temp, #inp-tip-sang").prop('disabled', true);
        $("#umestatura, #umfrecuenciarespiratoria, #umpeso, #umpesoarterial, #umpulso, #umtemperatura").prop('disabled', true);
    });

    $(".guardar-examen").click(function(){
        var estatura = $("#inp-estatura").val();
        var frecuencia_respiratoria = $("#inp-frec-resp").val();
        var peso = $("#inp-peso").val();
        var presion_arterial = $("#inp-pre-arterial").val();        
        var pulso = $("#inp-pulso").val();
        var temperatura = $("#inp-temp").val();
        var tipo_sanguineo = $("#inp-tip-sang").val();
        if(estatura === "" || frecuencia_respiratoria === "" || peso === "" || presion_arterial === "" || pulso === "" || temperatura === "" || tipo_sanguineo === ""){
            Swal.fire({
                title: 'Error al actualizar',
                text: 'No se permiten campos vacíos',
                icon: 'error',
                showConfirmButton: false,
                timer: 3500
            })
        }else{
            var datosExamen = {
                estatura: estatura + "_"+ $("#umestatura").val(),
                frecuencia_respiratoria: frecuencia_respiratoria + "_"+ $("#umfrecuenciarespiratoria").val(),
                peso: peso + "_"+ $("#umpeso").val(),
                presion_arterial: presion_arterial + "_"+ $("#umpesoarterial").val(),
                pulso: pulso + "_"+ $("#umpulso").val(),
                temperatura: temperatura + "_"+ $("#umtemperatura").val(),
                tipo_sanguineo: tipo_sanguineo,
                id_examen_fisico: id_examen_fisico
            };
            var requestOptionsExamen = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json' // Especificar que estamos enviando JSON
                },
                body: JSON.stringify(datosExamen) // Convertir el objeto 'datos' a formato JSON
            };
            fetch(url_examen, requestOptionsExamen)
            .then(function(response){
                responseClone = response.clone();
                return response.json();
            }) // Convertir la respuesta a JSON
            .then(data => {     
                if(data.statusCodeValue===400){
                    Swal.fire({
                        title: 'Error en la actualización de los datos',
                        text: 'Error: ' + data.body,                        
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 3500
                    })
                }
                else{
                    Swal.fire({
                        title: 'Actualización exitosa',    
                        text: data.body,                    
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 3500
                    })            
                }  
            })
            .catch(error => {
                console.log(error);
            });
        }
    });

    //Update tratamiento
    var url_tratamiento = "http://localhost:3000/historia_clinica/actualizar_tratamiento";
    $(".editar-tratamiento").click(function(){
        $(".dt-form #inp-duracion, #inp-indicacion, #inp-medicacion").prop('disabled', false);
        $(".cont-guardar-tratamiento").css('display','block');
        $(".cont-guardar-tratamiento").css('display','flex');
    });

    $(".cancelar-tratamiento").click(function(){
        $(".cont-guardar-tratamiento").css('display','none');
        $(".dt-form #inp-duracion, #inp-indicacion, #inp-medicacion").prop('disabled', true);
    });

    $(".guardar-tratamiento").click(function(){
        var duracion = $("#inp-duracion").val();
        var indicacion = $("#inp-indicacion").val();
        var medicacion = $("#inp-medicacion").val();        
        if(duracion === "" || indicacion === "" || medicacion === ""){
            Swal.fire({
                title: 'Error al actualizar',
                text: 'No se permiten campos vacíos',
                icon: 'error',
                showConfirmButton: false,
                timer: 3500
            })
        }else{
            var datosTratamiento = {
                duracion: duracion,
                indicaciones: indicacion,
                medicacion: medicacion,                
                id_tratamiento: id_tratamiento
            };
            var requestOptionsTratamiento = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json' // Especificar que estamos enviando JSON
                },
                body: JSON.stringify(datosTratamiento) // Convertir el objeto 'datos' a formato JSON
            };
            fetch(url_tratamiento, requestOptionsTratamiento)
            .then(function(response){
                responseClone = response.clone();
                return response.json();
            }) // Convertir la respuesta a JSON
            .then(data => {     
                if(data.statusCodeValue===400){
                    Swal.fire({
                        title: 'Error en la actualización de los datos',
                        text: 'Error: ' + data.body,                        
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 3500
                    })
                }
                else{
                    Swal.fire({
                        title: 'Actualización exitosa',    
                        text: data.body,                    
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 3500
                    })            
                }  
            })
            .catch(error => {
                console.log(error);
            });
        }
    });

});