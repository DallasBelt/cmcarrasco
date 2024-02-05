const db = require('../db');

exports.displayUsername = async (userID) => {
  try {
    const username = await db.oneOrNone('SELECT nombre_usuario FROM usuario WHERE id_usuario = $1', [userID]);

    if (!username) {
      return { error: 'Nombre de usuario no disponible', status: 404 };
    }

    return username;
  } catch (error) {
    console.error(error);
    return { error: 'Error interno del servidor', status: 500 };
  }
};