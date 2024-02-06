const patientsService = require('../services/patientsService')

exports.read = async (_, res) => {
  try {
    const result = await patientsService.read()
    if (result.error) {
      return res.status(result.status).json(result.message);
    }
    return res.status(200).json(result);
  } catch (error) {
      return res.status(500).json({ statusCodeValue: 500, error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const patientData = req.body
    const result = await patientsService.create(patientData)
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
};
