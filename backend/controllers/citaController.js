const citaService = require('../services/citaService');

async function listarFechas(req, res) {
  try {
    console.log(`Selected date: ${req.body.apptDate}`);
    const citasDeldia = await citaService.listarFechas(req.body.apptDate);
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
    const resultado = await citaService.guardarCitas(req.body);
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
    const result = await citaService.actualizarCita(req.body)
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
    const citasDeldia = await citaService.listarCitaDelDia(req.body.id_usuario);
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
    const resultado = await citaService.eliminarCita(cita)
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
    const citas = await citaService.listarCitasDelPaciente(req.body.id_usuario);
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
    const citasDeldia = await citaService.listarCitasDelDiaPaciente(req.body.id_usuario);
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
    const citas = await citaService.listarCitasPorMedico(req.body.id_usuario);
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
    const citas = await citaService.listarCitasPorMedicoDiaActual(req.body.id_usuario);
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

// async function listarCitasPorCedulaPacienteOMedico(req, res) {
//   try {
//     const citas = await citaService.listarCitasPorCedulaPacienteOMedico(req.body);
//     if (citas.error) {
//       return res.status(citas.status).json(citas.error);
//     }
//     return res.status(200).json(citas.rows);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json('Error interno del servidor');
//   }
// }

async function getAppointments(req, res) {
  try {
    const citas = await citaService.getAppointments(req.query);
    if (citas.error) {
      return res.status(citas.status).json(citas.error);
    }
    return res.status(200).json(citas.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error interno del servidor');
  }
}

module.exports = {
  listarFechas,
  guardarCitas,
  listarCitaDelDia,
  listarCitasPorMedico,
  listarCitasPorMedicoDiaActual,
  // listarCitasPorCedulaPacienteOMedico,
  getAppointments,
  listarCitasDelDiaPaciente,
  listarCitasDelPaciente,
  actualizarCita,
  eliminarCita
};
