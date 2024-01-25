const citaQuerys = require('../querys/citaQuerys');  // 
const mail = require('../utils/mailer');

async function listarFechas(fecha) {
  try {
    const resultado = await citaQuerys.listarFechas(fecha);

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

    const resultado = await citaQuerys.guardarCitas(nuevaCita);

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

    const result = await citaQuerys.actualizarCita(nuevaCita)
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
    const resultado = await citaQuerys.eliminarCita(eliminar);
    return resultado;
  } catch (error) {

    console.error('Error al eliminar cita.', error);
    throw new Error(error);
  }
}

async function listarCitaDelDia(id_usuario) {
  try {
    const citas = await citaQuerys.listarCitaDelDia(id_usuario);
    return citas;
  } catch (error) {
    console.error('Error al listar las citas.', error);
  }
}

async function listarCitasDelPaciente(id_usuario) {
  try {
    const citas = await citaQuerys.listarCitasDelPaciente(id_usuario);
    return citas;
  } catch (error) {
    console.error('Error al listar las citas.', error);
  }
}

async function listarCitasDelDiaPaciente(id_usuario) {
  try {
    const citas = await citaQuerys.listarCitasDelDiaPaciente(id_usuario);
    return citas;
  } catch (error) {
    console.error('Error al listar las citas.', error);
  }
}

async function correoDeCitasPendientes() {
  try {
    const citas = await citaQuerys.listarCorreoCitasPendientes();
    if (citas) {
      mail.enviarMailPendientes(citas);
    }
  } catch (error) {
    console.error('Error al listar las citas.', error);
  }
}

async function listarCitasPorMedico(id_usuario) {
  try {
    const citas = await citaQuerys.listarCitasPorMedico(id_usuario);
    return citas;
  } catch (error) {
    console.error('Error al listar las citas.', error);
  }
}

// listarCitasPorMedicoDiaActual

async function listarCitasPorMedicoDiaActual(id_usuario) {
  try {
    const citas = await citaQuerys.listarCitasPorMedicoDiaActual(id_usuario);
    return citas;
  } catch (error) {
    console.error('Error al listar las citas.', error);
  }
}

// async function listarCitasPorCedulaPacienteOMedico(cedula) {
//   try {
//     console.log(cedula);
//     const citas = await citaQuerys.listarCitasPorCedulaPacienteOMedico(cedula);
//     return citas;
//   } catch (error) {
//     console.error('Error al listar las citas.', error);
//   }
// }

async function getAppointments() {
  try {
    // console.log(cedula);
    const citas = await citaQuerys.getAppointments();
    return citas;
  } catch (error) {
    console.error('Error al listar las citas.', error);
  }
}

module.exports = {
  listarFechas,
  guardarCitas,
  listarCitaDelDia,
  correoDeCitasPendientes,
  listarCitasPorMedico,
  listarCitasPorMedicoDiaActual,
  // listarCitasPorCedulaPacienteOMedico,
  getAppointments,
  listarCitasDelDiaPaciente,
  listarCitasDelPaciente,
  actualizarCita,
  eliminarCita
};