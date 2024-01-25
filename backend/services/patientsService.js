const usuarioService = require('./usuarioService');
const utilitarios = require('../utils/generar_nombre_usuario');
const pacienteQuerys = require('../querys/pacienteQuerys');
const mail = require('../utils/mailer');

// Función para guardar un paciente
async function savePatient(patient) {
  try {
    // Generar un nombre de usuario
    const generatedUsername = utilitarios.nombreUsuario(patient.primer_nombre, patient.cedula);

    // Crear un nuevo usuario
    const newUser = {
      nombre_usuario: generatedUsername,
      contrasenia: patient.cedula,
      correo: patient.correo,
      activo: true,
      role_id: 4
    };

    console.log(newUser);

    // Guardar el nuevo usuario en la base de datos
    const savedUser = await usuarioService.guardarUsuario(newUser);

    // Crear un nuevo paciente asociado al usuario
    const newPatient = {
      primer_nombre: paciente.primer_nombre,
      segundo_nombre: paciente.segundo_nombre,
      primer_apellido: paciente.primer_apellido,
      segundo_apellido: paciente.segundo_apellido,
      cedula: paciente.cedula,
      correo: paciente.correo,
      telefono_movil: paciente.telefono_movil,
      fecha_nacimiento: paciente.fecha_nacimiento,
      estado_civil: paciente.estado_civil,
      contrasenia: paciente.contrasenia,
      id_usuario: savedUser, // Asociar al usuario recién creado
      direccion: paciente.direccion
    };

    console.log(newPatient);
    // Guardar el nuevo paciente en la base de datos
    await pacienteQuerys.guardarPaciente(newPatient);

    const newEmail = {
      primer_nombre: paciente.primer_nombre,
      primer_apellido: paciente.primer_apellido,
      segundo_apellido: paciente.segundo_apellido,
      correo: paciente.correo
    };

    mail.enviarMailPaciente(newEmail);

    return 'Paciente guardado correctamente.';
  } catch (error) {
      console.error('Error al guardar el paciente:', error);
      throw new Error('Error al guardar el paciente en la base de datos');
  }
}

async function actualizarPaciente(paciente) {
  try {
    const nuevoPaciente = {
      primer_nombre: paciente.primer_nombre,
      segundo_nombre: paciente.segundo_nombre,
      primer_apellido: paciente.primer_apellido,
      segundo_apellido: paciente.segundo_apellido,
      correo: paciente.correo,
      telefono_movil: paciente.telefono_movil,
      telefono_fijo: paciente.telefono_fijo,
      fecha_nacimiento: paciente.fecha_nacimiento,
      estado_civil: paciente.estado_civil,
      cedula: paciente.cedula,
      direccion: paciente.direccion
    };

    console.log(nuevoPaciente);
    await pacienteQuerys.actualizarPaciente(nuevoPaciente);


    return 'Paciente actualizado correctamente.';
  } catch (error) {
    throw new Error('Error al guardar el paciente en la base de datos');
  }
}

async function listarPaciente() {
  try {
    const pacientes = await pacienteQuerys.listarPaciente();
    console.log(pacientes.rows);
    return pacientes;
  } catch (error) {
    console.error('Error al listar el paciente:', error);
  }
}

async function verifyID(patientID) {
  try {
    const patient = await pacienteQuerys.verifyID(patientID)
    return !!patient;
  } catch (error) {
    console.error('Error al verificar la identificación del paciente en el servicio:', error);
    return false;
  }
}

async function verifyEmail(patientEmail) {
  try {
    const patient = await pacienteQuerys.verifyEmail(patientEmail)
    return !!patient;
  } catch (error) {
    console.error('Error al verificar el correo del paciente en el servicio:', error);
    return false;
  }
}

module.exports = {
  savePatient,
  listarPaciente,
  actualizarPaciente,
  verifyID,
  verifyEmail
};
