const examen_fisicoQuerys = require('../queries/examen_fisicoQuerys');  // 


async function guardar_examen_fisico(examen_fisico) {
    try {

      const examen_fisicoGuardado = {
        estatura: examen_fisico.estatura,
        frecuencia_respiratoria: examen_fisico.frecuencia_respiratoria,
        peso:examen_fisico.peso,
        presion_arterial: examen_fisico.presion_arterial,
        pulso: examen_fisico.pulso,
        temperatura:examen_fisico.temperatura,
        tipo_sanguineo: examen_fisico.tipo_sanguineo
      };
  
      const resultado = await examen_fisicoQuerys.guardar_examen_fisico(examen_fisicoGuardado);
  
      return resultado;
    } catch (error) {
  
      console.error('Error al guardar el tratamiento:', error);
      throw new Error('Error al guardar el tratamiento en la base de datos');
    }
  }
  

  module.exports = {
    guardar_examen_fisico
  };