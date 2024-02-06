const pool = require('../db');

async function actualizarPaciente(paciente) {
  try {
    const query = `UPDATE paciente
    SET 
        primer_nombre = $1,
        segundo_nombre = $2,
        primer_apellido = $3,
        segundo_apellido = $4,
        correo = $6,
        telefono_movil = $7,
        telefono_fijo = $8,
        fecha_nacimiento = $9,
        estado_civil = $10,
        direccion = $11
    WHERE cedula = $5;
    
      `;

    const values = [
      paciente.primer_nombre,
      paciente.segundo_nombre,
      paciente.primer_apellido,
      paciente.segundo_apellido,
      paciente.cedula,
      paciente.correo,
      paciente.telefono_movil,
      paciente.telefono_fijo,
      paciente.fecha_nacimiento,
      paciente.estado_civil,
        paciente.direccion
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    throw error;
  }
}

module.exports = {
  actualizarPaciente,
}