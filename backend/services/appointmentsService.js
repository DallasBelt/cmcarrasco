const appointmentsQuery = require('../queries/appointmentsQuery')
const mail = require('../utils/mailer')
const db = require('../db')

async function listAppointments() {
  try {
    const appointments = await db.any(`
      SELECT fecha_inicio AS fecha, cm.especialidad, cm.estado, EXTRACT(hour from fecha_inicio) AS hora_inicio, 
      EXTRACT(hour from fecha_fin) AS hora_fin, cm.observacion, p.primer_nombre, p.segundo_nombre, p.primer_apellido, p.segundo_apellido, cm.id_cita_medica,
      p.id_paciente, m.id_medico
      FROM usuario u 
      INNER JOIN medico m ON u.id_usuario = m.id_usuario 
      INNER JOIN cita_medica cm ON cm.id_medico = m.id_medico
      INNER JOIN paciente p ON p.id_paciente = cm.id_paciente
    `)

    if (!appointments) {
      throw new Error('No se encontraron citas médicas.')
    }

    return appointments
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error)
    throw new Error('Error al obtener las citas médicas.')
  }
}

async function listarFechas(fecha) {
  try {
    const resultado = await appointmentsQuery.listarFechas(fecha);

    return resultado;
  } catch (error) {

    console.error('Error al listar fechas:', error);
    throw new Error(error);
  }
}

async function guardarCitas(cita) {
  try {
    const nuevaCita = {
      especialidad: cita.especialidad,
      estado: cita.estado,
      fecha_fin: cita.fecha_fin,
      fecha_inicio: cita.fecha_inicio,
      observacion: cita.observacion,
      id_medico: cita.medico.id_medico,
      id_paciente: cita.paciente.id_paciente
    };

    const resultado = await appointmentsQuery.guardarCitas(nuevaCita);

    return resultado;
  } catch (error) {

    console.error('Error al guardar cita.', error);
    throw new Error(error);
  }
}

async function actualizarCita(cita) {
  try {
    const nuevaCita = {
      especialidad: cita.especialidad,
      estado: cita.estado,
      fecha_fin: cita.fecha_fin,
      fecha_inicio: cita.fecha_inicio,
      observacion: cita.observacion,
      id_medico: cita.medico.id_medico,
      id_paciente: cita.paciente.id_paciente,
      id_cita_medica: cita.id_cita_medica
    }

    const result = await appointmentsQuery.actualizarCita(nuevaCita)
    return result
  } catch (error) {
    console.error('Error al actualizar cita.', error)
    throw new Error(error)
  }
}

async function eliminarCita(cita) {
  try {
    const eliminar = {
      id_cita_medica: cita.id_cita_medica
    };
    const resultado = await appointmentsQuery.eliminarCita(eliminar);
    return resultado;
  } catch (error) {

    console.error('Error al eliminar cita.', error);
    throw new Error(error);
  }
}

async function listarCitaDelDia(id_usuario) {
  try {
    const citas = await appointmentsQuery.listarCitaDelDia(id_usuario);
    return citas;
  } catch (error) {
    console.error('Error al listar las citas.', error);
  }
}

async function listarCitasDelPaciente(id_usuario) {
  try {
    const citas = await appointmentsQuery.listarCitasDelPaciente(id_usuario);
    return citas;
  } catch (error) {
    console.error('Error al listar las citas.', error);
  }
}

async function listarCitasDelDiaPaciente(id_usuario) {
  try {
    const citas = await appointmentsQuery.listarCitasDelDiaPaciente(id_usuario);
    return citas;
  } catch (error) {
    console.error('Error al listar las citas.', error);
  }
}

async function correoDeCitasPendientes() {
  try {
    const citas = await appointmentsQuery.listarCorreoCitasPendientes();
    if (citas) {
      mail.enviarMailPendientes(citas);
    }
  } catch (error) {
    console.error('Error al listar las citas.', error);
  }
}

async function listarCitasPorMedico(id_usuario) {
  try {
    const citas = await appointmentsQuery.listarCitasPorMedico(id_usuario);
    return citas;
  } catch (error) {
    console.error('Error al listar las citas.', error);
  }
}

// listarCitasPorMedicoDiaActual

async function listarCitasPorMedicoDiaActual(id_usuario) {
  try {
    const citas = await appointmentsQuery.listarCitasPorMedicoDiaActual(id_usuario);
    return citas;
  } catch (error) {
    console.error('Error al listar las citas.', error);
  }
}

module.exports = {
  listAppointments,
  listarFechas,
  guardarCitas,
  listarCitaDelDia,
  correoDeCitasPendientes,
  listarCitasPorMedico,
  listarCitasPorMedicoDiaActual,
  listarCitasDelDiaPaciente,
  listarCitasDelPaciente,
  actualizarCita,
  eliminarCita
};