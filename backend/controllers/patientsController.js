const { validationResult } = require('express-validator');
const patientsService = require('../services/patientsService')

async function listPatients(req, res) {
  try {
    const result = await patientsService.listPatients()
    if (result.error) {
      return res.status(result.status).json(result.message)
    }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ statusCodeValue: 500, error: error.message })
  }
}

async function getPatientByID(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('Errores de validación:', errors.array())
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { cedula: patientID } = req.body

    const patientData = await patientsService.getPatientByID(patientID)

    if (patientData) {
      return res.status(200).json(patientData);
    } else {
      return res.status(404).json({ message: 'Paciente no encontrado' })
    }
  } catch (error) {
    console.error('Error al obtener datos del paciente por ID:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

async function updatePatient(req, res) {
  try {
    console.log('updatePatient called')
      const patientData = req.body;
      console.log(patientData)
      const updatedPatient = await patientsService.updatePatient(patientData);

      if (updatedPatient) {
          res.status(200).json({ message: 'Paciente actualizado con éxito', patient: updatedPatient });
      } else {
          res.status(404).json({ message: 'Paciente no encontrado' });
      }
  } catch (error) {
      console.error('Error al actualizar el paciente:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
}


async function savePatient(req, res) {
  try {
    const patientData = req.body
    const result = await patientsService.savePatient(patientData)
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

async function verifyID(req, res) {
  try {
    const { cedula: patientID } = req.body
    const isRegistered = await patientsService.verifyID(patientID)
    res.status(200).json({ registeredID: isRegistered, message: isRegistered ? 'La identificación ya está registrada.' : 'La identificación no está registrada.' })
  } catch (error) {
    console.error('Error al verificar la identificación del paciente:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

async function verifyEmail(req, res) {
  try {
    const { email: patientEmail } = req.body
    const isRegistered = await patientsService.verifyEmail(patientEmail)
    res.status(200).json({ registeredEmail: isRegistered, message: isRegistered ? 'El correo ya está registrado.' : 'El correo no está registrado.' })
  } catch (error) {
    console.error('Error al verificar la identificación del paciente:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

module.exports = {
  listPatients,
  getPatientByID,
  updatePatient,
  savePatient,
  verifyID,
  verifyEmail
};
