const { encriptar_contrasenia } = require('../utils/encryptPassword');
const usuarioQuerys = require('../querys/userQueries');  // 

async function guardarUsuario(usuario) {
  try {
    const encriptador = new encriptar_contrasenia();
    const contra = await encriptador.encriptar(usuario.contrasenia); //Encriptar antes de mandar a guardar contraseña
    const usuarioGuardado = {
      nombre_usuario: usuario.nombre_usuario,
      contrasenia: contra,
      correo: usuario.correo,
      activo: usuario.activo,
      role_id: usuario.role_id,
    };

    const resultado = await usuarioQuerys.guardarUsuario(usuarioGuardado);

    return resultado;
  } catch (error) {

    console.error('Error al guardar el usuario:', error);
    throw new Error('Error al guardar el usuario en la base de datos');
  }
}

async function eliminarUsuario(usuario) {
  try {
      const usuarioEliminado = {
          id_usuario: usuario.id_usuario,
      };
      await usuarioQuerys.eliminarUsuario(usuarioEliminado);
      return 'Paciente eliminado correctamente.'
  } catch (error) {
      throw new Error('Error al eliminar paciente en la base de datos');
  }
}

module.exports = {
  guardarUsuario,
  eliminarUsuario
};