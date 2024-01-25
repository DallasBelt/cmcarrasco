$(document).ready(function(){
    var url = "http://localhost:3000/historia_clinica/listar_pacientes";
    var all_data = [];
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Especificar que estamos enviando JSON
        }
        //body: JSON.stringify(datos) // Convertir el objeto 'datos' a formato JSON
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
            const cedula = item.cedula; // Muestra cada elemento del array JSON
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
        $('#inp-numero-c').empty();
        fetch(url, requestOptions)
        .then(function(response){
            responseClone = response.clone();
            return response.json();
        }) // Convertir la respuesta a JSON
        .then(data => {      
            var opt = $('select[name="paciente"] option:selected').text();     
            const nombC = data.find(function(elemento) {
                return elemento.cedula === opt;
            });        
            $("#nomc").html(nombC.primer_nombre + ' ' + nombC.primer_apellido); 
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
            }    
        })
        .catch(error => {
            console.log(error);
        });
    });

    $('#inp-numero-c').change(function() {
        $(".dt-form .input-container input + textarea").val("");
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
    });
});