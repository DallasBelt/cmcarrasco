const antecedenteQuerys = require('../querys/antecedenteQuerys');  // 


async function guardar_antecedente(antecedente) {
    try {

      const antecedenteGuardado = {
        antecedente_alergico: antecedente.antecedente_alergico,
        antecedente_familiar: antecedente.antecedente_familiar,
        antecedente_personal: antecedente.antecedente_personal,
        antecedente_quirurgico: antecedente.antecedente_quirurgico,
      };
  
      const resultado = await antecedenteQuerys.guardar_antecedente(antecedenteGuardado);
  
      return resultado;
    } catch (error) {
  
      console.error('Error al guardar el tratamiento:', error);
      throw new Error('Error al guardar el tratamiento en la base de datos');
    }
  }
  

  module.exports = {
    guardar_antecedente
  };