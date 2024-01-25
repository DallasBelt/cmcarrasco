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

$(document).ready(function(){
    $("#inp-send").click(function(e){
        e.preventDefault();
        var p_nombre = $("#inp-nom").val();
        var s_nombre = $("#inp-s-nom").val();
        var p_apellido = $("#inp-ape").val();
        var s_apellido = $("#inp-s-ape").val();
        var v_cedula = $("#inp-ced").val();
        var v_correo = $("#inp-correo").val();
        var tlmovil = $("#inp-tlc").val();
        var tlfijo = $("#inp-tl").val();
        var fecha_na = $("#inp-fnac").val();
        var estado_c =  $('select[name="estado"] option:selected').text();
        var contra = $("#inp-ced").val();
        var direccion = $("#inp-direccion").val();
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
            direccion: direccion
        };

        var url = "http://localhost:3000/paciente/guardar";
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
                    if(data.statusCodeValue===400){
                        Swal.fire({
                            title: 'Error en el registro',
                            text: 'Error: ' + data,                        
                            icon: 'error',
                            showConfirmButton: true
                        })
                    }
                    else if(data.statusCodeValue===500) {
                        Swal.fire({
                            title: 'Advertencia en el registro',    
                            text: data.error,                    
                            icon: 'info',
                            showConfirmButton: true
                        })
                    }
                    else{
                        Swal.fire({
                            title: 'Completado',    
                            text: data.body,                    
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 3500
                        })
                        $("form")[0].reset();
                    }                    
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Error en el registro',
                        text: 'Error: ' + error.error,                        
                        icon: 'error',
                        showConfirmButton: true
                    })
                });  
    });
});