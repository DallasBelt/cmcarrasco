const pool = require('../db');

async function guardar_tratamiento(tratamiento) {
    try {
      const query =`INSERT INTO tratamiento(duracion, indicaciones, medicacion)
        VALUES ($1, $2, $3) RETURNING id_tratamiento;`;
      const values = [
        tratamiento.duracion,
        tratamiento.indicaciones,
        tratamiento.medicacion,
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0]; 
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      throw error; 
    }
  }

  async function actualizarTratamiento(tratamiento) {
    try {
        const consulta = `
        UPDATE tratamiento
        SET
            duracion = $1,
            indicaciones = $2,
            medicacion = $3
        WHERE id_tratamiento = $4
        `;
        const values = [
            tratamiento.duracion,
            tratamiento.indicaciones,
            tratamiento.medicacion,
            tratamiento.id_tratamiento,
        ];

        const result = await pool.query(consulta, values);
        return result;

    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
    }
}

  module.exports = {
    guardar_tratamiento,
    actualizarTratamiento
  };
  
  