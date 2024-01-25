const pacienteService = require('../services/patientsService');

async function savePatient(req, res) {
  try {
    const patientData = req.body
    const result = await pacienteService.savePatient(patientData)
    if (result.error) {
      return res.status(result.status).json(result.message)
    }
    res.status(200).json({ statusCodeValue: 200, body: 'Paciente registrado con éxito' })
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ statusCodeValue: 400, error: 'La cédula o correo ya está registrado.' })
    } else {
      res.status(500).json({ statusCodeValue: 500, error: 'Error interno del servidor' })
    }
  }
}

async function actualizarPaciente(req, res) {
  try {
    // Obtiene los datos del paciente del cuerpo de la solicitud
    const datosPaciente = req.body;

    // Llama al servicio para guardar el paciente en la base de datos
    const resultado = await pacienteService.actualizarPaciente(datosPaciente);

    // Verifica si se produjo un error al guardar el paciente
    if (resultado.error) {
      return res.status(resultado.status).json(resultado.message);
    }

    // Si se guardó correctamente, devuelve una respuesta exitosa
    return res.status(200).json('Paciente actualizado correctamente.');
  } catch (error) {
    console.log(error);
    return res.status(500).json({ statusCodeValue: 500, error: error.message });
  }
}

async function listarPaciente(req, res) {
  try {
    const resultado = await pacienteService.listarPaciente();

    // Verifica si se produjo un error al guardar el paciente
    if (resultado.error) {
      return res.status(resultado.status).json(resultado.message);
    }

    // Si se guardó correctamente, devuelve una respuesta exitosa
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ statusCodeValue: 500, error: error.message });
  }
}

async function verifyID(req, res) {
  try {
    const { patientID } = req.body
    const isRegistered = await pacienteService.verifyID(patientID)
    res.status(200).json({ registeredID: isRegistered, message: isRegistered ? 'La identificación ya está registrada.' : 'La identificación no está registrada.' })
  } catch (error) {
    console.error('Error al verificar la identificación del paciente:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

async function verifyEmail(req, res) {
  try {
    const { patientEmail } = req.body
    const isRegistered = await pacienteService.verifyEmail(patientEmail)
    res.status(200).json({ registeredEmail: isRegistered, message: isRegistered ? 'El correo ya está registrado.' : 'El correo no está registrado.' })
  } catch (error) {
    console.error('Error al verificar la identificación del paciente:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

module.exports = {
  savePatient,
  listarPaciente,
  actualizarPaciente,
  verifyID,
  verifyEmail
};
