const db = require('../db')
const { EncryptPassword } = require('../utils/encryptPassword')

async function login(loginData) {
  try {
    const encryptor = new EncryptPassword()

    const result = await db.oneOrNone('SELECT * FROM usuario WHERE correo = $1', [loginData.correo])

    if (!result) {
      return { status: 404, error: 'Usuario no registrado' }
    }

    const passwordOK = await encryptor.compare(loginData.contrasenia, result.contrasenia)

    if (!passwordOK) {
      return { status: 401, error: 'Contraseña incorrecta' }
    }

    const userDTO = {
      nombre_usuario: result.nombre_usuario,
      id_usuario: result.id_usuario,
      role_id: result.role_id,
    };

    return { userDTO }
  } catch (error) {
    console.error(error)
    return { status: 500, error: 'Error interno del servidor' }
  }
}

module.exports = {
  login
}
