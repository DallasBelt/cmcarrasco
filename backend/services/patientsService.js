const usersService = require('./usersService');
const db = require('../db')

exports.create = async (patient) => {
  try {
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
        estado_civil: patient.estado_civil,
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
      SELECT * FROM paciente
    `)

    return patients;
  } catch (error) {
    console.error('Error al listar los pacientes:', error)
    throw error;
  }
};

exports.readByID = async (patientID) => {
  try {
    const patient = await db.oneOrNone('SELECT * FROM paciente WHERE cedula = $1', [patientID]);
    if (patient) {
      return patient;
    } else {
      throw new Error('Paciente no encontrado');
    }
  } catch (error) {
    throw new Error('Error al obtener datos del paciente: ' + error.message);
  }
};

exports.update = async (patientData, trans = db) => {
  try {
    return await trans.tx(async t => {
      if (patientData.changedEmail) {
        await usersService.update(patientData.id_usuario, patientData.correo, t);
      }

      const query = `
        UPDATE paciente SET
          primer_nombre = $1,
          segundo_nombre = $2,
          primer_apellido = $3,
          segundo_apellido = $4,
          fecha_nacimiento = $5,
          estado_civil = $6,
          direccion = $7,
          correo = $8,
          telefono_movil = $9
        WHERE cedula = $10
      `;
      const values = [
        patientData.primer_nombre,
        patientData.segundo_nombre,
        patientData.primer_apellido,
        patientData.segundo_apellido,
        patientData.fecha_nacimiento,
        patientData.estado_civil,
        patientData.direccion,
        patientData.correo,
        patientData.telefono_movil,
        patientData.cedula
      ];
      await t.none(query, values);

      return { message: 'Paciente actualizado correctamente' };
    });
  } catch (error) {
    console.error('Error al actualizar el paciente:', error);
    throw new Error('Error al actualizar el paciente en la base de datos');
  }
};

exports.delete = async (userID) => {
  try {
    await db.none('DELETE FROM usuario WHERE id_usuario = $1', [userID]);
    return { message: 'Paciente eliminado correctamente' };
  } catch (error) {
    console.error('Error al eliminar el paciente:', error);
    throw new Error('Error al eliminar el paciente');
  }
};