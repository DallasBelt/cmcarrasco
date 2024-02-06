const db = require('../db');
const { EncryptPassword } = require('../utils/encryptPassword');

exports.create = async (user, t = db) => {
  try {
    const encryptor = new EncryptPassword();
    const password = await encryptor.encrypt(user.contrasenia);
    const query = `
      INSERT INTO usuario(activo, contrasenia, correo, nombre_usuario, role_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_usuario
    `;
    const values = [
      user.activo,
      password,
      user.correo,
      user.nombre_usuario,
      user.role_id
    ];

    const result = await t.one(query, values);

    return result.id_usuario;
  } catch (error) {
    console.error('Error al guardar el usuario:', error);
    throw new Error('Error al guardar el usuario en la base de datos');
  }
};