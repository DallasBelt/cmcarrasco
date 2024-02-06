const pool = require('../db');

async function obtenerUsuarioPorCorreo(correo) {
  try {
    const query = 'SELECT * FROM usuario WHERE correo = $1';
    const values = [correo];
    const result = await pool.query(query, values);
    return result.rows[0]; // Devuelve el primer usuario encontrado o null si no se encuentra
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    throw error; // manejar el error 
  }
}

async function eliminarUsuario(usuario) {
  try {
    const query = `
      DELETE FROM usuario
      WHERE id_usuario = $1
    `

    const values = [
      usuario.id_usuario
    ]
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    throw error;
  }
}

module.exports = {
  obtenerUsuarioPorCorreo,
  eliminarUsuario
};

