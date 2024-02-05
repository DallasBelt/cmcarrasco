const jwt = require('jsonwebtoken');
const db = require('../db');
const { EncryptPassword } = require('../utils/encryptPassword');

exports.login = async (email, password) => {
  try {
    const user = await db.oneOrNone('SELECT id_usuario, nombre_usuario, role_id, contrasenia FROM usuario WHERE correo = $1', [email]);

    if (!user) {
      return { error: 'Usuario no registrado', status: 404 };
    }

    const encryptor = new EncryptPassword();
    const isPasswordValid = await encryptor.compare(password, user.contrasenia);

    if (!isPasswordValid) {
      return { error: 'Contraseña incorrecta', status: 401 };
    }

    const token = jwt.sign({
      id_usuario: user.id_usuario,
      nombre_usuario: user.nombre_usuario,
      role_id: user.role_id
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    return { token, user };
  } catch (error) {
    console.error(error);
    return { error: 'Error interno del servidor', status: 500 };
  }
};