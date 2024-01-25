const pool = require('../db');

async function listarFechas(fecha) {
  try {
    const consulta = `
      SELECT TO_CHAR(fecha_inicio, 'YYYY-MM-DD HH24:MI:SS') as fecha 
      FROM cita_medica
      WHERE DATE_TRUNC('day', fecha_inicio) = TO_TIMESTAMP($1, 'YYYY-MM-DD HH24:MI:SS.US')
    `;

    const result = await pool.query(consulta, [fecha]);

    // formatear las fechas
    const fechas = result.rows.map(row => row.fecha);

    return fechas;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
}

async function guardarCitas(cita) {
  try {
    const consulta = `
      INSERT INTO cita_medica(
            especialidad, estado, fecha_fin, fecha_inicio, observacion, id_medico, id_paciente)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
    `
    const values = [
      cita.especialidad,
      cita.estado,
      cita.fecha_fin,
      cita.fecha_inicio,
      cita.observacion,
      cita.id_medico,
      cita.id_paciente
    ];

    const result = await pool.query(consulta, values);
    return result;

  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
}

async function cambiarEstado(idCita) {
  try {
    const consulta = `UPDATE cita_medica SET estado = $1 WHERE id_cita_medica = $2`;

    const values = ['Atendida', idCita];

    const result = await pool.query(consulta, values);

    return result;

  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
}

async function actualizarCita(cita) {
  try {
    const query = `
      UPDATE cita_medica
      SET especialidad = $1, 
      estado = $2, 
      fecha_fin = $3, 
      fecha_inicio = $4, 
      observacion = $5, 
      id_medico = $6, 
      id_paciente = $7
      WHERE id_cita_medica= $8
    `
    const values = [
      cita.especialidad,
      cita.estado,
      cita.fecha_fin,
      cita.fecha_inicio,
      cita.observacion,
      cita.id_medico,
      cita.id_paciente,
      cita.id_cita_medica
    ]

    const result = await pool.query(query, values)
    return result

  } catch (error) {
    console.error(`Error al ejecutar la consulta: ${error}`)
    throw error
  }
}

async function eliminarCita(cita) {
  try {
    const query = `
      DELETE FROM cita_medica
      WHERE id_cita_medica = $1
    `;

    const values = [
      cita.id_cita_medica
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al consultar la base de datos:', error)
    throw error;
  }
}

async function listarCitaDelDia(medico_id_usuario) {
  try {
    const consulta = `
        select current_date as fecha,  cm.especialidad, cm.estado, extract(hour from  fecha_inicio) as hora_inicio , 
        extract(hour from  fecha_fin) as hora_fin,  cm.observacion, p.primer_nombre, p.primer_apellido, cm.id_cita_medica
        from usuario u 
        inner join medico m ON u.id_usuario = m.id_usuario 
        inner join cita_medica cm ON cm.id_medico = m.id_medico
        inner join paciente p on p.id_paciente = cm.id_paciente 
        where u.id_usuario = $1
        AND DATE(fecha_inicio) = current_date
        AND estado = 'Agendada'
        `;

    const values = [medico_id_usuario]
    const citas = await pool.query(consulta, values);

    return citas.rows;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
}

async function listarCitasDelDiaPaciente(id_usuario) {
  try {
    const consulta = `
        select current_date as fecha, cm.fecha_inicio , cm.especialidad, cm.estado, p.id_usuario,
        cm.observacion, p.primer_nombre, p.primer_apellido, cm.id_cita_medica
               from usuario u 
               inner join medico m ON u.id_usuario = m.id_usuario 
               inner join cita_medica cm ON cm.id_medico = m.id_medico
               inner join paciente p on p.id_paciente = cm.id_paciente 
               where DATE(fecha_inicio) = CURRENT_DATE and p.id_usuario = $1
        `;

    const values = [id_usuario]
    const citas = await pool.query(consulta, values);

    return citas.rows;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
}

async function listarCitasDelPaciente(id_usuario) {
  try {
    const consulta = `
       
        SELECT DATE(FECHA_INICIO) AS FECHA,	EXTRACT(HOUR FROM FECHA_INICIO) AS HORA_INICIO,	
        EXTRACT(HOUR FROM FECHA_FIN) AS HORA_FIN,
        M.PRIMER_NOMBRE,M.PRIMER_APELLIDO,CM.ESPECIALIDAD,CM.OBSERVACION, CM.ID_CITA_MEDICA
        FROM USUARIO U
        INNER JOIN MEDICO M ON U.ID_USUARIO = M.ID_USUARIO
        INNER JOIN CITA_MEDICA CM ON CM.ID_MEDICO = M.ID_MEDICO
        INNER JOIN PACIENTE P ON P.ID_PACIENTE = CM.ID_PACIENTE
        WHERE P.ID_USUARIO = $1
        ORDER BY fecha DESC 
        `;

    const values = [id_usuario]
    const citas = await pool.query(consulta, values);

    return citas.rows;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
}

//función para obtener los usuarios a los que se debe enviar correo de notificacion
async function listarCorreoCitasPendientes() {
  try {
    const consulta = `
        SELECT p.primer_nombre as p_primer_nombre, p.primer_apellido as p_primer_apellido, p.correo, 
        m.primer_nombre as m_primer_nombre, m.primer_apellido as m_primer_apellido, cm.fecha_inicio, cm.especialidad
        FROM cita_medica cm
        INNER JOIN paciente p
        ON p.id_paciente = cm.id_paciente
        INNER JOIN medico m
        ON m.id_medico = cm.id_medico
        WHERE EXTRACT(EPOCH FROM (NOW() - cm.fecha_inicio)) <= 1800;        
        `;

    const result = await pool.query(consulta);

    // const fechas = result.rows.map(row => row.fecha);
    console.log(result.rows);

    return result;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
}

async function listarCitasPorMedico(id_usuario) {
  try {
    const consulta = `
        select fecha_inicio as fecha,  cm.especialidad, cm.estado, extract(hour from  fecha_inicio) as hora_inicio , 
        extract(hour from  fecha_fin) as hora_fin,  cm.observacion, p.primer_nombre, p.primer_apellido, cm.id_cita_medica
        from usuario u 
        inner join medico m ON u.id_usuario = m.id_usuario 
        inner join cita_medica cm ON cm.id_medico = m.id_medico
        inner join paciente p on p.id_paciente = cm.id_paciente 
        where u.id_usuario = $1
        `;

    const values = [id_usuario]
    const citas = await pool.query(consulta, values);

    return citas.rows;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
}

async function listarCitasPorMedicoDiaActual(id_usuario) {
  try {
    const consulta = `
        select current_date as fecha,  cm.especialidad, cm.estado, extract(hour from  fecha_inicio) as hora_inicio , 
        extract(hour from  fecha_fin) as hora_fin,  cm.observacion, p.primer_nombre, p.primer_apellido, cm.id_cita_medica
        from usuario u 
        inner join medico m ON u.id_usuario = m.id_usuario 
        inner join cita_medica cm ON cm.id_medico = m.id_medico
        inner join paciente p on p.id_paciente = cm.id_paciente 
        where u.id_usuario = $1
        AND DATE(fecha_inicio) = current_date and cm.estado = 'Agendada'
        `;

    const values = [id_usuario]
    const citas = await pool.query(consulta, values);

    return citas.rows;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
}

// async function listarCitasPorCedulaPacienteOMedico(cedula) {
//   try {
//     const consulta = `
//         select fecha_inicio as fecha,  cm.especialidad, cm.estado, extract(hour from  fecha_inicio) as hora_inicio, 
//         extract(hour from  fecha_fin) as hora_fin,  cm.observacion, p.primer_nombre, p.primer_apellido, cm.id_cita_medica,
// 		p.id_paciente, m.id_medico
//         from usuario u 
//         inner join medico m ON u.id_usuario = m.id_usuario 
//         inner join cita_medica cm ON cm.id_medico = m.id_medico
//         inner join paciente p on p.id_paciente = cm.id_paciente 
//         where p.cedula = $1 OR m.cedula= $2        
//         `;

//     const values = [
//       cedula.cedula_paciente,
//       cedula.cedula_medico
//     ]
//     const result = await pool.query(consulta, values);

//     console.log(result.rows);

//     return result;
//   } catch (error) {
//     console.error('Error al ejecutar la consulta:', error);
//     throw error;
//   }
// }

// Get the appointments from the Appointments table of the database
async function getAppointments() {
  try {
    const consulta = `
        select fecha_inicio as fecha, cm.especialidad, cm.estado, extract(hour from fecha_inicio) as hora_inicio, 
        extract(hour from fecha_fin) as hora_fin, cm.observacion, p.primer_nombre, p.segundo_nombre, p.primer_apellido, p.segundo_apellido, cm.id_cita_medica,
        p.id_paciente, m.id_medico
        from usuario u 
        inner join medico m ON u.id_usuario = m.id_usuario 
        inner join cita_medica cm ON cm.id_medico = m.id_medico
        inner join paciente p on p.id_paciente = cm.id_paciente
        `;

    const result = await pool.query(consulta);

    console.log(result.rows);

    return result;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
}

module.exports = {
  listarFechas,
  guardarCitas,
  listarCitaDelDia,
  listarCorreoCitasPendientes,
  listarCitasPorMedico,
  listarCitasPorMedicoDiaActual,
  // listarCitasPorCedulaPacienteOMedico,
  getAppointments,
  listarCitasDelDiaPaciente,
  listarCitasDelPaciente,
  actualizarCita,
  eliminarCita,
  cambiarEstado
};