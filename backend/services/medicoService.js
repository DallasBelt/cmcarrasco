const medicoQuerys = require('../querys/medicoQuerys');
const usuarioService = require('./usuarioService');
const utilitarios = require('../utils/generar_nombre_usuario');
const mail = require('../utils/mailer');

// Función para guardar un medico
async function guardarMedico(medico) {
  try {
    // Generar un nombre de usuario
    const nombreUsuarioGenerado = utilitarios.nombreUsuario(medico.primer_nombre, medico.cedula);

    // Crear un nuevo usuario
    const nuevoUsuario = {
      nombre_usuario: nombreUsuarioGenerado,
      contrasenia: medico.cedula,
      correo: medico.correo,
      activo: true,
      tipo_usuario: 'MEDICO'
    };

    console.log(nuevoUsuario);

    // Guardar el nuevo usuario en la base de datos
    const usuarioGuardado = await usuarioService.guardarUsuario(nuevoUsuario);

    // Crear un nuevo medico asociado al usuario
    const nuevoMedico = {
      primer_nombre: medico.primer_nombre,
      segundo_nombre: medico.segundo_nombre,
      primer_apellido: medico.primer_apellido,
      segundo_apellido: medico.segundo_apellido,
      cedula: medico.cedula,
      correo: medico.correo,
      telefono_movil: medico.telefono_movil,
      telefono_fijo: medico.telefono_fijo,
      fecha_nacimiento: medico.fecha_nacimiento,
      estado_civil: medico.estado_civil,
      especialidad: medico.especialidad,
      contrasenia: medico.contrasenia,
      id_usuario: usuarioGuardado, // Asociar al usuario recién creado
      direccion: medico.direccion,
      horarios: medico.horarios
    };

    console.log(nuevoMedico);
    // Guardar el nuevo medico en la base de datos
    await medicoQuerys.guardarMedico(nuevoMedico);

    const nuevoCorreo = {
      primer_nombre: medico.primer_nombre,
      primer_apellido: medico.primer_apellido,
      segundo_apellido: medico.segundo_apellido,
      correo: medico.correo,
    };

    mail.enviarMailMedico(nuevoCorreo);
    return 'Médico guardado correctamente.';
  } catch (error) {
    console.error('Error al guardar el medico:', error);
    throw new Error('Error al guardar el medico en la base de datos');
  }
}

async function actualizarMedico(medico) {
  try {
    const nuevoMedico = {
      primer_nombre: medico.primer_nombre,
      segundo_nombre: medico.segundo_nombre,
      primer_apellido: medico.primer_apellido,
      segundo_apellido: medico.segundo_apellido,
      correo: medico.correo,
      telefono_movil: medico.telefono_movil,
      telefono_fijo: medico.telefono_fijo,
      fecha_nacimiento: medico.fecha_nacimiento,
      estado_civil: medico.estado_civil,
      especialidad: medico.especialidad,
      licencia: medico.licencia,
      cedula: medico.cedula,
      direccion: medico.direccion,
      horarios: medico.horarios
    };

    console.log(nuevoMedico);
    // Guardar el nuevo medico en la base de datos
    await medicoQuerys.actualizarMedico(nuevoMedico);
    return 'Médico actualizado correctamente.';
  } catch (error) {
    throw new Error('Error al guardar el medico en la base de datos');
  }
}

async function getMedics() {
  try {
    const medicos = await medicoQuerys.getMedics()
    console.log(medicos.rows)
    return medicos
  } catch (error) {
      console.error('Error al listar el medico:', error)
  }
}

module.exports = {
  guardarMedico,
  getMedics,
  actualizarMedico
};