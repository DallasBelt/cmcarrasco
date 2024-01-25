$(document).ready(function(){
  var id_pac;
  var id_med;
  var horariosDisponibles = [];
  
  var requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json' // Especificar que estamos enviando JSON
      }
      //body: JSON.stringify(datos) // Convertir el objeto 'datos' a formato JSON
  };        

  fetch('http://localhost:3000/paciente/listar', requestOptions)
  .then(function(response){
      responseClone = response.clone();
      return response.json();
  }) // Convertir la respuesta a JSON
  .then(data => {     
      let contador = 1;       
      data.forEach(item => {
          // Accede a los valores de 'item' y realiza operaciones
          const cedula = item.cedula; // Muestra cada elemento del array JSON
          id_pac = item.id_paciente;
          const options = $('<option>',{
              value: id_pac,
              text: cedula
          });
          $('#inp-ced-paciente').append(options);
          contador++;
      });           
  })
  .catch(error => {
      console.log(error);
  });
       
  
  fetch('http://localhost:3000/medico/listar"', requestOptions)
  .then(function(response){
      responseClone = response.clone();
      return response.json();
  }) // Convertir la respuesta a JSON
  .then(data => {     
      let contador = 1;       
      data.forEach(item => {
          // Accede a los valores de 'item' y realiza operaciones
          const pnombre = item.primer_nombre + ' ' + item.primer_apellido + ' ' + item.segundo_apellido; // Muestra cada elemento del array JSON
          id_med = item.id_medico;
          const options = $('<option>',{
              value: id_med,
              text: pnombre
          });
          $('#inp-ced-medico').append(options);
          contador++;
          });           
  })
  .catch(error => {
      console.log(error);
  });


  $("#dt").click(function(){
      fetch('http://localhost:3000/paciente/listar', requestOptions)
      .then(function(response){
          responseClone = response.clone();
          return response.json();
      }) // Convertir la respuesta a JSON
      .then(data => {      
          var opt = $('select[name="paciente"] option:selected').text();     
          const nombC = data.find(function(elemento) {
              return elemento.cedula === opt;
          });        
          $("#nomc").html(nombC.primer_nombre + ' ' + nombC.primer_apellido + ' ' + nombC.segundo_apellido);
      })
      .catch(error => {
          console.log(error);
      });
      
      fetch('http://localhost:3000/medico/listar"', requestOptions)
      .then(function(response){
          responseClone = response.clone();
          return response.json();
      }) // Convertir la respuesta a JSON
      .then(data => {                     
          var opt = $('select[name="medico"] option:selected').text();                 
          const nombC = data.find(function(elemento) {
              return elemento.primer_nombre + ' ' + elemento.primer_apellido + ' ' + elemento.segundo_apellido === opt;
          });        
          $("#area").html(nombC.especialidad.replaceAll(";", " - "));
          horariosDisponibles = JSON.parse(nombC.horarios);
          console.log("horariosDisponibles ", horariosDisponibles);
      })
      .catch(error => {
          console.log(error);
      });
      });

  function obtenerHorariosMedico (horarioDisponible) {
      let horarios = [];
      for(let i = 0; i < horarioDisponible.length; i++) {
          if(horarioDisponible[i].enable) {
              horarios.push(horarioDisponible[i].hora);
          }
      }
      return horarios;
  }


  $('#fecha').change(function() {        
      document.getElementById("inp-hora").innerHTML= "";
      var htmldate = $(this).val();
      datos = {
          fecha: htmldate
      }

      var requestOptions2 = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json' // Especificar que estamos enviando JSON
          },
          body: JSON.stringify(datos) // Convertir el objeto 'datos' a formato JSON
      };        
      $("#inp-hora").prop('disabled',false);        
      
      
      fetch('http://localhost:3000/cita_medica/listar_fechas', requestOptions2)
      .then(function(response){
          responseClone = response.clone();
          return response.json();
      }) // Convertir la respuesta a JSON
      .then(data => {       
          var str;

          //var miArray = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
          var miArray = obtenerHorariosMedico(horariosDisponibles);
          function obtenerElementosUnicos(array) {
              const elementosUnicos = [];                
              const elementosRepetidos = [];
          
              for (let i = 0; i < array.length; i++) {
                  const elemento = array[i];
                  if (elementosUnicos.includes(elemento)) {
                      elementosRepetidos.push(elemento);
                  } else {
                      elementosUnicos.push(elemento);
                  }
              }
          
              const elementosNoRepetidos = elementosUnicos.filter(elemento => !elementosRepetidos.includes(elemento));
          
              return elementosNoRepetidos;
          }      
          data.forEach(item => {
              // Accede a los valores de 'item' y realiza operaciones
              const fecha = item; // Muestra cada elemento del array JSON
              var vsplit = fecha.split(' ');
              str = vsplit[1];                
              str = str.substring(0, str.length  - 3);        
              miArray = miArray.concat(str);    
          });                    
          const elementosNoRepetidos = obtenerElementosUnicos(miArray);
          elementosNoRepetidos.forEach(function(elementosNoRepetidos, indice){                
              const opthoras = $('<option>',{
                  value: indice,
                  text: elementosNoRepetidos
              });
              $('#inp-hora').append(opthoras);
          });                    

      })
      .catch(error => {
          console.log(error);
      });
  });   


  $("#crear-cita").click(function(){        
      var hora = $('select[name="hora"] option:selected').text();    
      var ff_inicio =$('#fecha').val();  
      var f_inicio = $('#fecha').val() +'T'+hora+':00';
      function sumarUnaHora(cadenaHora) {
          const partesHora = cadenaHora.split(':'); // Divide la cadena en horas y minutos
          let horas = parseInt(partesHora[0], 10);
          let minutos = parseInt(partesHora[1], 10);
      
          // Suma una hora
          horas += 1;
      
          // Verifica si las horas superan las 23
          if (horas > 23) {
          horas = 0; // Vuelve a las 00 horas
          }
      
          // Formatea las horas y minutos en una cadena en formato de 24 horas
          const horaResultante = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
          
          return horaResultante;
      }

      
      // Ejemplo de uso
      const horaOriginal = hora;
      const horaSumada = sumarUnaHora(horaOriginal);
      var f_fin = ff_inicio+'T'+horaSumada+':00';
      var obsr = $('#inp-obs').val();
      var especialidad = $('#area').text();
      id_pac = $("#inp-ced-paciente").val();
      id_med = $("#inp-ced-medico").val();
      datos = {
          fecha_inicio: f_inicio,
          fecha_fin: f_fin,
          observacion: obsr,                                    
          especialidad: especialidad,
          estado: "Agendada",
          paciente:{
              id_paciente: id_pac
          },
          medico:{
              id_medico: id_med
          }
      }        

      var requestOptions = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json' // Especificar que estamos enviando JSON
          },
          body: JSON.stringify(datos) // Convertir el objeto 'datos' a formato JSON
      };            
      //alert(JSON.stringify(datos));
      fetch('http://localhost:3000/cita_medica/guardar', requestOptions)
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
                  title: 'Cita creada correctamente',    
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