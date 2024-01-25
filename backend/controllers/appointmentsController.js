const appointmentsService = require('../services/appointmentsService');

async function listAppointments(req, res) {
  try {
    const citas = await appointmentsService.listAppointments(req.query)
    if (citas.error) {
      return res.status(citas.status).json(citas.error)
    }
    return res.status(200).json(citas.rows)
  } catch (error) {
    console.error(error)
    return res.status(500).json('Error interno del servidor')
  }
}

async function listarFechas(req, res) {
  try {
    console.log(`Selected date: ${req.body.apptDate}`);
    const citasDeldia = await appointmentsService.listarFechas(req.body.apptDate);
    if (citasDeldia.error) {
      return res.status(citasDeldia.status).json(citasDeldia.error);
    }
    return res.status(200).json(citasDeldia);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error interno del servidor');
  }
}

async function guardarCitas(req, res) {
  try {
    console.log("CITA INGRESADA:  " + req.body);
    const resultado = await appointmentsService.guardarCitas(req.body);
    if (resultado.error) {
      return res.status(resultado.status).json(resultado.error);
    }
    return res.status(200).json("Cita agendada correctamente.");
  } catch (error) {
    return res.status(500).json({ statusCodeValue: 500, error: error.message });
  }
}

async function actualizarCita(req, res) {
  try {
    const result = await appointmentsService.actualizarCita(req.body)
    if (result.error) {
      return res.status(result.status).json(result.error)
    }
    return res.status(200).json('Cita actualizada correctamente.')
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error interno del servidor')
  }
}

async function listarCitaDelDia(req, res) {
  try {
    const citasDeldia = await appointmentsService.listarCitaDelDia(req.body.id_usuario);
    console.log("ESTE ES EL ID: " +req.body.id_usuario);
    console.log(citasDeldia);
    if (citasDeldia.error) {
      return res.status(citasDeldia.status).json(citasDeldia.error);
    }
    return res.status(200).json(citasDeldia);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error interno del servidor');
  }
}

async function eliminarCita(req, res) {
  try {
    const cita = req.body
    const resultado = await appointmentsService.eliminarCita(cita)
    if (resultado.error) {
      return res.status(resultado.status).json(resultado.error)
    }
    return res.status(200).json("Cita eliminada correctamente.")
  } catch (error) {
    console.error(error)
    return res.status(500).json('Error interno del servidor')
  }
}

async function listarCitasDelPaciente(req, res) {
  try {
    const citas = await appointmentsService.listarCitasDelPaciente(req.body.id_usuario);
    console.log(citas);
    if (citas.error) {
      return res.status(citas.status).json(citas.error);
    }
    return res.status(200).json(citas);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error interno del servidor');
  }
}

async function listarCitasDelDiaPaciente(req, res) {
  try {
    const citasDeldia = await appointmentsService.listarCitasDelDiaPaciente(req.body.id_usuario);
    console.log(citasDeldia);
    if (citasDeldia.error) {
      return res.status(citasDeldia.status).json(citasDeldia.error);
    }
    return res.status(200).json(citasDeldia);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error interno del servidor');
  }
}

async function listarCitasPorMedico(req, res) {
  try {
    const citas = await appointmentsService.listarCitasPorMedico(req.body.id_usuario);
    console.log(citas);
    if (citas.error) {
      return res.status(citas.status).json(citas.error);
    }
    return res.status(200).json(citas);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error interno del servidor');
  }
}

async function listarCitasPorMedicoDiaActual(req, res) {
  try {
    const citas = await appointmentsService.listarCitasPorMedicoDiaActual(req.body.id_usuario);
    console.log(citas);
    if (citas.error) {
      return res.status(citas.status).json(citas.error);
    }
    return res.status(200).json(citas);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error interno del servidor');
  }
}

module.exports = {
  listAppointments,
  listarFechas,
  guardarCitas,
  listarCitaDelDia,
  listarCitasPorMedico,
  listarCitasPorMedicoDiaActual,
  listarCitasDelDiaPaciente,
  listarCitasDelPaciente,
  actualizarCita,
  eliminarCita
};
