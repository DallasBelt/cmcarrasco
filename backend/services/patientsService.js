const usersService = require('./usersService');
// const genUsername = require('../utils/genUsername');
const db = require('../db')

const maritalStatusMapping = {
  1: 'Soltero(a)',
  2: 'Casado(a)',
  3: 'Viudo(a)',
  4: 'Divorciado(a)'
};

exports.create = async (patient) => {
  try {
    const maritalStatusText = maritalStatusMapping[patient.estado_civil];

    const newUser = {
      nombre_usuario: `${patient.primer_nombre}${patient.cedula.substring(6)}`,
      contrasenia: patient.cedula,
      correo: patient.correo,
      activo: true,
      role_id: 4
    };

    // Create a new user and patient in a transaction
    return db.tx(async t => {
      const createdUserId = await usersService.create(newUser, t);

      const newPatient = {
        primer_nombre: patient.primer_nombre,
        segundo_nombre: patient.segundo_nombre,
        primer_apellido: patient.primer_apellido,
        segundo_apellido: patient.segundo_apellido,
        cedula: patient.cedula,
        correo: patient.correo,
        telefono_movil: patient.telefono_movil,
        fecha_nacimiento: patient.fecha_nacimiento,
        estado_civil: maritalStatusText,
        direccion: patient.direccion,
        id_usuario: createdUserId
      };

      // Create the new patient
      await t.none(`
        INSERT INTO paciente (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula, correo, telefono_movil, fecha_nacimiento, estado_civil, id_usuario, direccion)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        newPatient.primer_nombre,
        newPatient.segundo_nombre,
        newPatient.primer_apellido,
        newPatient.segundo_apellido,
        newPatient.cedula,
        newPatient.correo,
        newPatient.telefono_movil,
        newPatient.fecha_nacimiento,
        newPatient.estado_civil,
        newPatient.id_usuario,
        newPatient.direccion
      ]);

      return { message: 'Paciente guardado correctamente' };
    });
  } catch (error) {
      console.error('Error al guardar el paciente:', error);
      if (error.code === '23505') {
        throw new Error('Duplicidad de datos');
      } else {
        throw new Error('Error al guardar el paciente en la base de datos');
      }
  }
};

exports.read = async () => {
  try {
    const patients = await db.any(`
      SELECT *, id_usuario FROM paciente
    `)

    return patients;
  } catch (error) {
    console.error('Error al listar los pacientes:', error)
    throw error;
  }
};