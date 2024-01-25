$(document).ready(function(){
    var all_data = [];
    var id_usuario = sessionStorage.getItem("id_usuario");
    var url = "http://localhost:3000/historia_clinica/listar_historia_paciente";
    datos = {
        id_usuario: id_usuario
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
        data.forEach(item => {            
            // Accede a los valores de 'item' y realiza operaciones
            const options = $('<option>', {
                value: contador,
                text: item.numero_historia
            });
            $('#inp-numero-c').append(options);
            contador++;
            all_data.push(item);
        });   
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

    $('#inp-numero-c').change(function() {
        $(".dt-form .input-container input + textarea").val("");
        const selectedIndex = $(this).prop('selectedIndex');
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