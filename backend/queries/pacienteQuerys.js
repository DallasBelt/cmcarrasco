const pool = require('../db');

async function guardarPaciente(paciente) {
  try {
    const query = `
      INSERT INTO 
      paciente(primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula, correo, telefono_movil, fecha_nacimiento, estado_civil, id_usuario, direccion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
    `
    const values = [
      paciente.primer_nombre,
      paciente.segundo_nombre,
      paciente.primer_apellido,
      paciente.segundo_apellido,
      paciente.cedula,
      paciente.correo,
      paciente.telefono_movil,
      paciente.fecha_nacimiento,
      paciente.estado_civil,
      paciente.id_usuario,
      paciente.direccion
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
      console.error('Error al consultar la base de datos:', error);
    throw error;
  }
}

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
    // console.log(result.rows);
    return result.rows[0];
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    throw error;
  }
}

module.exports = {
  guardarPaciente,
  actualizarPaciente,
}