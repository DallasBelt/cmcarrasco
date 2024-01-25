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

async function guardarUsuario(usuario) {
  try {
    const query =`
      INSERT INTO usuario(activo, contrasenia, correo, nombre_usuario, role_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_usuario
    `
    const values = [
      usuario.activo,
      usuario.contrasenia,
      usuario.correo,
      usuario.nombre_usuario,
      usuario.role_id
    ];

    const result = await pool.query(query, values);
    console.log(`User ID: ${result.rows[0].id_usuario}`);

    return result.rows[0].id_usuario;
  
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    throw error; 
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
  guardarUsuario,
  eliminarUsuario
};

