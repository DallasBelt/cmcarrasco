$(document).ready(function(){    
    var url = "http://localhost:3000/cita_medica/citas_del_paciente";    
    var id_usuario = sessionStorage.getItem("id_usuario");
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
        var fecha;
        var horaI;
        var horaF;
        var medico;                
        data.forEach(item => {
            // Accede a los valores de 'item' y realiza operaciones
            fecha = item.fecha; // Muestra cada elemento del array JSON
            horaI = item.hora_inicio+':00';
            horaF = item.hora_fin+':00';
            medico = item.primer_nombre + ' ' + item.primer_apellido;
            especialidad = item.especialidad;
            fecha = fecha.split('T');        
            $(".info").append(
                '<table>'
                    + '<caption> Cita N° ' + item.id_cita_medica + '</caption>' 
                    + '<tbody>'
                        + '<tr>'
                            + '<th>Fecha:</th>'
                            + '<td>' + fecha[0]
                            + '<th>Hora de inicio:</th>'
                            + '<td>'+ horaI + '</td>'
                            + '<th>Hora de fin:</th>'
                            + '<td>'+ horaF + '</td>'
                        + '</tr>'
                        + '<tr>'
                            +'<th>Médico:</th>'                
                            + '<td>'+ medico + '</td>'
                            +'<th>Especialidad:</th>'                
                            + '<td>'+ especialidad + '</td>'
                            + '<th>Observacion:</th>'                
                            + '<td>'+ item.observacion + '</td>'
                        + '</tr>'
                    +'</tbody>'
                +'</table>'
            );
            $("<br>").insertAfter($("table"));
        });          
    })
    .catch(error => {
        console.log(error);
    });
});