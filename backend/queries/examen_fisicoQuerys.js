const pool = require('../db');

async function guardar_examen_fisico(examen_fisico) {
    try {
      const query =`
      INSERT INTO examen_fisico(
         estatura, frecuencia_respiratoria, peso, presion_arterial, pulso, temperatura, tipo_sanguineo)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_examen_fisico; 
      `;
      
      const values = [
        examen_fisico.estatura,
        examen_fisico.frecuencia_respiratoria,
        examen_fisico.peso,
        examen_fisico.presion_arterial,
        examen_fisico.pulso,
        examen_fisico.temperatura,
        examen_fisico.tipo_sanguineo
      ];
  
      const result = await pool.query(query, values);
  
      return result.rows[0]; 
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      throw error; 
    }
  }

  async function actualizarExamenFisico(examen_fisico) {
    try {
        const consulta = `
        UPDATE examen_fisico
        SET estatura = $1, 
        frecuencia_respiratoria = $2, 
        peso = $3, 
        presion_arterial = $4, 
        pulso = $5, 
        temperatura = $6, 
        tipo_sanguineo = $7
        WHERE id_examen_fisico = $8
        `;
        const values = [
          examen_fisico.estatura,
          examen_fisico.frecuencia_respiratoria,
          examen_fisico.peso,
          examen_fisico.presion_arterial,
          examen_fisico.pulso,
          examen_fisico.temperatura,
          examen_fisico.tipo_sanguineo,
          examen_fisico.id_examen_fisico
        ];

        const result = await pool.query(consulta, values);
        return result;

    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
    }
  }

  module.exports = {
    guardar_examen_fisico,
    actualizarExamenFisico
  };
  
  