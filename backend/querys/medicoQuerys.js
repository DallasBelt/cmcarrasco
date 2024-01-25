const pool = require("../db")

async function guardarMedico(medico) {
  try {
    const query = `INSERT INTO 
      medico(primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula, correo, telefono_movil, telefono_fijo, 
      fecha_nacimiento, estado_civil, especialidad,licencia, id_usuario, direccion, horarios) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);`

    const values = [
      medico.primer_nombre,
      medico.segundo_nombre,
      medico.primer_apellido,
      medico.segundo_apellido,
      medico.cedula,
      medico.correo,
      medico.telefono_movil,
      medico.telefono_fijo,
      medico.fecha_nacimiento,
      medico.estado_civil,
      medico.especialidad,
      medico.licencia,
      medico.id_usuario,
      medico.direccion,
      medico.horarios
    ];

    const result = await pool.query(query, values);
    // console.log(result.rows);
    return result.rows[0];
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    throw error;
  }
}

async function actualizarMedico(medico) {
  try {
    const query = `
    UPDATE medico
    SET primer_nombre = $1,
    segundo_nombre = $2,
    primer_apellido = $3,
    segundo_apellido = $4,
    correo = $5,
    telefono_movil = $6,
    telefono_fijo = $7,
    fecha_nacimiento = $8,
    estado_civil = $9,
    especialidad = $10,
    licencia = $11,
    direccion = $12,
    horarios = $13
    WHERE cedula = $14;
    `;

    const values = [
      medico.primer_nombre,
      medico.segundo_nombre,
      medico.primer_apellido,
      medico.segundo_apellido,
      medico.correo,
      medico.telefono_movil,
      medico.telefono_fijo,
      medico.fecha_nacimiento,
      medico.estado_civil,
      medico.especialidad,
      medico.licencia,
      medico.direccion,
      medico.horarios,
      medico.cedula
    ];

    const result = await pool.query(query, values);
    //console.log(result.rows);
    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar datos:", error);
    throw error;
  }
}

// Get the medics from the table Medics of the database
async function getMedics() {
  const query = "select * from medico";
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    throw error;
  }
}

module.exports = {
  guardarMedico,
  getMedics,
  actualizarMedico
};