const pool = require('../db');

async function guardar_antecedente(antecedente) {
  try {
    const query = `
    INSERT INTO antecedente(
      antecedente_alergico, antecedente_familiar, antecedente_personal, antecedente_quirurgico)
      VALUES ($1, $2, $3, $4) RETURNING id_antecedente;
    `;
    const values = [
      antecedente.antecedente_alergico,
      antecedente.antecedente_familiar,
      antecedente.antecedente_personal,
      antecedente.antecedente_quirurgico
    ];

    const result = await pool.query(query, values);

    return result.rows[0]; 

  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    throw error;
  }
}

async function actualizarAntecedente(antecedente) {
  try {
    const query = `
    UPDATE  antecedente
    SET 
      antecedente_alergico =$1,
      antecedente_familiar = $2,
      antecedente_personal = $3,
      antecedente_quirurgico = $4
      where id_antecedente = $5
    `;
    const values = [
      antecedente.antecedente_alergico,
      antecedente.antecedente_familiar,
      antecedente.antecedente_personal,
      antecedente.antecedente_quirurgico,
      antecedente.id_antecedente
    ];

    const result = await pool.query(query, values);

    return result.rows[0]; 

  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    throw error;
  }
}

module.exports = {
  guardar_antecedente,
  actualizarAntecedente
};

