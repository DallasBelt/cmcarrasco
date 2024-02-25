const usersService = require('./usersService');
const db = require('../db')

exports.create = async (medic) => {
  try {
    const newUser = {
      nombre_usuario: `${medic.primer_nombre}${medic.cedula.substring(6)}`,
      contrasenia: medic.cedula,
      correo: medic.correo,
      activo: true,
      role_id: 2
    };

    // Create a new user and medic in a transaction
    return db.tx(async t => {
      const createdUserID = await usersService.create(newUser, t);

      const newMedic= {
        primer_nombre: medic.primer_nombre,
        segundo_nombre: medic.segundo_nombre,
        primer_apellido: medic.primer_apellido,
        segundo_apellido: medic.segundo_apellido,
        cedula: medic.cedula,
        fecha_nacimiento: medic.fecha_nacimiento,
        estado_civil: medic.estado_civil,
        direccion: medic.direccion,
        correo: medic.correo,
        telefono_movil: medic.telefono_movil,
        especialidad: medic.especialidad,
        schedule: medic.schedule,
        shifts: medic.shifts,
        id_usuario: createdUserID
      };

      // Create the new medic
      await t.none(`
        INSERT INTO medico (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula, fecha_nacimiento, estado_civil, direccion, correo, telefono_movil, especialidad, schedule, shifts, id_usuario)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [
        newMedic.primer_nombre,
        newMedic.segundo_nombre,
        newMedic.primer_apellido,
        newMedic.segundo_apellido,
        newMedic.cedula,
        newMedic.fecha_nacimiento,
        newMedic.estado_civil,
        newMedic.direccion,
        newMedic.correo,
        newMedic.telefono_movil,
        newMedic.especialidad,
        newMedic.schedule,
        newMedic.shifts,
        newMedic.id_usuario,
      ]);

      return { message: 'Medic saved successfully.' };
    });
  } catch (error) {
      console.error('Error while trying to save medic:', error);
      if (error.code === '23505') {
        throw new Error('Data is duplicated!');
      } else {
        throw new Error('Error while trying to save medic on the database!');
      }
  }
};

const specialtiesMapping = (specialties) => {
  const specialtyMap = {
    'general': 'General',
    'dentistry': 'Odontología',
    'accupuncture': 'Acupuntura',
    'dermatology': 'Dermatología',
    'nutrition': 'Nutrición',
    'cosmiatry': 'Cosmiatría',
    'surgery': 'Cirugía',
    'physiotherapy': 'Fisioterapia',
    'endodontics': 'Endodoncia',
    'orthodontics': 'Ortodoncia'
  };
  
  const mappedSpecialties = {};
  for (const key in specialties) {
    if (specialties.hasOwnProperty(key)) {
      mappedSpecialties[specialtyMap[key] || key] = specialties[key];
    }
  }

  return mappedSpecialties;
}

exports.read = async () => {
  try {
    const medics = await db.any(`
      SELECT * FROM medico
    `);

    const medicsWithMappedSpecialties = medics.map(medic => {
      return {
        ...medic,
        especialidad: specialtiesMapping(medic.especialidad),
      };
    });

    return medicsWithMappedSpecialties;
  } catch (error) {
    console.error('Error:', error)
    throw error;
  }
};

exports.readByID = async (medicID) => {
  try {
    const medic = await db.oneOrNone('SELECT * FROM medico WHERE cedula = $1', [medicID]);
    if (medic) {
      return medic;
    } else {
      throw new Error('Medic not found.');
    }
  } catch (error) {
    throw new Error('Error: ' + error.message);
  }
};

exports.update = async (medicData, trans = db) => {
  try {
    return await trans.tx(async t => {
      if (medicData.changedEmail) {
        await usersService.update(medicData.id_usuario, medicData.correo, t);
      }

      const query = `
        UPDATE medico SET
          primer_nombre = $1,
          segundo_nombre = $2,
          primer_apellido = $3,
          segundo_apellido = $4,
          fecha_nacimiento = $5,
          estado_civil = $6,
          direccion = $7,
          correo = $8,
          telefono_movil = $9,
          especialidad = $10,
          schedule = $11,
          shifts = $12
        WHERE cedula = $13
      `;
      const values = [
        medicData.primer_nombre,
        medicData.segundo_nombre,
        medicData.primer_apellido,
        medicData.segundo_apellido,
        medicData.fecha_nacimiento,
        medicData.estado_civil,
        medicData.direccion,
        medicData.correo,
        medicData.telefono_movil,
        medicData.especialidad,
        medicData.schedule,
        medicData.shifts,
        medicData.cedula
      ];
      await t.none(query, values);

      return { message: 'Medic successfully updated!' };
    });
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error while updating medic data.');
  }
};

exports.delete = async (userID) => {
  try {
    await db.none('DELETE FROM usuario WHERE id_usuario = $1', [userID]);
    return { message: 'Medic successfully deleted!' };
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error while trying to delete medic.');
  }
};