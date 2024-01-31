const usuarioService = require('./usersService');
const genUsername = require('../utils/genUsername');
const pacienteQuerys = require('../queries/pacienteQuerys');
const mail = require('../utils/mailer');
const db = require('../db')

async function listPatients() {
  try {
    const patients = await db.any(`
      SELECT *, id_usuario FROM paciente
    `)

    console.log(patients);

    return patients;
  } catch (error) {
    console.error('Error al listar los pacientes:', error)
    throw error;
  }
}

async function getPatientByID(patientID) {
  const maritalStatusMapping = {
    'Soltero(a)': 1,
    'Casado(a)': 2,
    'Divorciado(a)': 3,
    'Viudo(a)': 4
  }
  try {
    const query = `
      SELECT *
      FROM paciente
      WHERE cedula = $1
    `;

    const patientData = await db.oneOrNone(query, [patientID]);

    if (patientData) {
      const mappedMaritalStatus = maritalStatusMapping[patientData.estado_civil];
      if (mappedMaritalStatus) {
        patientData.estado_civil = mappedMaritalStatus;
      }
      return patientData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener datos del paciente por ID:', error);
    throw error;
  }
}

// async function updatePatient(patientData) {
//   try {
//       const updateQuery = `
//         UPDATE paciente 
//         SET primer_nombre = $1,
//             segundo_nombre = $2,
//             primer_apellido = $3,
//             segundo_apellido = $4,
//             correo = $5,
//             telefono_movil = $6,
//             fecha_nacimiento = $7,
//             estado_civil = $8,
//             direccion = $9
//         WHERE cedula = $10
//         RETURNING *;`

//       const values = [
//         patientData.primer_nombre,
//         patientData.segundo_nombre,
//         patientData.primer_apellido,
//         patientData.segundo_apellido,
//         patientData.correo,
//         patientData.telefono_movil,
//         patientData.fecha_nacimiento,
//         patientData.estado_civil,
//         patientData.direccion,
//         patientData.cedula
//       ]

//       const updatedPatient = await db.oneOrNone(updateQuery, values);

//       return updatedPatient;
//   } catch (error) {
//       console.error('Error en el servicio al actualizar el paciente:', error);
//       throw error;
//   }
// }

async function updatePatient(patientData) {
  const setClauses = [];
  const values = [];

  Object.entries(patientData).forEach(([key, value], index) => {
      if (key !== 'cedula' && key !== 'id_usuario' && value !== undefined) {
          setClauses.push(`${key} = $${index + 1}`);
          values.push(value);
      }
  });

  if (setClauses.length === 0) {
      // No hay datos para actualizar
      return null;
  }

  const updateQuery = `
      UPDATE paciente
      SET ${setClauses.join(', ')}
      WHERE cedula = $${setClauses.length + 1}
      RETURNING *;`;

  values.push(patientData.cedula);

  try {
      const updatedPatient = await db.oneOrNone(updateQuery, values);
      return updatedPatient;
  } catch (error) {
      console.error('Error al actualizar el paciente:', error);
      throw error;
  }
}

async function verifyID(patientID) {
  try {
      const result = await db.oneOrNone('SELECT * FROM paciente WHERE cedula = $1', [patientID]);
      return !!result; // Devuelve true si se encuentra un paciente, false en caso contrario
  } catch (error) {
      console.error('Error al verificar el ID del paciente:', error);
      throw error; // Propaga el error para manejarlo en el controlador
  }
}

async function verifyEmail(patientEmail) {
  try {
      const result = await db.oneOrNone('SELECT * FROM paciente WHERE correo = $1', [patientEmail]);
      return !!result; // Devuelve true si se encuentra un paciente, false en caso contrario
  } catch (error) {
      console.error('Error al verificar el correo del paciente:', error);
      throw error; // Propaga el error para manejarlo en el controlador
  }
}

// Función para guardar un paciente
async function savePatient(patient) {
  try {
    // Generar un nombre de usuario
    const generatedUsername = genUsername.genUsername(patient.primer_nombre, patient.cedula);

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

module.exports = {
  listPatients,
  getPatientByID,
  updatePatient,
  savePatient,
  verifyID,
  verifyEmail
}
