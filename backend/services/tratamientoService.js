const { encriptar_contrasenia } = require('../utils/encryptPassword');
const tratamientoQuerys = require('../querys/tratamientoQuerys');  // 

async function guardar_tratamiento(tratamiento) {
    try {

      const tratamientoGuardado = {
        duracion: tratamiento.duracion,
        indicaciones: tratamiento.indicaciones,
        medicacion: tratamiento.medicacion
      };
  
      const resultado = await tratamientoQuerys.guardar_tratamiento(tratamientoGuardado);
  
      return resultado;
    } catch (error) {
  
      console.error('Error al guardar el tratamiento:', error);
      throw new Error('Error al guardar el tratamiento en la base de datos');
    }
  }
  
  module.exports = {
    guardar_tratamiento
  };
